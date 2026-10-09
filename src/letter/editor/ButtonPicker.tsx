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

type ButtonTab = 'yes' | 'no' | 'submit'

type ButtonPickerProps = {
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

  const defaultTab: ButtonTab = isTwoChoice ? 'yes' : isOneChoice ? 'yes' : 'submit'
  const [activeTab, setActiveTab] = useState<ButtonTab>(defaultTab)

  useEffect(() => {
    setActiveTab(isTwoChoice ? 'yes' : isOneChoice ? 'yes' : 'submit')
  }, [pattern, isTwoChoice, isOneChoice])

  const getCurrentConfig = (): ButtonConfig => {
    if (activeTab === 'yes' && isTwoChoice) return yes!
    if (activeTab === 'no' && isTwoChoice) return no!
    if (activeTab === 'yes' && isOneChoice) return single!
    return submit
  }

  const getCurrentOnChange = () => {
    if (activeTab === 'yes' && isTwoChoice) return onYesChange!
    if (activeTab === 'no' && isTwoChoice) return onNoChange!
    if (activeTab === 'yes' && isOneChoice) return onSingleChange!
    return onSubmitChange
  }

  const currentConfig = getCurrentConfig()
  const currentOnChange = getCurrentOnChange()

  const updateConfig = (key: keyof ButtonConfig, value: string) => {
    currentOnChange({ ...currentConfig, [key]: value })
  }

  const accordionSubtitle = isTwoChoice
    ? `${yes?.text ?? ''} / ${no?.text ?? ''}`
    : isOneChoice
    ? single?.text ?? ''
    : submit?.text ?? ''

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

  return (
    <Accordion title="Buttons" subtitle={accordionSubtitle}>
      {availableTabs.length > 1 && (
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
          {availableTabs.map((tabEntry) => (
            <button
              key={tabEntry.id}
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
                onClick={() => updateConfig('color', colorKey)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  currentConfig.color === colorKey
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: COLORS[colorKey].hex }}
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
            {BUTTON_VARIANTS.map((variantEntry) => (
              <Button
                key={variantEntry.id}
                onClick={() => updateConfig('variant', variantEntry.id)}
                variant={currentConfig.variant === variantEntry.id ? 'active' : 'outline'}
              >
                {variantEntry.config?.name ?? variantEntry.id}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            {isTriggerAnimationTab ? 'Animation (Trigger)' : 'Animation (Motion)'}
          </label>
          <div className="flex flex-wrap gap-2">
            {(isTriggerAnimationTab
              ? BUTTON_TRIGGER_ANIMATIONS
              : BUTTON_MOTION_ANIMATIONS
            ).map((animationEntry) => (
              <Button
                key={animationEntry.id}
                onClick={() => updateConfig('animation', animationEntry.id)}
                variant={
                  currentConfig.animation === animationEntry.id ? 'active' : 'outline'
                }
              >
                {animationEntry.config?.name ?? animationEntry.id}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Accordion>
  )
}