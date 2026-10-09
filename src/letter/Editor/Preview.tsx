/* src/letter/editor/Preview.tsx */
import { PATTERNS, type PatternId } from '../patterns'

type PreviewProps = {
  pattern: PatternId
  message: string
  config: any
  onReply?: (reply: string, note: string) => void
}

export function Preview({ pattern, message, config, onReply }: PreviewProps) {
  const PatternComponent = PATTERNS[pattern]

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white flex">
      <div className="flex-1 flex">
        <PatternComponent
          config={{
            ...config,
            message: message || 'Your beautiful letter will appear here...',
          }}
          onReply={onReply ?? (() => {})}
          preview
        />
      </div>
    </div>
  )
}

export default Preview