// src/core/worker/constants.ts

export const MILLISECONDS_PER_SECOND = 1_000
export const SECONDS_PER_DAY = 86_400
export const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * MILLISECONDS_PER_SECOND

export const FULL_LETTER_LIFE_MS = 7 * MILLISECONDS_PER_DAY
export const HALF_LETTER_LIFE_MS = 3.5 * MILLISECONDS_PER_DAY
export const QUARTER_LETTER_LIFE_MS = 1.75 * MILLISECONDS_PER_DAY
export const ORPHAN_USER_AGE_MS = MILLISECONDS_PER_DAY

export const STORAGE_PRESSURE_RATIO = 0.9
export const D1_MAX_SIZE_BYTES = 500 * 1024 * 1024
export const USER_COUNT_THRESHOLD = 100
export const LETTER_COUNT_THRESHOLD = 100

export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://letter.pabitramohansingh.workers.dev',
] as const