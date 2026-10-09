/* src/letter/effect/variants/hearts.tsx */
import { motion } from 'motion/react'
import { FaHeart } from 'react-icons/fa'

const HEART_COLORS = ['#ec4899', '#f472b6', '#fb7185', '#f43f5e', '#e11d48']

export default {
  id: 'hearts',
  name: 'Hearts',

  component: () => (
    <>
      {Array.from({ length: 15 }).map((_, particleIndex) => (
        <motion.div
          key={particleIndex}
          initial={{ top: '100%', opacity: 0, rotate: 0 }}
          animate={{ top: '-10%', opacity: [0, 1, 1, 0], rotate: [0, 20, -20, 0] }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: particleIndex * 0.4,
            ease: 'linear',
          }}
          className="absolute"
          style={{
            left: `${Math.random() * 95}%`,
            color: HEART_COLORS[particleIndex % HEART_COLORS.length],
          }}
        >
          <FaHeart size={20 + Math.random() * 12} />
        </motion.div>
      ))}
    </>
  ),

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const effectLayer = document.getElementById('effects');
      const heartColors = ['#ec4899', '#f472b6', '#fb7185', '#f43f5e', '#e11d48'];
      for (let index = 0; index < 15; index++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.top = '100%';
        particle.style.left = Math.random() * 95 + '%';
        particle.style.color = heartColors[index % heartColors.length];
        particle.style.fontSize = (20 + Math.random() * 12) + 'px';
        particle.textContent = '\\u2665';
        effectLayer.appendChild(particle);

        animate(
          particle,
          { top: ['100%', '-10%'], opacity: [0, 1, 1, 0], rotate: [0, 20, -20, 0] },
          { duration: 6 + Math.random() * 4, repeat: Infinity, delay: index * 0.4, ease: 'linear' }
        );
      }
    `,
  },
}