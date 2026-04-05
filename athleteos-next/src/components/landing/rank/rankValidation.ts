interface RankFieldsLike {
  bw: string
  sqW: string
  sqR: string
  bpW: string
  bpR: string
  dlW: string
  dlR: string
  runMin: string
  runSec: string
}

type TrainingType = 'strength' | 'hybrid'
type RankFieldKey = keyof RankFieldsLike
type RankFieldErrors = Partial<Record<RankFieldKey, string>>
type LiftFieldPair = {
  weight: string
  reps: string
  weightKey: RankFieldKey
  repsKey: RankFieldKey
}

const MIN_BODYWEIGHT = 40
const MAX_BODYWEIGHT = 250
const MIN_LIFT_WEIGHT = 20
const MAX_LIFT_WEIGHT = 500
const MIN_REPS = 1
const MAX_REPS = 12
const MIN_5K_MINUTES = 12
const MAX_5K_MINUTES = 60

function parseNumber(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function parseIntValue(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : null
}

export function isValidBodyweight(value: string): boolean {
  const bodyweight = parseNumber(value)
  return bodyweight !== null && bodyweight >= MIN_BODYWEIGHT && bodyweight <= MAX_BODYWEIGHT
}

export function getRankFormValidation({
  fields,
  trainingType,
}: {
  fields: RankFieldsLike
  trainingType: TrainingType
}): { error: string | null; hasCompleteLift: boolean; fieldErrors: RankFieldErrors } {
  const lifts: LiftFieldPair[] = [
    { weight: fields.sqW, reps: fields.sqR, weightKey: 'sqW', repsKey: 'sqR' },
    { weight: fields.bpW, reps: fields.bpR, weightKey: 'bpW', repsKey: 'bpR' },
    { weight: fields.dlW, reps: fields.dlR, weightKey: 'dlW', repsKey: 'dlR' },
  ]

  let hasCompleteLift = false
  const fieldErrors: RankFieldErrors = {}

  for (const lift of lifts) {
    const weight = parseNumber(lift.weight)
    const reps = parseIntValue(lift.reps)
    const hasAnyLiftValue = lift.weight.trim() !== '' || lift.reps.trim() !== ''

    if (!hasAnyLiftValue) continue
    if (weight === null || reps === null) {
      if (weight === null) fieldErrors[lift.weightKey] = 'Weight required'
      if (reps === null) fieldErrors[lift.repsKey] = 'Reps required'
      return { error: 'Complete at least one lift with weight and reps.', hasCompleteLift: false, fieldErrors }
    }
    if (weight < MIN_LIFT_WEIGHT || weight > MAX_LIFT_WEIGHT) {
      fieldErrors[lift.weightKey] = 'Use 20–500 kg'
      return { error: 'Use 20–500 kg for any lift you enter.', hasCompleteLift: false, fieldErrors }
    }
    if (reps < MIN_REPS || reps > MAX_REPS) {
      fieldErrors[lift.repsKey] = 'Use 1–12 reps'
      return { error: 'Use 1–12 reps for any lift you enter.', hasCompleteLift: false, fieldErrors }
    }
    hasCompleteLift = true
  }

  if (!hasCompleteLift) {
    return { error: 'Complete at least one lift with weight and reps.', hasCompleteLift: false, fieldErrors }
  }

  if (trainingType === 'hybrid') {
    const hasRunValue = fields.runMin.trim() !== '' || fields.runSec.trim() !== ''
    if (hasRunValue) {
      const runMin = parseIntValue(fields.runMin)
      const runSec = parseIntValue(fields.runSec)
      if (runMin === null || runSec === null) {
        if (runMin === null) fieldErrors.runMin = 'Minutes required'
        if (runSec === null) fieldErrors.runSec = 'Seconds required'
        return { error: 'Complete the full 5K time or leave it blank.', hasCompleteLift, fieldErrors }
      }
      if (runMin < MIN_5K_MINUTES || runMin > MAX_5K_MINUTES || runSec < 0 || runSec > 59) {
        if (runMin < MIN_5K_MINUTES || runMin > MAX_5K_MINUTES) fieldErrors.runMin = 'Use 12–60 min'
        if (runSec < 0 || runSec > 59) fieldErrors.runSec = 'Use 0–59 sec'
        return { error: 'Use a realistic 5K time between 12:00 and 60:59.', hasCompleteLift, fieldErrors }
      }
    }
  }

  return { error: null, hasCompleteLift, fieldErrors }
}
