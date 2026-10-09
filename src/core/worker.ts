/* src/core/worker.ts */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { eq, sql } from 'drizzle-orm'
import { createAuth } from './auth'
import { getDb, type Bindings } from './db/client'
import { letters } from './db/schema'

type Variables = {
  user: { id: string; email: string; name: string; image?: string } | null
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('*', cors({
  origin: ['http://localhost:5173', 'https://letter.pabitramohansingh.workers.dev'],
  credentials: true,
}))

app.all('/api/auth/*', (c) => {
  const auth = createAuth(c.env)
  return auth.handler(c.req.raw)
})

app.use('/api/*', async (c, next) => {
  const auth = createAuth(c.env)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.set('user', session?.user ?? null)
  await next()
})

app.get('/api/health', (c) => c.json({ ok: true, time: Date.now() }))

app.get('/api/me', (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  return c.json(user)
})

app.post('/api/letters', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.json()
  const { senderName, recipientName, message, header, pattern, config, expiryDays } = body

  if (!senderName || !recipientName || !message) {
    return c.json({ error: 'Missing fields' }, 400)
  }

  if (expiryDays !== 7 && expiryDays !== 15) {
    return c.json({ error: 'expiryDays must be 7 or 15' }, 400)
  }

  const db = getDb(c.env)
  const now = Date.now()

  const senderSlug = senderName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const recipientSlug = recipientName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const slug = `${senderSlug}-${recipientSlug}`

  const existing = await db.select().from(letters).where(eq(letters.slug, slug)).get()
  if (existing) {
    return c.json({ error: 'This letter already exists', slug }, 409)
  }

  const id = crypto.randomUUID()
  const expiresAt = now + expiryDays * 86400000

  await db.insert(letters).values({
    id,
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

  return c.json({
    id,
    url: `/${senderSlug}/${recipientSlug}`,
    slug,
  })
})

app.get('/api/letters/:sender/:recipient', async (c) => {
  const sender = c.req.param('sender')
  const recipient = c.req.param('recipient')
  const slug = `${sender}-${recipient}`

  const db = getDb(c.env)
  const now = Date.now()

  const letter = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letter) return c.json({ error: 'Not found' }, 404)
  if (letter.expiresAt < now) return c.json({ error: 'Expired' }, 410)

  if (letter.status === 'pending') {
    await db.update(letters)
      .set({ status: 'opened', openedAt: now })
      .where(eq(letters.id, letter.id))
    letter.status = 'opened'
    letter.openedAt = now
  }

  return c.json({
    ...letter,
    config: JSON.parse(letter.config),
  })
})

app.post('/api/letters/:sender/:recipient/reply', async (c) => {
  const sender = c.req.param('sender')
  const recipient = c.req.param('recipient')
  const slug = `${sender}-${recipient}`

  const body = await c.req.json()
  const { reply } = body

  if (!reply) return c.json({ error: 'Reply required' }, 400)

  const db = getDb(c.env)
  const letter = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letter) return c.json({ error: 'Not found' }, 404)
  if (letter.status === 'replied') return c.json({ error: 'Already replied' }, 409)

  const now = Date.now()
  await db.update(letters)
    .set({
      status: 'replied',
      reply,
      repliedAt: now,
    })
    .where(eq(letters.id, letter.id))

  return c.json({ ok: true })
})

app.patch('/api/letters/:sender/:recipient/note', async (c) => {
  const sender = c.req.param('sender')
  const recipient = c.req.param('recipient')
  const slug = `${sender}-${recipient}`

  const body = await c.req.json()
  const { note } = body

  const db = getDb(c.env)
  const letter = await db.select().from(letters).where(eq(letters.slug, slug)).get()

  if (!letter) return c.json({ error: 'Not found' }, 404)

  await db.update(letters)
    .set({ replyNote: note ?? null })
    .where(eq(letters.id, letter.id))

  return c.json({ ok: true })
})

app.get('/api/my-letters', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  const db = getDb(c.env)
  const rows = await db.select().from(letters).where(eq(letters.userId, user.id)).all()

  return c.json(rows.map((r) => ({
    ...r,
    config: JSON.parse(r.config),
  })))
})

async function runCleanup(env: Bindings) {
  const db = getDb(env)
  const now = Date.now()
  await db.delete(letters).where(sql`${letters.expiresAt} < ${now}`)
}

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(runCleanup(env))
  },
}