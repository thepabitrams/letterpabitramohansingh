/* src/letter/editor/BackgroundPicker.tsx */
import { Accordion, Button } from '../../core/components/ui'
import { BACKGROUND_VARIANTS, BACKGROUND_ANIMATIONS } from '../background'

interface BackgroundPickerProps {
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
  const currentVariant = BACKGROUND_VARIANTS.find((entry) => entry.id === variant)

  const visibleAnimations = BACKGROUND_ANIMATIONS.filter(
    (entry) => entry.id !== 'static' && entry.id !== 'none'
  )

  const currentAnimation = visibleAnimations.find((entry) => entry.id === animation)

  const subtitle = currentAnimation
    ? `${currentVariant?.config?.name ?? variant} · ${currentAnimation.config?.name ?? animation}`
    : `${currentVariant?.config?.name ?? variant}`

  const handleAnimationClick = (animationId: string): void => {
    const isCurrentlySelected = animation === animationId
    onAnimationChange(isCurrentlySelected ? 'none' : animationId)
  }

  return (
    <Accordion title="Background" subtitle={subtitle}>
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {BACKGROUND_VARIANTS.map((entry) => (
              <Button
                key={entry.id}
                onClick={() => onVariantChange(entry.id)}
                variant={variant === entry.id ? 'active' : 'outline'}
              >
                {entry.config?.name ?? entry.id}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Animation
          </h3>
          <div className="flex flex-wrap gap-2">
            {visibleAnimations.map((entry) => (
              <Button
                key={entry.id}
                onClick={() => handleAnimationClick(entry.id)}
                variant={animation === entry.id ? 'active' : 'outline'}
              >
                {entry.config?.name ?? entry.id}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Accordion>
  )
}