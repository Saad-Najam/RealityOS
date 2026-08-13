'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, BrainCircuit, Cpu, Trophy, ArrowRight, Shield, Terminal, Zap, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, Profile } from '@/lib/db';
import Header from '@/components/Header';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [terminalStep, setTerminalStep] = useState(0);

  useEffect(() => {
    const init = async () => {
      const p = await dbService.getProfile();
      setProfile(p);
    };
    init();

    // Loop terminal animation steps
    const interval = setInterval(() => {
      setTerminalStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const terminalLines = [
    { text: "System Booting... RealityOS v1.4 active.", color: "text-slate-500" },
    { text: "Claim detected: 'Emergency closure of university announced tomorrow'", color: "text-sky-400 font-bold" },
    { text: "Decomposing into atomic claims...", color: "text-purple-400" },
    { text: "Checking official university channels... [404: NO RECORD FOUND]", color: "text-rose-400" },
    { text: "Verdict: 🟡 MISLEADING (Urgency appeal + Fake source context)", color: "text-amber-400 font-black animate-pulse" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] overflow-hidden text-slate-100 relative">
      
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 flex flex-col justify-center space-y-24">
        
        {/* Two Column Hero */}
        <section className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-950/80 to-purple-950/80 border border-sky-800/80 px-4 py-1.5 rounded-full text-sky-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Zap className="w-4 h-4 text-sky-400 animate-pulse fill-sky-400/20" />
              <span>UNESCO AI & Media Literacy Hackathon 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
              <span className="block text-white">Train your mind before the</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] mt-2">
                algorithm trains it for you.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              RealityOS is an adaptive, gamified AI platform that inoculates your mind against misinformation. We don't just verify facts—we teach you how to analyze sources, spot deepfakes, and reach accurate verdicts.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link 
                href={profile?.completed_diagnostic ? '/arena' : '/diagnostic'}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 font-bold rounded-xl text-white overflow-hidden shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{profile?.completed_diagnostic ? 'Enter Reality Arena' : 'Start Diagnostic Onboarding'}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/profile"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-900/80 border border-sky-950/80 hover:border-sky-500/50 rounded-xl text-slate-300 font-bold hover:text-white transition-all hover:bg-slate-950"
              >
                Inspect Media DNA
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Simulated Terminal Window */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 w-full max-w-md mx-auto"
          >
            <div className="glass-panel border border-sky-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.08)] bg-slate-950/60">
              
              {/* Terminal header */}
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-sky-950/80">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[10px] text-slate-500 font-bold font-mono tracking-wider flex items-center">
                  <Terminal className="w-3.5 h-3.5 mr-1" />
                  VERIFY_ENGINE@OS
                </div>
              </div>

              {/* Terminal contents */}
              <div className="p-5 font-mono text-xs sm:text-sm h-64 flex flex-col justify-start space-y-2.5 overflow-y-auto text-left">
                {terminalLines.map((line, idx) => {
                  if (idx > terminalStep) return null;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={line.color}
                    >
                      {idx === terminalStep ? <span className="text-sky-400 mr-1.5 font-black">&gt;</span> : <span className="text-slate-600 mr-1.5">#</span>}
                      {line.text}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

        </section>

        {/* Feature Grid / Difference Comparison Section */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">How RealityOS Works</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">Traditional checkers label news. RealityOS inoculates your critical thinking.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <div className="glass-panel p-8 rounded-2xl border-red-950/20 relative group hover:border-red-900/35 transition-all">
              <div className="absolute -top-3 left-6 px-3 py-0.5 bg-red-950/60 border border-red-900/60 text-red-400 text-[10px] font-black rounded-full uppercase tracking-wider">Traditional Fact Checking</div>
              <ul className="space-y-5 mt-4">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-lg font-bold">✕</span>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Labels assertions as <strong className="text-red-400 font-bold">\"Fake\"</strong> or <strong className="text-emerald-400 font-bold">\"True\"</strong>, offering no tools to learn how the decision was reached.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-lg font-bold">✕</span>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Breeds reliance on external algorithms and fact check portals rather than building independent media literacy.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-lg font-bold">✕</span>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Dull, text-heavy reports fail to capture the attention of university-aged, feed-scrolling demographics.
                  </p>
                </li>
              </ul>
            </div>

            {/* The RealityOS Way */}
            <div className="glass-panel p-8 rounded-2xl border-emerald-950/25 relative group hover:border-emerald-800/40 transition-all shadow-[0_0_30px_rgba(16,185,129,0.02)]">
              <div className="absolute -top-3 left-6 px-3 py-0.5 bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider">The RealityOS Method</div>
              <ul className="space-y-5 mt-4">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-3 text-lg font-bold">✓</span>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Asks <strong className="text-sky-400 font-extrabold">\"Do you trust this?\"</strong>, engaging users in active diagnostic evaluations.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-3 text-lg font-bold">✓</span>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Maps atomic sub-claims, traces lateral search sources, and teaches physical visual tells (hands, shadows).
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-3 text-lg font-bold">✓</span>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Tracks error history in real-time, feeding weaker areas back into your simulation path using our Adaptive Engine.
                  </p>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* MIL Indicators mapping */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">7 Media & Information Literacy Dimensions</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">We measure and train competencies aligned with the UNESCO curriculum frameworks.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { name: 'Source Check', desc: 'Verifying domain URLs and check author credentials', color: 'border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.08)]' },
              { name: 'Bias Detection', desc: 'Identifying ideological bias and loaded phrases', color: 'border-purple-500/20 text-purple-400 hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.08)]' },
              { name: 'Deepfake Check', desc: 'Spotting physical visual flaws in AI photos', color: 'border-pink-500/20 text-pink-400 hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.08)]' },
              { name: 'Emotional Logic', desc: 'Filtering clickbait panic and urgent headlines', color: 'border-rose-500/20 text-rose-400 hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.08)]' },
              { name: 'Stats Literacy', desc: 'Decoding misleading scales and cherry-picked data', color: 'border-amber-500/20 text-amber-400 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.08)]' },
              { name: 'Lateral Reading', desc: 'Searching details outside the source domain', color: 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.08)]' },
              { name: 'AI Literacy', desc: 'Detecting synthetic texts and cloned speech', color: 'border-indigo-500/20 text-indigo-400 hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.08)]' }
            ].map((skill, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.03 }}
                className={`glass-panel p-4 rounded-xl border text-center flex flex-col justify-between min-h-[130px] cursor-default transition-all ${skill.color}`}
              >
                <div className="text-xs font-black uppercase tracking-wider leading-relaxed">{skill.name}</div>
                <div className="text-[10px] text-slate-500 mt-2 font-medium leading-relaxed">{skill.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <footer className="w-full border-t border-sky-950/60 py-8 bg-[#090d16]/80 text-center text-xs text-slate-500 z-10">
        RealityOS © 2026. Built with high-fidelity components for the UNESCO MIL track.
      </footer>
    </div>
  );
  }
