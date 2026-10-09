/* src/letter/background/Background.tsx */
import { getBackgroundVariant } from './index'

type Props = {
  variant?: string
  children: React.ReactNode
}

export default function Background({
  variant = 'blue',
  children,
}: Props) {
  const variantConfig = getBackgroundVariant(variant)
  const isDark = variantConfig?.isDark ?? false

  return (
    <div
      className={`
        relative w-full h-full
        ${variantConfig?.className ?? ''}
        flex items-center justify-center
        p-6 overflow-hidden
      `}
      data-dark={isDark}
    >
      {children}
    </div>
  )
}