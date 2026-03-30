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

export interface NextThreshold {
  lift: 'squat' | 'bench' | 'deadlift'
  currentPct: number
  nextPct: number
  kgNeeded: number
}

export interface StrengthAge {
  years: string
  description: string
}

export interface EfficiencyScore {
  pct: number
  ceilingTotal: number
  actualTotal: number
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
  nextThreshold?: NextThreshold
  strengthAge: StrengthAge
  efficiencyScore: EfficiencyScore
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

/** Map overall percentile to estimated training age band. */
function getStrengthAge(overallPct: number): StrengthAge {
  if (overallPct >= 90) return { years: '5+', description: 'Consistent with 5+ years of structured training' }
  if (overallPct >= 75) return { years: '3–5', description: 'Consistent with 3–5 years of structured training' }
  if (overallPct >= 50) return { years: '2–3', description: 'Consistent with 2–3 years of structured training' }
  if (overallPct >= 25) return { years: '1–2', description: 'Consistent with 1–2 years of structured training' }
  return { years: '<1', description: 'Consistent with less than 1 year of structured training' }
}

/** Compute actual total vs theoretical ceiling (99th percentile) for weight class. */
function getEfficiencyScore(wcKey: WCKey, squatE1RM: number, benchE1RM: number, deadliftE1RM: number): EfficiencyScore {
  const sqCeiling = RANK_DATA.squat[wcKey][P_MARKERS.length - 1]
  const bpCeiling = RANK_DATA.bench[wcKey][P_MARKERS.length - 1]
  const dlCeiling = RANK_DATA.deadlift[wcKey][P_MARKERS.length - 1]
  const ceilingTotal = sqCeiling + bpCeiling + dlCeiling
  const actualTotal = squatE1RM + benchE1RM + deadliftE1RM
  const pct = ceilingTotal > 0 ? Math.round((actualTotal / ceilingTotal) * 100) : 0
  return { pct, ceilingTotal, actualTotal }
}

/** Compute kg needed on a lift to reach the next 5-percentile bracket. */
export function getNextThreshold(
  liftKey: LiftKey,
  wcKey: WCKey,
  currentE1RM: number,
): { nextPct: number; kgNeeded: number } | null {
  const table = RANK_DATA[liftKey][wcKey]
  // Find the next bracket above current e1RM
  for (let i = 0; i < table.length; i++) {
    if (currentE1RM < table[i]) {
      const kgNeeded = Math.ceil(table[i] - currentE1RM)
      return { nextPct: P_MARKERS[i], kgNeeded }
    }
  }
  return null // already at/above 99th percentile
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
    overallPct = (squatResult.percentile + deadliftResult.percentile + run5kResult.percentile) / 3
  } else {
    const validLifts = [squatResult, benchResult, deadliftResult].filter(l => l.estimated1RM > 0)
    overallPct = validLifts.length > 0
      ? validLifts.reduce((s, l) => s + l.percentile, 0) / validLifts.length
      : 0
  }

  overallPct = Math.round(overallPct)
  const athleteScore = Math.round(overallPct * 0.85 + 10) // map to 10–95 range

  // Compute next threshold for the weakest lift with data
  const allLifts: { lift: 'squat' | 'bench' | 'deadlift'; result: LiftResult }[] = [
    { lift: 'squat' as const, result: squatResult },
    { lift: 'bench' as const, result: benchResult },
    { lift: 'deadlift' as const, result: deadliftResult },
  ]
  const liftEntries = allLifts.filter(e => e.result.estimated1RM > 0)

  let nextThreshold: NextThreshold | undefined
  if (liftEntries.length > 0) {
    const weakest = liftEntries.reduce((min, e) => e.result.percentile < min.result.percentile ? e : min)
    const threshold = getNextThreshold(weakest.lift, wcKey, weakest.result.estimated1RM)
    if (threshold) {
      nextThreshold = {
        lift: weakest.lift,
        currentPct: weakest.result.percentile,
        nextPct: threshold.nextPct,
        kgNeeded: threshold.kgNeeded,
      }
    }
  }

  return {
    weightClass: wc.label,
    ...getTierFromPct(overallPct),
    overallPct,
    athleteScore: Math.min(95, Math.max(10, athleteScore)),
    squat: squatResult,
    bench: benchResult,
    deadlift: deadliftResult,
    run5k: run5kResult,
    nextThreshold,
    strengthAge: getStrengthAge(overallPct),
    efficiencyScore: getEfficiencyScore(wcKey, squatResult.estimated1RM, benchResult.estimated1RM, deadliftResult.estimated1RM),
  }
}
