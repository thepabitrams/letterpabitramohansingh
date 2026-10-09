export default {
  id: 'glow',
  name: 'Glow',
  category: 'motion' as const,
  variants: {
    boxShadow: [
      '0 0 0px rgba(255,255,255,0)',
      '0 0 25px rgba(255,255,255,0.9)',
      '0 0 0px rgba(255,255,255,0)',
    ],
  },
  transition: { repeat: Infinity, duration: 1.5 },
}