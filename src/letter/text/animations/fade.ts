/* src/letter/text/animations/fade.ts */
export default {
  id: 'fade',
  name: 'Fade In',
  variants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  },

  standalone: {
    script: `
      import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';
      const textElement = document.querySelector('[data-motion-text]');
      if (textElement) {
        animate(textElement, { opacity: [0, 1] }, { duration: 0.8 });
      }
    `,
  },
}