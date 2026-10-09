import { useState } from 'react'
import { Accordion, Button, Input } from '../../core/components/ui'
import { COLORS, type ColorKey } from '../tokens/colors'
import { SHAPES, type ShapeKey } from '../tokens/shapes'
import { SIZES, type SizeKey } from '../tokens/sizes'
import { BUTTON_VARIANTS, BUTTON_MOTION_ANIMATIONS, BUTTON_TRIGGER_ANIMATIONS } from '../button'

type ButtonConfig = {
  text: string
  color: string
  shape: string
  size: string
  variant: string
  animation: string
}

type Props = {
  pattern: 'two-choice' | 'one-choice'
  yes?: ButtonConfig
  no?: ButtonConfig
  single?: ButtonConfig
  onYesChange?: (config: ButtonConfig) => void
  onNoChange?: (config: ButtonConfig) => void
  onSingleChange?: (config: ButtonConfig) => void
}

export function ButtonPicker({ pattern, yes, no, single, onYesChange, onNoChange, onSingleChange }: Props) {
  const [tab, setTab] = useState<'yes' | 'no'>('yes')
  const isTwoChoice = pattern === 'two-choice'

  const current = isTwoChoice ? (tab === 'yes' ? yes! : no!) : single!
  const onChange = isTwoChoice ? (tab === 'yes' ? onYesChange! : onNoChange!) : onSingleChange!

  const update = (key: keyof ButtonConfig, value: string) => {
    onChange({ ...current, [key]: value })
  }

  const subtitle = isTwoChoice
    ? `${yes?.text ?? ''} / ${no?.text ?? ''}`
    : single?.text ?? ''

  return (
    <Accordion title="Buttons" subtitle={subtitle}>
      {isTwoChoice && (
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setTab('yes')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              tab === 'yes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Button 1
          </button>
          <button
            onClick={() => setTab('no')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              tab === 'no' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Button 2
          </button>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Text"
          value={current.text}
          onChange={(v) => update('text', v)}
          placeholder="Yes"
        />

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(COLORS) as ColorKey[]).map((c) => (
              <button
                key={c}
                onClick={() => update('color', c)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  current.color === c ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: COLORS[c].hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Shape</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SHAPES) as ShapeKey[]).map((s) => (
              <Button
                key={s}
                onClick={() => update('shape', s)}
                variant={current.shape === s ? 'active' : 'outline'}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SIZES) as SizeKey[]).map((s) => (
              <Button
                key={s}
                onClick={() => update('size', s)}
                variant={current.size === s ? 'active' : 'outline'}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Variant</label>
          <div className="flex flex-wrap gap-2">
            {BUTTON_VARIANTS.map((v) => (
              <Button
                key={v.id}
                onClick={() => update('variant', v.id)}
                variant={current.variant === v.id ? 'active' : 'outline'}
              >
                {v.config?.name ?? v.id}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            {isTwoChoice && tab === 'no' ? 'Animation (Trigger)' : 'Animation (Motion)'}
          </label>
          <div className="flex flex-wrap gap-2">
            {(isTwoChoice && tab === 'no'
              ? BUTTON_TRIGGER_ANIMATIONS
              : BUTTON_MOTION_ANIMATIONS
            ).map((a) => (
              <Button
                key={a.id}
                onClick={() => update('animation', a.id)}
                variant={current.animation === a.id ? 'active' : 'outline'}
              >
                {a.config?.name ?? a.id}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Accordion>
  )
}