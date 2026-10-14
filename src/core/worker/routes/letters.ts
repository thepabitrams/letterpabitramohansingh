// src/core/worker/routes/letters.ts

import { Hono } from 'hono'
import { count, eq } from 'drizzle-orm'
import { getDb } from '../../../db/client'
import { letters, user } from '../../../db/schema'
import type { WorkerEnv } from '../types'
import {
  FULL_LETTER_LIFE_MS,
  HALF_LETTER_LIFE_MS,
  QUARTER_LETTER_LIFE_MS,
  USER_COUNT_THRESHOLD,
  LETTER_COUNT_THRESHOLD,
} from '../constants'
import { runStoragePressureCleanup } from '../cleanup'

export const lettersRoutes = new Hono<WorkerEnv>()

function buildSlugPart(value: string): string {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function buildSlug(senderName: string, recipientName: string): string {
  return `${buildSlugPart(senderName)}-${buildSlugPart(recipientName)}`
}

lettersRoutes.get('/letters/slug-status', async (context) => {
  const senderName = context.req.query('sender')
  const recipientName = context.req.query('recipient')

  if (!senderName || !recipientName) {
    return context.json({ available: true })
  }

  const slug = buildSlug(senderName, recipientName)
  const db = getDb(context.env)
  const now = Date.now()

  const existingLetter = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!existingLetter || existingLetter.expiresAt < now) {
    return context.json({ available: true })
  }

  return context.json({
    available: false,
    existingExpiresAt: existingLetter.expiresAt,
  })
})

lettersRoutes.post('/letters', async (context) => {
  const currentUser = context.get('user')
  if (!currentUser) return context.json({ error: 'Unauthorized' }, 401)

  const requestBody = await context.req.json()
  const { senderName, recipientName, message, header, pattern, config } = requestBody

  if (!senderName || !recipientName || !message) {
    return context.json({ error: 'Missing fields' }, 400)
  }

  const db = getDb(context.env)
  const now = Date.now()

  const slug = buildSlug(senderName, recipientName)

  const existingLetter = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (existingLetter && existingLetter.expiresAt >= now) {
    return context.json(
      {
        error: 'This letter name is already taken',
        slug,
        existingExpiresAt: existingLetter.expiresAt,
      },
      409
    )
  }

  if (existingLetter) {
    await db.delete(letters).where(eq(letters.id, existingLetter.id))
  }

  const letterId = crypto.randomUUID()
  const expiresAt = now + FULL_LETTER_LIFE_MS

  await db.insert(letters).values({
    id: letterId,
    userId: currentUser.id,
    slug,
    senderName,
    recipientName,
    message,
    header: header ?? null,
    pattern: pattern ?? 'two-choice',
    config: typeof config === 'string' ? config : JSON.stringify(config),
    createdAt: now,
    expiresAt,
  })

  const userCountResult = await db.select({ value: count() }).from(user)
  const letterCountResult = await db.select({ value: count() }).from(letters)
  const userCount = userCountResult[0]?.value ?? 0
  const letterCount = letterCountResult[0]?.value ?? 0

  if (userCount >= USER_COUNT_THRESHOLD || letterCount >= LETTER_COUNT_THRESHOLD) {
    await runStoragePressureCleanup(context.env)
  }

  return context.json({
    id: letterId,
    url: `/${buildSlugPart(senderName)}/${buildSlugPart(recipientName)}`,
    slug,
  })
})

lettersRoutes.get('/letters/:sender/:recipient', async (context) => {
  const senderSlug = context.req.param('sender')
  const recipientSlug = context.req.param('recipient')
  const slug = `${senderSlug}-${recipientSlug}`

  const db = getDb(context.env)
  const now = Date.now()

  const letterRecord = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letterRecord) return context.json({ error: 'Not found' }, 404)
  if (letterRecord.expiresAt < now) return context.json({ error: 'Expired' }, 410)

  if (letterRecord.status === 'pending') {
    const shortenedExpiresAt = letterRecord.createdAt + HALF_LETTER_LIFE_MS

    await db
      .update(letters)
      .set({ status: 'opened', openedAt: now, expiresAt: shortenedExpiresAt })
      .where(eq(letters.id, letterRecord.id))

    letterRecord.status = 'opened'
    letterRecord.openedAt = now
    letterRecord.expiresAt = shortenedExpiresAt
  }

  return context.json({
    ...letterRecord,
    config: JSON.parse(letterRecord.config),
  })
})

lettersRoutes.post('/letters/:sender/:recipient/reply', async (context) => {
  const senderSlug = context.req.param('sender')
  const recipientSlug = context.req.param('recipient')
  const slug = `${senderSlug}-${recipientSlug}`

  const requestBody = await context.req.json()
  const { reply } = requestBody

  if (!reply) return context.json({ error: 'Reply required' }, 400)

  const db = getDb(context.env)
  const letterRecord = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letterRecord) return context.json({ error: 'Not found' }, 404)
  if (letterRecord.status === 'replied') {
    return context.json({ error: 'Already replied' }, 409)
  }

  const now = Date.now()
  const shortenedExpiresAt = letterRecord.createdAt + QUARTER_LETTER_LIFE_MS

  await db
    .update(letters)
    .set({
      status: 'replied',
      reply,
      repliedAt: now,
      expiresAt: shortenedExpiresAt,
    })
    .where(eq(letters.id, letterRecord.id))

  return context.json({ ok: true })
})

lettersRoutes.patch('/letters/:sender/:recipient/note', async (context) => {
  const senderSlug = context.req.param('sender')
  const recipientSlug = context.req.param('recipient')
  const slug = `${senderSlug}-${recipientSlug}`

  const requestBody = await context.req.json()
  const { note } = requestBody

  const db = getDb(context.env)
  const letterRecord = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letterRecord) return context.json({ error: 'Not found' }, 404)

  const now = Date.now()
  const updateData: Record<string, unknown> = {
    replyNote: note ?? '',
    expiresAt: letterRecord.createdAt + QUARTER_LETTER_LIFE_MS,
  }

  if (letterRecord.status !== 'replied') {
    updateData.status = 'replied'
    updateData.repliedAt = now
  }

  await db.update(letters).set(updateData).where(eq(letters.id, letterRecord.id))

  return context.json({ ok: true })
})

lettersRoutes.get('/my-letters', async (context) => {
  const currentUser = context.get('user')
  if (!currentUser) return context.json({ error: 'Unauthorized' }, 401)

  const db = getDb(context.env)
  const letterRows = await db
    .select()
    .from(letters)
    .where(eq(letters.userId, currentUser.id))
    .all()

  return context.json(
    letterRows.map((letterRow) => ({
      ...letterRow,
      config: JSON.parse(letterRow.config),
    }))
  )
})