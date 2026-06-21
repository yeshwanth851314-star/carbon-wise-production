import { z } from "zod";

export const benchmarkSchema = z.object({
  footprint: z.number().min(0).max(100000),
});

export const communitySchema = z.object({
  userScore: z.number().min(0).max(100),
  communityScores: z.array(z.number().min(0).max(100)).optional(),
});

export const equivalentsSchema = z.object({
  footprint: z.number().min(0).max(100000),
});
