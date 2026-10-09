/* src/letter/editor/ButtonEditor.tsx */
import { useState } from 'react'
import { Card, Button, Input } from '../../core/components/ui'
import { COLORS, type ColorKey } from '../tokens/colors'
import { SHAPES, type ShapeKey } from '../tokens/shapes'
import { ANIMATIONS, type AnimationKey } from '../tokens/animations'
import type { LetterConfig } from '../presets/types'

const COLOR_HEX: Record<ColorKey, string> = {
  green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
  pink: '#ec4899', purple: '#a855f7', gray: '#6b7280',
}

type Props = {
  config: LetterConfig
  update: (key: keyof LetterConfig, value: any) => void
}

export function ButtonEditor({ config, update }: Props) {
  const [tab, setTab] = useState<'yes' | 'no'>('yes')

  return (
    <Card title="Buttons">
      <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setTab('yes')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === 'yes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Yes Button
        </button>
        <button
          onClick={() => setTab('no')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === 'no' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          No Button
        </button>
      </div>

      {tab === 'yes' ? (
        <div className="space-y-4">
          <Input label="Text" value={config.yesText ?? ''} onChange={(v) => update('yesText', v)} placeholder="Yes" />

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(COLORS) as ColorKey[]).map((c) => (
                <button
                  key={c}
                  onClick={() => update('yesColor', c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    config.yesColor === c ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: COLOR_HEX[c] }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">Shape</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SHAPES) as ShapeKey[]).map((s) => (
                <Button key={s} onClick={() => update('yesShape', s)} variant={config.yesShape === s ? 'active' : 'outline'}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">Animation</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ANIMATIONS) as AnimationKey[]).map((a) => (
                <Button key={a} onClick={() => update('yesAnimation', a)} variant={config.yesAnimation === a ? 'active' : 'outline'}>
                  {a}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input label="Text" value={config.noText ?? ''} onChange={(v) => update('noText', v)} placeholder="No" />

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(COLORS) as ColorKey[]).map((c) => (
                <button
                  key={c}
                  onClick={() => update('noColor', c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    config.noColor === c ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: COLOR_HEX[c] }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">Shape</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SHAPES) as ShapeKey[]).map((s) => (
                <Button key={s} onClick={() => update('noShape', s)} variant={config.noShape === s ? 'active' : 'outline'}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              checked={config.noRunaway}
              onChange={(e) => update('noRunaway', e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            Run away on hover
          </label>
        </div>
      )}
    </Card>
  )
}