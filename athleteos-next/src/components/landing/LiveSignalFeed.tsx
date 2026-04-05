'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  '[ SIGNAL: ARJUN M. ] SQUAT STALL DETECTED → RECOVERY LAG IDENTIFIED',
  '[ SIGNAL: SARAH K. ] BENCH PLATEAU → NUTRITION TIMING CORRECTED (+5KG)',
  '[ SIGNAL: DAVID L. ] VOLUME OVERLAP → CNS FATIGUE TREND FLAGGED',
  '[ SIGNAL: PRIYA R. ] METABOLIC DEBT → CALORIC SURPLUS PRESCRIBED (+400KCAL)',
  '[ SIGNAL: MARCUS T. ] RECOVERY GAP → SLEEP DEPRAVATION CORRELATION FOUND',
]

export function LiveSignalFeed() {
  return (
    <div className="absolute top-8 left-0 w-full overflow-hidden pointer-events-none z-20 select-none">
      <motion.div
        className="flex whitespace-nowrap gap-12"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...SIGNALS, ...SIGNALS].map((signal, i) => (
          <span
            key={i}
            className="text-[9px] font-mono tracking-tighter text-success opacity-30 uppercase"
          >
            {signal}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
