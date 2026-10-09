/* src/letter/background/animations/ripples.tsx */
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

type Ripple = {
  id: number
  left: number
  top: number
  delay: number
}

const RIPPLE_INTERVAL = 700
const MAX_RIPPLES = 10

const RipplesLayer = () => {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    let nextId = 0
    let isMounted = true

    const createRipple = () => {
      if (!isMounted) return

      const newRipple: Ripple = {
        id: nextId++,
        left: 10 + Math.random() * 80,
        top: 10 + Math.random() * 80,
        delay: 0,
      }

      setRipples((previous) => {
        const updated = [...previous, newRipple]
        return updated.length > MAX_RIPPLES ? updated.slice(1) : updated
      })

      setTimeout(() => {
        if (isMounted) {
          setRipples((previous) => previous.filter((r) => r.id !== newRipple.id))
        }
      }, 3000)
    }

    createRipple()
    const interval = setInterval(createRipple, RIPPLE_INTERVAL)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full border-2 border-blue-400"
          style={{
            width: 80,
            height: 80,
            left: `${ripple.left}%`,
            top: `${ripple.top}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0.2, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 3, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export default {
  id: 'ripples',
  name: 'Ripples',
  category: 'motion' as const,
  variants: {},
  component: RipplesLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        const createRipple = () => {
          const ripple = document.createElement('div');
          const left = 10 + Math.random() * 80;
          const top = 10 + Math.random() * 80;

          ripple.style.position = 'absolute';
          ripple.style.width = '80px';
          ripple.style.height = '80px';
          ripple.style.left = left + '%';
          ripple.style.top = top + '%';
          ripple.style.transform = 'translate(-50%, -50%) scale(0.2)';
          ripple.style.border = '2px solid #60a5fa';
          ripple.style.borderRadius = '50%';
          ripple.style.opacity = '0.8';
          ripple.style.willChange = 'transform, opacity';
          layer.appendChild(ripple);

          ripple.animate(
            [
              { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.8 },
              { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 },
            ],
            { duration: 3000, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
          );

          setTimeout(() => ripple.remove(), 3100);
        };

        createRipple();
        setInterval(createRipple, 700);
      }
    `,
  },
}