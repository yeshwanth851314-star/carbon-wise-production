import { z } from "zod";

export const assessmentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  transportScore: z.number().min(0).max(5000),
  energyScore: z.number().min(0).max(5000),
  foodScore: z.number().min(0).max(5000),
  shoppingScore: z.number().min(0).max(5000),
  wasteScore: z.number().min(0).max(5000),
  totalEmissions: z.number().min(0).max(25000),
  sustainabilityScore: z.number().min(0).max(100),
});

export type AssessmentPayload = z.infer<typeof assessmentSchema>;
