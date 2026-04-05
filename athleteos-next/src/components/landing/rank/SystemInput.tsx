/** Shared form inputs for the rank calculator. */

export function GlassInput({ id, label, value, onChange, placeholder, min, max, step, onFocus, error }: {
  id?: string
  label?: string; value: string; onChange: (v: string) => void
  placeholder: string; min?: number; max?: number; step?: number; onFocus?: () => void; error?: string
}) {
  return (
    <div>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        aria-label={label ?? placeholder}
        aria-invalid={error ? 'true' : undefined}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => {
          const raw = e.target.value
          if (raw === '') { onChange(''); return }
          // Block negatives + strip leading zeros
          const cleaned = raw.replace(/-/g, '').replace(/^0+(?=\d)/, '')
          // Enforce max if set
          if (max !== undefined) {
            const num = parseFloat(cleaned)
            if (!isNaN(num) && num > max) { onChange(String(max)); return }
          }
          onChange(cleaned)
        }}
        onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault() }}
        onFocus={onFocus}
        className={`system-input font-mono ${error ? 'input-error' : ''}`}
      />
      {error && <p className="mt-1 font-mono text-xs text-destructive" role="alert">{error}</p>}
    </div>
  )
}

export function GlassField({ type, placeholder, value, onChange, error, required, autoComplete, ariaLabel, onFocus }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string
  required?: boolean; autoComplete?: string; ariaLabel?: string; onFocus?: () => void
}) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        className={`system-input ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-label={ariaLabel ?? placeholder}
        required={required}
        autoComplete={autoComplete}
      />
      {error && <p className="mt-1 font-mono text-xs text-destructive" role="alert">{error}</p>}
    </div>
  )
}

export function LiftRow({ label, weightVal, repsVal, onWeight, onReps, onWeightFocus, onRepsFocus, weightError, repsError }: {
  label: string; weightVal: string; repsVal: string
  onWeight: (v: string) => void; onReps: (v: string) => void
  onWeightFocus?: () => void; onRepsFocus?: () => void
  weightError?: string; repsError?: string
}) {
  return (
    <div className="grid grid-cols-[56px_1fr_56px] sm:grid-cols-[80px_1fr_72px] items-center gap-2">
      <p className="font-mono-label text-muted-foreground">{label}</p>
      <GlassInput placeholder="kg (one set)" value={weightVal} onChange={onWeight} min={20} max={500} step={0.5} label={`${label} weight for one set`} onFocus={onWeightFocus} error={weightError} />
      <GlassInput placeholder="reps (one set)" value={repsVal} onChange={onReps} min={1} max={12} step={1} label={`${label} reps in one set`} onFocus={onRepsFocus} error={repsError} />
    </div>
  )
}
