/* src/core/lib/export/html/index.ts */
import { getBackgroundVariant, getBackgroundAnimation } from '../../../../letter/background'
import { getEffectVariant } from '../../../../letter/effect'
import { getMessageBoxVariant } from '../../../../letter/message-box'
import { getTextVariant, getTextAnimation } from '../../../../letter/text'
import { buildTemplate } from './template'

export type LetterExportData = {
  senderName: string
  recipientName: string
  message: string
  reply: string
  note: string
  pattern: string
  background: string
  backgroundAnimation?: string
  effect: string
  textVariant: string
  textAnimation: string
  messageBoxVariant: string
  messageBoxAnimation: string
}

export function generateStandaloneHTML(letterData: LetterExportData): string {
  const backgroundVariant = getBackgroundVariant(letterData.background)
  const backgroundAnimationConfig = letterData.backgroundAnimation
    ? getBackgroundAnimation(letterData.backgroundAnimation)
    : null
  const effectVariant = getEffectVariant(letterData.effect)
  const textVariant = getTextVariant(letterData.textVariant)
  const textAnimationConfig = getTextAnimation(letterData.textAnimation)
  const messageBoxVariant = getMessageBoxVariant(letterData.messageBoxVariant)

  const backgroundClass = backgroundVariant?.className ?? ''
  const messageBoxClass = messageBoxVariant?.className ?? ''
  const textClass = textVariant?.standalone?.className ?? textVariant?.bodyClass ?? ''
  const fontUrl = textVariant?.standalone?.fontUrl ?? ''
  const fontFamilyCss = textVariant?.standalone?.fontFamilyCss ?? ''

  const isNoteSubmitted =
    letterData.reply !== '' ||
    (letterData.note !== null && letterData.note !== undefined)

  const isTypewriter = letterData.textAnimation === 'typewriter'

  return buildTemplate({
    senderName: letterData.senderName,
    recipientName: letterData.recipientName,
    message: letterData.message,
    reply: letterData.reply,
    note: letterData.note,
    pattern: letterData.pattern,
    backgroundClass,
    messageBoxClass,
    textClass,
    fontUrl,
    fontFamilyCss,
    effectScript: effectVariant?.standalone?.script ?? '',
    backgroundAnimationScript: backgroundAnimationConfig?.standalone?.script ?? '',
    textAnimationScript: textAnimationConfig?.standalone?.script ?? '',
    isNoteSubmitted,
    isTypewriter,
  })
}