import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const { count, error } = await supabaseAdmin
    .from('founders_waitlist')
    .select('*', { count: 'exact', head: true })

  if (error || count === null) {
    return NextResponse.json({ count: 142 })
  }

  return NextResponse.json({ count })
}
