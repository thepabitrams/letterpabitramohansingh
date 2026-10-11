// src/letter/background/Background.tsx 
import { useEffect, useRef } from 'react'
import { animate } from 'motion/react'
import { getBackgroundAnimation, getBackgroundVariant } from './index'

interface BackgroundProps {
  variant?: string
  animation?: string
  children: React.ReactNode
}

export default function Background({
  variant = 'blue',
  animation = '',
  children,
}: BackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const variantConfig = getBackgroundVariant(variant)
  const animationConfig = animation ? getBackgroundAnimation(animation) : undefined
  const isDark = variantConfig?.isDark ?? false

  const AnimationComponent = animationConfig?.component

  useEffect(() => {
    if (AnimationComponent) return
    if (!animationConfig) return

    const element = backgroundRef.current
    if (!element) return

    const animationKeyframes = animationConfig.variants
    const animationTransition = animationConfig.transition

    if (!animationKeyframes || Object.keys(animationKeyframes).length === 0) {
      return
    }

    if (animation === 'parallax') {
      element.style.backgroundSize = '200% 200%'
    }

    const controls = animate(
      element,
      animationKeyframes as Parameters<typeof animate>[1],
      animationTransition as Parameters<typeof animate>[2]
    )

    return () => {
      controls.stop()
      element.style.backgroundSize = ''
      element.style.backgroundPosition = ''
    }
  }, [animation, animationConfig, AnimationComponent])

  return (
    <div
      ref={backgroundRef}
      className={`relative w-full min-h-screen ${variantConfig?.className ?? ''} flex items-center justify-center p-6 overflow-hidden`}
      data-background
      data-animation={animation}
      data-dark={isDark}
    >
      {AnimationComponent && <AnimationComponent />}
      {children}
    </div>
  )
}