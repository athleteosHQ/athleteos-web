'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    label: 'Log food with IFCT accuracy',
    sub: 'Dal, paneer, sabzi — values you can trust.',
    accent: false,
  },
  {
    num: '02',
    label: 'Log PPL training sessions',
    sub: '60+ exercises. Auto-detects push/pull/legs day.',
    accent: false,
  },
  {
    num: '→',
    label: 'Get the bottleneck named',
    sub: 'One diagnosis. Plain English. No guessing.',
    accent: true,
  },
]

export function SystemSection() {
  return (
    <section id="system" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="font-mono-label text-accent mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Three inputs. One answer.
          </h2>
          <p className="text-muted-foreground">
            athleteOS is not a tracker. It&apos;s a diagnostic system.
          </p>
        </motion.div>

        <div className="space-y-3">
          {STEPS.map(({ num, label, sub, accent }, i) => (
            <motion.div
              key={num}
              className={`flex items-start gap-4 rounded-xl border p-4 transition ${
                accent
                  ? 'border-accent/25 bg-accent/5'
                  : 'card-surface'
              }`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span
                className={`mt-0.5 flex-shrink-0 font-mono text-sm font-bold ${
                  accent ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                {num}
              </span>
              <div>
                <p className={`text-sm font-semibold ${accent ? 'text-foreground' : 'text-foreground'}`}>
                  {label}
                </p>
                <p className="mt-0.5 font-mono-label text-muted-foreground">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-6 font-mono text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Stop tracking everything. Start understanding something.
        </motion.p>
      </div>
    </section>
  )
}
