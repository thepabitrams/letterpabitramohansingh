/* src/core/lib/api.ts */

export async function createLetter(data: {
  senderName: string
  recipientName: string
  message: string
  header?: string
  pattern: string
  config: any
  expiryDays: number
}) {
  const res = await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? 'Failed to create letter')
  }
  return res.json()
}

export async function getLetter(sender: string, recipient: string) {
  const res = await fetch(`/api/letters/${sender}/${recipient}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Letter not found')
  return res.json()
}

export async function replyLetter(sender: string, recipient: string, reply: string) {
  const res = await fetch(`/api/letters/${sender}/${recipient}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? 'Failed to reply')
  }
  return res.json()
}

export async function saveNote(sender: string, recipient: string, note: string) {
  const res = await fetch(`/api/letters/${sender}/${recipient}/note`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  })
  if (!res.ok) throw new Error('Failed to save note')
  return res.json()
}

export async function getMyLetters() {
  const res = await fetch('/api/my-letters', { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function getMe() {
  const res = await fetch('/api/me', { credentials: 'include' })
  if (!res.ok) return null
  return res.json()
}