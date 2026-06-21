import { describe, it, expect } from 'vitest';
import { generatePersonalizedTwin, calculateFutureTrajectory, NET_ZERO_TARGET } from '../futureTwin';

describe('Future Twin Engine', () => {
  it('should calculate a correct linear trajectory', () => {
    const trajectory = calculateFutureTrajectory(2025, 2030, 5000, 4000);
    expect(trajectory.length).toBe(6);
    expect(trajectory[0].footprint).toBe(5000);
    expect(trajectory[5].footprint).toBe(4000);
    expect(trajectory[2].footprint).toBe(4600); // Year 2027
  });

  it('should generate personalized scenarios correctly', () => {
    const currentFootprint = 6000;
    const simulatedFootprint = 4500;

    const twin = generatePersonalizedTwin(currentFootprint, simulatedFootprint);

    // Scenario A (Current)
    expect(twin.scenarios.scenarioA.footprint2035).toBe(currentFootprint);
    expect(twin.scenarios.scenarioA.estimatedCarbonSaved).toBe(0);

    // Scenario B (Personal Growth)
    expect(twin.scenarios.scenarioB.footprint2035).toBe(simulatedFootprint);
    expect(twin.scenarios.scenarioB.estimatedCarbonSaved).toBeGreaterThan(0);

    // Scenario C (Climate Champion)
    expect(twin.scenarios.scenarioC.footprint2035).toBeLessThanOrEqual(NET_ZERO_TARGET);
    
    // Insights
    expect(twin.insights.length).toBeGreaterThan(0);
    expect(twin.insights[0]).toContain('25%'); // 1500 / 6000 = 25% reduction
  });

  it('should fallback to 5% reduction for Scenario B if no simulator data', () => {
    const currentFootprint = 5000;
    const twin = generatePersonalizedTwin(currentFootprint, null);

    // 5% of 5000 is 250, so target should be 4750
    expect(twin.scenarios.scenarioB.footprint2035).toBe(4750);
  });
});
