/* src/letter/patterns/OneChoice.tsx */
import { useState } from 'react'
import { Background } from '../background'
import { Effect } from '../effect'
import { Text } from '../text'
import { MessageBox } from '../message-box'
import { Button } from '../button'
import { getTextVariant } from '../text'

export type OneChoiceConfig = {
  header?: { enabled: boolean; text: string; variant: string; animation: string }
  message: string
  background: string
  backgroundAnimation: string
  effect: string
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  button: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
  submitButton: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
}

type OneChoiceProps = {
  config: OneChoiceConfig
  onReply: (reply: string) => void
  onNote: (note: string) => void
  existingReply?: { reply: string; note: string | null } | null
  senderName?: string
  recipientName?: string
  preview?: boolean
}

export default function OneChoice({
  config,
  onReply,
  onNote,
  existingReply,
  senderName,
  recipientName,
  preview = false,
}: OneChoiceProps) {
  const [noteText, setNoteText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const hasReplied = !!existingReply
  const isNotePending = hasReplied && existingReply.note === null
  const isNoteSubmitted = hasReplied && existingReply.note !== null
  const replyText = existingReply?.reply ?? ''
  const replyNoteText = existingReply?.note ?? ''
  const textVariantConfig = getTextVariant(config.textVariant)

  const handleChoiceClick = async () => {
    if (preview || hasReplied) return
    setIsSaving(true)
    await onReply(config.button.text)
    setIsSaving(false)
  }

  const handleSubmitNote = async () => {
    if (preview || isNoteSubmitted) return
    setIsSaving(true)
    await onNote(noteText)
    setIsSaving(false)
  }

  return (
    <Background variant={config.background} animation={config.backgroundAnimation}>
      <Effect variant={config.effect} />
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

        {!hasReplied && (
          <div className="flex justify-center items-center pt-2">
            <Button
              text={config.button.text}
              color={config.button.color as any}
              shape={config.button.shape as any}
              size={config.button.size as any}
              variant={config.button.variant}
              animation={config.button.animation}
              onClick={handleChoiceClick}
            />
          </div>
        )}

        {isNotePending && (
          <div className="space-y-3">
            <MessageBox
              content={noteText}
              variant={config.messageBox.variant}
              animation="fade"
              editable
              onChange={setNoteText}
              placeholder={preview ? 'Recipient writes here...' : 'Add a note? (optional)'}
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
                "{replyNoteText}"
              </div>
            )}
          </div>
        )}
      </div>
    </Background>
  )
}