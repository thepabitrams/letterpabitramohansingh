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

const RUN_MESSAGES = ['Are you sure?', 'Really?', 'Think again!', 'Please?', 'Last chance!', '🥺']

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
  const [showMsg, setShowMsg] = useState(false)
  const [isBlasting, setIsBlasting] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastMoveRef = useRef(0)

  const applyRandomPos = () => {
    const c = containerRef.current
    if (!c) return
    const { width, height } = c.getBoundingClientRect()

    const maxX = Math.max(width / 2 - 40, 100)
    const maxY = Math.max(height / 2 - 40, 80)

    let newX = 0
    let newY = 0
    let attempts = 0

    do {
      const angle = Math.random() * Math.PI * 2
      const distance = 150 + Math.random() * 80
      newX = pos.x + Math.cos(angle) * distance
      newY = pos.y + Math.sin(angle) * distance
      newX = Math.max(-maxX, Math.min(maxX, newX))
      newY = Math.max(-maxY, Math.min(maxY, newY))
      attempts++
    } while (
      attempts < 5 &&
      Math.hypot(newX - pos.x, newY - pos.y) < 100
    )

    setPos({ x: newX, y: newY })
  }

  const move = () => {
    setMsgIndex((i) => (i + 1) % RUN_MESSAGES.length)
    setShowMsg(true)

    if (animation === 'blast') {
      setIsBlasting(true)
      setBurstKey((k) => k + 1)
      setTimeout(() => {
        setIsBlasting(false)
        applyRandomPos()
      }, 300)
    } else if (animation === 'runaway') {
      applyRandomPos()
    }
  }

  const handleInteraction = (e: React.SyntheticEvent) => {
    if (!isTrigger) return
    e.preventDefault()
    e.stopPropagation()

    const now = Date.now()
    if (now - lastMoveRef.current < 200) return
    lastMoveRef.current = now

    move()
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isTrigger) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    onClick?.()
  }

  const rawVariants = animConfig?.category === 'motion' ? animConfig.variants : {}
  const { transition: animTransition, ...motionVariants } = rawVariants as any

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
          <motion.div
            key="btn-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
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
              transition={animTransition ?? { type: 'spring', stiffness: 400, damping: 20 }}
              onHoverStart={handleInteraction}
              onTouchStart={handleInteraction}
              onTouchMove={handleInteraction}
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

            {isTrigger && (
              <AnimatePresence>
                {showMsg && (
                  <motion.div
                    key={`msg-${msgIndex}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full shadow-lg whitespace-nowrap pointer-events-none"
                  >
                    {RUN_MESSAGES[msgIndex]}
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