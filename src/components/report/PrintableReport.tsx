import { format } from "date-fns";
import { Leaf } from "lucide-react";
import { ReportSummary } from "./ReportSummary";
import { ReportCharts } from "./ReportCharts";
import { ReportEnvironmentalEquivalents } from "./ReportEnvironmentalEquivalents";
import { ReportFutureTwin } from "./ReportFutureTwin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PrintableReport(props: any) {
  const {
    reportRef, assessment, sim, treesEquivalent, levelProgress, store,
    completedChallenges, totalChallenges, completionRate, carbonSavedChallenges,
    benchmarkChartData, currentTier, currentPercentile, benchmarkInsight,
    reductionEquivalents, barChartData, pieData, twinData, collective100k,
  } = props;

  return (
    <div className="overflow-hidden h-0 w-0 absolute top-[-9999px] left-[-9999px]">
      <div 
        ref={reportRef} 
        className="w-[794px] bg-white text-slate-900 font-sans p-12 relative"
        style={{ minHeight: '1123px' }}
      >
        <div className="flex justify-between items-start mb-8 border-b-2 border-green-500 pb-6">
          <div>
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Leaf className="w-8 h-8" />
              <h1 className="text-3xl font-bold font-poppins tracking-tight">CarbonWise AI</h1>
            </div>
            <p className="text-lg text-slate-500 font-medium">Sustainability Impact Report</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800">Generated On</p>
            <p className="text-slate-600">{format(new Date(), "MMMM do, yyyy")}</p>
          </div>
        </div>

        <ReportSummary 
          assessment={assessment} sim={sim} treesEquivalent={treesEquivalent}
          levelProgress={levelProgress} store={store} completedChallenges={completedChallenges}
          totalChallenges={totalChallenges} completionRate={completionRate} carbonSavedChallenges={carbonSavedChallenges}
        />

        <ReportCharts 
          benchmarkChartData={benchmarkChartData} currentTier={currentTier}
          currentPercentile={currentPercentile} benchmarkInsight={benchmarkInsight}
          barChartData={barChartData} pieData={pieData}
        />

        <ReportEnvironmentalEquivalents reductionEquivalents={reductionEquivalents} />

        <ReportFutureTwin 
          twinData={twinData} collective100k={collective100k} store={store}
          sim={sim} treesEquivalent={treesEquivalent}
        />

        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center text-sm text-slate-400">
          <p>CarbonWise AI • Your Personal Climate Action Report</p>
          <p>Generated dynamically via html2canvas</p>
        </div>
      </div>
    </div>
  );
}
