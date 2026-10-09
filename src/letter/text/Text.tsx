import { motion } from 'motion/react'
import { getTextVariant, getTextAnimation } from './index'

type Props = {
  content: string
  variant?: string
  animation?: string
  as?: 'heading' | 'body'
}

function renderMarkdown(content: string) {
  const html = content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
  return html
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

  const html = renderMarkdown(content)

  return (
    <motion.div
      initial={animConfig?.variants?.initial ?? {}}
      animate={animConfig?.variants?.animate ?? {}}
      transition={animConfig?.variants?.transition ?? {}}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}