import { describe, it, expect } from 'vitest';
import { calculateCommunityRanking, calculateCommunityInsights, calculateNextTierProgress } from '../community';
import { TIERS } from '../benchmarks';

describe('calculateCommunityRanking', () => {
  it('calculates rankings correctly for top 10%', () => {
    const mockCommunity = [40, 50, 60, 70, 80, 90, 100, 45, 55, 65, 75, 85, 95];
    const stats = calculateCommunityRanking(98, mockCommunity);
    expect(stats.userRank).toBe('Top 10%');
    expect(stats.userPercentile).toBeGreaterThan(90);
  });

  it('calculates rankings correctly for bottom 50%', () => {
    const mockCommunity = [40, 50, 60, 70, 80, 90, 100, 45, 55, 65, 75, 85, 95];
    const stats = calculateCommunityRanking(20, mockCommunity);
    expect(stats.userRank).toBe('Bottom 50%');
    expect(stats.userPercentile).toBeLessThan(50);
  });
});

describe('calculateCommunityInsights', () => {
  it('generates correct insights for top performers', () => {
    const stats = calculateCommunityRanking(98, [40, 50, 60, 70, 80, 90]);
    const insights = calculateCommunityInsights(stats);
    expect(insights.some(i => i.includes('elite Top 10%'))).toBe(true);
  });

  it('generates improvement insights for lower performers', () => {
    const stats = calculateCommunityRanking(30, [40, 50, 60, 70, 80, 90]);
    const insights = calculateCommunityInsights(stats);
    expect(insights.some(i => i.includes('community average'))).toBe(true);
  });
});

describe('calculateNextTierProgress', () => {
  it('calculates progress correctly for mid-tier user', () => {
    // Current footprint: 1800 (Eco Leader max is 2500, Climate Champion max is 1500)
    const progress = calculateNextTierProgress(1800);
    expect(progress.reductionNeeded).toBe(300); // 1800 - 1500 = 300
    // Range is 1500 to 2500. 1800 is 70% progress from 2500 down to 1500. 
    // Wait, (2500-1800) / (2500-1500) = 700 / 1000 = 70%
    expect(progress.progressPercent).toBe(70);
    expect(progress.nextTier).toBe('Climate Champion');
  });

  it('handles top tier gracefully', () => {
    const progress = calculateNextTierProgress(800);
    expect(progress.currentTier).toBe('Climate Champion');
    expect(progress.nextTier).toBeNull();
    expect(progress.reductionNeeded).toBe(0);
    expect(progress.progressPercent).toBe(100);
  });

  it('handles lowest tier gracefully', () => {
    // Over 10000
    const progress = calculateNextTierProgress(15000);
    expect(progress.currentTier).toBe('Improvement Needed');
    expect(progress.nextTier).toBe('Green Learner');
  });
});
