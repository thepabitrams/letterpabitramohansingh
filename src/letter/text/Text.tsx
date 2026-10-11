/* src/letter/text/Text.tsx */
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { getTextAnimation, getTextVariant } from './index'

interface TextProps {
  content: string
  variant?: string
  animation?: string
  as?: 'heading' | 'body'
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char)
}

function renderInlineMarkdown(rawContent: string): string {
  return escapeHtml(rawContent)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}

function Typewriter({ content }: { content: string }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    let characterIndex = 0
    const typewriterTimer = setInterval(() => {
      characterIndex++
      setDisplayedText(content.slice(0, characterIndex))

      if (characterIndex >= content.length) {
        clearInterval(typewriterTimer)
        setIsComplete(true)
      }
    }, 40)

    return () => clearInterval(typewriterTimer)
  }, [content])

  return (
    <span>
      <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(displayedText) }} />
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default function Text({
  content,
  variant = 'romantic',
  animation = '',
  as = 'body',
}: TextProps) {
  const variantConfig = getTextVariant(variant)
  const animationConfig = animation ? getTextAnimation(animation) : undefined

  const appliedClassName =
    as === 'heading'
      ? variantConfig?.headingClass ?? ''
      : variantConfig?.bodyClass ?? ''

  const isTypewriterAnimation =
    (animationConfig as { typewriter?: boolean } | undefined)?.typewriter === true

  if (isTypewriterAnimation) {
    return (
      <div className={appliedClassName}>
        <Typewriter content={content} />
      </div>
    )
  }

  return (
    <motion.div
      key={`${variant}-${animation}`}
      initial={animationConfig?.variants?.initial ?? {}}
      animate={animationConfig?.variants?.animate ?? {}}
      transition={animationConfig?.variants?.transition ?? {}}
      className={appliedClassName}
      dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(content) }}
    />
  )
}