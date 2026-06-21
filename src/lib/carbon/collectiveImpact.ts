import { calculateEnvironmentalEquivalents, EnvironmentalEquivalents } from './equivalents';

export interface CollectiveImpactScenario {
  usersCount: number;
  totalCO2Reduced: number; // kg
  equivalents: EnvironmentalEquivalents;
}

export interface CollectiveImpact {
  baseReduction: number;
  scenarios: {
    [key: number]: CollectiveImpactScenario;
  };
}

/**
 * Calculates the collective environmental impact if a targeted number of people
 * perfectly replicated the user's annual carbon reduction.
 * 
 * @param annualReduction The user's personalized annual carbon reduction (kg CO₂)
 * @param usersCount The simulated size of the community adopting these changes
 * @returns An impact scenario including total scaled CO₂ and visual equivalents
 */
export function calculateCollectiveImpactScenario(annualReduction: number, usersCount: number): CollectiveImpactScenario {
  const totalCO2Reduced = Math.max(0, annualReduction * usersCount);
  
  return {
    usersCount,
    totalCO2Reduced,
    equivalents: calculateEnvironmentalEquivalents(totalCO2Reduced)
  };
}

/**
 * Generates an array of collective impact data across multiple predefined community scales
 * (100, 1,000, 10,000, and 100,000 users).
 * 
 * @param annualReduction The user's personalized annual carbon reduction (kg CO₂)
 * @returns A mapping of user counts to their respective multiplier scenarios
 */
export function generateCollectiveImpact(annualReduction: number): CollectiveImpact {
  const userCounts = [100, 1000, 10000, 100000];
  const scenarios: { [key: number]: CollectiveImpactScenario } = {};
  
  userCounts.forEach(count => {
    scenarios[count] = calculateCollectiveImpactScenario(annualReduction, count);
  });
  
  return {
    baseReduction: Math.max(0, annualReduction),
    scenarios
  };
}
