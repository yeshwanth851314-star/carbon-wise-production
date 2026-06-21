import { TreePine, Car, Lightbulb, Home, Plane, Droplets } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportEnvironmentalEquivalents({ reductionEquivalents }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
        <TreePine className="text-emerald-500" /> Environmental Impact
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
          <TreePine className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-xl font-bold text-emerald-700">{reductionEquivalents.treesEquivalent}</p>
          <p className="text-xs text-emerald-600 font-bold uppercase">Trees Planted</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center text-center">
          <Car className="w-6 h-6 text-slate-500 mb-2" />
          <p className="text-xl font-bold text-slate-700">{reductionEquivalents.drivingEquivalent}</p>
          <p className="text-xs text-slate-500 font-bold uppercase">km Driving</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col items-center text-center">
          <Lightbulb className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-xl font-bold text-amber-700">{reductionEquivalents.electricityEquivalent}</p>
          <p className="text-xs text-amber-600 font-bold uppercase">LED Hours</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col items-center text-center">
          <Home className="w-6 h-6 text-indigo-500 mb-2" />
          <p className="text-xl font-bold text-indigo-700">{reductionEquivalents.householdEnergyEquivalent}</p>
          <p className="text-xs text-indigo-600 font-bold uppercase">Months Power</p>
        </div>
        <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex flex-col items-center text-center">
          <Plane className="w-6 h-6 text-sky-500 mb-2" />
          <p className="text-xl font-bold text-sky-700">{reductionEquivalents.flightsEquivalent}</p>
          <p className="text-xs text-sky-600 font-bold uppercase">Flights Avoided</p>
        </div>
        <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 flex flex-col items-center text-center">
          <Droplets className="w-6 h-6 text-cyan-500 mb-2" />
          <p className="text-xl font-bold text-cyan-700">{reductionEquivalents.waterEquivalent}</p>
          <p className="text-xs text-cyan-600 font-bold uppercase">Liters Water</p>
        </div>
      </div>
    </>
  );
}
