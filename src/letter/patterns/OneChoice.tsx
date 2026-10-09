import { useState } from 'react'
import { Background } from '../background'
import { Effect } from '../effect'
import { Text } from '../text'
import { MessageBox } from '../message-box'
import { Button } from '../button'

export type OneChoiceConfig = {
  header?: { enabled: boolean; text: string; variant: string; animation: string }
  message: string
  background: string
  effect: string
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  button: {
    text: string
    color: string
    shape: string
    size: string
    variant: string
    animation: string
  }
}

type Props = {
  config: OneChoiceConfig
  onReply: (reply: string, note: string) => void
}

export default function OneChoice({ config, onReply }: Props) {
  const [note, setNote] = useState('')
  const [replied, setReplied] = useState(false)

  const handleClick = () => {
    if (replied) return
    setReplied(true)
    onReply(config.button.text, note)
  }

  return (
    <Background variant={config.background}>
      <Effect variant={config.effect} />
      <div className="relative z-10 max-w-xl w-full space-y-6">
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
        />

        <div className="flex gap-4 justify-center items-center h-24 relative">
          <Button
            text={config.button.text}
            color={config.button.color as any}
            shape={config.button.shape as any}
            size={config.button.size as any}
            variant={config.button.variant}
            animation={config.button.animation}
            onClick={handleClick}
          />
        </div>
      </div>
    </Background>
  )
}