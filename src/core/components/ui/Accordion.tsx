import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaChevronDown } from 'react-icons/fa'

type AccordionProps = {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  subtitle?: string
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  subtitle,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          {subtitle && (
            <span className="text-xs text-gray-500 mt-0.5">{subtitle}</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-400 text-xs" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}