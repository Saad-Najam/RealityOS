'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, Flame, Trophy, Award, Brain, ArrowRight, UserCheck, Play, HelpCircle, EyeOff } from 'lucide-react';
import { dbService, Profile, SkillScores, getUserRank } from '@/lib/db';
import Header from '@/components/Header';

export default function ProfileDNA() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillScores | null>(null);
  const [baseline, setBaseline] = useState<SkillScores | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const p = await dbService.getProfile();
      const s = await dbService.getSkillScores();
      const b = await dbService.getBaselineSkillScores();
      setProfile(p);
      setSkills(s);
      setBaseline(b);
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
          <div className="animate-pulse text-sky-400 font-semibold tracking-wider">LOADING DNA PROFILE...</div>
        </div>
      </div>
    );
  }

  // Format skills for recharts Radar Chart
  const radarData = [
    { subject: 'Source Check', value: skills.source_verification },
    { subject: 'Bias Detection', value: skills.bias_detection },
    { subject: 'Deepfake Awareness', value: skills.deepfake_awareness },
    { subject: 'Emotional Logic', value: skills.emotional_manipulation },
    { subject: 'Stats Literacy', value: skills.statistical_literacy },
    { subject: 'Lateral Reading', value: skills.lateral_reading },
    { subject: 'AI Literacy', value: skills.ai_literacy },
  ];

  // Dynamic analysis of Verification Style
  const getVerificationStyle = (s: SkillScores) => {
    const average = (s.source_verification + s.bias_detection + s.deepfake_awareness + s.emotional_manipulation + s.statistical_literacy + s.lateral_reading + s.ai_literacy) / 7;
    
    if (s.deepfake_awareness < 50 && s.ai_literacy < 50) {
      return {
        title: "Vulnerable to Synthetics",
        desc: "You tend to trust realistic-looking images and voices. Focus on identifying visual distortion and robotic acoustic signatures in the AI Lab.",
        color: "text-rose-400 border-rose-950/30 bg-rose-950/10"
      };
    }
    if (s.lateral_reading > 70 && s.source_verification > 70) {
      return {
        title: "Skeptical Analyst",
        desc: "Excellent lateral habits! You cross-check claims with outside references before reaching a verdict. You're hard to trick.",
        color: "text-emerald-400 border-emerald-950/30 bg-emerald-950/10"
      };
    }
    if (average > 75) {
      return {
        title: "Media Guardian",
        desc: "Strong performance across all dimensions. You verify URLs, check statistical baselines, and recognize clickbait easily.",
        color: "text-sky-400 border-sky-950/30 bg-sky-950/10"
      };
    }
    return {
      title: "Intuitive Consumer",
      desc: "You have decent media literacy instincts, but can still be misled by sophisticated statistical cherry-picking and deepfakes. Level up your skills in the Reality Arena.",
      color: "text-amber-400 border-amber-950/30 bg-amber-950/10"
    };
  };

  const verificationStyle = getVerificationStyle(skills);

  const skillDetails = [
    { name: 'Source Verification', score: skills.source_verification, desc: 'Verifying domain URLs and check author credentials.', color: 'from-cyan-500 to-blue-500' },
    { name: 'Bias Detection', score: skills.bias_detection, desc: 'Identifying ideological bias and loaded phrases.', color: 'from-purple-500 to-indigo-500' },
    { name: 'Deepfake Awareness', score: skills.deepfake_awareness, desc: 'Spotting hands/teeth inconsistencies and lighting tells.', color: 'from-pink-500 to-rose-500' },
    { name: 'Emotional Manipulation', score: skills.emotional_manipulation, desc: 'Filtering out clickbait fear appeals and urgent headlines.', color: 'from-rose-500 to-orange-500' },
    { name: 'Statistical Literacy', score: skills.statistical_literacy, desc: 'Spotting cherry-picked datasets and small sample sizes.', color: 'from-amber-500 to-yellow-500' },
    { name: 'Lateral Reading', score: skills.lateral_reading, desc: 'Leaving the original source tab to verify context elsewhere.', color: 'from-emerald-500 to-teal-500' },
    { name: 'AI Literacy', score: skills.ai_literacy, desc: 'Detecting synthetic text and voice clones.', color: 'from-sky-500 to-cyan-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9]">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Profile Onboarding Check banner */}
        {!profile.completed_diagnostic && (
          <div className="p-4 bg-amber-950/30 border border-amber-900/50 text-amber-300 rounded-xl flex items-center justify-between">
            <span className="text-sm">You haven't completed your diagnostic test! Finish it to calibrate your initial Media DNA radar.</span>
            <Link href="/diagnostic" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all">Take Diagnostic</Link>
          </div>
        )}

        {/* Level & Verification Style Panel */}
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-sky-950 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">User Identity</span>
              <h2 className="text-2xl font-black text-white">{profile.username}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950 text-sky-400 border border-sky-900 mt-1">
                {profile.campus}
              </span>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Experience:</span>
                <span className="text-sky-400 font-bold">{profile.xp} XP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Level Rank:</span>
                <span className="text-indigo-400 font-bold">Lvl {profile.level} ({getUserRank(profile.xp)})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Streaks:</span>
                <span className="text-amber-500 font-bold flex items-center">
                  <Flame className="w-4 h-4 mr-0.5 fill-amber-500" />
                  {profile.streak} Days
                </span>
              </div>
            </div>

            <Link 
              href="/battlefield" 
              className="mt-6 w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-rose-500 to-indigo-600 font-bold text-white rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Play className="w-4 h-4 mr-2 fill-white" />
              Information Battlefield
            </Link>

            <Link 
              href="/arena" 
              className="mt-2.5 w-full inline-flex items-center justify-center py-3 bg-slate-900 border border-sky-950 hover:border-sky-500/50 font-bold text-slate-300 hover:text-white rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Brain className="w-4 h-4 mr-2" />
              Enter Practice Arena
            </Link>
          </div>

          {/* Verification Style Analysis */}
          <div className={`glass-panel p-6 rounded-2xl border ${verificationStyle.color} flex flex-col justify-between`}>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">Verification Style</span>
              <h3 className="text-xl font-extrabold">{verificationStyle.title}</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                {verificationStyle.desc}
              </p>
            </div>

            <div className="mt-6 border-t border-white/5 pt-4">
              <div className="text-xs opacity-60">Recommended next step:</div>
              <Link href="/lab" className="text-xs font-bold underline mt-1 block flex items-center hover:opacity-80 transition-all">
                Practice in AI Manipulation Lab <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
                <div className="glass-panel p-6 rounded-2xl border border-sky-950 text-left space-y-4 relative overflow-hidden bg-slate-900/10 shadow-[0_0_20px_rgba(56,189,248,0.02)]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Measurable Growth</span>
                    {baselineAvg !== null ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        delta > 0 
                          ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400' 
                          : delta === 0 
                            ? 'bg-slate-900 border-slate-950 text-slate-500' 
                            : 'bg-amber-950/20 border-amber-900/60 text-amber-500'
                      }`}>
                        {delta > 0 ? `+${delta}` : delta} Competency Score
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-900 border border-slate-950 text-slate-500">
                        Calibration Pending
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold block">RealityOS Impact Score</span>
                    <div className="text-2xl font-black text-white flex items-center">
                      Media Literacy: {baselineAvg !== null ? `${baselineAvg}%` : '--'}
                      <span className="mx-2 text-slate-500">→</span>
                      <span className="text-sky-400">{currentAvg}%</span>
                    </div>
                  </div>

                  {baselineAvg === null && (
                    <div className="pt-2">
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        Complete your onboarding diagnostic scan to capture your baseline skills and trace your measurable impact.
                      </p>
                      <Link 
                        href="/diagnostic" 
                        className="inline-flex items-center text-xs font-bold text-sky-400 hover:text-sky-300 underline"
                      >
                        Take Onboarding Diagnostic →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Radar Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-sky-950 flex flex-col items-center justify-center min-h-[300px]">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Media DNA Map</span>
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

        {/* Skill details table list */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">MIL Skill Competency Breakdown</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillDetails.map((skill, i) => (
              <div key={i} className="glass-panel p-5 rounded-xl border border-sky-950/60 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-200">{skill.name}</span>
                    <span className="text-xs font-black text-sky-400 bg-sky-950/80 px-2 py-0.5 border border-sky-900 rounded">
                      {skill.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-sky-950 mt-4">
                  <div 
                    className={`bg-gradient-to-r ${skill.color} h-1.5 rounded-full`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements / Badges Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">Earned Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="glass-panel p-4 rounded-xl border border-sky-950 flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-sky-950/40 rounded-full text-sky-400 border border-sky-900/60">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-200">First Onboarding</h4>
              <p className="text-[10px] text-slate-500">Diagnostic completed successfully.</p>
            </div>

            <div className={`glass-panel p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${
              profile.xp >= 500 ? 'border-sky-900/60 opacity-100' : 'border-slate-950 opacity-40'
            }`}>
              <div className="p-3 bg-indigo-950/40 rounded-full text-indigo-400 border border-indigo-900/40">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-200">Source Scout</h4>
              <p className="text-[10px] text-slate-500">Reached 500 total XP points.</p>
            </div>

            <div className={`glass-panel p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${
              profile.streak >= 3 ? 'border-amber-900/60 opacity-100' : 'border-slate-950 opacity-40'
            }`}>
              <div className="p-3 bg-amber-950/40 rounded-full text-amber-500 border border-amber-900/40 animate-pulse">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-200">Consistency Spark</h4>
              <p className="text-[10px] text-slate-500">Maintained a 3-day verification streak.</p>
            </div>

            <div className={`glass-panel p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${
              profile.xp >= 1500 ? 'border-purple-900/60 opacity-100' : 'border-slate-950 opacity-40'
            }`}>
              <div className="p-3 bg-purple-950/40 rounded-full text-purple-400 border border-purple-900/40">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-200">Fact Detective</h4>
              <p className="text-[10px] text-slate-500">Reached 1500 total XP points.</p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
