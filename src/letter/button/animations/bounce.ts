export default {
  id: 'bounce',
  name: 'Bounce',
  category: 'motion' as const,
  variants: {
    y: [0, -8, 0],
    transition: { repeat: Infinity, duration: 0.8 },
  },
}