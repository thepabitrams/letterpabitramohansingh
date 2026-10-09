import { useState } from 'react'
import { Background } from '../background'
import { Effect } from '../effect'
import { Text } from '../text'
import { MessageBox } from '../message-box'
import { Button } from '../button'

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
  onReply: (reply: string, note: string) => void
  preview?: boolean
}

export default function NoteOnly({ config, onReply, preview = false }: Props) {
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (preview) return
    onReply('note', note)
  }

  return (
    <Background variant={config.background}>
      <Effect variant={config.effect} />
      <div className="relative z-10 max-w-md w-full space-y-4">
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
              text={config.submitButton.text}
              color={config.submitButton.color as any}
              shape={config.submitButton.shape as any}
              size={config.submitButton.size as any}
              variant={config.submitButton.variant}
              animation={config.submitButton.animation}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Background>
  )
}