/* src/letter/effect/Effect.tsx */
import { getEffectVariant } from './index'

interface EffectOptions {
  senderLabel?: string
  recipientLabel?: string
  hideLabels?: string
}

interface EffectProps {
  variant?: string
  senderName?: string
  recipientName?: string
  effectOptions?: EffectOptions
}

export default function Effect({
  variant = '',
  senderName,
  recipientName,
  effectOptions,
}: EffectProps) {
  if (!variant) return null

  const effectConfig = getEffectVariant(variant)
  if (!effectConfig?.component) return null

  const EffectComponent = effectConfig.component
  const hideLabels = effectOptions?.hideLabels === 'true'

  const finalSenderName = hideLabels ? '' : effectOptions?.senderLabel || senderName
  const finalRecipientName = hideLabels ? '' : effectOptions?.recipientLabel || recipientName

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <EffectComponent senderName={finalSenderName} recipientName={finalRecipientName} />
    </div>
  )
}