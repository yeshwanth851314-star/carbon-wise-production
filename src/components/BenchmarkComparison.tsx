"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import {
  calculateBenchmarkComparison,
  calculateSustainabilityTier,
  calculatePercentileEstimate,
  generateBenchmarkInsights
} from "@/lib/carbon/benchmarks";
import { Globe } from "lucide-react";

interface BenchmarkComparisonProps {
  footprint: number;
}

export function BenchmarkComparison({ footprint }: BenchmarkComparisonProps) {
  const { comparisons, tier, percentile, insight } = useMemo(() => {
    return {
      comparisons: calculateBenchmarkComparison(footprint),
      tier: calculateSustainabilityTier(footprint),
      percentile: calculatePercentileEstimate(footprint),
      insight: generateBenchmarkInsights(footprint)
    };
  }, [footprint]);

  const chartData = [
    { name: "You", value: footprint, fill: "#3b82f6" }, // Blue
    { name: "Sustainable", value: comparisons.sustainableTarget.value, fill: "#10b981" }, // Emerald
    { name: "India Avg", value: comparisons.indianAverage.value, fill: "#f59e0b" }, // Amber
    { name: "Global Avg", value: comparisons.globalAverage.value, fill: "#ef4444" } // Red
  ];

  // Screen reader description
  const srText = `Carbon Benchmark Comparison. Your footprint is ${footprint} kg CO2. Sustainable Target is ${comparisons.sustainableTarget.value}. Average Indian is ${comparisons.indianAverage.value}. Average Global is ${comparisons.globalAverage.value}.`;

  return (
    <Card className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-500" />
          Carbon Benchmark Comparison
        </CardTitle>
        <CardDescription>
          See how your footprint compares to the world.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Top Badges / Tier */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div>
            <p className="text-sm text-slate-500 mb-1">Sustainability Tier</p>
            <Badge className={`${tier.color} text-white border-none px-3 py-1 text-sm shadow-sm`}>
              {tier.name}
            </Badge>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-slate-500 mb-1">Global Percentile</p>
            <p className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Top {100 - percentile}% <span className="text-xs font-normal text-slate-500">({percentile}th percentile)</span>
            </p>
          </div>
        </div>

        {/* Dynamic Insight */}
        <div className={`p-4 rounded-xl border-l-4 ${
          insight.type === 'success' ? 'bg-green-50 border-green-500 dark:bg-green-900/20' :
          insight.type === 'info' ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20' :
          'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
        }`}>
          <h4 className={`font-bold ${
            insight.type === 'success' ? 'text-green-800 dark:text-green-300' :
            insight.type === 'info' ? 'text-blue-800 dark:text-blue-300' :
            'text-yellow-800 dark:text-yellow-300'
          }`}>{insight.title}</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            {insight.message}
          </p>
          <p className="text-xs text-slate-500 mt-2 italic">
            {tier.description}
          </p>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="h-64 w-full" role="region" aria-label="Benchmark Comparison Chart">
          <div className="sr-only">{srText}</div>
          <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                className="font-bold text-sm fill-slate-700 dark:fill-slate-300" 
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1000}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <LabelList dataKey="value" position="right" formatter={(val: any) => `${val} kg`} className="font-bold text-xs fill-slate-700 dark:fill-slate-300" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
