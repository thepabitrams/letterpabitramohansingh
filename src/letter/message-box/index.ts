const variantModules = import.meta.glob('./variants/*.ts', { eager: true })
const animationModules = import.meta.glob('./animations/*.ts', { eager: true })

export const MESSAGE_BOX_VARIANTS = Object.entries(variantModules).map(([modulePath, module]) => ({
  id: modulePath.replace('./variants/', '').replace('.ts', ''),
  config: (module as any).default,
}))

export const MESSAGE_BOX_ANIMATIONS = Object.entries(animationModules).map(([modulePath, module]) => ({
  id: modulePath.replace('./animations/', '').replace('.ts', ''),
  config: (module as any).default,
}))

export function getMessageBoxVariant(variantId: string) {
  return MESSAGE_BOX_VARIANTS.find((variantEntry) => variantEntry.id === variantId)?.config
}

export function getMessageBoxAnimation(animationId: string) {
  return MESSAGE_BOX_ANIMATIONS.find((animationEntry) => animationEntry.id === animationId)?.config
}

export { default as MessageBox } from './MessageBox'