import { Accordion, Button } from '../../core/components/ui'
import { BACKGROUND_VARIANTS } from '../background'

type Props = {
  value: string
  onChange: (v: string) => void
}

export function BackgroundPicker({ value, onChange }: Props) {
  const current = BACKGROUND_VARIANTS.find((v) => v.id === value)
  return (
    <Accordion title="Background" subtitle={current?.config?.name ?? value}>
      <div className="flex flex-wrap gap-2">
        {BACKGROUND_VARIANTS.map((v) => (
          <Button
            key={v.id}
            onClick={() => onChange(v.id)}
            variant={value === v.id ? 'active' : 'outline'}
          >
            {v.config?.name ?? v.id}
          </Button>
        ))}
      </div>
    </Accordion>
  )
}