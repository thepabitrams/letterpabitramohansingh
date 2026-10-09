/* src/core/worker.ts */
import { Hono } from 'hono'
import type { Bindings } from './db/client'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/api/health', (c) => c.json({ ok: true, time: Date.now() }))

app.get('/api/letters/:sender/:slug', (c) => {
  const { sender, slug } = c.req.param()
  return c.json({
    id: 'demo',
    senderUsername: sender,
    recipientSlug: slug,
    message: 'Demo letter — backend is live!',
    preset: 'love',
    status: 'pending',
    expiryDays: 7,
  })
})

export default {
  fetch: app.fetch,
}