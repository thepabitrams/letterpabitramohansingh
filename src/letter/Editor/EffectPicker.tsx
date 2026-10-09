import { Accordion, Button } from '../../core/components/ui'
import { EFFECT_VARIANTS } from '../effect'

type Props = {
  value: string
  onChange: (v: string) => void
}

export function EffectPicker({ value, onChange }: Props) {
  const current = EFFECT_VARIANTS.find((v) => v.id === value)
  return (
    <Accordion title="Effect" subtitle={current?.config?.name ?? value}>
      <div className="flex flex-wrap gap-2">
        {EFFECT_VARIANTS.map((v) => (
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