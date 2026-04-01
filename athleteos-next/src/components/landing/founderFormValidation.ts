interface FounderFormInput {
  email: string
  whatsapp: string
}

type FounderFormErrors = Partial<Record<keyof FounderFormInput, string>>

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

function isValidPhone(value: string): boolean {
  return /^\+?[0-9\s()-]{10,15}$/.test(value.trim())
}

export function validateFounderForm({
  email,
  whatsapp,
}: FounderFormInput): FounderFormErrors {
  const errors: FounderFormErrors = {}

  if (!isValidEmail(email)) errors.email = 'Invalid email'
  if (whatsapp.trim() && !isValidPhone(whatsapp)) errors.whatsapp = 'Invalid number'

  return errors
}

export type { FounderFormErrors, FounderFormInput }
