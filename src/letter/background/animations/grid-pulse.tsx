/* src/letter/background/animations/grid-pulse.tsx */
import { motion } from 'motion/react'

const GRID_SIZE = 22

const GridPulseLayer = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage:
        'radial-gradient(circle, rgba(147, 197, 253, 0.5) 1px, transparent 1px)',
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    }}
    initial={{ opacity: 0.2 }}
    animate={{ opacity: [0.2, 0.6, 0.2] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  />
)

export default {
  id: 'grid-pulse',
  name: 'Grid Pulse',
  category: 'motion' as const,
  variants: {},
  component: GridPulseLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const gridLayer = document.createElement('div');
        gridLayer.style.position = 'absolute';
        gridLayer.style.inset = '0';
        gridLayer.style.pointerEvents = 'none';
        gridLayer.style.backgroundImage = 'radial-gradient(circle, rgba(147, 197, 253, 0.5) 1px, transparent 1px)';
        gridLayer.style.backgroundSize = '22px 22px';
        gridLayer.style.opacity = '0.2';
        gridLayer.style.willChange = 'opacity';
        backgroundElement.insertBefore(gridLayer, backgroundElement.firstChild);

        gridLayer.animate(
          [
            { opacity: 0.2, offset: 0 },
            { opacity: 0.6, offset: 0.5 },
            { opacity: 0.2, offset: 1 },
          ],
          { duration: 4000, iterations: Infinity, easing: 'ease-in-out' }
        );
      }
    `,
  },
}