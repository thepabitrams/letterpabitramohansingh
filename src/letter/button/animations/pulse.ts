/* src/letter/button/animations/pulse.ts */
export default {
  id: 'pulse',
  name: 'Pulse',
  category: 'motion' as const,
  variants: {
    scale: [1, 1.08, 1],
  },
  transition: { repeat: Infinity, duration: 1.4 },
}