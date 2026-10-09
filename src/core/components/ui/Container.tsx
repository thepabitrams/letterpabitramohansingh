/* src/core/components/ui/Container.tsx */
type Props = {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '' }: Props) {
  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${className}`}>
      {children}
    </div>
  )
}