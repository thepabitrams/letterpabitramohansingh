const variantModules = import.meta.glob('./variants/*.ts', { eager: true })
const animModules = import.meta.glob('./animations/*.ts', { eager: true })

export const MESSAGE_BOX_VARIANTS = Object.entries(variantModules).map(([path, mod]) => ({
  id: path.replace('./variants/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export const MESSAGE_BOX_ANIMATIONS = Object.entries(animModules).map(([path, mod]) => ({
  id: path.replace('./animations/', '').replace('.ts', ''),
  config: (mod as any).default,
}))

export function getMessageBoxVariant(id: string) {
  return MESSAGE_BOX_VARIANTS.find((v) => v.id === id)?.config
}

export function getMessageBoxAnimation(id: string) {
  return MESSAGE_BOX_ANIMATIONS.find((a) => a.id === id)?.config
}

export { default as MessageBox } from './MessageBox'