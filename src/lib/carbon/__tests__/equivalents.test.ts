import { describe, it, expect } from 'vitest';
import { calculateEnvironmentalEquivalents } from '../equivalents';

describe('calculateEnvironmentalEquivalents', () => {
  it('calculates equivalents correctly for a typical footprint', () => {
    const kgCO2 = 1500;
    const result = calculateEnvironmentalEquivalents(kgCO2);
    
    // 1500 / 25 = 60
    expect(result.treesEquivalent).toBe(60);
    // 1500 / 0.24 = 6250
    expect(result.drivingEquivalent).toBe(6250);
    // 1500 / 0.004 = 375000
    expect(result.electricityEquivalent).toBe(375000);
    // (1500 / 100) = 15
    expect(result.householdEnergyEquivalent).toBe(15);
    // 1500 / 150 = 10
    expect(result.flightsEquivalent).toBe(10);
    // 1500 / 0.005 = 300000
    expect(result.waterEquivalent).toBe(300000);
  });

  it('handles zero footprint gracefully', () => {
    const result = calculateEnvironmentalEquivalents(0);
    expect(result.treesEquivalent).toBe(0);
    expect(result.drivingEquivalent).toBe(0);
    expect(result.electricityEquivalent).toBe(0);
    expect(result.householdEnergyEquivalent).toBe(0);
    expect(result.flightsEquivalent).toBe(0);
    expect(result.waterEquivalent).toBe(0);
  });

  it('handles negative footprint gracefully (clamps to 0)', () => {
    const result = calculateEnvironmentalEquivalents(-500);
    expect(result.treesEquivalent).toBe(0);
    expect(result.drivingEquivalent).toBe(0);
    expect(result.electricityEquivalent).toBe(0);
    expect(result.householdEnergyEquivalent).toBe(0);
    expect(result.flightsEquivalent).toBe(0);
    expect(result.waterEquivalent).toBe(0);
  });

  it('rounds decimal equivalent values correctly', () => {
    const result = calculateEnvironmentalEquivalents(112.5);
    
    // 112.5 / 25 = 4.5 -> Math.round -> 5
    expect(result.treesEquivalent).toBe(5);
    
    // 112.5 / 100 = 1.125 -> Math.round(11.25)/10 -> 1.1
    expect(result.householdEnergyEquivalent).toBe(1.1);
  });
});
