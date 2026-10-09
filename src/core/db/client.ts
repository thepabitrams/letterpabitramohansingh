/* src/core/db/client.ts */
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export type Bindings = {
  DB: D1Database
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
}

export function getDb(environment: Bindings) {
  return drizzle(environment.DB, { schema })
}