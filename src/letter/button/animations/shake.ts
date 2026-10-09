export default {
  id: 'shake',
  name: 'Shake',
  category: 'motion' as const,
  variants: {
    x: [0, -4, 4, -4, 0],
  },
  transition: { repeat: Infinity, duration: 0.5 },
}