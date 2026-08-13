'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, HelpCircle, Shield, AlertTriangle, Fingerprint } from 'lucide-react';
import { dbService, SkillScores } from '@/lib/db';
import Header from '@/components/Header';

interface DiagnosticQuestion {
  id: number;
  text: string;
  subText?: string;
  options: {
    text: string;
    scoreWeight: number;
  }[];
  skill: keyof SkillScores;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    text: "You receive a forwarded WhatsApp message from a family member stating that tomorrow is declared a sudden public holiday and exams are postponed.",
    subText: "🚨 URGENT: Government announces tomorrow as a public holiday. Exams are postponed! Forward to all groups!",
    options: [
      { text: "Share it instantly to your class WhatsApp groups to notify your friends.", scoreWeight: 20 },
      { text: "Assume it is true since it has been forwarded many times in other groups.", scoreWeight: 45 },
      { text: "Open a search tab to look up the official notification on the HEC or university portal.", scoreWeight: 100 }
    ],
    skill: "source_verification"
  },
  {
    id: 2,
    text: "An image goes viral showing a world leader wearing a highly unusual designer puffer jacket in public. The texture looks real, but the lighting seems somewhat artistic.",
    options: [
      { text: "Re-share it immediately with a funny caption about their new style.", scoreWeight: 30 },
      { text: "Assume it is authentic because famous influencers are posting it.", scoreWeight: 50 },
      { text: "Zoom in to check the hands, background geometry, and search for independent image reports.", scoreWeight: 100 }
    ],
    skill: "deepfake_awareness"
  },
  {
    id: 3,
    text: "A health blog headline claims: 'BREAKING STUDY: Moderate coffee drinkers add 10 years to their lifespan! Drink more coffee today to live forever!'",
    options: [
      { text: "Believe it completely and start drinking twice as much coffee.", scoreWeight: 20 },
      { text: "Accept it because it makes you feel good about your coffee habits.", scoreWeight: 50 },
      { text: "Investigate whether the research was a simple correlational study or if other factors are involved.", scoreWeight: 100 }
    ],
    skill: "statistical_literacy"
  },
  {
    id: 4,
    text: "You hear a leaked audio clip on social media where a candidate confesses to manipulating local campus votes in private.",
    options: [
      { text: "Post it on your social feed as undeniable proof of corruption.", scoreWeight: 25 },
      { text: "Wait for a few friends to confirm they heard it too before you believe it.", scoreWeight: 55 },
      { text: "Consider that AI voice clones can be generated easily, and check for robotic artifacts or verified media statements.", scoreWeight: 100 }
    ],
    skill: "ai_literacy"
  },
  {
    id: 5,
    text: "A post written in all caps appears on your feed: '🚨 THE INTERNATIONAL PLANNERS ARE SECRETLY PREPARING FOR ANOTHER COMPULSORY CONFINEMENT! WAKE UP AND RETRIEVE CASH BEFORE THEY SHUT BANKING!'",
    options: [
      { text: "Share it to warn your family; it is better to be safe than sorry.", scoreWeight: 15 },
      { text: "Believe it because of the high urgency and emotional tone of the post.", scoreWeight: 40 },
      { text: "Recognize the text is attempting to trigger fear-driven panic, and search for official notices or bank statements.", scoreWeight: 100 }
    ],
    skill: "emotional_manipulation"
  },
  {
    id: 6,
    text: "A user posts a photo showing empty shelves in a supermarket with the caption: 'This is the economic collapse under the current governor.' The photo is crisp and unedited.",
    options: [
      { text: "Comment angry remarks blaming the government.", scoreWeight: 25 },
      { text: "Trust it since the photo is clear and has not been edited or photoshopped.", scoreWeight: 50 },
      { text: "Run a reverse image search on the photo to see if it is from an older incident or different location.", scoreWeight: 100 }
    ],
    skill: "lateral_reading"
  }
];

export default function DiagnosticQuiz() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const handleSelectOption = (optionWeight: number) => {
    setAnswers({ ...answers, [currentIdx]: optionWeight });
    
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
      }, 400);
    } else {
      setIsFinishing(true);
      submitDiagnostic();
    }
  };

  const submitDiagnostic = async () => {
    const newScores: Partial<SkillScores> = {
      source_verification: 50,
      bias_detection: 60,
      deepfake_awareness: 50,
      emotional_manipulation: 50,
      statistical_literacy: 50,
      lateral_reading: 50,
      ai_literacy: 50
    };

    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      const weight = answers[idx] ?? 50;
      newScores[q.skill] = weight;
    });

    await dbService.updateSkillScores(newScores);
    await dbService.saveBaselineIfMissing(newScores as SkillScores);
    await dbService.updateProfile({ 
      completed_diagnostic: true,
      xp: 200,
      streak: 1
    });

    setTimeout(() => {
      router.push('/profile');
    }, 2500);
  };

  const progressPercent = ((currentIdx) / DIAGNOSTIC_QUESTIONS.length) * 100;
  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIdx];

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9] relative overflow-hidden">
      
      {/* Laser Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-30 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-[scan_6s_linear_infinite] pointer-events-none" />
      <div className="absolute -top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-2xl glass-panel p-6 sm:p-10 rounded-3xl border border-sky-500/10 shadow-[0_0_60px_rgba(56,189,248,0.06)] relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {isFinishing ? (
              <motion.div 
                key="finishing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center space-y-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-xl animate-pulse" />
                  <Fingerprint className="w-20 h-20 text-sky-400 animate-[pulse_1.5s_infinite] drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-400">
                    CALIBRATING COGNITIVE PROFILE
                  </h2>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Analyzing media vulnerability patterns and building your customized Media DNA map...
                  </p>
                </div>

                <div className="w-56 bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-sky-950">
                  <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-1.5 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={currentIdx}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-8"
              >
                {/* Header Progress Widget */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                    <span className="flex items-center text-sky-400">
                      <Shield className="w-3.5 h-3.5 mr-1" />
                      MIL Scan Protocol
                    </span>
                    <span>Task {currentIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
                  </div>
                  <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-sky-950">
                    <div 
                      className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Scenario Area */}
                <div className="space-y-5">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-sky-400 shrink-0">
                      <HelpCircle className="w-5.5 h-5.5" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg sm:text-xl font-bold leading-relaxed text-white">
                        {currentQuestion.text}
                      </h3>
                      {currentQuestion.subText && (
                        <div className="p-4 bg-slate-950/80 border-l-4 border-amber-500 rounded-r-xl text-amber-300 text-xs sm:text-sm font-mono whitespace-pre-line leading-relaxed border border-sky-950/20">
                          {currentQuestion.subText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(opt.scoreWeight)}
                      className="w-full text-left p-4 sm:p-5 rounded-2xl border border-sky-950 bg-slate-900/10 hover:bg-sky-950/15 hover:border-sky-500/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.05)] text-slate-300 hover:text-white transition-all duration-200 text-sm sm:text-base flex items-center justify-between group active:scale-[0.99] cursor-pointer"
                    >
                      <span className="leading-relaxed pr-6">{opt.text}</span>
                      <ArrowRight className="w-5 h-5 text-sky-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(0); }
        }
        @keyframes loading {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
