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

/** Reusable fade-up variant set for section entrances — includes subtle scale. */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20, scale: 0.98 } as const,
  whileInView: { opacity: 1, y: 0, scale: 1 } as const,
  viewport: { once: true, amount: 0.1 } as const,
  transition: { duration: 0.55, delay, ease: EASE_OUT },
})

/** Stagger container variant for section intros. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
} as const

/** Stagger child variant. Pair with staggerContainer. */
export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
} as const

// ── Dramatic transition variants ──────────────────────────────────────────

/** Heading clip-path wipe — text unmasks from left to right. */
export const clipReveal = (delay = 0) => ({
  initial: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  whileInView: { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
  viewport: { once: true, amount: 0.2 } as const,
  transition: { duration: 0.7, delay, ease: EASE_OUT },
})

/** Card entrance — blur clear + fade up + scale. */
export const blurUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.97, filter: 'blur(4px)' },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.1 } as const,
  transition: { duration: 0.6, delay, ease: EASE_OUT },
})

/** Slide from left — for split panels. */
export const slideFromLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration: 0.65, delay, ease: EASE_OUT },
})

/** Slide from right — for split panels. */
export const slideFromRight = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration: 0.65, delay, ease: EASE_OUT },
})

/** Scale-up pop — spring physics for pricing/highlight elements. */
export const scalePop = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92, filter: 'blur(3px)' },
  whileInView: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.2 } as const,
  transition: { type: 'spring' as const, stiffness: 200, damping: 20, delay },
})

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
