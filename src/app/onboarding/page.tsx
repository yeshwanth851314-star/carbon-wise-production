"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import { ArrowLeft, ArrowRight, Car, Leaf, ShoppingBag, Trash2, Utensils, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { TransportStep, EnergyStep, FoodStep, ShoppingStep, WasteStep } from "@/components/onboarding/OnboardingSteps";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transport: { vehicleType: "", weeklyDistance: 0 },
    energy: { monthlyElectricity: 0, acUsageHours: 0 },
    food: { dietType: "" },
    shopping: { frequency: "" },
    waste: { recycling: "", plasticUsage: "" },
  });

  const steps = [
    {
      title: "Transportation",
      icon: <Car className="w-6 h-6 text-green-500" />,
      content: <TransportStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Energy Usage",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      content: <EnergyStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Food Habits",
      icon: <Utensils className="w-6 h-6 text-orange-500" />,
      content: <FoodStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Shopping",
      icon: <ShoppingBag className="w-6 h-6 text-purple-500" />,
      content: <ShoppingStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Waste & Recycling",
      icon: <Trash2 className="w-6 h-6 text-slate-500" />,
      content: <WasteStep formData={formData} setFormData={setFormData} />,
    },
  ];

  const validateStep = (s: number) => {
    switch (s) {
      case 0:
        return formData.transport.vehicleType !== "";
      case 1:
        return true; // Energy default to 0 is okay
      case 2:
        return formData.food.dietType !== "";
      case 3:
        return formData.shopping.frequency !== "";
      case 4:
        return (
          formData.waste.recycling !== "" && formData.waste.plasticUsage !== ""
        );
      default:
        return true;
    }
  };

  const addAssessment = useStore((state) => state.addAssessment);

  const handleNext = () => {
    if (!validateStep(step)) {
      alert("Please fill out all fields for this step.");
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const weeksInYear = 52;
        const daysInYear = 365;

        // 1. Transport
        const distancePerYear = formData.transport.weeklyDistance * weeksInYear;
        let transportFactor = 0;
        if (formData.transport.vehicleType === "Gasoline Car") transportFactor = 0.192;
        else if (formData.transport.vehicleType === "Electric Vehicle") transportFactor = 0.053;
        else if (formData.transport.vehicleType === "Public Transit") transportFactor = 0.105;
        else transportFactor = 0;
        const transportScore = distancePerYear * transportFactor;

        // 2. Energy
        const baseElectricity = formData.energy.monthlyElectricity * 12 * 0.475;
        const acElectricity = formData.energy.acUsageHours * daysInYear * 1.5 * 0.475;
        const energyScore = baseElectricity + acElectricity;

        // 3. Food
        let foodScore = 2500;
        if (formData.food.dietType === "Heavy Meat") foodScore = 3300;
        else if (formData.food.dietType === "Vegetarian") foodScore = 1700;
        else if (formData.food.dietType === "Vegan") foodScore = 1500;

        // 4. Shopping
        let shoppingScore = 400;
        if (formData.shopping.frequency === "Frequent") shoppingScore = 1200;
        else if (formData.shopping.frequency === "Weekly") shoppingScore = 800;
        else if (formData.shopping.frequency === "Rarely") shoppingScore = 200;

        // 5. Waste
        let wasteScore = 0;
        if (formData.waste.plasticUsage === "High") wasteScore += 400;
        else if (formData.waste.plasticUsage === "Medium") wasteScore += 200;
        else if (formData.waste.plasticUsage === "Low") wasteScore += 50;

        if (formData.waste.recycling === "Never") wasteScore += 300;
        else if (formData.waste.recycling === "Sometimes") wasteScore += 150;

        const totalEmissions = Math.round(transportScore + energyScore + foodScore + shoppingScore + wasteScore);
        const sustainabilityScore = Math.max(0, Math.min(100, Math.round(100 - (totalEmissions / 100))));

        addAssessment({
          transportScore,
          energyScore,
          foodScore,
          shoppingScore,
          wasteScore,
          totalEmissions,
          sustainabilityScore
        });
        
        router.push("/dashboard");
      } catch (error) {
        logger.error("Failed to complete onboarding", error);
        alert("Failed to save assessment. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex items-center gap-2">
        <Leaf className="w-10 h-10 text-green-500" />
        <h1 className="text-3xl font-poppins font-bold">
          Calculate Your Footprint
        </h1>
      </div>

      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 transform -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i <= step ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <Card className="w-full border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  {steps[step].icon}
                </div>
                <CardTitle className="text-2xl font-poppins">
                  {steps[step].title}
                </CardTitle>
              </CardHeader>
              <CardContent>{steps[step].content}</CardContent>
            </motion.div>
          </AnimatePresence>

          <CardFooter className="flex justify-between mt-4 border-t pt-6 border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 0) {
                  router.push("/");
                } else {
                  setStep(step - 1);
                }
              }}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading
                ? "Calculating..."
                : step === steps.length - 1
                  ? "Get Results"
                  : "Next"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
