'use client'

import { motion } from 'framer-motion'
import { blurUp, clipReveal } from '@/lib/motion'
import { RevealText } from '@/components/landing/RevealText'
import { Smartphone, Zap, Activity } from 'lucide-react'

const BLIND_SPOTS = [
  {
    stream: 'Nutrition',
    problem: '27.3% Protein Deficit',
    detail: 'MyFitnessPal values are consistently lower than the national reference standard for Indian food. You are likely under-eating protein even when your app says "on target."',
    evidence: 'Source: IFCT 2017 vs. MFP data drift in South Asian pulses.',
    color: 'rgba(255,255,255,0.5)',
    Icon: Smartphone,
    delta: '-27.3%',
  },
  {
    stream: 'Training',
    problem: '12.4% CNS Fatigue Trend',
    detail: 'Standard logs only show sets and reps. They miss the "Fatigue Overlap" where a 12% shift in Squat:Deadlift volume ratio predicts a lower-back plateau 4 weeks before failure.',
    evidence: 'Source: RPE Correlation vs. Volume Load Trends.',
    color: 'rgba(255,255,255,0.3)',
    Icon: Activity,
    delta: '12.4%',
  },
  {
    stream: 'Recovery',
    problem: '3-Day Recovery Lag',
    detail: 'Sleep scores and HRV are lagging indicators. They show the crash after it has already started. Metabolic debt shows in Heart Rate Recovery (HRR) 3 days before it impacts HRV.',
    evidence: 'Source: Heart Rate Recovery (HRR) lead time analysis.',
    color: '#2DDC8F',
    Icon: Zap,
    delta: '72hr',
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="relative isolate px-6 py-32 md:px-10 overflow-hidden min-h-[90vh] flex items-center justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(180deg, rgba(9,9,11,0.96) 0%, rgba(9,9,11,0.985) 100%)' }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl relative z-10">
        
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20" />
            <circle cx="500" cy="500" r="300" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 15" />
          </svg>
        </div>

        <div className="mb-12 text-center relative z-10">
          <p className="font-mono-label text-[#a1a1aa] mb-3">The Diagnostic Gap</p>
          <RevealText as="h2" className="text-3xl md:text-5xl font-display font-semibold tracking-[-0.02em] leading-[1.2] text-foreground mb-4">
            <span style={{ background: 'linear-gradient(180deg, #ededed 0%, #a1a1a1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your apps see numbers.<br className="hidden md:block" /> They don&apos;t see the stall.
            </span>
          </RevealText>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You see the numbers, but you miss the correlations that actually cause the stall. Most athletes fail because their inputs are fragmented across three different apps.
          </p>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          
          {/* 1. Fragmented Side (The "Broken" Side) */}
          <div className="flex-1 w-full grid grid-cols-1 gap-4 relative group">
            <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition-opacity bg-[url('https://media.giphy.com/media/oEI9uWUPr97Tq/giphy.gif')] bg-repeat bg-center mix-blend-screen" />
            
            <p className="font-mono-label text-muted-foreground/40 text-center mb-2">Fragmented data (Siloed)</p>
            {BLIND_SPOTS.map(({ stream, problem, detail, evidence, delta, color, Icon }, i) => (
              <motion.div
                key={stream}
                {...blurUp(0.1 * i)}
                className="surface-card p-4 flex flex-col gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
                style={{ borderStyle: 'dashed' }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                      <Icon size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-mono-label text-muted-foreground uppercase tracking-widest">{stream}</p>
                      <p className="text-sm font-semibold text-foreground/70">{problem}</p>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-mono font-bold tracking-tighter uppercase">
                    Error {delta}
                  </div>
                </div>
                <div className="pl-14">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{detail}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono text-foreground/70 bg-white/5 rounded-full px-2.5 py-0.5 border border-white/5">
                      {evidence}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. The Bridge/Transition */}
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-white/40" />
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shadow-[0_0_25px_rgba(45,220,143,0.3)] border border-success/40">
              <Zap size={14} className="text-success fill-success" />
            </div>
            <div className="h-12 w-px bg-gradient-to-t from-transparent via-white/20 to-white/40" />
          </div>

          {/* 3. Unified Side */}
          <div className="flex-1 w-full">
            <p className="font-mono-label text-[#a1a1aa] text-center mb-4">Unified Diagnosis</p>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="surface-card p-8 border-success/30 bg-success/[0.02] shadow-[0_0_40px_rgba(45,220,143,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Activity size={80} className="text-success" />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-foreground mb-4 relative z-10">System Pulse</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 relative z-10">
                AthleteOS connects the dots between your apps to find the one variable actually causing the stall. It correlates your intake, volume, and recovery signals to catch plateaus before they happen.
              </p>
              
              <div className="space-y-4 relative z-10 mb-6">
                <div className="p-3.5 rounded-xl bg-success/5 border border-success/20">
                  <p className="text-xs font-mono-label text-success uppercase mb-2">Sample Correlation</p>
                  <p className="text-sm text-foreground/90 font-medium italic">
                    "Recovery Gap detected: Bench 1RM projected to drop 2.5kg unless intake increases by 40g today."
                  </p>
                </div>
                <div className="space-y-2">
                  {['Real protein vs IFCT 2017', 'CNS fatigue vs Volume Load', 'Metabolic recovery patterns'].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-success/60" />
                      <span className="text-sm text-foreground/90 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome Viz */}
              <div className="relative h-12 w-full bg-white/5 rounded-xl border border-white/10 p-2 flex items-center justify-between">
                <div className="flex items-end gap-1 h-full w-24">
                  {[20, 25, 22, 45, 60, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-accent/40 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono-label text-muted-foreground uppercase">Stall Broken</p>
                  <p className="text-sm font-bold text-success">+8.2kg</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        <motion.p
          {...blurUp(0.4)}
          className="mt-12 text-sm text-center text-muted-foreground/60 font-mono-label italic"
        >
          Break the plateau. One system. One bottleneck. One correction path.
        </motion.p>
      </div>
    </section>
  )
}
