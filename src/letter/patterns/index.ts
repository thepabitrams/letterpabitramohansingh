import TwoChoice, { type TwoChoiceConfig } from './TwoChoice'
import OneChoice, { type OneChoiceConfig } from './OneChoice'

export type PatternId = 'two-choice' | 'one-choice'

export type PatternConfig = TwoChoiceConfig | OneChoiceConfig

export const PATTERNS = {
  'two-choice': TwoChoice,
  'one-choice': OneChoice,
} as const

export const PATTERN_LIST = [
  { id: 'two-choice' as const, name: 'Two Choices', description: 'Yes / No, Accept / Decline' },
  { id: 'one-choice' as const, name: 'One Choice', description: 'Single button — Accept, Thanks, Acknowledge' },
]

export type { TwoChoiceConfig, OneChoiceConfig }