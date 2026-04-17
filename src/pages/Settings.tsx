import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import PageWrap from '../components/PageWrap'
import { haptic } from '../haptic'

export default function Settings() {
  const profile = useStore((s) => s.profile)
  const updateProfile = useStore((s) => s.updateProfile)
  const resetAll = useStore((s) => s.resetAll)
  const nav = useNavigate()

  if (!profile) return null

  const change = <T,>(fn: () => void) => {
    haptic('light')
    fn()
  }

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
          设置
        </motion.h1>

        <div className="mt-10 space-y-8">
          <Row label="每周训练天数" delay={0.1}>
            <div className="flex gap-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => change(() => updateProfile({ weekly_days: n as 2 | 3 | 4 }))}
                  className={`pill ${profile.weekly_days === n ? 'pill-active' : ''}`}
                >
                  {n} 天
                </button>
              ))}
            </div>
          </Row>

          <Row label="训练偏好" delay={0.18}>
            <div className="flex gap-2">
              <button
                onClick={() => change(() => updateProfile({ preference: 'cardio' }))}
                className={`pill ${profile.preference === 'cardio' ? 'pill-active' : ''}`}
              >
                跑步
              </button>
              <button
                onClick={() => change(() => updateProfile({ preference: 'machine' }))}
                className={`pill ${profile.preference === 'machine' ? 'pill-active' : ''}`}
              >
                器械
              </button>
            </div>
          </Row>

          <Row label="经验" delay={0.26}>
            <div className="flex gap-2">
              <button
                onClick={() => change(() => updateProfile({ experience_level: 'none' }))}
                className={`pill ${profile.experience_level === 'none' ? 'pill-active' : ''}`}
              >
                无
              </button>
              <button
                onClick={() => change(() => updateProfile({ experience_level: 'basic' }))}
                className={`pill ${profile.experience_level === 'basic' ? 'pill-active' : ''}`}
              >
                基础
              </button>
            </div>
          </Row>
        </div>

        <div className="flex-1" />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            haptic('heavy')
            if (confirm('确定清空所有数据？（个人资料和训练记录都会被删除）')) {
              resetAll()
              nav('/onboarding', { replace: true })
            }
          }}
          className="w-full rounded-2xl py-4 text-base font-bold border border-red-500/30 text-red-400 active:scale-[0.97] transition-transform"
        >
          清空所有数据
        </motion.button>
      </div>
    </PageWrap>
  )
}

function Row({
  label,
  children,
  delay,
}: {
  label: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="text-xs text-white/40 mb-3 tracking-[0.3em] font-bold">{label}</div>
      {children}
    </motion.div>
  )
}
