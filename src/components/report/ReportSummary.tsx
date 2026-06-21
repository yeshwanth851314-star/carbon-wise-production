import { Target, Trophy, Star, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportSummary({ assessment, sim, treesEquivalent, levelProgress, store, completedChallenges, totalChallenges, completionRate, carbonSavedChallenges }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><Target className="text-blue-500" /> Executive Summary</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase">Current Footprint</p>
          <p className="text-2xl font-bold text-red-500">{assessment.totalEmissions} <span className="text-sm">kg CO₂/year</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase">Projected Footprint</p>
          <p className="text-2xl font-bold text-green-600">{sim.projectedFootprint} <span className="text-sm">kg CO₂/year</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase">Reduction</p>
          <p className="text-2xl font-bold text-blue-500">-{sim.reductionPercentage}%</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase">Sustainability Score</p>
          <p className="text-2xl font-bold text-purple-600">{assessment.sustainabilityScore}/100</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase">Trees Equivalent</p>
          <p className="text-2xl font-bold text-emerald-600">{treesEquivalent}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase">Biggest Impact</p>
          <p className="text-xl font-bold text-yellow-600">{sim.biggestImpactAction}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><Trophy className="text-yellow-500" /> Sustainability Achievements</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg text-slate-700">Level {store.level}</span>
            <span className="text-slate-500 font-semibold">{store.xp} XP</span>
          </div>
          <Progress value={levelProgress} className="h-3 mb-2 bg-slate-100" />
          <p className="text-xs text-slate-400 text-right mb-6">{store.xp} / {store.level * 1000} XP to next level</p>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Unlocked Badges</h3>
          <div className="flex flex-wrap gap-2">
            {store.unlockedAchievements.length > 0 ? store.unlockedAchievements.map((badge: string) => (
              <div key={badge} className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1 border border-yellow-200">
                <Star className="w-3 h-3" /> {badge}
              </div>
            )) : <span className="text-sm text-slate-400 italic">No badges unlocked yet.</span>}
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Award className="w-4 h-4"/> Challenge Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-600">Challenges Completed</span>
              <span className="font-bold text-slate-800">{completedChallenges} / {totalChallenges}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-600">Completion Rate</span>
              <span className="font-bold text-blue-600">{completionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Carbon Saved</span>
              <span className="font-bold text-green-600">{Math.round(carbonSavedChallenges)} kg CO₂/year</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
