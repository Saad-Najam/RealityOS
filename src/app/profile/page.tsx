'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Brain, ArrowRight, Play } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { dbService, Profile, SkillScores, getUserRank } from '@/lib/db';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileDNA() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillScores | null>(null);
  const [baseline, setBaseline] = useState<SkillScores | null>(null);
  const [mounted, setMounted] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      const p = await dbService.getProfile();
      const s = await dbService.getSkillScores();
      const b = await dbService.getBaselineSkillScores();
      setProfile(p);
      setSkills(s);
      setBaseline(b);
      setMounted(true);
    };
    loadData();
  }, []);

  const getAverageScore = (s: SkillScores) => {
    return Math.round(
      (s.source_verification + 
       s.bias_detection + 
       s.deepfake_awareness + 
       s.emotional_manipulation + 
       s.statistical_literacy + 
       s.lateral_reading + 
       s.ai_literacy) / 7
    );
  };

  if (!mounted || !profile || !skills) {
    return (
      <div className="flex flex-col min-h-screen bg-[#090d16] text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-sky-400 font-semibold tracking-wider">{t.loading}</div>
        </div>
      </div>
    );
  }

  // Format skills for recharts Radar Chart
  const radarData = [
    { subject: language === 'ur' ? 'تصدیقِ ذرائع' : 'Source Check', value: skills.source_verification },
    { subject: language === 'ur' ? 'جانب داریت' : 'Bias Detection', value: skills.bias_detection },
    { subject: language === 'ur' ? 'ڈیپ فیک' : 'Deepfake Awareness', value: skills.deepfake_awareness },
    { subject: language === 'ur' ? 'جذباتی تعصب' : 'Emotional Logic', value: skills.emotional_manipulation },
    { subject: language === 'ur' ? 'ریاضیاتی فہم' : 'Stats Literacy', value: skills.statistical_literacy },
    { subject: language === 'ur' ? 'بیرونی مطالعہ' : 'Lateral Reading', value: skills.lateral_reading },
    { subject: language === 'ur' ? 'مصنوعی فہم' : 'AI Literacy', value: skills.ai_literacy },
  ];

  // Dynamic analysis of Verification Style
  const getVerificationStyle = (s: SkillScores) => {
    const average = getAverageScore(s);
    
    if (s.deepfake_awareness < 50 && s.ai_literacy < 50) {
      return {
        title: language === 'ur' ? "جعلی مواد کا خطرہ" : "Vulnerable to Synthetics",
        desc: language === 'ur' ? "آپ حقیقت پسندانہ نظر آنے والی تصاویر اور آوازوں پر آسانی سے بھروسہ کرتے ہیں۔ لیب میں جا کر کام کریں۔" : "You tend to trust realistic-looking images and voices. Focus on identifying visual distortion and robotic acoustic signatures in the AI Lab.",
        color: "text-rose-400 border-rose-950/30 bg-rose-950/10"
      };
    }
    if (s.lateral_reading > 70 && s.source_verification > 70) {
      return {
        title: language === 'ur' ? "شک کرنے والا تجزیہ کار" : "Skeptical Analyst",
        desc: language === 'ur' ? "بہترین تعلیمی عادت! آپ کسی بھی دعوے پر یقین کرنے سے پہلے بیرونی مراجع سے اس کی تصدیق کرتے ہیں۔" : "Excellent lateral habits! You cross-check claims with outside references before reaching a verdict. You're hard to trick.",
        color: "text-emerald-400 border-emerald-950/30 bg-emerald-950/10"
      };
    }
    if (average > 75) {
      return {
        title: language === 'ur' ? "میڈیا گارڈین" : "Media Guardian",
        desc: language === 'ur' ? "تمام جہتوں میں بہترین کارکردگی۔ آپ آسانی سے سنسنی خیز خبروں اور جھوٹے لنکس کو پکڑ لیتے ہیں۔" : "Strong performance across all dimensions. You verify URLs, check statistical baselines, and recognize clickbait easily.",
        color: "text-sky-400 border-sky-950/30 bg-sky-950/10"
      };
    }
    return {
      title: language === 'ur' ? "وجدانی صارف" : "Intuitive Consumer",
      desc: language === 'ur' ? "آپ کی میڈیا خواندگی کے بنیادی جذبے تو اچھے ہیں، لیکن آپ کو اب بھی جدید ریاضیاتی ہیرا پھیری اور ڈیپ فیک گمراہ کر سکتے ہیں۔" : "You have decent media literacy instincts, but can still be misled by sophisticated statistical cherry-picking and deepfakes. Level up your skills in the Reality Arena.",
      color: "text-amber-400 border-amber-950/30 bg-amber-950/10"
    };
  };

  const verificationStyle = getVerificationStyle(skills);

  const skillDetails = [
    { name: language === 'ur' ? 'ذرائع کی تصدیق' : 'Source Verification', key: 'source_verification' as keyof SkillScores, score: skills.source_verification, desc: language === 'ur' ? 'ویب لنکس اور مصنف کے بارے میں جاننا۔' : 'Verifying domain URLs and check author credentials.', color: 'from-cyan-500 to-blue-500', href: '/lab' },
    { name: language === 'ur' ? 'جانب داریت کی شناخت' : 'Bias Detection', key: 'bias_detection' as keyof SkillScores, score: skills.bias_detection, desc: language === 'ur' ? 'مخصوص نظریاتی جھکاؤ اور الفاظ تلاش کرنا۔' : 'Identifying ideological bias and loaded phrases.', color: 'from-purple-500 to-indigo-500', href: '/lab' },
    { name: language === 'ur' ? 'ڈیپ فیک کی پہچان' : 'Deepfake Awareness', key: 'deepfake_awareness' as keyof SkillScores, score: skills.deepfake_awareness, desc: language === 'ur' ? 'ہاتھوں، آنکھوں اور روشنی کی خامیوں کو پکڑنا۔' : 'Spotting hands/teeth inconsistencies and lighting tells.', color: 'from-pink-500 to-rose-500', href: '/arena' },
    { name: language === 'ur' ? 'جذباتی ہیرا پھیری' : 'Emotional Manipulation', key: 'emotional_manipulation' as keyof SkillScores, score: skills.emotional_manipulation, desc: language === 'ur' ? 'خوف پر مبنی ہیرا پھیری اور سنسنی خیز سرخیوں کو فلٹر کرنا۔' : 'Filtering out clickbait fear appeals and urgent headlines.', color: 'from-rose-500 to-orange-500', href: '/battlefield' },
    { name: language === 'ur' ? 'اعداد و شمار کی خواندگی' : 'Statistical Literacy', key: 'statistical_literacy' as keyof SkillScores, score: skills.statistical_literacy, desc: language === 'ur' ? 'نامکمل اعداد و شمار اور گمراہ کن اسکیلز کی پہچان۔' : 'Spotting cherry-picked datasets and small sample sizes.', color: 'from-amber-500 to-yellow-500', href: '/lab' },
    { name: language === 'ur' ? 'متبادل ذرائع سے پڑھنا' : 'Lateral Reading', key: 'lateral_reading' as keyof SkillScores, score: skills.lateral_reading, desc: language === 'ur' ? 'سیاق و سباق کی بیرونی تصدیق کے لیے اصل لنک کو چھوڑنا۔' : 'Leaving the original source tab to verify context elsewhere.', color: 'from-emerald-500 to-teal-500', href: '/arena' },
    { name: language === 'ur' ? 'مصنوعی ذہانت کی خواندگی' : 'AI Literacy', key: 'ai_literacy' as keyof SkillScores, score: skills.ai_literacy, desc: language === 'ur' ? 'مصنوعی آوازوں اور خود کار طریقے سے تیار شدہ متن کی شناخت۔' : 'Detecting synthetic text and voice clones.', color: 'from-sky-500 to-cyan-500', href: '/arena' },
  ];

  // Smart recommendation: find weakest skill
  const weakestSkill = [...skillDetails].sort((a, b) => a.score - b.score)[0];
  const strongestSkill = [...skillDetails].sort((a, b) => b.score - a.score)[0];
  const mostImproved = baseline
    ? [...skillDetails].sort((a, b) => (b.score - (baseline[b.key] ?? 50)) - (a.score - (baseline[a.key] ?? 50)))[0]
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9]">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Profile Onboarding Check banner */}
        {!profile.completed_diagnostic && (
          <div className="p-4 bg-amber-950/30 border border-amber-900/50 text-amber-300 rounded-xl flex items-center justify-between gap-4 text-start">
            <span className="text-sm">{language === 'ur' ? 'آپ نے اب تک معلوماتی ٹیسٹ مکمل نہیں کیا! اپنے میڈیا ڈی این اے کا نقشہ حاصل کرنے کیلئے ٹیسٹ مکمل کریں۔' : "You haven't completed your diagnostic test! Finish it to calibrate your initial Media DNA radar."}</span>
            <Link href="/diagnostic" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all shrink-0">{language === 'ur' ? 'ٹیسٹ شروع کریں' : 'Take Diagnostic'}</Link>
          </div>
        )}

        {/* Level & Verification Style Panel */}
        <div className="grid md:grid-cols-3 gap-6 text-start">
          
          <div className="glass-panel p-6 rounded-2xl border border-sky-950 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{language === 'ur' ? 'صارف کا پروفائل' : 'User Identity'}</span>
              <h2 className="text-2xl font-black text-white">{profile.username}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950 text-sky-400 border border-sky-900 mt-1">
                {profile.campus}
              </span>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{language === 'ur' ? 'مجموعی ایکس پی:' : 'Total Experience:'}</span>
                <span className="text-sky-400 font-bold">{profile.xp} XP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{language === 'ur' ? 'تفتیشی لیول:' : 'Level Rank:'}</span>
                <span className="text-indigo-400 font-bold">{t.lvl} {profile.level} ({language === 'ur' ? 'میڈیا گارڈین' : getUserRank(profile.xp)})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{language === 'ur' ? 'روزانہ تسلسل:' : 'Streaks:'}</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  {profile.streak} {language === 'ur' ? 'دن' : 'Days'}
                </span>
              </div>
            </div>

            <Link 
              href="/battlefield" 
              className="mt-6 w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-rose-500 to-indigo-600 font-bold text-white rounded-xl text-sm shadow-md hover:shadow-lg transition-all gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              {t.battlefield}
            </Link>

            <Link 
              href="/arena" 
              className="mt-2.5 w-full inline-flex items-center justify-center py-3 bg-slate-900 border border-sky-950 hover:border-sky-500/50 font-bold text-slate-300 hover:text-white rounded-xl text-sm shadow-md hover:shadow-lg transition-all gap-2"
            >
              <Brain className="w-4 h-4" />
              {language === 'ur' ? 'اکھاڑے میں جائیں' : 'Enter Practice Arena'}
            </Link>
          </div>

          {/* Verification Style Analysis */}
          <div className={`glass-panel p-6 rounded-2xl border ${verificationStyle.color} flex flex-col justify-between`}>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">{language === 'ur' ? 'تحقیقاتی رویہ' : 'Verification Style'}</span>
              <h3 className="text-xl font-extrabold">{verificationStyle.title}</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                {verificationStyle.desc}
              </p>
            </div>

            <div className="mt-6 border-t border-white/5 pt-4">
              <div className="text-xs opacity-60">{language === 'ur' ? 'تجویز کردہ اگلا اقدام:' : 'Recommended next step:'}</div>
              <Link href="/lab" className="text-xs font-bold underline mt-1 flex items-center hover:opacity-80 transition-all gap-1">
                {language === 'ur' ? 'تحقیقاتی لیب میں مشق کریں' : 'Practice in AI Manipulation Lab'} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Radar Chart Column Stack */}
          <div className="space-y-6">
            
            {/* RealityOS Impact Score Card */}
            {(() => {
              const currentAvg = getAverageScore(skills);
              const baselineAvg = baseline ? getAverageScore(baseline) : null;
              const delta = baselineAvg !== null ? currentAvg - baselineAvg : 0;
              
              return (
                <div className="glass-panel p-6 rounded-2xl border border-sky-950 text-start space-y-4 relative overflow-hidden bg-slate-900/10 shadow-[0_0_20px_rgba(56,189,248,0.02)]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{language === 'ur' ? 'نمایاں ترقی' : 'Measurable Growth'}</span>
                    {baselineAvg !== null ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        delta > 0 
                          ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400' 
                          : delta === 0 
                            ? 'bg-slate-900 border-slate-950 text-slate-500' 
                            : 'bg-amber-950/20 border-amber-900/60 text-amber-500'
                      }`}>
                        {delta > 0 ? `+${delta}` : delta} {language === 'ur' ? 'پوائنٹس بہتری' : 'Competency Score'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-900 border border-slate-950 text-slate-500">
                        {language === 'ur' ? 'جائزہ جاری ہے' : 'Calibration Pending'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold block">{language === 'ur' ? 'تبدیلی کے نتائج' : 'RealityOS Impact Score'}</span>
                    <div className="text-2xl font-black text-white flex items-center">
                      {language === 'ur' ? 'میڈیا فہم:' : 'Media Literacy:'} {baselineAvg !== null ? `${baselineAvg}%` : '--'}
                      <span className="mx-2 text-slate-500">→</span>
                      <span className="text-sky-400">{currentAvg}%</span>
                    </div>
                  </div>

                  {baselineAvg === null && (
                    <div className="pt-2">
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {language === 'ur' ? 'اپنے نتائج کی موازنہ حاصل کرنے کیلئے ابتدائی تشخیصی ٹیسٹ مکمل کریں۔' : 'Complete your onboarding diagnostic scan to capture your baseline skills and trace your measurable impact.'}
                      </p>
                      <Link 
                        href="/diagnostic" 
                        className="inline-flex items-center text-xs font-bold text-sky-400 hover:text-sky-300 underline"
                      >
                        {t.test_literacy} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Radar Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-sky-950 flex flex-col items-center justify-center min-h-[300px]">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">{language === 'ur' ? 'میڈیا ڈی این اے نقشہ' : 'Media DNA Map'}</span>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} axisLine={false} />
                    <Radar name="Skills" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111a2e', border: '1px solid #1e293b', borderRadius: 8 }}
                      itemStyle={{ color: '#38bdf8' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

        {/* Smart Recommendations + Summary row */}
        {baseline && (
          <section className="glass-panel p-5 rounded-xl border border-sky-950/60 flex flex-col sm:flex-row gap-4 text-sm text-start">
            <div className="flex-1 space-y-1">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{t.prof_strength}</div>
              <div className="font-bold text-slate-200">{strongestSkill.name} ({strongestSkill.score}%)</div>
              <p className="text-xs text-slate-500">{language === 'ur' ? 'آپ اس جہت میں بہترین فہم رکھتے ہیں' : `You are good at ${strongestSkill.desc.toLowerCase()}`}</p>
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">{t.prof_weakness}</div>
              <div className="font-bold text-slate-200">{weakestSkill.name} ({weakestSkill.score}%)</div>
              <p className="text-xs text-slate-500">{language === 'ur' ? 'آپ کے جوابات اس شعبے میں مزید کام کی نشاندہی کرتے ہیں' : `Your answers suggest room to improve in ${weakestSkill.desc.toLowerCase()}`}</p>
            </div>
            {mostImproved && (
              <div className="flex-1 space-y-1">
                <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">{t.prof_improved}</div>
                <div className="font-bold text-slate-200">{mostImproved.name}</div>
                <p className="text-xs text-slate-500">+{mostImproved.score - (baseline[mostImproved.key] ?? 50)} {language === 'ur' ? 'پوائنٹس ابتدائی سکور سے زیادہ' : 'points from your baseline'}</p>
              </div>
            )}
            <div className="flex-1 flex flex-col justify-between items-start">
              <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{t.prof_recommended}</div>
              <Link href={weakestSkill.href} className="mt-2 inline-flex items-center px-4 py-2 bg-sky-950/40 border border-sky-900/50 rounded-lg text-xs font-bold text-sky-400 hover:bg-sky-900/40 hover:border-sky-500 transition-all gap-1">
                {t.prof_practice} {weakestSkill.name} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </Link>
            </div>
          </section>
        )}

        {/* Skill details table list */}
        <section className="space-y-4 text-start">
          <h3 className="text-lg font-bold text-white">{t.prof_breakdown}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillDetails.map((skill, i) => {
              const baselineScore = baseline ? baseline[skill.key] : null;
              const delta = baselineScore !== null ? skill.score - baselineScore : null;
              return (
                <div key={i} className="glass-panel p-5 rounded-xl border border-sky-950/60 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-sm font-bold text-slate-200">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        {delta !== null && (
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                            delta > 0 
                              ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400'
                              : delta < 0 
                              ? 'bg-rose-950/40 border-rose-900/60 text-rose-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        )}
                        <span className="text-xs font-black text-sky-400 bg-sky-950/80 px-2 py-0.5 border border-sky-900 rounded">
                          {skill.score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
                    {baselineScore !== null && (
                      <div className="text-[10px] text-slate-500 font-medium">{t.prof_baseline}: {baselineScore}% → {language === 'ur' ? 'اب' : 'Now'}: {skill.score}%</div>
                    )}
                  </div>
                  <div className="relative w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-sky-950 mt-4">
                    {baselineScore !== null && (
                      <div
                        className="absolute top-0 left-0 bg-slate-700 h-1.5 rounded-full"
                        style={{ width: `${baselineScore}%` }}
                      />
                    )}
                    <div 
                      className={`relative bg-gradient-to-r ${skill.color} h-1.5 rounded-full`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
