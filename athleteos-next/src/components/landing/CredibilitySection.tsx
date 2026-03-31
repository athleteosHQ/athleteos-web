'use client'

import { motion } from 'framer-motion'

const CREDIBILITY_POINTS = [
  {
    label: 'Benchmark logic',
    title: 'Competitive athlete dataset',
    copy: 'Your percentile is benchmarked against 3,200+ competitive Indian strength-athlete records in your class, not the general population.',
  },
  {
    label: 'Nutrition accuracy',
    title: 'IFCT 2017, not generic food data',
    copy: 'Indian food intake is grounded in IFCT 2017, not generic crowd-sourced entries.',
  },
  {
    label: 'Diagnosis logic',
    title: 'One reasoning chain, not vague advice',
    copy: 'athleteOS connects training load, nutrition accuracy, and recovery timing into one bottleneck hypothesis you can act on.',
  },
  {
    label: 'Progress tracking',
    title: 'Built to track what changes',
    copy: 'The point is tracking whether the fix is actually moving performance over the next block.',
  },
]

export function CredibilitySection() {
  return (
    <section className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-8 max-w-3xl"
        >
          <p className="font-mono-label text-accent mb-3">What this is built on</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Why this is more than a rank calculator.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            The rank gets attention. Diagnosis and progress tracking are the product.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CREDIBILITY_POINTS.map(({ label, title, copy }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="surface-card-muted rounded-2xl p-5"
            >
              <p className="font-mono-label text-accent/80 mb-3">{label}</p>
              <h3 className="text-lg font-semibold text-foreground leading-snug">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
