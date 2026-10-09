export const SHAPES = {
  pill: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-none',
  soft: 'rounded-2xl',
} as const

export type ShapeKey = keyof typeof SHAPES