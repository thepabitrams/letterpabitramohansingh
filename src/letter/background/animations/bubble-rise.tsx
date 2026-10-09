/* src/letter/background/animations/bubble-rise.tsx */
import { motion } from 'motion/react'

const BUBBLE_COUNT = 25

const BUBBLES = Array.from({ length: BUBBLE_COUNT }).map((_, index) => ({
  id: index,
  size: 6 + Math.random() * 14,
  left: Math.random() * 100,
  duration: 4 + Math.random() * 4,
  delay: Math.random() * 5,
}))

const BubbleRiseLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {BUBBLES.map((bubble) => (
      <motion.div
        key={bubble.id}
        initial={{ top: '100%', opacity: 0, scale: 0.5 }}
        animate={{
          top: '-10%',
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 1.2],
        }}
        transition={{
          duration: bubble.duration,
          repeat: Infinity,
          delay: bubble.delay,
          ease: 'linear',
        }}
        className="absolute rounded-full border"
        style={{
          width: bubble.size,
          height: bubble.size,
          left: `${bubble.left}%`,
          background:
            'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.2))',
          borderColor: 'rgba(255, 255, 255, 0.4)',
        }}
      />
    ))}
  </div>
)

export default {
  id: 'bubble-rise',
  name: 'Bubble Rise',
  category: 'motion' as const,
  variants: {},
  component: BubbleRiseLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        for (let index = 0; index < 25; index++) {
          const size = 6 + Math.random() * 14;
          const duration = 4 + Math.random() * 4;
          const delay = Math.random() * 5;

          const bubble = document.createElement('div');
          bubble.style.position = 'absolute';
          bubble.style.width = size + 'px';
          bubble.style.height = size + 'px';
          bubble.style.left = Math.random() * 100 + '%';
          bubble.style.top = '100%';
          bubble.style.borderRadius = '50%';
          bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2))';
          bubble.style.border = '1px solid rgba(255, 255, 255, 0.4)';
          bubble.style.willChange = 'transform, opacity, top';
          layer.appendChild(bubble);

          bubble.animate(
            [
              { top: '100%', opacity: 0, transform: 'scale(0.5)' },
              { top: '70%', opacity: 1, transform: 'scale(1)', offset: 0.3 },
              { top: '20%', opacity: 1, transform: 'scale(1)', offset: 0.8 },
              { top: '-10%', opacity: 0, transform: 'scale(1.2)' },
            ],
            { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: 'linear' }
          );
        }
      }
    `,
  },
}