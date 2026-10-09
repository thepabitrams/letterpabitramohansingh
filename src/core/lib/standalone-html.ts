/* src/core/lib/standalone-html.ts */

type LetterData = {
  recipientName: string
  message: string
  reply: string
  note: string
  background: string
  effect: string
  messageBoxVariant: string
  textVariant: string
  textAnimation: string
}

const BG: Record<string, string> = {
  pink: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fbcfe8 100%)',
  blue: 'linear-gradient(135deg, #dbeafe 0%, #cffafe 50%, #bfdbfe 100%)',
  dark: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #000000 100%)',
  warm: 'linear-gradient(135deg, #ffedd5 0%, #fef9c3 50%, #fee2e2 100%)',
  mint: 'linear-gradient(135deg, #d1fae5 0%, #ccfbf1 50%, #a5f3fc 100%)',
}

const BOX: Record<string, string> = {
  romantic: `
    background: linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%);
    border: 2px solid #fbcfe8;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    border-radius: 24px;
  `,
  minimal: `
    background: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    border-radius: 16px;
  `,
  vintage: `
    background: #fffbeb;
    border: 2px solid #fcd34d;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    border-radius: 20px;
  `,
}

const TEXT: Record<string, string> = {
  romantic: 'color: #374151; line-height: 1.7;',
  modern: 'color: #4b5563; line-height: 1.6; letter-spacing: -0.01em;',
  handwritten: 'color: #374151; line-height: 2; font-style: italic;',
}

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeForScript(str: string): string {
  return JSON.stringify(str).replace(/</g, '\\u003c')
}

function getEffectScript(effect: string): string {
  if (effect === 'hearts') {
    return `
      const el = document.getElementById('effects');
      const colors = ['#ec4899', '#f472b6', '#fb7185', '#f43f5e', '#e11d48'];
      for (let i = 0; i < 15; i++) {
        const d = document.createElement('div');
        d.className = 'fx heart';
        d.style.left = Math.random() * 95 + '%';
        d.style.animationDuration = (6 + Math.random() * 4) + 's';
        d.style.animationDelay = (i * 0.4) + 's';
        d.style.color = colors[i % colors.length];
        d.style.fontSize = (20 + Math.random() * 12) + 'px';
        d.textContent = '♥';
        el.appendChild(d);
      }
    `
  }
  if (effect === 'confetti') {
    return `
      const el = document.getElementById('effects');
      const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#f368e0', '#ff9ff3'];
      for (let i = 0; i < 30; i++) {
        const d = document.createElement('div');
        d.className = 'fx confetti';
        d.style.left = Math.random() * 98 + '%';
        d.style.animationDuration = (4 + Math.random() * 3) + 's';
        d.style.animationDelay = (Math.random() * 3) + 's';
        d.style.backgroundColor = colors[i % colors.length];
        const size = 6 + Math.random() * 6;
        d.style.width = size + 'px';
        d.style.height = (i % 2 === 0 ? size : size * 0.4) + 'px';
        if (i % 2 === 0) d.style.borderRadius = '50%';
        el.appendChild(d);
      }
    `
  }
  if (effect === 'fireworks') {
    return `
      const el = document.getElementById('effects');
      const colors = ['#fbbf24', '#f59e0b', '#fb923c', '#f472b6', '#a78bfa', '#60a5fa'];
      for (let i = 0; i < 10; i++) {
        const d = document.createElement('div');
        d.className = 'fx firework';
        d.style.left = (10 + Math.random() * 75) + '%';
        d.style.top = (15 + Math.random() * 60) + '%';
        d.style.animationDelay = (i * 0.5) + 's';
        d.style.color = colors[i % colors.length];
        d.style.fontSize = (28 + Math.random() * 16) + 'px';
        d.textContent = i % 2 === 0 ? '★' : '☆';
        el.appendChild(d);
      }
    `
  }
  if (effect === 'snow') {
    return `
      const el = document.getElementById('effects');
      for (let i = 0; i < 25; i++) {
        const d = document.createElement('div');
        d.className = 'fx snow';
        d.style.left = Math.random() * 98 + '%';
        d.style.animationDuration = (8 + Math.random() * 4) + 's';
        d.style.animationDelay = (Math.random() * 4) + 's';
        d.style.color = '#ffffff';
        d.style.fontSize = (14 + Math.random() * 10) + 'px';
        d.textContent = '❄';
        el.appendChild(d);
      }
    `
  }
  return ''
}

function getMessageScript(animation: string, message: string): string {
  const m = escapeForScript(message)
  if (animation === 'typewriter') {
    return `
      const target = document.getElementById('message');
      const full = ${m};
      let i = 0;
      const t = setInterval(() => {
        target.textContent = full.slice(0, ++i);
        if (i >= full.length) clearInterval(t);
      }, 40);
    `
  }
  return `
    document.getElementById('message').textContent = ${m};
  `
}

function entryClass(animation: string): string {
  if (animation === 'fade') return 'fade-in'
  if (animation === 'slide') return 'slide-up'
  return ''
}

export function generateStandaloneHTML(data: LetterData): string {
  const bg = BG[data.background] ?? BG.blue
  const boxStyle = BOX[data.messageBoxVariant] ?? BOX.romantic
  const textStyle = TEXT[data.textVariant] ?? TEXT.romantic
  const ec = entryClass(data.textAnimation)

  const replyBlock = data.reply
    ? `
      <div class="reply-card ${ec}">
        <p class="reply-label">Reply</p>
        <p class="reply-value">${escape(data.reply)}</p>
        ${data.note ? `<p class="reply-note">"${escape(data.note)}"</p>` : ''}
      </div>
    `
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>A letter for ${escape(data.recipientName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { min-height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: ${bg};
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow-x: hidden;
  }
  .effects {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
  }
  .fx { position: absolute; will-change: transform, opacity; }

  .heart { top: 100%; opacity: 0; animation: floatUp linear infinite; }
  @keyframes floatUp {
    0%   { transform: translateY(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-120vh); opacity: 0; }
  }

  .confetti { top: -20px; animation: fall linear infinite; }
  @keyframes fall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  .firework { opacity: 0; animation: burst 2s ease-out infinite; }
  @keyframes burst {
    0%   { transform: scale(0); opacity: 0; }
    50%  { transform: scale(1.4); opacity: 1; }
    100% { transform: scale(0); opacity: 0; }
  }

  .snow { top: -20px; animation: fallSnow linear infinite; }
  @keyframes fallSnow {
    0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
  }

  .content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .message-box {
    ${boxStyle}
    padding: 24px;
    font-size: 16px;
    white-space: pre-wrap;
    word-wrap: break-word;
    ${textStyle}
  }

  .reply-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 20px 24px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
  }

  .reply-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #9ca3af;
    margin-bottom: 8px;
  }

  .reply-value {
    font-size: 22px;
    font-weight: 700;
    color: #ec4899;
  }

  .reply-note {
    margin-top: 12px;
    font-size: 15px;
    color: #6b7280;
    font-style: italic;
    line-height: 1.6;
  }

  .fade-in { animation: fadeIn 0.8s ease-out both; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .slide-up { animation: slideUp 0.6s ease-out both; }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
</head>
<body>
  <div class="effects" id="effects"></div>
  <div class="content">
    <div class="message-box ${ec}">
      <p id="message"></p>
    </div>
    ${replyBlock}
  </div>

  <script>
    ${getEffectScript(data.effect)}
    ${getMessageScript(data.textAnimation, data.message)}
  </script>
</body>
</html>`
}