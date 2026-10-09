/* src/core/components/ui/Container.tsx */
type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${className}`}>
      {children}
    </div>
  )
}