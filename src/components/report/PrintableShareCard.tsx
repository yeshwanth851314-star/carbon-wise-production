import { Leaf, Target, TrendingDown, TreePine, Zap } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PrintableShareCard(props: any) {
  const {
    shareCardRef,
    assessment,
    sim,
    treesEquivalent,
  } = props;
  return (
    <div className="overflow-hidden h-0 w-0 absolute top-[-9999px] left-[-9999px]">
      <div 
        ref={shareCardRef} 
        className="w-[1200px] h-[630px] bg-slate-900 p-16 flex flex-col justify-between relative overflow-hidden font-sans"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500 opacity-20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500 opacity-20 rounded-full blur-[100px]"></div>

        <div className="flex items-center gap-4 text-white z-10 border-b border-white/10 pb-6">
          <div className="bg-emerald-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-poppins tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">CarbonWise AI</h1>
            <p className="text-xl text-slate-400 font-medium tracking-wide uppercase">Sustainability Impact</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 z-10 my-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
            <p className="text-emerald-400 font-bold uppercase tracking-widest mb-4 text-sm flex items-center gap-2"><Target className="w-5 h-5"/> Score</p>
            <p className="text-6xl font-black text-white">{assessment.sustainabilityScore}<span className="text-2xl text-slate-500">/100</span></p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
            <p className="text-blue-400 font-bold uppercase tracking-widest mb-4 text-sm flex items-center gap-2"><TrendingDown className="w-5 h-5"/> Reduction</p>
            <p className="text-6xl font-black text-white">{sim.reductionPercentage}%</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
            <p className="text-green-400 font-bold uppercase tracking-widest mb-4 text-sm flex items-center gap-2"><TreePine className="w-5 h-5"/> Trees Saved</p>
            <p className="text-6xl font-black text-white">{treesEquivalent}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
            <p className="text-emerald-300 font-bold uppercase tracking-widest mb-4 text-sm flex items-center gap-2"><Zap className="w-5 h-5"/> Top Impact</p>
            <p className="text-3xl font-black text-white leading-tight">{sim.biggestImpactAction}</p>
          </div>
        </div>

        <div className="flex justify-between items-end z-10 pt-6 border-t border-white/10">
          <div className="text-white">
            <p className="text-xl text-slate-400 font-medium">I pledged to reduce my carbon footprint by <span className="text-white font-bold">{sim.reductionAmount} kg CO₂/year</span></p>
          </div>
          <div className="bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-black shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            app.carbonwise.ai
          </div>
        </div>
      </div>
    </div>
  );
}
