import { calculateSustainabilityTier, SustainabilityTier } from './benchmarks';
import { calculatePercentileEstimate } from './percentiles';;

export const NET_ZERO_TARGET = 1000;

/**
 * Represents a single data point in a timeline, pairing a year with a carbon footprint value.
 */
export interface DataPoint {
  year: number;
  footprint: number;
}

/**
 * Detailed projection of a future sustainability scenario based on user habits.
 */
export interface FutureScenario {
  id: 'scenario_a' | 'scenario_b' | 'scenario_c';
  name: string;
  description: string;
  timeline: DataPoint[];
  footprint2030: number;
  footprint2035: number;
  futureTier: SustainabilityTier;
  futurePercentile: number;
  estimatedCarbonSaved: number; // Cumulative kg saved vs Scenario A by 2035
}

/**
 * A collection of personalized scenarios representing the user's future sustainability.
 */
export interface PersonalizedTwin {
  scenarios: {
    scenarioA: FutureScenario;
    scenarioB: FutureScenario;
    scenarioC: FutureScenario;
  };
  insights: string[];
}

/**
 * Linearly interpolates a trajectory from start footprint to target footprint over a number of years.
 * 
 * @param startYear The beginning year of the projection
 * @param endYear The final year of the projection
 * @param startFootprint The user's footprint at the start year (kg CO₂)
 * @param endFootprint The user's targeted footprint at the end year (kg CO₂)
 * @returns An array of data points representing the footprint for each year in the timeline
 */
export function calculateFutureTrajectory(startYear: number, endYear: number, startFootprint: number, endFootprint: number): DataPoint[] {
  const years = endYear - startYear;
  const timeline: DataPoint[] = [];
  
  if (years <= 0) {
    return [{ year: startYear, footprint: startFootprint }];
  }
  
  const annualChange = (endFootprint - startFootprint) / years;
  
  for (let i = 0; i <= years; i++) {
    timeline.push({
      year: startYear + i,
      footprint: Math.max(0, Math.round(startFootprint + (annualChange * i)))
    });
  }
  
  return timeline;
}

/**
 * Calculates cumulative carbon saved against a baseline scenario over a timeline.
 * 
 * @param baseline The baseline data points (e.g., Scenario A doing nothing)
 * @param trajectory The targeted data points (e.g., Scenario B or C)
 * @returns Total kilograms of CO₂ saved compared to the baseline
 */
function calculateCumulativeSavings(baseline: DataPoint[], trajectory: DataPoint[]): number {
  let saved = 0;
  for (let i = 0; i < trajectory.length; i++) {
    const baseVal = baseline.find(b => b.year === trajectory[i].year)?.footprint || baseline[baseline.length - 1].footprint;
    const diff = baseVal - trajectory[i].footprint;
    if (diff > 0) saved += diff;
  }
  return saved;
}

function generateScenarioA(currentYear: number, endYear: number, currentFootprint: number): FutureScenario {
  const timelineA = calculateFutureTrajectory(currentYear, endYear, currentFootprint, currentFootprint);
  return {
    id: 'scenario_a',
    name: 'Current Habits Continue',
    description: 'Assuming no meaningful lifestyle change, your footprint remains stable.',
    timeline: timelineA,
    footprint2030: currentFootprint,
    footprint2035: currentFootprint,
    futureTier: calculateSustainabilityTier(currentFootprint),
    futurePercentile: calculatePercentileEstimate(currentFootprint),
    estimatedCarbonSaved: 0
  };
}

function generateScenarioB(currentYear: number, endYear: number, midYear: number, currentFootprint: number, simulatedFootprint: number | null, timelineA: DataPoint[]): FutureScenario {
  const targetB = simulatedFootprint && simulatedFootprint < currentFootprint 
    ? simulatedFootprint 
    : Math.max(currentFootprint * 0.95, NET_ZERO_TARGET);
  const timelineB = calculateFutureTrajectory(currentYear, endYear, currentFootprint, targetB);
  return {
    id: 'scenario_b',
    name: 'Personal Growth Path',
    description: 'Based on your simulated lifestyle improvements.',
    timeline: timelineB,
    footprint2030: timelineB.find(t => t.year === midYear)?.footprint || targetB,
    footprint2035: targetB,
    futureTier: calculateSustainabilityTier(targetB),
    futurePercentile: calculatePercentileEstimate(targetB),
    estimatedCarbonSaved: calculateCumulativeSavings(timelineA, timelineB)
  };
}

function generateScenarioC(currentYear: number, endYear: number, midYear: number, currentFootprint: number, timelineA: DataPoint[]): FutureScenario {
  const targetC = Math.min(NET_ZERO_TARGET, currentFootprint);
  const timelineC = calculateFutureTrajectory(currentYear, endYear, currentFootprint, targetC);
  return {
    id: 'scenario_c',
    name: 'Climate Champion Path',
    description: 'Optimized path reaching the ultimate Net-Zero target.',
    timeline: timelineC,
    footprint2030: timelineC.find(t => t.year === midYear)?.footprint || targetC,
    footprint2035: targetC,
    futureTier: calculateSustainabilityTier(targetC),
    futurePercentile: calculatePercentileEstimate(targetC),
    estimatedCarbonSaved: calculateCumulativeSavings(timelineA, timelineC)
  };
}

function generateInsights(currentFootprint: number, simulatedFootprint: number | null, scenarioB: FutureScenario, scenarioC: FutureScenario): string[] {
  const insights: string[] = [];
  if (simulatedFootprint && simulatedFootprint < currentFootprint) {
    const reductionPercent = Math.round(((currentFootprint - simulatedFootprint) / currentFootprint) * 100);
    insights.push(`🌱 If you maintain your current simulator changes, you could reduce emissions by ${reductionPercent}% by 2035.`);
  } else {
    insights.push(`🌱 Try adjusting the simulator to see your personalized growth path take shape.`);
  }
  insights.push(`🏆 Your projected Personal Growth footprint would place you in the ${scenarioB.futurePercentile} of CarbonWise users.`);
  const tonsSaved = (scenarioC.estimatedCarbonSaved / 1000).toFixed(1);
  insights.push(`🌍 Following the Climate Champion path could prevent ${tonsSaved} tons of CO₂ over the next decade.`);
  return insights;
}

/**
 * Generates the personalized sustainability twin with three unique projection paths.
 * Learns from the user's interactive simulator adjustments to create Scenario B.
 * 
 * @param currentFootprint The user's current annual carbon footprint (kg CO₂)
 * @param simulatedFootprint The projected footprint from the user's simulator choices (kg CO₂ or null)
 * @returns The personalized twin containing three scenario timelines and custom insights
 */
export function generatePersonalizedTwin(
  currentFootprint: number, 
  simulatedFootprint: number | null
): PersonalizedTwin {
  const currentYear = new Date().getFullYear();
  const endYear = 2035;
  const midYear = 2030;
  
  const scenarioA = generateScenarioA(currentYear, endYear, currentFootprint);
  const scenarioB = generateScenarioB(currentYear, endYear, midYear, currentFootprint, simulatedFootprint, scenarioA.timeline);
  const scenarioC = generateScenarioC(currentYear, endYear, midYear, currentFootprint, scenarioA.timeline);
  const insights = generateInsights(currentFootprint, simulatedFootprint, scenarioB, scenarioC);

  return {
    scenarios: { scenarioA, scenarioB, scenarioC },
    insights
  };
}
