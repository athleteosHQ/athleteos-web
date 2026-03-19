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
    q: 'Is the rank calculator free?',
    a: 'Yes. No account, no email, no card. Enter your lifts and get your benchmark rank instantly.',
  },
  {
    q: 'How accurate are the percentiles?',
    a: 'They are calibrated against IPF standards and 3,200+ competitive Indian athlete records. Not perfect, but far more useful than vague labels like beginner or advanced.',
  },
  {
    q: 'Am I being compared against all of India?',
    a: 'No. Your result is not against the general population. It is benchmarked against our competitive Indian strength-athlete dataset in your weight class, using meet-calibrated and athlete-submitted records.',
  },
  {
    q: 'I only train one or two lifts. Can I still use it?',
    a: 'Yes. Leave any lift empty and the system scores what you provide. Three lifts give the strongest benchmark, but partial data still works.',
  },
  {
    q: 'What is the ₹4,999 founding price?',
    a: (
      <>
        <span>It is the lowest annual price athleteOS will ever offer. Founding members join before public launch, keep the founding rate, and get direct access during beta.</span>
        <span className="block mt-2 text-sm" style={{ color: 'var(--accent)' }}>No payment required to reserve. You pay only when you activate.</span>
      </>
    ),
  },
  {
    q: 'Is my data safe?',
    a: 'The rank check runs in your browser. We only store data if you join the waitlist. Waitlist data is in Supabase with row-level security. We do not sell it.',
  },
]

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isOpen ? 'rgba(127,178,255,0.04)' : 'rgba(255,255,255,0.028)',
        border: `1px solid ${isOpen ? 'rgba(127,178,255,0.18)' : 'rgba(255,255,255,0.09)'}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-5 text-left transition"
      >
        <span className="text-base font-semibold text-foreground leading-snug">{faq.q}</span>
        <span
          className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isOpen ? 'rgba(127,178,255,0.14)' : 'rgba(255,255,255,0.06)' }}
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
              className="px-5 pb-5 text-base text-muted-foreground leading-relaxed"
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
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-4xl">

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
          <p className="text-base text-muted-foreground">The ones serious athletes actually ask.</p>
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
          className="mt-8 text-base text-muted-foreground"
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
