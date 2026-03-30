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
      <div className="surface-control inline-flex" role="radiogroup" aria-label="Training mode">
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
              className="relative px-6 py-2 font-mono-label transition-colors duration-200"
              style={{
                minWidth: 120,
                color: active ? '#fff' : 'var(--muted-foreground)',
                background: active ? 'var(--accent)' : 'transparent',
                borderRadius: 4,
              }}
            >
              {label}
              {active && (
                <motion.span
                  layoutId="mode-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5"
                  style={{ background: 'var(--accent-light)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
