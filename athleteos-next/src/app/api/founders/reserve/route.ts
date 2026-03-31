import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

interface ReserveBody {
  name?: string
  email: string
  whatsapp: string
  country?: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string
}

const VALID_DISCIPLINES = ['POWERLIFTING', 'WEIGHTLIFTING', 'HYBRID', 'BODYBUILDING']
const VALID_EXPERIENCE = ['< 1 YR', '1–3 YR', '3–5 YR', '5+ YR']
const OPTIONAL_COLUMNS = ['discipline', 'experience', 'referrer_id', 'country'] as const

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

function isValidPhone(v: string) {
  return /^\+?[0-9\s()-]{10,15}$/.test(v)
}

function getMissingOptionalColumns(message: string) {
  return OPTIONAL_COLUMNS.filter((column) => message.includes(`'${column}' column`))
}

async function insertFounderRow(insertData: Record<string, string>) {
  return supabaseAdmin.from('founders_waitlist').insert(insertData).select('id, founder_number').single()
}

export async function POST(req: NextRequest) {
  let body: ReserveBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, whatsapp, country, source, discipline, experience, referrer_id } = body

  // Validate required fields
  if (!email?.trim() || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (whatsapp?.trim() && !isValidPhone(whatsapp.trim())) {
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
    name: name?.trim() || '',
    email: email.trim(),
    whatsapp: whatsapp?.trim() || '',
    country: country?.trim() || '',
    source: source.trim(),
  }
  if (discipline) insertData.discipline = discipline
  if (experience) insertData.experience = experience
  const trimmedReferrerId = referrer_id?.trim()
  if (trimmedReferrerId) insertData.referrer_id = trimmedReferrerId

  let currentInsertData = insertData
  for (let attempt = 0; attempt <= OPTIONAL_COLUMNS.length; attempt += 1) {
    const { data, error } = await insertFounderRow(currentInsertData)

    if (data) {
      return NextResponse.json({ id: data.id, founder_number: data.founder_number })
    }

    if (error?.code === '23505') {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 409 })
    }

    const missingOptionalColumns = getMissingOptionalColumns(error?.message ?? '')
    if (!missingOptionalColumns.length) {
      return NextResponse.json({ error: error?.message ?? 'Something went wrong' }, { status: 500 })
    }

    const nextInsertData = { ...currentInsertData }
    for (const column of missingOptionalColumns) {
      delete nextInsertData[column]
    }

    if (Object.keys(nextInsertData).length === Object.keys(currentInsertData).length) {
      return NextResponse.json({ error: error?.message ?? 'Something went wrong' }, { status: 500 })
    }

    currentInsertData = nextInsertData
  }

  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
}
