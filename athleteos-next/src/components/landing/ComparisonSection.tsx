'use client'

import { motion } from 'framer-motion'
import { Check, X, Minus, Zap } from 'lucide-react'

const COMPARISON_DATA = [
  {
    feature: 'Core Focus',
    healthify: 'Weight loss / Casual',
    whoop: 'Recovery / Sleep',
    athleteos: 'Performance Diagnosis',
  },
  {
    feature: 'Food Data Accuracy',
    healthify: 'Crowdsourced (High error)',
    whoop: 'N/A',
    athleteos: 'IFCT-Verified (Scientific)',
  },
  {
    feature: 'Training Context',
    healthify: 'Generic workout log',
    whoop: 'Cardio strain focus',
    athleteos: 'Strength block aware',
  },
  {
    feature: 'Plateau Analysis',
    healthify: false,
    whoop: 'Generic "Take it easy"',
    athleteos: 'Specific variable isolation',
  },
  {
    feature: 'The Outcome',
    healthify: 'Estimated calorie burn',
    whoop: 'Vague readiness score',
    athleteos: 'Actionable diagnostic fix',
  },
]

export function ComparisonSection() {
  return (
    <section id="comparison" className="px-6 py-24 md:px-10 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="font-mono-label text-accent mb-4">THE_LANDSCAPE</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            Standard apps track data.<br/>AthleteOS solves plateaus.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop using tools built for weight loss to manage elite performance. 
            There is a reason your progress is stuck despite tracking everything.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="relative overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-6 md:p-8 text-sm font-bold text-muted-foreground/50 uppercase tracking-widest font-mono-label">Capability</th>
                <th className="p-6 md:p-8 text-center bg-white/[0.02]">
                  <p className="text-lg font-bold text-foreground/60 mb-1">HealthifyMe</p>
                  <span className="text-[10px] font-mono-label text-muted-foreground/40">Mass Market</span>
                </th>
                <th className="p-6 md:p-8 text-center bg-white/[0.03]">
                  <p className="text-lg font-bold text-foreground/60 mb-1">Whoop</p>
                  <span className="text-[10px] font-mono-label text-muted-foreground/40">Wearable focus</span>
                </th>
                <th className="p-6 md:p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent/10 -z-10" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap size={16} className="text-accent fill-accent" />
                    <p className="text-lg font-bold text-foreground">athleteOS</p>
                  </div>
                  <span className="text-[10px] font-mono-label text-accent/80 tracking-widest">Diagnostic Engine</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={row.feature} className={idx < COMPARISON_DATA.length - 1 ? "border-b border-white/5" : ""}>
                  <td className="p-6 md:p-8 font-semibold text-foreground/90 text-base">{row.feature}</td>
                  
                  {/* Healthify column */}
                  <td className="p-6 md:p-8 text-center bg-white/[0.01]">
                    {typeof row.healthify === 'string' ? (
                      <span className="text-sm text-muted-foreground/60 leading-relaxed">{row.healthify}</span>
                    ) : row.healthify ? (
                      <Check className="mx-auto text-muted-foreground/30" size={20} />
                    ) : (
                      <X className="mx-auto text-destructive/40" size={20} />
                    )}
                  </td>

                  {/* Whoop column */}
                  <td className="p-6 md:p-8 text-center bg-white/[0.02]">
                    {typeof row.whoop === 'string' ? (
                      <span className="text-sm text-muted-foreground/60 leading-relaxed">{row.whoop}</span>
                    ) : row.whoop ? (
                      <Check className="mx-auto text-muted-foreground/30" size={20} />
                    ) : (
                      <Minus className="mx-auto text-muted-foreground/20" size={20} />
                    )}
                  </td>

                  {/* athleteOS column */}
                  <td className="p-6 md:p-8 text-center relative">
                    <div className="absolute inset-0 bg-accent/[0.03] -z-10" />
                    {typeof row.athleteos === 'string' ? (
                      <span className={`text-sm font-bold ${idx === COMPARISON_DATA.length - 1 ? 'text-accent' : 'text-foreground'}`}>
                        {row.athleteos}
                      </span>
                    ) : (
                      <Check className="mx-auto text-accent shadow-[0_0_15px_rgba(255,122,47,0.4)]" size={24} strokeWidth={3} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Closing trust kicker */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 text-center font-mono-label text-[11px] text-muted-foreground/40 tracking-[0.2em]"
        >
          NOT_FOR_CASUALS · BUILT_FOR_PERFORMANCE
        </motion.p>

      </div>
    </section>
  )
}
