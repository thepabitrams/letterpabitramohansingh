/* src/letter/effect/Effect.tsx */
import { getEffectVariant } from './index'

type EffectProps = {
  variant?: string
}

export default function Effect({ variant = '' }: EffectProps) {
  if (!variant) return null

  const effectConfig = getEffectVariant(variant)
  if (!effectConfig?.component) return null

  const EffectComponent = effectConfig.component

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <EffectComponent />
    </div>
  )
}