import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { WorkoutType } from '../types'
import { WORKOUT_LABELS, WORKOUT_THEMES } from '../types'
import { haptic } from '../haptic'

const RUN_TOTAL_SECONDS = 20 * 60
const RUN_STAGE_SWITCH = 10 * 60

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(Math.max(0, m)).padStart(2, '0')}:${String(Math.max(0, sec)).padStart(2, '0')}`
}

export default function RunTimer() {
  const { type } = useParams<{ type: WorkoutType }>()
  const nav = useNavigate()
  const workoutType = (type || 'run') as WorkoutType
  const isRun = workoutType === 'run'
  const theme = WORKOUT_THEMES[workoutType]

  const [countdown, setCountdown] = useState(3)
  const [started, setStarted] = useState(false)

  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [stageToast, setStageToast] = useState(false)
  const startRef = useRef<number>(0)
  const accumRef = useRef<number>(0)
  const stageAnnouncedRef = useRef<boolean>(false)

  useEffect(() => {
    if (started) return
    if (countdown <= 0) {
      setStarted(true)
      startRef.current = Date.now()
      haptic('success')
      return
    }
    haptic('medium')
    const t = setTimeout(() => setCountdown((c) => c - 1), 800)
    return () => clearTimeout(t)
  }, [countdown, started])

  useEffect(() => {
    if (!started || paused) return
    const id = setInterval(() => {
      const now = Date.now()
      const secs = accumRef.current + Math.floor((now - startRef.current) / 1000)
      setElapsed(secs)

      if (isRun && !stageAnnouncedRef.current && secs >= RUN_STAGE_SWITCH) {
        stageAnnouncedRef.current = true
        setStageToast(true)
        haptic('success')
        beep()
        setTimeout(() => setStageToast(false), 3500)
      }

      if (isRun && secs >= RUN_TOTAL_SECONDS) {
        haptic('success')
        beep(2)
        nav(`/feedback/${workoutType}?duration=${RUN_TOTAL_SECONDS}`, { replace: true })
      }
    }, 250)
    return () => clearInterval(id)
  }, [started, paused, isRun, nav, workoutType])

  const togglePause = () => {
    haptic('medium')
    if (!paused) {
      accumRef.current = accumRef.current + Math.floor((Date.now() - startRef.current) / 1000)
      setPaused(true)
    } else {
      startRef.current = Date.now()
      setPaused(false)
    }
  }

  const finish = () => {
    haptic('heavy')
    if (isRun && elapsed < 30) {
      if (!confirm('训练还没开始多久，确定结束吗？')) return
    }
    nav(`/feedback/${workoutType}?duration=${elapsed}`, { replace: true })
  }

  const remaining = isRun ? RUN_TOTAL_SECONDS - elapsed : elapsed
  const stageLabel = elapsed < RUN_STAGE_SWITCH ? '快走 / 快跑' : '慢跑'
  const progress = isRun ? Math.min(1, elapsed / RUN_TOTAL_SECONDS) : Math.min(1, (elapsed % 60) / 60)

  if (!started) {
    return <Countdown value={countdown} color={theme.ring} />
  }

  return (
    <div className="page relative">
      <div className="flex items-center pt-2 justify-between">
        <div className={`text-[11px] tracking-[0.4em] font-black ${theme.text}`}>
          {WORKOUT_LABELS[workoutType].toUpperCase()}
        </div>
        <button onClick={togglePause} className="ghost-btn">
          {paused ? '继续' : '暂停'}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        {isRun && (
          <motion.div
            key={stageLabel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg font-bold tracking-[0.2em] ${theme.text}`}
          >
            {stageLabel}
          </motion.div>
        )}

        <ProgressRing progress={progress} color={theme.ring} paused={paused}>
          <FlipTime seconds={remaining} />
          {!isRun && (
            <div className="mt-2 text-xs tracking-[0.3em] text-white/40">训练中</div>
          )}
        </ProgressRing>

        {paused ? (
          <div className={`text-lg font-black tracking-widest ${theme.text}`}>已暂停</div>
        ) : (
          <div className="text-xs text-white/30 tracking-[0.3em]">
            {isRun ? `${Math.floor(elapsed / 60)} 分钟已完成` : '随时可按完成'}
          </div>
        )}
      </div>

      <button
        onClick={finish}
        className="w-full rounded-2xl px-6 py-5 text-xl font-black tracking-wider bg-white/10 border border-white/20 text-white active:scale-[0.97] transition-transform"
      >
        {isRun ? '结束训练' : '完成'}
      </button>

      <AnimatePresence>
        {stageToast && (
          <motion.div
            className="absolute left-0 right-0 top-24 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div className="bg-run text-black font-black text-xl px-6 py-3 rounded-xl shadow-[0_8px_32px_rgba(255,90,31,0.6)]">
              进入慢跑阶段 →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Countdown({ value, color }: { value: number; color: string }) {
  const shown = value > 0 ? String(value) : 'GO'
  return (
    <div className="page items-center justify-center">
      <div className="flex-1 flex items-center justify-center relative">
        <motion.div
          key={shown}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="text-[18rem] font-black tabular leading-none"
          style={{ color }}
        >
          {shown}
        </motion.div>
        <div
          className="absolute w-[420px] h-[420px] rounded-full blur-3xl opacity-30 animate-breathe"
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

function ProgressRing({
  progress,
  color,
  paused,
  children,
}: {
  progress: number
  color: string
  paused: boolean
  children: React.ReactNode
}) {
  const size = 300
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - progress)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className={`absolute inset-6 rounded-full blur-3xl opacity-20 ${paused ? '' : 'animate-breathe'}`}
        style={{ background: color }}
      />
      <svg width={size} height={size} className="relative -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s linear', filter: `drop-shadow(0 0 12px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

function FlipTime({ seconds }: { seconds: number }) {
  const text = fmt(seconds)
  return (
    <div className="flex items-center justify-center tabular">
      {text.split('').map((ch, i) => {
        const isColon = ch === ':'
        return (
          <span
            key={i}
            className={`relative inline-block overflow-hidden ${
              isColon ? 'w-5' : 'w-[3.4rem]'
            } h-[5.5rem]`}
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={ch}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center text-[5rem] font-black leading-none tabular"
              >
                {ch}
              </motion.span>
            </AnimatePresence>
          </span>
        )
      })}
    </div>
  )
}

function beep(times: number = 1) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    for (let i = 0; i < times; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.4)
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + i * 0.4 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.4 + 0.3)
      osc.start(ctx.currentTime + i * 0.4)
      osc.stop(ctx.currentTime + i * 0.4 + 0.3)
    }
  } catch {
    // ignore
  }
}
