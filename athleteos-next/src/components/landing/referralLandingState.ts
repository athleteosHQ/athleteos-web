interface ReferralLandingStateInput {
  founderNumber: number
  firstName?: string | null
}

interface ReferralLandingState {
  eyebrow: string
  headline: string
  body: string
  primaryCta: string
}

export function getReferralLandingState({
  founderNumber,
  firstName,
}: ReferralLandingStateInput): ReferralLandingState {
  const inviter = firstName?.trim() ? `${firstName.trim()} got in early as Founding Member #${founderNumber}.` : `Founding Member #${founderNumber} got in early.`

  return {
    eyebrow: 'Invited by a founding member',
    headline: inviter,
    body: 'Now check where you stand and see what the system reads first.',
    primaryCta: 'Check My Rank',
  }
}

export type { ReferralLandingState }
