import { Globe, Target, TreePine, Car, Droplets, Zap } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportFutureTwin({ twinData, collective100k, store, sim, treesEquivalent }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2 mt-8"><Globe className="text-blue-500" /> Future Sustainability Twin</h2>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
          <h3 className="font-bold text-slate-800 mb-1">{twinData.scenarios.scenarioA.name}</h3>
          <p className="text-xs text-slate-500 mb-4">{twinData.scenarios.scenarioA.description}</p>
          <p className="text-xs uppercase font-bold text-slate-400">2035 Projection</p>
          <p className="text-2xl font-bold text-slate-700">{twinData.scenarios.scenarioA.footprint2035} <span className="text-xs">kg</span></p>
        </div>
        <div className="border border-blue-200 rounded-2xl p-4 bg-blue-50">
          <h3 className="font-bold text-blue-800 mb-1">{twinData.scenarios.scenarioB.name}</h3>
          <p className="text-xs text-blue-600/80 mb-4">{twinData.scenarios.scenarioB.description}</p>
          <p className="text-xs uppercase font-bold text-blue-400">2035 Projection</p>
          <p className="text-2xl font-bold text-blue-700">{twinData.scenarios.scenarioB.footprint2035} <span className="text-xs">kg</span></p>
        </div>
        <div className="border border-orange-200 rounded-2xl p-4 bg-orange-50">
          <h3 className="font-bold text-orange-800 mb-1">{twinData.scenarios.scenarioC.name}</h3>
          <p className="text-xs text-orange-600/80 mb-4">{twinData.scenarios.scenarioC.description}</p>
          <p className="text-xs uppercase font-bold text-orange-400">2035 Projection</p>
          <p className="text-2xl font-bold text-orange-700">{twinData.scenarios.scenarioC.footprint2035} <span className="text-xs">kg</span></p>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><Target className="text-purple-500" /> Community Climate Impact (100k Users)</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center text-center">
          <TreePine className="text-green-600 w-8 h-8 mb-2" />
          <p className="text-xs text-green-800 font-bold uppercase">Trees Planted</p>
          <p className="text-xl font-bold text-green-700">{new Intl.NumberFormat('en-US').format(collective100k.equivalents.treesEquivalent)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
          <Car className="text-blue-600 w-8 h-8 mb-2" />
          <p className="text-xs text-blue-800 font-bold uppercase">Cars Removed</p>
          <p className="text-xl font-bold text-blue-700">{new Intl.NumberFormat('en-US').format(Math.round(collective100k.totalCO2Reduced / 4600))}</p>
        </div>
        <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 flex flex-col items-center text-center">
          <Droplets className="text-cyan-600 w-8 h-8 mb-2" />
          <p className="text-xs text-cyan-800 font-bold uppercase">Water Saved</p>
          <p className="text-xl font-bold text-cyan-700">{new Intl.NumberFormat('en-US').format(collective100k.equivalents.waterEquivalent)}L</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col items-center text-center">
          <Zap className="text-purple-600 w-8 h-8 mb-2" />
          <p className="text-xs text-purple-800 font-bold uppercase">Total CO₂</p>
          <p className="text-xl font-bold text-purple-700">{new Intl.NumberFormat('en-US').format(Math.round(collective100k.totalCO2Reduced / 1000))} tons</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
        <p className="text-lg text-slate-700 italic font-medium leading-relaxed">
          &quot;Based on your simulator results, maintaining these habits could reduce your carbon footprint by approximately <span className="text-blue-600 font-bold">{sim.reductionAmount} kg CO₂</span> annually. 
          {sim.biggestImpactAction ? ` Your biggest opportunity comes from ${sim.biggestImpactAction}.` : ''} If sustained over the next year, your environmental impact would be equivalent to planting <span className="text-green-600 font-bold">{treesEquivalent} trees</span>.&quot;
        </p>
      </div>

      {store.actionPlanTasks.length > 0 && (
        <>
          <h2 className="text-xl font-bold font-poppins text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500"/> AI Generated 7-Day Green Plan
          </h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
            {store.actionPlanTasks.map((task: { day: number, task: string, completed: boolean }, index: number) => (
              <div key={task.day} className={`p-4 flex items-start gap-4 ${index !== store.actionPlanTasks.length - 1 ? 'border-b border-slate-100' : ''} ${task.completed ? 'bg-green-50' : ''}`}>
                <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold w-16 text-center shrink-0">
                  Day {task.day}
                </div>
                <p className={`text-slate-800 ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.task}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
