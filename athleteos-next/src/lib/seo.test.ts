import { describe, expect, it } from 'vitest'

import {
  OG_IMAGE_ALT,
  OG_IMAGE_DESCRIPTION,
  OG_IMAGE_TITLE,
  OG_IMAGE_URL,
} from './seo'

describe('seo preview config', () => {
  it('uses an app-hosted OG image route', () => {
    expect(OG_IMAGE_URL).toBe('/opengraph-image')
  })

  it('keeps the preview copy aligned with AthleteOS positioning', () => {
    expect(OG_IMAGE_TITLE).toBe('AthleteOS — Performance Diagnosis System')
    expect(OG_IMAGE_DESCRIPTION).toContain('Training, nutrition, and recovery')
    expect(OG_IMAGE_ALT).toContain('AthleteOS')
  })
})
