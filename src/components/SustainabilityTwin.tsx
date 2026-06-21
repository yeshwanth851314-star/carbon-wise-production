"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { generatePersonalizedTwin, FutureScenario } from "@/lib/carbon/futureTwin";
import { NET_ZERO_TARGET } from "@/lib/carbon/futureTwin";
import { Globe2, Leaf, Trophy } from "lucide-react";

interface SustainabilityTwinProps {
  currentFootprint: number;
  simulatedFootprint: number | null;
  biggestImpactAction: string | null;
}

export function SustainabilityTwin({ currentFootprint, simulatedFootprint, biggestImpactAction }: SustainabilityTwinProps) {
  const twinData = useMemo(() => {
    return generatePersonalizedTwin(currentFootprint, simulatedFootprint, biggestImpactAction);
  }, [currentFootprint, simulatedFootprint, biggestImpactAction]);

  const { scenarioA, scenarioB, scenarioC } = twinData.scenarios;

  // Format data for Recharts
  const chartData = useMemo(() => {
    return scenarioA.timeline.map((point, index) => {
      return {
        year: point.year,
        scenarioA: point.footprint,
        scenarioB: scenarioB.timeline[index]?.footprint || point.footprint,
        scenarioC: scenarioC.timeline[index]?.footprint || point.footprint,
      };
    });
  }, [scenarioA, scenarioB, scenarioC]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-lg" role="tooltip">
          <p className="font-bold text-slate-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 text-sm mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600 dark:text-slate-400">{entry.name}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{entry.value} kg</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScenarioCard = ({ scenario, icon: Icon, colorClass, highlight }: { scenario: FutureScenario, icon: any, colorClass: string, highlight?: boolean }) => (
    <div className={`p-5 rounded-xl border ${highlight ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{scenario.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{scenario.futurePercentile}</p>
          </div>
        </div>
        <Badge variant={highlight ? "default" : "outline"} className={highlight ? "bg-green-600" : ""}>
          {scenario.futureTier.name}
        </Badge>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 h-10 line-clamp-2">
        {scenario.description}
      </p>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">2035 Projection</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{scenario.footprint2035} <span className="text-sm font-normal text-slate-500">kg</span></p>
        </div>
        {scenario.estimatedCarbonSaved > 0 && (
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Saved</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {(scenario.estimatedCarbonSaved / 1000).toFixed(1)} tons
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-sm" aria-label="Future Sustainability Twin Dashboard">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-blue-500" />
          <div>
            <CardTitle className="text-2xl font-poppins font-bold">Your Sustainability Twin</CardTitle>
            <CardDescription className="text-base">Personalized forecasting based on your habits and simulated goals.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Insights Section */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 mb-8">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Twin Intelligence Insights</h4>
          <ul className="space-y-2">
            {twinData.insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ScenarioCard 
            scenario={scenarioA} 
            icon={Globe2} 
            colorClass="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" 
          />
          <ScenarioCard 
            scenario={scenarioB} 
            icon={Leaf} 
            colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
            highlight={simulatedFootprint !== null && simulatedFootprint < currentFootprint}
          />
          <ScenarioCard 
            scenario={scenarioC} 
            icon={Trophy} 
            colorClass="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400" 
          />
        </div>

        {/* Chart Section */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Future Sustainability Timeline</h4>
          <div className="h-[300px] w-full" role="img" aria-label="Line chart showing your future carbon footprint across three scenarios">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36}/>
                <ReferenceLine y={NET_ZERO_TARGET} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Net-Zero Target', fill: '#22c55e', fontSize: 12 }} />
                
                <Area type="monotone" dataKey="scenarioA" name="Current Habits" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorA)" />
                <Area type="monotone" dataKey="scenarioB" name="Personal Growth" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorB)" />
                <Area type="monotone" dataKey="scenarioC" name="Climate Champion" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorC)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="sr-only">
            This chart shows three scenarios for your future footprint by 2035. 
            Current habits: {scenarioA.footprint2035} kg. 
            Personal growth: {scenarioB.footprint2035} kg. 
            Climate champion: {scenarioC.footprint2035} kg.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
