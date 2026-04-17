export type HapticStrength = 'light' | 'medium' | 'heavy' | 'success'

const patterns: Record<HapticStrength, number | number[]> = {
  light: 8,
  medium: 15,
  heavy: 30,
  success: [12, 60, 12],
}

export function haptic(strength: HapticStrength = 'light') {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(patterns[strength])
    }
  } catch {
    // ignore
  }
}
