import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StepProps, OnboardingFormData } from "./types";

export function ShoppingStep({ setFormData }: StepProps) {
  return (
    <div className="space-y-2">
      <Label>Online/Retail Shopping Frequency</Label>
      <Select
        onValueChange={(val: string | null) =>
          setFormData((f: OnboardingFormData) => ({ ...f, shopping: { frequency: val || "" } }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Rarely">Rarely</SelectItem>
          <SelectItem value="Monthly">Monthly</SelectItem>
          <SelectItem value="Weekly">Weekly</SelectItem>
          <SelectItem value="Frequent">Frequent (Multiple times a week)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
