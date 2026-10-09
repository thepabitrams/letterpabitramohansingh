const variantModules = import.meta.glob('./variants/*.ts', { eager: true })
const animModules = import.meta.glob('./animations/*.{ts,tsx}', { eager: true })

export const BACKGROUND_VARIANTS = Object.entries(variantModules).map(([path, mod]) => ({
  id: path.replace('./variants/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export const BACKGROUND_ANIMATIONS = Object.entries(animModules).map(([path, mod]) => ({
  id: path.replace('./animations/', '').replace(/\.tsx?$/, ''),
  config: (mod as any).default,
}))

export function getBackgroundVariant(id: string) {
  return BACKGROUND_VARIANTS.find((v) => v.id === id)?.config
}

export function getBackgroundAnimation(id: string) {
  return BACKGROUND_ANIMATIONS.find((a) => a.id === id)?.config
}

export { default as Background } from './Background'