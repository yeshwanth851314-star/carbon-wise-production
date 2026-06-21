"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Share2, Leaf } from "lucide-react";
import { logger } from "@/lib/logger";
import { calculateBenchmarkComparison, calculateSustainabilityTier, generateBenchmarkInsights } from '@/lib/carbon/benchmarks';
import { calculatePercentileEstimate } from '@/lib/carbon/percentiles';;
import { calculateEnvironmentalEquivalents } from "@/lib/carbon/equivalents";
import { generatePersonalizedTwin } from "@/lib/carbon/futureTwin";
import { generateCollectiveImpact } from "@/lib/carbon/collectiveImpact";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { PrintableReport } from "./report/PrintableReport";
import { PrintableShareCard } from "./report/PrintableShareCard";

/**
 * SustainabilityReportGenerator acts as the orchestrator to convert complex DOM elements into PDF and PNG exports.
 */
export function SustainabilityReportGenerator() {
  const store = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const assessment = store.assessments[0];
  const sim = store.simulationResult;

  if (!assessment || !sim) return null;

  const handleGeneratePDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CarbonWise_Report_${format(new Date(), "MMM_dd_yyyy")}.pdf`);
    } catch (error) {
      logger.error("PDF Generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSharePNG = async () => {
    if (!shareCardRef.current) return;
    setIsSharing(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `CarbonWise_Impact_${format(new Date(), "MMM_dd_yyyy")}.png`;
      link.click();
    } catch (error) {
      logger.error("PNG Generation failed", error);
      alert("Failed to generate Share Card. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const treesEquivalent = Math.round(sim.reductionAmount / 25);
  const levelProgress = (store.xp % 1000) / 10;
  const totalChallenges = store.userChallenges.length;
  const completedChallenges = store.userChallenges.filter(c => c.completed).length;
  const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
  const carbonSavedChallenges = store.userChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.challenge.carbonTarget, 0);

  const currentTier = calculateSustainabilityTier(assessment.totalEmissions);
  const currentPercentile = calculatePercentileEstimate(assessment.totalEmissions);
  const benchmarkInsight = generateBenchmarkInsights(assessment.totalEmissions);
  const comparisons = calculateBenchmarkComparison(assessment.totalEmissions);

  const benchmarkChartData = [
    { name: "You", value: assessment.totalEmissions, fill: "#3b82f6" },
    { name: "Sustainable", value: comparisons.sustainableTarget.value, fill: "#10b981" },
    { name: "India Avg", value: comparisons.indianAverage.value, fill: "#f59e0b" },
    { name: "Global Avg", value: comparisons.globalAverage.value, fill: "#ef4444" }
  ];

  const reductionEquivalents = calculateEnvironmentalEquivalents(sim.reductionAmount);
  const twinData = generatePersonalizedTwin(assessment.totalEmissions, sim.projectedFootprint);
  const collectiveData = generateCollectiveImpact(sim.reductionAmount);
  const collective100k = collectiveData.scenarios[100000];

  const sixMonthForecast = Math.max(0, Math.round(sim.projectedFootprint * 0.9));
  const oneYearForecast = Math.max(0, Math.round(sim.projectedFootprint * 0.8));

  const barChartData = [
    { name: "Current", value: assessment.totalEmissions, fill: "#ef4444" },
    { name: "Projected", value: sim.projectedFootprint, fill: "#eab308" },
    { name: "6 Months", value: sixMonthForecast, fill: "#22c55e" },
    { name: "1 Year", value: oneYearForecast, fill: "#16a34a" },
  ];

  const pieData = [
    { name: "Transport", value: assessment.transportScore, color: "#3b82f6" },
    { name: "Energy", value: assessment.energyScore, color: "#eab308" },
    { name: "Food", value: assessment.foodScore, color: "#f97316" },
    { name: "Shopping", value: assessment.shoppingScore, color: "#a855f7" },
    { name: "Waste", value: assessment.wasteScore, color: "#64748b" },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleGeneratePDF} 
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Leaf className="w-4 h-4 mr-2" aria-hidden="true" />
          {isGenerating ? "Generating..." : "Generate My Green Report"}
        </Button>
        <Button 
          onClick={handleSharePNG}
          disabled={isSharing}
          variant="outline"
          className="rounded-full shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform hover:scale-105"
        >
          <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
          {isSharing ? "Preparing..." : "Share Impact"}
        </Button>
      </div>

      <PrintableReport 
        reportRef={reportRef}
        assessment={assessment}
        sim={sim}
        treesEquivalent={treesEquivalent}
        levelProgress={levelProgress}
        store={store}
        completedChallenges={completedChallenges}
        totalChallenges={totalChallenges}
        completionRate={completionRate}
        carbonSavedChallenges={carbonSavedChallenges}
        benchmarkChartData={benchmarkChartData}
        currentTier={currentTier}
        currentPercentile={currentPercentile}
        benchmarkInsight={benchmarkInsight}
        reductionEquivalents={reductionEquivalents}
        barChartData={barChartData}
        pieData={pieData}
        twinData={twinData}
        collective100k={collective100k}
      />

      <PrintableShareCard 
        shareCardRef={shareCardRef}
        assessment={assessment}
        sim={sim}
        treesEquivalent={treesEquivalent}
      />
    </>
  );
}
