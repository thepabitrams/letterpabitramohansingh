/* src/presets/index.ts */
import LovePreset from './love'
import ApologyPreset from './apology'
import type { PresetId, PresetProps } from './types'

export type { PresetId, PresetProps }

export const PRESETS: Record<PresetId, React.ComponentType<PresetProps>> = {
  love: LovePreset,
  apology: ApologyPreset,
}

export const PRESET_LIST = [
  { id: 'love' as const, name: 'Love Letter', emoji: '💕' },
  { id: 'apology' as const, name: 'Apology', emoji: '🙏' },
]