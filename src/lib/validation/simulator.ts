import { z } from "zod";

export const simulateInsightsSchema = z.object({
  currentFootprint: z.number().positive(),
  projectedFootprint: z.number().nonnegative(),
  biggestImpactAction: z.string().min(1).max(100),
  selectedChanges: z.array(z.string().min(1).max(100)).max(20),
});

export type SimulateInsightsInput = z.infer<typeof simulateInsightsSchema>;

export function sanitizeText(text: string): string {
  // Trim and remove extreme whitespaces to mitigate basic injection payloads
  return text.trim().replace(/\s{2,}/g, ' ').substring(0, 500);
}
