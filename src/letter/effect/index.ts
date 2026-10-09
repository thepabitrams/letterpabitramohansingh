const variantModules = import.meta.glob('./variants/*.tsx', { eager: true })
const animationModules = import.meta.glob('./animations/*.ts', { eager: true })

export const EFFECT_VARIANTS = Object.entries(variantModules).map(([modulePath, module]) => ({
  id: modulePath.replace('./variants/', '').replace('.tsx', ''),
  config: (module as any).default,
}))

export const EFFECT_ANIMATIONS = Object.entries(animationModules).map(([modulePath, module]) => ({
  id: modulePath.replace('./animations/', '').replace('.ts', ''),
  config: (module as any).default,
}))

export function getEffectVariant(variantId: string) {
  return EFFECT_VARIANTS.find((variantEntry) => variantEntry.id === variantId)?.config
}

export function getEffectAnimation(animationId: string) {
  return EFFECT_ANIMATIONS.find((animationEntry) => animationEntry.id === animationId)?.config
}

export { default as Effect } from './Effect'