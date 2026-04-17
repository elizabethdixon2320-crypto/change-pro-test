import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Feeling,
  SystemState,
  UserProfile,
  WorkoutRecord,
  WorkoutType,
  WORKOUT_SEQUENCE,
} from './types'

interface Store {
  profile: UserProfile | null
  system: SystemState
  records: WorkoutRecord[]

  completeOnboarding: (p: Omit<UserProfile, 'user_id' | 'created_at'>) => void
  updateProfile: (p: Partial<UserProfile>) => void
  resetAll: () => void

  getNextWorkoutType: () => WorkoutType
  finishWorkout: (type: WorkoutType, feeling: Feeling, duration: number) => void
}

const initialSystem: SystemState = {
  last_workout_type: null,
  last_workout_date: null,
  current_cycle_index: 0,
}

function todayStr(d: Date = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysSince(dateStr: string | null) {
  if (!dateStr) return Infinity
  const d0 = new Date(dateStr + 'T00:00:00')
  const d1 = new Date(todayStr() + 'T00:00:00')
  return Math.round((d1.getTime() - d0.getTime()) / 86400000)
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      profile: null,
      system: initialSystem,
      records: [],

      completeOnboarding: (p) => {
        set({
          profile: {
            user_id: 'local-' + Math.random().toString(36).slice(2, 10),
            created_at: Date.now(),
            ...p,
          },
          system: initialSystem,
        })
      },

      updateProfile: (p) => {
        const cur = get().profile
        if (!cur) return
        set({ profile: { ...cur, ...p } })
      },

      resetAll: () => {
        set({ profile: null, system: initialSystem, records: [] })
      },

      getNextWorkoutType: () => {
        const { system } = get()
        let idx = system.current_cycle_index
        if (daysSince(system.last_workout_date) > 3) idx = 0
        return WORKOUT_SEQUENCE[idx % 3]
      },

      finishWorkout: (type, feeling, duration) => {
        const today = todayStr()
        const record: WorkoutRecord = {
          date: today,
          type,
          duration,
          completed: true,
          feeling,
          timestamp: Date.now(),
        }
        set((state) => ({
          records: [...state.records, record],
          system: {
            last_workout_type: type,
            last_workout_date: today,
            current_cycle_index: state.system.current_cycle_index + 1,
          },
        }))
      },
    }),
    {
      name: 'change-app-state',
      version: 1,
    },
  ),
)

export function getThisWeekRecords(records: WorkoutRecord[]): WorkoutRecord[] {
  const now = new Date()
  const day = now.getDay() // 0 Sun..6 Sat
  const mondayOffset = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - mondayOffset)
  monday.setHours(0, 0, 0, 0)
  return records.filter((r) => new Date(r.date + 'T00:00:00').getTime() >= monday.getTime())
}

export function getStreakDays(records: WorkoutRecord[]): number {
  if (!records.length) return 0
  const dates = new Set(records.map((r) => r.date))
  let streak = 0
  const cur = new Date()
  cur.setHours(0, 0, 0, 0)
  while (dates.has(todayFrom(cur))) {
    streak++
    cur.setDate(cur.getDate() - 1)
  }
  return streak
}

function todayFrom(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
