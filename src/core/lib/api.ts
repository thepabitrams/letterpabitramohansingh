// src/core/lib/api.ts 

type CreateLetterPayload = {
  senderName: string
  recipientName: string
  message: string
  header?: string
  pattern: string
  config: unknown
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
  existingExpiresAt?: number
}

export type CreateLetterConflictError = Error & {
  existingExpiresAt: number
}

export type SlugStatus =
  | { available: true }
  | { available: false; existingExpiresAt: number }

async function parseErrorResponse(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  let errorData: ApiError = {}

  try {
    errorData = (await response.json()) as ApiError
  } catch {
    throw new Error(
      `Server error (${response.status}). Please try again in a moment.`
    )
  }

  if (typeof errorData.existingExpiresAt === 'number') {
    const conflictError = new Error(
      errorData.error ?? fallbackMessage
    ) as CreateLetterConflictError
    conflictError.existingExpiresAt = errorData.existingExpiresAt
    throw conflictError
  }

  throw new Error(errorData.error ?? fallbackMessage)
}

export async function checkSlugStatus(
  sender: string,
  recipient: string
): Promise<SlugStatus> {
  const params = new URLSearchParams({ sender, recipient })
  const response = await fetch(`/api/letters/slug-status?${params}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    return { available: true }
  }

  return response.json() as Promise<SlugStatus>
}

export async function createLetter(
  payload: CreateLetterPayload
): Promise<CreateLetterResponse> {
  const response = await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    await parseErrorResponse(response, 'Failed to create letter')
  }

  return response.json() as Promise<CreateLetterResponse>
}

export async function getLetter(
  senderSlug: string,
  recipientSlug: string
): Promise<LetterResponse> {
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
    await parseErrorResponse(response, 'Failed to reply')
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