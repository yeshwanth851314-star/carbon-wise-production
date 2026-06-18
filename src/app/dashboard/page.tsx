"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { useStore } from "@/lib/store";
import { SustainabilityReportGenerator } from "@/components/SustainabilityReport";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const store = useStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (store.assessments.length === 0) {
      router.push("/onboarding");
    }
  }, [store.assessments.length, router]);

  if (!mounted || store.assessments.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const latestAssessment = store.assessments[0];
  const historicalAssessments = [...store.assessments].reverse();

  // Calculate aggregate metrics
  const totalCarbonSaved = store.dailyLogs.reduce(
    (sum: number, log: { carbonSaved: number }) => sum + log.carbonSaved,
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
              Here&apos;s your environmental impact summary.
            </p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                Level {store.level}
              </p>
              <p className="text-xs text-slate-500">{store.xp} XP</p>
            </div>
            <button 
              onClick={() => {
                store.resetData();
                router.push("/");
              }}
              className="text-xs text-slate-400 hover:text-red-500 underline"
            >
              Reset Data
            </button>
          </div>
        </header>

        {store.simulationResult ? (
          <div className="flex justify-end mt-4">
            <SustainabilityReportGenerator />
          </div>
        ) : (
          <div className="text-right">
            <p className="text-sm text-slate-500 italic">Run the Simulator to unlock your Green Report.</p>
          </div>
        )}

        {/* AI Simulator Promo Banner */}
        <div 
          onClick={() => router.push('/simulator')}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                ✨ New Hackathon Feature
              </span>
            </div>
            <h2 className="text-2xl font-poppins font-bold mb-2">AI Carbon Reduction Simulator</h2>
            <p className="text-green-50 max-w-xl">
              What happens if you change your habits? Discover your highest-impact lifestyle changes, view future forecasts, and get a personalized 7-Day Action Plan powered by Gemini AI.
            </p>
            <div className="mt-4 flex items-center font-bold text-sm">
              Launch Simulator <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-64 h-64 translate-x-1/4 translate-y-1/4">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
        </div>

        <DashboardClient
          assessment={latestAssessment}
          historicalAssessments={historicalAssessments}
          recommendations={store.recommendations}
          metrics={{ totalCarbonSaved, treesEquivalent, waterSaved }}
          user={{ level: store.level, xp: store.xp, userChallenges: store.userChallenges }}
        />
      </div>
    </div>
  );
}
