"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp, Users } from "lucide-react";
import { 
  calculateCommunityRanking, 
  calculateCommunityInsights, 
  calculateNextTierProgress 
} from "@/lib/carbon/community";

interface CommunityBenchmarkProps {
  userScore: number;
  userFootprint: number;
}

export function CommunityBenchmark({ userScore, userFootprint }: CommunityBenchmarkProps) {
  const stats = useMemo(() => calculateCommunityRanking(userScore, []), [userScore]);
  const insights = useMemo(() => calculateCommunityInsights(stats), [stats]);
  const tierProgress = useMemo(() => calculateNextTierProgress(userFootprint), [userFootprint]);

  return (
    <Card className="shadow-lg border-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <CardTitle className="text-xl">Community Benchmark</CardTitle>
            <CardDescription>See how you compare to other CarbonWise users</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Your Score</p>
            <p className="text-3xl font-bold text-blue-600">{stats.userScore}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Community Avg</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.averageScore}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Top 25%</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.top25Score}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
              <Trophy className="w-4 h-4 text-yellow-400 opacity-20" />
            </div>
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Top 10%</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.top10Score}</p>
          </div>
        </div>

        {/* Rank & Percentile */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Your Rank</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.userRank}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Percentile</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">Top {100 - stats.userPercentile}%</p>
          </div>
        </div>

        {/* Next Tier Progress */}
        <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Progress To Next Tier</h3>
          </div>
          
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs text-slate-500 font-medium">Current Tier</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">{tierProgress.currentTier}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Next Tier</p>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">{tierProgress.nextTier || "Max Tier Reached!"}</p>
            </div>
          </div>

          <Progress value={tierProgress.progressPercent} className="h-3 mb-2" />
          
          {tierProgress.nextTier && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Progress: {tierProgress.progressPercent}%</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium text-right">
                Reduction Needed: {tierProgress.reductionNeeded} kg CO₂/year
              </span>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-500 uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Community Insights
          </h3>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                {insight}
              </li>
            ))}
          </ul>
        </div>

      </CardContent>
    </Card>
  );
}
