import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrap from '../components/PageWrap'
import { haptic } from '../haptic'

export default function RunPage() {
  const nav = useNavigate()
  return (
    <PageWrap>
      <div className="page">
        <div className="flex items-center pt-2">
          <Link to="/" className="ghost-btn" onClick={() => haptic('light')}>
            ← 返回
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-[11px] text-run font-black tracking-[0.4em]">01 · CARDIO</div>
            <h1 className="mt-3 text-6xl font-black tracking-tight leading-none text-run">
              跑一下
            </h1>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Stage time="10'" label="快走 / 快跑" color="bg-run" />
            <Stage time="10'" label="慢跑" color="bg-run-light" />
          </motion.div>

          <motion.div
            className="text-white/40 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            20 分钟 · 心肺基础训练<br />
            不追求快，追求你今天做到了
          </motion.div>
        </div>
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => {
            haptic('heavy')
            nav('/timer/run')
          }}
          className="w-full rounded-2xl px-6 py-6 text-2xl font-black tracking-wider bg-run text-black active:scale-[0.97] transition-transform shadow-[0_8px_32px_rgba(255,90,31,0.4)]"
        >
          开始训练
        </motion.button>
      </div>
    </PageWrap>
  )
}

function Stage({ time, label, color }: { time: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
      <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center text-black font-black text-lg shrink-0`}>
        {time}
      </div>
      <div className="text-xl font-bold">{label}</div>
    </div>
  )
}
