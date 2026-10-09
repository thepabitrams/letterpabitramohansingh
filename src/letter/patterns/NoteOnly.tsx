/* src/letter/patterns/NoteOnly.tsx */
import { useState } from 'react'
import { Background } from '../background'
import { Effect } from '../effect'
import { Text } from '../text'
import { MessageBox } from '../message-box'
import { Button } from '../button'
import { getTextVariant } from '../text'

export type NoteOnlyConfig = {
  header?: { enabled: boolean; text: string; variant: string; animation: string }
  message: string
  background: string
  effect: string
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  submitButton: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
}

type Props = {
  config: NoteOnlyConfig
  onReply?: (reply: string) => void
  onNote: (note: string) => void
  existingReply?: { reply: string; note: string } | null
  senderName?: string
  recipientName?: string
  preview?: boolean
}

export default function NoteOnly({ config, onNote, existingReply, senderName, recipientName, preview = false }: Props) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const isReplied = !!existingReply
  const replyNote = existingReply?.note ?? ''
  const textVariantConfig = getTextVariant(config.textVariant)

  const handleSubmit = async () => {
    if (preview || isReplied) return
    setSaving(true)
    await onNote(note)
    setSaving(false)
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
          <Text content={config.header.text} variant={config.header.variant} animation={config.header.animation} as="heading" />
        )}

        <MessageBox
          content={config.message}
          variant={config.messageBox.variant}
          animation={config.messageBox.animation}
          textVariant={config.textVariant}
          textAnimation={config.textAnimation}
        />

        {!isReplied && (
          <div className="space-y-3">
            <MessageBox
              content={note}
              variant={config.messageBox.variant}
              animation="fade"
              editable
              onChange={setNote}
              placeholder="Write your reply..."
            />
            <div className="flex justify-center">
              <Button
                text={saving ? 'Saving...' : config.submitButton.text}
                color={config.submitButton.color as any}
                shape={config.submitButton.shape as any}
                size={config.submitButton.size as any}
                variant={config.submitButton.variant}
                animation={config.submitButton.animation}
                onClick={handleSubmit}
              />
            </div>
          </div>
        )}

        {isReplied && (
          <div className="text-center space-y-2 pt-1">
            <p className="text-xs tracking-[0.2em] text-gray-600 font-semibold">
              <span className="uppercase">{recipientName}</span> Replied
            </p>
            {replyNote && (
              <div className={`${textVariantConfig?.bodyClass ?? 'text-base text-gray-700 leading-relaxed'} italic`}>
                "{replyNote}"
              </div>
            )}
          </div>
        )}
      </div>
    </Background>
  )
}