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
}: AthleteScoreCardProps) {
  const Wrapper = animate ? motion.div : 'div'
  const motionProps = animate
    ? { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring' as const, duration: 0.8, bounce: 0 } }
    : {}

  return (
    <Wrapper
      className="relative p-6 md:p-8 max-w-sm w-full"
      style={{
        background: 'rgba(255,255,255,0.025)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
      {...motionProps}
    >
      {/* Gradient border via box-shadow + pseudo */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.25), rgba(255,0,128,0.18), rgba(123,47,255,0.12))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Corner glow */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-48 h-48 rounded-tr-[20px]"
        style={{ background: 'radial-gradient(circle at top right, rgba(255,107,53,0.1), rgba(255,0,128,0.06) 40%, transparent 70%)' }}
      />

      {/* Score badge — the "aha moment" */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <p className="font-mono-label text-muted-foreground mb-1">Competitive benchmark</p>
          <h3
            className="text-3xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "'Syne', var(--font-jakarta), sans-serif" }}
          >
            {percentileLabel}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tier:{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}
              className="font-bold text-foreground inline-block"
            >
              {systemStatus}
            </motion.span>
          </p>
        </motion.div>

        {/* Score number with gradient */}
        <div className="text-right flex-shrink-0">
          <p className="font-mono-label text-muted-foreground mb-1">Score</p>
          <p
            className="text-4xl font-bold tabular-nums"
            style={{
              fontFamily: "'Syne', var(--font-jakarta), sans-serif",
              background: 'linear-gradient(135deg, #FF6B35, #FF0080)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <AnimatedCounter value={score} />
          </p>
        </div>
      </div>

      {/* Gradient progress bar */}
      <div className="mb-5 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-mono-label text-muted-foreground">Overall Performance</span>
          <span
            className="font-mono font-bold"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF0080)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {score}/100
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FF6B35, #FF0080, #7B2FFF)' }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
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
        </p>
      </div>
    </Wrapper>
  )
}
