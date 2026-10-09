/* src/core/components/ui/Button.tsx */
type Variant = 'primary' | 'outline' | 'ghost' | 'active'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  variant?: Variant
  size?: Size
  className?: string
  type?: 'button' | 'submit'
}

const VARIANTS: Record<Variant, string> = {
  primary: 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
  outline: 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
  ghost: 'border-transparent text-gray-500 hover:text-gray-700',
  active: 'border-blue-600 bg-blue-50 text-blue-700',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-xs rounded-lg',
  lg: 'px-6 py-3 text-sm rounded-xl',
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`border font-medium transition ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  )
}