import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StepProps, OnboardingFormData } from "./types";

export function FoodStep({ setFormData }: StepProps) {
  return (
    <div className="space-y-2">
      <Label>Diet Type</Label>
      <Select
        onValueChange={(val: string | null) =>
          setFormData((f: OnboardingFormData) => ({ ...f, food: { dietType: val || "" } }))
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
  );
}
