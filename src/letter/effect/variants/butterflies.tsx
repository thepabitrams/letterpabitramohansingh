/* src/letter/effect/variants/butterflies.tsx */
import { motion } from 'motion/react'

const BUTTERFLY_COUNT = 6

const BUTTERFLIES = Array.from({ length: BUTTERFLY_COUNT }).map((_, index) => ({
  id: index,
  left: 5 + index * 15,
  top: 15 + Math.random() * 50,
  size: 20 + Math.random() * 14,
  duration: 8 + Math.random() * 4,
  delay: Math.random() * 3,
}))

const ButterfliesLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {BUTTERFLIES.map((butterfly) => (
      <motion.div
        key={butterfly.id}
        className="absolute"
        style={{
          left: `${butterfly.left}%`,
          top: `${butterfly.top}%`,
          fontSize: butterfly.size,
        }}
        animate={{
          x: [0, 30, 60, 90, 60, 30, 0],
          y: [0, -20, -10, -30, -40, -20, 0],
          rotate: [0, 10, -10, 15, -5, 8, 0],
        }}
        transition={{
          duration: butterfly.duration,
          delay: butterfly.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🦋
      </motion.div>
    ))}
  </div>
)

export default {
  id: 'butterflies',
  name: 'Butterflies',
  component: ButterfliesLayer,

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const layer = document.getElementById('effects');
      if (layer) {
        for (let index = 0; index < 6; index++) {
          const size = 20 + Math.random() * 14;
          const duration = 8 + Math.random() * 4;
          const delay = Math.random() * 3;

          const butterfly = document.createElement('div');
          butterfly.style.position = 'absolute';
          butterfly.style.left = (5 + index * 15) + '%';
          butterfly.style.top = (15 + Math.random() * 50) + '%';
          butterfly.style.fontSize = size + 'px';
          butterfly.textContent = '\\uD83E\\uDD8B';
          layer.appendChild(butterfly);

          animate(
            butterfly,
            {
              x: [0, 30, 60, 90, 60, 30, 0],
              y: [0, -20, -10, -30, -40, -20, 0],
              rotate: [0, 10, -10, 15, -5, 8, 0],
            },
            { duration: duration, delay: delay, repeat: Infinity, ease: 'easeInOut' }
          );
        }
      }
    `,
  },
}