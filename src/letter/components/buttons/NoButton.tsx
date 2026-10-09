/* src/ui/components/buttons/NoButton.tsx */
import { useState } from 'react'
import { motion } from 'motion/react'
import { COLORS, type ColorKey } from '../../tokens/colors'
import { SHAPES, type ShapeKey } from '../../tokens/shapes'

type Props = {
  text?: string
  color?: ColorKey
  shape?: ShapeKey
  runaway?: boolean
  onClick?: () => void
}

const RUN_MESSAGES = ['No', 'Are you sure?', 'Really?', 'Think again!', 'Please?', 'Last chance!', '🥺']

export default function NoButton({
  text = 'No',
  color = 'gray',
  shape = 'pill',
  runaway = true,
  onClick,
}: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [msgIndex, setMsgIndex] = useState(0)

  const handleHover = () => {
    if (!runaway) return
    setPos({ x: Math.random() * 200 - 100, y: Math.random() * 100 - 50 })
    setMsgIndex((i) => (i + 1) % RUN_MESSAGES.length)
  }

  return (
    <motion.button
      animate={pos}
      transition={{ type: 'spring', stiffness: 300 }}
      onHoverStart={handleHover}
      onTouchStart={handleHover}
      onClick={onClick}
      className={`${COLORS[color]} ${SHAPES[shape]} px-8 py-3 text-white font-semibold shadow-lg`}
    >
      {runaway ? RUN_MESSAGES[msgIndex] : text}
    </motion.button>
  )
}