'use client'

import { useEffect, useState } from 'react'

import { shouldShowSampleOutcome } from './landingFlow'
import { SampleOutcomeBlock } from './SampleOutcomeBlock'

function hasStoredRankResult() {
  if (typeof window === 'undefined') return false
  return !!window.localStorage.getItem('aos_rank_result')
}

export function ConditionalSampleOutcome() {
  const [showSampleOutcome, setShowSampleOutcome] = useState(() => shouldShowSampleOutcome(hasStoredRankResult() ? { overallPct: 1 } : null))

  useEffect(() => {
    const sync = () => {
      setShowSampleOutcome(shouldShowSampleOutcome(hasStoredRankResult() ? { overallPct: 1 } : null))
    }

    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('aos-rank-result-changed', sync as EventListener)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('aos-rank-result-changed', sync as EventListener)
    }
  }, [])

  if (!showSampleOutcome) return null

  return <SampleOutcomeBlock />
}
