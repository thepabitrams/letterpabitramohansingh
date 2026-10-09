export default {
  id: 'slide',
  name: 'Slide Up',
  variants: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
}