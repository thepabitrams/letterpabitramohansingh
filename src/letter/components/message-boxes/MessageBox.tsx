/* src/ui/components/message-boxes/MessageBox.tsx */
import { motion } from 'motion/react'

type Style = 'romantic' | 'minimal' | 'vintage'

type Props = {
  children: React.ReactNode
  style?: Style
}

const STYLES: Record<Style, string> = {
  romantic: 'bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 shadow-xl',
  minimal: 'bg-white border border-gray-200 shadow-sm',
  vintage: 'bg-amber-50 border-2 border-amber-300 shadow-lg',
}

export default function MessageBox({ children, style = 'romantic' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${STYLES[style]} p-8 rounded-3xl text-gray-800 leading-relaxed whitespace-pre-wrap`}
    >
      {children}
    </motion.div>
  )
}