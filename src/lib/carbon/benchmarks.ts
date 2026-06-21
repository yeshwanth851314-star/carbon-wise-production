import {
  AVERAGE_INDIAN,
  AVERAGE_GLOBAL,
  SUSTAINABLE_TARGET,
  TIERS
} from "../constants/benchmarks";

export { AVERAGE_INDIAN, AVERAGE_GLOBAL, SUSTAINABLE_TARGET, TIERS };

export interface BenchmarkComparison {
  name: string;
  value: number;
  userValue: number;
  differenceAmount: number;
  differencePercentage: number;
  isLower: boolean;
}

export interface SustainabilityTier {
  name: string;
  min: number;
  max: number;
  color: string;
  textColor: string;
  description: string;
}

/**
 * Calculates the absolute percentage difference between a user's value and a benchmark.
 * 
 * @param value The user's specific value (e.g., carbon footprint)
 * @param benchmark The benchmark value to compare against
 * @returns A positive integer representing the absolute percentage difference
 * 
 * @example
 * // returns 50
 * calculatePercentDifference(1500, 1000);
 */
export function calculatePercentDifference(value: number, benchmark: number): number {
  if (benchmark === 0) return 0;
  return Math.abs(Math.round(((value - benchmark) / benchmark) * 100));
}

/**
 * Compares a given carbon footprint against predefined global and local benchmarks.
 * 
 * @param footprint The user's annual carbon footprint in kg CO₂/year
 * @returns A dictionary of comparison objects detailing differences and percentages
 * 
 * @example
 * const comparisons = calculateBenchmarkComparison(1500);
 * console.log(comparisons.indianAverage.differenceAmount);
 */
export function calculateBenchmarkComparison(footprint: number): Record<string, BenchmarkComparison> {
  const createComparison = (name: string, benchmarkValue: number): BenchmarkComparison => ({
    name,
    value: benchmarkValue,
    userValue: footprint,
    differenceAmount: Math.abs(footprint - benchmarkValue),
    differencePercentage: calculatePercentDifference(footprint, benchmarkValue),
    isLower: footprint <= benchmarkValue
  });

  return {
    indianAverage: createComparison("Average Indian", AVERAGE_INDIAN),
    globalAverage: createComparison("Average Global", AVERAGE_GLOBAL),
    sustainableTarget: createComparison("Sustainable Target", SUSTAINABLE_TARGET)
  };
}

/**
 * Determines the user's sustainability tier based on their annual carbon footprint.
 * Maps the footprint to predefined tiers (e.g., Eco-Champion, Average, High Impact).
 * 
 * @param footprint The user's annual carbon footprint in kg CO₂/year
 * @returns The metadata for the matched sustainability tier
 */
export function calculateSustainabilityTier(footprint: number): SustainabilityTier {
  const tier = TIERS.find((t) => footprint >= t.min && footprint <= t.max);
  if (!tier) {
    // Fallback to the lowest tier if something goes wrong
    return TIERS[TIERS.length - 1];
  }
  return tier;
}

/**
 * Estimates a sustainability percentile rank based on the user's footprint.
 * A higher percentile (e.g., 99) means a better (lower) carbon footprint.
 * 
 * @param footprint The user's annual carbon footprint in kg CO₂/year
 * @returns An integer representing the percentile rank (1 to 99)
 */
export function calculatePercentileEstimate(footprint: number): number {
  if (footprint <= 1000) return 99;
  if (footprint <= 1500) {
    // Range: 1000 - 1500 -> Percentile: 99 to 90
    return Math.round(99 - ((footprint - 1000) / 500) * 9);
  }
  if (footprint <= 1900) {
    // Range: 1500 - 1900 -> Percentile: 90 to 75
    return Math.round(90 - ((footprint - 1500) / 400) * 15);
  }
  if (footprint <= 4700) {
    // Range: 1900 - 4700 -> Percentile: 75 to 50
    return Math.round(75 - ((footprint - 1900) / 2800) * 25);
  }
  if (footprint <= 10000) {
    // Range: 4700 - 10000 -> Percentile: 50 to 1
    return Math.max(1, Math.round(50 - ((footprint - 4700) / 5300) * 49));
  }
  return 1;
}

/**
 * Generates dynamic, rule-based local insights comparing the footprint to standard benchmarks.
 * Provides a UI-ready message format with severity levels.
 * 
 * @param footprint The user's annual carbon footprint in kg CO₂/year
 * @returns An object containing the alert type, title, and detailed message
 */
export function generateBenchmarkInsights(footprint: number): { type: "success" | "warning" | "info", title: string, message: string } {
  const comparisons = calculateBenchmarkComparison(footprint);
  
  // Rule 1: Below Sustainable Target
  if (footprint <= SUSTAINABLE_TARGET) {
    return {
      type: "success",
      title: "✅ Incredible job!",
      message: `Your footprint is ${comparisons.sustainableTarget.differencePercentage}% below the sustainable lifestyle target. You are a true climate champion.`
    };
  }

  // Rule 2: Between Target and Indian Average
  if (footprint <= AVERAGE_INDIAN) {
    return {
      type: "info",
      title: "🌱 Excellent progress.",
      message: `You emit less carbon than the average Indian citizen. You are only ${comparisons.sustainableTarget.differenceAmount} kg away from the sustainable target!`
    };
  }

  // Rule 3: Below Global Average but above Indian Average
  if (footprint <= AVERAGE_GLOBAL) {
    return {
      type: "warning",
      title: "⚠ Room for improvement.",
      message: `Your footprint is ${comparisons.indianAverage.differencePercentage}% higher than the average Indian citizen, though you are still below the global average.`
    };
  }

  // Rule 4: Above Global Average
  return {
    type: "warning",
    title: "⚠ High Footprint Detected.",
    message: `Your footprint is ${comparisons.globalAverage.differencePercentage}% higher than the global average. Transportation and energy consumption are likely your biggest opportunities for reduction.`
  };
}
