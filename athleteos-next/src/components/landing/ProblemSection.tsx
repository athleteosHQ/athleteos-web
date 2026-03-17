'use client'

import { motion } from 'framer-motion'

const FOOD_DATA = [
  { food: 'Masoor dal (cooked)', mfp: '7.1g',  ifct: '9.0g',  diff: '−21%' },
  { food: 'Paneer (100g)',       mfp: '14.2g', ifct: '18.3g', diff: '−22%' },
  { food: 'Chicken curry',       mfp: '12.8g', ifct: '16.4g', diff: '−28%' },
  { food: 'Whole wheat roti',    mfp: '2.9g',  ifct: '4.0g',  diff: '−27%' },
]

const PROBLEM_CARDS = [
  { num: '01', text: 'Training apps stop at logging.' },
  { num: '02', text: 'Nutrition apps ignore the session.' },
  { num: '03', text: 'Neither explains the stall.' },
]

export function ProblemSection() {
  return (
    <section id="problem" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="font-mono-label text-accent mb-3">Step 2 · The data gap</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            MFP under-reports Indian food protein by 20–30%.
          </h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Using inaccurate data for 12 months means you&apos;ve likely miscounted{' '}
            <span className="font-semibold text-foreground">5.4kg of protein</span>. That&apos;s roughly
            2.1kg of potential lean muscle mass left on the table.
          </p>
        </motion.div>

        {/* Data table */}
        <motion.div
          className="card-surface overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-4 border-b border-border px-4 py-2.5 bg-secondary/40">
            {['Food', 'MFP (protein)', 'IFCT (actual)', 'Gap'].map(h => (
              <p key={h} className="font-mono-label text-muted-foreground">{h}</p>
            ))}
          </div>
          {FOOD_DATA.map((row, i) => (
            <div
              key={row.food}
              className={`grid grid-cols-4 px-4 py-3 ${i < FOOD_DATA.length - 1 ? 'border-b border-border' : ''}`}
            >
              <p className="text-sm text-foreground">{row.food}</p>
              <p className="font-mono text-sm text-muted-foreground">{row.mfp}</p>
              <p className="font-mono text-sm text-foreground font-semibold">{row.ifct}</p>
              <p className="font-mono text-sm font-bold text-destructive">{row.diff}</p>
            </div>
          ))}
        </motion.div>

        {/* Problem cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {PROBLEM_CARDS.map(({ num, text }, i) => (
            <motion.div
              key={num}
              className="card-surface p-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
            >
              <p className="font-mono-label text-muted-foreground mb-2">{num}</p>
              <p className="text-sm font-semibold text-foreground">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
