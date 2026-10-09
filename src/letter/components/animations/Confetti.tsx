/* src/ui/components/animations/Confetti.tsx */
import { motion } from 'motion/react'

export default function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * 100 + '%', rotate: 0, opacity: 1 }}
          animate={{ y: '110%', rotate: 720, opacity: 0 }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          className="absolute w-2 h-3 rounded-sm"
          style={{
            backgroundColor: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#f368e0'][i % 5],
          }}
        />
      ))}
    </div>
  )
}