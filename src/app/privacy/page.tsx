'use client';

import React from 'react';
import { Shield, Clock, Info, Database, Lock, UserCheck, BookOpen, AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: <Info className="w-4 h-4" /> },
    { id: 'information-collected', title: 'Information We Collect', icon: <Database className="w-4 h-4" /> },
    { id: 'local-data-storage', title: 'Local Data Storage', icon: <Database className="w-4 h-4" /> },
    { id: 'ai-services', title: 'AI Services', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'how-we-use-information', title: 'How We Use Information', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'data-sharing', title: 'Data Sharing', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'data-security', title: 'Data Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'your-rights', title: 'Your Rights', icon: <Shield className="w-4 h-4" /> },
    { id: 'childrens-privacy', title: "Children's Privacy", icon: <UserCheck className="w-4 h-4" /> },
    { id: 'changes', title: 'Changes To This Policy', icon: <Clock className="w-4 h-4" /> },
    { id: 'contact', title: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Table of Contents */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600 dark:text-green-500" />
              Contents
            </h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  {section.icon}
                  <span className="truncate">{section.title}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-700 px-8 py-12 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold font-poppins tracking-tight">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-green-50 font-medium text-lg max-w-2xl">
                We value your privacy and are committed to being transparent about how information is collected and used.
              </p>
              <div className="mt-6 flex items-center gap-2 text-green-100 text-sm font-medium bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                Last Updated: {currentDate}
              </div>
            </div>

            {/* Policy Content */}
            <div className="p-8 md:p-12 prose prose-slate dark:prose-invert max-w-none">
              
              <section id="introduction" className="scroll-mt-24">
                <h2>Introduction</h2>
                <p>
                  Welcome to CarbonWise AI.
                </p>
                <p>
                  CarbonWise AI is an AI-powered sustainability platform designed to help users understand, track, and reduce their carbon footprint through personalized insights, sustainability simulations, and environmental impact reporting.
                </p>
                <p>
                  We value your privacy and are committed to being transparent about how information is collected and used. This policy aligns with basic privacy best practices and India's Digital Personal Data Protection Act (DPDP Act, 2023). This project is currently a student/hackathon project and does not require authentication.
                </p>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="information-collected" className="scroll-mt-24">
                <h2>Information We Collect</h2>
                <p>CarbonWise AI may collect and process:</p>
                
                <h3>Sustainability Assessment Information</h3>
                <ul>
                  <li>Transportation habits</li>
                  <li>Energy consumption estimates</li>
                  <li>Food and dietary preferences</li>
                  <li>Shopping behavior</li>
                  <li>Waste management habits</li>
                </ul>

                <h3>Daily Activity Data</h3>
                <ul>
                  <li>Walking distance</li>
                  <li>Cycling distance</li>
                  <li>Public transport usage</li>
                  <li>Plastic reduction activities</li>
                  <li>Sustainability challenge progress</li>
                </ul>

                <h3>Technical Information</h3>
                <ul>
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Basic usage analytics</li>
                  <li>Error logs (if applicable)</li>
                </ul>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="local-data-storage" className="scroll-mt-24">
                <h2>Local Data Storage</h2>
                <p>
                  <strong>Most user data is stored locally in the user's browser using local storage.</strong>
                </p>
                <p>This includes:</p>
                <ul>
                  <li>Assessment results</li>
                  <li>Sustainability scores</li>
                  <li>Challenge progress</li>
                  <li>Simulator results</li>
                  <li>AI action plans</li>
                  <li>Sustainability report data</li>
                </ul>
                <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 my-4 flex items-start gap-3">
                  <Database className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <p className="m-0 text-sm text-slate-700 dark:text-slate-300">
                    Data stored locally remains on the user's device unless manually cleared by the user. We do not maintain a central database of your habits.
                  </p>
                </div>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="ai-services" className="scroll-mt-24">
                <h2>AI Services</h2>
                <p>CarbonWise AI uses Google's Gemini AI to generate:</p>
                <ul>
                  <li>Sustainability recommendations</li>
                  <li>Carbon reduction insights</li>
                  <li>Personalized action plans</li>
                </ul>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700/50 my-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                  <p className="m-0 text-sm text-yellow-800 dark:text-yellow-200">
                    When AI features are used, selected sustainability-related inputs may be transmitted to Google's Gemini API for processing. 
                    <strong> No financial information, passwords, or sensitive personal identifiers are intentionally collected or transmitted.</strong>
                  </p>
                </div>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="how-we-use-information" className="scroll-mt-24">
                <h2>How We Use Information</h2>
                <p>Information is used to:</p>
                <ul>
                  <li>Calculate carbon footprints</li>
                  <li>Generate sustainability scores</li>
                  <li>Provide personalized recommendations</li>
                  <li>Produce forecasts and reports</li>
                  <li>Improve user experience</li>
                  <li>Maintain application functionality</li>
                </ul>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="data-sharing" className="scroll-mt-24">
                <h2>Data Sharing</h2>
                <p>
                  <strong>CarbonWise AI does not sell personal information.</strong>
                </p>
                <p>
                  We do not share user information with third parties except when strictly necessary to provide AI-powered functionality through Google's Gemini API as described above.
                </p>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="data-security" className="scroll-mt-24">
                <h2>Data Security</h2>
                <p>
                  Reasonable measures are taken to protect information processed by the application. However, no method of electronic storage or internet transmission can be guaranteed to be completely secure. Since data is predominantly stored locally, device security remains the responsibility of the user.
                </p>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="your-rights" className="scroll-mt-24">
                <h2>Your Rights</h2>
                <p>Users may at any time:</p>
                <ul>
                  <li>Clear locally stored data through browser settings</li>
                  <li>Reset application data within the app</li>
                  <li>Stop using AI-powered features</li>
                  <li>Contact the project owner regarding privacy concerns</li>
                </ul>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="childrens-privacy" className="scroll-mt-24">
                <h2>Children's Privacy</h2>
                <p>
                  CarbonWise AI is an educational tool but is not specifically directed toward children under the age of 13. We do not knowingly collect personal information from children.
                </p>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="changes" className="scroll-mt-24">
                <h2>Changes To This Policy</h2>
                <p>
                  This Privacy Policy may be updated periodically to reflect new features or legal requirements. Updates will be reflected by changing the "Last Updated" date at the top of this page.
                </p>
              </section>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <section id="contact" className="scroll-mt-24 pb-12">
                <h2>Contact</h2>
                <p>
                  For questions regarding this Privacy Policy, please contact:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 inline-block">
                  <p className="m-0 font-medium text-slate-900 dark:text-slate-100">Project Maintainer</p>
                  <p className="m-0 text-slate-600 dark:text-slate-400 mt-1">
                    <a href="mailto:privacy@carbonwise.ai" className="text-green-600 dark:text-green-400 hover:underline">
                      privacy@carbonwise.ai
                    </a>
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
