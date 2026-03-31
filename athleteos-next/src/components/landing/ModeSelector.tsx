'use client'

import { motion, LayoutGroup } from 'framer-motion'

export type AthleteMode = 'gym' | 'hybrid'

interface ModeSelectorProps {
  mode: AthleteMode
  onModeChange: (mode: AthleteMode) => void
}

const MODES: { value: AthleteMode; label: string }[] = [
  { value: 'gym', label: 'Gym' },
  { value: 'hybrid', label: 'Hybrid' },
]

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, current: AthleteMode) => {
    const idx = MODES.findIndex(m => m.value === current)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      onModeChange(MODES[(idx + 1) % MODES.length].value)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      onModeChange(MODES[(idx - 1 + MODES.length) % MODES.length].value)
    }
  }

  return (
    <LayoutGroup>
      <div
        className="relative inline-flex p-1 rounded-lg"
        role="radiogroup"
        aria-label="Training mode"
        style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {MODES.map(({ value, label }) => {
          const active = mode === value
          return (
            <button
              key={value}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onModeChange(value)}
              onKeyDown={e => handleKeyDown(e, value)}
              className="relative px-8 py-2.5 font-mono-label transition-colors duration-200"
              style={{ minWidth: 120, color: active ? '#fff' : 'var(--muted-foreground)' }}
            >
              {active && (
                <motion.div
                  layoutId="mode-pill"
                  className="absolute inset-0 rounded-md"
                  style={{
                    background: 'var(--accent)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
