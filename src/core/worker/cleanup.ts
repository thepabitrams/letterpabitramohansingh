// src/core/worker/cleanup.ts

import { sql } from 'drizzle-orm'
import { getDb, type Bindings } from '../../db/client'
import { letters, session, user } from '../../db/schema'
import {
  MILLISECONDS_PER_SECOND,
  ORPHAN_USER_AGE_MS,
  STORAGE_PRESSURE_RATIO,
} from './constants'
import { getStoragePressureRatio } from './storage'

export async function runNormalCleanup(environment: Bindings): Promise<void> {
  const db = getDb(environment)
  const now = Date.now()
  const orphanThreshold = now - ORPHAN_USER_AGE_MS

  await db.delete(letters).where(sql`${letters.expiresAt} < ${now}`)

  await db.delete(session).where(
    sql`(${session.expiresAt} * ${MILLISECONDS_PER_SECOND}) < ${now}`
  )

  await db.delete(user).where(sql`
    (${user.createdAt} * ${MILLISECONDS_PER_SECOND}) < ${orphanThreshold}
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
  const now = Date.now()

  const letterAverageRows = await db.all(
    sql`SELECT AVG(${letters.expiresAt} - ${now}) AS average_remaining FROM ${letters}`
  )
  const letterAverageRemaining =
    (letterAverageRows[0] as { average_remaining: number | null } | undefined)?.average_remaining

  if (
    letterAverageRemaining !== null &&
    letterAverageRemaining !== undefined &&
    letterAverageRemaining > 0
  ) {
    await db.delete(letters).where(
      sql`${letters.expiresAt} - ${now} < ${letterAverageRemaining}`
    )
  }

  const userAverageRows = await db.all(
    sql`SELECT AVG(${now} - (${user.createdAt} * ${MILLISECONDS_PER_SECOND})) AS average_age FROM ${user}`
  )
  const userAverageAge =
    (userAverageRows[0] as { average_age: number | null } | undefined)?.average_age

  if (userAverageAge !== null && userAverageAge !== undefined && userAverageAge > 0) {
    await db.delete(user).where(sql`
      (${now} - (${user.createdAt} * ${MILLISECONDS_PER_SECOND})) > ${userAverageAge}
      AND NOT EXISTS (
        SELECT 1 FROM letters
        WHERE letters.user_id = ${user.id}
        AND letters.expires_at > ${now}
      )
    `)
  }
}

export async function runStoragePressureCleanup(environment: Bindings): Promise<void> {
  const pressureRatio = await getStoragePressureRatio(environment)

  if (pressureRatio >= STORAGE_PRESSURE_RATIO) {
    await runPressureCleanup(environment)
  }
}