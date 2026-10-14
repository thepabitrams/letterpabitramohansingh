// src/core/worker/routes/user.ts

import { Hono } from 'hono'
import type { WorkerEnv } from '../types'

export const userRoutes = new Hono<WorkerEnv>()

userRoutes.get('/health', (context) => context.json({ ok: true, time: Date.now() }))

userRoutes.get('/me', (context) => {
  const currentUser = context.get('user')
  if (!currentUser) return context.json({ error: 'Unauthorized' }, 401)
  return context.json(currentUser)
})