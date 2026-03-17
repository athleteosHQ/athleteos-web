import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export interface FounderInsert {
  name: string
  email: string
  whatsapp: string
  source: string
}

export interface FounderRow extends FounderInsert {
  id: string
  founder_number: number
  share_count: number
  created_at: string
}

export async function insertFounder(data: FounderInsert) {
  return supabase
    .from('founders_waitlist')
    .insert(data)
    .select('id, founder_number')
    .single()
}

export async function incrementShareCount(rowId: string) {
  return supabase.rpc('increment_share_count', { row_id: rowId })
}
