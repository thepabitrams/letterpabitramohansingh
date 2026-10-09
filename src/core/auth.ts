/* src/core/auth.ts */
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb, type Bindings } from './db/client'

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24

export function createAuth(environment: Bindings) {
  const db = getDb(environment)

  return betterAuth({
    baseURL: environment.BETTER_AUTH_URL,
    secret: environment.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    socialProviders: {
      google: {
        clientId: environment.GOOGLE_CLIENT_ID,
        clientSecret: environment.GOOGLE_CLIENT_SECRET,
      },
    },
    session: {
      expiresIn: SESSION_MAX_AGE_SECONDS,
      updateAge: SESSION_UPDATE_AGE_SECONDS,
    },
  })
}