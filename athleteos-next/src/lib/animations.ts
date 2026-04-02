/**
 * Animation utilities for exp_1 premium redesign
 * Uses Framer Motion (already in deps)
 */

// Framer Motion ease presets
export const SPRING_GENTLE = { type: 'spring', stiffness: 80, damping: 20 } as const
export const SPRING_SNAPPY = { type: 'spring', stiffness: 260, damping: 20 } as const
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const
export const EASE_DECEL = [0, 0, 0.2, 1] as const

// Fade up with stagger
export function fadeUpVariants(delay = 0) {
  return {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, delay, ease: EASE_PREMIUM },
    },
  }
}

// Clip-path wipe from bottom
export function clipRevealVariants(delay = 0) {
  return {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: { duration: 0.7, delay, ease: EASE_PREMIUM },
    },
  }
}

// Scale + fade for cards
export function scaleInVariants(delay = 0) {
  return {
    hidden: { opacity: 0, scale: 0.93 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.55, delay, ease: EASE_PREMIUM },
    },
  }
}

// Stagger container
export function staggerContainer(staggerChildren = 0.08, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  }
}

// Slide in from left
export function slideInLeftVariants(delay = 0) {
  return {
    hidden: { opacity: 0, x: -32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay, ease: EASE_PREMIUM },
    },
  }
}

// Rank badge entrance: scale from 0 → 1.06 → 1 (bounce)
export const rankBadgeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: [0, 1.08, 0.97, 1],
    transition: { duration: 0.7, ease: EASE_PREMIUM, times: [0, 0.5, 0.75, 1] },
  },
}
