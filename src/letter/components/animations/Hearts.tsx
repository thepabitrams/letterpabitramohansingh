/* src/ui/components/animations/Hearts.tsx */
import { motion } from 'motion/react'

export default function Hearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110%', x: Math.random() * 100 + '%', opacity: 0 }}
          animate={{ y: '-10%', opacity: [0, 1, 0] }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: i * 0.5 }}
          className="absolute text-2xl"
        >
          💕
        </motion.div>
      ))}
    </div>
  )
}