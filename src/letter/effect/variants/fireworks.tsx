import { motion } from 'motion/react'

export default {
  id: 'fireworks',
  name: 'Fireworks',
  component: () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            scale: 0,
            opacity: 0,
            x: Math.random() * 80 + 10 + '%',
            y: Math.random() * 60 + 20 + '%',
          }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.8 }}
          className="absolute text-5xl"
        >
          ✨
        </motion.div>
      ))}
    </div>
  ),
}