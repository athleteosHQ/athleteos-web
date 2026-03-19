'use client'

import { motion } from 'framer-motion'
import { TrendingDown } from 'lucide-react'

const STATS = [
  {
    kicker: 'INPUT',
    label: 'Training',
    sub: 'Strength · endurance · metcon',
    stat: '60+',
    statNote: 'exercises tracked',
    accent: false,
    statColor: undefined as string | undefined,
  },
  {
    kicker: 'INPUT',
    label: 'Nutrition',
    sub: 'IFCT-verified Indian food data',
    stat: null,
    statNote: 'MFP protein undercount',
    accent: false,
    statColor: 'text-destructive',
  },
  {
    kicker: 'OUTPUT',
    label: 'Diagnosis',
    sub: 'One answer. No guessing.',
    stat: '1',
    statNote: 'bottleneck named',
    accent: true,
    statColor: undefined,
  },
]

export function PillarStrip() {
  return (
    <div className="px-4 pb-10 sm:px-6 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          className="grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {STATS.map(({ kicker, label, sub, stat, statNote, accent, statColor }) => (
            <div
              key={label}
              className="rounded-2xl px-4 py-5 text-left sm:px-5"
              style={{
                border: accent ? '1px solid rgba(255,122,47,0.18)' : '1px solid rgba(255,255,255,0.08)',
                background: accent ? 'rgba(255,122,47,0.05)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <p className={`font-mono-label mb-1 ${accent ? 'text-accent/70' : 'text-muted-foreground/40'}`} style={{ fontSize: '9px' }}>
                {kicker}
              </p>
              <p className={`mb-0.5 text-sm font-bold ${accent ? 'text-foreground' : 'text-foreground/80'}`}>
                {label}
              </p>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground/60">{sub}</p>

              <div className="flex items-end justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                {stat !== null ? (
                  <p className={`font-mono text-2xl font-bold mb-0.5 ${statColor ?? (accent ? 'text-accent' : 'text-foreground')}`}>
                    {stat}
                  </p>
                ) : (
                  <p className={`mb-0.5 flex items-center gap-1 font-mono text-2xl font-bold ${statColor ?? 'text-foreground'}`}>
                    <TrendingDown size={18} className="text-destructive" />
                    <span>23%</span>
                  </p>
                )}
                <p className="max-w-[9rem] text-right font-mono-label text-muted-foreground/40">{statNote}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
