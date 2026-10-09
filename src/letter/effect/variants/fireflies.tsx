/* src/letter/effect/variants/fireflies.tsx */
import { motion } from 'motion/react'

const FIREFLY_COUNT = 18

const FIREFLIES = Array.from({ length: FIREFLY_COUNT }).map((_, index) => ({
  id: index,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 3 + Math.random() * 4,
  duration: 4 + Math.random() * 4,
  delay: Math.random() * 3,
}))

const FirefliesLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {FIREFLIES.map((firefly) => (
      <motion.div
        key={firefly.id}
        className="absolute rounded-full"
        style={{
          left: `${firefly.left}%`,
          top: `${firefly.top}%`,
          width: firefly.size,
          height: firefly.size,
          background: '#fde047',
          boxShadow: `0 0 ${firefly.size * 4}px #fde047, 0 0 ${firefly.size * 8}px rgba(253, 224, 71, 0.5)`,
        }}
        animate={{
          x: [0, 25, -15, 30, 0],
          y: [0, -25, -50, -20, 0],
          opacity: [0.3, 1, 0.5, 1, 0.3],
          scale: [0.8, 1.2, 1, 1.3, 0.8],
        }}
        transition={{
          duration: firefly.duration,
          delay: firefly.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
)

export default {
  id: 'fireflies',
  name: 'Fireflies',
  component: FirefliesLayer,

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const layer = document.getElementById('effects');
      if (layer) {
        for (let index = 0; index < 18; index++) {
          const size = 3 + Math.random() * 4;
          const duration = 4 + Math.random() * 4;
          const delay = Math.random() * 3;

          const firefly = document.createElement('div');
          firefly.style.position = 'absolute';
          firefly.style.left = Math.random() * 100 + '%';
          firefly.style.top = Math.random() * 100 + '%';
          firefly.style.width = size + 'px';
          firefly.style.height = size + 'px';
          firefly.style.borderRadius = '50%';
          firefly.style.background = '#fde047';
          firefly.style.boxShadow = '0 0 ' + (size * 4) + 'px #fde047, 0 0 ' + (size * 8) + 'px rgba(253, 224, 71, 0.5)';
          layer.appendChild(firefly);

          animate(
            firefly,
            {
              x: [0, 25, -15, 30, 0],
              y: [0, -25, -50, -20, 0],
              opacity: [0.3, 1, 0.5, 1, 0.3],
              scale: [0.8, 1.2, 1, 1.3, 0.8],
            },
            { duration: duration, delay: delay, repeat: Infinity, ease: 'easeInOut' }
          );
        }
      }
    `,
  },
}