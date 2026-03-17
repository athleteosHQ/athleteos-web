import { P_MARKERS, RANK_DATA, RUN_5K_DATA, WEIGHT_CLASSES, type LiftKey, type WCKey } from './rankData'

export interface LiftInput { weight: number; reps: number }

export interface RankInput {
  bodyweight: number
  squat: LiftInput
  bench: LiftInput
  deadlift: LiftInput
  run5k?: { minutes: number; seconds: number }
  trainingType: 'strength' | 'hybrid'
}

export interface LiftResult {
  estimated1RM: number
  percentile: number
}

export interface RankResult {
  weightClass: string
  tier: string
  tierColor: string
  overallPct: number
  athleteScore: number
  squat: LiftResult
  bench: LiftResult
  deadlift: LiftResult
  run5k?: { timeSeconds: number; percentile: number }
}

/** Epley formula */
export function epley(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

/** Binary search percentile lookup */
function lookupPercentile(value: number, table: readonly number[]): number {
  if (value <= table[0]) return P_MARKERS[0]
  if (value >= table[table.length - 1]) return 99
  for (let i = 0; i < table.length - 1; i++) {
    if (value >= table[i] && value < table[i + 1]) {
      const frac = (value - table[i]) / (table[i + 1] - table[i])
      return P_MARKERS[i] + frac * (P_MARKERS[i + 1] - P_MARKERS[i])
    }
  }
  return 99
}

function getTierFromPct(pct: number): { tier: string; tierColor: string } {
  if (pct >= 90) return { tier: 'Elite',         tierColor: '#FF7A2F' }
  if (pct >= 75) return { tier: 'Advanced',      tierColor: '#F59E0B' }
  if (pct >= 50) return { tier: 'Intermediate',  tierColor: '#3B82F6' }
  if (pct >= 25) return { tier: 'Foundational',  tierColor: '#64748b' }
  return              { tier: 'Beginner',        tierColor: '#475569' }
}

export function calculateRank(input: RankInput): RankResult | null {
  const { bodyweight, squat, bench, deadlift, run5k, trainingType } = input

  if (bodyweight < 40 || bodyweight > 250) return null

  const wc = WEIGHT_CLASSES.find(w => bodyweight <= w.max)
  if (!wc) return null
  const wcKey = wc.key as WCKey

  const calc = (lift: LiftInput, liftKey: LiftKey): LiftResult => {
    const est = epley(lift.weight, lift.reps)
    const table = RANK_DATA[liftKey][wcKey]
    const pct = est > 0 ? lookupPercentile(est, table) : 0
    return { estimated1RM: Math.round(est), percentile: Math.round(pct) }
  }

  const squatResult    = calc(squat,    'squat')
  const benchResult    = calc(bench,    'bench')
  const deadliftResult = calc(deadlift, 'deadlift')

  let run5kResult: RankResult['run5k'] | undefined
  let overallPct: number

  if (trainingType === 'hybrid' && run5k) {
    const timeSeconds = run5k.minutes * 60 + run5k.seconds
    const runPct = timeSeconds > 0 ? lookupPercentile(
      // Lower time = better: invert by using 3600 - time for lookup
      // Actually the table is sorted high to low (slower = lower pct)
      timeSeconds,
      [...RUN_5K_DATA].reverse()
    ) : 0
    run5kResult = { timeSeconds, percentile: Math.round(100 - runPct) }
    // For run: lower time = higher percentile, table is slow→fast = 5%→99%
    const runPctActual = lookupPercentile(3601 - timeSeconds, RUN_5K_DATA.slice().reverse())
    run5kResult.percentile = Math.round(runPctActual)
    overallPct = (squatResult.percentile + benchResult.percentile + deadliftResult.percentile + run5kResult.percentile) / 4
  } else {
    const validLifts = [squatResult, benchResult, deadliftResult].filter(l => l.estimated1RM > 0)
    overallPct = validLifts.length > 0
      ? validLifts.reduce((s, l) => s + l.percentile, 0) / validLifts.length
      : 0
  }

  overallPct = Math.round(overallPct)
  const athleteScore = Math.round(overallPct * 0.85 + 10) // map to 10–95 range

  return {
    weightClass: wc.label,
    ...getTierFromPct(overallPct),
    overallPct,
    athleteScore: Math.min(95, Math.max(10, athleteScore)),
    squat: squatResult,
    bench: benchResult,
    deadlift: deadliftResult,
    run5k: run5kResult,
  }
}
