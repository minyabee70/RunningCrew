export function getMaxHr(age = 30): number {
  return 220 - age;
}

export function estimateAgeFromHeightWeight(heightCm: number, weightKg: number): number {
  const bmi = weightKg / (heightCm / 100) ** 2;
  if (bmi < 22) return 28;
  if (bmi < 26) return 32;
  return 35;
}

export function getHrZones(heightCm: number, weightKg: number) {
  const age = estimateAgeFromHeightWeight(heightCm, weightKg);
  const max = getMaxHr(age);
  return {
    easy: Math.round(max * 0.6),
    aerobic: Math.round(max * 0.7),
    tempo: Math.round(max * 0.8),
    hard: Math.round(max * 0.9),
    max,
  };
}

export function adjustCadenceThresholds(heightCm: number) {
  const legFactor = heightCm / 175;
  return {
    optimalMin: Math.round(175 * legFactor),
    optimalMax: Math.round(185 * legFactor),
    low: Math.round(155 * legFactor),
  };
}

export function paceStatus(
  paceSecPerKm: number,
  heightCm: number,
  weightKg: number
): 'excellent' | 'good' | 'needs_review' {
  const bmi = weightKg / (heightCm / 100) ** 2;
  const target = bmi < 23 ? 330 : bmi < 27 ? 360 : 390;
  if (paceSecPerKm <= target) return 'excellent';
  if (paceSecPerKm <= target + 60) return 'good';
  return 'needs_review';
}
