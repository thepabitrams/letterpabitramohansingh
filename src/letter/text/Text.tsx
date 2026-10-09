/* src/letter/text/Text.tsx */
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { getTextVariant, getTextAnimation } from './index'

type Props = {
  content: string
  variant?: string
  animation?: string
  as?: 'heading' | 'body'
}

function renderMarkdown(content: string) {
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}

function Typewriter({ content }: { content: string }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(content.slice(0, i))
      if (i >= content.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [content])

  return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(displayed) }} />
}

export default function Text({
  content,
  variant = 'romantic',
  animation = 'none',
  as = 'body',
}: Props) {
  const variantConfig = getTextVariant(variant)
  const animConfig = getTextAnimation(animation)

  const className =
    as === 'heading'
      ? variantConfig?.headingClass ?? ''
      : variantConfig?.bodyClass ?? ''

  const isTypewriter = (animConfig as any)?.typewriter === true

  if (isTypewriter) {
    return (
      <div className={className}>
        <Typewriter content={content} />
        <span className="animate-pulse">|</span>
      </div>
    )
  }

  return (
    <motion.div
      key={`${variant}-${animation}`}
      initial={animConfig?.variants?.initial ?? {}}
      animate={animConfig?.variants?.animate ?? {}}
      transition={animConfig?.variants?.transition ?? {}}
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}