/* src/letter/effect/variants/fireworks.tsx */
import { motion } from 'motion/react'
import { FaStar, FaRegStar } from 'react-icons/fa'

const FIREWORK_COLORS = ['#fbbf24', '#f59e0b', '#fb923c', '#f472b6', '#a78bfa', '#60a5fa']

export default {
  id: 'fireworks',
  name: 'Fireworks',

  component: () => (
    <>
      {Array.from({ length: 10 }).map((_, particleIndex) => {
        const StarIcon = particleIndex % 2 === 0 ? FaStar : FaRegStar

        return (
          <motion.div
            key={particleIndex}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, delay: particleIndex * 0.5 }}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 75}%`,
              top: `${15 + Math.random() * 60}%`,
              color: FIREWORK_COLORS[particleIndex % FIREWORK_COLORS.length],
            }}
          >
            <StarIcon size={28 + Math.random() * 16} />
          </motion.div>
        )
      })}
    </>
  ),

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const effectLayer = document.getElementById('effects');
      const fireworkColors = ['#fbbf24', '#f59e0b', '#fb923c', '#f472b6', '#a78bfa', '#60a5fa'];
      for (let index = 0; index < 10; index++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = (10 + Math.random() * 75) + '%';
        particle.style.top = (15 + Math.random() * 60) + '%';
        particle.style.color = fireworkColors[index % fireworkColors.length];
        particle.style.fontSize = (28 + Math.random() * 16) + 'px';
        particle.textContent = index % 2 === 0 ? '\\u2605' : '\\u2606';
        effectLayer.appendChild(particle);

        animate(
          particle,
          { scale: [0, 1.4, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] },
          { duration: 2, repeat: Infinity, delay: index * 0.5 }
        );
      }
    `,
  },
}