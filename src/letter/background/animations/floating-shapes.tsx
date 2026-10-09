/* src/letter/background/animations/floating-shapes.tsx */
import { motion } from 'motion/react'

const SHAPES = [
  { top: '15%', left: '15%', size: 60, color: 'rgba(236, 72, 153, 0.25)', border: 'rgba(236, 72, 153, 0.5)', borderRadius: 12, duration: 8, delay: 0 },
  { top: '40%', left: '70%', size: 70, color: 'rgba(139, 92, 246, 0.25)', border: 'rgba(139, 92, 246, 0.5)', borderRadius: '50%', duration: 10, delay: 1 },
  { top: '65%', left: '35%', size: 50, color: 'rgba(6, 182, 212, 0.25)', border: 'rgba(6, 182, 212, 0.5)', borderRadius: 0, duration: 12, delay: 2 },
  { top: '25%', left: '60%', size: 40, color: 'rgba(251, 191, 36, 0.25)', border: 'rgba(251, 191, 36, 0.5)', borderRadius: 8, duration: 9, delay: 3 },
]

const FloatingShapesLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {SHAPES.map((shape, index) => (
      <motion.div
        key={index}
        animate={{
          y: [0, -25, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: shape.duration,
          repeat: Infinity,
          delay: shape.delay,
          ease: 'easeInOut',
        }}
        className="absolute border-2"
        style={{
          top: shape.top,
          left: shape.left,
          width: shape.size,
          height: shape.size,
          background: shape.color,
          borderColor: shape.border,
          borderRadius: shape.borderRadius,
        }}
      />
    ))}
  </div>
)

export default {
  id: 'floating-shapes',
  name: 'Floating Shapes',
  category: 'motion' as const,
  variants: {},
  component: FloatingShapesLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const SHAPES = [
          { top: '15%', left: '15%', size: 60, bg: 'rgba(236,72,153,0.25)', border: 'rgba(236,72,153,0.5)', radius: '12px', duration: 8, delay: 0 },
          { top: '40%', left: '70%', size: 70, bg: 'rgba(139,92,246,0.25)', border: 'rgba(139,92,246,0.5)', radius: '50%', duration: 10, delay: 1 },
          { top: '65%', left: '35%', size: 50, bg: 'rgba(6,182,212,0.25)', border: 'rgba(6,182,212,0.5)', radius: '0', duration: 12, delay: 2 },
          { top: '25%', left: '60%', size: 40, bg: 'rgba(251,191,36,0.25)', border: 'rgba(251,191,36,0.5)', radius: '8px', duration: 9, delay: 3 },
        ];

        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        SHAPES.forEach((shape) => {
          const element = document.createElement('div');
          element.style.position = 'absolute';
          element.style.top = shape.top;
          element.style.left = shape.left;
          element.style.width = shape.size + 'px';
          element.style.height = shape.size + 'px';
          element.style.background = shape.bg;
          element.style.border = '2px solid ' + shape.border;
          element.style.borderRadius = shape.radius;
          element.style.willChange = 'transform';
          layer.appendChild(element);

          element.animate(
            [
              { transform: 'translateY(0) rotate(0deg)' },
              { transform: 'translateY(-25px) rotate(180deg)' },
              { transform: 'translateY(0) rotate(360deg)' },
            ],
            { duration: shape.duration * 1000, delay: shape.delay * 1000, iterations: Infinity, easing: 'ease-in-out' }
          );
        });
      }
    `,
  },
}