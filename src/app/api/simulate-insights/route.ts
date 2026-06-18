import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { simulateInsightsSchema, sanitizeText } from "@/lib/validation/simulator";
import { logger } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// In-memory rate limiting map for Hackathon purposes
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 requests per minute

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const rateLimitRecord = rateLimitMap.get(ip);
    
    if (rateLimitRecord && (now - rateLimitRecord.timestamp < RATE_LIMIT_WINDOW_MS)) {
      if (rateLimitRecord.count >= RATE_LIMIT_MAX_REQUESTS) {
        logger.warn(`Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
      }
      rateLimitRecord.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const body = await req.json();
    
    // Zod Validation
    const parsed = simulateInsightsSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn(`Invalid insights payload`, parsed.error.format());
      return NextResponse.json({ error: "Invalid request payload.", details: parsed.error.issues }, { status: 400 });
    }

    const {
      currentFootprint,
      projectedFootprint,
      selectedChanges,
      biggestImpactAction,
    } = parsed.data;
    
    const sanitizedAction = sanitizeText(biggestImpactAction);
    const sanitizedChanges = selectedChanges.map(sanitizeText);

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning fallback data.");
      return NextResponse.json({
        plan: [
          { day: 1, task: "Configure your Gemini API key in .env.local to see AI insights." },
          { day: 2, task: "Use public transport for your commute." },
          { day: 3, task: "Reduce AC usage by 1 hour." },
          { day: 4, task: "Eat a plant-based meal today." },
          { day: 5, task: "Avoid single-use plastic." },
          { day: 6, task: "Buy local produce for your groceries." },
          { day: 7, task: "Review your weekly carbon savings." },
        ].map(p => ({ ...p, completed: false }))
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Act as an environmental sustainability coach.
The user is simulating reducing their carbon footprint from ${currentFootprint} kg CO2/year to ${projectedFootprint} kg CO2/year.
Their biggest impact action is: ${sanitizedAction}.
Other changes selected: ${JSON.stringify(sanitizedChanges)}.

Create a practical, 7-day action plan based specifically on these lifestyle changes.
Format the output EXACTLY as a JSON array of objects, where each object has a "day" (number 1-7) and a "task" (string). 
Do NOT wrap the response in markdown blocks like \`\`\`json. Return only the raw JSON array.
Example format:
[
  { "day": 1, "task": "Reduce AC usage by 1 hour today." },
  { "day": 2, "task": "Use public transit for your commute." }
]
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Clean up potential markdown formatting
    if (text.startsWith('```json')) {
      text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith('```')) {
      text = text.substring(3, text.length - 3).trim();
    }

    const plan = JSON.parse(text);

    return NextResponse.json({ plan: plan.map((p: { day: number; task: string }) => ({ ...p, completed: false })) });
  } catch (error) {
    logger.error("Gemini API Error", error);
    return NextResponse.json(
      { error: "Failed to generate AI plan." },
      { status: 500 }
    );
  }
}
