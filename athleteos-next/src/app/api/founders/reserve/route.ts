import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

interface ReserveBody {
  name: string
  email: string
  whatsapp: string
  source: string
  discipline?: string
  experience?: string
}

const VALID_DISCIPLINES = ['POWERLIFTING', 'WEIGHTLIFTING', 'HYBRID', 'BODYBUILDING']
const VALID_EXPERIENCE = ['< 1 YR', '1–3 YR', '3–5 YR', '5+ YR']

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

function isValidPhone(v: string) {
  return /^\+?[0-9\s()-]{10,15}$/.test(v)
}

export async function POST(req: NextRequest) {
  let body: ReserveBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, whatsapp, source, discipline, experience } = body

  // Validate required fields
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email?.trim() || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (!whatsapp?.trim() || !isValidPhone(whatsapp.trim())) {
    return NextResponse.json({ error: 'Valid WhatsApp number is required' }, { status: 400 })
  }
  if (!source?.trim()) {
    return NextResponse.json({ error: 'Source is required' }, { status: 400 })
  }

  // Validate optional fields
  if (discipline && !VALID_DISCIPLINES.includes(discipline)) {
    return NextResponse.json({ error: 'Invalid discipline' }, { status: 400 })
  }
  if (experience && !VALID_EXPERIENCE.includes(experience)) {
    return NextResponse.json({ error: 'Invalid experience' }, { status: 400 })
  }

  const insertData: Record<string, string> = {
    name: name.trim(),
    email: email.trim(),
    whatsapp: whatsapp.trim(),
    source: source.trim(),
  }
  if (discipline) insertData.discipline = discipline
  if (experience) insertData.experience = experience

  const { data, error } = await supabaseAdmin
    .from('founders_waitlist')
    .insert(insertData)
    .select('id, founder_number')
    .single()

  if (error) {
    // Handle optional column missing gracefully
    const msg = error.message ?? ''
    if (msg.includes("Could not find the 'discipline' column") || msg.includes("Could not find the 'experience' column")) {
      const { data: retryData, error: retryError } = await supabaseAdmin
        .from('founders_waitlist')
        .insert({ name: insertData.name, email: insertData.email, whatsapp: insertData.whatsapp, source: insertData.source })
        .select('id, founder_number')
        .single()

      if (retryError) {
        return NextResponse.json({ error: retryError.message }, { status: 500 })
      }
      return NextResponse.json({ id: retryData.id, founder_number: retryData.founder_number })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, founder_number: data.founder_number })
}
