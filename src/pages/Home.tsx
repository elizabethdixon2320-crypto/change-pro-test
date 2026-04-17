import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { WORKOUT_LABELS, WORKOUT_INDEX, WORKOUT_THEMES, WorkoutType } from '../types'
import { haptic } from '../haptic'
import PageWrap from '../components/PageWrap'

export default function Home() {
  const next = useStore((s) => s.getNextWorkoutType())

  return (
    <PageWrap>
      <div className="page">
        <motion.div
          className="flex justify-between items-center pt-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-[11px] tracking-[0.4em] text-white/50 font-bold">CHANGE</div>
          <div className="flex gap-2">
            <Link to="/records" className="ghost-btn" onClick={() => haptic('light')}>
              记录
            </Link>
            <Link to="/settings" className="ghost-btn" onClick={() => haptic('light')}>
              设置
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-[2.75rem] font-black leading-[1.05] tracking-tight">
            今天你练<br />哪一个？
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 text-sm">
            <span className="text-white/40">今日推荐</span>
            <span
              className={`px-3 py-1 rounded-full font-black text-black ${WORKOUT_THEMES[next].bg} animate-glow-pulse`}
            >
              {WORKOUT_LABELS[next]}
            </span>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col gap-3 justify-center">
          {(['run', 'pull', 'squat'] as WorkoutType[]).map((t, i) => (
            <WorkoutCard key={t} type={t} recommended={t === next} delay={0.2 + i * 0.08} />
          ))}
        </div>

        <motion.div
          className="pt-4 pb-2 text-center text-xs text-white/30 tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          三件事 · 够用一辈子
        </motion.div>
      </div>
    </PageWrap>
  )
}

function WorkoutCard({
  type,
  recommended,
  delay,
}: {
  type: WorkoutType
  recommended: boolean
  delay: number
}) {
  const theme = WORKOUT_THEMES[type]
  const routeMap: Record<WorkoutType, string> = { run: '/run', pull: '/pull', squat: '/squat' }

  const meta: Record<WorkoutType, string> = {
    run: '20 MIN · 心肺',
    pull: '3×8 · 上肢',
    squat: '3×10 · 下肢',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={routeMap[type]}
        onClick={() => haptic('medium')}
        className={`card-button block ${theme.bg} ${recommended ? theme.glow : ''}`}
      >
        <div className="relative p-6 flex items-center justify-between text-black">
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-black tracking-[0.3em] opacity-60">
              {WORKOUT_INDEX[type]}
            </div>
            <div className="text-[2.4rem] font-black leading-none tracking-tight">
              {WORKOUT_LABELS[type]}
            </div>
            <div className="text-xs font-bold opacity-60 tracking-wider mt-1">{meta[type]}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              className="opacity-90"
              fill="none"
            >
              <circle cx="22" cy="22" r="21" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <path
                d="M18 14L26 22L18 30"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {recommended && (
              <div className="text-[10px] font-black tracking-widest bg-black/80 text-white px-2 py-0.5 rounded">
                推荐
              </div>
            )}
          </div>
        </div>

        <svg
          className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none"
          width="160"
          height="160"
          viewBox="0 0 160 160"
          fill="none"
        >
          <circle cx="80" cy="80" r="78" stroke="black" strokeWidth="2" />
          <circle cx="80" cy="80" r="56" stroke="black" strokeWidth="2" />
          <circle cx="80" cy="80" r="34" stroke="black" strokeWidth="2" />
        </svg>
      </Link>
    </motion.div>
  )
}
