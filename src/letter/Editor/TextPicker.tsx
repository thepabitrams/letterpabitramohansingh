import { Accordion, Button } from '../../core/components/ui'
import { TEXT_VARIANTS, TEXT_ANIMATIONS } from '../text'

type TextPickerProps = {
  variant: string
  animation: string
  onVariantChange: (newVariant: string) => void
  onAnimationChange: (newAnimation: string) => void
}

export function TextPicker({
  variant,
  animation,
  onVariantChange,
  onAnimationChange,
}: TextPickerProps) {
  const variantName =
    TEXT_VARIANTS.find((variantEntry) => variantEntry.id === variant)?.config?.name ?? variant
  const animationName =
    TEXT_ANIMATIONS.find((animationEntry) => animationEntry.id === animation)?.config?.name ??
    animation

  return (
    <Accordion title="Text" subtitle={`${variantName} · ${animationName}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Style
          </h3>
          <div className="flex flex-wrap gap-2">
            {TEXT_VARIANTS.map((variantEntry) => (
              <Button
                key={variantEntry.id}
                onClick={() => onVariantChange(variantEntry.id)}
                variant={variant === variantEntry.id ? 'active' : 'outline'}
              >
                {variantEntry.config?.name ?? variantEntry.id}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Animation
          </h3>
          <div className="flex flex-wrap gap-2">
            {TEXT_ANIMATIONS.map((animationEntry) => (
              <Button
                key={animationEntry.id}
                onClick={() => onAnimationChange(animationEntry.id)}
                variant={animation === animationEntry.id ? 'active' : 'outline'}
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