'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, AlertCircle, HelpCircle, CheckCircle, ArrowRight, 
  ShieldCheck, RefreshCw, XCircle, Search, HelpCircle as HelpIcon, 
  Network, Database, BookOpen, AlertTriangle, ShieldAlert
} from 'lucide-react';
import Header from '@/components/Header';

interface LabPair {
  id: number;
  topic: string;
  original: string;
  manipulated: string;
  question: string;
  options: string[];
  correctIndex: number;
  technique: string;
  explanation: string;
}

const LAB_PAIRS: LabPair[] = [
  {
    id: 1,
    topic: "Climate Science",
    original: "Scientists publish new climate research showing a 1.2-degree Celsius average increase in global temperatures over the last decade.",
    manipulated: "🚨 CLIMATE MELTDOWN IMMINENT! SCIENTISTS JUST DISCOVERED SOMETHING TERRIFYING THAT THEY TRIED TO HIDE! WAKE UP!",
    question: "What main manipulation technique is used in the modified headline?",
    options: [
      "Fear Appeal & Clickbait (Urgent capitalizations, alarming verbs, and conspiracy framing)",
      "Statistical manipulation (Faking mathematical formulas)",
      "Unauthorised quoting (Citing external authorities without permission)"
    ],
    correctIndex: 0,
    technique: "Fearmongering & Urgency Appeals",
    explanation: "The manipulated version strips away the specific data (1.2-degree rise) and replaces it with extreme trigger words ('MELTDOWN', 'TERRIFYING'), screaming capital letters, and a conspiracy element ('tried to hide'). This bypasses rational analysis by appealing directly to fear and curiosity."
  },
  {
    id: 2,
    topic: "Commerce Regulations",
    original: "Local department stores will limit single-use plastics starting next Monday to comply with the new environmental municipal code.",
    manipulated: "⚠️ GOVERNMENT PLASTIC FORCED BAN: RETAILERS EXPLOIT NEW RULES TO MAKE CITIZENS PAY TO CARRY FOOD!",
    question: "Identify the manipulation framing technique utilized in the doctored headline.",
    options: [
      "Technical jargon spoofing (using overly complex scientific terminology)",
      "Hostile/Outrage Framing (using words like 'FORCED', 'EXPLOIT' to create anger and opposition)",
      "AI Deepfake Text spoofing"
    ],
    correctIndex: 1,
    technique: "Outrage / Hostile Framing",
    explanation: "By framing a standard environmental compliance measure around emotional words of coercion ('FORCED BAN') and corruption ('RETAILERS EXPLOIT'), the creator triggers political anger and defensiveness in readers to encourage sharing."
  },
  {
    id: 3,
    topic: "Academic Surveys",
    original: "A university health survey reports that 65% of students report feelings of stress during final exam weeks, reflecting typical historical averages.",
    manipulated: "💔 EXAM DEPRESSION CRISIS: MASSIVE 65% OF STUDENT BODIES MENTALLY BROKEN BY THE SYSTEM!",
    question: "What statistical context is missing from the manipulated headline?",
    options: [
      "The exact location of the research library",
      "Historical Baseline Context (stress increases during exams naturally, and this matches historical norms; it is not a new 'mental breakdown' epidemic)",
      "The sample size of teachers surveyed"
    ],
    correctIndex: 1,
    technique: "Cherry-picking without Baseline Context",
    explanation: "The modified version uses extreme language ('DEPRESSION CRISIS', 'MENTALLY BROKEN') and presents the 65% figure as a shocking new catastrophe, omitting the baseline context that exam stress is normal, temporary, and matches historical levels."
  }
];

export default function ManipulationLab() {
  const [activeTab, setActiveTab] = useState<'headlines' | 'sleuth'>('headlines');
  
  // Tab 1: Headlines states
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const currentPair = LAB_PAIRS[activeIdx];

  // Tab 2: Sleuth engine states
  const [claimInput, setClaimInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState<any | null>(null);

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOpt(idx);
    setHasAnswered(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setHasAnswered(false);
    setActiveIdx((activeIdx + 1) % LAB_PAIRS.length);
  };

  const runVerification = async (text: string) => {
    if (!text.trim() || verifying) return;
    setClaimInput(text);
    setVerifying(true);
    setVerificationResult(null);
    setSelectedGraphNode(null);

    try {
      const res = await fetch('/api/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      setVerificationResult(data);
      if (data?.graph?.nodes?.length > 0) {
        setSelectedGraphNode(data.graph.nodes[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const isCorrect = selectedOpt === currentPair.correctIndex;

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9]">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-10 space-y-8">
        
        {/* Page Title */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center">
            <Cpu className="w-8 h-8 mr-2.5 text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]" />
            INVESTIGATION LAB
          </h2>
          <p className="text-sm text-slate-400">Select an exercise to analyze manipulation or decompose viral media claims.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-sky-950">
          <button
            onClick={() => setActiveTab('headlines')}
            className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'headlines'
                ? 'border-purple-400 text-purple-400 bg-purple-950/10 shadow-[inset_0_-2px_0_#a855f7]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Headline Manipulation Lab
          </button>
          <button
            onClick={() => setActiveTab('sleuth')}
            className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'sleuth'
                ? 'border-purple-400 text-purple-400 bg-purple-950/10 shadow-[inset_0_-2px_0_#a855f7]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sleuth AI Verification Engine
          </button>
        </div>

        {activeTab === 'headlines' ? (
          /* TAB 1: Headline manipulation comparing quiz */
          <div className="space-y-8">
            
            {/* Headline grids */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-sky-950/60 bg-slate-900/10 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Raw Source Fact (Neutral)</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    "{currentPair.original}"
                  </p>
                </div>
                <div className="mt-6 text-[10px] text-slate-500 uppercase font-semibold">Tones: Objective, scientific, measured</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-rose-950/40 bg-rose-950/5 flex flex-col justify-between min-h-[220px] shadow-[0_0_20px_rgba(239,68,68,0.02)]">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Manipulated Post (Viral)</span>
                  </div>
                  <p className="text-sm sm:text-base text-rose-100 font-extrabold leading-relaxed font-sans">
                    "{currentPair.manipulated}"
                  </p>
                </div>
                <div className="mt-6 text-[10px] text-rose-400/80 uppercase font-bold">Technique: {currentPair.technique}</div>
              </div>
            </div>

            {/* Interaction Panel */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sky-950/60 shadow-[0_0_30px_rgba(56,189,248,0.03)] space-y-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-950/40 border border-purple-900/50 rounded-lg text-purple-400 shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentPair.question}
                </h3>
              </div>

              <div className="space-y-3">
                {currentPair.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  let btnClass = 'border-sky-950 bg-slate-900/20 text-slate-300 hover:bg-sky-950/20 hover:border-sky-800';
                  
                  if (hasAnswered) {
                    if (idx === currentPair.correctIndex) {
                      btnClass = 'border-emerald-500 bg-emerald-950/20 text-emerald-400';
                    } else if (isSelected) {
                      btnClass = 'border-rose-500 bg-rose-950/20 text-rose-400';
                    } else {
                      btnClass = 'border-sky-950 opacity-40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between group active:scale-[0.99] ${btnClass}`}
                    >
                      <span className="leading-relaxed pr-4">{opt}</span>
                      {!hasAnswered && (
                        <ArrowRight className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                      )}
                      {hasAnswered && idx === currentPair.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {hasAnswered && isSelected && idx !== currentPair.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`p-5 rounded-xl border leading-relaxed space-y-2 text-sm ${
                      isCorrect 
                        ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200' 
                        : 'bg-rose-950/10 border-rose-900/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="font-extrabold uppercase text-xs tracking-wider">
                        {isCorrect ? 'Correct Analysis' : 'Incorrect Interpretation'} — Explanation
                      </span>
                    </div>
                    <p className="leading-relaxed text-xs sm:text-sm pt-1">
                      {currentPair.explanation}
                    </p>
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleNext}
                        className="inline-flex items-center px-4 py-2 bg-slate-900/80 border border-sky-900/60 rounded-lg text-xs font-bold text-sky-400 hover:text-white hover:bg-slate-950 hover:border-sky-500 transition-all"
                      >
                        Next Headline Pair <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          /* TAB 2: Sleuth AI claim decomposition and verification graph */
          <div className="space-y-6">
            
            {/* Input card */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950 space-y-4">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center">
                <Search className="w-5 h-5 mr-2 text-sky-400" />
                Input suspicious claim or URL
              </h3>
              
              <div className="relative">
                <textarea
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  placeholder="Paste text, news headline, or WhatsApp forward. E.g. 'Scientists say drinking coffee adds 10 years to lifespan'..."
                  rows={3}
                  className="w-full bg-slate-950/80 border border-sky-900/60 focus:border-sky-500 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Sample Quick links */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Quick Demos:</span>
                <button 
                  onClick={() => runVerification("Scientists say drinking coffee adds 10 years to your life.")}
                  className="px-2.5 py-1 bg-sky-950/40 border border-sky-900/50 rounded-lg text-sky-400 hover:bg-sky-900/30 transition-all"
                >
                  ☕ Coffee Lifespan
                </button>
                <button 
                  onClick={() => runVerification("Governments are preparing mandatory lockdown cash bans.")}
                  className="px-2.5 py-1 bg-sky-950/40 border border-sky-900/50 rounded-lg text-sky-400 hover:bg-sky-900/30 transition-all"
                >
                  🚨 Imminent Lockdown
                </button>
              </div>

              <button
                onClick={() => runVerification(claimInput)}
                disabled={!claimInput.trim() || verifying}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/10 text-white font-extrabold rounded-xl text-sm transition-all flex items-center justify-center disabled:opacity-40"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Claim & Gathering RAG Evidence...
                  </>
                ) : (
                  <>
                    Run Sleuth Decomposition Check
                  </>
                )}
              </button>
            </div>

            {/* Results workspace displays */}
            <AnimatePresence>
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-12 gap-6 items-start"
                >
                  
                  {/* Verdict & Decomposition text summary */}
                  <div className="md:col-span-6 space-y-6">
                    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-4">
                      
                      {/* Verdict Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Evaluation Verdict</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                          verificationResult.verdict === 'SUPPORTED' 
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                            : verificationResult.verdict === 'MISLEADING'
                              ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                              : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                        }`}>
                          {verificationResult.verdict}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">
                          AI Verification Confidence: <span className="font-bold text-sky-400">{verificationResult.confidence}%</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed pt-1">
                          {verificationResult.summary}
                        </p>
                      </div>

                      {/* Decomposition bullets list */}
                      <div className="pt-4 border-t border-sky-950 space-y-4">
                        <h4 className="text-xs text-slate-400 font-bold uppercase flex items-center">
                          <Database className="w-4 h-4 mr-1.5 text-sky-400" />
                          Atomic Claim Decomposition
                        </h4>
                        
                        <div className="space-y-3">
                          {verificationResult.claims.map((claim: any, cIdx: number) => (
                            <div key={cIdx} className="p-3 bg-slate-950/60 border border-sky-950 rounded-lg flex items-start space-x-2.5">
                              {claim.status === 'SUPPORTED' ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : claim.status === 'CONTRADICTED' ? (
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <HelpIcon className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-slate-200">{claim.text}</div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">{claim.why}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Visual Evidence Graph */}
                  <div className="md:col-span-6 space-y-6">
                    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-5">
                      <h4 className="text-xs text-slate-400 font-bold uppercase flex items-center">
                        <Network className="w-4 h-4 mr-1.5 text-purple-400" />
                        RAG Evidence Connection Graph
                      </h4>

                      {/* Display Node buttons map */}
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {verificationResult.graph?.nodes.map((node: any) => {
                          const isSelected = selectedGraphNode?.id === node.id;
                          
                          let style = 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-950/30';
                          if (node.type === 'claim') style = 'border-sky-950 text-sky-400 bg-sky-950/10 hover:border-sky-800';
                          if (node.type === 'source') style = 'border-purple-950 text-purple-400 bg-purple-950/10 hover:border-purple-800';
                          if (node.type === 'evidence') {
                            style = node.status === 'contradicts' 
                              ? 'border-rose-950 text-rose-400 bg-rose-950/10 hover:border-rose-800' 
                              : 'border-emerald-950 text-emerald-400 bg-emerald-950/10 hover:border-emerald-800';
                          }

                          if (isSelected) {
                            style += ' ring-1 ring-sky-400 scale-105 shadow-[0_0_10px_rgba(56,189,248,0.15)]';
                          }

                          return (
                            <button
                              key={node.id}
                              onClick={() => setSelectedGraphNode(node)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all uppercase tracking-wider flex items-center space-x-1.5 ${style}`}
                            >
                              <span>{node.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Node descriptor panel */}
                      {selectedGraphNode && (
                        <div className="p-4 bg-slate-950/80 border border-sky-950 rounded-xl space-y-2">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Node Inspector</span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{selectedGraphNode.label}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {selectedGraphNode.description}
                          </p>
                        </div>
                      )}

                      {/* Connections guide list */}
                      <div className="pt-2 space-y-2 border-t border-sky-950 text-[10px] text-slate-500 font-semibold uppercase">
                        <div>Map Connections:</div>
                        <div className="space-y-1 bg-slate-950/50 p-2.5 rounded-lg border border-sky-950/60 font-mono text-[9px] text-slate-400 normal-case">
                          {verificationResult.graph?.edges.map((edge: any, eIdx: number) => {
                            const fromLabel = verificationResult.graph.nodes.find((n: any) => n.id === edge.from)?.label || edge.from;
                            const toLabel = verificationResult.graph.nodes.find((n: any) => n.id === edge.to)?.label || edge.to;
                            return (
                              <div key={eIdx} className="flex items-center space-x-1.5 py-0.5">
                                <span className="font-bold text-slate-200">"{fromLabel.slice(0, 15)}..."</span>
                                <span className="text-purple-400 font-bold font-sans">── {edge.relationship} ──&gt;</span>
                                <span className="font-bold text-slate-200">"{toLabel.slice(0, 15)}..."</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </main>
    </div>
  );
}
