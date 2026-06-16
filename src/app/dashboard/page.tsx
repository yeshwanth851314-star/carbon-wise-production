import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carbon_user_id")?.value;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      assessments: { orderBy: { createdAt: "desc" }, take: 10 },
      recommendations: { orderBy: { createdAt: "desc" }, take: 3 },
      dailyLogs: { orderBy: { date: "desc" }, take: 7 },
      userChallenges: { include: { challenge: true } },
    },
  });

  if (!user || user.assessments.length === 0) {
    redirect("/onboarding");
  }

  const latestAssessment = user.assessments[0];

  // Calculate aggregate metrics
  const totalCarbonSaved = user.dailyLogs.reduce(
    (sum: number, log: any) => sum + log.carbonSaved,
    0,
  );
  const treesEquivalent = Math.floor(totalCarbonSaved / 21); // ~21kg CO2 per tree per year
  const waterSaved = Math.floor(totalCarbonSaved * 15); // Example metric

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-slate-900 dark:text-white">
              Welcome back, Eco Warrior
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Here's your environmental impact summary.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              Level {user.level}
            </p>
            <p className="text-xs text-slate-500">{user.xp} XP</p>
          </div>
        </header>

        <DashboardClient
          assessment={latestAssessment}
          historicalAssessments={user.assessments.reverse()}
          recommendations={user.recommendations}
          metrics={{ totalCarbonSaved, treesEquivalent, waterSaved }}
          user={user}
        />
      </div>
    </div>
  );
}
