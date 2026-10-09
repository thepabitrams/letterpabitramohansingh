/* src/letter/background/animations/starfield.tsx */
import { motion } from 'motion/react'

const STAR_COUNT = 60

const STARS = Array.from({ length: STAR_COUNT }).map((_, index) => ({
  id: index,
  size: 1 + Math.random() * 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 2 + Math.random() * 4,
  delay: Math.random() * 3,
}))

const StarfieldLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {STARS.map((star) => (
      <motion.div
        key={star.id}
        initial={{ opacity: 0.3, scale: 1 }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
        transition={{
          duration: star.duration,
          repeat: Infinity,
          delay: star.delay,
          ease: 'easeInOut',
        }}
        className="absolute rounded-full"
        style={{
          width: star.size,
          height: star.size,
          left: `${star.left}%`,
          top: `${star.top}%`,
          background: '#ffffff',
          boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8)`,
        }}
      />
    ))}
  </div>
)

export default {
  id: 'starfield',
  name: 'Starfield',
  category: 'motion' as const,
  variants: {},
  component: StarfieldLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        for (let index = 0; index < 60; index++) {
          const size = 1 + Math.random() * 2;
          const duration = 2 + Math.random() * 4;
          const delay = Math.random() * 3;

          const star = document.createElement('div');
          star.style.position = 'absolute';
          star.style.width = size + 'px';
          star.style.height = size + 'px';
          star.style.left = Math.random() * 100 + '%';
          star.style.top = Math.random() * 100 + '%';
          star.style.borderRadius = '50%';
          star.style.background = '#ffffff';
          star.style.boxShadow = '0 0 ' + (size * 3) + 'px rgba(255, 255, 255, 0.8)';
          star.style.willChange = 'transform, opacity';
          layer.appendChild(star);

          star.animate(
            [
              { opacity: 0.3, transform: 'scale(1)' },
              { opacity: 1, transform: 'scale(1.3)' },
              { opacity: 0.3, transform: 'scale(1)' },
            ],
            { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: 'ease-in-out' }
          );
        }
      }
    `,
  },
}