import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './store'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import RunPage from './pages/RunPage'
import PullPage from './pages/PullPage'
import SquatPage from './pages/SquatPage'
import RunTimer from './pages/RunTimer'
import Feedback from './pages/Feedback'
import Records from './pages/Records'
import Settings from './pages/Settings'
import Aurora from './components/Aurora'

function auroraColorsFor(pathname: string): {
  colors: [string, string, string]
  amplitude: number
  blend: number
  speed: number
} {
  if (pathname.startsWith('/run') || pathname.startsWith('/timer/run') || pathname.startsWith('/feedback/run')) {
    return { colors: ['#FF5A1F', '#FFB347', '#FFD36E'], amplitude: 1.2, blend: 0.5, speed: 1.1 }
  }
  if (pathname.startsWith('/pull') || pathname.startsWith('/timer/pull') || pathname.startsWith('/feedback/pull')) {
    return { colors: ['#6366F1', '#C026D3', '#EC4899'], amplitude: 1.2, blend: 0.5, speed: 1.0 }
  }
  if (pathname.startsWith('/squat') || pathname.startsWith('/timer/squat') || pathname.startsWith('/feedback/squat')) {
    return { colors: ['#22D3EE', '#A3E635', '#FDE047'], amplitude: 1.2, blend: 0.5, speed: 1.0 }
  }
  return { colors: ['#3B82F6', '#8B5CF6', '#A3E635'], amplitude: 1.15, blend: 0.5, speed: 0.95 }
}

export default function App() {
  const profile = useStore((s) => s.profile)
  const hasProfile = !!profile
  const location = useLocation()
  const cfg = auroraColorsFor(location.pathname)

  return (
    <>
      <div className="aurora-layer">
        <Aurora
          colorStops={cfg.colors}
          amplitude={cfg.amplitude}
          blend={cfg.blend}
          speed={cfg.speed}
        />
      </div>

      <Routes>
        <Route
          path="/"
          element={hasProfile ? <Home /> : <Navigate to="/onboarding" replace />}
        />
        <Route
          path="/onboarding"
          element={hasProfile ? <Navigate to="/" replace /> : <Onboarding />}
        />
        <Route path="/run" element={<RunPage />} />
        <Route path="/pull" element={<PullPage />} />
        <Route path="/squat" element={<SquatPage />} />
        <Route path="/timer/:type" element={<RunTimer />} />
        <Route path="/feedback/:type" element={<Feedback />} />
        <Route path="/records" element={<Records />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
