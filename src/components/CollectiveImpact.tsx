"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { generateCollectiveImpact } from "@/lib/carbon/collectiveImpact";
import { Users, TreePine, Car, Plane, Droplets, Zap } from "lucide-react";

interface CollectiveImpactProps {
  annualReduction: number; // The user's projected or target reduction
}

const USER_SCALE = [100, 1000, 10000, 100000];

import { ElementType } from 'react';

const MetricCard = ({ icon: Icon, title, value, unit, colorClass }: { icon: ElementType, title: string, value: number, unit?: string, colorClass: string }) => (
  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">
        {new Intl.NumberFormat('en-US').format(value)}{unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);

export function CollectiveImpact({ annualReduction }: CollectiveImpactProps) {
  const [sliderIndex, setSliderIndex] = useState([3]); // Default to 100k

  const activeUsersCount = USER_SCALE[sliderIndex[0]];

  const collectiveData = useMemo(() => {
    return generateCollectiveImpact(annualReduction);
  }, [annualReduction]);

  const activeScenario = collectiveData.scenarios[activeUsersCount];

  return (
    <Card className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-sm" aria-label="Collective Climate Impact">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-500" />
          <div>
            <CardTitle className="text-2xl font-poppins font-bold">Collective Climate Impact</CardTitle>
            <CardDescription className="text-base">See what happens if a community followed your personalized plan.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Community Size</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {new Intl.NumberFormat('en-US').format(activeUsersCount)} <span className="text-lg font-normal text-slate-500">people</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Your Annual Reduction</p>
              <p className="font-semibold text-slate-900 dark:text-white">{Math.round(annualReduction)} kg CO₂</p>
            </div>
          </div>
          
          <Slider 
            value={sliderIndex} 
            min={0} 
            max={3} 
            step={1} 
            onValueChange={(val) => setSliderIndex(val as number[])}
            className="my-4"
            aria-label="Adjust community size"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={sliderIndex[0]}
          />
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>100</span>
            <span>1,000</span>
            <span>10,000</span>
            <span>100,000</span>
          </div>
        </div>

        {annualReduction > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard 
              icon={TreePine} 
              title="Trees Equivalent" 
              value={activeScenario.equivalents.treesEquivalent} 
              unit="trees/yr"
              colorClass="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
            />
            <MetricCard 
              icon={Car} 
              title="Cars Removed" 
              value={Math.round(activeScenario.totalCO2Reduced / 4600)} 
              unit="cars/yr"
              colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
            />
            <MetricCard 
              icon={Plane} 
              title="Flights Avoided" 
              value={activeScenario.equivalents.flightsEquivalent} 
              unit="flights"
              colorClass="bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400"
            />
            <MetricCard 
              icon={Droplets} 
              title="Water Saved" 
              value={activeScenario.equivalents.waterEquivalent} 
              unit="liters"
              colorClass="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400"
            />
            <MetricCard 
              icon={Zap} 
              title="Energy Saved" 
              value={activeScenario.equivalents.householdEnergyEquivalent} 
              unit="months"
              colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
            />
            <div className="p-4 rounded-xl bg-purple-600 text-white flex flex-col justify-center items-center text-center">
              <p className="text-xs font-medium text-purple-200 mb-1">Total CO₂ Reduced</p>
              <p className="text-2xl font-bold">
                {activeScenario.totalCO2Reduced > 1000 
                  ? `${(activeScenario.totalCO2Reduced / 1000).toFixed(1)} tons` 
                  : `${activeScenario.totalCO2Reduced} kg`}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400">Reduce your footprint in the simulator to see your collective impact grow.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
