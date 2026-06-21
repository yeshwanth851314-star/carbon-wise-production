"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Car, Lightbulb, Home, Plane, Droplets } from "lucide-react";
import { calculateEnvironmentalEquivalents } from "@/lib/carbon/equivalents";

interface EnvironmentalEquivalentsProps {
  kgCO2: number;
  title?: string;
  isReduction?: boolean;
}

export function EnvironmentalEquivalents({ kgCO2, title = "Environmental Impact Equivalents", isReduction = false }: EnvironmentalEquivalentsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    treesEquivalent: 0,
    drivingEquivalent: 0,
    electricityEquivalent: 0,
    householdEnergyEquivalent: 0,
    flightsEquivalent: 0,
    waterEquivalent: 0,
  });

  // Animate the values on change
  useEffect(() => {
    const targetValues = calculateEnvironmentalEquivalents(kgCO2);
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        treesEquivalent: Math.round(targetValues.treesEquivalent * progress),
        drivingEquivalent: Math.round(targetValues.drivingEquivalent * progress),
        electricityEquivalent: Math.round(targetValues.electricityEquivalent * progress),
        householdEnergyEquivalent: Math.round(targetValues.householdEnergyEquivalent * progress * 10) / 10,
        flightsEquivalent: Math.round(targetValues.flightsEquivalent * progress * 10) / 10,
        waterEquivalent: Math.round(targetValues.waterEquivalent * progress),
      });

      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [kgCO2]);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <TreePine className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {isReduction ? '+' : ''}{animatedValues.treesEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">Trees {isReduction ? 'Saved' : 'Needed'}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Car className="w-8 h-8 text-slate-500 mb-2" />
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              {isReduction ? '-' : ''}{animatedValues.drivingEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 font-medium">km Driving</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Lightbulb className="w-8 h-8 text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {animatedValues.electricityEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 font-medium">LED Hours</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Home className="w-8 h-8 text-indigo-500 mb-2" />
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              {animatedValues.householdEnergyEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-500 font-medium">Months Home Energy</p>
          </CardContent>
        </Card>

        <Card className="bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Plane className="w-8 h-8 text-sky-500 mb-2" />
            <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">
              {isReduction ? '-' : ''}{animatedValues.flightsEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-sky-600 dark:text-sky-500 font-medium">Short Flights</p>
          </CardContent>
        </Card>

        <Card className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <Droplets className="w-8 h-8 text-cyan-500 mb-2" />
            <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">
              {animatedValues.waterEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-cyan-600 dark:text-cyan-500 font-medium">Liters Water</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
