/* src/letter/editor/StylePicker.tsx */
import { Card, Button } from '../../core/components/ui'
import type { LetterConfig } from '../presets/types'

const BACKGROUNDS = ['pink', 'blue', 'dark', 'warm'] as const
const MAIN_ANIMATIONS = ['hearts', 'confetti', 'fireworks', 'none'] as const
const BOX_STYLES = ['romantic', 'minimal', 'vintage'] as const

type Props = {
  config: LetterConfig
  update: (key: keyof LetterConfig, value: any) => void
}

export function StylePicker({ config, update }: Props) {
  return (
    <Card title="Style">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Background</h3>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map((b) => (
              <Button
                key={b}
                onClick={() => update('background', b)}
                variant={config.background === b ? 'active' : 'outline'}
              >
                {b}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Animation</h3>
          <div className="flex flex-wrap gap-2">
            {MAIN_ANIMATIONS.map((a) => (
              <Button
                key={a}
                onClick={() => update('animation', a)}
                variant={config.animation === a ? 'active' : 'outline'}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Message Box</h3>
          <div className="flex flex-wrap gap-2">
            {BOX_STYLES.map((s) => (
              <Button
                key={s}
                onClick={() => update('messageBoxStyle', s)}
                variant={config.messageBoxStyle === s ? 'active' : 'outline'}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}