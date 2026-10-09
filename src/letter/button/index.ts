const variantModules = import.meta.glob('./variants/*.ts', { eager: true })
const animModules = import.meta.glob('./animations/*.ts', { eager: true })

export const BUTTON_VARIANTS = Object.entries(variantModules).map(([path, mod]) => ({
  id: path.replace('./variants/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export const BUTTON_ANIMATIONS = Object.entries(animModules).map(([path, mod]) => ({
  id: path.replace('./animations/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export const BUTTON_MOTION_ANIMATIONS = BUTTON_ANIMATIONS.filter(
  (a) => a.config?.category === 'motion'
)
export const BUTTON_TRIGGER_ANIMATIONS = BUTTON_ANIMATIONS.filter(
  (a) => a.config?.category === 'trigger'
)

export function getButtonVariant(id: string) {
  return BUTTON_VARIANTS.find((v) => v.id === id)?.config
}

export function getButtonAnimation(id: string) {
  return BUTTON_ANIMATIONS.find((a) => a.id === id)?.config
}

export { default as Button } from './Button'