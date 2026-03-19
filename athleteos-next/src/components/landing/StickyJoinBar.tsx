'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function StickyJoinBar() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex max-w-[calc(100vw-1rem)] items-center gap-2 rounded-2xl px-3 py-3 sm:gap-3 sm:px-4 sm:py-2.5"
          style={{
            background: 'rgba(7,13,20,0.94)',
            border: '1px solid rgba(127,178,255,0.24)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 20px rgba(127,178,255,0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Pulse dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: '#7FB2FF',
              boxShadow: '0 0 0 4px rgba(127,178,255,0.15)',
              animation: 'orbitPulse 2s ease-in-out infinite',
            }}
          />

          {/* Copy */}
          <span className="min-w-0 text-xs sm:text-sm text-foreground/80 font-medium leading-snug">
            Founding cohort · <span className="text-foreground font-bold">₹4,999/yr</span> · <span className="sm:hidden">locked</span><span className="hidden sm:inline">price locked forever</span>
          </span>

          {/* CTA */}
          <a
            href="#waitlist"
            className="flex-shrink-0 bg-accent text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl hover:bg-accent-light transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">Lock price</span>
            <span className="hidden sm:inline">Lock my price →</span>
          </a>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
