import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export interface FounderInsert {
  name: string
  email: string
  whatsapp: string
  source: string
  discipline?: string
  experience?: string
}

export interface FounderRow extends FounderInsert {
  id: string
  founder_number: number
  share_count: number
  created_at: string
}

function coreFounderFields(data: FounderInsert) {
  return {
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp,
    source: data.source,
  }
}

export async function insertFounder(data: FounderInsert) {
  const initial = await supabase
    .from('founders_waitlist')
    .insert(data)
    .select('id, founder_number')
    .single()

  const message = initial.error?.message ?? ''
  const missingOptionalColumn =
    message.includes(`Could not find the 'discipline' column`) ||
    message.includes(`Could not find the 'experience' column`)

  if (!missingOptionalColumn) return initial

  return supabase
    .from('founders_waitlist')
    .insert(coreFounderFields(data))
    .select('id, founder_number')
    .single()
}

export async function incrementShareCount(rowId: string) {
  return supabase.rpc('increment_share_count', { row_id: rowId })
}

export async function getFounderCount(): Promise<number> {
  const { count, error } = await supabase
    .from('founders_waitlist')
    .select('*', { count: 'exact', head: true })
  if (error || count === null) return 142
  return count
}
