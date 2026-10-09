/* src/core/lib/export/html/template.ts */
import { escapeHtml, renderMarkdown } from './escape'

export type TemplateData = {
  senderName: string
  recipientName: string
  message: string
  reply: string
  note: string
  pattern: string
  backgroundClass: string
  messageBoxClass: string
  textClass: string
  fontUrl: string
  fontFamilyCss: string
  effectScript: string
  backgroundAnimationScript: string
  textAnimationScript: string
  isNoteSubmitted: boolean
  isTypewriter: boolean
}

export function buildTemplate(data: TemplateData): string {
  const fontLink = data.fontUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${data.fontUrl}" rel="stylesheet">`
    : ''

  const senderLine = data.senderName
    ? `<p class="text-center text-xs tracking-[0.3em] text-gray-500 font-semibold">From <span class="uppercase">${escapeHtml(data.senderName)}</span></p>`
    : ''

  const messageBody = data.isTypewriter
    ? `<div class="${data.textClass}"><span id="message" data-full-text="${escapeHtml(data.message)}"></span><span class="cursor-blink">|</span></div>`
    : `<div data-motion-text class="${data.textClass}">${renderMarkdown(data.message)}</div>`

  const messageBlock = `<div class="${data.messageBoxClass} px-6 py-5 rounded-2xl w-full">${messageBody}</div>`

  let replyBlock = ''
  if (data.isNoteSubmitted) {
    const replyLine =
      data.pattern === 'note-only'
        ? `<span class="uppercase">${escapeHtml(data.recipientName)}</span> Replied`
        : `<span class="uppercase">${escapeHtml(data.recipientName)}</span> Replied <span class="text-pink-600">${escapeHtml(data.reply)}</span>`

    const hasNoteText = data.note && data.note.trim() !== ''
    const noteText = hasNoteText
      ? `<div class="${data.textClass} italic">"${escapeHtml(data.note)}"</div>`
      : ''

    replyBlock = `
      <div class="text-center space-y-2 pt-1">
        <p class="text-xs tracking-[0.2em] text-gray-600 font-semibold">${replyLine}</p>
        ${noteText}
      </div>
    `
  }

  const senderForScript = (data.senderName || 'ME').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const recipientForScript = (data.recipientName || 'YOU').replace(/\\/g, '\\\\').replace(/'/g, "\\'")

  const allScripts = [
    data.effectScript,
    data.backgroundAnimationScript,
    data.textAnimationScript,
  ]
    .filter((script) => script && script.trim())
    .map((script) =>
      script
        .replace(/__SENDER__/g, senderForScript)
        .replace(/__RECIPIENT__/g, recipientForScript)
    )

  const scriptsHtml = allScripts
    .map((script) => `<script type="module">${script}</script>`)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>A letter for ${escapeHtml(data.recipientName)}</title>

<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
${fontLink}

<style>
${data.fontFamilyCss}
.cursor-blink { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
</head>
<body>
  <div data-background class="relative w-full min-h-screen ${data.backgroundClass} flex items-center justify-center p-6 overflow-hidden">
    <div class="absolute inset-0 z-30 pointer-events-none" id="effects"></div>
    <div class="relative z-10 max-w-md w-full space-y-4">
      ${senderLine}
      ${messageBlock}
      ${replyBlock}
    </div>
  </div>

${scriptsHtml}
</body>
</html>`
}