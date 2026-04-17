import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrap from '../components/PageWrap'
import { haptic } from '../haptic'

export default function SquatPage() {
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
            <div className="text-[11px] text-squat font-black tracking-[0.4em]">03 · LOWER</div>
            <h1 className="mt-3 text-6xl font-black tracking-tight leading-none text-squat">
              蹲一下
            </h1>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Hint n="01" text="膝盖方向一致" />
            <Hint n="02" text="下去控制" />
            <Hint n="03" text="上来快" />
          </motion.div>

          <motion.div
            className="text-white/40 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            半蹲 / 深蹲<br />
            3 组 × 10 次，能完整完成的重量即可
          </motion.div>
        </div>
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => {
            haptic('heavy')
            nav('/timer/squat')
          }}
          className="w-full rounded-2xl px-6 py-6 text-2xl font-black tracking-wider bg-squat text-black active:scale-[0.97] transition-transform shadow-[0_8px_32px_rgba(163,230,53,0.4)]"
        >
          开始训练
        </motion.button>
      </div>
    </PageWrap>
  )
}

function Hint({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
      <div className="text-squat text-xl font-black tracking-widest">{n}</div>
      <div className="text-xl font-bold">{text}</div>
    </div>
  )
}
