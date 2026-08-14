'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ShieldAlert, BrainCircuit, Cpu, Trophy, ArrowRight, Shield, Terminal, 
  Zap, CheckCircle2, AlertTriangle, Eye, Target, TrendingUp, Users, 
  Microscope, BarChart2, Globe, ChevronRight, Star, Lock, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, Profile } from '@/lib/db';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    const init = async () => {
      const p = await dbService.getProfile();
      setProfile(p);
    };
    init();

    const interval = setInterval(() => {
      setTerminalStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const terminalLines = [
    { text: "System Booting... RealityOS v2.0 active.", color: "text-slate-500" },
    { text: language === 'ur' ? "مشکوک دعویٰ: 'کل یونیورسٹی میں ہنگامی تعطیل کا اعلان کیا گیا ہے'" : "Claim detected: 'Emergency closure of university announced tomorrow'", color: "text-sky-400 font-bold" },
    { text: language === 'ur' ? "ذیلی دعووں کا تجزیہ کیا جا رہا ہے..." : "Decomposing into atomic claims...", color: "text-purple-400" },
    { text: language === 'ur' ? "سرکاری ویب سائٹوں کی جانچ... [ریکارڈ نہیں ملا]" : "Checking official university channels... [404: NO RECORD FOUND]", color: "text-rose-400" },
    { text: language === 'ur' ? "فیصلہ: 🟡 گمراہ کن (جھوٹا حوالہ + جذباتی اپیل)" : "Verdict: 🟡 MISLEADING (Urgency appeal + Fake source context)", color: "text-amber-400 font-black" }
  ];

  const primaryHref = profile?.completed_diagnostic 
    ? '/battlefield' 
    : profile?.username && profile.username !== 'Sleuth_Novice'
      ? '/diagnostic'
      : '/onboarding';

  const loopStepsData = [
    { step: '01', label: t.loop_step_1, desc: t.loop_step_1_desc, color: 'text-sky-400' },
    { step: '02', label: t.loop_step_2, desc: t.loop_step_2_desc, color: 'text-indigo-400' },
    { step: '03', label: t.loop_step_3, desc: t.loop_step_3_desc, color: 'text-purple-400' },
    { step: '04', label: t.loop_step_4, desc: t.loop_step_4_desc, color: 'text-pink-400' },
    { step: '05', label: t.loop_step_5, desc: t.loop_step_5_desc, color: 'text-amber-400' },
    { step: '06', label: t.loop_step_6, desc: t.loop_step_6_desc, color: 'text-emerald-400' },
  ];

  const featuresData = [
    { icon: ShieldAlert, name: language === 'ur' ? 'معلوماتی میدانِ جنگ' : 'Information Battlefield', desc: t.features_desc.split('.')[0] || 'Survive a live crisis feed under time pressure. Sort facts from manipulation.', color: 'text-rose-400 border-rose-950/30 bg-rose-950/10 hover:border-rose-500/40' },
    { icon: Microscope, name: t.lab, desc: language === 'ur' ? 'کسی بھی دعوے کو بنیادی حقائق میں تقسیم کریں اور شواہد کی جانچ کریں۔' : 'Decompose any claim into atomic facts and trace each through evidence.', color: 'text-purple-400 border-purple-950/30 bg-purple-950/10 hover:border-purple-500/40' },
    { icon: BrainCircuit, name: t.profile, desc: language === 'ur' ? 'آپ کی میڈیا خواندگی کا ذاتی نقشہ۔ اپنی کارکردگی کا موازنہ کریں۔' : 'Your personal 7-skill media literacy map. Track measurable improvement.', color: 'text-sky-400 border-sky-950/30 bg-sky-950/10 hover:border-sky-500/40' },
    { icon: Cpu, name: language === 'ur' ? 'ہیرا پھیری کی لیب' : 'AI Manipulation Lab', desc: language === 'ur' ? 'دیکھیں کہ کس طرح سچے واقعات کو سنسنی خیز بنا کر پیش کیا جاتا ہے۔' : 'See how neutral facts become viral clickbait. Learn the craft of manipulation.', color: 'text-indigo-400 border-indigo-950/30 bg-indigo-950/10 hover:border-indigo-500/40' },
    { icon: Target, name: language === 'ur' ? 'شخصی تربیت' : 'Adaptive Training', desc: language === 'ur' ? 'یہ نظام خود بخود آپ کے کمزور ترین شعبے کی زیادہ مشق کرواتا ہے۔' : 'Challenges target your weakest skill automatically. No two sessions alike.', color: 'text-amber-400 border-amber-950/30 bg-amber-950/10 hover:border-amber-500/40' },
    { icon: BarChart2, name: language === 'ur' ? 'پیمائش کے قابل نتائج' : 'Impact Measurement', desc: language === 'ur' ? 'تحقیقات کی شروعات اور آخر میں ٹیسٹ آپ کی کارکردگی کا واضح موازنہ فراہم کرتے ہیں۔' : 'Pre/post assessment proves your literacy improved. Real numbers, not vibes.', color: 'text-emerald-400 border-emerald-950/30 bg-emerald-950/10 hover:border-emerald-500/40' },
    { icon: Trophy, name: t.leaderboard, desc: language === 'ur' ? 'کیمپس اور قومی سطح کے لیڈر بورڈ پر دوسرے طلبہ سے مقابلہ کریں۔' : 'Compete against your campus. Rank by verified skill improvement, not just time.', color: 'text-pink-400 border-pink-950/30 bg-pink-950/10 hover:border-pink-500/40' },
    { icon: Globe, name: language === 'ur' ? 'شواہد کا گراف' : 'Evidence Graph', desc: language === 'ur' ? 'ذرائع، شواہد اور دعووں کے باہمی تعلق کا مکمل بصری خاکہ۔' : 'Visual network of claims, sources, and contradictions. See the full picture.', color: 'text-cyan-400 border-cyan-950/30 bg-cyan-950/10 hover:border-cyan-500/40' },
  ];

  const problemStatsData = [
    { stat: t.problem_stat_1, label: t.problem_stat_1_lbl },
    { stat: t.problem_stat_2, label: t.problem_stat_2_lbl },
    { stat: t.problem_stat_3, label: t.problem_stat_3_lbl },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] overflow-hidden text-slate-100 relative">
      
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* ─── HERO ─── */}
        <section className="py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8 text-start"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-950/80 to-purple-950/80 border border-sky-800/80 px-4 py-1.5 rounded-full text-sky-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Zap className="w-4 h-4 text-sky-400 animate-pulse fill-sky-400/20" />
              <span>{language === 'ur' ? 'یونیسکو اے آئی اور میڈیا خواندگی ہیکاتھون 2026' : 'UNESCO AI & Media Literacy Hackathon 2026'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight">
                <span className="block text-white">{t.hero_title_1}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] mt-2">
                  {t.hero_title_2}
                </span>
                <span className="block text-white mt-1">{t.hero_title_3}</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              {t.hero_desc}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link 
                href={primaryHref}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 font-bold rounded-xl text-white overflow-hidden shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Shield className="w-5 h-5 mr-2" />
                <span>{t.enter_battlefield}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Link>
              
              <Link
                href={profile?.completed_diagnostic ? '/profile' : '/diagnostic'}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-900/80 border border-sky-950/80 hover:border-sky-500/50 rounded-xl text-slate-300 font-bold hover:text-white transition-all hover:bg-slate-950"
              >
                {t.test_literacy}
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.free_use}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.no_data_sold}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.unesco_aligned}</span>
            </div>
          </motion.div>

          {/* Right Column: Terminal Window */}
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
                  VERIFY_ENGINE@REALITYOS
                </div>
              </div>

              {/* Terminal contents */}
              <div className="p-5 font-mono text-xs sm:text-sm h-64 flex flex-col justify-start space-y-2.5 overflow-y-auto text-start">
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
                      {idx === terminalStep ? <span className="text-sky-400 mr-1.5 font-black">&#62;</span> : <span className="text-slate-600 mr-1.5">#</span>}
                      {line.text}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

        </section>

        {/* ─── THE PROBLEM ─── */}
        <section className="py-16 border-t border-sky-950/50 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-rose-950/30 border border-rose-900/50 px-4 py-1.5 rounded-full text-rose-400 text-xs font-semibold tracking-wide">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.the_problem_title}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">{t.the_problem_heading}</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.the_problem_desc}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {problemStatsData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-sky-950/50 text-center space-y-2"
              >
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">{item.stat}</div>
                <p className="text-sm text-slate-400 leading-relaxed">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-16 border-t border-sky-950/50 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{t.how_it_works}</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">{t.how_it_works_desc}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loopStepsData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-panel p-6 rounded-xl border border-sky-950/50 hover:border-sky-800/50 transition-all group text-start"
              >
                <div className={`text-xs font-black uppercase tracking-widest mb-3 ${item.color}`}>{item.step}</div>
                <h3 className={`text-lg font-extrabold mb-2 ${item.color}`}>{item.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── COMPARISON (old way vs RealityOS) ─── */}
        <section className="py-16 border-t border-sky-950/50 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{t.vs_title}</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">{t.vs_desc}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-start">
            <div className="glass-panel p-8 rounded-2xl border-red-950/20 relative group hover:border-red-900/35 transition-all">
              <div className="absolute -top-3 left-6 rtl:right-6 rtl:left-auto px-3 py-0.5 bg-red-950/60 border border-red-900/60 text-red-400 text-[10px] font-black rounded-full uppercase tracking-wider">{t.trad_title}</div>
              <ul className="space-y-5 mt-4">
                {[
                  t.trad_1,
                  t.trad_2,
                  t.trad_3,
                  t.trad_4,
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-500 mr-3 rtl:ml-3 rtl:mr-0 text-lg font-bold shrink-0">✕</span>
                    <p className="text-slate-400 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-emerald-950/25 relative group hover:border-emerald-800/40 transition-all shadow-[0_0_30px_rgba(16,185,129,0.02)]">
              <div className="absolute -top-3 left-6 rtl:right-6 rtl:left-auto px-3 py-0.5 bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider">{t.ros_title}</div>
              <ul className="space-y-5 mt-4">
                {[
                  t.ros_1,
                  t.ros_2,
                  t.ros_3,
                  t.ros_4,
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-500 mr-3 rtl:ml-3 rtl:mr-0 text-lg font-bold shrink-0">✓</span>
                    <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section className="py-16 border-t border-sky-950/50 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{t.features_title}</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">{t.features_desc}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuresData.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`glass-panel p-6 rounded-xl border transition-all text-start ${feature.color}`}
                >
                  <Icon className="w-6 h-6 mb-3" />
                  <h3 className="text-sm font-extrabold mb-2">{feature.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 7 SKILLS GRID ─── */}
        <section className="py-16 border-t border-sky-950/50 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{t.skills_title}</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">{t.skills_desc}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { name: language === 'ur' ? 'ذرائع کی\nتصدیق' : 'Source\nVerification', desc: language === 'ur' ? 'ویب لنکس اور مصنف کی صداقت جانچنا' : 'Verifying domain URLs and author credentials', color: 'border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.08)]' },
              { name: language === 'ur' ? 'جانب داریت کی\nشناخت' : 'Bias\nDetection', desc: language === 'ur' ? 'نظریاتی تعصبات اور مخصوص الفاظ کا کھوج' : 'Identifying ideological bias and loaded phrases', color: 'border-purple-500/20 text-purple-400 hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.08)]' },
              { name: language === 'ur' ? 'ڈیپ فیک\nکی پہچان' : 'Deepfake\nAwareness', desc: language === 'ur' ? 'مصنوعی تصاویر میں جسمانی خامیوں کو پکڑنا' : 'Spotting physical visual flaws in AI-generated media', color: 'border-pink-500/20 text-pink-400 hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.08)]' },
              { name: language === 'ur' ? 'جذباتی\nہیرا پھیری' : 'Emotional\nManipulation', desc: language === 'ur' ? 'خوف پر مبنی سنسنی خیز خبروں سے بچنا' : 'Filtering clickbait panic and urgent headlines', color: 'border-rose-500/20 text-rose-400 hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.08)]' },
              { name: language === 'ur' ? 'اعداد و شمار کی\nخواندگی' : 'Statistical\nLiteracy', desc: language === 'ur' ? 'گمراہ کن گراف اور نامکمل اعداد و شمار کو سمجھنا' : 'Decoding misleading scales and cherry-picked data', color: 'border-amber-500/20 text-amber-400 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.08)]' },
              { name: language === 'ur' ? 'متبادل ذرائع سے\nپڑھنا' : 'Lateral\nReading', desc: language === 'ur' ? 'تصدیق کیلئے خبر کی ویب سائٹ سے باہر نکلنا' : 'Searching context details outside the source domain', color: 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.08)]' },
              { name: language === 'ur' ? 'مصنوعی ذہانت کی\nخواندگی' : 'AI\nLiteracy', desc: language === 'ur' ? 'مصنوعی متن اور آواز کے کلونز کی پہچان' : 'Detecting synthetic text, images and cloned speech', color: 'border-indigo-500/20 text-indigo-400 hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.08)]' }
            ].map((skill, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.03 }}
                className={`glass-panel p-4 rounded-xl border text-center flex flex-col justify-between min-h-[130px] cursor-default transition-all ${skill.color}`}
              >
                <div className="text-xs font-black uppercase tracking-wider leading-relaxed whitespace-pre-line">{skill.name}</div>
                <div className="text-[10px] text-slate-500 mt-2 font-medium leading-relaxed">{skill.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── IMPACT MEASUREMENT ─── */}
        <section className="py-16 border-t border-sky-950/50 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{t.impact_title}</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">{t.impact_desc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-start">
            {[
              { 
                icon: Target, 
                title: language === 'ur' ? 'ابتدائی تشخیصی ٹیسٹ' : 'Pre-Assessment Baseline', 
                desc: language === 'ur' ? '7 سوالوں پر مبنی تشخیصی ٹیسٹ مکمل کریں۔ ہم تمام جہتوں میں آپ کی صلاحیت کا جائزہ لیں گے۔' : 'Complete the 7-question Media Literacy Diagnostic. We capture your skill baseline across all dimensions.',
                badge: language === 'ur' ? 'مرحلہ 1' : 'Step 1', badgeColor: 'bg-sky-950 text-sky-400 border-sky-900'
              },
              { 
                icon: BrainCircuit, 
                title: language === 'ur' ? 'فعال تربیتی سیشن' : 'Active Training Sessions',
                desc: language === 'ur' ? 'میدانِ جنگ، اکھاڑے اور تحقیقاتی لیب میں حصہ لیں۔ سسٹم آپ کی کارکردگی کے مطابق تبدیل ہو گا۔' : 'Work through the Battlefield, Arena, and Investigation Lab. The platform adapts to your weakest areas.',
                badge: language === 'ur' ? 'مرحلہ 2' : 'Step 2', badgeColor: 'bg-indigo-950 text-indigo-400 border-indigo-900'
              },
              { 
                icon: TrendingUp, 
                title: language === 'ur' ? 'ترقی کا موازنہ' : 'Post-Assessment Growth',
                desc: language === 'ur' ? 'دوبارہ ٹیسٹ مکمل کریں۔ آپ کا میڈیا ڈی این اے ہر شعبے میں آئی تبدیلی کی درست پیمائش فراہم کرے گا۔' : 'Retake comparable assessments. Your Media DNA shows the exact improvement delta for every skill.',
                badge: language === 'ur' ? 'مرحلہ 3' : 'Step 3', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-900'
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 rounded-2xl border border-sky-950/50 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <Icon className="w-8 h-8 text-sky-400 mt-0.5" />
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Example impact score */}
          <div className="glass-panel p-8 rounded-2xl border border-emerald-500/15 bg-emerald-950/5 max-w-2xl mx-auto text-center space-y-4">
            <div className="text-sm text-slate-400 uppercase tracking-widest font-bold">{language === 'ur' ? 'مثالی طالب علم کی کارکردگی' : 'Example Learner Progress'}</div>
            <div className="flex items-center justify-center gap-6 text-2xl sm:text-4xl font-black">
              <span className="text-slate-400">52 / 100</span>
              <span className="text-slate-600 text-2xl">→</span>
              <span className="text-emerald-400">78 / 100</span>
            </div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-900/60 text-emerald-400 font-black text-sm">
              {language === 'ur' ? '+26 میڈیا خواندگی میں بہتری' : '+26 points Media Literacy Improvement'}
            </div>
            <p className="text-xs text-slate-500 italic">{language === 'ur' ? 'آپ کے حقیقی نتائج تشخیصی ٹیسٹ کی بنیاد پر مرتب کیے جائیں گے۔' : 'Your actual results will be calculated from your own baseline assessment.'}</p>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-20 border-t border-sky-950/50 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {t.final_cta_heading}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                {t.final_cta_span}
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {t.final_cta_desc.split('.')[0]}.<br />
              <strong className="text-slate-200">{t.final_cta_desc.split('.')[1] || 'It teaches you how to decide.'}</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href={primaryHref}
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 font-bold rounded-xl text-white overflow-hidden shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                {t.enter_battlefield}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Link>
            </div>

            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {t.footer_unesco}
            </p>
          </motion.div>
        </section>

      </main>

      <footer className="w-full border-t border-sky-950/60 py-8 bg-[#090d16]/80 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>RealityOS © 2026 — Built for the UNESCO MIL Track</span>
          <div className="flex items-center gap-4">
            <Link href="/diagnostic" className="hover:text-slate-300 transition-all">{t.test_literacy}</Link>
            <Link href="/battlefield" className="hover:text-slate-300 transition-all">{t.battlefield}</Link>
            <Link href="/lab" className="hover:text-slate-300 transition-all">{t.lab}</Link>
            <Link href="/leaderboard" className="hover:text-slate-300 transition-all">{t.leaderboard}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
