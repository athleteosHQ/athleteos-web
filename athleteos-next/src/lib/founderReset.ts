export interface FounderResetArgs {
  email?: string
  id?: string
}

export interface FounderResetTarget {
  column: 'email' | 'id'
  value: string
}

export function getFounderResetTarget({
  email,
  id,
}: FounderResetArgs): FounderResetTarget {
  const normalizedEmail = email?.trim()
  const normalizedId = id?.trim()

  if ((!normalizedEmail && !normalizedId) || (normalizedEmail && normalizedId)) {
    throw new Error('Provide exactly one of --email or --id.')
  }

  if (normalizedEmail) {
    return { column: 'email', value: normalizedEmail }
  }

  return { column: 'id', value: normalizedId! }
}

export function buildFounderResetBrowserScript() {
  return [
    "localStorage.removeItem('aos_founder_data')",
    "localStorage.removeItem('aos_waitlist')",
    "localStorage.removeItem('aos_rank_result')",
    "localStorage.removeItem('aos_referrer_id')",
    "window.dispatchEvent(new Event('aos-founder-data-changed'))",
    'location.reload()',
  ].join('\n')
}

export function buildLocalResetUrl(origin = 'http://localhost:3000') {
  return `${origin.replace(/\/+$/, '')}/reset-local`
}
