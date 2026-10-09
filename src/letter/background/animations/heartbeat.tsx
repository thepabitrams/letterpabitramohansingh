/* src/letter/background/animations/heartbeat.tsx */
import { motion, useAnimationControls } from 'motion/react'
import { useEffect } from 'react'

const HEARTBEAT_PATH =
  'M 0 60 L 160 60 L 190 40 L 220 100 L 250 0 L 280 120 L 310 60 L 500 60 L 530 40 L 560 100 L 590 0 L 620 120 L 650 60 L 800 60'

const POSITIONS = [
  { top: '8%', rotate: 0 },
  { top: '22%', rotate: 0 },
  { top: '65%', rotate: 0 },
  { top: '85%', rotate: 0 },
  { top: '50%', rotate: -90 },
  { top: '50%', rotate: 90 },
]

const HeartbeatLine = ({
  id,
  initialDelay,
}: {
  id: string
  initialDelay: number
}) => {
  const controls = useAnimationControls()

  useEffect(() => {
    let isMounted = true
    let currentIndex = Math.floor(Math.random() * POSITIONS.length)

    const runCycle = async () => {
      await new Promise((resolve) => setTimeout(resolve, initialDelay))

      while (isMounted) {
        let newIndex = currentIndex
        while (newIndex === currentIndex && POSITIONS.length > 1) {
          newIndex = Math.floor(Math.random() * POSITIONS.length)
        }
        currentIndex = newIndex
        const position = POSITIONS[newIndex]

        await controls.start({
          top: position.top,
          rotate: position.rotate,
          transition: { duration: 1, ease: 'easeInOut' },
        })

        await new Promise((resolve) => setTimeout(resolve, 2500))
      }
    }

    runCycle()

    return () => {
      isMounted = false
    }
  }, [controls, initialDelay])

  const startPosition = POSITIONS[Math.floor(Math.random() * POSITIONS.length)]

  return (
    <motion.svg
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      className="absolute w-full h-24 left-0"
      initial={{ top: startPosition.top, rotate: startPosition.rotate }}
      animate={controls}
      style={{ transformOrigin: 'center center' }}
    >
      <defs>
        <linearGradient id={`hbGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
          <stop offset="15%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={HEARTBEAT_PATH}
        fill="none"
        stroke={`url(#hbGrad-${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: initialDelay / 1000 }}
      />
    </motion.svg>
  )
}

const HeartbeatLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <HeartbeatLine id="line-a" initialDelay={0} />
    <HeartbeatLine id="line-b" initialDelay={1200} />
  </div>
)

export default {
  id: 'heartbeat',
  name: 'Heartbeat',
  category: 'motion' as const,
  variants: {},
  component: HeartbeatLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        const HEARTBEAT_PATH = 'M 0 60 L 160 60 L 190 40 L 220 100 L 250 0 L 280 120 L 310 60 L 500 60 L 530 40 L 560 100 L 590 0 L 620 120 L 650 60 L 800 60';
        const svgNS = 'http://www.w3.org/2000/svg';

        const POSITIONS = [
          { top: 8, rotate: 0 },
          { top: 22, rotate: 0 },
          { top: 65, rotate: 0 },
          { top: 85, rotate: 0 },
          { top: 50, rotate: -90 },
          { top: 50, rotate: 90 },
        ];

        const buildLine = (id, initialDelay) => {
          const svg = document.createElementNS(svgNS, 'svg');
          svg.setAttribute('viewBox', '0 0 800 120');
          svg.setAttribute('preserveAspectRatio', 'none');
          svg.style.cssText = 'position:absolute;width:100%;height:96px;left:0;transition:top 1s ease-in-out, transform 1s ease-in-out;transform-origin:center center;';

          const defs = document.createElementNS(svgNS, 'defs');
          const gradient = document.createElementNS(svgNS, 'linearGradient');
          gradient.setAttribute('id', 'hbGrad-' + id);
          gradient.setAttribute('x1', '0%');
          gradient.setAttribute('x2', '100%');

          ['0|0', '15|0.9', '85|0.9', '100|0'].forEach((spec) => {
            const [offset, opacity] = spec.split('|');
            const stop = document.createElementNS(svgNS, 'stop');
            stop.setAttribute('offset', offset + '%');
            stop.setAttribute('stop-color', '#ef4444');
            stop.setAttribute('stop-opacity', opacity);
            gradient.appendChild(stop);
          });

          defs.appendChild(gradient);
          svg.appendChild(defs);

          const path = document.createElementNS(svgNS, 'path');
          path.setAttribute('d', HEARTBEAT_PATH);
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', 'url(#hbGrad-' + id + ')');
          path.setAttribute('stroke-width', '2.5');
          path.setAttribute('stroke-linecap', 'round');
          path.setAttribute('stroke-linejoin', 'round');
          path.setAttribute('stroke-dasharray', '1800');
          path.setAttribute('stroke-dashoffset', '1800');
          svg.appendChild(path);
          layer.appendChild(svg);

          let dashOffset = 1800;
          const animateLine = () => {
            dashOffset -= 6;
            if (dashOffset <= 0) dashOffset = 1800;
            path.setAttribute('stroke-dashoffset', dashOffset.toString());
            requestAnimationFrame(animateLine);
          };
          requestAnimationFrame(animateLine);

          let currentIndex = Math.floor(Math.random() * POSITIONS.length);
          let pos = POSITIONS[currentIndex];
          svg.style.top = pos.top + '%';
          svg.style.transform = 'rotate(' + pos.rotate + 'deg)';

          const changePosition = () => {
            let newIndex = currentIndex;
            while (newIndex === currentIndex && POSITIONS.length > 1) {
              newIndex = Math.floor(Math.random() * POSITIONS.length);
            }
            currentIndex = newIndex;
            const newPos = POSITIONS[newIndex];
            svg.style.top = newPos.top + '%';
            svg.style.transform = 'rotate(' + newPos.rotate + 'deg)';
          };

          setTimeout(() => {
            changePosition();
            setInterval(changePosition, 3500);
          }, initialDelay);
        };

        buildLine('line-a', 0);
        buildLine('line-b', 1200);
      }
    `,
  },
}