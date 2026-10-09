/* src/letter/editor/index.tsx */
import type { PatternId } from '../patterns'
import { BackgroundPicker } from './BackgroundPicker'
import { EffectPicker } from './EffectPicker'
import { TextPicker } from './TextPicker'
import { MessageBoxPicker } from './MessageBoxPicker'
import { ButtonPicker } from './ButtonPicker'
import { Preview } from './Preview'

type Props = {
  pattern: PatternId
  message: string
  senderName: string
  recipientName: string
  config: any
  update: (key: string, value: any) => void
}

export function Editor({ pattern, message, config, update }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <div className="flex flex-col gap-4">
        <BackgroundPicker value={config.background} onChange={(v) => update('background', v)} />
        <EffectPicker value={config.effect} onChange={(v) => update('effect', v)} />
        <TextPicker
          variant={config.textVariant}
          animation={config.textAnimation}
          onVariantChange={(v) => update('textVariant', v)}
          onAnimationChange={(v) => update('textAnimation', v)}
        />
        <MessageBoxPicker
          variant={config.messageBox.variant}
          animation={config.messageBox.animation}
          onVariantChange={(v) => update('messageBox', { ...config.messageBox, variant: v })}
          onAnimationChange={(v) => update('messageBox', { ...config.messageBox, animation: v })}
        />

        {pattern === 'two-choice' && (
          <ButtonPicker
            pattern="two-choice"
            yes={config.buttons.yes}
            no={config.buttons.no}
            submit={config.submitButton}
            onYesChange={(c) => update('buttons', { ...config.buttons, yes: c })}
            onNoChange={(c) => update('buttons', { ...config.buttons, no: c })}
            onSubmitChange={(c) => update('submitButton', c)}
          />
        )}

        {pattern === 'one-choice' && (
          <ButtonPicker
            pattern="one-choice"
            single={config.button}
            submit={config.submitButton}
            onSingleChange={(c) => update('button', c)}
            onSubmitChange={(c) => update('submitButton', c)}
          />
        )}

        {pattern === 'note-only' && (
          <ButtonPicker
            pattern="note-only"
            submit={config.submitButton}
            onSubmitChange={(c) => update('submitButton', c)}
          />
        )}
      </div>

      <Preview pattern={pattern} message={message} config={config} />
    </div>
  )
}

export default Editor