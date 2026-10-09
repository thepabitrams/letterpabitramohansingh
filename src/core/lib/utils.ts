/* src/core/lib/utils.ts */
export const DAY_IN_MS = 86_400_000

export function slugify(input: string) {
  return input.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function computeExpiry(
  state: 'created' | 'opened' | 'replied',
  timestamp: number,
  expiryDays: number
) {
  const factor = state === 'created' ? 1 : state === 'opened' ? 0.5 : 0.25
  return timestamp + expiryDays * factor * DAY_IN_MS
}