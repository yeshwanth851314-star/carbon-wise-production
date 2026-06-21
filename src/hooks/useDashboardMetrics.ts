import { format } from "date-fns";

export interface AssessmentData {
  transportScore: number;
  energyScore: number;
  foodScore: number;
  shoppingScore: number;
  wasteScore: number;
  totalEmissions: number;
  sustainabilityScore: number;
}

export interface HistoricalAssessment {
  createdAt: string;
  totalEmissions: number;
  sustainabilityScore: number;
}

export function useDashboardMetrics(assessment: AssessmentData, historicalAssessments: HistoricalAssessment[]) {
  const pieData = [
    { name: "Transport", value: assessment.transportScore, color: "#3b82f6" },
    { name: "Energy", value: assessment.energyScore, color: "#eab308" },
    { name: "Food", value: assessment.foodScore, color: "#f97316" },
    { name: "Shopping", value: assessment.shoppingScore, color: "#a855f7" },
    { name: "Waste", value: assessment.wasteScore, color: "#64748b" },
  ];

  const lineData = historicalAssessments.map((a) => ({
    date: format(new Date(a.createdAt), "MMM dd"),
    Carbon: a.totalEmissions,
    Score: a.sustainabilityScore,
  }));

  let message = "You're doing great! Keep finding small ways to reduce.";
  if (assessment.sustainabilityScore > 80) {
    message = "Exceptional work! You're a true sustainability champion.";
  } else if (assessment.sustainabilityScore < 40) {
    message = "There is a lot of room for improvement. The AI Coach can help!";
  }

  return { pieData, lineData, message };
}
