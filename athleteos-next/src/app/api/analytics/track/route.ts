import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || !('event' in body)) {
    return NextResponse.json({ error: 'Missing event' }, { status: 400 })
  }

  console.info('[analytics]', body)
  return NextResponse.json({ ok: true })
}
