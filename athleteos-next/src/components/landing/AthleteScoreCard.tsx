'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from './rank/AnimatedCounter'

type Status = 'up' | 'neutral' | 'down'

export interface ScoreMetric {
  label: string
  value: string
  status: Status
}

interface AthleteScoreCardProps {
  score?: number
  systemStatus?: string
  percentileLabel?: string
  metrics?: ScoreMetric[]
  animate?: boolean
  variant?: 'hero' | 'default'
}

const STATUS_COLOR: Record<Status, string> = {
  up:      'text-success',
  neutral: 'text-warning',
  down:    'text-destructive',
}
const STATUS_ICON: Record<Status, string> = { up: '↑', neutral: '→', down: '↓' }

function MetricRow({ label, value, status }: ScoreMetric) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
      <span className="font-mono-label text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{value}</span>
        <span className={`text-xs font-bold ${STATUS_COLOR[status]}`}>
          {STATUS_ICON[status]}
        </span>
      </div>
    </div>
  )
}

const DEFAULT_METRICS: ScoreMetric[] = [
  { label: 'Strength',  value: 'Top 12%',    status: 'up'      },
  { label: 'Endurance', value: 'Top 42%',    status: 'neutral' },
  { label: 'Recovery',  value: 'Needs work', status: 'down'    },
  { label: 'Fueling',   value: 'Optimal',    status: 'up'      },
]

export function AthleteScoreCard({
  score = 84,
  systemStatus = 'Optimal',
  percentileLabel = 'Top 16% of competitive strength athletes',
  metrics = DEFAULT_METRICS,
  animate = true,
  variant = 'default',
}: AthleteScoreCardProps) {
  const isHero = variant === 'hero'
  const Wrapper = animate ? motion.div : 'div'
  const motionProps = animate
    ? { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring' as const, duration: 0.8, bounce: 0 } }
    : {}

  const cardClass = isHero
    ? 'surface-card relative p-6 md:p-8 max-w-sm w-full'
    : 'surface-card relative p-6 md:p-8 max-w-sm w-full'

  return (
    <Wrapper className={cardClass} {...motionProps}>
      {/* Subtle corner accent for hero variant */}
      {isHero && (
        <div
          className="pointer-events-none absolute top-0 right-0 w-32 h-32 rounded-tr-2xl"
          style={{ background: 'radial-gradient(circle at top right, rgba(94,106,210,0.18), transparent 70%)' }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, delay: 0.2 }}
        >
          <p className="font-mono-label text-muted-foreground mb-1">Competitive benchmark percentile</p>
          <h3 className="text-3xl font-display font-bold text-foreground leading-none">{percentileLabel}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tier:{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}
              className="font-bold text-foreground inline-block"
            >
              {systemStatus}
            </motion.span>{' '}
            · benchmarked in your weight class
          </p>
        </motion.div>
        <div className="text-right">
          <p className="font-mono-label text-muted-foreground mb-1">Score</p>
          <p className="text-4xl font-display font-bold text-accent tabular-nums">
            <AnimatedCounter value={score} />
          </p>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-5 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-mono-label text-muted-foreground">Overall Performance</span>
          <span className="font-mono text-accent font-bold">{score}/100</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Metric rows */}
      <div>
        {metrics.map(m => <MetricRow key={m.label} {...m} />)}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-5 border-t border-white/[0.06]">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Compared against competitive strength-athlete records in your weight class.
          The score is secondary. The rank tells you where you stand first.
        </p>
      </div>
    </Wrapper>
  )
}
