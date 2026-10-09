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
  button: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
  submitButton: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
}

type Props = {
  config: OneChoiceConfig
  onReply: (reply: string, note: string) => void
  preview?: boolean
}

type Step = 'choice' | 'note' | 'done'

export default function OneChoice({ config, onReply, preview = false }: Props) {
  const [step, setStep] = useState<Step>('choice')
  const [note, setNote] = useState('')

  const showChoice = preview || step === 'choice'
  const showNote = preview || step === 'note'

  const handleButton = () => {
    if (preview) return
    setStep('note')
  }

  const handleSubmit = () => {
    if (preview) return
    setStep('done')
    onReply(config.button.text, note)
  }

  const handleSkip = () => {
    if (preview) return
    setStep('done')
    onReply(config.button.text, '')
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
          <div className="flex justify-center items-center pt-2">
            <Button
              text={config.button.text}
              color={config.button.color as any}
              shape={config.button.shape as any}
              size={config.button.size as any}
              variant={config.button.variant}
              animation={config.button.animation}
              onClick={handleButton}
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
              placeholder={preview ? 'Recipient writes here...' : 'Add a note? (optional)'}
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