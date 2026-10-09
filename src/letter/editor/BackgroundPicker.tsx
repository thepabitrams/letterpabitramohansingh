import { Accordion, Button } from '../../core/components/ui'
import { BACKGROUND_VARIANTS } from '../background'

type BackgroundPickerProps = {
  value: string
  onChange: (newValue: string) => void
}

export function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  const currentVariant = BACKGROUND_VARIANTS.find((variantEntry) => variantEntry.id === value)

  return (
    <Accordion title="Background" subtitle={currentVariant?.config?.name ?? value}>
      <div className="flex flex-wrap gap-2">
        {BACKGROUND_VARIANTS.map((variantEntry) => (
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