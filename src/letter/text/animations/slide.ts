/* src/letter/text/animations/slide.ts */
export default {
  id: 'slide',
  name: 'Slide Up',
  variants: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const textElement = document.querySelector('[data-motion-text]');
      if (textElement) {
        animate(
          textElement,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.6 }
        );
      }
    `,
  },
}