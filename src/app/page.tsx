"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Leaf, Activity, Trophy, ArrowRight, Zap, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-transparent flex flex-col items-center overflow-hidden">
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-green-500" />
          <span className="text-xl font-poppins font-bold tracking-tight text-slate-900 dark:text-white">
            CarbonWise AI
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-slate-900 dark:text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center flex-1 mt-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl flex flex-col items-center"
        >
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4 py-1 mb-6 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
            Powered by Gemini AI ✦
          </Badge>
          <h1 className="text-6xl md:text-7xl font-poppins font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Understand Your Impact.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
              Reduce Your Footprint.
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl font-inter">
            The AI-powered climate coach that helps you track daily emissions,
            receive personalized reduction plans, and turn sustainability into a
            rewarding game.
          </p>

          <div className="flex gap-4">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-14 text-lg"
              >
                Calculate My Footprint <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 text-lg border-slate-300 dark:border-slate-800"
              >
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32 mb-20">
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardContent className="pt-6 flex flex-col items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-poppins font-bold mb-3">
                  Track Daily Habits
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-inter">
                  Log your transportation, energy usage, and food choices to see
                  your real-time carbon emissions.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardContent className="pt-6 flex flex-col items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-poppins font-bold mb-3">
                  AI Climate Coach
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-inter">
                  Get hyper-personalized recommendations from Gemini to reduce
                  emissions efficiently.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardContent className="pt-6 flex flex-col items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                  <Trophy className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-poppins font-bold mb-3">
                  Gamify Sustainability
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-inter">
                  Join challenges, earn badges, and level up as you make
                  positive environmental impacts.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
