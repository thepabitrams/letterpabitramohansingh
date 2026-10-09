/* src/letter/editor/index.tsx */
import type { PatternId } from '../patterns'
import { BackgroundPicker } from './BackgroundPicker'
import { EffectPicker } from './EffectPicker'
import { TextPicker } from './TextPicker'
import { MessageBoxPicker } from './MessageBoxPicker'
import { ButtonPicker } from './ButtonPicker'
import { Preview } from './Preview'

type EditorProps = {
  pattern: PatternId
  message: string
  senderName: string
  recipientName: string
  config: any
  update: (key: string, value: any) => void
}

export function Editor({ pattern, message, config, update }: EditorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <div className="flex flex-col gap-4">
        <BackgroundPicker
          value={config.background}
          onChange={(newValue) => update('background', newValue)}
        />
        <EffectPicker
          value={config.effect}
          onChange={(newValue) => update('effect', newValue)}
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
            onNoChange={(newConfig) => update('buttons', { ...config.buttons, no: newConfig })}
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

      <Preview pattern={pattern} message={message} config={config} />
    </div>
  )
}

export default Editor