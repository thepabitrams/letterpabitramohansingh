/* src/letter/editor/index.tsx */
import type { PatternId } from '../patterns'
import { BackgroundPicker } from './BackgroundPicker'
import { EffectPicker } from './EffectPicker'
import { TextPicker } from './TextPicker'
import { MessageBoxPicker } from './MessageBoxPicker'
import { ButtonPicker } from './ButtonPicker'
import { Preview } from './Preview'

interface EffectOptions {
  senderLabel?: string
  recipientLabel?: string
  hideLabels?: string
}

interface EditorConfig {
  background: string
  backgroundAnimation: string
  effect: string
  effectOptions?: EffectOptions
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  header: { enabled: boolean; text: string; variant: string; animation: string }
  buttons: {
    yes: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
    no: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
  }
  button: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
  submitButton: { text: string; color: string; shape: string; size: string; variant: string; animation: string }
}

interface EditorProps {
  pattern: PatternId
  message: string
  senderName: string
  recipientName: string
  config: EditorConfig
  update: (key: string, value: unknown) => void
}

export function Editor({
  pattern,
  message,
  senderName,
  recipientName,
  config,
  update,
}: EditorProps) {
  const handleEffectOptionChange = (key: string, value: string): void => {
    update('effectOptions', { ...(config.effectOptions ?? {}), [key]: value })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <div className="flex flex-col gap-4">
        <BackgroundPicker
          variant={config.background}
          animation={config.backgroundAnimation}
          onVariantChange={(newVariant) => update('background', newVariant)}
          onAnimationChange={(newAnimation) => update('backgroundAnimation', newAnimation)}
        />
        <EffectPicker
          value={config.effect}
          senderName={senderName}
          recipientName={recipientName}
          effectOptions={config.effectOptions}
          onChange={(newValue) => update('effect', newValue)}
          onEffectOptionChange={handleEffectOptionChange}
        />
        <TextPicker
          variant={config.textVariant}
          animation={config.textAnimation}
          onVariantChange={(newVariant) => update('textVariant', newVariant)}
          onAnimationChange={(newAnimation) => update('textAnimation', newAnimation)}
        />
        <MessageBoxPicker
          variant={config.messageBox.variant}
          animation={config.messageBox.animation}
          onVariantChange={(newVariant) =>
            update('messageBox', { ...config.messageBox, variant: newVariant })
          }
          onAnimationChange={(newAnimation) =>
            update('messageBox', { ...config.messageBox, animation: newAnimation })
          }
        />

        {pattern === 'two-choice' && (
          <ButtonPicker
            pattern="two-choice"
            yes={config.buttons.yes}
            no={config.buttons.no}
            submit={config.submitButton}
            onYesChange={(newConfig) =>
              update('buttons', { ...config.buttons, yes: newConfig })
            }
            onNoChange={(newConfig) =>
              update('buttons', { ...config.buttons, no: newConfig })
            }
            onSubmitChange={(newConfig) => update('submitButton', newConfig)}
          />
        )}

        {pattern === 'one-choice' && (
          <ButtonPicker
            pattern="one-choice"
            single={config.button}
            submit={config.submitButton}
            onSingleChange={(newConfig) => update('button', newConfig)}
            onSubmitChange={(newConfig) => update('submitButton', newConfig)}
          />
        )}

        {pattern === 'note-only' && (
          <ButtonPicker
            pattern="note-only"
            submit={config.submitButton}
            onSubmitChange={(newConfig) => update('submitButton', newConfig)}
          />
        )}
      </div>

      <Preview
        pattern={pattern}
        message={message}
        senderName={senderName}
        recipientName={recipientName}
        config={config}
      />
    </div>
  )
}

export default Editor