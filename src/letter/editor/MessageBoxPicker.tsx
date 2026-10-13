/* src/letter/editor/MessageBoxPicker.tsx */
import { Accordion, Button } from '../../core/components/ui'
import { MESSAGE_BOX_VARIANTS, MESSAGE_BOX_ANIMATIONS } from '../message-box'

interface MessageBoxPickerProps {
  variant: string
  animation: string
  onVariantChange: (newVariant: string) => void
  onAnimationChange: (newAnimation: string) => void
}

export function MessageBoxPicker({
  variant,
  animation,
  onVariantChange,
  onAnimationChange,
}: MessageBoxPickerProps) {
  const variantName =
    MESSAGE_BOX_VARIANTS.find((entry) => entry.id === variant)?.config?.name ?? ''

  const visibleAnimations = MESSAGE_BOX_ANIMATIONS.filter((entry) => entry.id !== 'none')
  const currentAnimation = visibleAnimations.find((entry) => entry.id === animation)

  const subtitle = currentAnimation
    ? `${variantName} · ${currentAnimation.config?.name ?? ''}`
    : variantName

  const handleAnimationClick = (id: string): void => {
    onAnimationChange(animation === id ? '' : id)
  }

  return (
    <Accordion title="Message Box" subtitle={subtitle}>
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Style
          </h3>
          <div className="flex flex-wrap gap-2">
            {MESSAGE_BOX_VARIANTS.map((entry) => (
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