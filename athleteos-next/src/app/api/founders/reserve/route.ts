import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { sendFounderWelcomeEmail } from '@/lib/email'
import { checkRateLimit, getClientIp, isAllowedOrigin, ALLOWED_DOMAINS } from '@/lib/rate-limit'

/** Strip HTML tags to prevent stored XSS */
function stripHtml(v: string): string {
  return v.replace(/<[^>]*>/g, '').trim()
}

interface ReserveBody {
  name?: string
  email: string
  whatsapp: string
  country?: string
  source: string
  discipline?: string
  experience?: string
  referrer_id?: string
  website?: string  // honeypot — bots fill this, real users don't see it
}

const VALID_DISCIPLINES = ['POWERLIFTING', 'WEIGHTLIFTING', 'HYBRID', 'BODYBUILDING']
const VALID_EXPERIENCE = ['< 1 YR', '1–3 YR', '3–5 YR', '5+ YR']
const OPTIONAL_COLUMNS = ['discipline', 'experience', 'referrer_id', 'country'] as const

function isValidEmail(v: string) {
  // Requires: local part with allowed chars, @ symbol, domain with dot, TLD 2-6 chars from known patterns
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.(com|in|io|org|net|co|edu|gov|me|app|dev|xyz|info|biz|us|uk|ca|au|de|fr|jp|kr|ru|br|mx|za|ae|sg|hk|nz)$/i.test(v)
}

function isValidPhone(v: string) {
  // Strip spaces, dashes, parens for digit count
  const digits = v.replace(/[\s()\-+]/g, '')
  // Must be 10-13 digits (Indian: 10, international: 10-13 with country code)
  return /^\+?[0-9\s()\-]{10,16}$/.test(v) && digits.length >= 10 && digits.length <= 13
}

function getMissingOptionalColumns(message: string) {
  return OPTIONAL_COLUMNS.filter((column) => message.includes(`'${column}' column`))
}

async function insertFounderRow(insertData: Record<string, string | null>) {
  return supabaseAdmin.from('founders_waitlist').insert(insertData).select('id, founder_number').single()
}

export async function POST(req: NextRequest) {
  // ── Rate limiting (5 attempts per IP per minute) ──
  const ip = getClientIp(req.headers)
  const limit = checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetIn / 1000)) } },
    )
  }

  // ── Origin check ──
  if (!isAllowedOrigin(req.headers, ALLOWED_DOMAINS)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: ReserveBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── Honeypot — if 'website' field is filled, it's a bot ──
  if (body.website) {
    // Silently accept to not tip off the bot, but don't insert
    return NextResponse.json({ id: 'ok', founder_number: 0 })
  }

  const { name, email, whatsapp, country, source, discipline, experience, referrer_id } = body

  // Validate required fields
  if (!email?.trim() || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (whatsapp?.trim() && !isValidPhone(whatsapp.trim())) {
    return NextResponse.json({ error: 'Valid WhatsApp number is required' }, { status: 400 })
  }
  // Validate source against allowlist
  const VALID_SOURCES = ['rank-gate', 'hero', 'sticky-bar', 'direct', 'inline_rank_result']
  if (!source?.trim() || !VALID_SOURCES.includes(source.trim())) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
  }

  // Validate name and country length limits
  if (name && name.trim().length > 100) {
    return NextResponse.json({ error: 'Name too long' }, { status: 400 })
  }
  if (country && country.trim().length > 60) {
    return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
  }

  // Validate optional fields
  if (discipline && !VALID_DISCIPLINES.includes(discipline)) {
    return NextResponse.json({ error: 'Invalid discipline' }, { status: 400 })
  }
  if (experience && !VALID_EXPERIENCE.includes(experience)) {
    return NextResponse.json({ error: 'Invalid experience' }, { status: 400 })
  }

  // Validate referrer_id as UUID
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const trimmedReferrerId = referrer_id?.trim()
  if (trimmedReferrerId && !UUID_RE.test(trimmedReferrerId)) {
    return NextResponse.json({ error: 'Invalid referrer' }, { status: 400 })
  }

  const insertData: Record<string, string | null> = {
    name: name ? stripHtml(name) : '',
    email: email.trim().toLowerCase(),
    whatsapp: whatsapp?.trim() || null,  // null not '' — avoids unique constraint clash on empty strings
    country: country ? stripHtml(country) : '',
    source: source.trim(),
  }
  if (discipline) insertData.discipline = discipline
  if (experience) insertData.experience = experience
  if (trimmedReferrerId) insertData.referrer_id = trimmedReferrerId

  let currentInsertData = insertData
  for (let attempt = 0; attempt <= OPTIONAL_COLUMNS.length; attempt += 1) {
    const { data, error } = await insertFounderRow(currentInsertData)

    if (data) {
      // Send welcome email (non-blocking — don't delay the response)
      sendFounderWelcomeEmail({
        to: email.trim(),
        founderNumber: data.founder_number,
      }).catch((err) => console.error('[reserve] email send failed:', err))

      return NextResponse.json({ id: data.id, founder_number: data.founder_number })
    }

    if (error?.code === '23505') {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 409 })
    }

    const missingOptionalColumns = getMissingOptionalColumns(error?.message ?? '')
    if (!missingOptionalColumns.length) {
      console.error('[reserve] error:', error)
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }

    const nextInsertData = { ...currentInsertData }
    for (const column of missingOptionalColumns) {
      delete nextInsertData[column]
    }

    if (Object.keys(nextInsertData).length === Object.keys(currentInsertData).length) {
      console.error('[reserve] error:', error)
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }

    currentInsertData = nextInsertData
  }

  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
}
