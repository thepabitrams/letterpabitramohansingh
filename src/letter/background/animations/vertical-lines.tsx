/* src/letter/background/animations/vertical-lines.tsx */
import { motion } from 'motion/react'

const LINE_COUNT = 15

const LINES = Array.from({ length: LINE_COUNT }).map((_, index) => ({
  id: index,
  left: (index / LINE_COUNT) * 100,
  duration: 3 + Math.random() * 3,
  delay: Math.random() * 3,
}))

const VerticalLinesLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {LINES.map((line) => (
      <div
        key={line.id}
        className="absolute top-0 h-full w-px"
        style={{ left: `${line.left}%`, background: 'rgba(96, 165, 250, 0.15)' }}
      >
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: '600%' }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            delay: line.delay,
            ease: 'linear',
          }}
          className="absolute w-full h-10"
          style={{
            background:
              'linear-gradient(180deg, transparent, #60a5fa, transparent)',
          }}
        />
      </div>
    ))}
  </div>
)

export default {
  id: 'vertical-lines',
  name: 'Vertical Lines',
  category: 'motion' as const,
  variants: {},
  component: VerticalLinesLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        for (let index = 0; index < 15; index++) {
          const left = (index / 15) * 100;
          const duration = 3 + Math.random() * 3;
          const delay = Math.random() * 3;

          const line = document.createElement('div');
          line.style.position = 'absolute';
          line.style.top = '0';
          line.style.left = left + '%';
          line.style.width = '1px';
          line.style.height = '100%';
          line.style.background = 'rgba(96, 165, 250, 0.15)';
          layer.appendChild(line);

          const segment = document.createElement('div');
          segment.style.position = 'absolute';
          segment.style.width = '100%';
          segment.style.height = '40px';
          segment.style.background = 'linear-gradient(180deg, transparent, #60a5fa, transparent)';
          segment.style.willChange = 'transform';
          line.appendChild(segment);

          segment.animate(
            [
              { transform: 'translateY(-100%)' },
              { transform: 'translateY(600%)' },
            ],
            { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: 'linear' }
          );
        }
      }
    `,
  },
}