import { useState } from 'react'
import { Background } from '../background'
import { Effect } from '../effect'
import { Text } from '../text'
import { MessageBox } from '../message-box'
import { Button } from '../button'

export type TwoChoiceConfig = {
  header?: { enabled: boolean; text: string; variant: string; animation: string }
  message: string
  background: string
  effect: string
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  buttons: {
    yes: {
      text: string
      color: string
      shape: string
      size: string
      variant: string
      animation: string
    }
    no: {
      text: string
      color: string
      shape: string
      size: string
      variant: string
      animation: string
    }
  }
}

type Props = {
  config: TwoChoiceConfig
  onReply: (reply: string, note: string) => void
}

export default function TwoChoice({ config, onReply }: Props) {
  const [note, setNote] = useState('')
  const [replied, setReplied] = useState(false)

  const handleClick = (buttonText: string) => {
    if (replied) return
    setReplied(true)
    onReply(buttonText, note)
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
            text={config.buttons.yes.text}
            color={config.buttons.yes.color as any}
            shape={config.buttons.yes.shape as any}
            size={config.buttons.yes.size as any}
            variant={config.buttons.yes.variant}
            animation={config.buttons.yes.animation}
            onClick={() => handleClick(config.buttons.yes.text)}
          />
          <Button
            text={config.buttons.no.text}
            color={config.buttons.no.color as any}
            shape={config.buttons.no.shape as any}
            size={config.buttons.no.size as any}
            variant={config.buttons.no.variant}
            animation={config.buttons.no.animation}
            onClick={() => handleClick(config.buttons.no.text)}
          />
        </div>
      </div>
    </Background>
  )
}