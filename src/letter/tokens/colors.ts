export const COLORS = {
  green: {
    bg: 'bg-green-500 hover:bg-green-600',
    border: 'border-green-500',
    text: 'text-green-600',
    hex: '#22c55e',
  },
  red: {
    bg: 'bg-red-500 hover:bg-red-600',
    border: 'border-red-500',
    text: 'text-red-600',
    hex: '#ef4444',
  },
  blue: {
    bg: 'bg-blue-500 hover:bg-blue-600',
    border: 'border-blue-500',
    text: 'text-blue-600',
    hex: '#3b82f6',
  },
  pink: {
    bg: 'bg-pink-500 hover:bg-pink-600',
    border: 'border-pink-500',
    text: 'text-pink-600',
    hex: '#ec4899',
  },
  purple: {
    bg: 'bg-purple-500 hover:bg-purple-600',
    border: 'border-purple-500',
    text: 'text-purple-600',
    hex: '#a855f7',
  },
  gray: {
    bg: 'bg-gray-500 hover:bg-gray-600',
    border: 'border-gray-500',
    text: 'text-gray-600',
    hex: '#6b7280',
  },
} as const

export type ColorKey = keyof typeof COLORS