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

  const back = () => {
    if (step === 0) return
    haptic('light')
    setStep(step - 1)
  }

  const canNext =
    (step === 0 && weeklyDays !== null) ||
    (step === 1 && exp !== null) ||
    (step === 2 && pref !== null)

  return (
    <div
      className="relative w-full flex flex-col px-6 overflow-hidden"
      style={{
        height: '100dvh',
        paddingTop: 'max(env(safe-area-inset-top), 16px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
        zIndex: 2,
      }}
    >
      <div className="flex items-center gap-3 pt-1 shrink-0">
        <button
          onClick={back}
          disabled={step === 0}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-opacity ${
            step === 0
              ? 'opacity-0 pointer-events-none border-white/10'
              : 'border-white/20 bg-black/30 backdrop-blur-md active:scale-95'
          }`}
          aria-label="返回上一步"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex gap-1.5 flex-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full bg-run"
                initial={{ width: '0%' }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.35 }}
              />
            </div>
          ))}
        </div>

        <div className="text-[10px] tracking-[0.3em] text-white/40 font-bold">
          {step + 1}/3
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepBlock key={0}>
              <Title>一周能练几天？</Title>
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
              <Title>是否有健身经验？</Title>
              <div className="flex gap-3">
                <Choice label="没有" active={exp === 'none'} onClick={() => { haptic('light'); setExp('none') }} />
                <Choice label="有基础" active={exp === 'basic'} onClick={() => { haptic('light'); setExp('basic') }} />
              </div>
            </StepBlock>
          )}
          {step === 2 && (
            <StepBlock key={2}>
              <Title>更喜欢哪种方式？</Title>
              <div className="flex gap-3">
                <Choice label="跑步" active={pref === 'cardio'} onClick={() => { haptic('light'); setPref('cardio') }} />
                <Choice label="器械" active={pref === 'machine'} onClick={() => { haptic('light'); setPref('machine') }} />
              </div>
            </StepBlock>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 pt-2">
        <button
          disabled={!canNext}
          onClick={next}
          className={`w-full rounded-2xl px-6 py-5 text-xl font-black tracking-wider transition-all active:scale-[0.97] ${
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
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-8"
    >
      {children}
    </motion.div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-center font-black leading-[1.1] tracking-tight whitespace-nowrap text-[clamp(1.75rem,7.5vw,2.5rem)]">
      {children}
    </h1>
  )
}

function Choice({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-2xl py-5 text-lg font-black border-2 transition-all active:scale-[0.96] ${
        active
          ? 'bg-paper text-ink border-paper shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
          : 'border-white/15 text-white/70 bg-black/20 backdrop-blur-sm'
      }`}
    >
      {label}
    </button>
  )
}
