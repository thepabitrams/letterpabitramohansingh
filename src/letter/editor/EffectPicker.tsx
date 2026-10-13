/* src/letter/editor/EffectPicker.tsx */
import { Accordion, Button, Input } from '../../core/components/ui'
import { EFFECT_VARIANTS } from '../effect'

interface EffectOptionDefinition {
  key: string
  label: string
  placeholder?: string
}

interface EffectOptions {
  senderLabel?: string
  recipientLabel?: string
  hideLabels?: string
}

interface EffectPickerProps {
  value: string
  senderName?: string
  recipientName?: string
  effectOptions?: EffectOptions
  onChange: (newValue: string) => void
  onEffectOptionChange: (key: string, value: string) => void
}

function getPlaceholder(
  option: EffectOptionDefinition,
  key: string,
  senderName?: string,
  recipientName?: string
): string {
  if (key === 'senderLabel') return senderName || option.placeholder || ''
  if (key === 'recipientLabel') return recipientName || option.placeholder || ''
  return option.placeholder || ''
}

export function EffectPicker({
  value,
  senderName,
  recipientName,
  effectOptions,
  onChange,
  onEffectOptionChange,
}: EffectPickerProps) {
  const visibleEffects = EFFECT_VARIANTS.filter((effectEntry) => effectEntry.id !== 'none')
  const currentVariant = visibleEffects.find((effectEntry) => effectEntry.id === value)

  const optionDefinitions: EffectOptionDefinition[] =
    (currentVariant?.config as { options?: EffectOptionDefinition[] })?.options ?? []

  const hideLabels = effectOptions?.hideLabels === 'true'

  const handleClick = (id: string) => {
    onChange(value === id ? '' : id)
  }

  const handleToggleHideLabels = () => {
    onEffectOptionChange('hideLabels', hideLabels ? '' : 'true')
  }

  return (
    <Accordion title="Effect" subtitle={currentVariant?.config?.name ?? 'None'}>
      <div className="flex flex-wrap gap-2">
        {visibleEffects.map((effectEntry) => (
          <Button
            key={effectEntry.id}
            onClick={() => handleClick(effectEntry.id)}
            variant={value === effectEntry.id ? 'active' : 'outline'}
          >
            {effectEntry.config?.name ?? effectEntry.id}
          </Button>
        ))}
      </div>

      {optionDefinitions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <div className={hideLabels ? 'opacity-40 pointer-events-none space-y-3' : 'space-y-3'}>
            {optionDefinitions.map((option) => (
              <Input
                key={option.key}
                label={option.label}
                value={effectOptions?.[option.key as keyof EffectOptions] ?? ''}
                onChange={(newValue) => onEffectOptionChange(option.key, newValue)}
                placeholder={getPlaceholder(option, option.key, senderName, recipientName)}
              />
            ))}
          </div>

          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={hideLabels}
              onChange={handleToggleHideLabels}
              className="peer sr-only"
            />
            <span
              className="w-4 h-4 rounded-[5px] border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 transition
                peer-checked:bg-gray-900 dark:peer-checked:bg-white peer-checked:border-gray-900 dark:peer-checked:border-white
                peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900/20 peer-focus-visible:ring-offset-1
                flex items-center justify-center"
            >
              <svg
                viewBox="0 0 12 12"
                fill="none"
                className={`w-2.5 h-2.5 text-white dark:text-gray-900 transition-opacity ${
                  hideLabels ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition">
              Hide names on effect
            </span>
          </label>
        </div>
      )}
    </Accordion>
  )
}