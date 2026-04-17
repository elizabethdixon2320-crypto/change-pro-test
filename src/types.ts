export type WorkoutType = 'run' | 'pull' | 'squat'

export type ExperienceLevel = 'none' | 'basic'
export type Preference = 'cardio' | 'machine'
export type Feeling = 'easy' | 'normal' | 'hard'

export interface UserProfile {
  user_id: string
  weekly_days: 2 | 3 | 4
  experience_level: ExperienceLevel
  preference: Preference
  created_at: number
}

export interface WorkoutRecord {
  date: string
  type: WorkoutType
  duration: number
  completed: boolean
  feeling: Feeling
  timestamp: number
}

export interface SystemState {
  last_workout_type: WorkoutType | null
  last_workout_date: string | null
  current_cycle_index: number
}

export const WORKOUT_SEQUENCE: WorkoutType[] = ['run', 'pull', 'squat']

export const WORKOUT_LABELS: Record<WorkoutType, string> = {
  run: '跑一下',
  pull: '拉一下',
  squat: '蹲一下',
}

export const WORKOUT_SUBTITLES: Record<WorkoutType, string> = {
  run: '心肺 · 20 分钟',
  pull: '上肢 · 引体向上',
  squat: '下肢 · 深蹲',
}

export const WORKOUT_THEMES: Record<
  WorkoutType,
  { bg: string; bgLight: string; text: string; ring: string; glow: string }
> = {
  run: {
    bg: 'bg-run',
    bgLight: 'bg-run-light',
    text: 'text-run',
    ring: '#FF5A1F',
    glow: 'shadow-[0_0_60px_rgba(255,90,31,0.5)]',
  },
  pull: {
    bg: 'bg-pull',
    bgLight: 'bg-pull-light',
    text: 'text-pull',
    ring: '#8B5CF6',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.5)]',
  },
  squat: {
    bg: 'bg-squat',
    bgLight: 'bg-squat-light',
    text: 'text-squat',
    ring: '#A3E635',
    glow: 'shadow-[0_0_60px_rgba(163,230,53,0.5)]',
  },
}

export const WORKOUT_INDEX: Record<WorkoutType, string> = {
  run: '01',
  pull: '02',
  squat: '03',
}
