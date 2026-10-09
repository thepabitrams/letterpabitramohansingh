import { Accordion, Button } from '../../core/components/ui'
import { EFFECT_VARIANTS } from '../effect'

type EffectPickerProps = {
  value: string
  onChange: (newValue: string) => void
}

export function EffectPicker({ value, onChange }: EffectPickerProps) {
  const currentVariant = EFFECT_VARIANTS.find((variantEntry) => variantEntry.id === value)

  return (
    <Accordion title="Effect" subtitle={currentVariant?.config?.name ?? value}>
      <div className="flex flex-wrap gap-2">
        {EFFECT_VARIANTS.map((variantEntry) => (
          <Button
            key={variantEntry.id}
            onClick={() => onChange(variantEntry.id)}
            variant={value === variantEntry.id ? 'active' : 'outline'}
          >
            {variantEntry.config?.name ?? variantEntry.id}
          </Button>
        ))}
      </div>
    </Accordion>
  )
}