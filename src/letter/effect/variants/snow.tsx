import { motion } from 'motion/react'
import { FaSnowflake } from 'react-icons/fa'

export default {
  id: 'snow',
  name: 'Snow',
  component: () => (
    <>
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ top: '-5%', opacity: 0, rotate: 0 }}
          animate={{ top: '105%', opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'linear',
          }}
          className="absolute text-white"
          style={{
            left: `${Math.random() * 98}%`,
            opacity: 0.7 + Math.random() * 0.3,
          }}
        >
          <FaSnowflake size={14 + Math.random() * 10} />
        </motion.div>
      ))}
    </>
  ),
}