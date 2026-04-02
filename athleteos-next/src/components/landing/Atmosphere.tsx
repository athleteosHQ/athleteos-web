'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export function Atmosphere() {
  const { scrollYProgress } = useScroll()
  
  // Background color shift: Moving from Deep Obsidian to Cold Slate/Warm Charcoal
  // Subtle enough to feel like a change in "air temperature" rather than a color swap.
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [
      '#09090B', // Hero: Deep Obsidian
      '#0B0D10', // Problem: Cold Slate hint
      '#0D0B0B', // System: Warm Charcoal hint
      '#09090B'  // Footer: Back to Obsidian
    ]
  )

  // Subdued luminosity pulse based on scroll progress
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const smoothBrightness = useSpring(brightness, { stiffness: 50, damping: 20 })

  // Slow, breath-like parallax for ambient blobs
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -150])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* ── Base Layer: Deep Neutral Shifting ── */}
      <motion.div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ 
          backgroundColor: bgColor,
          filter: `brightness(${smoothBrightness})`
        }}
      />

      {/* ── Submerged Ambient Blobs ── */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute top-[-20%] left-[-20%] w-[80%] aspect-square rounded-full opacity-[0.02] blur-[160px] bg-[#2DDC8F]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.015, 0.03, 0.015]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        style={{ y: blob2Y }}
        className="absolute bottom-[-30%] right-[-20%] w-[80%] aspect-square rounded-full opacity-[0.015] blur-[180px] bg-white"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Submerged Grid (Anchored & Minimal) ── */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ 
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)'
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>

      {/* ── Atmospheric Noise Overlay ── */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  )
}

