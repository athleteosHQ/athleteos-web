'use client'

import { motion } from 'framer-motion'

type Status = 'up' | 'neutral' | 'down'

export interface ScoreMetric {
  label: string
  value: string
  status: Status
}

interface AthleteScoreCardProps {
  score?: number
  systemStatus?: string
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
    ? 'hero-card relative p-6 md:p-8 max-w-sm w-full'
    : 'card-surface relative p-6 md:p-8 max-w-sm w-full'

  return (
    <Wrapper className={cardClass} {...motionProps}>
      {/* Subtle corner accent for hero variant */}
      {isHero && (
        <div
          className="pointer-events-none absolute top-0 right-0 w-32 h-32 rounded-tr-2xl"
          style={{ background: 'radial-gradient(circle at top right, rgba(255,122,47,0.2), transparent 70%)' }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="font-mono-label text-muted-foreground mb-1">System Status</p>
          <h3 className="text-2xl font-display font-semibold text-foreground">{systemStatus}</h3>
        </div>
        <div className="text-right">
          <p className="font-mono-label text-muted-foreground mb-1">Athlete Score</p>
          <p className="text-5xl font-display font-bold text-accent tabular-nums">{score}</p>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-5 h-12 rounded-lg overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <svg viewBox="0 0 300 48" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FF7A2F" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FF7A2F" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 40 Q30 35 60 30 T120 20 T180 25 T240 12 T300 8 V48 H0Z"
            fill="url(#sparkGrad)"
          />
          <path
            d="M0 40 Q30 35 60 30 T120 20 T180 25 T240 12 T300 8"
            fill="none"
            stroke="#FF7A2F"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Live dot at end */}
          <circle cx="296" cy="9" r="3" fill="#FF7A2F">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>

      {/* Score bar */}
      <div className="mb-5 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-mono-label text-muted-foreground">Overall Performance</span>
          <span className="font-mono text-accent font-bold">{score}/100</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden signal-bar" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Metric rows */}
      <div>
        {metrics.map(m => <MetricRow key={m.label} {...m} />)}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-5 border-t border-white/[0.06]">
        <p className="text-sm text-muted-foreground">
          You are ahead of{' '}
          <span className="text-foreground font-semibold">{score}%</span>{' '}
          of athletes in your weight class.
        </p>
      </div>
    </Wrapper>
  )
}
