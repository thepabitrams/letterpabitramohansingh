/* src/letter/button/Button.tsx */
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { COLORS, type ColorKey } from '../tokens/colors'
import { SHAPES, type ShapeKey } from '../tokens/shapes'
import { SIZES, type SizeKey } from '../tokens/sizes'
import { getButtonVariant, getButtonAnimation } from './index'

type ButtonProps = {
  text?: string
  color?: ColorKey
  shape?: ShapeKey
  size?: SizeKey
  variant?: string
  animation?: string
  onClick?: () => void
}

const RUNAWAY_MESSAGES = [
  'Are you sure?',
  'Really?',
  'Think again!',
  'Please?',
  'Last chance!',
  '🥺',
]

export default function Button({
  text = 'Yes',
  color = 'green',
  shape = 'pill',
  size = 'md',
  variant = 'solid',
  animation = '',
  onClick,
}: ButtonProps) {
  const animationConfig = animation ? getButtonAnimation(animation) : undefined
  const variantConfig = getButtonVariant(variant)
  const isTriggerAnimation = animationConfig?.category === 'trigger'

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [messageIndex, setMessageIndex] = useState(0)
  const [isMessageVisible, setIsMessageVisible] = useState(false)
  const [isBlasting, setIsBlasting] = useState(false)
  const [burstKey, setBurstKey] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastMoveTimestampRef = useRef(0)

  const applyRandomPosition = () => {
    const container = containerRef.current
    if (!container) return

    const { width, height } = container.getBoundingClientRect()

    const maxOffsetX = Math.max(width / 2 - 40, 100)
    const maxOffsetY = Math.max(height / 2 - 40, 80)

    let newX = 0
    let newY = 0
    let attempts = 0

    do {
      const angle = Math.random() * Math.PI * 2
      const distance = 150 + Math.random() * 80
      newX = position.x + Math.cos(angle) * distance
      newY = position.y + Math.sin(angle) * distance
      newX = Math.max(-maxOffsetX, Math.min(maxOffsetX, newX))
      newY = Math.max(-maxOffsetY, Math.min(maxOffsetY, newY))
      attempts++
    } while (attempts < 5 && Math.hypot(newX - position.x, newY - position.y) < 100)

    setPosition({ x: newX, y: newY })
  }

  const triggerMove = () => {
    setMessageIndex((previousIndex) => (previousIndex + 1) % RUNAWAY_MESSAGES.length)
    setIsMessageVisible(true)

    if (animation === 'blast') {
      setIsBlasting(true)
      setBurstKey((previousKey) => previousKey + 1)

      setTimeout(() => {
        setIsBlasting(false)
        applyRandomPosition()
      }, 300)
    } else if (animation === 'runaway') {
      applyRandomPosition()
    }
  }

  const handleInteraction = (event: any) => {
    if (!isTriggerAnimation) return

    event.preventDefault()
    event.stopPropagation()

    const now = Date.now()
    if (now - lastMoveTimestampRef.current < 200) return
    lastMoveTimestampRef.current = now

    triggerMove()
  }

  const handleClick = (event: React.MouseEvent) => {
    if (isTriggerAnimation) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    onClick?.()
  }

  const rawVariants = animationConfig?.category === 'motion' ? animationConfig.variants : {}
  const { transition: animationTransition, ...motionVariants } = rawVariants as any

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {animation === 'blast' && isBlasting && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 10 }).map((_, particleIndex) => {
            const angle = (particleIndex * 36 * Math.PI) / 180

            return (
              <motion.div
                key={`${burstKey}-${particleIndex}`}
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
          <motion.div
            key="btn-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ x: position.x, y: position.y, scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 22,
              mass: 0.8,
            }}
            className="relative"
          >
            <motion.button
              animate={motionVariants}
              transition={animationTransition ?? { type: 'spring', stiffness: 400, damping: 20 }}
              onHoverStart={(event) => handleInteraction(event as any)}
              onTouchStart={(event) => handleInteraction(event as any)}
              onTouchMove={(event) => handleInteraction(event as any)}
              onClick={handleClick}
              style={{ touchAction: 'none' }}
              className={`
                ${COLORS[color].bg}
                ${SHAPES[shape]}
                ${SIZES[size]}
                ${variantConfig?.className ?? ''}
                text-white font-semibold select-none
              `}
            >
              {text}
            </motion.button>

            {isTriggerAnimation && (
              <AnimatePresence>
                {isMessageVisible && (
                  <motion.div
                    key={`msg-${messageIndex}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full shadow-lg whitespace-nowrap pointer-events-none"
                  >
                    {RUNAWAY_MESSAGES[messageIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}