import { describe, expect, it } from 'vitest'

import {
  STORY_CARD_FILENAME,
  STORY_CARD_HEIGHT,
  STORY_CARD_WIDTH,
  STORY_RATIO,
} from './storyShareConfig'

describe('storyShareConfig', () => {
  it('uses the native Instagram Story aspect ratio', () => {
    expect(STORY_CARD_WIDTH).toBe(1080)
    expect(STORY_CARD_HEIGHT).toBe(1920)
    expect(STORY_RATIO).toBe('9:16')
  })

  it('uses a dedicated story export filename', () => {
    expect(STORY_CARD_FILENAME).toBe('athleteos-story-card.png')
  })
})
