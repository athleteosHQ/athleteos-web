'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { useMotionSafe } from '@/lib/motion'

// ── Magnetic button ────────────────────────────────────────────────────────
function MagneticButton({ onClick, children, className, style }: {
  onClick: () => void
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.18)
    y.set((e.clientY - cy) * 0.18)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, ...style }}
      className={className}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  )
}

const STATS = [
  { value: '3200', display: '3,200+', label: 'athletes benchmarked' },
  { value: '94',   display: '94%',    label: 'find their limiter' },
  { value: '60',   display: '< 60s',  label: 'to your rank' },
] as const

export function HeroSection() {
  const { reduced } = useMotionSafe()
  const heroRef = useRef<HTMLElement>(null)
  const inView = useInView(heroRef, { once: true })

  const handleCTA = () => {
    trackEvent('cta_clicked', { cta_source: 'hero', cta_text: 'Check Your Rank Free', has_rank_result: false })
    document.getElementById('rank')?.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      document.getElementById('rank-bw-input')?.focus()
    }, 500)
  }

  const EASE_CUBIC = [0.16, 1, 0.3, 1] as [number, number, number, number]
  const line1 = { hidden: { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }, visible: { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.7, ease: EASE_CUBIC } } }
  const line2 = { hidden: { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }, visible: { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.7, delay: 0.1, ease: EASE_CUBIC } } }
  const line3 = { hidden: { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }, visible: { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.7, delay: 0.18, ease: EASE_CUBIC } } }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[95vh] flex-col items-center justify-center px-6 py-24 text-center overflow-hidden"
    >
      {/* ── Animated gradient mesh ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Aurora mesh — slow moving */}
        {!reduced && (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse 75% 55% at 50% -8%, rgba(255,107,53,0.14) 0%, rgba(255,0,128,0.07) 45%, transparent 70%)',
                'radial-gradient(ellipse 80% 60% at 48% -6%, rgba(255,0,128,0.12) 0%, rgba(123,47,255,0.06) 45%, transparent 70%)',
                'radial-gradient(ellipse 70% 50% at 52% -10%, rgba(255,107,53,0.16) 0%, rgba(255,0,128,0.08) 40%, transparent 68%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />
        )}
        {!reduced && (
          <div
            className="absolute"
            style={{
              top: '-15%', left: '50%', transform: 'translateX(-50%)',
              width: '900px', height: '500px',
              background: 'radial-gradient(ellipse, rgba(255,107,53,0.16) 0%, rgba(255,0,128,0.08) 40%, transparent 70%)',
              filter: 'blur(1px)',
            }}
          />
        )}
        {/* Right violet */}
        <div className="absolute" style={{ top: '10%', right: '-5%', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(123,47,255,0.08) 0%, transparent 65%)' }} />
        {/* Left cyan */}
        <div className="absolute" style={{ bottom: '15%', left: '-5%', width: 400, height: 300, background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 65%)' }} />

        {/* Orbit rings */}
        {!reduced && (
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{ transform: 'translate(-50%, -50%)', width: 800, height: 800, pointerEvents: 'none' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none">
              <circle cx="400" cy="400" r="360" stroke="url(#og1)" strokeWidth="1" strokeDasharray="4 20" opacity="0.3" />
              <circle cx="400" cy="400" r="290" stroke="url(#og2)" strokeWidth="0.8" strokeDasharray="2 28" opacity="0.2" />
              <defs>
                <linearGradient id="og1" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FF0080" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7B2FFF" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="og2" x1="800" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7B2FFF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </div>

      <motion.div
        className="relative z-10 max-w-4xl w-full"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* ── Eyebrow ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE_CUBIC }}
          className="mb-7"
        >
          <div className="eyebrow inline-flex">
            <motion.span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF0080)', boxShadow: '0 0 8px rgba(255,107,53,0.9)' }}
              animate={{ boxShadow: ['0 0 8px rgba(255,107,53,0.6)', '0 0 16px rgba(255,107,53,1)', '0 0 8px rgba(255,107,53,0.6)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            Performance Diagnosis System · India
          </div>
        </motion.div>

        {/* ── Headline — per-line clip-path reveal ── */}
        <div
          className="overflow-hidden text-[clamp(3rem,9vw,6.5rem)] leading-[0.93] tracking-tight"
          style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif", fontWeight: 800 }}
        >
          <motion.div variants={line1} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <span style={{ color: 'rgba(237,237,239,0.95)' }}>One Variable</span>
          </motion.div>
          <motion.div variants={line2} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <span
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF0080 50%, #7B2FFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(255,107,53,0.25))',
              }}
            >
              Is Holding
            </span>
          </motion.div>
          <motion.div variants={line3} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <span style={{ color: 'rgba(237,237,239,0.85)' }}>You Back.</span>
          </motion.div>
        </div>

        {/* ── Sub-headline ── */}
        <motion.p
          className="mt-7 text-lg leading-relaxed sm:text-xl max-w-2xl mx-auto"
          style={{ color: 'rgba(107,114,128,1)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.3, ease: EASE_CUBIC }}
        >
          AthleteOS reads your training, nutrition, and recovery as{' '}
          <span style={{ color: 'rgba(237,237,239,0.9)', fontWeight: 500 }}>one system</span>
          {' '}— then surfaces the{' '}
          <span style={{ color: 'rgba(237,237,239,0.9)', fontWeight: 500 }}>exact bottleneck</span>{' '}
          holding your performance back. Free rank check in 60 seconds.
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.42, ease: EASE_CUBIC }}
        >
          <MagneticButton
            onClick={handleCTA}
            className="group relative inline-flex cursor-pointer items-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-white overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF0080 100%)',
              boxShadow: '0 4px 24px rgba(255,107,53,0.35), 0 2px 8px rgba(255,0,128,0.25), 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.14)',
            }}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)',
              }}
              transition={{ duration: 0.4 }}
            />
            <span className="relative z-10 flex items-center gap-2.5">
              Check Your Rank Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </MagneticButton>

          <a
            href="#inline-signup-gate"
            className="group inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
            style={{ color: 'rgba(107,114,128,0.9)' }}
            onClick={() => trackEvent('cta_clicked', { cta_source: 'hero_secondary', cta_text: 'Join Waitlist', has_rank_result: false })}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(237,237,239,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(107,114,128,0.9)')}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#2DDC8F' }}
              animate={{ boxShadow: ['0 0 4px rgba(45,220,143,0.6)', '0 0 10px rgba(45,220,143,1)', '0 0 4px rgba(45,220,143,0.6)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            2,400+ athletes already on waitlist
          </a>
        </motion.div>

        {/* ── Stats strip with animated counters ── */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.55, ease: EASE_CUBIC }}
        >
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} inView={inView} reduced={reduced} />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      {!reduced && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(107,114,128,0.7)' }}>scroll</span>
          <motion.div
            className="w-px h-8 origin-top"
            style={{ background: 'linear-gradient(to bottom, rgba(255,107,53,0.6), transparent)' }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          />
        </motion.div>
      )}
    </section>
  )
}

// ── Stat item with animated counter ───────────────────────────────────────
function StatItem({
  stat,
  index,
  inView,
  reduced,
}: {
  stat: { value: string; display: string; label: string }
  index: number
  inView: boolean
  reduced: boolean
}) {
  const numVal = parseInt(stat.value, 10)
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 50, damping: 18 })
  const [started, setStarted] = useState(false)

  // Both transforms defined unconditionally — hooks must not be conditional
  const displayCount = useTransform(spring, v =>
    index === 0 ? `${Math.round(v).toLocaleString()}+`
    : index === 1 ? `${Math.round(v)}%`
    : stat.display
  )

  if (inView && !started) {
    setStarted(true)
    setTimeout(() => motionVal.set(numVal), 200)
  }

  const isGradient = index === 0
  const gradStyle = {
    background: 'linear-gradient(135deg, #FF6B35, #FF0080)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-2xl font-bold tabular-nums" style={{ fontFamily: "'Syne', sans-serif" }}>
        {reduced ? (
          <span style={isGradient ? gradStyle : { color: 'var(--foreground)' }}>
            {stat.display}
          </span>
        ) : index < 2 ? (
          <motion.span style={isGradient ? gradStyle : { color: 'var(--foreground)' }}>
            {displayCount}
          </motion.span>
        ) : (
          <span style={{ color: 'var(--foreground)' }}>{stat.display}</span>
        )}
      </span>
      <span className="text-xs uppercase" style={{ letterSpacing: '0.14em', color: 'rgba(107,114,128,0.8)' }}>
        {stat.label}
      </span>
    </div>
  )
}
