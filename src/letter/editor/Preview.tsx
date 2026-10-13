// src/letter/editor/Preview.tsx
import { PATTERNS, type PatternId } from '../patterns'

interface ButtonConfig {
  text: string
  color: string
  shape: string
  size: string
  variant: string
  animation: string
}

interface EffectOptions {
  senderLabel?: string
  recipientLabel?: string
  hideLabels?: string
}

interface LetterConfig {
  background: string
  backgroundAnimation: string
  effect: string
  effectOptions?: EffectOptions
  textVariant: string
  textAnimation: string
  messageBox: { variant: string; animation: string }
  header: { enabled: boolean; text: string; variant: string; animation: string }
  buttons: { yes: ButtonConfig; no: ButtonConfig }
  button: ButtonConfig
  submitButton: ButtonConfig
}

interface PreviewProps {
  pattern: PatternId
  message: string
  senderName?: string
  recipientName?: string
  config: LetterConfig
}

export function Preview({
  pattern,
  message,
  senderName,
  recipientName,
  config,
}: PreviewProps) {
  const PatternComponent = PATTERNS[pattern] as unknown as React.ComponentType<{
    config: LetterConfig & { message: string }
    onReply: () => void
    onNote: () => void
    senderName?: string
    recipientName?: string
    preview?: boolean
  }>

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex transition-colors">
      <div className="flex-1 flex">
        <PatternComponent
          config={{
            ...config,
            message: message || 'Your beautiful letter will appear here...',
          }}
          onReply={() => {}}
          onNote={() => {}}
          senderName={senderName}
          recipientName={recipientName}
          preview
        />
      </div>
    </div>
  )
}

export default Preview