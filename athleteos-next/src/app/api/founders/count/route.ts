import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers)
  const limit = checkRateLimit(ip, { maxRequests: 30, windowMs: 60_000 })
  if (!limit.allowed) {
    return NextResponse.json({ count: null }, { status: 429 })
  }
  const { count, error } = await supabaseAdmin
    .from('founders_waitlist')
    .select('*', { count: 'exact', head: true })

  if (error || count === null) {
    return NextResponse.json({ count: null })
  }

  return NextResponse.json({ count })
}
