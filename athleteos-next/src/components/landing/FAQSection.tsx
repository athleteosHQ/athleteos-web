'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

interface FAQ {
  q: string
  a: string | React.ReactNode
}

const FAQS: FAQ[] = [
  {
    q: 'Is the rank calculator actually free?',
    a: 'Yes — completely. No account, no email, no card. Enter your lifts and get your India percentile rank instantly. The founding membership (₹4,999/year) is a separate product that gives you the full diagnosis engine, nutrition tracking, and ongoing coaching. The rank calculator is always free.',
  },
  {
    q: 'How accurate are the percentiles?',
    a: 'Percentiles are calibrated against IPF (International Powerlifting Federation) standards, adapted for the Indian strength sport population. We use the Epley formula to estimate your 1-rep max from any rep range, then map it against bodyweight-adjusted benchmarks. It is not a perfect measurement — no calculator is — but it is significantly more accurate than generic "beginner / intermediate / advanced" labels.',
  },
  {
    q: 'What data is the Indian athlete baseline built on?',
    a: 'The baseline is built from IPF-affiliated competition data, state-level powerlifting meets, and anonymised self-reported data from 3,200+ Indian athletes. Nutrition reference values use IFCT 2017 (Indian Food Composition Tables), which is the only government-verified dataset for Indian foods. Most global apps use USDA data — which routinely undercounts protein in Indian staples by 15–25%.',
  },
  {
    q: 'I only train one or two lifts. Can I still use it?',
    a: 'Yes. You can enter any combination of squat, bench, and deadlift. If you only train bench and deadlift, leave squat empty — the system will score the lifts you did provide. A complete three-lift profile gives you a more meaningful rank, but partial data still produces a useful result.',
  },
  {
    q: 'What is the ₹4,999 founding price, and why should I care?',
    a: (
      <>
        <span>The founding price is the lowest price athleteOS will ever cost — locked forever for the first 500 members, even as we raise prices at launch. After launch, pricing moves to ₹199/7-day trial → ₹999/month → ₹6,999/year. </span>
        <span>Founding members also get: direct WhatsApp access to founders, feature requests prioritised, founding member badge in-app, and beta access before the public launch.</span>
        <span className="block mt-2 text-xs" style={{ color: 'var(--accent)' }}>No payment is required to reserve. You pay only when you decide to activate.</span>
      </>
    ),
  },
  {
    q: 'What does "price locked forever" actually mean?',
    a: 'It means your annual renewal price stays at ₹4,999 regardless of how much we raise list prices. If athleteOS charges ₹12,000/year in three years, you still renew at ₹4,999. This applies as long as your membership remains active — it does not reset if you cancel and re-subscribe.',
  },
  {
    q: 'Can I cancel? What is the trial policy?',
    a: 'You can cancel within 7 days of your first payment for a full refund, no questions asked. After 7 days, cancellations take effect at the end of your current annual cycle — you keep access until then. Reserving a founding spot (filling out the form now) does not charge you anything. Payment only triggers when we send the activation link closer to launch.',
  },
  {
    q: 'How is athleteOS different from MyFitnessPal or other tracking apps?',
    a: 'Tracking apps log data. athleteOS diagnoses it. MFP tells you that you ate 2,400 calories. athleteOS tells you that your protein intake is 34g below what your training load requires, and that your squat-to-deadlift ratio suggests you are leaving 8% strength on the table. It is a diagnostic system, not a journal.',
  },
  {
    q: 'Is my data safe?',
    a: 'Your rank calculation runs entirely in the browser — nothing is sent to our servers unless you explicitly join the waitlist. Waitlist data (name, email, WhatsApp) is stored in a Supabase database hosted in the EU with row-level security. We do not sell or share your data with third parties. Full details in our Privacy Policy.',
  },
]

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isOpen ? 'rgba(255,122,47,0.04)' : 'rgba(255,255,255,0.028)',
        border: `1px solid ${isOpen ? 'rgba(255,122,47,0.20)' : 'rgba(255,255,255,0.09)'}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-5 text-left transition"
      >
        <span className="text-sm font-semibold text-foreground leading-snug">{faq.q}</span>
        <span
          className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isOpen ? 'rgba(255,122,47,0.15)' : 'rgba(255,255,255,0.06)' }}
        >
          {isOpen
            ? <Minus size={11} className="text-accent" />
            : <Plus size={11} className="text-muted-foreground" />
          }
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="pt-4">{faq.a}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i))

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="font-mono-label text-accent mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Questions answered.
          </h2>
          <p className="text-muted-foreground">The ones serious athletes actually ask.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              isOpen={open === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          Still have questions?{' '}
          <a href="https://wa.me/916005109043" className="text-accent hover:underline">
            Message us on WhatsApp
          </a>
          {' '}— we reply within a few hours.
        </motion.p>

      </div>
    </section>
  )
}
