'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    title: 'Rank yourself',
    body: 'Enter your lifts. Get your India percentile instantly — free, no account.',
  },
  {
    num: '02',
    title: 'See the gap',
    body: 'athleteOS identifies which lifts are holding back your total rank.',
  },
  {
    num: '03',
    title: 'Close it systematically',
    body: 'Weekly programming, Indian-food nutrition targets, and progress tracking — all calibrated to your exact deficit.',
  },
]

export function BridgeSection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="font-mono-label text-accent mb-3">What happens next</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Your rank is the symptom.<br className="hidden sm:block" />
            <span className="gradient-text"> athleteOS finds the cause.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Most athletes know their numbers. Few know why those numbers are stuck.
            We diagnose the specific deficit — then close it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.028)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
            >
              {/* Connector line (desktop, not last) */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-8 -right-3 w-6 h-px"
                  style={{ background: 'rgba(255,122,47,0.30)' }}
                />
              )}
              <div
                className="inline-block font-mono text-xs font-bold mb-4 rounded-lg px-2.5 py-1"
                style={{
                  background: 'rgba(255,122,47,0.10)',
                  border: '1px solid rgba(255,122,47,0.25)',
                  color: 'var(--accent)',
                }}
              >
                {step.num}
              </div>
              <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
