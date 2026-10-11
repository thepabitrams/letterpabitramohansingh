// src/letter/patterns/TwoChoice.tsx 
import { useState } from 'react'
import { Background } from '../background'
import { Effect } from '../effect'
import { Text, getTextVariant } from '../text'
import { MessageBox } from '../message-box'
import { Button } from '../button'

interface EffectOptions {
  senderLabel?: string
  recipientLabel?: string
  hideLabels?: string
}

interface ButtonConfig {
  text: string
  color: string
  shape: string
  size: string
  variant: string
  animation: string
}

export interface TwoChoiceConfig {
  header?: { enabled: boolean; text: string; variant: string; animation: string }
  message: string
  background: string
  backgroundAnimation: string
  effect: string
  effectOptions?: EffectOptions
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  buttons: { yes: ButtonConfig; no: ButtonConfig }
  submitButton: ButtonConfig
}

interface TwoChoiceProps {
  config: TwoChoiceConfig
  onReply: (reply: string) => void
  onNote: (note: string) => void
  existingReply?: { reply: string; note: string | null } | null
  senderName?: string
  recipientName?: string
  preview?: boolean
}

export default function TwoChoice({
  config,
  onReply,
  onNote,
  existingReply,
  senderName,
  recipientName,
  preview = false,
}: TwoChoiceProps) {
  const [noteText, setNoteText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const hasReplied = !!existingReply
  const isNotePending = hasReplied && existingReply.note === null
  const isNoteSubmitted = hasReplied && existingReply.note !== null
  const replyText = existingReply?.reply ?? ''
  const replyNoteText = existingReply?.note?.trim() ?? ''
  const textVariantConfig = getTextVariant(config.textVariant)

  const showChoiceButtons = !hasReplied || preview
  const showNoteArea = isNotePending || preview

  const handleChoiceClick = async (buttonText: string): Promise<void> => {
    if (preview || hasReplied) return
    setIsSaving(true)
    await onReply(buttonText)
    setIsSaving(false)
  }

  const handleSubmitNote = async (): Promise<void> => {
    if (preview || isNoteSubmitted) return
    setIsSaving(true)
    await onNote(noteText)
    setIsSaving(false)
  }

  return (
    <Background variant={config.background} animation={config.backgroundAnimation}>
      <Effect
        variant={config.effect}
        senderName={senderName}
        recipientName={recipientName}
        effectOptions={config.effectOptions}
      />
      <div className="relative z-10 max-w-md w-full space-y-4">
        {senderName && (
          <p className="text-center text-xs tracking-[0.3em] text-gray-500 font-semibold">
            From <span className="uppercase">{senderName}</span>
          </p>
        )}

        {config.header?.enabled && (
          <Text
            content={config.header.text}
            variant={config.header.variant}
            animation={config.header.animation}
            as="heading"
          />
        )}

        <MessageBox
          content={config.message}
          variant={config.messageBox.variant}
          animation={config.messageBox.animation}
          textVariant={config.textVariant}
          textAnimation={config.textAnimation}
        />

        {showChoiceButtons && (
          <div className="flex gap-4 justify-center items-center pt-2">
            <Button
              text={config.buttons.yes.text}
              color={config.buttons.yes.color as any}
              shape={config.buttons.yes.shape as any}
              size={config.buttons.yes.size as any}
              variant={config.buttons.yes.variant}
              animation={config.buttons.yes.animation}
              onClick={() => handleChoiceClick(config.buttons.yes.text)}
            />
            <Button
              text={config.buttons.no.text}
              color={config.buttons.no.color as any}
              shape={config.buttons.no.shape as any}
              size={config.buttons.no.size as any}
              variant={config.buttons.no.variant}
              animation={config.buttons.no.animation}
              onClick={() => handleChoiceClick(config.buttons.no.text)}
            />
          </div>
        )}

        {showNoteArea && (
          <div className="space-y-3">
            <MessageBox
              content={noteText}
              variant={config.messageBox.variant}
              animation="fade"
              editable
              readOnly={preview}
              onChange={setNoteText}
              placeholder={
                preview
                  ? 'Recipient writes here...'
                  : `You chose "${replyText}". Add a note? (optional)`
              }
            />
            <div className="flex justify-center">
              <Button
                text={isSaving ? 'Submitting...' : config.submitButton.text}
                color={config.submitButton.color as any}
                shape={config.submitButton.shape as any}
                size={config.submitButton.size as any}
                variant={config.submitButton.variant}
                animation={config.submitButton.animation}
                onClick={handleSubmitNote}
              />
            </div>
          </div>
        )}

        {isNoteSubmitted && (
          <div className="text-center space-y-2 pt-1">
            <p className="text-xs tracking-[0.2em] text-gray-600 font-semibold">
              <span className="uppercase">{recipientName}</span> Replied{' '}
              <span className="text-pink-600">{replyText}</span>
            </p>
            {replyNoteText && (
              <div
                className={`${textVariantConfig?.bodyClass ?? 'text-base text-gray-700 leading-relaxed'} italic`}
              >
                &ldquo;{replyNoteText}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    </Background>
  )
}