/* src/core/lib/canvas.ts */

type LetterCanvasData = {
  recipientName: string
  message: string
  reply: string
  note: string
}

const WIDTH = 800
const PADDING = 60
const CARD_RADIUS = 24

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const paragraphs = text.split('\n')
  let currentY = y

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ')
    let line = ''

    for (const word of words) {
      const test = line ? line + ' ' + word : word
      const width = ctx.measureText(test).width

      if (width > maxWidth && line) {
        ctx.fillText(line, x, currentY)
        line = word
        currentY += lineHeight
      } else {
        line = test
      }
    }

    if (line) {
      ctx.fillText(line, x, currentY)
      currentY += lineHeight
    }
  }

  return currentY
}

export function renderLetterToCanvas(data: LetterCanvasData): string {
  // First pass: measure height with an offscreen canvas
  const measureCanvas = document.createElement('canvas')
  const measureCtx = measureCanvas.getContext('2d')!
  measureCtx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

  const contentWidth = WIDTH - PADDING * 2
  const innerWidth = contentWidth - 60

  // Measure message
  const msgLines = Math.ceil(
    measureCtx.measureText(data.message).width / innerWidth
  )
  const msgHeight = Math.max(msgLines, 3) * 26

  // Measure note
  const noteLines = data.note
    ? Math.ceil(measureCtx.measureText(data.note).width / innerWidth)
    : 0
  const noteHeight = noteLines * 24

  const card1Height = 180
  const card2Height = 100 + msgHeight + 120 + noteHeight
  const totalHeight = PADDING + card1Height + 24 + card2Height + PADDING

  // Real canvas
  const canvas = document.createElement('canvas')
  const scale = 2 // retina
  canvas.width = WIDTH * scale
  canvas.height = totalHeight * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, WIDTH, totalHeight)
  grad.addColorStop(0, '#fce7f3')
  grad.addColorStop(1, '#e9d5ff')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, WIDTH, totalHeight)

  let cursorY = PADDING

  // Card 1 — Thank you
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 4
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(PADDING, cursorY, contentWidth, card1Height, CARD_RADIUS)
  ctx.fill()
  ctx.restore()

  // Heart emoji
  ctx.font = '44px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('💕', WIDTH / 2, cursorY + 70)

  // "Thank you!"
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#ec4899'
  ctx.fillText('Thank you!', WIDTH / 2, cursorY + 118)

  // Subtitle
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#6b7280'
  ctx.fillText('Your response has been recorded.', WIDTH / 2, cursorY + 148)

  cursorY += card1Height + 24

  // Card 2 — Letter
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'
  ctx.shadowBlur = 24
  ctx.shadowOffsetY = 6
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(PADDING, cursorY, contentWidth, card2Height, CARD_RADIUS)
  ctx.fill()
  ctx.restore()

  const innerX = PADDING + 30
  let innerY = cursorY + 40

  // "Original letter" label
  ctx.textAlign = 'left'
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#9ca3af'
  ctx.fillText('ORIGINAL LETTER', innerX, innerY)
  innerY += 28

  // Message text
  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#374151'
  innerY = wrapText(ctx, data.message, innerX, innerY, innerWidth, 26)

  innerY += 30

  // Divider
  ctx.strokeStyle = '#f3f4f6'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(innerX, innerY)
  ctx.lineTo(WIDTH - PADDING - 30, innerY)
  ctx.stroke()
  innerY += 30

  // "Your reply" label
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#9ca3af'
  ctx.fillText('YOUR REPLY', innerX, innerY)
  innerY += 32

  // Reply value
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#ec4899'
  ctx.fillText(data.reply, innerX, innerY)
  innerY += 36

  // Note (if any)
  if (data.note) {
    ctx.font = 'italic 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillStyle = '#6b7280'
    wrapText(ctx, `"${data.note}"`, innerX, innerY, innerWidth, 24)
  }

  return canvas.toDataURL('image/png')
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}