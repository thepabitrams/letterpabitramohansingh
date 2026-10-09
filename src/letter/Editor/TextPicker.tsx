import { Accordion, Button } from '../../core/components/ui'
import { TEXT_VARIANTS, TEXT_ANIMATIONS } from '../text'

type Props = {
  variant: string
  animation: string
  onVariantChange: (v: string) => void
  onAnimationChange: (v: string) => void
}

export function TextPicker({
  variant,
  animation,
  onVariantChange,
  onAnimationChange,
}: Props) {
  const vName = TEXT_VARIANTS.find((v) => v.id === variant)?.config?.name ?? variant
  const aName = TEXT_ANIMATIONS.find((a) => a.id === animation)?.config?.name ?? animation

  return (
    <Accordion title="Text" subtitle={`${vName} · ${aName}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Style</h3>
          <div className="flex flex-wrap gap-2">
            {TEXT_VARIANTS.map((v) => (
              <Button
                key={v.id}
                onClick={() => onVariantChange(v.id)}
                variant={variant === v.id ? 'active' : 'outline'}
              >
                {v.config?.name ?? v.id}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Animation</h3>
          <div className="flex flex-wrap gap-2">
            {TEXT_ANIMATIONS.map((a) => (
              <Button
                key={a.id}
                onClick={() => onAnimationChange(a.id)}
                variant={animation === a.id ? 'active' : 'outline'}
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