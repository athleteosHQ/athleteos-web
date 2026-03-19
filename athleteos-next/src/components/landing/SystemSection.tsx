'use client'

import { motion } from 'framer-motion'
import { Activity, Zap, Flame, BarChart2, ChevronRight } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

export function SystemSection() {
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

        {/* Pipeline Visualization */}
        <div className="relative">
          
          {/* Main Flow Grid */}
          <div className="grid gap-12 lg:grid-cols-[1fr_auto_1.2fr] items-center">
            
            {/* 1. INPUTS COLUMN */}
            <div className="space-y-6">
              <p className="font-mono-label text-muted-foreground mb-8 block lg:hidden">Input Layer ↓</p>
              
              {/* Nutrition Node */}
              <motion.div {...fadeUp(0.1)} className="card-surface p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Flame size={48} />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Flame size={20} className="text-accent" />
                  </div>
                  <p className="font-mono-label text-accent">Nutrition</p>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">IFCT-Verified Intake</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Indian food logging grounded in IFCT data.
                </p>
              </motion.div>

              {/* Training Node */}
              <motion.div {...fadeUp(0.2)} className="card-surface p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BarChart2 size={48} />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <BarChart2 size={20} className="text-accent" />
                  </div>
                  <p className="font-mono-label text-accent">Training</p>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Multi-Modal Stress</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Session load, intensity, and accumulated stress.
                </p>
              </motion.div>

              {/* Phase Node */}
              <motion.div {...fadeUp(0.3)} className="card-surface p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Activity size={48} />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Activity size={20} className="text-accent" />
                  </div>
                  <p className="font-mono-label text-accent">Recovery + context</p>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Block Scheduling</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Phase context changes what good progress should look like.
                </p>
              </motion.div>
            </div>

            {/* 2. CONVERGENCE POINT (Connecting Lines) */}
            <div className="hidden lg:flex flex-col items-center justify-center h-full relative px-4">
              <div className="w-px h-[400px] bg-gradient-to-b from-transparent via-white/10 to-transparent absolute" />
              <div className="w-12 h-12 rounded-full border border-accent/30 bg-background flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(255,122,47,0.1)]">
                <Zap size={20} className="text-accent animate-pulse" />
              </div>
              
              {/* Data Flow Pulse - SVG Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '100px' }}>
                <motion.path 
                  d="M 0 150 Q 50 150 100 250" 
                  fill="none" stroke="rgba(255,122,47,0.2)" strokeWidth="1" 
                />
                <motion.circle r="3" fill="var(--accent)">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 0 150 Q 50 150 100 250" />
                </motion.circle>
              </svg>
            </div>

            {/* 3. OUTPUT COLUMN */}
            <div className="relative">
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
