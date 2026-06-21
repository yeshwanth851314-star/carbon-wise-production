import { describe, it, expect } from 'vitest';
import {
  calculatePercentDifference,
  calculateBenchmarkComparison,
  calculateSustainabilityTier,
  calculatePercentileEstimate,
  generateBenchmarkInsights
} from '../benchmarks';
import { AVERAGE_INDIAN, AVERAGE_GLOBAL, SUSTAINABLE_TARGET } from '../../constants/benchmarks';

describe('Carbon Benchmarks Engine', () => {
  
  describe('calculatePercentDifference', () => {
    it('calculates the correct positive percentage difference', () => {
      // (1500 - 1000) / 1000 = 50%
      expect(calculatePercentDifference(1500, 1000)).toBe(50);
      // (500 - 1000) / 1000 = -50% => 50%
      expect(calculatePercentDifference(500, 1000)).toBe(50);
    });

    it('returns 0 if benchmark is 0', () => {
      expect(calculatePercentDifference(100, 0)).toBe(0);
    });
  });

  describe('calculateBenchmarkComparison', () => {
    it('compares correctly against standard benchmarks', () => {
      const footprint = 2000;
      const comparison = calculateBenchmarkComparison(footprint);
      
      expect(comparison.indianAverage.value).toBe(AVERAGE_INDIAN);
      expect(comparison.indianAverage.isLower).toBe(false); // 2000 > 1900
      
      expect(comparison.globalAverage.value).toBe(AVERAGE_GLOBAL);
      expect(comparison.globalAverage.isLower).toBe(true); // 2000 <= 4700
      
      expect(comparison.sustainableTarget.value).toBe(SUSTAINABLE_TARGET);
      expect(comparison.sustainableTarget.isLower).toBe(false); // 2000 > 1500
    });
  });

  describe('calculateSustainabilityTier', () => {
    it('assigns Climate Champion for footprint <= 1500', () => {
      const tier = calculateSustainabilityTier(1200);
      expect(tier.name).toBe("Climate Champion");
    });

    it('assigns Eco Leader for footprint between 1501 and 2500', () => {
      const tier = calculateSustainabilityTier(2000);
      expect(tier.name).toBe("Eco Leader");
    });

    it('assigns Green Learner for footprint between 2501 and 4000', () => {
      const tier = calculateSustainabilityTier(3000);
      expect(tier.name).toBe("Green Learner");
    });

    it('assigns Improvement Needed for footprint > 4000', () => {
      const tier = calculateSustainabilityTier(5000);
      expect(tier.name).toBe("Improvement Needed");
    });
  });

  describe('calculatePercentileEstimate', () => {
    it('returns 99 for very low footprints', () => {
      expect(calculatePercentileEstimate(500)).toBe(99);
    });

    it('returns around 50 for global average footprints', () => {
      expect(calculatePercentileEstimate(4700)).toBe(50);
    });

    it('returns very low percentile for high footprints', () => {
      expect(calculatePercentileEstimate(15000)).toBe(1);
    });
  });

  describe('generateBenchmarkInsights', () => {
    it('generates success insight if below sustainable target', () => {
      const insight = generateBenchmarkInsights(1200);
      expect(insight.type).toBe("success");
      expect(insight.title).toContain("Incredible job");
    });

    it('generates info insight if below indian average but above target', () => {
      const insight = generateBenchmarkInsights(1700);
      expect(insight.type).toBe("info");
      expect(insight.message).toContain("emit less carbon than the average Indian citizen");
    });

    it('generates warning insight if above indian average but below global', () => {
      const insight = generateBenchmarkInsights(3000);
      expect(insight.type).toBe("warning");
      expect(insight.title).toContain("Room for improvement");
    });

    it('generates warning insight if above global average', () => {
      const insight = generateBenchmarkInsights(5000);
      expect(insight.type).toBe("warning");
      expect(insight.title).toContain("High Footprint Detected");
    });
  });

});
