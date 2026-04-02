/** Shared Framer Motion constants — single source of truth for all landing animations. */

import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Hook that respects prefers-reduced-motion for Framer Motion components.
 * Returns `reduced` boolean and helper to conditionally skip initial animation state.
 */
export function useMotionSafe() {
  const reduced = useReducedMotion()
  return {
    reduced: reduced ?? false,
    /** Pass as `initial` prop — returns `false` (no animation) when reduced motion is preferred. */
    initial: (props: Record<string, unknown>) => (reduced ? false : props),
  }
}

/** Expo-out easing used across all landing animations. Matches CSS --ease-out. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Standard durations matching CSS --duration-* tokens. */
export const DURATION = {
  fast: 0.18,
  normal: 0.24,
  slow: 0.3,
  enter: 0.32,
} as const

/** Reusable fade-up variant set for section entrances. */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration: 0.6, delay, ease: EASE_OUT },
})

/** Stagger container variant for section intros. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
} as const

/** Stagger child variant. Pair with staggerContainer. */
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
} as const

/** Subtle scroll parallax for section headings. Heading moves 20px slower than content. */
export function useHeadingParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -20])
  return { ref, style: reduced ? undefined : { y } }
}
