/* src/letter/presets/love.tsx */
import MessageBox from '../components/message-boxes/MessageBox'
import YesButton from '../components/buttons/YesButton'
import NoButton from '../components/buttons/NoButton'
import Hearts from '../components/animations/Hearts'
import Confetti from '../components/animations/Confetti'
import Fireworks from '../components/animations/Fireworks'
import type { PresetProps } from './types'

const BACKGROUNDS = {
  pink: 'from-pink-100 via-purple-100 to-pink-200',
  blue: 'from-blue-100 via-cyan-100 to-blue-200',
  dark: 'from-gray-800 via-gray-900 to-black',
  warm: 'from-orange-100 via-yellow-100 to-red-100',
}

const ANIMATIONS = {
  hearts: Hearts,
  confetti: Confetti,
  fireworks: Fireworks,
  none: () => null,
}

export default function LovePreset({ message, recipientName, onReply, options = {} }: PresetProps) {
  const bg = BACKGROUNDS[options.background ?? 'blue']
  const Animation = ANIMATIONS[options.animation ?? 'hearts']
  const isDark = options.background === 'dark'

  return (
    <div className={`relative w-full min-h-[600px] bg-gradient-to-br ${bg} flex items-center justify-center p-6 overflow-hidden rounded-2xl`}>
      <Animation />
      <div className="relative z-10 max-w-xl w-full space-y-6">
        <h1 className={`text-2xl font-bold text-center ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>
          A letter for you, {recipientName} 💌
        </h1>
        <MessageBox style={options.messageBoxStyle ?? 'romantic'}>{message}</MessageBox>
        <div className="flex gap-4 justify-center items-center h-20 relative">
          <YesButton
            text={options.yesText ?? 'Yes 💕'}
            color={(options.yesColor as any) ?? 'green'}
            shape={(options.yesShape as any) ?? 'pill'}
            animation={(options.yesAnimation as any) ?? 'pulse'}
            onClick={() => onReply('yes')}
          />
          <NoButton
            text={options.noText ?? 'No'}
            color={(options.noColor as any) ?? 'gray'}
            shape={(options.noShape as any) ?? 'pill'}
            runaway={options.noRunaway ?? true}
            onClick={() => onReply('no')}
          />
        </div>
      </div>
    </div>
  )
}