/* src/letter/background/animations/parallax.ts */
export default {
  id: 'parallax',
  name: 'Parallax',
  category: 'motion' as const,
  variants: {
    backgroundPosition: ['0% 0%', '100% 100%'],
  },
  transition: { repeat: Infinity, duration: 20, repeatType: 'reverse' },

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const backgroundElement = document.querySelector('[data-background]');
      if (backgroundElement) {
        backgroundElement.style.backgroundSize = '200% 200%';
        animate(
          backgroundElement,
          { backgroundPosition: ['0% 0%', '100% 100%'] },
          { repeat: Infinity, duration: 20, repeatType: 'reverse' }
        );
      }
    `,
  },
}