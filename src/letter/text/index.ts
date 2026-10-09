const variantModules = import.meta.glob('./variants/*.ts', { eager: true })
const animModules = import.meta.glob('./animations/*.ts', { eager: true })

export const TEXT_VARIANTS = Object.entries(variantModules).map(([path, mod]) => ({
  id: path.replace('./variants/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export const TEXT_ANIMATIONS = Object.entries(animModules).map(([path, mod]) => ({
  id: path.replace('./animations/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export function getTextVariant(id: string) {
  return TEXT_VARIANTS.find((v) => v.id === id)?.config
}

export function getTextAnimation(id: string) {
  return TEXT_ANIMATIONS.find((a) => a.id === id)?.config
}

export { default as Text } from './Text'