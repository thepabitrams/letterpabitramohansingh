/* src/letter/message-box/MessageBox.tsx */
import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Text } from '../text'
import { getMessageBoxVariant, getMessageBoxAnimation } from './index'

type MessageBoxProps = {
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
  animation = '',
  textVariant = 'romantic',
  textAnimation = '',
  editable = false,
  onChange,
  placeholder = 'Write your message...',
}: MessageBoxProps) {
  const variantConfig = getMessageBoxVariant(variant)
  const animationConfig = animation ? getMessageBoxAnimation(animation) : undefined
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!editable || !textareaRef.current) return
    const textareaElement = textareaRef.current
    textareaElement.style.height = 'auto'
    textareaElement.style.height = textareaElement.scrollHeight + 'px'
  }, [content, editable])

  if (editable) {
    return (
      <motion.div
        key={`edit-${variant}`}
        initial={animationConfig?.variants?.initial ?? {}}
        animate={animationConfig?.variants?.animate ?? {}}
        transition={animationConfig?.variants?.transition ?? {}}
        className={`${variantConfig?.className ?? ''} px-5 py-3 rounded-2xl w-full`}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400 text-base leading-relaxed md:min-h-[96px] min-h-[64px]"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      key={`read-${variant}-${animation}`}
      initial={animationConfig?.variants?.initial ?? {}}
      animate={animationConfig?.variants?.animate ?? {}}
      transition={animationConfig?.variants?.transition ?? {}}
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