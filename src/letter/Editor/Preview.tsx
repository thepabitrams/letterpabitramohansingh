/* src/letter/Editor/Preview.tsx */
import { PRESETS } from '../presets'
import type { PresetId, LetterConfig } from '../presets/types'

type Props = {
  preset: PresetId
  message: string
  senderName: string
  recipientName: string
  config: LetterConfig
}

export function Preview({ preset, message, senderName, recipientName, config }: Props) {
  const PresetComponent = PRESETS[preset]

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white h-full flex">
      <div className="flex-1 flex">
        <PresetComponent
          message={message || 'Your beautiful letter will appear here...'}
          senderName={senderName || 'You'}
          recipientName={recipientName || 'Her'}
          onReply={() => {}}
          options={config}
        />
      </div>
    </div>
  )
}