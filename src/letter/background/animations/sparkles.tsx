/* src/letter/background/animations/sparkles.tsx */
import { motion } from 'motion/react'

const SPARKLE_COUNT = 25

const SPARKLES = Array.from({ length: SPARKLE_COUNT }).map((_, index) => ({
  id: index,
  size: 3 + Math.random() * 4,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 1.5 + Math.random() * 2,
  delay: Math.random() * 3,
}))

const SparklesLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {SPARKLES.map((sparkle) => (
      <motion.div
        key={sparkle.id}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: sparkle.duration,
          repeat: Infinity,
          delay: sparkle.delay,
          ease: 'easeInOut',
        }}
        className="absolute rounded-full"
        style={{
          width: sparkle.size,
          height: sparkle.size,
          left: `${sparkle.left}%`,
          top: `${sparkle.top}%`,
          background: '#ffffff',
          boxShadow: `0 0 ${sparkle.size * 4}px rgba(255, 255, 255, 0.9)`,
        }}
      />
    ))}
  </div>
)

export default {
  id: 'sparkles',
  name: 'Sparkles',
  category: 'motion' as const,
  variants: {},
  component: SparklesLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        for (let index = 0; index < 25; index++) {
          const size = 3 + Math.random() * 4;
          const duration = 1.5 + Math.random() * 2;
          const delay = Math.random() * 3;

          const sparkle = document.createElement('div');
          sparkle.style.position = 'absolute';
          sparkle.style.width = size + 'px';
          sparkle.style.height = size + 'px';
          sparkle.style.left = Math.random() * 100 + '%';
          sparkle.style.top = Math.random() * 100 + '%';
          sparkle.style.borderRadius = '50%';
          sparkle.style.background = '#ffffff';
          sparkle.style.boxShadow = '0 0 ' + (size * 4) + 'px rgba(255, 255, 255, 0.9)';
          sparkle.style.willChange = 'transform, opacity';
          layer.appendChild(sparkle);

          sparkle.animate(
            [
              { opacity: 0, transform: 'scale(0)' },
              { opacity: 1, transform: 'scale(1)' },
              { opacity: 0, transform: 'scale(0)' },
            ],
            { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: 'ease-in-out' }
          );
        }
      }
    `,
  },
}