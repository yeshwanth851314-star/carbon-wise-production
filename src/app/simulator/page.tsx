"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Zap,
  Utensils,
  TreePine,
  Lightbulb,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { SustainabilityReportGenerator } from "@/components/SustainabilityReport";
import { 
  calculateProjectedFootprint, 
  calculateForecast, 
  calculateAchievementUnlocks 
} from "@/lib/carbon/simulator";
import { 
  calculateSustainabilityTier, 
  calculatePercentileEstimate, 
  TIERS 
} from "@/lib/carbon/benchmarks";
import { EnvironmentalEquivalents } from "@/components/EnvironmentalEquivalents";
import { SustainabilityTwin } from "@/components/SustainabilityTwin";
import { CollectiveImpact } from "@/components/CollectiveImpact";
import { logger } from "@/lib/logger";

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SimulatorPage() {
  const router = useRouter();
  const { assessments, unlockAchievement, actionPlanTasks, setActionPlan, toggleActionPlanTask, setSimulationResult } = useStore();

  // Baseline from assessments, or global fallback
  const baseEmissions = assessments[0]?.totalEmissions || 4500; // kg CO2/year

  // Simulator controls state
  const [carReduction, setCarReduction] = useState([0]); // 0-100%
  const [publicTransit, setPublicTransit] = useState([0]); // 0-100%
  const [bikeUsage, setBikeUsage] = useState([0]); // 0-100%
  const [switchEV, setSwitchEV] = useState(false);

  const [acReduction, setAcReduction] = useState([0]); // 0-100%
  const [elecReduction, setElecReduction] = useState([0]); // 0-100%
  const [renewableEnergy, setRenewableEnergy] = useState(false);

  const [meatReduction, setMeatReduction] = useState([0]); // 0-100%
  const [switchVeg, setSwitchVeg] = useState(false);

  const [shoppingReduction, setShoppingReduction] = useState([0]); // 0-100%

  const [plasticReduction, setPlasticReduction] = useState([0]); // 0-100%
  const [recyclingIncrease, setRecyclingIncrease] = useState([0]); // 0-100%

  // Simulation calculations
  const {
    projectedFootprint,
    reductionAmount,
    reductionPercentage,
    biggestImpactAction,
    impactMap
  } = useMemo(() => {
    const baseTrans = assessments[0]?.transportScore;
    const baseEnergy = assessments[0]?.energyScore;
    const baseFood = assessments[0]?.foodScore;
    const baseShop = assessments[0]?.shoppingScore;
    const baseWaste = assessments[0]?.wasteScore;

    return calculateProjectedFootprint({
      baseEmissions,
      carReduction: carReduction[0],
      publicTransit: publicTransit[0],
      bikeUsage: bikeUsage[0],
      switchEV,
      acReduction: acReduction[0],
      elecReduction: elecReduction[0],
      renewableEnergy,
      meatReduction: meatReduction[0],
      switchVeg,
      shoppingReduction: shoppingReduction[0],
      plasticReduction: plasticReduction[0],
      recyclingIncrease: recyclingIncrease[0],
      baseTrans,
      baseEnergy,
      baseFood,
      baseShop,
      baseWaste
    });
  }, [
    baseEmissions, carReduction, publicTransit, bikeUsage, switchEV,
    acReduction, elecReduction, renewableEnergy, meatReduction, switchVeg,
    shoppingReduction, plasticReduction, recyclingIncrease, assessments
  ]);

  // Forecasts
  const { sixMonthForecast, oneYearForecast } = calculateForecast(projectedFootprint);

  // Benchmarks & Tiers
  const currentTier = useMemo(() => calculateSustainabilityTier(baseEmissions), [baseEmissions]);
  const projectedTier = useMemo(() => calculateSustainabilityTier(projectedFootprint), [projectedFootprint]);
  const currentPercentile = useMemo(() => calculatePercentileEstimate(baseEmissions), [baseEmissions]);
  const projectedPercentile = useMemo(() => calculatePercentileEstimate(projectedFootprint), [projectedFootprint]);

  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier.name);
  const projectedTierIndex = TIERS.findIndex(t => t.name === projectedTier.name);
  const tierImprovement = currentTierIndex - projectedTierIndex; // Higher is better (lower index)

  // Gamification Unlocks
  useEffect(() => {
    const unlocks = calculateAchievementUnlocks(reductionPercentage);
    unlocks.forEach(achievement => unlockAchievement(achievement));
  }, [reductionPercentage, unlockAchievement]);

  // AI Debounce & Fetch
  const debouncedReduction = useDebounce(reductionPercentage, 1500);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    setSimulationResult({
      projectedFootprint,
      reductionAmount,
      reductionPercentage,
      biggestImpactAction: biggestImpactAction?.name || null
    });

    let isMounted = true;
    if (debouncedReduction > 0 && biggestImpactAction) {
      const fetchPlan = async () => {
        if (isMounted) setLoadingAI(true);
        try {
          const res = await fetch("/api/simulate-insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentFootprint: baseEmissions,
              projectedFootprint,
              biggestImpactAction: biggestImpactAction.name,
              selectedChanges: impactMap.map(i => i.name)
            })
          });
          const data = await res.json();
          if (isMounted && data.plan) setActionPlan(data.plan);
        } catch (error) {
          logger.error("Failed to fetch AI plan", error);
        } finally {
          if (isMounted) setLoadingAI(false);
        }
      };
      fetchPlan();
    }
    return () => { isMounted = false; };
  }, [debouncedReduction, biggestImpactAction, baseEmissions, projectedFootprint, impactMap, setActionPlan, reductionAmount, reductionPercentage, setSimulationResult]);

  // Chart Data
  const chartData = [
    { name: "Current", value: baseEmissions, fill: "#ef4444" },
    { name: "Projected", value: projectedFootprint, fill: "#eab308" },
    { name: "6 Months", value: sixMonthForecast, fill: "#22c55e" },
    { name: "1 Year", value: oneYearForecast, fill: "#16a34a" },
  ];

  const applyPreset = (preset: string) => {
    setSwitchEV(false); setRenewableEnergy(false); setSwitchVeg(false);
    switch(preset) {
      case "Eco Beginner":
        setCarReduction([10]); setAcReduction([10]); setPlasticReduction([20]); setRecyclingIncrease([20]);
        break;
      case "Green Commuter":
        setCarReduction([50]); setPublicTransit([40]); setBikeUsage([20]);
        break;
      case "Climate Warrior":
        setSwitchVeg(true); setRenewableEnergy(true); setShoppingReduction([50]); setCarReduction([80]);
        break;
    }
  }

  return (
    <div className="min-h-screen bg-transparent p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} aria-label="Go back to dashboard">
            <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-poppins font-bold flex items-center gap-2">
              <Lightbulb className="text-yellow-500 w-8 h-8" aria-hidden="true" /> 
              AI Carbon Reduction Simulator
            </h1>
            <p className="text-slate-500 dark:text-slate-400">What happens if I change my habits?</p>
          </div>
        </div>
        <div>
          <SustainabilityReportGenerator />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANE: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
            <CardHeader>
              <CardTitle>Scenario Presets</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200" onClick={() => applyPreset("Eco Beginner")}>Eco Beginner</Badge>
              <Badge className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200" onClick={() => applyPreset("Green Commuter")}>Green Commuter</Badge>
              <Badge className="cursor-pointer bg-purple-100 text-purple-800 hover:bg-purple-200" onClick={() => applyPreset("Climate Warrior")}>Climate Warrior</Badge>
              <Badge className="cursor-pointer bg-slate-100 text-slate-800 hover:bg-slate-200" onClick={() => {
                setCarReduction([0]); setAcReduction([0]); setPublicTransit([0]); setBikeUsage([0]); setSwitchEV(false);
                setElecReduction([0]); setRenewableEnergy(false); setMeatReduction([0]); setSwitchVeg(false);
                setShoppingReduction([0]); setPlasticReduction([0]); setRecyclingIncrease([0]);
              }}>Reset</Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
            <CardHeader><CardTitle className="flex items-center gap-2"><Car className="w-5 h-5 text-blue-500"/> Transportation</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between"><label id="label-car-travel" className="text-sm">Reduce Car Travel</label><span className="text-sm font-bold">{carReduction[0]}%</span></div>
                <Slider aria-labelledby="label-car-travel" value={carReduction} onValueChange={(val) => setCarReduction(val as number[])} max={100} step={5} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label id="label-public-transit" className="text-sm">Increase Public Transit</label><span className="text-sm font-bold">{publicTransit[0]}%</span></div>
                <Slider aria-labelledby="label-public-transit" value={publicTransit} onValueChange={(val) => setPublicTransit(val as number[])} max={100} step={5} />
              </div>
              <div className="flex items-center justify-between">
                <label id="label-switch-ev" className="text-sm font-medium">Switch to Electric Vehicle</label>
                <Switch aria-labelledby="label-switch-ev" checked={switchEV} onCheckedChange={setSwitchEV} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500"/> Energy</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between"><label id="label-ac-reduce" className="text-sm">Reduce AC Usage</label><span className="text-sm font-bold">{acReduction[0]}%</span></div>
                <Slider aria-labelledby="label-ac-reduce" value={acReduction} onValueChange={(val) => setAcReduction(val as number[])} max={100} step={5} />
              </div>
              <div className="flex items-center justify-between">
                <label id="label-renewable" className="text-sm font-medium">Use 100% Renewable Energy</label>
                <Switch aria-labelledby="label-renewable" checked={renewableEnergy} onCheckedChange={setRenewableEnergy} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
            <CardHeader><CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5 text-orange-500"/> Food</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between"><label id="label-meat-reduce" className="text-sm">Reduce Meat Consumption</label><span className="text-sm font-bold">{meatReduction[0]}%</span></div>
                <Slider aria-labelledby="label-meat-reduce" value={meatReduction} onValueChange={(val) => setMeatReduction(val as number[])} max={100} step={5} />
              </div>
              <div className="flex items-center justify-between">
                <label id="label-veg" className="text-sm font-medium">Switch to Vegetarian Diet</label>
                <Switch aria-labelledby="label-veg" checked={switchVeg} onCheckedChange={setSwitchVeg} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANE: Results & Analysis */}
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
            biggestImpactAction={biggestImpactAction?.name ?? null}
          />

          {/* Collective Impact */}
          <CollectiveImpact 
            annualReduction={reductionAmount}
          />

          {/* AI 7-Day Action Plan */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500"/> Your 7-Day Green Plan
              </CardTitle>
              {loadingAI && <span className="text-xs text-slate-400 animate-pulse">Generating AI Plan...</span>}
            </CardHeader>
            <CardContent>
              {actionPlanTasks.length > 0 ? (
                <div className="space-y-3">
                  {actionPlanTasks.map((task) => (
                    <div 
                      key={task.day} 
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${task.completed ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-slate-50 border-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}
                      onClick={() => toggleActionPlanTask(task.day)}
                      onKeyDown={(e) => e.key === 'Enter' && toggleActionPlanTask(task.day)}
                      tabIndex={0}
                      role="checkbox"
                      aria-checked={task.completed}
                    >
                      <div className={`p-1 rounded-full ${task.completed ? 'bg-green-500 text-white' : 'border-2 border-slate-300 text-transparent'}`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase ${task.completed ? 'text-green-600' : 'text-slate-500'}`}>Day {task.day}</p>
                        <p className={`text-sm ${task.completed ? 'text-green-800 line-through dark:text-green-200' : 'text-slate-700 dark:text-slate-300'}`}>{task.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 border-2 border-dashed rounded-xl">
                  Adjust the sliders to generate your personalized AI action plan!
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
