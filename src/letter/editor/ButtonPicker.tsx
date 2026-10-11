/* src/letter/editor/ButtonPicker.tsx */
import { useEffect, useState } from 'react'
import { Accordion, Button, Input } from '../../core/components/ui'
import { COLORS, type ColorKey } from '../tokens/colors'
import { SHAPES, type ShapeKey } from '../tokens/shapes'
import { SIZES, type SizeKey } from '../tokens/sizes'
import { BUTTON_VARIANTS, BUTTON_MOTION_ANIMATIONS, BUTTON_TRIGGER_ANIMATIONS } from '../button'
import type { PatternId } from '../patterns'

interface ButtonConfig {
  text: string
  color: string
  shape: string
  size: string
  variant: string
  animation: string
}

type ButtonTab = 'yes' | 'no' | 'submit'

interface ButtonPickerProps {
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
}: ButtonPickerProps) {
  const isTwoChoice = pattern === 'two-choice'
  const isOneChoice = pattern === 'one-choice'

  const defaultTab: ButtonTab = isTwoChoice || isOneChoice ? 'yes' : 'submit'
  const [activeTab, setActiveTab] = useState<ButtonTab>(defaultTab)

  useEffect(() => {
    setActiveTab(isTwoChoice || isOneChoice ? 'yes' : 'submit')
  }, [pattern, isTwoChoice, isOneChoice])

  const currentConfig: ButtonConfig =
    (activeTab === 'yes' && isTwoChoice && yes) ||
    (activeTab === 'no' && isTwoChoice && no) ||
    (activeTab === 'yes' && isOneChoice && single) ||
    submit

  const currentOnChange: (config: ButtonConfig) => void =
    (activeTab === 'yes' && isTwoChoice && onYesChange) ||
    (activeTab === 'no' && isTwoChoice && onNoChange) ||
    (activeTab === 'yes' && isOneChoice && onSingleChange) ||
    onSubmitChange

  const updateConfig = (key: keyof ButtonConfig, value: string): void => {
    currentOnChange({ ...currentConfig, [key]: value })
  }

  const toggleAnimation = (animationId: string): void => {
    const newValue = currentConfig.animation === animationId ? '' : animationId
    currentOnChange({ ...currentConfig, animation: newValue })
  }

  const accordionSubtitle = isTwoChoice
    ? `${yes?.text ?? ''} / ${no?.text ?? ''}`
    : isOneChoice
      ? single?.text ?? ''
      : submit.text

  const availableTabs: { id: ButtonTab; label: string }[] = []
  if (isTwoChoice) {
    availableTabs.push({ id: 'yes', label: 'Button 1' })
    availableTabs.push({ id: 'no', label: 'Button 2' })
    availableTabs.push({ id: 'submit', label: 'Submit' })
  } else if (isOneChoice) {
    availableTabs.push({ id: 'yes', label: 'Button' })
    availableTabs.push({ id: 'submit', label: 'Submit' })
  } else {
    availableTabs.push({ id: 'submit', label: 'Submit' })
  }

  const isTriggerAnimationTab = isTwoChoice && activeTab === 'no'
  const animationList = isTriggerAnimationTab
    ? BUTTON_TRIGGER_ANIMATIONS
    : BUTTON_MOTION_ANIMATIONS
  const visibleAnimations = animationList.filter((entry) => entry.id !== 'none')

  return (
    <Accordion title="Buttons" subtitle={accordionSubtitle}>
      {availableTabs.length > 1 && (
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
          {availableTabs.map((tabEntry) => (
            <button
              key={tabEntry.id}
              type="button"
              onClick={() => setActiveTab(tabEntry.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === tabEntry.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {tabEntry.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Text"
          value={currentConfig.text}
          onChange={(newValue) => updateConfig('text', newValue)}
          placeholder={activeTab === 'submit' ? 'Submit' : 'Yes'}
        />

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(COLORS) as ColorKey[]).map((colorKey) => (
              <button
                key={colorKey}
                type="button"
                onClick={() => updateConfig('color', colorKey)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  currentConfig.color === colorKey
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: COLORS[colorKey].hex }}
                aria-label={colorKey}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Shape</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SHAPES) as ShapeKey[]).map((shapeKey) => (
              <Button
                key={shapeKey}
                onClick={() => updateConfig('shape', shapeKey)}
                variant={currentConfig.shape === shapeKey ? 'active' : 'outline'}
              >
                {shapeKey}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SIZES) as SizeKey[]).map((sizeKey) => (
              <Button
                key={sizeKey}
                onClick={() => updateConfig('size', sizeKey)}
                variant={currentConfig.size === sizeKey ? 'active' : 'outline'}
              >
                {sizeKey}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Variant</label>
          <div className="flex flex-wrap gap-2">
            {BUTTON_VARIANTS.map((entry) => (
              <Button
                key={entry.id}
                onClick={() => updateConfig('variant', entry.id)}
                variant={currentConfig.variant === entry.id ? 'active' : 'outline'}
              >
                {entry.config?.name ?? entry.id}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            {isTriggerAnimationTab ? 'Animation (Trigger)' : 'Animation (Motion)'}
          </label>
          <div className="flex flex-wrap gap-2">
            {visibleAnimations.map((entry) => (
              <Button
                key={entry.id}
                onClick={() => toggleAnimation(entry.id)}
                variant={currentConfig.animation === entry.id ? 'active' : 'outline'}
              >
                {entry.config?.name ?? entry.id}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Accordion>
  )
}