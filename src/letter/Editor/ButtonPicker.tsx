import { useState, useEffect } from 'react'
import { Accordion, Button, Input } from '../../core/components/ui'
import { COLORS, type ColorKey } from '../tokens/colors'
import { SHAPES, type ShapeKey } from '../tokens/shapes'
import { SIZES, type SizeKey } from '../tokens/sizes'
import { BUTTON_VARIANTS, BUTTON_MOTION_ANIMATIONS, BUTTON_TRIGGER_ANIMATIONS } from '../button'
import type { PatternId } from '../patterns'

type ButtonConfig = {
  text: string
  color: string
  shape: string
  size: string
  variant: string
  animation: string
}

type Props = {
  pattern: PatternId
  yes?: ButtonConfig
  no?: ButtonConfig
  single?: ButtonConfig
  submit: ButtonConfig
  onYesChange?: (config: ButtonConfig) => void
  onNoChange?: (config: ButtonConfig) => void
  onSingleChange?: (config: ButtonConfig) => void
  onSubmitChange: (config: ButtonConfig) => void
}

export function ButtonPicker({
  pattern,
  yes,
  no,
  single,
  submit,
  onYesChange,
  onNoChange,
  onSingleChange,
  onSubmitChange,
}: Props) {
  const isTwoChoice = pattern === 'two-choice'
  const isOneChoice = pattern === 'one-choice'
  const isNoteOnly = pattern === 'note-only'

  const [tab, setTab] = useState<'yes' | 'no' | 'submit'>(
    isTwoChoice ? 'yes' : isOneChoice ? 'yes' : 'submit'
  )

  // Reset tab when pattern changes
  useEffect(() => {
    setTab(isTwoChoice ? 'yes' : isOneChoice ? 'yes' : 'submit')
  }, [pattern, isTwoChoice, isOneChoice])

  const getCurrent = (): ButtonConfig => {
    if (tab === 'yes' && isTwoChoice) return yes!
    if (tab === 'no' && isTwoChoice) return no!
    if (tab === 'yes' && isOneChoice) return single!
    return submit
  }

  const getOnChange = () => {
    if (tab === 'yes' && isTwoChoice) return onYesChange!
    if (tab === 'no' && isTwoChoice) return onNoChange!
    if (tab === 'yes' && isOneChoice) return onSingleChange!
    return onSubmitChange
  }

  const current = getCurrent()
  const onChange = getOnChange()

  const update = (key: keyof ButtonConfig, value: string) => {
    onChange({ ...current, [key]: value })
  }

  const subtitle = isTwoChoice
    ? `${yes?.text ?? ''} / ${no?.text ?? ''}`
    : isOneChoice
    ? single?.text ?? ''
    : submit?.text ?? ''

  // Tabs
  const tabs: { id: 'yes' | 'no' | 'submit'; label: string }[] = []
  if (isTwoChoice) {
    tabs.push({ id: 'yes', label: 'Button 1' })
    tabs.push({ id: 'no', label: 'Button 2' })
    tabs.push({ id: 'submit', label: 'Submit' })
  } else if (isOneChoice) {
    tabs.push({ id: 'yes', label: 'Button' })
    tabs.push({ id: 'submit', label: 'Submit' })
  } else {
    tabs.push({ id: 'submit', label: 'Submit' })
  }

  const isTriggerButton = isTwoChoice && tab === 'no'

  return (
    <Accordion title="Buttons" subtitle={subtitle}>
      {tabs.length > 1 && (
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Text"
          value={current.text}
          onChange={(v) => update('text', v)}
          placeholder={tab === 'submit' ? 'Submit' : 'Yes'}
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
            {isTriggerButton ? 'Animation (Trigger)' : 'Animation (Motion)'}
          </label>
          <div className="flex flex-wrap gap-2">
            {(isTriggerButton ? BUTTON_TRIGGER_ANIMATIONS : BUTTON_MOTION_ANIMATIONS).map((a) => (
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