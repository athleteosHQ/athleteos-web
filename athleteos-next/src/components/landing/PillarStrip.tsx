'use client'

import { motion } from 'framer-motion'
import { BarChart2, Flame, Zap, TrendingDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface Pillar {
  icon: React.ElementType
  label: string
  title: string
  sub: string
  accent: boolean
  stat: ReactNode
  statLabel: string
  statColor?: string
}

const PILLARS: Pillar[] = [
  {
    icon: BarChart2,
    label: 'Input Layer',
    title: 'Training',
    sub: 'Strength · endurance · metcon',
    accent: false,
    stat: '60+',
    statLabel: 'exercises tracked',
  },
  {
    icon: Flame,
    label: 'Input Layer',
    title: 'Nutrition',
    sub: 'IFCT-verified Indian food data',
    accent: false,
    stat: (
      <span className="inline-flex items-center gap-1">
        <TrendingDown size={16} className="text-destructive" />
        <span>23%</span>
      </span>
    ),
    statLabel: 'MFP protein undercount',
    statColor: 'text-destructive',
  },
  {
    icon: Zap,
    label: 'Output',
    title: 'Diagnosis',
    sub: 'One answer. No guessing.',
    accent: true,
    stat: '1',
    statLabel: 'bottleneck named',
  },
]

export function PillarStrip() {
  return (
    <section className="px-4 pb-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-3 overflow-hidden rounded-2xl"
          style={{
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.018)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {PILLARS.map(({ icon: Icon, label, title, sub, accent, stat, statLabel, statColor }, i) => (
            <div
              key={title}
              className={`relative p-6 text-center sm:p-8 card-lift ${i < 2 ? 'border-r' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              {accent && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,122,47,0.10) 0%, transparent 60%)',
                    borderRadius: 'inherit',
                  }}
                />
              )}
              <div
                className="relative mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
                style={accent
                  ? { border: '1px solid rgba(255,122,47,0.35)', background: 'rgba(255,122,47,0.12)' }
                  : { border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }
                }
              >
                <Icon size={16} className={accent ? 'text-accent' : 'text-muted-foreground'} />
              </div>
              <p className={`font-mono-label ${accent ? 'text-accent' : 'text-muted-foreground'}`}>
                {label}
              </p>
              <p className="mt-1.5 text-base font-bold text-foreground">{title}</p>
              <p className={`mt-1 text-xs ${accent ? 'text-accent-light/70' : 'text-muted-foreground'}`}>{sub}</p>
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className={`font-mono text-lg font-bold ${statColor ?? (accent ? 'text-accent' : 'text-foreground')}`}>
                  {stat}
                </p>
                <p className="font-mono-label text-muted-foreground mt-0.5">{statLabel}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
