/* src/letter/background/animations/clouds.tsx */
import { motion } from 'motion/react'

const CLOUD_CONFIGS = [
  { top: '8%', scale: 1, duration: 45, delay: 0, opacity: 0.9 },
  { top: '22%', scale: 1.3, duration: 55, delay: 8, opacity: 0.7 },
  { top: '40%', scale: 0.8, duration: 38, delay: 16, opacity: 0.85 },
  { top: '55%', scale: 1.1, duration: 48, delay: 24, opacity: 0.75 },
  { top: '72%', scale: 0.9, duration: 42, delay: 4, opacity: 0.8 },
  { top: '86%', scale: 0.7, duration: 35, delay: 12, opacity: 0.65 },
]

const CloudShape = ({ scale = 1, opacity = 1 }: { scale?: number; opacity?: number }) => (
  <div
    style={{
      position: 'relative',
      width: 200 * scale,
      height: 80 * scale,
      opacity,
    }}
  >
    <div
      style={{
        position: 'absolute',
        width: 100 * scale,
        height: 100 * scale,
        borderRadius: '50%',
        background: 'white',
        left: 0,
        top: 0,
        filter: 'blur(2px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 130 * scale,
        height: 130 * scale,
        borderRadius: '50%',
        background: 'white',
        left: 40 * scale,
        top: -25 * scale,
        filter: 'blur(2px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 90 * scale,
        height: 90 * scale,
        borderRadius: '50%',
        background: 'white',
        right: 0,
        top: 5 * scale,
        filter: 'blur(2px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: 60 * scale,
        bottom: 0,
        background: 'white',
        borderRadius: 40 * scale,
        filter: 'blur(2px)',
      }}
    />
  </div>
)

const CloudLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {CLOUD_CONFIGS.map((cloud, index) => (
      <motion.div
        key={index}
        initial={{ left: '-30%' }}
        animate={{ left: '130%' }}
        transition={{
          duration: cloud.duration,
          repeat: Infinity,
          delay: -cloud.delay,
          ease: 'linear',
        }}
        className="absolute"
        style={{ top: cloud.top }}
      >
        <CloudShape scale={cloud.scale} opacity={cloud.opacity} />
      </motion.div>
    ))}
  </div>
)

export default {
  id: 'clouds',
  name: 'Clouds',
  category: 'motion' as const,
  variants: {},
  component: CloudLayer,

  standalone: {
    script: `
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        const CLOUDS = [
          { top: '8%', scale: 1, duration: 45, delay: 0, opacity: 0.9 },
          { top: '22%', scale: 1.3, duration: 55, delay: 8, opacity: 0.7 },
          { top: '40%', scale: 0.8, duration: 38, delay: 16, opacity: 0.85 },
          { top: '55%', scale: 1.1, duration: 48, delay: 24, opacity: 0.75 },
          { top: '72%', scale: 0.9, duration: 42, delay: 4, opacity: 0.8 },
          { top: '86%', scale: 0.7, duration: 35, delay: 12, opacity: 0.65 },
        ];

        const layer = document.createElement('div');
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
        backgroundElement.insertBefore(layer, backgroundElement.firstChild);

        const buildCloud = (scale, opacity) => {
          const cloud = document.createElement('div');
          cloud.style.position = 'relative';
          cloud.style.width = (200 * scale) + 'px';
          cloud.style.height = (80 * scale) + 'px';
          cloud.style.opacity = opacity;

          const parts = [
            { w: 100, h: 100, left: 0, top: 0 },
            { w: 130, h: 130, left: 40, top: -25 },
            { w: 90, h: 90, right: 0, top: 5 },
          ];

          parts.forEach((p) => {
            const circle = document.createElement('div');
            circle.style.position = 'absolute';
            circle.style.width = (p.w * scale) + 'px';
            circle.style.height = (p.h * scale) + 'px';
            circle.style.borderRadius = '50%';
            circle.style.background = 'white';
            circle.style.filter = 'blur(2px)';
            if (p.left !== undefined) circle.style.left = (p.left * scale) + 'px';
            if (p.right !== undefined) circle.style.right = (p.right * scale) + 'px';
            if (p.top !== undefined) circle.style.top = (p.top * scale) + 'px';
            cloud.appendChild(circle);
          });

          const base = document.createElement('div');
          base.style.position = 'absolute';
          base.style.width = '100%';
          base.style.height = (60 * scale) + 'px';
          base.style.bottom = '0';
          base.style.background = 'white';
          base.style.borderRadius = (40 * scale) + 'px';
          base.style.filter = 'blur(2px)';
          cloud.appendChild(base);

          return cloud;
        };

        CLOUDS.forEach((cloud) => {
          const cloudElement = buildCloud(cloud.scale, cloud.opacity);
          const wrapper = document.createElement('div');
          wrapper.style.position = 'absolute';
          wrapper.style.top = cloud.top;
          wrapper.style.left = '-30%';
          wrapper.style.willChange = 'left';
          wrapper.appendChild(cloudElement);
          layer.appendChild(wrapper);

          wrapper.animate(
            [
              { left: '-30%' },
              { left: '130%' },
            ],
            { duration: cloud.duration * 1000, delay: -cloud.delay * 1000, iterations: Infinity, easing: 'linear' }
          );
        });
      }
    `,
  },
}