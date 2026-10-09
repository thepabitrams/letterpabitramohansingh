/* src/letter/patterns/index.ts */
import TwoChoice, { type TwoChoiceConfig } from './TwoChoice'
import OneChoice, { type OneChoiceConfig } from './OneChoice'
import NoteOnly, { type NoteOnlyConfig } from './NoteOnly'

export type PatternId = 'two-choice' | 'one-choice' | 'note-only'
export type PatternConfig = TwoChoiceConfig | OneChoiceConfig | NoteOnlyConfig

export const PATTERNS = {
  'two-choice': TwoChoice,
  'one-choice': OneChoice,
  'note-only': NoteOnly,
} as const

export const PATTERN_LIST = [
  { id: 'two-choice' as const, name: 'Two Choices', description: 'Yes / No + optional note' },
  { id: 'one-choice' as const, name: 'One Choice', description: 'Single button + optional note' },
  { id: 'note-only' as const, name: 'Note Only', description: 'Just write a reply' },
]

export type { TwoChoiceConfig, OneChoiceConfig, NoteOnlyConfig }