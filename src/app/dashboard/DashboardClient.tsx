"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { DashboardOverviewTab } from "@/components/dashboard/DashboardOverviewTab";
import { DashboardLogTab } from "@/components/dashboard/DashboardLogTab";
import { DashboardGamificationTab } from "@/components/dashboard/DashboardGamificationTab";

interface DashboardProps {
  assessment: {
    transportScore: number;
    energyScore: number;
    foodScore: number;
    shoppingScore: number;
    wasteScore: number;
    totalEmissions: number;
    sustainabilityScore: number;
  };
  historicalAssessments: Array<{ createdAt: string; totalEmissions: number; sustainabilityScore: number }>;
  recommendations: Array<{ id: string; recommendation: string; estimatedSavings: number }>;
  metrics: { totalCarbonSaved: number; treesEquivalent: number; waterSaved: number };
  user: { level: number; xp: number; dailyLogs?: Array<{ walkingKm?: number; plasticSaved?: number }>; userChallenges?: Array<{ id: string; progress: number }> };
}

export default function DashboardClient({
  assessment,
  historicalAssessments,
  recommendations,
  metrics,
  user,
}: DashboardProps) {
  const simulationResult = useStore((state) => state.simulationResult);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-200 dark:bg-slate-800 rounded-full h-12">
        <TabsTrigger
          value="overview"
          className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="log"
          className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
        >
          Log Activity
        </TabsTrigger>
        <TabsTrigger
          value="challenges"
          className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
        >
          Gamification
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <DashboardOverviewTab
          assessment={assessment}
          historicalAssessments={historicalAssessments}
          recommendations={recommendations}
          metrics={metrics}
          simulationResult={simulationResult}
        />
      </TabsContent>

      <TabsContent value="log">
        <DashboardLogTab />
      </TabsContent>

      <TabsContent value="challenges">
        <DashboardGamificationTab user={user} />
      </TabsContent>
    </Tabs>
  );
}
