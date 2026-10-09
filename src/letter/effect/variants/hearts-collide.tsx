/* src/letter/effect/variants/hearts-collide.tsx */
import { useEffect, useRef } from 'react'

const REDS = ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5', '#e11d48', '#be123c']

const KEYFRAMES = `
  @keyframes effectDhakDhak {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    15% { transform: translate(-50%, -50%) scale(1.25); }
    30% { transform: translate(-50%, -50%) scale(1); }
    45% { transform: translate(-50%, -50%) scale(1.18); }
    60% { transform: translate(-50%, -50%) scale(1); }
  }
  @keyframes effectParticleBlast {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    60% { opacity: 1; }
    100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); opacity: 0; }
  }
  @keyframes effectPuffExpand {
    0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.9; }
    100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.5); opacity: 0; }
  }
`

const HeartsCollideLayer = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isMounted = true
    let collisionTimer: ReturnType<typeof setTimeout> | null = null
    let blastTimer: ReturnType<typeof setTimeout> | null = null
    let loopTimer: ReturnType<typeof setTimeout> | null = null

    const buildHearts = () => {
      container.innerHTML = ''

      const heartTop = document.createElement('div')
      heartTop.textContent = '♥'
      heartTop.style.cssText = `
        position: absolute;
        left: 50%;
        top: 15%;
        font-size: 72px;
        color: #ef4444;
        transform: translate(-50%, -50%);
        filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.5));
        user-select: none;
        will-change: transform, top;
        animation: effectDhakDhak 1.2s ease-in-out infinite;
      `

      const heartBottom = document.createElement('div')
      heartBottom.textContent = '♥'
      heartBottom.style.cssText = `
        position: absolute;
        left: 50%;
        top: 85%;
        font-size: 72px;
        color: #ef4444;
        transform: translate(-50%, -50%);
        filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.5));
        user-select: none;
        will-change: transform, top;
        animation: effectDhakDhak 1.2s ease-in-out infinite;
      `

      container.appendChild(heartTop)
      container.appendChild(heartBottom)

      return { heartTop, heartBottom }
    }

    const triggerBlast = (heartTop: HTMLElement, heartBottom: HTMLElement) => {
      heartTop.style.opacity = '0'
      heartBottom.style.opacity = '0'

      // Soft cloud puffs
      for (let i = 0; i < 8; i++) {
        const puff = document.createElement('div')
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.3
        const distance = 40 + Math.random() * 60
        const dx = Math.cos(angle) * distance
        const dy = Math.sin(angle) * distance
        const size = 40 + Math.random() * 30

        puff.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(239, 68, 68, 0.7), rgba(239, 68, 68, 0) 70%);
          filter: blur(2px);
          --dx: ${dx}px;
          --dy: ${dy}px;
          animation: effectPuffExpand ${1.2 + Math.random() * 0.4}s ease-out forwards;
        `
        container.appendChild(puff)
      }

      // Small red particles
      for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div')
        const angle = Math.random() * Math.PI * 2
        const speed = 60 + Math.random() * 180
        const dx = Math.cos(angle) * speed
        const dy = Math.sin(angle) * speed
        const size = 2 + Math.random() * 4
        const color = REDS[Math.floor(Math.random() * REDS.length)]

        particle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: ${color};
          box-shadow: 0 0 ${size * 2}px ${color};
          --dx: ${dx}px;
          --dy: ${dy}px;
          animation: effectParticleBlast ${0.8 + Math.random() * 0.6}s ease-out forwards;
        `
        container.appendChild(particle)
      }
    }

    const runCycle = () => {
      if (!isMounted) return

      const { heartTop, heartBottom } = buildHearts()

      // 2s — hearts collide (move to center)
      collisionTimer = setTimeout(() => {
        if (!isMounted) return
        heartTop.style.animation = 'none'
        heartBottom.style.animation = 'none'
        heartTop.style.transition = 'top 0.6s cubic-bezier(0.5, 0, 0.5, 1)'
        heartBottom.style.transition = 'top 0.6s cubic-bezier(0.5, 0, 0.5, 1)'
        // Force reflow
        void heartTop.offsetWidth
        heartTop.style.top = '50%'
        heartBottom.style.top = '50%'
      }, 2000)

      // 2.6s — blast
      blastTimer = setTimeout(() => {
        if (!isMounted) return
        triggerBlast(heartTop, heartBottom)
      }, 2600)

      // 5.2s — loop
      loopTimer = setTimeout(() => {
        if (!isMounted) return
        runCycle()
      }, 5200)
    }

    runCycle()

    return () => {
      isMounted = false
      if (collisionTimer) clearTimeout(collisionTimer)
      if (blastTimer) clearTimeout(blastTimer)
      if (loopTimer) clearTimeout(loopTimer)
    }
  }, [])

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden pointer-events-none"
      />
    </>
  )
}

export default {
  id: 'hearts-collide',
  name: 'Hearts Collide',
  component: HeartsCollideLayer,

  standalone: {
    script: `
      const layer = document.getElementById('effects');
      if (layer) {
        const REDS = ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5', '#e11d48', '#be123c'];

        const style = document.createElement('style');
        style.textContent = \`
          @keyframes effectDhakDhak {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            15% { transform: translate(-50%, -50%) scale(1.25); }
            30% { transform: translate(-50%, -50%) scale(1); }
            45% { transform: translate(-50%, -50%) scale(1.18); }
            60% { transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes effectParticleBlast {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            60% { opacity: 1; }
            100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); opacity: 0; }
          }
          @keyframes effectPuffExpand {
            0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.9; }
            100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.5); opacity: 0; }
          }
        \`;
        document.head.appendChild(style);

        const runCycle = () => {
          layer.innerHTML = '';

          const heartTop = document.createElement('div');
          heartTop.textContent = '\\u2665';
          heartTop.style.cssText = 'position:absolute;left:50%;top:15%;font-size:72px;color:#ef4444;transform:translate(-50%,-50%);filter:drop-shadow(0 4px 12px rgba(239,68,68,0.5));user-select:none;will-change:transform,top;animation:effectDhakDhak 1.2s ease-in-out infinite;';

          const heartBottom = document.createElement('div');
          heartBottom.textContent = '\\u2665';
          heartBottom.style.cssText = 'position:absolute;left:50%;top:85%;font-size:72px;color:#ef4444;transform:translate(-50%,-50%);filter:drop-shadow(0 4px 12px rgba(239,68,68,0.5));user-select:none;will-change:transform,top;animation:effectDhakDhak 1.2s ease-in-out infinite;';

          layer.appendChild(heartTop);
          layer.appendChild(heartBottom);

          setTimeout(() => {
            heartTop.style.animation = 'none';
            heartBottom.style.animation = 'none';
            heartTop.style.transition = 'top 0.6s cubic-bezier(0.5, 0, 0.5, 1)';
            heartBottom.style.transition = 'top 0.6s cubic-bezier(0.5, 0, 0.5, 1)';
            void heartTop.offsetWidth;
            heartTop.style.top = '50%';
            heartBottom.style.top = '50%';
          }, 2000);

          setTimeout(() => {
            heartTop.style.opacity = '0';
            heartBottom.style.opacity = '0';

            for (let i = 0; i < 8; i++) {
              const puff = document.createElement('div');
              const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.3;
              const distance = 40 + Math.random() * 60;
              const dx = Math.cos(angle) * distance;
              const dy = Math.sin(angle) * distance;
              const size = 40 + Math.random() * 30;

              puff.style.cssText = 'position:absolute;top:50%;left:50%;width:' + size + 'px;height:' + size + 'px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);background:radial-gradient(circle, rgba(239,68,68,0.7), rgba(239,68,68,0) 70%);filter:blur(2px);--dx:' + dx + 'px;--dy:' + dy + 'px;animation:effectPuffExpand ' + (1.2 + Math.random() * 0.4) + 's ease-out forwards;';
              layer.appendChild(puff);
            }

            for (let i = 0; i < 80; i++) {
              const particle = document.createElement('div');
              const angle = Math.random() * Math.PI * 2;
              const speed = 60 + Math.random() * 180;
              const dx = Math.cos(angle) * speed;
              const dy = Math.sin(angle) * speed;
              const size = 2 + Math.random() * 4;
              const color = REDS[Math.floor(Math.random() * REDS.length)];

              particle.style.cssText = 'position:absolute;top:50%;left:50%;width:' + size + 'px;height:' + size + 'px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);background:' + color + ';box-shadow:0 0 ' + (size * 2) + 'px ' + color + ';--dx:' + dx + 'px;--dy:' + dy + 'px;animation:effectParticleBlast ' + (0.8 + Math.random() * 0.6) + 's ease-out forwards;';
              layer.appendChild(particle);
            }
          }, 2600);

          setTimeout(runCycle, 5200);
        };

        runCycle();
      }
    `,
  },
}