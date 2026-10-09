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
    yes: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
    no: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
  }
  submitButton: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
}

type Props = {
  config: TwoChoiceConfig
  onReply: (reply: string, note: string) => void
  preview?: boolean
}

type Step = 'choice' | 'note' | 'done'

export default function TwoChoice({ config, onReply, preview = false }: Props) {
  const [step, setStep] = useState<Step>('choice')
  const [choice, setChoice] = useState('')
  const [note, setNote] = useState('')

  const showChoice = preview || step === 'choice'
  const showNote = preview || step === 'note'

  const handleButton = (buttonText: string) => {
    if (preview) return
    setChoice(buttonText)
    setStep('note')
  }

  const handleSubmit = () => {
    if (preview) return
    setStep('done')
    onReply(choice, note)
  }

  const handleSkip = () => {
    if (preview) return
    setStep('done')
    onReply(choice, '')
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

        {showChoice && (
          <div className="flex gap-4 justify-center items-center pt-2">
            <Button
              text={config.buttons.yes.text}
              color={config.buttons.yes.color as any}
              shape={config.buttons.yes.shape as any}
              size={config.buttons.yes.size as any}
              variant={config.buttons.yes.variant}
              animation={config.buttons.yes.animation}
              onClick={() => handleButton(config.buttons.yes.text)}
            />
            <Button
              text={config.buttons.no.text}
              color={config.buttons.no.color as any}
              shape={config.buttons.no.shape as any}
              size={config.buttons.no.size as any}
              variant={config.buttons.no.variant}
              animation={config.buttons.no.animation}
              onClick={() => handleButton(config.buttons.no.text)}
            />
          </div>
        )}

        {showNote && (
          <div className="space-y-3">
            <MessageBox
              content={note}
              variant={config.messageBox.variant}
              animation="fade"
              editable
              onChange={setNote}
              placeholder={preview ? 'Recipient writes here...' : `You chose "${choice}". Add a note? (optional)`}
            />
            <div className="flex gap-3 justify-center">
              {!preview && (
                <button
                  onClick={handleSkip}
                  className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Skip
                </button>
              )}
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
        )}
      </div>
    </Background>
  )
}