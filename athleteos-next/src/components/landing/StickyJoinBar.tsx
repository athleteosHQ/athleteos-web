'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { hasFounderData } from './landingFlow'

export function StickyJoinBar() {
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
          initial={{ y: 72 }}
          animate={{ y: 0 }}
          exit={{ y: 72 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8"
          style={{
            background: 'rgba(7,13,20,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="hidden text-sm text-muted-foreground sm:block">Lock founding member pricing</p>
            <a
              href="#inline-signup-gate"
              className="cta-glow ml-auto rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-light"
            >
              <span className="sm:hidden">Lock spot</span>
              <span className="hidden sm:inline">Lock my spot →</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
