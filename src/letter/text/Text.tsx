/* src/letter/text/Text.tsx */
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { getTextVariant, getTextAnimation } from './index'

type TextProps = {
  content: string
  variant?: string
  animation?: string
  as?: 'heading' | 'body'
}

function renderMarkdown(rawContent: string): string {
  return rawContent
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}

function Typewriter({ content }: { content: string }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let characterIndex = 0
    const typewriterTimer = setInterval(() => {
      characterIndex++
      setDisplayedText(content.slice(0, characterIndex))
      if (characterIndex >= content.length) clearInterval(typewriterTimer)
    }, 40)

    return () => clearInterval(typewriterTimer)
  }, [content])

  return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedText) }} />
}

export default function Text({
  content,
  variant = 'romantic',
  animation = 'none',
  as = 'body',
}: TextProps) {
  const variantConfig = getTextVariant(variant)
  const animationConfig = getTextAnimation(animation)

  const appliedClassName =
    as === 'heading'
      ? variantConfig?.headingClass ?? ''
      : variantConfig?.bodyClass ?? ''

  const isTypewriterAnimation = (animationConfig as any)?.typewriter === true

  if (isTypewriterAnimation) {
    return (
      <div className={appliedClassName}>
        <Typewriter content={content} />
        <span className="animate-pulse">|</span>
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
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}