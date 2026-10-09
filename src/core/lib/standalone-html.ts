/* src/core/lib/standalone-html.ts */

import { getBackgroundVariant } from '../../letter/background'
import { getMessageBoxVariant, MESSAGE_BOX_ANIMATIONS } from '../../letter/message-box'
import { getTextVariant, TEXT_ANIMATIONS } from '../../letter/text'
import { getButtonVariant, BUTTON_ANIMATIONS } from '../../letter/button'
import {
  COLORS,
  SHAPES,
  SIZES,
  type ColorKey,
  type ShapeKey,
  type SizeKey,
} from '../../letter/tokens'

type ButtonConfig = {
  text: string
  color: string
  shape: string
  size: string
  variant: string
  animation: string
}

export type LetterData = {
  senderName: string
  recipientName: string
  message: string
  reply: string
  note: string
  pattern: string
  background: string
  effect: string
  textVariant: string
  textAnimation: string
  messageBoxVariant: string
  messageBoxAnimation: string
  buttons?: { yes?: ButtonConfig; no?: ButtonConfig }
  button?: ButtonConfig
  submitButton?: ButtonConfig
}

type MotionConfig = {
  selector: string
  keyframes: Record<string, unknown>
  options: Record<string, unknown>
}

type EntryConfig = {
  selector: string
  initial: Record<string, unknown>
  keyframes: Record<string, unknown>
  options: Record<string, unknown>
}

type TriggerConfig = {
  selector: string
  type: string
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value: string): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char)
}

function renderMarkdown(content: string): string {
  return escapeHtml(content)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}

function serializeForJavaScript(value: unknown): string {
  return JSON.stringify(value, (_key, val) => (val === Infinity ? '__INF__' : val)).replace(
    /"__INF__"/g,
    'Infinity'
  )
}

function buildButtonClasses(button: ButtonConfig): string {
  const colorConfig = COLORS[button.color as ColorKey] ?? COLORS.green
  const shapeClass = SHAPES[button.shape as ShapeKey] ?? SHAPES.pill
  const sizeClass = SIZES[button.size as SizeKey] ?? SIZES.md
  const variantClass = getButtonVariant(button.variant)?.className ?? ''

  return `text-white font-semibold select-none inline-block ${colorConfig.bg} ${shapeClass} ${sizeClass} ${variantClass}`
}

function buildMotionConfigs(letterData: LetterData) {
  const buttonMotions: MotionConfig[] = []
  const messageEntries: EntryConfig[] = []
  const triggerButtons: TriggerConfig[] = []
  let textEntry: EntryConfig | null = null

  const registerButton = (selector: string, button?: ButtonConfig) => {
    if (!button?.animation || button.animation === 'none') return

    const animationConfig = BUTTON_ANIMATIONS.find((entry) => entry.id === button.animation)?.config
    if (!animationConfig) return

    if (
      animationConfig.category === 'motion' &&
      animationConfig.variants &&
      Object.keys(animationConfig.variants).length > 0
    ) {
      buttonMotions.push({
        selector,
        keyframes: animationConfig.variants,
        options: animationConfig.transition ?? { repeat: Infinity },
      })
    } else if (animationConfig.category === 'trigger') {
      triggerButtons.push({ selector, type: animationConfig.id })
    }
  }

  if (letterData.pattern === 'two-choice' && letterData.buttons) {
    registerButton('[data-motion-btn="yes"]', letterData.buttons.yes)
    registerButton('[data-motion-btn="no"]', letterData.buttons.no)
  } else if (letterData.pattern === 'one-choice' && letterData.button) {
    registerButton('[data-motion-btn="one"]', letterData.button)
  }

  if (letterData.messageBoxAnimation && letterData.messageBoxAnimation !== 'none') {
    const animationConfig = MESSAGE_BOX_ANIMATIONS.find(
      (entry) => entry.id === letterData.messageBoxAnimation
    )?.config

    if (
      animationConfig?.variants?.animate &&
      Object.keys(animationConfig.variants.animate).length > 0
    ) {
      messageEntries.push({
        selector: '[data-motion-msg]',
        initial: animationConfig.variants.initial ?? {},
        keyframes: animationConfig.variants.animate,
        options: animationConfig.variants.transition ?? { duration: 0.6 },
      })
    }
  }

  if (
    letterData.textAnimation &&
    letterData.textAnimation !== 'none' &&
    letterData.textAnimation !== 'typewriter'
  ) {
    const animationConfig = TEXT_ANIMATIONS.find(
      (entry) => entry.id === letterData.textAnimation
    )?.config

    if (
      animationConfig?.variants?.animate &&
      Object.keys(animationConfig.variants.animate).length > 0
    ) {
      textEntry = {
        selector: '[data-motion-text]',
        initial: animationConfig.variants.initial ?? {},
        keyframes: animationConfig.variants.animate,
        options: animationConfig.variants.transition ?? { duration: 0.6 },
      }
    }
  }

  return { buttonMotions, messageEntries, triggerButtons, textEntry }
}

function buildEffectScript(effect: string): string {
  if (effect === 'hearts') {
    return `
      const effectLayer = document.getElementById('effects');
      const heartColors = ['#ec4899', '#f472b6', '#fb7185', '#f43f5e', '#e11d48'];
      for (let index = 0; index < 15; index++) {
        const particle = document.createElement('div');
        particle.className = 'fx heart';
        particle.style.left = Math.random() * 95 + '%';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        particle.style.animationDelay = (index * 0.4) + 's';
        particle.style.color = heartColors[index % heartColors.length];
        particle.style.fontSize = (20 + Math.random() * 12) + 'px';
        particle.textContent = '\\u2665';
        effectLayer.appendChild(particle);
      }
    `
  }

  if (effect === 'confetti') {
    return `
      const effectLayer = document.getElementById('effects');
      const confettiColors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#f368e0', '#ff9ff3'];
      for (let index = 0; index < 30; index++) {
        const particle = document.createElement('div');
        particle.className = 'fx confetti';
        particle.style.left = Math.random() * 98 + '%';
        particle.style.animationDuration = (4 + Math.random() * 3) + 's';
        particle.style.animationDelay = (Math.random() * 3) + 's';
        particle.style.backgroundColor = confettiColors[index % confettiColors.length];
        const size = 6 + Math.random() * 6;
        particle.style.width = size + 'px';
        particle.style.height = (index % 2 === 0 ? size : size * 0.4) + 'px';
        if (index % 2 === 0) particle.style.borderRadius = '50%';
        effectLayer.appendChild(particle);
      }
    `
  }

  if (effect === 'fireworks') {
    return `
      const effectLayer = document.getElementById('effects');
      const fireworkColors = ['#fbbf24', '#f59e0b', '#fb923c', '#f472b6', '#a78bfa', '#60a5fa'];
      for (let index = 0; index < 10; index++) {
        const particle = document.createElement('div');
        particle.className = 'fx firework';
        particle.style.left = (10 + Math.random() * 75) + '%';
        particle.style.top = (15 + Math.random() * 60) + '%';
        particle.style.animationDelay = (index * 0.5) + 's';
        particle.style.color = fireworkColors[index % fireworkColors.length];
        particle.style.fontSize = (28 + Math.random() * 16) + 'px';
        particle.textContent = index % 2 === 0 ? '\\u2605' : '\\u2606';
        effectLayer.appendChild(particle);
      }
    `
  }

  if (effect === 'snow') {
    return `
      const effectLayer = document.getElementById('effects');
      for (let index = 0; index < 25; index++) {
        const particle = document.createElement('div');
        particle.className = 'fx snow';
        particle.style.left = Math.random() * 98 + '%';
        particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        particle.style.animationDelay = (Math.random() * 4) + 's';
        particle.style.color = '#ffffff';
        particle.style.fontSize = (14 + Math.random() * 10) + 'px';
        particle.textContent = '\\u2744';
        effectLayer.appendChild(particle);
      }
    `
  }

  return ''
}

export function generateStandaloneHTML(letterData: LetterData): string {
  const backgroundConfig = getBackgroundVariant(letterData.background)
  const messageBoxConfig = getMessageBoxVariant(letterData.messageBoxVariant)
  const textConfig = getTextVariant(letterData.textVariant)

  const backgroundClasses =
    backgroundConfig?.className ?? 'bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200'
  const messageBoxClasses =
    messageBoxConfig?.className ?? 'bg-white border border-gray-200 shadow-sm'
  const bodyTextClasses = textConfig?.bodyClass ?? 'text-base text-gray-700 leading-relaxed'

  const senderLine = letterData.senderName
    ? `<p class="text-center text-xs tracking-[0.3em] text-gray-500 font-semibold">From <span class="uppercase">${escapeHtml(
        letterData.senderName
      )}</span></p>`
    : ''

  const messageBody =
    letterData.textAnimation === 'typewriter'
      ? `<div class="${bodyTextClasses}" id="message"></div><span class="cursor-blink">|</span>`
      : `<div data-motion-text class="${bodyTextClasses}">${renderMarkdown(letterData.message)}</div>`

  const messageBlock = `<div data-motion-msg class="${messageBoxClasses} px-6 py-5 rounded-2xl w-full">${messageBody}</div>`

  let buttonsBlock = ''
  if (
    letterData.pattern === 'two-choice' &&
    letterData.buttons?.yes &&
    letterData.buttons?.no
  ) {
    buttonsBlock = `
      <div class="flex gap-4 justify-center items-center pt-2">
        <button data-motion-btn="yes" class="${buildButtonClasses(letterData.buttons.yes)}">${escapeHtml(letterData.buttons.yes.text)}</button>
        <button data-motion-btn="no" class="${buildButtonClasses(letterData.buttons.no)}">${escapeHtml(letterData.buttons.no.text)}</button>
      </div>
    `
  } else if (letterData.pattern === 'one-choice' && letterData.button) {
    buttonsBlock = `
      <div class="flex justify-center items-center pt-2">
        <button data-motion-btn="one" class="${buildButtonClasses(letterData.button)}">${escapeHtml(letterData.button.text)}</button>
      </div>
    `
  }

  let replyBlock = ''
  if (letterData.reply || letterData.note) {
    const isNoteOnly = letterData.pattern === 'note-only'
    const replyLine = isNoteOnly
      ? `<span class="uppercase">${escapeHtml(letterData.recipientName)}</span> Replied`
      : `<span class="uppercase">${escapeHtml(
          letterData.recipientName
        )}</span> Replied <span class="text-pink-600">${escapeHtml(letterData.reply)}</span>`

    replyBlock = `
      <div class="text-center space-y-2 pt-1">
        <p class="text-xs tracking-[0.2em] text-gray-600 font-semibold">${replyLine}</p>
        ${
          letterData.note
            ? `<div class="${bodyTextClasses} italic">"${escapeHtml(letterData.note)}"</div>`
            : ''
        }
      </div>
    `
  }

  const effectScript = buildEffectScript(letterData.effect)

  const typewriterScript =
    letterData.textAnimation === 'typewriter'
      ? `
        const messageElement = document.getElementById('message');
        const fullMessage = ${JSON.stringify(letterData.message)};
        let characterIndex = 0;
        const typewriterTimer = setInterval(() => {
          messageElement.textContent = fullMessage.slice(0, ++characterIndex);
          if (characterIndex >= fullMessage.length) clearInterval(typewriterTimer);
        }, 40);
      `
      : ''

  const { buttonMotions, messageEntries, triggerButtons, textEntry } =
    buildMotionConfigs(letterData)

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>A letter for ${escapeHtml(letterData.recipientName)}</title>

<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

<style>
  @keyframes floatUp { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-120vh); opacity: 0; } }
  @keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
  @keyframes burst { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.4); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
  @keyframes fallSnow { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
  @keyframes blink { 50% { opacity: 0; } }

  .fx { position: absolute; will-change: transform, opacity; }
  .heart { top: 100%; opacity: 0; animation: floatUp linear infinite; }
  .confetti { top: -20px; animation: fall linear infinite; }
  .firework { opacity: 0; animation: burst 2s ease-out infinite; }
  .snow { top: -20px; animation: fallSnow linear infinite; }
  .cursor-blink { animation: blink 1s steps(1) infinite; }
</style>
</head>
<body>
  <div class="relative w-full min-h-screen ${backgroundClasses} flex items-center justify-center p-6 overflow-hidden">
    <div class="absolute inset-0 z-30 pointer-events-none" id="effects"></div>
    <div class="relative z-10 max-w-md w-full space-y-4">
      ${senderLine}
      ${messageBlock}
      ${buttonsBlock}
      ${replyBlock}
    </div>
  </div>

  <script>
    ${effectScript}
    ${typewriterScript}
  </script>

  <script type="module">
    import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';

    const buttonMotions = ${serializeForJavaScript(buttonMotions)};
    const messageEntries = ${serializeForJavaScript(messageEntries)};
    const textEntry = ${serializeForJavaScript(textEntry)};
    const triggerButtons = ${serializeForJavaScript(triggerButtons)};

    function applyInitialStyles(element, initialStyles) {
      if (!initialStyles) return;
      const transformParts = [];
      if (initialStyles.x !== undefined) transformParts.push('translateX(' + initialStyles.x + 'px)');
      if (initialStyles.y !== undefined) transformParts.push('translateY(' + initialStyles.y + 'px)');
      if (initialStyles.scale !== undefined) transformParts.push('scale(' + initialStyles.scale + ')');
      if (initialStyles.rotate !== undefined) transformParts.push('rotate(' + initialStyles.rotate + 'deg)');
      if (transformParts.length) element.style.transform = transformParts.join(' ');
      if (initialStyles.opacity !== undefined) element.style.opacity = initialStyles.opacity;
    }

    buttonMotions.forEach((motionConfig) => {
      document.querySelectorAll(motionConfig.selector).forEach((element) => {
        try {
          animate(element, motionConfig.keyframes, motionConfig.options);
        } catch (error) {
          console.warn('[letter] Button motion failed:', error);
        }
      });
    });

    messageEntries.forEach((entryConfig) => {
      document.querySelectorAll(entryConfig.selector).forEach((element) => {
        applyInitialStyles(element, entryConfig.initial);
        try {
          animate(element, entryConfig.keyframes, entryConfig.options);
        } catch (error) {
          console.warn('[letter] Message entry failed:', error);
        }
      });
    });

    if (textEntry) {
      document.querySelectorAll(textEntry.selector).forEach((element) => {
        applyInitialStyles(element, textEntry.initial);
        try {
          animate(element, textEntry.keyframes, textEntry.options);
        } catch (error) {
          console.warn('[letter] Text entry failed:', error);
        }
      });
    }

    triggerButtons.forEach((triggerConfig) => {
      const button = document.querySelector(triggerConfig.selector);
      if (!button) return;
      const container = button.parentElement;

      if (triggerConfig.type === 'runaway') {
        const messages = ['Are you sure?', 'Really?', 'Think again!', 'Please?', 'Last chance!', '\\uD83E\\uDD7A'];
        let messageIndex = 0;
        let lastMoveTimestamp = 0;

        const moveButton = (event) => {
          const now = Date.now();
          if (now - lastMoveTimestamp < 200) return;
          lastMoveTimestamp = now;
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }

          const containerRect = container.getBoundingClientRect();
          const maxOffsetX = Math.max(containerRect.width / 2 - 40, 100);
          const maxOffsetY = Math.max(containerRect.height / 2 - 40, 80);
          const angle = Math.random() * Math.PI * 2;
          const distance = 150 + Math.random() * 80;

          let offsetX = Math.cos(angle) * distance;
          let offsetY = Math.sin(angle) * distance;
          offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
          offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));

          animate(button, { x: offsetX, y: offsetY }, { type: 'spring', stiffness: 200, damping: 22 });

          let toast = container.querySelector('.runaway-msg');
          if (!toast) {
            toast = document.createElement('div');
            toast.className = 'runaway-msg absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full shadow-lg whitespace-nowrap pointer-events-none';
            container.appendChild(toast);
          }
          toast.textContent = messages[messageIndex];
          messageIndex = (messageIndex + 1) % messages.length;
        };

        button.addEventListener('mouseenter', moveButton);
        button.addEventListener('touchstart', moveButton, { passive: false });
        button.addEventListener('touchmove', moveButton, { passive: false });
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
      }

      if (triggerConfig.type === 'blast') {
        let lastMoveTimestamp = 0;

        button.addEventListener('mouseenter', () => {
          const now = Date.now();
          if (now - lastMoveTimestamp < 200) return;
          lastMoveTimestamp = now;

          for (let index = 0; index < 10; index++) {
            const angle = (index * 36 * Math.PI) / 180;
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 rounded-full bg-gray-400 pointer-events-none';
            particle.style.left = '50%';
            particle.style.top = '50%';
            container.appendChild(particle);

            animate(
              particle,
              {
                x: Math.cos(angle) * 70,
                y: Math.sin(angle) * 70,
                opacity: 0,
                scale: 0,
              },
              { duration: 0.6, ease: 'easeOut' }
            ).finished.then(() => particle.remove());
          }

          const containerRect = container.getBoundingClientRect();
          const maxOffsetX = Math.max(containerRect.width / 2 - 40, 100);
          const maxOffsetY = Math.max(containerRect.height / 2 - 40, 80);
          const offsetX = (Math.random() - 0.5) * maxOffsetX * 1.5;
          const offsetY = (Math.random() - 0.5) * maxOffsetY * 1.5;

          animate(button, { x: offsetX, y: offsetY }, { type: 'spring', stiffness: 200, damping: 22 });
        });
      }
    });
  </script>
</body>
</html>`
}