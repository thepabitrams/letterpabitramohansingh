import { getEffectVariant } from './index'

type Props = {
  variant?: string
  animation?: string
}

export default function Effect({ variant = 'none' }: Props) {
  const config = getEffectVariant(variant)
  if (!config?.component) return null

  const Component = config.component
  return <Component />
}