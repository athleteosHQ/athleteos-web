import { createClient } from '@supabase/supabase-js'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_ORIGIN = 'http://localhost:3000'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadLocalEnv() {
  const envPath = path.resolve(__dirname, '../.env.local')
  if (!fs.existsSync(envPath)) return

  const file = fs.readFileSync(envPath, 'utf8')
  for (const rawLine of file.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function parseArgs(argv) {
  const parsed = {}

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg.startsWith('--')) continue

    const key = arg.slice(2)
    const value = argv[i + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`)
    }

    parsed[key] = value
    i += 1
  }

  return parsed
}

function buildLocalResetUrl(origin = DEFAULT_ORIGIN) {
  return `${origin.replace(/\/+$/, '')}/reset-local`
}

function getTarget({ email, id }) {
  const normalizedEmail = email?.trim()
  const normalizedId = id?.trim()

  if ((!normalizedEmail && !normalizedId) || (normalizedEmail && normalizedId)) {
    throw new Error('Provide exactly one of --email or --id.')
  }

  if (normalizedEmail) {
    return { column: 'email', value: normalizedEmail }
  }

  return { column: 'id', value: normalizedId }
}

function openUrl(url) {
  const platform = process.platform

  if (platform === 'darwin') {
    return spawnSync('open', [url], { stdio: 'ignore' })
  }

  if (platform === 'win32') {
    return spawnSync('cmd', ['/c', 'start', '', url], { stdio: 'ignore' })
  }

  return spawnSync('xdg-open', [url], { stdio: 'ignore' })
}

async function main() {
  loadLocalEnv()

  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env

  if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  }

  const args = parseArgs(process.argv.slice(2))
  const target = getTarget(args)
  const resetUrl = buildLocalResetUrl(args.origin)
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const query = supabase
    .from('founders_waitlist')
    .delete()
    .eq(target.column, target.value)
    .select('id, founder_number, email')

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  if (!data?.length) {
    console.log(`No founders_waitlist row matched ${target.column}=${target.value}`)
  } else {
    console.log(`Deleted ${data.length} founder entr${data.length === 1 ? 'y' : 'ies'}:`)
    for (const row of data) {
      console.log(`- id=${row.id} founder_number=${row.founder_number} email=${row.email}`)
    }
  }

  const openResult = openUrl(resetUrl)

  if (openResult.error || openResult.status !== 0) {
    console.log(`\nOpen this URL to clear browser data automatically:`)
    console.log(resetUrl)
    return
  }

  console.log(`\nOpened ${resetUrl} to clear browser data automatically.`)
}

main().catch((error) => {
  console.error(`Reset failed: ${error.message}`)
  process.exit(1)
})
