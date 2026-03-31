/** Shared form inputs for the rank calculator. */

export function GlassInput({ id, label, value, onChange, placeholder, min, max, step }: {
  id?: string
  label?: string; value: string; onChange: (v: string) => void
  placeholder: string; min?: number; max?: number; step?: number
}) {
  return (
    <input
      id={id}
      type="number"
      aria-label={label ?? placeholder}
      placeholder={placeholder}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => onChange(e.target.value)}
      className="system-input font-mono"
    />
  )
}

export function GlassField({ type, placeholder, value, onChange, error, required, autoComplete, ariaLabel }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string
  required?: boolean; autoComplete?: string; ariaLabel?: string
}) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
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

export function LiftRow({ label, weightVal, repsVal, onWeight, onReps }: {
  label: string; weightVal: string; repsVal: string
  onWeight: (v: string) => void; onReps: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-[80px_1fr_72px] items-center gap-2">
      <p className="font-mono-label text-muted-foreground">{label}</p>
      <GlassInput placeholder="kg (1 set)" value={weightVal} onChange={onWeight} min={0} step={0.5} label={`${label} weight for one set`} />
      <GlassInput placeholder="reps" value={repsVal} onChange={onReps} min={1} max={30} label={`${label} reps in one set`} />
    </div>
  )
}
