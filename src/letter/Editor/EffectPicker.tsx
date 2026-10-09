/* src/letter/editor/EffectPicker.tsx */
import { Accordion, Button } from '../../core/components/ui'
import { EFFECT_VARIANTS } from '../effect'

type EffectPickerProps = {
  value: string
  onChange: (newValue: string) => void
}

export function EffectPicker({ value, onChange }: EffectPickerProps) {
  const visibleEffects = EFFECT_VARIANTS.filter((effectEntry) => effectEntry.id !== 'none')
  const currentVariant = visibleEffects.find((effectEntry) => effectEntry.id === value)

  const handleClick = (id: string) => {
    onChange(value === id ? '' : id)
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
    </Accordion>
  )
}