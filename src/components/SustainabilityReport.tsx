"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  Share2, Award, Zap, Leaf, TreePine, TrendingDown,
  Trophy, Target, Star
} from "lucide-react";
import { logger } from "@/lib/logger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  PieChart,
  Pie,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export function SustainabilityReportGenerator() {
  const store = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const assessment = store.assessments[0];
  const sim = store.simulationResult;

  if (!assessment || !sim) return null;

  const handleGeneratePDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CarbonWise_Report_${format(new Date(), "MMM_dd_yyyy")}.pdf`);
    } catch (error) {
      logger.error("PDF Generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSharePNG = async () => {
    if (!shareCardRef.current) return;
    setIsSharing(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `CarbonWise_Impact_${format(new Date(), "MMM_dd_yyyy")}.png`;
      link.click();
    } catch (error) {
      logger.error("PNG Generation failed", error);
      alert("Failed to generate Share Card. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const treesEquivalent = Math.round(sim.reductionAmount / 25);


  // Gamification & Challenge stats
  const levelProgress = (store.xp % 1000) / 10;
  const totalChallenges = store.userChallenges.length;
  const completedChallenges = store.userChallenges.filter(c => c.completed).length;
  const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
  const carbonSavedChallenges = store.userChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.challenge.carbonTarget, 0);

  // Charts Data
  const sixMonthForecast = Math.max(0, Math.round(sim.projectedFootprint * 0.9));
  const oneYearForecast = Math.max(0, Math.round(sim.projectedFootprint * 0.8));

  const barChartData = [
    { name: "Current", value: assessment.totalEmissions, fill: "#ef4444" },
    { name: "Projected", value: sim.projectedFootprint, fill: "#eab308" },
    { name: "6 Months", value: sixMonthForecast, fill: "#22c55e" },
    { name: "1 Year", value: oneYearForecast, fill: "#16a34a" },
  ];

  const pieData = [
    { name: "Transport", value: assessment.transportScore, color: "#3b82f6" },
    { name: "Energy", value: assessment.energyScore, color: "#eab308" },
    { name: "Food", value: assessment.foodScore, color: "#f97316" },
    { name: "Shopping", value: assessment.shoppingScore, color: "#a855f7" },
    { name: "Waste", value: assessment.wasteScore, color: "#64748b" },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleGeneratePDF} 
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Leaf className="w-4 h-4 mr-2" aria-hidden="true" />
          {isGenerating ? "Generating..." : "Generate My Green Report"}
        </Button>
        <Button 
          onClick={handleSharePNG}
          disabled={isSharing}
          variant="outline"
          className="rounded-full shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform hover:scale-105"
        >
          <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
          {isSharing ? "Preparing..." : "Share Impact"}
        </Button>
      </div>

      {/* HIDDEN REPORT CONTAINERS FOR HTML2CANVAS */}
      <div className="overflow-hidden h-0 w-0 absolute top-[-9999px] left-[-9999px]">
        {/* A4 PDF Template - Long single page to fit all content */}
        <div 
          ref={reportRef} 
          className="w-[794px] bg-white text-slate-900 font-sans p-12 relative"
          style={{ minHeight: '1123px' }} // A4 proportions at 96 DPI
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8 border-b-2 border-green-500 pb-6">
            <div>
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Leaf className="w-8 h-8" />
                <h1 className="text-3xl font-bold font-poppins tracking-tight">CarbonWise AI</h1>
              </div>
              <p className="text-lg text-slate-500 font-medium">Sustainability Impact Report</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">Generated On</p>
              <p className="text-slate-600">{format(new Date(), "MMMM do, yyyy")}</p>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><Target className="text-blue-500" /> Executive Summary</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Current Footprint</p>
              <p className="text-2xl font-bold text-red-500">{assessment.totalEmissions} <span className="text-sm">kg CO₂/year</span></p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Projected Footprint</p>
              <p className="text-2xl font-bold text-green-600">{sim.projectedFootprint} <span className="text-sm">kg CO₂/year</span></p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Reduction</p>
              <p className="text-2xl font-bold text-blue-500">-{sim.reductionPercentage}%</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Sustainability Score</p>
              <p className="text-2xl font-bold text-purple-600">{assessment.sustainabilityScore}/100</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Trees Equivalent</p>
              <p className="text-2xl font-bold text-emerald-600">{treesEquivalent}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Biggest Impact</p>
              <p className="text-xl font-bold text-yellow-600">{sim.biggestImpactAction}</p>
            </div>
          </div>

          {/* 2. Gamification & Achievements Summary */}
          <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><Trophy className="text-yellow-500" /> Sustainability Achievements</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-slate-700">Level {store.level}</span>
                <span className="text-slate-500 font-semibold">{store.xp} XP</span>
              </div>
              <Progress value={levelProgress} className="h-3 mb-2 bg-slate-100" />
              <p className="text-xs text-slate-400 text-right mb-6">{store.xp} / {store.level * 1000} XP to next level</p>

              <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Unlocked Badges</h3>
              <div className="flex flex-wrap gap-2">
                {store.unlockedAchievements.length > 0 ? store.unlockedAchievements.map(badge => (
                  <div key={badge} className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1 border border-yellow-200">
                    <Star className="w-3 h-3" /> {badge}
                  </div>
                )) : (
                  <span className="text-sm text-slate-400 italic">No badges unlocked yet.</span>
                )}
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-center">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Award className="w-4 h-4"/> Challenge Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-600">Challenges Completed</span>
                  <span className="font-bold text-slate-800">{completedChallenges} / {totalChallenges}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-600">Completion Rate</span>
                  <span className="font-bold text-blue-600">{completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Carbon Saved (Challenges)</span>
                  <span className="font-bold text-green-600">{Math.round(carbonSavedChallenges)} kg CO₂/year</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Charts Section */}
          <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2">Analytics</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 text-center">Carbon Forecast</h3>
              {/* Fixed width/height for html2canvas */}
              <div className="flex justify-center">
                <BarChart width={300} height={200} data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="font-bold text-[10px]" width={60} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <LabelList dataKey="value" position="right" formatter={(val: any) => `${val}`} className="font-bold text-[10px]" />
                  </Bar>
                </BarChart>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 text-center">Emission Breakdown</h3>
              <div className="flex justify-center">
                <PieChart width={300} height={200}>
                  <Pie
                    data={pieData}
                    cx={150}
                    cy={100}
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </div>
          </div>

          {/* 4. Personalized Commitment */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <p className="text-lg text-slate-700 italic font-medium leading-relaxed">
              &quot;Based on your simulator results, maintaining these habits could reduce your carbon footprint by approximately <span className="text-blue-600 font-bold">{sim.reductionAmount} kg CO₂</span> annually. 
              {sim.biggestImpactAction ? ` Your biggest opportunity comes from ${sim.biggestImpactAction}.` : ''} If sustained over the next year, your environmental impact would be equivalent to planting <span className="text-green-600 font-bold">{treesEquivalent} trees</span>.&quot;
            </p>
          </div>

          {/* 5. AI 7-Day Plan */}
          {store.actionPlanTasks.length > 0 && (
            <>
              <h2 className="text-xl font-bold font-poppins text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500"/> AI Generated 7-Day Green Plan
              </h2>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
                {store.actionPlanTasks.map((task, index) => (
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

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center text-sm text-slate-400">
            <p>CarbonWise AI • Your Personal Climate Action Report</p>
            <p>Generated dynamically via html2canvas</p>
          </div>
        </div>

        {/* Share PNG Card Template (1200x630 OG Image Size) Premium Styling */}
        <div 
          ref={shareCardRef} 
          className="w-[1200px] h-[630px] bg-slate-900 p-16 flex flex-col justify-between relative overflow-hidden font-sans"
        >
          {/* Dynamic Premium Background */}
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
    </>
  );
}
