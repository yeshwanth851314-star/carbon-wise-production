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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Leaf,
  Car,
  Zap,
  Utensils,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { saveAssessment } from "@/app/actions";

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
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Vehicle Type</Label>
            <Select
              onValueChange={(val: any) =>
                setFormData((f) => ({
                  ...f,
                  transport: { ...f.transport, vehicleType: val || "" },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline Car">Gasoline Car</SelectItem>
                <SelectItem value="Electric Vehicle">
                  Electric Vehicle
                </SelectItem>
                <SelectItem value="Public Transit">Public Transit</SelectItem>
                <SelectItem value="Bicycle/Walk">Bicycle / Walk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Weekly Travel Distance (km)</Label>
            <Input
              type="number"
              placeholder="e.g. 150"
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  transport: {
                    ...f.transport,
                    weeklyDistance: Number(e.target.value),
                  },
                }))
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: "Energy Usage",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Monthly Electricity Usage (kWh)</Label>
            <Input
              type="number"
              placeholder="e.g. 300"
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  energy: {
                    ...f.energy,
                    monthlyElectricity: Number(e.target.value),
                  },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Daily AC Usage (Hours)</Label>
            <Input
              type="number"
              placeholder="e.g. 4"
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  energy: { ...f.energy, acUsageHours: Number(e.target.value) },
                }))
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: "Food Habits",
      icon: <Utensils className="w-6 h-6 text-orange-500" />,
      content: (
        <div className="space-y-2">
          <Label>Diet Type</Label>
          <Select
            onValueChange={(val: any) =>
              setFormData((f) => ({ ...f, food: { dietType: val || "" } }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select diet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vegan">Vegan</SelectItem>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
              <SelectItem value="Heavy Meat">Heavy Meat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      title: "Shopping",
      icon: <ShoppingBag className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-2">
          <Label>Online/Retail Shopping Frequency</Label>
          <Select
            onValueChange={(val: any) =>
              setFormData((f) => ({ ...f, shopping: { frequency: val || "" } }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Rarely">Rarely</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Frequent">
                Frequent (Multiple times a week)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      title: "Waste & Recycling",
      icon: <Trash2 className="w-6 h-6 text-slate-500" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Recycling Habits</Label>
            <Select
              onValueChange={(val: any) =>
                setFormData((f) => ({
                  ...f,
                  waste: { ...f.waste, recycling: val || "" },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recycling habit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Always">Always Recycle</SelectItem>
                <SelectItem value="Sometimes">Sometimes</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Single-Use Plastic Usage</Label>
            <Select
              onValueChange={(val: any) =>
                setFormData((f) => ({
                  ...f,
                  waste: { ...f.waste, plasticUsage: val || "" },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select plastic usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
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

  const handleNext = async () => {
    if (!validateStep(step)) {
      alert("Please fill out all fields for this step.");
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await saveAssessment(formData);
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
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
              onClick={() => setStep(step - 1)}
              disabled={step === 0 || loading}
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
