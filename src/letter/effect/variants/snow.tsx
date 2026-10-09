import { motion } from 'motion/react'

export default {
  id: 'snow',
  name: 'Snow',
  component: () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 0 }}
          animate={{ y: '110%', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          className="absolute text-xl"
        >
          ❄️
        </motion.div>
      ))}
    </div>
  ),
}