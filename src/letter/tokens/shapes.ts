/* src/ui/tokens/shapes.ts */
export const SHAPES = {
  pill: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-none',
} as const

export type ShapeKey = keyof typeof SHAPES