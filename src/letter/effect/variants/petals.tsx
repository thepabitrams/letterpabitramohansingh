/* src/letter/effect/variants/petals.tsx */
import { motion } from 'motion/react'

const PETAL_COUNT = 18

const PETAL_COLORS = ['#fbcfe8', '#f9a8d4', '#f472b6', '#fda4af', '#fecdd3']

const PETALS = Array.from({ length: PETAL_COUNT }).map((_, index) => ({
  id: index,
  left: Math.random() * 100,
  size: 10 + Math.random() * 8,
  duration: 6 + Math.random() * 4,
  delay: Math.random() * 6,
  color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
}))

const PetalsLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {PETALS.map((petal) => (
      <motion.div
        key={petal.id}
        className="absolute"
        style={{
          left: `${petal.left}%`,
          fontSize: petal.size,
          color: petal.color,
        }}
        initial={{ top: '-10%', rotate: 0, opacity: 0 }}
        animate={{
          top: '110%',
          rotate: [0, 180, 360],
          opacity: [0, 1, 1, 0],
          x: [0, 20, -10, 15, 0],
        }}
        transition={{
          duration: petal.duration,
          delay: petal.delay,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        ❀
      </motion.div>
    ))}
  </div>
)

export default {
  id: 'petals',
  name: 'Petals',
  component: PetalsLayer,

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const layer = document.getElementById('effects');
      if (layer) {
        const colors = ['#fbcfe8', '#f9a8d4', '#f472b6', '#fda4af', '#fecdd3'];
        for (let index = 0; index < 18; index++) {
          const size = 10 + Math.random() * 8;
          const duration = 6 + Math.random() * 4;
          const delay = Math.random() * 6;
          const color = colors[Math.floor(Math.random() * colors.length)];

          const petal = document.createElement('div');
          petal.style.position = 'absolute';
          petal.style.left = Math.random() * 100 + '%';
          petal.style.top = '-10%';
          petal.style.fontSize = size + 'px';
          petal.style.color = color;
          petal.textContent = '\\u2740';
          layer.appendChild(petal);

          animate(
            petal,
            {
              top: ['-10%', '110%'],
              rotate: [0, 180, 360],
              opacity: [0, 1, 1, 0],
              x: [0, 20, -10, 15, 0],
            },
            { duration: duration, delay: delay, repeat: Infinity, ease: 'linear' }
          );
        }
      }
    `,
  },
}