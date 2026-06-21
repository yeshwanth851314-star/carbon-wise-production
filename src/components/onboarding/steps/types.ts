import { Dispatch, SetStateAction } from "react";

export interface OnboardingFormData {
  transport: { vehicleType: string, weeklyDistance: number };
  energy: { monthlyElectricity: number, acUsageHours: number };
  food: { dietType: string };
  shopping: { frequency: string };
  waste: { recycling: string, plasticUsage: string };
}

export interface StepProps {
  formData?: OnboardingFormData;
  setFormData: Dispatch<SetStateAction<OnboardingFormData>>;
}
