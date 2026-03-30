interface InlineSignupGateContent {
  eyebrow: string
  headline: string
  productLine: string
  pricingLine: string
  trustChips: readonly string[]
}

const SHARED_GATE_CONTENT = {
  eyebrow: 'Founding members · first access',
  productLine: 'athleteOS connects training, nutrition, and recovery into one diagnosis.',
  pricingLine: 'No payment now. Founding price locked at ₹4,999/year.',
  trustChips: ['No payment now', 'Cancel anytime', 'Price locked forever'],
} as const

export function getInlineSignupGateContent(overallPct: number): InlineSignupGateContent {
  if (overallPct >= 90) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "You're ahead. Now see what separates you from the top 1%.",
    }
  }

  if (overallPct >= 60) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "You're closer than you think. See the one thing holding you back.",
    }
  }

  return {
    ...SHARED_GATE_CONTENT,
    headline: 'Your starting point is clear. See the fastest path up.',
  }
}

export function getShareMessage(overallPct: number): string {
  return `I'm in the top ${100 - overallPct}% of Indian strength athletes. Check yours -> athleteos.in`
}

export function shouldShowSampleOutcome(result: { overallPct?: number } | null): boolean {
  return result === null
}

export function getFounderLabel(serializedFounderData: string | null): string {
  if (!serializedFounderData) return ''

  try {
    const parsed = JSON.parse(serializedFounderData) as { num?: number }
    return parsed.num ? `Founding Member #${parsed.num}` : ''
  } catch {
    return ''
  }
}

export function hasFounderData(serializedFounderData: string | null): boolean {
  return getFounderLabel(serializedFounderData) !== ''
}
