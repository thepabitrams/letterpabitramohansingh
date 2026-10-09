/* src/ui/components/buttons/YesButton.tsx */
import { motion } from 'motion/react'
import { COLORS, type ColorKey } from '../../tokens/colors'
import { SHAPES, type ShapeKey } from '../../tokens/shapes'
import { ANIMATIONS, type AnimationKey } from '../../tokens/animations'

type Props = {
  text?: string
  color?: ColorKey
  shape?: ShapeKey
  animation?: AnimationKey
  onClick?: () => void
}

export default function YesButton({
  text = 'Yes 💕',
  color = 'green',
  shape = 'pill',
  animation = 'pulse',
  onClick,
}: Props) {
  return (
    <motion.button
      animate={ANIMATIONS[animation]}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${COLORS[color]} ${SHAPES[shape]} px-8 py-3 text-white font-semibold shadow-lg transition`}
    >
      {text}
    </motion.button>
  )
}