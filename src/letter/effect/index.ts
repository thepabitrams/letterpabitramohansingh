const variantModules = import.meta.glob('./variants/*.tsx', { eager: true })
const animModules = import.meta.glob('./animations/*.ts', { eager: true })

export const EFFECT_VARIANTS = Object.entries(variantModules).map(([path, mod]) => ({
  id: path.replace('./variants/', '').replace('.tsx', ''),
  config: (mod as any).default,
}))

export const EFFECT_ANIMATIONS = Object.entries(animModules).map(([path, mod]) => ({
  id: path.replace('./animations/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export function getEffectVariant(id: string) {
  return EFFECT_VARIANTS.find((v) => v.id === id)?.config
}

export function getEffectAnimation(id: string) {
  return EFFECT_ANIMATIONS.find((a) => a.id === id)?.config
}

export { default as Effect } from './Effect'