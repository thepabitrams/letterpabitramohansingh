/* src/letter/patterns/TwoChoice.tsx */
import { useState } from 'react'
import { Background } from '../background'
import { Effect } from '../effect'
import { Text } from '../text'
import { MessageBox } from '../message-box'
import { Button } from '../button'
import { getTextVariant } from '../text'

export type TwoChoiceConfig = {
  header?: { enabled: boolean; text: string; variant: string; animation: string }
  message: string
  background: string
  effect: string
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  buttons: {
    yes: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
    no: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
  }
  submitButton: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
}

type TwoChoiceProps = {
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
  const replyNoteText = existingReply?.note ?? ''
  const textVariantConfig = getTextVariant(config.textVariant)

  const handleChoiceClick = async (buttonText: string) => {
    if (preview || hasReplied) return
    setIsSaving(true)
    await onReply(buttonText)
    setIsSaving(false)
  }

  const handleSubmitNote = async () => {
    if (preview || isNoteSubmitted) return
    setIsSaving(true)
    await onNote(noteText)
    setIsSaving(false)
  }

  return (
    <Background variant={config.background}>
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

        {isNotePending && (
          <div className="space-y-3">
            <MessageBox
              content={noteText}
              variant={config.messageBox.variant}
              animation="fade"
              editable
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
                "{replyNoteText}"
              </div>
            )}
          </div>
        )}
      </div>
    </Background>
  )
}