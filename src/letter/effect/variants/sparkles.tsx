/* src/letter/effect/variants/sparkles.tsx */
import { motion } from 'motion/react'

const SPARKLE_COUNT = 25

const SPARKLE_COLORS = ['#fde047', '#ffffff', '#fbcfe8', '#fcd34d']

const SPARKLES = Array.from({ length: SPARKLE_COUNT }).map((_, index) => ({
  id: index,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 8 + Math.random() * 14,
  duration: 1.5 + Math.random() * 2,
  delay: Math.random() * 3,
  color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
}))

const SparklesLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {SPARKLES.map((sparkle) => (
      <motion.div
        key={sparkle.id}
        className="absolute"
        style={{
          left: `${sparkle.left}%`,
          top: `${sparkle.top}%`,
          fontSize: sparkle.size,
          color: sparkle.color,
        }}
        animate={{
          scale: [0, 1.3, 0],
          opacity: [0, 1, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: sparkle.duration,
          delay: sparkle.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        ✦
      </motion.div>
    ))}
  </div>
)

export default {
  id: 'sparkles',
  name: 'Sparkles',
  component: SparklesLayer,

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const layer = document.getElementById('effects');
      if (layer) {
        const colors = ['#fde047', '#ffffff', '#fbcfe8', '#fcd34d'];
        for (let index = 0; index < 25; index++) {
          const size = 8 + Math.random() * 14;
          const duration = 1.5 + Math.random() * 2;
          const delay = Math.random() * 3;
          const color = colors[Math.floor(Math.random() * colors.length)];

          const sparkle = document.createElement('div');
          sparkle.style.position = 'absolute';
          sparkle.style.left = Math.random() * 100 + '%';
          sparkle.style.top = Math.random() * 100 + '%';
          sparkle.style.fontSize = size + 'px';
          sparkle.style.color = color;
          sparkle.textContent = '\\u2726';
          layer.appendChild(sparkle);

          animate(
            sparkle,
            { scale: [0, 1.3, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] },
            { duration: duration, delay: delay, repeat: Infinity, ease: 'easeInOut' }
          );
        }
      }
    `,
  },
}