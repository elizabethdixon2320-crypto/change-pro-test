import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getStreakDays, getThisWeekRecords, useStore } from '../store'
import { WORKOUT_LABELS, WORKOUT_THEMES, WorkoutType } from '../types'
import PageWrap from '../components/PageWrap'
import { haptic } from '../haptic'

export default function Records() {
  const records = useStore((s) => s.records)
  const week = getThisWeekRecords(records)
  const streak = getStreakDays(records)

  const countByType = (t: WorkoutType) => week.filter((r) => r.type === t).length

  return (
    <PageWrap>
      <div className="page">
        <div className="flex items-center pt-2">
          <Link to="/" className="ghost-btn" onClick={() => haptic('light')}>
            ← 返回
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-4xl font-black tracking-tight"
        >
          训练记录
        </motion.h1>

        <motion.div
          className="mt-8 grid grid-cols-2 gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
        >
          <StatCard value={week.length} label="本周训练次数" accent="#FF5A1F" />
          <StatCard value={streak} label="连续训练天数" accent="#A3E635" />
        </motion.div>

        <div className="mt-8">
          <div className="text-xs text-white/40 mb-3 tracking-[0.3em] font-bold">本周完成项</div>
          <div className="grid grid-cols-3 gap-3">
            <TypeCard type="run" count={countByType('run')} delay={0.3} />
            <TypeCard type="pull" count={countByType('pull')} delay={0.38} />
            <TypeCard type="squat" count={countByType('squat')} delay={0.46} />
          </div>
        </div>

        <div className="mt-10 pb-4">
          <div className="text-xs text-white/40 mb-3 tracking-[0.3em] font-bold">最近 10 条</div>
          <div className="space-y-2">
            {records.length === 0 && (
              <div className="text-white/30 text-sm py-4">还没有记录，去练一下吧</div>
            )}
            {[...records]
              .reverse()
              .slice(0, 10)
              .map((r, i) => {
                const theme = WORKOUT_THEMES[r.type]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.03 }}
                    className="flex items-center gap-3 border-b border-white/5 py-3"
                  >
                    <div className={`w-1.5 h-8 rounded-full ${theme.bg}`} />
                    <div className="flex-1">
                      <div className="font-bold">{WORKOUT_LABELS[r.type]}</div>
                      <div className="text-xs text-white/40 mt-0.5">
                        {r.date} · {r.duration} min · {feelingLabel(r.feeling)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </div>
    </PageWrap>
  )
}

function feelingLabel(f: string) {
  return f === 'easy' ? '轻松 😌' : f === 'hard' ? '有点累 😮‍💨' : '正常 🙂'
}

function StatCard({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
      className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 relative overflow-hidden"
    >
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-40"
        style={{ background: accent }}
      />
      <div className="relative">
        <div className="text-5xl font-black tabular tracking-tight">{value}</div>
        <div className="mt-2 text-sm text-white/50">{label}</div>
      </div>
    </motion.div>
  )
}

function TypeCard({ type, count, delay }: { type: WorkoutType; count: number; delay: number }) {
  const theme = WORKOUT_THEMES[type]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl p-4 text-center relative overflow-hidden ${count > 0 ? theme.bg : 'bg-white/[0.04] border border-white/10'}`}
    >
      <div className={`text-4xl font-black tabular ${count > 0 ? 'text-black' : 'text-white'}`}>
        {count}
      </div>
      <div className={`text-xs mt-1 font-bold ${count > 0 ? 'text-black/60' : 'text-white/50'}`}>
        {WORKOUT_LABELS[type]}
      </div>
    </motion.div>
  )
}
