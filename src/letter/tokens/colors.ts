/* src/ui/tokens/colors.ts */
export const COLORS = {
  green: 'bg-green-500 hover:bg-green-600',
  red: 'bg-red-500 hover:bg-red-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  pink: 'bg-pink-500 hover:bg-pink-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  gray: 'bg-gray-500 hover:bg-gray-600',
} as const

export type ColorKey = keyof typeof COLORS