import { describe, it, expect } from 'vitest';
import { assessmentSchema } from '../assessment';

describe('validation/assessment.ts', () => {
  it('should pass for a valid assessment', () => {
    const validAssessment = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date().toISOString(),
      transportScore: 1000,
      energyScore: 1000,
      foodScore: 1000,
      shoppingScore: 1000,
      wasteScore: 1000,
      totalEmissions: 5000,
      sustainabilityScore: 80,
    };
    const parsed = assessmentSchema.safeParse(validAssessment);
    expect(parsed.success).toBe(true);
  });

  it('should fail for negative totalEmissions', () => {
    const invalidAssessment = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date().toISOString(),
      transportScore: 1000,
      energyScore: 1000,
      foodScore: 1000,
      shoppingScore: 1000,
      wasteScore: 1000,
      totalEmissions: -5000,
      sustainabilityScore: 80,
    };
    const parsed = assessmentSchema.safeParse(invalidAssessment);
    expect(parsed.success).toBe(false);
  });

  it('should fail for invalid UUID', () => {
    const invalidAssessment = {
      id: 'invalid-id',
      createdAt: new Date().toISOString(),
      transportScore: 1000,
      energyScore: 1000,
      foodScore: 1000,
      shoppingScore: 1000,
      wasteScore: 1000,
      totalEmissions: 5000,
      sustainabilityScore: 80,
    };
    const parsed = assessmentSchema.safeParse(invalidAssessment);
    expect(parsed.success).toBe(false);
  });
});
