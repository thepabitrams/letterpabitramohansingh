// src/core/worker/storage.ts

import { sql } from 'drizzle-orm'
import { getDb, type Bindings } from '../../db/client'
import { letters } from '../../db/schema'
import { D1_MAX_SIZE_BYTES, LETTER_COUNT_THRESHOLD } from './constants'

export async function getDatabaseSizeBytes(environment: Bindings): Promise<number> {
  try {
    const db = getDb(environment)
    const rows = await db.all(
      sql`SELECT page_count * page_size AS size FROM pragma_page_count(), pragma_page_size()`
    )
    const firstRow = rows[0] as { size: number } | undefined
    return firstRow?.size ?? 0
  } catch {
    return 0
  }
}

export async function getStoragePressureRatio(environment: Bindings): Promise<number> {
  const databaseSizeBytes = await getDatabaseSizeBytes(environment)

  if (databaseSizeBytes > 0) {
    return databaseSizeBytes / D1_MAX_SIZE_BYTES
  }

  const db = getDb(environment)
  const allLetters = await db.select().from(letters).limit(1000).all()
  const letterCount = allLetters.length
  return letterCount / LETTER_COUNT_THRESHOLD
}