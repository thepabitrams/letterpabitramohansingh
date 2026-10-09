/* src/core/lib/canvas.ts */

type LetterCanvasData = {
  recipientName: string
  message: string
  reply: string
  note: string
}

const CANVAS_WIDTH = 800
const CANVAS_PADDING = 60
const CARD_CORNER_RADIUS = 24
const RETINA_SCALE = 2

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  startX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const paragraphs = text.split('\n')
  let currentY = startY

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ')
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word
      const measuredWidth = context.measureText(testLine).width

      if (measuredWidth > maxWidth && currentLine) {
        context.fillText(currentLine, startX, currentY)
        currentLine = word
        currentY += lineHeight
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      context.fillText(currentLine, startX, currentY)
      currentY += lineHeight
    }
  }

  return currentY
}

export function renderLetterToCanvas(letterData: LetterCanvasData): string {
  const measureCanvas = document.createElement('canvas')
  const measureContext = measureCanvas.getContext('2d')!
  measureContext.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

  const contentWidth = CANVAS_WIDTH - CANVAS_PADDING * 2
  const innerContentWidth = contentWidth - 60

  const messageLines = Math.ceil(
    measureContext.measureText(letterData.message).width / innerContentWidth
  )
  const messageHeight = Math.max(messageLines, 3) * 26

  const noteLines = letterData.note
    ? Math.ceil(measureContext.measureText(letterData.note).width / innerContentWidth)
    : 0
  const noteHeight = noteLines * 24

  const firstCardHeight = 180
  const secondCardHeight = 100 + messageHeight + 120 + noteHeight
  const totalHeight = CANVAS_PADDING + firstCardHeight + 24 + secondCardHeight + CANVAS_PADDING

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH * RETINA_SCALE
  canvas.height = totalHeight * RETINA_SCALE

  const context = canvas.getContext('2d')!
  context.scale(RETINA_SCALE, RETINA_SCALE)

  const backgroundGradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, totalHeight)
  backgroundGradient.addColorStop(0, '#fce7f3')
  backgroundGradient.addColorStop(1, '#e9d5ff')
  context.fillStyle = backgroundGradient
  context.fillRect(0, 0, CANVAS_WIDTH, totalHeight)

  let cursorY = CANVAS_PADDING

  context.save()
  context.shadowColor = 'rgba(0, 0, 0, 0.08)'
  context.shadowBlur = 20
  context.shadowOffsetY = 4
  context.fillStyle = '#ffffff'
  context.beginPath()
  context.roundRect(CANVAS_PADDING, cursorY, contentWidth, firstCardHeight, CARD_CORNER_RADIUS)
  context.fill()
  context.restore()

  context.font = '44px sans-serif'
  context.textAlign = 'center'
  context.fillText('💕', CANVAS_WIDTH / 2, cursorY + 70)

  context.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillStyle = '#ec4899'
  context.fillText('Thank you!', CANVAS_WIDTH / 2, cursorY + 118)

  context.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillStyle = '#6b7280'
  context.fillText('Your response has been recorded.', CANVAS_WIDTH / 2, cursorY + 148)

  cursorY += firstCardHeight + 24

  context.save()
  context.shadowColor = 'rgba(0, 0, 0, 0.08)'
  context.shadowBlur = 24
  context.shadowOffsetY = 6
  context.fillStyle = '#ffffff'
  context.beginPath()
  context.roundRect(CANVAS_PADDING, cursorY, contentWidth, secondCardHeight, CARD_CORNER_RADIUS)
  context.fill()
  context.restore()

  const innerX = CANVAS_PADDING + 30
  let innerY = cursorY + 40

  context.textAlign = 'left'
  context.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillStyle = '#9ca3af'
  context.fillText('ORIGINAL LETTER', innerX, innerY)
  innerY += 28

  context.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillStyle = '#374151'
  innerY = wrapText(context, letterData.message, innerX, innerY, innerContentWidth, 26)

  innerY += 30

  context.strokeStyle = '#f3f4f6'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(innerX, innerY)
  context.lineTo(CANVAS_WIDTH - CANVAS_PADDING - 30, innerY)
  context.stroke()
  innerY += 30

  context.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillStyle = '#9ca3af'
  context.fillText('YOUR REPLY', innerX, innerY)
  innerY += 32

  context.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  context.fillStyle = '#ec4899'
  context.fillText(letterData.reply, innerX, innerY)
  innerY += 36

  if (letterData.note) {
    context.font = 'italic 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    context.fillStyle = '#6b7280'
    wrapText(context, `"${letterData.note}"`, innerX, innerY, innerContentWidth, 24)
  }

  return canvas.toDataURL('image/png')
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const downloadLink = document.createElement('a')
  downloadLink.href = dataUrl
  downloadLink.download = fileName
  downloadLink.click()
}