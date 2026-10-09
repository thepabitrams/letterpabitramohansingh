import { motion } from 'motion/react'

const CONFETTI_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#f368e0', '#ff9ff3']

export default {
  id: 'confetti',
  name: 'Confetti',
  component: () => (
    <>
      {Array.from({ length: 30 }).map((_, particleIndex) => {
        const isSquare = particleIndex % 2 === 0
        const particleSize = 6 + Math.random() * 6

        return (
          <motion.div
            key={particleIndex}
            initial={{ top: '-5%', rotate: 0, opacity: 1 }}
            animate={{ top: '105%', rotate: 720, opacity: [1, 1, 0] }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 98}%`,
              width: particleSize,
              height: isSquare ? particleSize : particleSize * 0.4,
              backgroundColor: CONFETTI_COLORS[particleIndex % CONFETTI_COLORS.length],
              borderRadius: isSquare ? '50%' : '2px',
            }}
          />
        )
      })}
    </>
  ),
}