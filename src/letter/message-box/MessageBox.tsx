import { motion } from 'motion/react'
import { getMessageBoxVariant, getMessageBoxAnimation } from './index'

type Props = {
  content: string
  variant?: string
  animation?: string
  editable?: boolean
  onChange?: (value: string) => void
  placeholder?: string
}

function renderMarkdown(content: string) {
  const html = content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
  return html
}

export default function MessageBox({
  content,
  variant = 'romantic',
  animation = 'fade',
  editable = false,
  onChange,
  placeholder = 'Write your message...',
}: Props) {
  const variantConfig = getMessageBoxVariant(variant)
  const animConfig = getMessageBoxAnimation(animation)

  const baseClass = `
    ${variantConfig?.className ?? ''}
    p-8 rounded-3xl text-gray-800 leading-relaxed
    w-full
  `

  if (editable) {
    return (
      <motion.div
        initial={animConfig?.variants?.initial ?? {}}
        animate={animConfig?.variants?.animate ?? {}}
        transition={animConfig?.variants?.transition ?? {}}
        className={baseClass}
      >
        <textarea
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none resize-none min-h-[120px] text-gray-800 leading-relaxed placeholder-gray-400"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={animConfig?.variants?.initial ?? {}}
      animate={animConfig?.variants?.animate ?? {}}
      transition={animConfig?.variants?.transition ?? {}}
      className={baseClass}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}