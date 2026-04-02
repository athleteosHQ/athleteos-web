'use client'

import { motion } from 'framer-motion'
import { Activity, Flame, BarChart2, ChevronRight, Zap, Check } from 'lucide-react'
import { fadeUp, blurUp, clipReveal, useHeadingParallax, staggerContainer, staggerItem } from '@/lib/motion'
import { trackEvent } from '@/lib/analytics'

export function SystemSection() {
  const parallax = useHeadingParallax()
  const inputCards = [
    {
      key: 'rank',
      title: 'Competitive Rank',
      eyebrow: 'Step 1',
      description: 'See where your lifts land against athletes in your weight class. Identify which lift is the gap.',
      Icon: Flame,
      delay: 0.1,
      funnelClassName: '',
    },
    {
      key: 'isolate',
      title: 'Bottleneck Isolation',
      eyebrow: 'Step 2',
      description: 'Training, nutrition, and recovery data read together to identify the one variable limiting progress.',
      Icon: BarChart2,
      delay: 0.2,
      funnelClassName: '',
    },
    {
      key: 'correct',
      title: 'Correction + Tracking',
      eyebrow: 'Step 3',
      description: 'One specific change to make. One metric to track. Re-read after each block to verify the fix landed.',
      Icon: Activity,
      delay: 0.3,
      funnelClassName: '',
    },
  ] as const

  return (
    <section id="system" className="relative px-6 py-24 md:px-10 md:py-32 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl aspect-square rounded-full border border-accent/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl">
        <motion.div
          ref={parallax.ref}
          style={parallax.style}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <motion.p variants={staggerItem} className="font-mono-label text-[#a1a1aa] mb-4">How athleteOS diagnoses the stall</motion.p>
          <motion.h2
            variants={{
              hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
              visible: { clipPath: 'inset(0 0% 0 0)', opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-4xl md:text-5xl font-display font-semibold tracking-[-0.02em] leading-[1.2] text-foreground mb-6"
          >
            <span style={{ background: 'linear-gradient(180deg, #ededed 0%, #a1a1a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Baseline. Limiter. Correction. Outcome.
            </span>
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-muted-foreground leading-relaxed">
            Most apps track one thing well. AthleteOS reads training, nutrition, and recovery as connected inputs — then identifies what is actually limiting progress across all three.
          </motion.p>
        </motion.div>

        {/* Pipeline Visualization */}
        <div className="relative z-10 mx-auto max-w-4xl mt-12 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            
            {/* Step 1: Inputs */}
            <div className="flex-1 w-full text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:border-white/10 transition-colors">
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Activity size={20} className="text-accent" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Flame size={20} className="#F59E0B" style={{ color: '#F59E0B' }} />
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <BarChart2 size={20} className="#2DDC8F" style={{ color: '#2DDC8F' }} />
                </div>
              </div>
              <p className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest mb-1">Step 1</p>
              <h4 className="text-base font-bold text-foreground">Live Input Streams</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">Training, nutrition, and recovery signals read in real-time.</p>
            </div>

            {/* Connector */}
            <div className="hidden md:flex flex-col items-center justify-center px-4">
              <div className="h-px w-8 bg-white/10" />
            </div>

            {/* Step 2: The Core */}
            <div className="flex-shrink-0 w-32 h-32 rounded-full bg-accent/10 border border-accent/20 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(107,122,237,0.05)] group">
              <Zap size={32} className="text-white fill-white mb-1" />
              <p className="font-mono-label text-[10px] text-accent font-bold">Signal Fusion</p>
            </div>

            {/* Connector */}
            <div className="hidden md:flex flex-col items-center justify-center px-4">
              <div className="h-px w-8 bg-white/10" />
            </div>

            {/* Step 3: Output */}
            <div className="flex-1 w-full text-center p-6 rounded-2xl bg-accent/[0.03] border border-accent/20 relative group hover:border-accent/30 transition-colors">
              <div className="w-12 h-16 bg-[#0B1118] border border-white/10 rounded-md mx-auto mb-4 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="w-8 h-1 bg-accent/40 rounded-full mb-1" />
                <div className="w-6 h-1 bg-accent/20 rounded-full mb-3" />
                <div className="w-4 h-4 rounded-full bg-success/20 border border-success/40 flex items-center justify-center">
                  <Check size={8} className="text-success" />
                </div>
              </div>
              <p className="font-mono-label text-xs text-accent uppercase tracking-widest mb-1">Step 3</p>
              <h4 className="text-base font-bold text-foreground">Diagnostic Read</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">One bottleneck identified. One specific correction to track.</p>
            </div>

          </div>
        </div>

        {/* Existing Content Container */}
        <div className="space-y-5 md:hidden">
          <div className="grid gap-3">
            {inputCards.map(({ key, title, eyebrow, description, Icon, delay }) => (
              <motion.div
                key={key}
                {...blurUp(delay)}
                className="surface-card p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-mono-label text-accent">{eyebrow}</p>
                    <h3 className="text-base font-bold text-foreground">{title}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp(0.4)}
            className="rounded-3xl p-1 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
            style={{ background: 'linear-gradient(to bottom right, rgba(255,122,47,0.18), rgba(255,255,255,0.05), transparent)' }}
          >
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] border border-white/5 bg-[#0B1118] p-6">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="font-mono-label text-[10px] text-accent">Diagnosis output</span>
                </div>

                <h3 className="mb-3 text-2xl font-display font-bold text-foreground">
                  The output is a decision, not a dashboard.
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  athleteOS doesn&apos;t give you more data to interpret. It tells you what&apos;s limiting progress and what to change next.
                </p>

                <div className="space-y-4">
                  {[
                    'One bottleneck identified with confidence score',
                    'One correction path with a projected outcome to track',
                  ].map((item) => (
                    <div key={item} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
                        <ChevronRight size={18} className="text-accent" />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="#inline-signup-gate"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-foreground group"
                  onClick={() => trackEvent('cta_clicked', { cta_source: 'system_section', cta_text: 'Reserve My Diagnosis', has_rank_result: false })}
                >
                  <span className="border-b border-accent pb-0.5 transition-all group-hover:border-accent-light">Reserve My Diagnosis</span>
                  <ArrowRight size={16} className="text-accent transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pipeline Visualization */}
        <div className="relative hidden md:block">
          
          {/* Main Flow Grid */}
          <div className="grid gap-10 lg:gap-8 xl:gap-10 lg:grid-cols-2 items-center">
            
            {/* 1. INPUTS COLUMN */}
            <div className="space-y-6">
              <p className="font-mono-label text-muted-foreground mb-8 block lg:hidden">Diagnostic steps ↓</p>

              {inputCards.map(({ key, title, eyebrow, description, Icon, delay, funnelClassName }) => (
                <motion.div
                  key={key}
                  {...blurUp(delay)}
                  className={`surface-card p-6 relative group overflow-hidden lg:ml-auto ${funnelClassName}`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon size={48} />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Icon size={20} className="text-accent" />
                    </div>
                    <p className="font-mono-label text-accent">{eyebrow}</p>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </div>

            {/* 2. OUTPUT COLUMN */}
            <div className="relative">
              <p className="font-mono-label text-muted-foreground mb-8 block lg:hidden">What you get ↓</p>
              
              <motion.div 
                {...fadeUp(0.4)} 
                className="relative rounded-3xl p-1 bg-gradient-to-br from-accent/20 via-white/5 to-transparent shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
              >
                <div className="bg-[#0B1118] rounded-[calc(1.5rem-1px)] p-8 md:p-10 border border-white/5 overflow-hidden relative">
                  
                  {/* Visual Background Accent */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 blur-3xl rounded-full" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="font-mono-label text-accent text-[10px]">Diagnosis output</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
                      The output is a decision, not a dashboard.
                    </h3>

                    <div className="space-y-8 mb-10">
                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <ChevronRight size={20} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground mb-1">One bottleneck identified with confidence score</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            athleteOS doesn&apos;t give you more data to interpret. It tells you what&apos;s limiting progress and what to change next.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <ChevronRight size={20} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground mb-1">One correction path with a projected outcome to track</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            One specific change to make. One metric to watch. Re-read after each block to verify the fix landed.
                          </p>
                        </div>
                      </div>
                    </div>

                    <a
                      href="#inline-signup-gate"
                      className="inline-flex items-center gap-2 text-foreground font-bold group"
                      onClick={() => trackEvent('cta_clicked', { cta_source: 'system_section', cta_text: 'Reserve My Diagnosis', has_rank_result: false })}
                    >
                      <span className="pb-0.5 border-b border-accent group-hover:border-accent-light transition-all">Reserve My Diagnosis</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-accent" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

function ArrowRight({ size = 20, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
