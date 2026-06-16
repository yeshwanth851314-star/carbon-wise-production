"use server";

import { cookies } from "next/headers";
import { calculateCarbonFootprint, CarbonInput } from "@/lib/carbon-calc";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export async function loginUser(username: string) {
  const cookieStore = await cookies();
  cookieStore.set("carbon_user_id", username, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
  redirect("/onboarding");
}

export async function saveAssessment(input: CarbonInput) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carbon_user_id")?.value;
  if (!userId) throw new Error("Unauthorized");

  // Calculate scores
  const results = calculateCarbonFootprint(input);

  // Sync user in our DB if not exists
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: `${userId}@placeholder.com`, // We'd get this from Clerk webhooks in production
      },
    });
  }

  // Save assessment
  const assessment = await prisma.assessment.create({
    data: {
      userId: user.id,
      transportScore: results.transportEmission,
      energyScore: results.energyEmission,
      foodScore: results.foodEmission,
      shoppingScore: results.shoppingEmission,
      wasteScore: results.wasteEmission,
      totalEmissions: results.totalCarbonKg,
      sustainabilityScore: results.sustainabilityScore,
    },
  });

  // Generate AI Insights
  await generateAndSaveInsights(user.id, results);

  // Add XP for completing assessment
  await addXp(user.id, 50);

  return { success: true, assessmentId: assessment.id };
}

async function generateAndSaveInsights(dbUserId: string, results: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = `
      You are an expert AI Sustainability Coach.
      A user just completed their carbon footprint assessment.
      Their results are:
      - Total Carbon: ${results.totalCarbonKg} kg CO2/month
      - Sustainability Score: ${results.sustainabilityScore}/100
      - Transport: ${results.transportEmission} kg
      - Energy: ${results.energyEmission} kg
      - Food: ${results.foodEmission} kg
      - Shopping: ${results.shoppingEmission} kg
      - Waste: ${results.wasteEmission} kg
      
      Identify the biggest emission source.
      Generate 3 highly personalized, actionable recommendations.
      For each recommendation, estimate the potential CO2 savings in kg.
      Format the output as a clean JSON array of objects with keys: "recommendation" (string), "estimatedSavings" (number).
      Do not include markdown blocks, just raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean markdown if present
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const insights = JSON.parse(cleaned);

    for (const insight of insights) {
      await prisma.recommendation.create({
        data: {
          userId: dbUserId,
          recommendation: insight.recommendation,
          estimatedSavings: insight.estimatedSavings,
        },
      });
    }
  } catch (error) {
    console.error("AI Insight Generation Failed", error);
  }
}

export async function addXp(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const newXp = user.xp + amount;
  const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level

  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXp, level: newLevel },
  });
}

export async function logDailyAction(data: {
  walkingKm: number;
  cyclingKm: number;
  publicTransportKm: number;
  plasticSaved: number;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carbon_user_id")?.value;
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  // Calculate carbon saved
  // Car is 0.2. Walking/cycling saves 0.2 per km. PT saves 0.12 (0.2 - 0.08) per km.
  // Plastic bottle saved = ~0.08 kg
  const carbonSaved =
    data.walkingKm * 0.2 +
    data.cyclingKm * 0.2 +
    data.publicTransportKm * 0.12 +
    data.plasticSaved * 0.08;

  await prisma.dailyLog.create({
    data: {
      userId: user.id,
      walkingKm: data.walkingKm,
      cyclingKm: data.cyclingKm,
      publicTransportKm: data.publicTransportKm,
      plasticSaved: data.plasticSaved,
      carbonSaved: carbonSaved,
    },
  });

  await addXp(user.id, 10);
  revalidatePath("/dashboard");
  return { success: true };
}
