'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useMotionSafe } from '@/lib/motion'

interface AnimatedCounterProps {
  value: number
  className?: string
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const { reduced } = useMotionSafe()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, v => Math.round(v))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    const unsubscribe = display.on('change', v => {
      if (ref.current) {
        ref.current.textContent = String(v)
      }
    })
    return unsubscribe
  }, [display])

  return <span ref={ref} className={className}>{reduced ? value : 0}</span>
}
