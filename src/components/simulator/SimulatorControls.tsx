import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Car, Zap, Utensils } from "lucide-react";

interface SimulatorControlsProps {
  applyPreset: (preset: string) => void;
  carReduction: number[]; setCarReduction: (val: number[]) => void;
  publicTransit: number[]; setPublicTransit: (val: number[]) => void;
  switchEV: boolean; setSwitchEV: (val: boolean) => void;
  acReduction: number[]; setAcReduction: (val: number[]) => void;
  renewableEnergy: boolean; setRenewableEnergy: (val: boolean) => void;
  meatReduction: number[]; setMeatReduction: (val: number[]) => void;
  switchVeg: boolean; setSwitchVeg: (val: boolean) => void;
}

export function SimulatorControls({
  applyPreset,
  carReduction, setCarReduction,
  publicTransit, setPublicTransit,
  switchEV, setSwitchEV,
  acReduction, setAcReduction,
  renewableEnergy, setRenewableEnergy,
  meatReduction, setMeatReduction,
  switchVeg, setSwitchVeg
}: SimulatorControlsProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
        <CardHeader>
          <CardTitle>Scenario Presets</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200" onClick={() => applyPreset("Eco Beginner")}>Eco Beginner</Badge>
          <Badge className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200" onClick={() => applyPreset("Green Commuter")}>Green Commuter</Badge>
          <Badge className="cursor-pointer bg-purple-100 text-purple-800 hover:bg-purple-200" onClick={() => applyPreset("Climate Warrior")}>Climate Warrior</Badge>
          <Badge className="cursor-pointer bg-slate-100 text-slate-800 hover:bg-slate-200" onClick={() => applyPreset("Reset")}>Reset</Badge>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
        <CardHeader><CardTitle className="flex items-center gap-2"><Car className="w-5 h-5 text-blue-500"/> Transportation</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between"><label id="label-car-travel" className="text-sm">Reduce Car Travel</label><span className="text-sm font-bold">{carReduction[0]}%</span></div>
            <Slider aria-labelledby="label-car-travel" value={carReduction} onValueChange={(val) => setCarReduction(val as number[])} max={100} step={5} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><label id="label-public-transit" className="text-sm">Increase Public Transit</label><span className="text-sm font-bold">{publicTransit[0]}%</span></div>
            <Slider aria-labelledby="label-public-transit" value={publicTransit} onValueChange={(val) => setPublicTransit(val as number[])} max={100} step={5} />
          </div>
          <div className="flex items-center justify-between">
            <label id="label-switch-ev" className="text-sm font-medium">Switch to Electric Vehicle</label>
            <Switch aria-labelledby="label-switch-ev" checked={switchEV} onCheckedChange={setSwitchEV} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
        <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500"/> Energy</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between"><label id="label-ac-reduce" className="text-sm">Reduce AC Usage</label><span className="text-sm font-bold">{acReduction[0]}%</span></div>
            <Slider aria-labelledby="label-ac-reduce" value={acReduction} onValueChange={(val) => setAcReduction(val as number[])} max={100} step={5} />
          </div>
          <div className="flex items-center justify-between">
            <label id="label-renewable" className="text-sm font-medium">Use 100% Renewable Energy</label>
            <Switch aria-labelledby="label-renewable" checked={renewableEnergy} onCheckedChange={setRenewableEnergy} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
        <CardHeader><CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5 text-orange-500"/> Food</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between"><label id="label-meat-reduce" className="text-sm">Reduce Meat Consumption</label><span className="text-sm font-bold">{meatReduction[0]}%</span></div>
            <Slider aria-labelledby="label-meat-reduce" value={meatReduction} onValueChange={(val) => setMeatReduction(val as number[])} max={100} step={5} />
          </div>
          <div className="flex items-center justify-between">
            <label id="label-veg" className="text-sm font-medium">Switch to Vegetarian Diet</label>
            <Switch aria-labelledby="label-veg" checked={switchVeg} onCheckedChange={setSwitchVeg} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
