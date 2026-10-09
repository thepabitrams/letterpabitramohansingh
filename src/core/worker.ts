/* src/core/worker.ts */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { eq, sql } from 'drizzle-orm'
import { createAuth } from './auth'
import { getDb, type Bindings } from './db/client'
import { letters } from './db/schema'

type AppVariables = {
  user: { id: string; email: string; name: string; image?: string | null } | null
}

const app = new Hono<{ Bindings: Bindings; Variables: AppVariables }>()

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://letter.pabitramohansingh.workers.dev'],
    credentials: true,
  })
)

app.use('/api/*', async (context, next) => {
  await next()
  context.res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  context.res.headers.set('Pragma', 'no-cache')
  context.res.headers.set('Expires', '0')
  context.res.headers.set('CDN-Cache-Control', 'no-store')
  context.res.headers.set('Cloudflare-CDN-Cache-Control', 'no-store')
})

app.all('/api/auth/*', (context) => {
  const auth = createAuth(context.env)
  return auth.handler(context.req.raw)
})

app.use('/api/*', async (context, next) => {
  const auth = createAuth(context.env)
  const session = await auth.api.getSession({ headers: context.req.raw.headers })
  context.set('user', session?.user ?? null)
  await next()
})

app.get('/api/health', (context) => context.json({ ok: true, time: Date.now() }))

app.get('/api/me', (context) => {
  const user = context.get('user')
  if (!user) return context.json({ error: 'Unauthorized' }, 401)
  return context.json(user)
})

app.post('/api/letters', async (context) => {
  const user = context.get('user')
  if (!user) return context.json({ error: 'Unauthorized' }, 401)

  const requestBody = await context.req.json()
  const { senderName, recipientName, message, header, pattern, config, expiryDays } = requestBody

  if (!senderName || !recipientName || !message) {
    return context.json({ error: 'Missing fields' }, 400)
  }

  if (expiryDays !== 7 && expiryDays !== 15) {
    return context.json({ error: 'expiryDays must be 7 or 15' }, 400)
  }

  const db = getDb(context.env)
  const now = Date.now()

  const senderSlug = senderName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const recipientSlug = recipientName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const slug = `${senderSlug}-${recipientSlug}`

  const existingLetter = await db.select().from(letters).where(eq(letters.slug, slug)).get()
  if (existingLetter) {
    return context.json({ error: 'This letter already exists', slug }, 409)
  }

  const letterId = crypto.randomUUID()
  const expiresAt = now + expiryDays * 86_400_000

  await db.insert(letters).values({
    id: letterId,
    userId: user.id,
    slug,
    senderName,
    recipientName,
    message,
    header: header ?? null,
    pattern: pattern ?? 'two-choice',
    config: typeof config === 'string' ? config : JSON.stringify(config),
    expiryDays,
    createdAt: now,
    expiresAt,
  })

  return context.json({
    id: letterId,
    url: `/${senderSlug}/${recipientSlug}`,
    slug,
  })
})

app.get('/api/letters/:sender/:recipient', async (context) => {
  const senderSlug = context.req.param('sender')
  const recipientSlug = context.req.param('recipient')
  const slug = `${senderSlug}-${recipientSlug}`

  const db = getDb(context.env)
  const now = Date.now()

  const letterRecord = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letterRecord) return context.json({ error: 'Not found' }, 404)
  if (letterRecord.expiresAt < now) return context.json({ error: 'Expired' }, 410)

  if (letterRecord.status === 'pending') {
    await db
      .update(letters)
      .set({ status: 'opened', openedAt: now })
      .where(eq(letters.id, letterRecord.id))

    letterRecord.status = 'opened'
    letterRecord.openedAt = now
  }

  return context.json({
    ...letterRecord,
    config: JSON.parse(letterRecord.config),
  })
})

app.post('/api/letters/:sender/:recipient/reply', async (context) => {
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
  await db
    .update(letters)
    .set({
      status: 'replied',
      reply,
      repliedAt: now,
    })
    .where(eq(letters.id, letterRecord.id))

  return context.json({ ok: true })
})

app.patch('/api/letters/:sender/:recipient/note', async (context) => {
  const senderSlug = context.req.param('sender')
  const recipientSlug = context.req.param('recipient')
  const slug = `${senderSlug}-${recipientSlug}`

  const requestBody = await context.req.json()
  const { note } = requestBody

  const db = getDb(context.env)
  const letterRecord = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letterRecord) return context.json({ error: 'Not found' }, 404)

  const updateData: any = { replyNote: note ?? '' }

  if (letterRecord.status !== 'replied') {
    updateData.status = 'replied'
    updateData.repliedAt = Date.now()
  }

  await db
    .update(letters)
    .set(updateData)
    .where(eq(letters.id, letterRecord.id))

  return context.json({ ok: true })
})

app.get('/api/my-letters', async (context) => {
  const user = context.get('user')
  if (!user) return context.json({ error: 'Unauthorized' }, 401)

  const db = getDb(context.env)
  const letterRows = await db.select().from(letters).where(eq(letters.userId, user.id)).all()

  return context.json(
    letterRows.map((letterRow) => ({
      ...letterRow,
      config: JSON.parse(letterRow.config),
    }))
  )
})

async function runCleanup(environment: Bindings) {
  const db = getDb(environment)
  const now = Date.now()
  await db.delete(letters).where(sql`${letters.expiresAt} < ${now}`)
}

export default {
  fetch: app.fetch,
  async scheduled(_event: any, environment: Bindings, executionContext: any) {
    executionContext.waitUntil(runCleanup(environment))
  },
}