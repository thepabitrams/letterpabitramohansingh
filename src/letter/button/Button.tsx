import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { COLORS, type ColorKey } from '../tokens/colors'
import { SHAPES, type ShapeKey } from '../tokens/shapes'
import { SIZES, type SizeKey } from '../tokens/sizes'
import { getButtonVariant, getButtonAnimation } from './index'

type Props = {
  text?: string
  color?: ColorKey
  shape?: ShapeKey
  size?: SizeKey
  variant?: string
  animation?: string
  onClick?: () => void
}

const RUN_MESSAGES = ['No', 'Are you sure?', 'Really?', 'Think again!', 'Please?', 'Last chance!', '🥺']

export default function Button({
  text = 'Yes',
  color = 'green',
  shape = 'pill',
  size = 'md',
  variant = 'solid',
  animation = 'none',
  onClick,
}: Props) {
  const animConfig = getButtonAnimation(animation)
  const variantConfig = getButtonVariant(variant)
  const isTrigger = animConfig?.category === 'trigger'

  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [msgIndex, setMsgIndex] = useState(0)
  const [isBlasting, setIsBlasting] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const applyRandomPos = () => {
    const c = containerRef.current
    if (!c) return
    const { width, height } = c.getBoundingClientRect()
    const maxX = Math.max(width / 2 - 70, 40)
    const maxY = Math.max(height / 2 - 30, 20)
    setPos({
      x: (Math.random() * 2 - 1) * maxX,
      y: (Math.random() * 2 - 1) * maxY,
    })
  }

  const move = () => {
    setMsgIndex((i) => (i + 1) % RUN_MESSAGES.length)

    if (animation === 'blast') {
      setIsBlasting(true)
      setBurstKey((k) => k + 1)
      setTimeout(() => {
        setIsBlasting(false)
        applyRandomPos()
      }, 300)
    } else if (animation === 'runaway' || animation === 'tada') {
      applyRandomPos()
    }
  }

  const handleInteraction = (e: React.SyntheticEvent) => {
    if (!isTrigger) return
    e.preventDefault()
    move()
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isTrigger) {
      e.preventDefault()
      return
    }
    onClick?.()
  }

  const motionVariants = animConfig?.category === 'motion' ? animConfig.variants : {}

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {animation === 'blast' && isBlasting && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i * 36 * Math.PI) / 180
            return (
              <motion.div
                key={`${burstKey}-${i}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * 70,
                  y: Math.sin(angle) * 70,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full bg-gray-400"
              />
            )
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isBlasting && (
          <motion.button
            key="btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1, ...motionVariants }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onHoverStart={handleInteraction}
            onTouchStart={handleInteraction}
            onClick={handleClick}
            className={`
              ${COLORS[color].bg}
              ${SHAPES[shape]}
              ${SIZES[size]}
              ${variantConfig?.className ?? ''}
              text-white font-semibold select-none
            `}
          >
            {isTrigger ? RUN_MESSAGES[msgIndex] : text}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}