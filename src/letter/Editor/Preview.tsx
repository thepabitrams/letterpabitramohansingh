/* src/letter/editor/Preview.tsx */
import { PATTERNS, type PatternId } from '../patterns'

type PreviewProps = {
  pattern: PatternId
  message: string
  config: any
}

export function Preview({ pattern, message, config }: PreviewProps) {
  const PatternComponent = PATTERNS[pattern]

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white flex">
      <div className="flex-1 flex">
        <PatternComponent
          config={{
            ...config,
            message: message || 'Your beautiful letter will appear here...',
          }}
          onReply={() => {}}
          onNote={() => {}}
          preview
        />
      </div>
    </div>
  )
}

export default Preview