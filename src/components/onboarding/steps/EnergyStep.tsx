import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProps, OnboardingFormData } from "./types";

export function EnergyStep({ setFormData }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Monthly Electricity Usage (kWh)</Label>
        <Input
          type="number"
          placeholder="e.g. 300"
          onChange={(e) =>
            setFormData((f: OnboardingFormData) => ({
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
            setFormData((f: OnboardingFormData) => ({
              ...f,
              energy: { ...f.energy, acUsageHours: Number(e.target.value) },
            }))
          }
        />
      </div>
    </div>
  );
}
