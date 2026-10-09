/* src/letter/effect/Effect.tsx */
import { getEffectVariant } from './index'

type Props = {
  variant?: string
}

export default function Effect({ variant = 'none' }: Props) {
  const config = getEffectVariant(variant)
  if (!config?.component) return null

  const Component = config.component
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <Component />
    </div>
  )
}