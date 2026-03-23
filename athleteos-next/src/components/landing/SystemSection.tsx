'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Activity, Zap, Flame, BarChart2, ChevronRight } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

export function SystemSection() {
  const prefersReducedMotion = useReducedMotion()

  const inputCards = [
    {
      key: 'nutrition',
      title: 'IFCT-Verified Intake',
      eyebrow: 'Nutrition',
      description: 'Indian food logging grounded in IFCT data.',
      Icon: Flame,
      delay: 0.1,
      funnelClassName: 'lg:mr-14 xl:mr-16',
    },
    {
      key: 'training',
      title: 'Multi-Modal Stress',
      eyebrow: 'Training',
      description: 'Session load, intensity, and accumulated stress.',
      Icon: BarChart2,
      delay: 0.2,
      funnelClassName: 'lg:mr-8 xl:mr-10',
    },
    {
      key: 'recovery',
      title: 'Block Scheduling',
      eyebrow: 'Recovery + context',
      description: 'Phase context changes what good progress should look like.',
      Icon: Activity,
      delay: 0.3,
      funnelClassName: 'lg:mr-2 xl:mr-3',
    },
  ] as const

  return (
    <section id="system" className="relative px-6 py-24 md:px-10 md:py-32 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl aspect-square rounded-full border border-accent/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl">
        <motion.div {...fadeUp(0)} className="mb-16 text-center max-w-3xl mx-auto">
          <p className="font-mono-label text-accent mb-4">How athleteOS diagnoses the stall</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Three inputs. One answer.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Training load, nutrition accuracy, and recovery context point to one likely reason progress is not moving.
          </p>
        </motion.div>

        <div className="space-y-5 md:hidden">
          <div className="grid gap-3">
            {inputCards.map(({ key, title, eyebrow, description, Icon, delay }) => (
              <motion.div
                key={key}
                {...fadeUp(delay)}
                className="card-surface p-5"
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
                  One likely bottleneck. One next move.
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  athleteOS combines those inputs so you stop guessing whether the issue is food, recovery, or training distribution.
                </p>

                <div className="space-y-4">
                  {[
                    'See what is actually limiting progress.',
                    'Know what to change next and what to keep tracking.',
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
                  href="#rank"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-foreground group"
                >
                  <span className="border-b border-accent pb-0.5 transition-all group-hover:border-accent-light">Start your first scan</span>
                  <ArrowRight size={16} className="text-accent transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pipeline Visualization */}
        <div className="relative hidden md:block">
          
          {/* Main Flow Grid */}
          <div className="grid gap-10 lg:gap-6 xl:gap-8 lg:grid-cols-[minmax(0,0.96fr)_88px_minmax(0,1.08fr)] items-center">
            
            {/* 1. INPUTS COLUMN */}
            <div className="space-y-6">
              <p className="font-mono-label text-muted-foreground mb-8 block lg:hidden">Input Layer ↓</p>

              {inputCards.map(({ key, title, eyebrow, description, Icon, delay, funnelClassName }) => (
                <motion.div
                  key={key}
                  {...fadeUp(delay)}
                  className={`card-surface p-6 relative group overflow-hidden lg:ml-auto ${funnelClassName}`}
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

            {/* 2. CONVERGENCE POINT (Connecting Lines) */}
            <div className="hidden lg:flex flex-col items-center justify-center h-full relative">
              <div className="w-px h-[420px] bg-gradient-to-b from-transparent via-white/8 to-transparent absolute" />
              <svg
                className="absolute inset-y-0 left-1/2 h-full -translate-x-1/2 pointer-events-none overflow-visible"
                width="132"
                viewBox="0 0 132 420"
                fill="none"
                aria-hidden="true"
              >
                <path d="M6 90 C 40 90, 46 120, 58 170" stroke="rgba(255,122,47,0.24)" strokeWidth="1.1" />
                <path d="M12 210 C 34 210, 46 210, 58 210" stroke="rgba(255,122,47,0.38)" strokeWidth="1.1" />
                <path d="M18 330 C 42 330, 48 296, 58 250" stroke="rgba(255,122,47,0.24)" strokeWidth="1.1" />
                <motion.path
                  d="M72 210 C 82 210, 92 206, 116 192"
                  stroke="rgba(138,168,255,0.85)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={
                    prefersReducedMotion
                      ? undefined
                      : { pathLength: 1, opacity: [0, 1, 1] }
                  }
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
                {!prefersReducedMotion && (
                  <motion.circle
                    r="3"
                    fill="rgb(138,168,255)"
                    initial={{ opacity: 0, offsetDistance: '0%' }}
                    whileInView={{ opacity: [0, 1, 1, 0], offsetDistance: '100%' }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      offsetPath: "path('M72 210 C 82 210, 92 206, 116 192')",
                    }}
                  />
                )}
              </svg>

              <motion.div
                className="w-12 h-12 rounded-full border border-white/55 bg-background flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(255,122,47,0.08)]"
                initial={prefersReducedMotion ? false : { scale: 0.96 }}
                whileInView={prefersReducedMotion ? undefined : { scale: [0.96, 1, 1] }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Zap size={20} className="text-accent" />
              </motion.div>
            </div>

            {/* 3. OUTPUT COLUMN */}
            <div className="relative lg:-ml-2 xl:-ml-3">
              <p className="font-mono-label text-muted-foreground mb-8 block lg:hidden">Outcome Layer ↓</p>
              
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
                      One likely bottleneck. One next move.
                    </h3>
                    
                    <div className="space-y-8 mb-10">
                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <ChevronRight size={20} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground mb-1">See what is actually limiting progress</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Stop guessing whether the problem is food, recovery, or training distribution.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <ChevronRight size={20} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground mb-1">Know what changes next</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            The output tells you what to adjust next and what to keep tracking.
                          </p>
                        </div>
                      </div>
                    </div>

                    <a 
                      href="#rank" 
                      className="inline-flex items-center gap-2 text-foreground font-bold group"
                    >
                      <span className="pb-0.5 border-b border-accent group-hover:border-accent-light transition-all">Start your first scan</span>
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
