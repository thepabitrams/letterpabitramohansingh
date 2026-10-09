/* src/letter/Editor/index.tsx */
import type { PresetId, LetterConfig } from '../presets/types'
import { StylePicker } from './StylePicker'
import { ButtonEditor } from './ButtonEditor'
import { Preview } from './Preview'

type Props = {
  preset: PresetId
  message: string
  senderName: string
  recipientName: string
  config: LetterConfig
  update: (key: keyof LetterConfig, value: any) => void
}

export function Editor({
  preset,
  message,
  senderName,
  recipientName,
  config,
  update,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <div className="space-y-6">
        <StylePicker config={config} update={update} />
        <ButtonEditor config={config} update={update} />
      </div>
      <Preview
        preset={preset}
        message={message}
        senderName={senderName}
        recipientName={recipientName}
        config={config}
      />
    </div>
  )
}