/* src/presets/types.ts */
export type PresetProps = {
  message: string
  senderName: string
  recipientName: string
  onReply: (reply: 'yes' | 'no') => void
  options?: {
    background?: 'pink' | 'blue' | 'dark' | 'warm'
    animation?: 'hearts' | 'confetti' | 'fireworks' | 'none'
    messageBoxStyle?: 'romantic' | 'minimal' | 'vintage'
    yesText?: string
    yesColor?: string
    yesShape?: string
    yesAnimation?: string
    noText?: string
    noColor?: string
    noShape?: string
    noRunaway?: boolean
  }
}

export type PresetId = 'love' | 'apology'

export type LetterConfig = NonNullable<PresetProps['options']>