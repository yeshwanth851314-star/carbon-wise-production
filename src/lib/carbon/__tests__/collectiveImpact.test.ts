import { describe, it, expect } from 'vitest';
import { generateCollectiveImpact, calculateCollectiveImpactScenario } from '../collectiveImpact';

describe('Collective Impact Engine', () => {
  it('should scale reductions linearly based on user count', () => {
    const annualReduction = 500;
    const scenario100 = calculateCollectiveImpactScenario(annualReduction, 100);
    const scenario1000 = calculateCollectiveImpactScenario(annualReduction, 1000);

    expect(scenario100.totalCO2Reduced).toBe(50000);
    expect(scenario1000.totalCO2Reduced).toBe(500000);
  });

  it('should generate all required scenarios at standard scales', () => {
    const data = generateCollectiveImpact(1000);
    
    expect(data.baseReduction).toBe(1000);
    expect(data.scenarios[100]).toBeDefined();
    expect(data.scenarios[1000]).toBeDefined();
    expect(data.scenarios[10000]).toBeDefined();
    expect(data.scenarios[100000]).toBeDefined();
  });

  it('should calculate environmental equivalents correctly for a massive scale', () => {
    const data = generateCollectiveImpact(1000);
    const massiveScenario = data.scenarios[100000];
    
    // total CO2 = 1,000 * 100,000 = 100,000,000 kg
    // Trees = kg / 25
    expect(massiveScenario.equivalents.treesEquivalent).toBe(100000000 / 25);
    
    // Cars = totalCO2 / 4600 per year (handled in UI, but drivingEquivalent is km)
    // drivingEquivalent = kg / 0.24
    expect(massiveScenario.equivalents.drivingEquivalent).toBe(Math.round(100000000 / 0.24));
  });

  it('should handle zero reduction gracefully', () => {
    const data = generateCollectiveImpact(0);
    
    expect(data.baseReduction).toBe(0);
    expect(data.scenarios[1000].totalCO2Reduced).toBe(0);
    expect(data.scenarios[1000].equivalents.treesEquivalent).toBe(0);
  });
});
