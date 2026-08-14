'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, ShieldCheck, Zap } from 'lucide-react';
import { dbService } from '@/lib/db';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

const CAMPUSES = [
  'FAST Karachi', 'FAST Islamabad', 'FAST Lahore', 'FAST Peshawar',
  'LUMS Lahore', 'IBA Karachi', 'NED Karachi', 'NUST Islamabad',
  'UET Lahore', 'University of Karachi', 'Other University', 'Independent Learner'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [campus, setCampus] = useState('');
  const [experience, setExperience] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If already completed onboarding, skip to diagnostic
    const check = async () => {
      const p = await dbService.getProfile();
      if (p.username !== 'Sleuth_Novice' && p.username !== 'Guest Detective') {
        router.push(p.completed_diagnostic ? '/profile' : '/diagnostic');
      }
    };
    check();
  }, [router]);

  const handleContinueAsGuest = async () => {
    router.push('/diagnostic');
  };

  const handleComplete = async () => {
    if (!username.trim()) return;
    setSaving(true);
    try {
      await dbService.updateProfile({
        username: username.trim().replace(/\s+/g, '_').slice(0, 20) || 'Investigator',
        campus: campus || 'Independent Learner',
      });
      router.push('/diagnostic');
    } catch {
      router.push('/diagnostic');
    }
  };

  const localizedExperienceLevels = [
    { value: 'beginner', label: language === 'ur' ? 'ابتدائی' : 'Beginner', desc: language === 'ur' ? 'میں شاذ و نادر ہی معلومات کی تصدیق کرتا ہوں' : 'I rarely check sources before sharing' },
    { value: 'intermediate', label: language === 'ur' ? 'درمیانہ' : 'Intermediate', desc: language === 'ur' ? 'میں کبھی کبھار خبروں کی جانچ کرتا ہوں' : 'I sometimes verify things I see online' },
    { value: 'advanced', label: language === 'ur' ? 'ماہر' : 'Advanced', desc: language === 'ur' ? 'میں باقاعدگی سے خبروں اور بنیادی ذرائع کی جانچ کرتا ہوں' : 'I regularly fact-check and look for primary sources' },
  ];

  const steps = [
    {
      title: t.onboarding_step_1_title,
      subtitle: t.onboarding_step_1_sub,
      content: (
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.onboarding_placeholder}
              maxLength={20}
              className="w-full pl-12 pr-4 rtl:pr-12 rtl:pl-4 py-4 bg-slate-900/60 border border-sky-950 focus:border-sky-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all text-base text-start"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {(language === 'ur' 
              ? ['سلوتھ_جاسوس', 'سگنل_ریڈر', 'فیکٹ_سلوتھ', 'میڈیا_گارڈ'] 
              : ['FactSleuth', 'InfoGuard', 'TruthAgent', 'MediaHunter', 'SignalReader']
            ).map(s => (
              <button
                key={s}
                onClick={() => setUsername(s + Math.floor(Math.random() * 90 + 10))}
                className="px-3 py-1.5 text-xs bg-sky-950/30 border border-sky-900/50 text-sky-400 rounded-lg hover:bg-sky-900/40 transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ),
      canContinue: username.trim().length >= 2,
    },
    {
      title: t.onboarding_step_2_title,
      subtitle: t.onboarding_step_2_sub,
      content: (
        <div className="grid grid-cols-2 gap-3 text-start">
          {CAMPUSES.map(c => (
            <button
              key={c}
              onClick={() => setCampus(c)}
              className={`p-3 rounded-xl border text-xs font-semibold text-start transition-all cursor-pointer ${
                campus === c
                  ? 'border-sky-500 bg-sky-950/30 text-sky-300'
                  : 'border-sky-950/60 bg-slate-900/20 text-slate-400 hover:border-sky-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      ),
      canContinue: true, // campus is optional
    },
    {
      title: t.onboarding_step_3_title,
      subtitle: t.onboarding_step_3_sub,
      content: (
        <div className="space-y-3 text-start">
          {localizedExperienceLevels.map(exp => (
            <button
              key={exp.value}
              onClick={() => setExperience(exp.value)}
              className={`w-full p-5 rounded-xl border text-start transition-all cursor-pointer ${
                experience === exp.value
                  ? 'border-sky-500 bg-sky-950/20 text-sky-300'
                  : 'border-sky-950/60 bg-slate-900/10 text-slate-300 hover:border-sky-800'
              }`}
            >
              <div className="font-bold text-sm mb-1">{exp.label}</div>
              <div className="text-xs text-slate-400">{exp.desc}</div>
            </button>
          ))}
        </div>
      ),
      canContinue: true, // experience is optional
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-xl">

          {/* Step counter */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= step ? 'bg-sky-400 w-8' : 'bg-slate-800 w-4'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-bold">{step + 1} / {steps.length}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-8 rounded-3xl border border-sky-500/10 shadow-[0_0_60px_rgba(56,189,248,0.05)] space-y-6"
            >
              {/* Step header */}
              <div className="space-y-1 text-start">
                <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-widest">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t.logo} {language === 'ur' ? 'ترتیب' : 'Onboarding'}</span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">{currentStep.title}</h2>
                <p className="text-sm text-slate-400">{currentStep.subtitle}</p>
              </div>

              {/* Step content */}
              <div>{currentStep.content}</div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleNext}
                  disabled={saving || !currentStep.canContinue}
                  className="w-full py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 cursor-pointer shadow-lg shadow-sky-500/15 text-sm"
                >
                  {saving ? (
                    <span>{t.onboarding_calibrating}</span>
                  ) : isLastStep ? (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      {t.onboarding_start_diagnostic}
                    </>
                  ) : (
                    <>
                      {t.onboarding_continue}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                  )}
                </button>

                {step === 0 && (
                  <button
                    onClick={handleContinueAsGuest}
                    className="w-full py-3 text-slate-400 text-sm font-medium hover:text-slate-200 transition-all cursor-pointer text-center"
                  >
                    {t.onboarding_guest}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Privacy note */}
          <p className="text-center text-xs text-slate-600 mt-6 leading-relaxed">
            {t.onboarding_privacy}
          </p>
        </div>
      </main>
    </div>
  );
}
