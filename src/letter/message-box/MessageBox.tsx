/* src/letter/message-box/MessageBox.tsx */
import { motion } from 'motion/react'
import { Text } from '../text'
import { getMessageBoxVariant, getMessageBoxAnimation } from './index'

type Props = {
  content: string
  variant?: string
  animation?: string
  textVariant?: string
  textAnimation?: string
  editable?: boolean
  onChange?: (value: string) => void
  placeholder?: string
}

export default function MessageBox({
  content,
  variant = 'romantic',
  animation = 'fade',
  textVariant = 'romantic',
  textAnimation = 'none',
  editable = false,
  onChange,
  placeholder = 'Write your message...',
}: Props) {
  const variantConfig = getMessageBoxVariant(variant)
  const animConfig = getMessageBoxAnimation(animation)

  if (editable) {
    return (
      <motion.div
        key={`edit-${variant}`}
        initial={animConfig?.variants?.initial ?? {}}
        animate={animConfig?.variants?.animate ?? {}}
        transition={animConfig?.variants?.transition ?? {}}
        className={`${variantConfig?.className ?? ''} px-5 py-3 rounded-2xl w-full`}
      >
        <input
          type="text"
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      key={`read-${variant}-${animation}`}
      initial={animConfig?.variants?.initial ?? {}}
      animate={animConfig?.variants?.animate ?? {}}
      transition={animConfig?.variants?.transition ?? {}}
      className={`${variantConfig?.className ?? ''} px-6 py-5 rounded-2xl w-full`}
    >
      <Text
        content={content}
        variant={textVariant}
        animation={textAnimation}
        as="body"
      />
    </motion.div>
  )
}