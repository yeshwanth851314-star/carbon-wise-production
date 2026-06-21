import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Leaf, TreePine, Droplets } from "lucide-react";
import { BenchmarkComparison } from "@/components/BenchmarkComparison";
import { CommunityBenchmark } from "@/components/CommunityBenchmark";
import { SustainabilityTwin } from "@/components/SustainabilityTwin";
import { CollectiveImpact } from "@/components/CollectiveImpact";

import { useDashboardMetrics, AssessmentData, HistoricalAssessment } from "@/hooks/useDashboardMetrics";
import { DashboardScoreCard } from "./DashboardScoreCard";
import { DashboardMetricsPieChart } from "./DashboardMetricsPieChart";
import { DashboardImpactTrendChart } from "./DashboardImpactTrendChart";
import { DashboardAIRecommendations } from "./DashboardAIRecommendations";

interface DashboardOverviewTabProps {
  assessment: AssessmentData;
  historicalAssessments: HistoricalAssessment[];
  recommendations: Array<{ id: string; recommendation: string; estimatedSavings: number }>;
  metrics: { totalCarbonSaved: number; treesEquivalent: number; waterSaved: number };
  simulationResult: { projectedFootprint: number; reductionAmount: number; reductionPercentage: number; biggestImpactAction: string | null; } | null;
}

/**
 * Renders the main overview tab of the dashboard with charts, scores, and AI recommendations.
 */
export function DashboardOverviewTab({
  assessment,
  historicalAssessments,
  recommendations,
  metrics,
  simulationResult,
}: DashboardOverviewTabProps) {
  const { pieData, lineData, message } = useDashboardMetrics(assessment, historicalAssessments);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardScoreCard score={assessment.sustainabilityScore} message={message} />

        <div className="col-span-1 md:col-span-3 lg:col-span-2 grid grid-cols-2 gap-4">
          <Card className="rounded-3xl border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Annual Footprint</CardDescription>
              <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                {assessment.totalEmissions} <span className="text-base font-normal text-slate-500">kg CO₂/year</span>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Carbon Saved</CardDescription>
              <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-500" />
                {Math.round(metrics.totalCarbonSaved)} <span className="text-base font-normal text-slate-500">kg</span>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Trees Equivalent</CardDescription>
              <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                <TreePine className="w-6 h-6 text-emerald-600" />
                {metrics.treesEquivalent}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Water Saved</CardDescription>
              <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                <Droplets className="w-6 h-6 text-blue-500" />
                {metrics.waterSaved} <span className="text-base font-normal text-slate-500">L</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <DashboardMetricsPieChart data={pieData} />
        <DashboardImpactTrendChart data={lineData} />

        <div className="col-span-1 md:col-span-3 space-y-6">
          <BenchmarkComparison footprint={assessment.totalEmissions} />
          <CommunityBenchmark userScore={assessment.sustainabilityScore} userFootprint={assessment.totalEmissions} />
        </div>

        <DashboardAIRecommendations recommendations={recommendations} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SustainabilityTwin 
          currentFootprint={assessment.totalEmissions}
          simulatedFootprint={simulationResult?.projectedFootprint ?? null}
        />
        <CollectiveImpact annualReduction={simulationResult?.reductionAmount ?? 0} />
      </div>
    </div>
  );
}
