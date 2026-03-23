import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

/** Server-only Supabase client — bypasses RLS using service role key. Never import in client code. */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
