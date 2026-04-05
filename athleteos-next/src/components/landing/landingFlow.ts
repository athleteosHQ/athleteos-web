interface InlineSignupGateContent {
  eyebrow: string
  headline: string
  productLine: string
  trustChips: readonly string[]
}

const SHARED_GATE_CONTENT = {
  eyebrow: 'Founding members · first access',
  productLine: 'Training, nutrition, and recovery interpreted together — not in isolation. No payment now. Founding members get first access.',
  trustChips: ['No payment required', 'Cancel anytime', 'Founding rate locked'],
} as const

export function getInlineSignupGateContent(overallPct: number | null): InlineSignupGateContent {
  if (overallPct === null) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "The system is ready for your data. Stop tracking. Start correcting.",
    }
  }

  if (overallPct >= 90) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "You're already ahead of most lifters. Now find the gap that keeps you from the next tier.",
    }
  }

  if (overallPct >= 60) {
    return {
      ...SHARED_GATE_CONTENT,
      headline: "You're closer than you think. The variable holding you back probably isn't the one you blame.",
    }
  }

  return {
    ...SHARED_GATE_CONTENT,
    headline: 'Your numbers show exactly where to start. AthleteOS shows what to fix first.',
  }
}

export function getShareMessage(overallPct: number): string {
  return `I'm in the top ${100 - overallPct}% of competitive strength athletes. Start yours -> athleteos.io`
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
