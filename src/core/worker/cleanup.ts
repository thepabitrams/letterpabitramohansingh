import { sql } from 'drizzle-orm'
import { getDb, type Bindings } from '../../db/client'
import { letters, session, user } from '../../db/schema'
import {
  ORPHAN_USER_AGE_S,
  STORAGE_PRESSURE_RATIO,
} from './constants'
import { getStoragePressureRatio } from './storage'

export async function runNormalCleanup(environment: Bindings): Promise<void> {
  const db = getDb(environment)
  const now = new Date()
  const orphanThreshold = new Date(now.getTime() - ORPHAN_USER_AGE_S * 1000)

  await db.delete(letters).where(sql`${letters.expiresAt} < ${now}`)

  await db.delete(session).where(sql`${session.expiresAt} < ${now}`)

  await db.delete(user).where(sql`
    ${user.createdAt} < ${orphanThreshold}
    AND NOT EXISTS (
      SELECT 1 FROM letters WHERE letters.user_id = ${user.id}
    )
    AND NOT EXISTS (
      SELECT 1 FROM session WHERE session.user_id = ${user.id}
    )
  `)
}

export async function runPressureCleanup(environment: Bindings): Promise<void> {
  const db = getDb(environment)
  const now = new Date()
  const nowSeconds = Math.floor(now.getTime() / 1000)

  const letterAverageRows = await db.all(
    sql`SELECT AVG(${letters.expiresAt} - ${nowSeconds}) AS average_remaining FROM ${letters}`
  )
  const letterAverageRemaining =
    (letterAverageRows[0] as { average_remaining: number | null } | undefined)?.average_remaining

  if (
    letterAverageRemaining !== null &&
    letterAverageRemaining !== undefined &&
    letterAverageRemaining > 0
  ) {
    await db.delete(letters).where(
      sql`${letters.expiresAt} - ${nowSeconds} < ${letterAverageRemaining}`
    )
  }

  const userAverageRows = await db.all(
    sql`SELECT AVG(${nowSeconds} - ${user.createdAt}) AS average_age FROM ${user}`
  )
  const userAverageAge =
    (userAverageRows[0] as { average_age: number | null } | undefined)?.average_age

  if (userAverageAge !== null && userAverageAge !== undefined && userAverageAge > 0) {
    await db.delete(user).where(sql`
      (${nowSeconds} - ${user.createdAt}) > ${userAverageAge}
      AND NOT EXISTS (
        SELECT 1 FROM letters
        WHERE letters.user_id = ${user.id}
        AND letters.expires_at > ${nowSeconds}
      )
    `)
  }
}

export async function runCleanup(environment: Bindings): Promise<void> {
  await runNormalCleanup(environment)

  const pressureRatio = await getStoragePressureRatio(environment)

  if (pressureRatio >= STORAGE_PRESSURE_RATIO) {
    await runPressureCleanup(environment)
  }
}