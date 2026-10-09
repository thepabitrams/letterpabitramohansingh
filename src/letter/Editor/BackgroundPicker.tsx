/* src/letter/editor/BackgroundPicker.tsx */
import { Accordion, Button } from '../../core/components/ui'
import { BACKGROUND_VARIANTS, BACKGROUND_ANIMATIONS } from '../background'

type BackgroundPickerProps = {
  variant: string
  animation: string
  onVariantChange: (newVariant: string) => void
  onAnimationChange: (newAnimation: string) => void
}

export function BackgroundPicker({
  variant,
  animation,
  onVariantChange,
  onAnimationChange,
}: BackgroundPickerProps) {
  const currentVariant = BACKGROUND_VARIANTS.find((variantEntry) => variantEntry.id === variant)

  const visibleAnimations = BACKGROUND_ANIMATIONS.filter(
    (animationEntry) => animationEntry.id !== 'static' && animationEntry.id !== 'none'
  )

  const currentAnimation = visibleAnimations.find(
    (animationEntry) => animationEntry.id === animation
  )

  const subtitle = currentAnimation
    ? `${currentVariant?.config?.name ?? variant} · ${currentAnimation.config?.name ?? animation}`
    : `${currentVariant?.config?.name ?? variant}`

  const handleAnimationClick = (animationId: string) => {
    const isCurrentlySelected = animation === animationId
    onAnimationChange(isCurrentlySelected ? 'none' : animationId)
  }

  return (
    <Accordion title="Background" subtitle={subtitle}>
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {BACKGROUND_VARIANTS.map((variantEntry) => (
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
            {visibleAnimations.map((animationEntry) => (
              <Button
                key={animationEntry.id}
                onClick={() => handleAnimationClick(animationEntry.id)}
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