/* src/core/lib/api.ts */

type CreateLetterPayload = {
  senderName: string
  recipientName: string
  message: string
  header?: string
  pattern: string
  config: unknown
  expiryDays: number
}

export async function createLetter(payload: CreateLetterPayload) {
  const response = await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error ?? 'Failed to create letter')
  }

  return response.json()
}

export async function getLetter(senderSlug: string, recipientSlug: string) {
  const response = await fetch(`/api/letters/${senderSlug}/${recipientSlug}`, {
    credentials: 'include',
  })

  if (!response.ok) throw new Error('Letter not found')

  return response.json()
}

export async function replyLetter(senderSlug: string, recipientSlug: string, replyText: string) {
  const response = await fetch(`/api/letters/${senderSlug}/${recipientSlug}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply: replyText }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error ?? 'Failed to reply')
  }

  return response.json()
}

export async function saveNote(senderSlug: string, recipientSlug: string, noteText: string) {
  const response = await fetch(`/api/letters/${senderSlug}/${recipientSlug}/note`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: noteText }),
  })

  if (!response.ok) throw new Error('Failed to save note')

  return response.json()
}

export async function getMyLetters() {
  const response = await fetch('/api/my-letters', { credentials: 'include' })

  if (!response.ok) throw new Error('Failed to fetch')

  return response.json()
}

export async function getMe() {
  const response = await fetch('/api/me', { credentials: 'include' })

  if (!response.ok) return null

  return response.json()
}