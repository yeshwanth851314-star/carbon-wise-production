import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProps, OnboardingFormData } from "./types";

export function TransportStep({ setFormData }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Primary Vehicle Type</Label>
        <Select
          onValueChange={(val: string | null) =>
            setFormData((f: OnboardingFormData) => ({
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
            <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
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
            setFormData((f: OnboardingFormData) => ({
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
  );
}
