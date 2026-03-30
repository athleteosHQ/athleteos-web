/** Client-side API helpers — all writes go through Next.js API routes (service role key stays server-side). */

export interface FounderInsert {
  name: string
  email: string
  whatsapp: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string
}

export async function insertFounder(data: FounderInsert): Promise<{ data: { id: string; founder_number: number }; error: { message: string } | null }> {
  try {
    const res = await fetch('/api/founders/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      return { data: { id: '', founder_number: 0 }, error: { message: json.error ?? 'Something went wrong' } }
    }
    return { data: { id: json.id, founder_number: json.founder_number }, error: null }
  } catch {
    return { data: { id: '', founder_number: 0 }, error: { message: 'Network error — please try again' } }
  }
}

export async function incrementShareCount(rowId: string): Promise<{ data: number | null; error: { message: string } | null }> {
  try {
    const res = await fetch('/api/founders/boost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rowId }),
    })
    const json = await res.json()
    if (!res.ok) {
      return { data: null, error: { message: json.error ?? 'Something went wrong' } }
    }
    return { data: json.shareCount, error: null }
  } catch {
    return { data: null, error: { message: 'Network error — please try again' } }
  }
}

export async function getFounderCount(): Promise<number> {
  try {
    const res = await fetch('/api/founders/count')
    const json = await res.json()
    return json.count ?? 142
  } catch {
    return 142
  }
}
