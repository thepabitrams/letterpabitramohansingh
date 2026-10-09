/* src/ui/tokens/animations.ts */
export const ANIMATIONS = {
  none: {},
  pulse: { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 1.4 } },
  bounce: { y: [0, -8, 0], transition: { repeat: Infinity, duration: 0.8 } },
  shake: { x: [0, -4, 4, -4, 0], transition: { repeat: Infinity, duration: 0.5 } },
  glow: { boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.8)', '0 0 0px rgba(255,255,255,0)'], transition: { repeat: Infinity, duration: 2 } },
} as const

export type AnimationKey = keyof typeof ANIMATIONS