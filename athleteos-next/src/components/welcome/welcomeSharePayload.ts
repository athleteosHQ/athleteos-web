interface WelcomeSharePayloadInput {
  founderNumber: number
  diagnosisHeadline: string
}

interface WelcomeSharePayload {
  badgeLabel: string
  foundingLabel: string
  diagnosisLabel: string
  shareMessage: string
}

export function getWelcomeSharePayload({
  founderNumber,
  diagnosisHeadline,
}: WelcomeSharePayloadInput): WelcomeSharePayload {
  const primaryConstraint = diagnosisHeadline.split(' ')[0].toLowerCase()

  return {
    badgeLabel: 'Early Athlete',
    foundingLabel: `Founding Member #${founderNumber}`,
    diagnosisLabel: 'Primary Constraint',
    shareMessage: `Been training hard and still stuck? AthleteOS showed me what was actually holding my performance back: ${primaryConstraint}. I got in early as Founding Member #${founderNumber}. Check yours: athleteos.io`,
  }
}

export type { WelcomeSharePayload }
