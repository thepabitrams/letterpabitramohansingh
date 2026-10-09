/* src/letter/background/animations/particles.tsx */
import { motion } from 'motion/react'

const PARTICLE_COUNT = 25

const PARTICLES = Array.from({ length: PARTICLE_COUNT }).map((_, index) => ({
  id: index,
  size: 2 + Math.random() * 3,
  left: Math.random() * 100,
  duration: 5 + Math.random() * 5,
  delay: Math.random() * 5,
  opacity: 0.6 + Math.random() * 0.4,
}))

const ParticleLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {PARTICLES.map((particle) => (
      <motion.div
        key={particle.id}
        initial={{ y: 0, opacity: 0 }}
        animate={{
          y: '-110vh',
          opacity: [0, particle.opacity, particle.opacity, 0],
        }}
        transition={{
          duration: particle.duration,
          repeat: Infinity,
          delay: particle.delay,
          ease: 'linear',
        }}
        className="absolute rounded-full"
        style={{
          width: particle.size,
          height: particle.size,
          left: `${particle.left}%`,
          bottom: '-10px',
          background: `rgba(255, 255, 255, ${particle.opacity})`,
          boxShadow: `0 0 ${particle.size * 3}px rgba(255, 255, 255, 0.5)`,
        }}
      />
    ))}
  </div>
)

export default {
  id: 'particles',
  name: 'Particles',
  category: 'motion' as const,
  variants: {},
  component: ParticleLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        for (let index = 0; index < 25; index++) {
          const size = 2 + Math.random() * 3;
          const duration = 5 + Math.random() * 5;
          const delay = Math.random() * 5;
          const opacity = 0.6 + Math.random() * 0.4;

          const particle = document.createElement('div');
          particle.style.position = 'absolute';
          particle.style.width = size + 'px';
          particle.style.height = size + 'px';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.bottom = '-10px';
          particle.style.borderRadius = '50%';
          particle.style.background = 'rgba(255, 255, 255, ' + opacity + ')';
          particle.style.boxShadow = '0 0 ' + (size * 3) + 'px rgba(255, 255, 255, 0.5)';
          particle.style.willChange = 'transform, opacity';
          layer.appendChild(particle);

          particle.animate(
            [
              { transform: 'translateY(0)', opacity: 0 },
              { transform: 'translateY(-30vh)', opacity: opacity, offset: 0.2 },
              { transform: 'translateY(-80vh)', opacity: opacity, offset: 0.8 },
              { transform: 'translateY(-110vh)', opacity: 0 },
            ],
            { duration: duration * 1000, delay: delay * 1000, iterations: Infinity, easing: 'linear' }
          );
        }
      }
    `,
  },
}