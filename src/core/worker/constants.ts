export const SECONDS_PER_DAY = 86_400

export const FULL_LETTER_LIFE_S = 7 * SECONDS_PER_DAY
export const HALF_LETTER_LIFE_S = 3.5 * SECONDS_PER_DAY
export const QUARTER_LETTER_LIFE_S = 1.75 * SECONDS_PER_DAY
export const ORPHAN_USER_AGE_S = 1 * SECONDS_PER_DAY

export const STORAGE_PRESSURE_RATIO = 0.9
export const D1_MAX_SIZE_BYTES = 500 * 1024 * 1024
export const USER_COUNT_THRESHOLD = 100
export const LETTER_COUNT_THRESHOLD = 100

export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://letter.pabitramohansingh.workers.dev',
] as const