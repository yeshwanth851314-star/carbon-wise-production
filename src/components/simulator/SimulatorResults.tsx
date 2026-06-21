import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SustainabilityTwin } from "@/components/SustainabilityTwin";
import { CollectiveImpact } from "@/components/CollectiveImpact";
import { SimulatorActionPlan } from "./SimulatorActionPlan";

import { SustainabilityTier } from "@/lib/carbon/benchmarks";

interface SimulatorResultsProps {
  baseEmissions: number;
  projectedFootprint: number;
  reductionAmount: number;
  reductionPercentage: number;
  currentTier: SustainabilityTier;
  projectedTier: SustainabilityTier;
  currentPercentile: number;
  projectedPercentile: number;
  tierImprovement: number;
  biggestImpactAction: { name: string; saving: number } | null;
  loadingAI: boolean;
  actionPlanTasks: Array<{day: number, task: string, completed: boolean}>;
  toggleActionPlanTask: (day: number) => void;
}

export function SimulatorResults({
  baseEmissions,
  projectedFootprint,
  reductionAmount,
  reductionPercentage,
  currentTier,
  projectedTier,
  currentPercentile,
  projectedPercentile,
  tierImprovement,
  biggestImpactAction,
  loadingAI,
  actionPlanTasks,
  toggleActionPlanTask
}: SimulatorResultsProps) {
  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.3 }} key={baseEmissions}>
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none h-full">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">Current</p>
              <p className="text-2xl font-bold text-red-500">{baseEmissions}</p>
              <p className="text-xs text-slate-400">kg CO₂/year</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }} key={projectedFootprint}>
          <Card className="bg-green-50 dark:bg-green-900/20 shadow-lg border-none h-full border-b-4 border-b-green-500">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">Projected</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{projectedFootprint}</p>
              <p className="text-xs text-slate-400">kg CO₂/year</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.3 }} key={reductionAmount}>
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none h-full">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">Reduction</p>
              <p className="text-2xl font-bold text-blue-500">-{reductionAmount}</p>
              <p className="text-xs text-slate-400">kg CO₂/year</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.3 }} key={reductionPercentage}>
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none h-full">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">Improvement</p>
              <p className="text-3xl font-bold text-purple-500">{reductionPercentage}%</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tier Progress & Benchmark Position */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1 w-full">
              <p className="text-sm text-slate-500 uppercase font-bold mb-2">Tier Progress</p>
              <div className="flex items-center gap-3">
                <Badge className={`${currentTier.color} text-white border-none shadow-sm`}>{currentTier.name}</Badge>
                <span className="text-slate-400">→</span>
                <Badge className={`${projectedTier.color} text-white border-none shadow-sm`}>{projectedTier.name}</Badge>
              </div>
            </div>
            <div className="flex-1 w-full text-left md:text-right">
              <p className="text-sm text-slate-500 uppercase font-bold mb-2">Global Percentile</p>
              <div className="flex items-center md:justify-end gap-2 font-bold">
                <span className="text-slate-500 line-through text-lg">Top {100 - currentPercentile}%</span>
                <span className="text-green-500 text-2xl">Top {100 - projectedPercentile}%</span>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {tierImprovement > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                🌟 Improvement: You move up {tierImprovement === 1 ? 'one sustainability tier' : `${tierImprovement} sustainability tiers`}!
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Biggest Impact Change Banner */}
      <AnimatePresence mode="popLayout">
        {biggestImpactAction && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={biggestImpactAction.name}
          >
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 shadow-lg border-none border-l-4 border-l-yellow-500">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-bold uppercase">🌟 Biggest Impact Change</p>
                  <h3 className="text-xl font-bold">{biggestImpactAction.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">-{Math.round(biggestImpactAction.saving)} kg</p>
                  <p className="text-xs text-slate-500">CO₂ / year</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sustainability Twin */}
      <SustainabilityTwin 
        currentFootprint={baseEmissions}
        simulatedFootprint={projectedFootprint}
      />

      {/* Collective Impact */}
      <CollectiveImpact 
        annualReduction={reductionAmount}
      />

      <SimulatorActionPlan
        loadingAI={loadingAI}
        actionPlanTasks={actionPlanTasks}
        toggleActionPlanTask={toggleActionPlanTask}
      />
    </div>
  );
}
