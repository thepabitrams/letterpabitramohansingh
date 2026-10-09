/* src/letter/text/animations/typewriter.ts */
export default {
  id: 'typewriter',
  name: 'Typewriter',
  variants: {},
  typewriter: true,

  standalone: {
    script: `
      const textElement = document.getElementById('message');
      const cursorElement = document.querySelector('.cursor-blink');
      if (textElement) {
        const fullText = textElement.getAttribute('data-full-text') || '';
        textElement.textContent = '';
        let characterIndex = 0;
        const typewriterTimer = setInterval(() => {
          characterIndex++;
          textElement.textContent = fullText.slice(0, characterIndex);
          if (characterIndex >= fullText.length) {
            clearInterval(typewriterTimer);
            if (cursorElement) cursorElement.style.display = 'none';
          }
        }, 40);
      }
    `,
  },
}