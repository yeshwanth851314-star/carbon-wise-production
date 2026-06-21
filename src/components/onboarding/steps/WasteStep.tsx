import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StepProps, OnboardingFormData } from "./types";

export function WasteStep({ setFormData }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Recycling Habits</Label>
        <Select
          onValueChange={(val: string | null) =>
            setFormData((f: OnboardingFormData) => ({
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
          onValueChange={(val: string | null) =>
            setFormData((f: OnboardingFormData) => ({
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
  );
}
