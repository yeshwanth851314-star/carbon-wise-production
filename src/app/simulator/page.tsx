"use client";

import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SustainabilityReportGenerator } from "@/components/SustainabilityReport";
import { 
  calculateProjectedFootprint, 
  calculateAchievementUnlocks 
} from "@/lib/carbon/simulator";
import { calculateSustainabilityTier, TIERS } from '@/lib/carbon/benchmarks';
import { calculatePercentileEstimate } from '@/lib/carbon/percentiles';;
import { logger } from "@/lib/logger";
import { SimulatorControls } from "@/components/simulator/SimulatorControls";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";

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

  const baseEmissions = assessments[0]?.totalEmissions || 4500;

  const [carReduction, setCarReduction] = useState([0]);
  const [publicTransit, setPublicTransit] = useState([0]);
  const [bikeUsage, setBikeUsage] = useState([0]);
  const [switchEV, setSwitchEV] = useState(false);

  const [acReduction, setAcReduction] = useState([0]);
  const [elecReduction, setElecReduction] = useState([0]);
  const [renewableEnergy, setRenewableEnergy] = useState(false);

  const [meatReduction, setMeatReduction] = useState([0]);
  const [switchVeg, setSwitchVeg] = useState(false);

  const [shoppingReduction, setShoppingReduction] = useState([0]);
  const [plasticReduction, setPlasticReduction] = useState([0]);
  const [recyclingIncrease, setRecyclingIncrease] = useState([0]);

  const {
    projectedFootprint,
    reductionAmount,
    reductionPercentage,
    biggestImpactAction,
    impactMap
  } = useMemo(() => {
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
      baseTrans: assessments[0]?.transportScore,
      baseEnergy: assessments[0]?.energyScore,
      baseFood: assessments[0]?.foodScore,
      baseShop: assessments[0]?.shoppingScore,
      baseWaste: assessments[0]?.wasteScore
    });
  }, [
    baseEmissions, carReduction, publicTransit, bikeUsage, switchEV,
    acReduction, elecReduction, renewableEnergy, meatReduction, switchVeg,
    shoppingReduction, plasticReduction, recyclingIncrease, assessments
  ]);

  const currentTier = useMemo(() => calculateSustainabilityTier(baseEmissions), [baseEmissions]);
  const projectedTier = useMemo(() => calculateSustainabilityTier(projectedFootprint), [projectedFootprint]);
  const currentPercentile = useMemo(() => calculatePercentileEstimate(baseEmissions), [baseEmissions]);
  const projectedPercentile = useMemo(() => calculatePercentileEstimate(projectedFootprint), [projectedFootprint]);

  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier.name);
  const projectedTierIndex = TIERS.findIndex(t => t.name === projectedTier.name);
  const tierImprovement = currentTierIndex - projectedTierIndex;

  useEffect(() => {
    const unlocks = calculateAchievementUnlocks(reductionPercentage);
    unlocks.forEach(achievement => unlockAchievement(achievement));
  }, [reductionPercentage, unlockAchievement]);

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
      case "Reset":
        setCarReduction([0]); setAcReduction([0]); setPublicTransit([0]); setBikeUsage([0]); setSwitchEV(false);
        setElecReduction([0]); setRenewableEnergy(false); setMeatReduction([0]); setSwitchVeg(false);
        setShoppingReduction([0]); setPlasticReduction([0]); setRecyclingIncrease([0]);
        break;
    }
  };

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
        <SimulatorControls 
          applyPreset={applyPreset}
          carReduction={carReduction} setCarReduction={setCarReduction}
          publicTransit={publicTransit} setPublicTransit={setPublicTransit}
          switchEV={switchEV} setSwitchEV={setSwitchEV}
          acReduction={acReduction} setAcReduction={setAcReduction}
          renewableEnergy={renewableEnergy} setRenewableEnergy={setRenewableEnergy}
          meatReduction={meatReduction} setMeatReduction={setMeatReduction}
          switchVeg={switchVeg} setSwitchVeg={setSwitchVeg}
        />
        <SimulatorResults 
          baseEmissions={baseEmissions}
          projectedFootprint={projectedFootprint}
          reductionAmount={reductionAmount}
          reductionPercentage={reductionPercentage}
          currentTier={currentTier}
          projectedTier={projectedTier}
          currentPercentile={currentPercentile}
          projectedPercentile={projectedPercentile}
          tierImprovement={tierImprovement}
          biggestImpactAction={biggestImpactAction}
          loadingAI={loadingAI}
          actionPlanTasks={actionPlanTasks}
          toggleActionPlanTask={toggleActionPlanTask}
        />
      </div>
    </div>
  );
}
