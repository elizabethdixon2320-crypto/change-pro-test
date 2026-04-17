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
      <div
        className="relative w-full flex flex-col px-5 overflow-hidden"
        style={{
          height: '100dvh',
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
          zIndex: 2,
        }}
      >
        <motion.div
          className="flex justify-between items-center shrink-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src="/change-pro.png"
            alt="CHANGE PRO"
            className="h-8 w-auto select-none"
            draggable={false}
          />
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
          className="mt-6 shrink-0 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <h1 className="font-black leading-[1.1] tracking-tight whitespace-nowrap text-[clamp(1.5rem,7vw,2.25rem)]">
            今天你练哪一个？
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 text-sm">
            <span className="text-white/40">今日推荐</span>
            <span
              className={`px-3 py-1 rounded-full font-black text-black text-xs ${WORKOUT_THEMES[next].bg} animate-glow-pulse`}
            >
              {WORKOUT_LABELS[next]}
            </span>
          </div>
        </motion.div>

        <div className="flex-1 min-h-0 flex flex-col gap-3 justify-center py-4">
          {(['run', 'pull', 'squat'] as WorkoutType[]).map((t, i) => (
            <WorkoutCard key={t} type={t} recommended={t === next} delay={0.2 + i * 0.08} />
          ))}
        </div>

        <motion.div
          className="shrink-0 text-center text-[10px] text-white/30 tracking-[0.3em]"
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
      className="flex-1 min-h-0"
    >
      <Link
        to={routeMap[type]}
        onClick={() => haptic('medium')}
        className={`card-button block h-full ${theme.bg} ${recommended ? theme.glow : ''}`}
      >
        <div className="relative h-full px-5 py-4 flex items-center justify-between text-black">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="text-[10px] font-black tracking-[0.3em] opacity-60">
              {WORKOUT_INDEX[type]}
            </div>
            <div className="text-[clamp(1.75rem,7vw,2.25rem)] font-black leading-none tracking-tight">
              {WORKOUT_LABELS[type]}
            </div>
            <div className="text-[11px] font-bold opacity-60 tracking-wider">{meta[type]}</div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <svg
              width="36"
              height="36"
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
              <div className="text-[9px] font-black tracking-widest bg-black/80 text-white px-2 py-0.5 rounded">
                推荐
              </div>
            )}
          </div>
        </div>

        <svg
          className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none"
          width="110"
          height="110"
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
