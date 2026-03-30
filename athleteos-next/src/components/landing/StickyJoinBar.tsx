'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { hasFounderData } from './landingFlow'
import { useMotionSafe } from '@/lib/motion'

export function StickyJoinBar() {
  const { reduced } = useMotionSafe()
  const [visible, setVisible] = useState(false)
  const [alreadyJoined] = useState(() =>
    typeof window !== 'undefined' && hasFounderData(localStorage.getItem('aos_founder_data')),
  )

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerWidth < 768 ? 160 : 560
      setVisible(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (alreadyJoined) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? false : { y: 72 }}
          animate={{ y: 0 }}
          exit={reduced ? undefined : { y: 72 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8"
          style={{
            background: 'rgba(12,12,14,0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="hidden text-sm text-muted-foreground sm:block">Join to connect training, nutrition, and recovery</p>
            <a
              href="#inline-signup-gate"
              className="ml-auto cursor-pointer rounded-md bg-accent px-4 py-2.5 min-h-[44px] text-sm font-bold text-white transition-all hover:bg-accent-light"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              <span className="sm:hidden">Full system read</span>
              <span className="hidden sm:inline">Get Full System Read →</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
