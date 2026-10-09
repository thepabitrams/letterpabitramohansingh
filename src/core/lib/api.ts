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

type CreateLetterResponse = {
  id: string
  url: string
  slug: string
}

type LetterResponse = {
  id: string
  userId: string
  slug: string
  senderName: string
  recipientName: string
  message: string
  header: string | null
  pattern: string
  config: any
  status: string
  reply: string | null
  replyNote: string | null
  expiryDays: number
  createdAt: number
  openedAt: number | null
  repliedAt: number | null
  expiresAt: number
}

type ReplyResponse = {
  ok: boolean
}

type NoteResponse = {
  ok: boolean
}

type UserResponse = {
  id: string
  email: string
  name: string
  image?: string | null
}

type ApiError = {
  error?: string
}

export async function createLetter(payload: CreateLetterPayload): Promise<CreateLetterResponse> {
  const response = await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError
    throw new Error(errorData.error ?? 'Failed to create letter')
  }

  return response.json() as Promise<CreateLetterResponse>
}

export async function getLetter(senderSlug: string, recipientSlug: string): Promise<LetterResponse> {
  const response = await fetch(`/api/letters/${senderSlug}/${recipientSlug}`, {
    credentials: 'include',
  })

  if (!response.ok) throw new Error('Letter not found')

  return response.json() as Promise<LetterResponse>
}

export async function replyLetter(
  senderSlug: string,
  recipientSlug: string,
  replyText: string
): Promise<ReplyResponse> {
  const response = await fetch(`/api/letters/${senderSlug}/${recipientSlug}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply: replyText }),
  })

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError
    throw new Error(errorData.error ?? 'Failed to reply')
  }

  return response.json() as Promise<ReplyResponse>
}

export async function saveNote(
  senderSlug: string,
  recipientSlug: string,
  noteText: string
): Promise<NoteResponse> {
  const response = await fetch(`/api/letters/${senderSlug}/${recipientSlug}/note`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: noteText }),
  })

  if (!response.ok) throw new Error('Failed to save note')

  return response.json() as Promise<NoteResponse>
}

export async function getMyLetters(): Promise<LetterResponse[]> {
  const response = await fetch('/api/my-letters', { credentials: 'include' })

  if (!response.ok) throw new Error('Failed to fetch')

  return response.json() as Promise<LetterResponse[]>
}

export async function getMe(): Promise<UserResponse | null> {
  const response = await fetch('/api/me', { credentials: 'include' })

  if (!response.ok) return null

  return response.json() as Promise<UserResponse>
}