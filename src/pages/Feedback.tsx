import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import type { Feeling, WorkoutType } from '../types'
import { WORKOUT_LABELS, WORKOUT_THEMES } from '../types'
import { haptic } from '../haptic'

export default function Feedback() {
  const { type } = useParams<{ type: WorkoutType }>()
  const [params] = useSearchParams()
  const durationFromUrl = Number(params.get('duration') || 0)
  const [feeling, setFeeling] = useState<Feeling | null>(null)
  const finishWorkout = useStore((s) => s.finishWorkout)
  const nav = useNavigate()
  const workoutType = (type || 'run') as WorkoutType
  const theme = WORKOUT_THEMES[workoutType]

  useEffect(() => {
    haptic('success')
  }, [])

  const submit = () => {
    if (!feeling) return
    haptic('heavy')
    finishWorkout(workoutType, feeling, Math.max(0, Math.round(durationFromUrl / 60)))
    nav('/', { replace: true })
  }

  return (
    <div className="page relative overflow-hidden">
      <Confetti color={theme.ring} />

      <div className="pt-2 text-[11px] tracking-[0.4em] text-white/40 font-bold">CHANGE</div>

      <div className="flex-1 flex flex-col justify-center gap-10 relative z-10">
        <div className="flex flex-col items-start gap-5">
          <CheckMark color={theme.ring} />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className={`text-sm font-black tracking-[0.3em] ${theme.text}`}>
              {WORKOUT_LABELS[workoutType].toUpperCase()} · 完成
            </div>
            <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight">
              感觉<br />怎么样？
            </h1>
          </motion.div>
        </div>

        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FeelingBtn
            label="轻松"
            emoji="😌"
            active={feeling === 'easy'}
            onClick={() => {
              haptic('light')
              setFeeling('easy')
            }}
          />
          <FeelingBtn
            label="正常"
            emoji="🙂"
            active={feeling === 'normal'}
            onClick={() => {
              haptic('light')
              setFeeling('normal')
            }}
          />
          <FeelingBtn
            label="有点累"
            emoji="😮‍💨"
            active={feeling === 'hard'}
            onClick={() => {
              haptic('light')
              setFeeling('hard')
            }}
          />
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        disabled={!feeling}
        onClick={submit}
        className={`primary-btn ${feeling ? '' : 'opacity-30'}`}
      >
        完成记录
      </motion.button>
    </div>
  )
}

function FeelingBtn({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string
  emoji: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-2xl py-7 px-2 text-lg font-black border-2 transition-all active:scale-[0.96] flex flex-col items-center gap-2 ${
        active ? 'bg-paper text-ink border-paper scale-[1.02]' : 'border-white/15 text-white/70'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

function CheckMark({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{ background: color, boxShadow: `0 0 40px ${color}80` }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <motion.path
          d="M10 22 L20 32 L34 14"
          stroke="black"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  )
}

function Confetti({ color }: { color: string }) {
  const pieces = Array.from({ length: 24 })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.5
        const duration = 1.4 + Math.random() * 1.2
        const size = 4 + Math.random() * 6
        const rotate = Math.random() * 360
        const c = [color, '#ffffff', '#ffffff'][i % 3]
        return (
          <motion.span
            key={i}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{ y: '120vh', opacity: [0, 1, 1, 0], rotate }}
            transition={{ delay, duration, ease: 'easeIn' }}
            className="absolute block rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              background: c,
            }}
          />
        )
      })}
    </div>
  )
}
