/**
 * Centralized utility for calculating percentiles.
 * Ensures no duplicate percentile logic exists across the application.
 */

export const PERCENTILE_THRESHOLDS = {
  P99: 1000,
  P90: 1500,
  P75: 1900,
  P50: 4700,
  P1: 10000
};

/**
 * Estimates a sustainability percentile rank based on the user's footprint.
 * A higher percentile (e.g., 99) means a better (lower) carbon footprint.
 * 
 * @param footprint The user's annual carbon footprint in kg CO₂/year
 * @returns An integer representing the percentile rank (1 to 99)
 */
export function calculatePercentileEstimate(footprint: number): number {
  if (footprint <= PERCENTILE_THRESHOLDS.P99) return 99;
  
  if (footprint <= PERCENTILE_THRESHOLDS.P90) {
    return Math.round(99 - ((footprint - PERCENTILE_THRESHOLDS.P99) / (PERCENTILE_THRESHOLDS.P90 - PERCENTILE_THRESHOLDS.P99)) * 9);
  }
  
  if (footprint <= PERCENTILE_THRESHOLDS.P75) {
    return Math.round(90 - ((footprint - PERCENTILE_THRESHOLDS.P90) / (PERCENTILE_THRESHOLDS.P75 - PERCENTILE_THRESHOLDS.P90)) * 15);
  }
  
  if (footprint <= PERCENTILE_THRESHOLDS.P50) {
    return Math.round(75 - ((footprint - PERCENTILE_THRESHOLDS.P75) / (PERCENTILE_THRESHOLDS.P50 - PERCENTILE_THRESHOLDS.P75)) * 25);
  }
  
  if (footprint <= PERCENTILE_THRESHOLDS.P1) {
    return Math.max(1, Math.round(50 - ((footprint - PERCENTILE_THRESHOLDS.P50) / (PERCENTILE_THRESHOLDS.P1 - PERCENTILE_THRESHOLDS.P50)) * 49));
  }
  
  return 1;
}

/**
 * Calculates empirical percentile against an array of scores.
 * 
 * @param userScore The user's score to rank
 * @param allScores Array of all scores to compare against
 * @returns Empirical percentile (0 to 100)
 */
export function calculateEmpiricalPercentile(userScore: number, allScores: number[]): number {
  if (allScores.length === 0) return 100;
  const scoresBelow = allScores.filter(s => s < userScore).length;
  return Math.round((scoresBelow / allScores.length) * 100);
}
