export default {
  id: 'parallax',
  name: 'Parallax',
  category: 'motion' as const,
  variants: {
    backgroundPosition: ['0% 0%', '100% 100%'],
    transition: { repeat: Infinity, duration: 20, repeatType: 'reverse' },
  },
}