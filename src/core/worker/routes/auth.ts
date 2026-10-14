// src/core/worker/routes/auth.ts

import type { Context, Next } from 'hono'
import { createAuth } from '../../auth'
import type { WorkerEnv } from '../types'

export function handleAuthRequest(context: Context<WorkerEnv>) {
  const auth = createAuth(context.env)
  return auth.handler(context.req.raw)
}

export async function attachSessionToContext(
  context: Context<WorkerEnv>,
  next: Next
): Promise<void> {
  const auth = createAuth(context.env)
  const currentSession = await auth.api.getSession({ headers: context.req.raw.headers })
  context.set('user', currentSession?.user ?? null)
  await next()
}