'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { EASE_OUT, useHeadingParallax, staggerContainer, staggerItem } from '@/lib/motion'
import { trackEvent } from '@/lib/analytics'

interface FAQ {
  q: string
  a: string | React.ReactNode
}

const FAQS: FAQ[] = [
  {
    q: 'Who is athleteOS for?',
    a: 'Self-coached lifters with 1–3 years of training who are strong enough to plateau, but not experienced enough to diagnose the plateau clearly.',
  },
  {
    q: 'Is the baseline read free?',
    a: 'Yes. No account, no email, no card. Enter your lifts and get your first system read instantly.',
  },
  {
    q: 'How accurate are the percentiles?',
    a: 'They are calibrated against competition standards and 3,200+ competitive athlete records. Not perfect, but far more useful than vague labels like beginner or advanced.',
  },
  {
    q: 'Who am I being compared against?',
    a: 'Not the general population. Your result is benchmarked against competitive strength athletes in your weight class, using meet-calibrated and athlete-submitted records.',
  },
  {
    q: 'I only train one or two lifts. Can I still use it?',
    a: 'Yes. Leave any lift empty and the system scores what you provide. Three lifts give the strongest benchmark, but partial data still works.',
  },
  {
    q: 'What does founding membership cost?',
    a: (
      <>
        <span>Founding members lock in ₹2,999/year (₹250/month) — 58% off the regular ₹599/month. No payment is required now — you pay only when the product activates.</span>
        <span className="block mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.15)' }}>Your founding rate is locked forever. When pricing goes up, yours stays.</span>
      </>
    ),
  },
  {
    q: 'How is athleteOS different from HealthifyMe or Whoop?',
    a: (
      <>
        <span className="block mb-3">Those are tracking apps. AthleteOS is a diagnosis system. The difference: they show you data, we tell you what it means.</span>
        <span className="block mb-2"><span className="font-semibold text-foreground">HealthifyMe</span> — tracks calories for weight loss. Crowdsourced food data. No training context. No plateau analysis.</span>
        <span className="block mb-2"><span className="font-semibold text-foreground">Whoop</span> — tracks recovery and sleep. Cardio-biased strain score. No strength programming awareness.</span>
        <span className="block"><span className="font-semibold text-[#fafafa]">athleteOS</span> — reads training, nutrition, and recovery together. One platform, all input streams, one diagnosis. Tells you what&apos;s limiting progress and what to change next. Built for serious strength athletes, not weekend gym-goers.</span>
      </>
    ),
  },
  {
    q: 'Is my data safe?',
    a: 'The baseline read runs in your browser. We only store data if you join the waitlist. Waitlist data is in Supabase with row-level security. We do not sell it.',
  },
]

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="surface-card-muted rounded-xl overflow-hidden transition-all"
      style={{ borderColor: isOpen ? 'rgba(255,255,255,0.1)' : undefined }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 p-5 text-left transition"
      >
        <span className="text-base font-semibold text-foreground leading-snug">{faq.q}</span>
        <span
          className="flex-shrink-0 mt-0.5 w-9 h-9 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isOpen ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)' }}
        >
          {isOpen
            ? <Minus size={13} className="text-[#fafafa]" />
            : <Plus size={13} className="text-muted-foreground" />
          }
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
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
  const [open, setOpen] = useState<number | null>(null)
  const parallax = useHeadingParallax()

  const toggle = (i: number) => {
    const isOpening = open !== i
    if (isOpening) {
      trackEvent('faq_item_toggled', {
        question_index: i,
        question_text: FAQS[i].q.slice(0, 50),
      })
    }
    setOpen(prev => (prev === i ? null : i))
  }

  return (
    <section id="faq" className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-4xl">

        <motion.div
          ref={parallax.ref}
          style={parallax.style}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <motion.p variants={staggerItem} className="font-mono-label text-[#fafafa] mb-3">FAQ</motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Questions answered.
          </motion.h2>
          <motion.p variants={staggerItem} className="text-base text-muted-foreground">The ones serious athletes actually ask.</motion.p>
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
          <a href="https://wa.me/916005109043" className="text-[#fafafa] hover:underline">
            Message us on WhatsApp
          </a>
          {' '}— we reply within a few hours.
        </motion.p>

      </div>
    </section>
  )
}
