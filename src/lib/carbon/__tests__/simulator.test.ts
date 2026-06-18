import { describe, it, expect } from 'vitest';
import { 
  calculateProjectedFootprint, 
  calculateForecast, 
  calculateImpactEquivalents, 
  calculateAchievementUnlocks 
} from '../simulator';

describe('Simulator Logic', () => {
  it('calculateProjectedFootprint should calculate correctly without changes', () => {
    const result = calculateProjectedFootprint({
      baseEmissions: 4500,
      carReduction: 0,
      publicTransit: 0,
      bikeUsage: 0,
      switchEV: false,
      acReduction: 0,
      elecReduction: 0,
      renewableEnergy: false,
      meatReduction: 0,
      switchVeg: false,
      shoppingReduction: 0,
      plasticReduction: 0,
      recyclingIncrease: 0,
      baseTrans: 1500,
      baseEnergy: 1000,
      baseFood: 1000,
      baseShop: 500,
      baseWaste: 500
    });

    expect(result.projectedFootprint).toBe(4500);
    expect(result.reductionAmount).toBe(0);
    expect(result.reductionPercentage).toBe(0);
    expect(result.biggestImpactAction).toBeNull();
  });

  it('calculateProjectedFootprint should calculate correctly with max changes', () => {
    const result = calculateProjectedFootprint({
      baseEmissions: 4500,
      carReduction: 100,
      publicTransit: 100,
      bikeUsage: 100,
      switchEV: true,
      acReduction: 100,
      elecReduction: 100,
      renewableEnergy: true,
      meatReduction: 100,
      switchVeg: true,
      shoppingReduction: 100,
      plasticReduction: 100,
      recyclingIncrease: 100,
      baseTrans: 1500,
      baseEnergy: 1000,
      baseFood: 1000,
      baseShop: 500,
      baseWaste: 500
    });

    expect(result.reductionAmount).toBeGreaterThan(0);
    expect(result.projectedFootprint).toBeLessThan(4500);
  });

  it('calculateForecast should return reasonable forecasts', () => {
    const { sixMonthForecast, oneYearForecast } = calculateForecast(4000);
    expect(sixMonthForecast).toBe(3600); // 4000 * 0.9
    expect(oneYearForecast).toBe(3200);  // 4000 * 0.8
  });

  it('calculateImpactEquivalents should return correct equivalents', () => {
    const { treesPlanted, kmAvoided, ledHours } = calculateImpactEquivalents(1000);
    expect(treesPlanted).toBe(40); // 1000 / 25
    expect(kmAvoided).toBe(5208);  // 1000 * (1/0.192)
    expect(ledHours).toBe(66667);  // 1000 * (1/0.015)
  });

  it('calculateAchievementUnlocks should unlock badges based on reduction', () => {
    expect(calculateAchievementUnlocks(10)).toContain("Eco Planner");
    expect(calculateAchievementUnlocks(20)).toContain("Future Saver");
    expect(calculateAchievementUnlocks(30)).toContain("Carbon Strategist");
    
    // Check multiple
    const all = calculateAchievementUnlocks(40);
    expect(all).toContain("Eco Planner");
    expect(all).toContain("Carbon Strategist");
  });
});
