interface WelcomeSharePayloadInput {
  diagnosisHeadline: string
}

interface WelcomeSharePayload {
  badgeLabel: string
  foundingLabel: string
  diagnosisLabel: string
  shareMessage: string
}

export function getWelcomeSharePayload({
  diagnosisHeadline,
}: WelcomeSharePayloadInput): WelcomeSharePayload {
  const primaryConstraint = diagnosisHeadline.split(' ')[0].toLowerCase()

  return {
    badgeLabel: 'Founding Member',
    foundingLabel: 'First Cohort',
    diagnosisLabel: 'Primary Constraint',
    shareMessage: `Been training hard and still stuck? AthleteOS showed me what was actually holding my performance back: ${primaryConstraint}. I got in early as a Founding Member in the First Cohort. Check yours: athleteos.io`,
  }
}

export type { WelcomeSharePayload }
