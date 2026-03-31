import { NextRequest, NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.trim()

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('founders_waitlist')
    .select('name, founder_number')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Referrer not found' }, { status: 404 })
  }

  return NextResponse.json({
    firstName: data.name?.trim()?.split(/\s+/)[0] ?? null,
    founderNumber: data.founder_number,
  })
}
