const variantModules = import.meta.glob('./variants/*.ts', { eager: true })
const animationModules = import.meta.glob('./animations/*.ts', { eager: true })

export const TEXT_VARIANTS = Object.entries(variantModules).map(([modulePath, module]) => ({
  id: modulePath.replace('./variants/', '').replace('.ts', ''),
  config: (module as any).default,
}))

export const TEXT_ANIMATIONS = Object.entries(animationModules).map(([modulePath, module]) => ({
  id: modulePath.replace('./animations/', '').replace('.ts', ''),
  config: (module as any).default,
}))

export function getTextVariant(variantId: string) {
  return TEXT_VARIANTS.find((variantEntry) => variantEntry.id === variantId)?.config
}

export function getTextAnimation(animationId: string) {
  return TEXT_ANIMATIONS.find((animationEntry) => animationEntry.id === animationId)?.config
}

export { default as Text } from './Text'