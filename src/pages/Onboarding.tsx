import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import type { ExperienceLevel, Preference } from '../types'
import { haptic } from '../haptic'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [weeklyDays, setWeeklyDays] = useState<2 | 3 | 4 | null>(null)
  const [exp, setExp] = useState<ExperienceLevel | null>(null)
  const [pref, setPref] = useState<Preference | null>(null)
  const completeOnboarding = useStore((s) => s.completeOnboarding)

  const next = () => {
    haptic('medium')
    if (step < 2) {
      setStep(step + 1)
    } else if (weeklyDays && exp && pref) {
      completeOnboarding({
        weekly_days: weeklyDays,
        experience_level: exp,
        preference: pref,
      })
    }
  }

  const canNext =
    (step === 0 && weeklyDays !== null) ||
    (step === 1 && exp !== null) ||
    (step === 2 && pref !== null)

  return (
    <div className="page justify-between">
      <div className="pt-6">
        <div className="text-[11px] tracking-[0.4em] text-white/50 mb-4 font-bold">CHANGE</div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1 flex-1 rounded-full bg-white/15 overflow-hidden"
            >
              <motion.div
                className="h-full bg-run"
                initial={{ width: '0%' }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.35 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepBlock key={0}>
              <Title>一周能练<br />几天？</Title>
              <div className="flex gap-3">
                {[2, 3, 4].map((n) => (
                  <Choice
                    key={n}
                    label={`${n} 天`}
                    active={weeklyDays === n}
                    onClick={() => {
                      haptic('light')
                      setWeeklyDays(n as 2 | 3 | 4)
                    }}
                  />
                ))}
              </div>
            </StepBlock>
          )}
          {step === 1 && (
            <StepBlock key={1}>
              <Title>是否有<br />健身经验？</Title>
              <div className="flex gap-3">
                <Choice label="没有" active={exp === 'none'} onClick={() => { haptic('light'); setExp('none') }} />
                <Choice label="有基础" active={exp === 'basic'} onClick={() => { haptic('light'); setExp('basic') }} />
              </div>
            </StepBlock>
          )}
          {step === 2 && (
            <StepBlock key={2}>
              <Title>更喜欢<br />哪种方式？</Title>
              <div className="flex gap-3">
                <Choice label="跑步" active={pref === 'cardio'} onClick={() => { haptic('light'); setPref('cardio') }} />
                <Choice label="器械" active={pref === 'machine'} onClick={() => { haptic('light'); setPref('machine') }} />
              </div>
            </StepBlock>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-2">
        <button
          disabled={!canNext}
          onClick={next}
          className={`w-full rounded-2xl px-6 py-6 text-2xl font-black tracking-wider transition-all active:scale-[0.97] ${
            canNext ? 'bg-run text-black shadow-[0_8px_32px_rgba(255,90,31,0.4)]' : 'bg-white/10 text-white/30'
          }`}
        >
          {step < 2 ? '下一步' : '开始训练'}
        </button>
      </div>
    </div>
  )
}

function StepBlock({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8"
    >
      {children}
    </motion.div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-5xl font-black leading-[1.05] tracking-tight">{children}</h1>
}

function Choice({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-2xl py-6 text-xl font-black border-2 transition-all active:scale-[0.96] ${
        active ? 'bg-paper text-ink border-paper' : 'border-white/15 text-white/70'
      }`}
    >
      {label}
    </button>
  )
}
