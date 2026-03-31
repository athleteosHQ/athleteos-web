import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ shareCount: data })
}
