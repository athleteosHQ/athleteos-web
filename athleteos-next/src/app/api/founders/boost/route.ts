import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers)
  const limit = checkRateLimit(ip, { maxRequests: 10, windowMs: 60_000 })
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: { id: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.id?.trim()) {
    return NextResponse.json({ error: 'Founder ID is required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.rpc('increment_share_count', { row_id: body.id.trim() })

  if (error) {
    console.error('[boost] error:', error)
    return NextResponse.json({ error: 'Could not update share count' }, { status: 500 })
  }

  return NextResponse.json({ shareCount: data })
}
