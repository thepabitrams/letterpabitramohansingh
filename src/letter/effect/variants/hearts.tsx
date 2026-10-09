import { motion } from 'motion/react'
import { FaHeart } from 'react-icons/fa'

const HEART_COLORS = ['#ec4899', '#f472b6', '#fb7185', '#f43f5e', '#e11d48']

export default {
  id: 'hearts',
  name: 'Hearts',
  component: () => (
    <>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ top: '100%', opacity: 0, rotate: 0 }}
          animate={{ top: '-10%', opacity: [0, 1, 1, 0], rotate: [0, 20, -20, 0] }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'linear',
          }}
          className="absolute"
          style={{
            left: `${Math.random() * 95}%`,
            color: HEART_COLORS[i % HEART_COLORS.length],
          }}
        >
          <FaHeart size={20 + Math.random() * 12} />
        </motion.div>
      ))}
    </>
  ),
}