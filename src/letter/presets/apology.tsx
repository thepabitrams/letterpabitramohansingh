/* src/presets/apology.tsx */
import MessageBox from '../components/message-boxes/MessageBox'
import YesButton from '../components/buttons/YesButton'
import type { PresetProps } from './types'

export default function ApologyPreset({ message, recipientName, onReply, options = {} }: PresetProps) {
  return (
    <div className="relative min-h-[500px] w-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-lg w-full space-y-6">
        <h1 className="text-xl font-semibold text-gray-700 text-center">
          {recipientName}, I owe you an apology
        </h1>
        <MessageBox style={options.messageBoxStyle ?? 'minimal'}>{message}</MessageBox>
        <div className="flex justify-center">
          <YesButton
            text={options.yesText ?? 'I forgive you'}
            color={(options.yesColor as any) ?? 'blue'}
            shape={(options.yesShape as any) ?? 'rounded'}
            animation={(options.yesAnimation as any) ?? 'none'}
            onClick={() => onReply('yes')}
          />
        </div>
      </div>
    </div>
  )
}