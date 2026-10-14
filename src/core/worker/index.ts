// src/core/worker/index.ts

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from '../../db/client'
import type { WorkerEnv } from './types'
import { ALLOWED_ORIGINS } from './constants'
import { runNormalCleanup, runStoragePressureCleanup } from './cleanup'
import { handleAuthRequest, attachSessionToContext } from './routes/auth'
import { userRoutes } from './routes/user'
import { lettersRoutes } from './routes/letters'

const app = new Hono<WorkerEnv>()

app.use('*', cors({ origin: [...ALLOWED_ORIGINS], credentials: true }))

app.use('/api/*', async (context, next) => {
  await next()
  context.res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  context.res.headers.set('Pragma', 'no-cache')
  context.res.headers.set('Expires', '0')
  context.res.headers.set('CDN-Cache-Control', 'no-store')
  context.res.headers.set('Cloudflare-CDN-Cache-Control', 'no-store')
})

app.all('/api/auth/*', handleAuthRequest)

app.use('/api/*', attachSessionToContext)

app.route('/api', userRoutes)
app.route('/api', lettersRoutes)

export default {
  fetch: app.fetch,
  async scheduled(
    _event: unknown,
    environment: Bindings,
    executionContext: ExecutionContext
  ) {
    executionContext.waitUntil(
      (async () => {
        await runNormalCleanup(environment)
        await runStoragePressureCleanup(environment)
      })()
    )
  },
}