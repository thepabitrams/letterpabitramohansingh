// src/core/components/ui/Card.tsx
import { motion } from 'motion/react'

type CardProps = {
  children: React.ReactNode
  className?: string
  title?: string
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-colors ${className}`}
    >
      {title && (
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  )
}