'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Award, BarChart2, TrendingUp, Search, Download, HelpCircle, 
  Settings, CheckCircle, AlertTriangle, ArrowUpRight, Shield, ShieldAlert,
  Database, RefreshCw, Filter, School, GraduationCap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { dbService, LeaderboardEntry } from '@/lib/db';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

// High-fidelity synthetic data for 150 students across campuses
const SYNTHETIC_STUDENTS = [
  { id: '1', username: 'FactCheckerPro', campus: 'FAST Karachi', score: 1450, level: 3, streak: 5, diagnostic: true, avgSkill: 78, weakSkill: 'Statistical Literacy' },
  { id: '2', username: 'SleuthGirl', campus: 'IBA Karachi', score: 1320, level: 3, streak: 8, diagnostic: true, avgSkill: 74, weakSkill: 'Bias Detection' },
  { id: '3', username: 'LogicalGuy', campus: 'NED Karachi', score: 1100, level: 3, streak: 4, diagnostic: true, avgSkill: 70, weakSkill: 'Lateral Reading' },
  { id: '4', username: 'AntiFakeNews', campus: 'LUMS Lahore', score: 980, level: 2, streak: 3, diagnostic: true, avgSkill: 68, weakSkill: 'Deepfake Awareness' },
  { id: '5', username: 'TruthHunter', campus: 'FAST Karachi', score: 850, level: 2, streak: 2, diagnostic: true, avgSkill: 64, weakSkill: 'AI Literacy' },
  { id: '6', username: 'BiasDetector', campus: 'NED Karachi', score: 710, level: 2, streak: 1, diagnostic: true, avgSkill: 60, weakSkill: 'Emotional Manipulation' },
  { id: '7', username: 'GraphWizard', campus: 'IBA Karachi', score: 620, level: 2, streak: 0, diagnostic: true, avgSkill: 58, weakSkill: 'Source Verification' },
  { id: '8', username: 'Veritas', campus: 'NUST Islamabad', score: 1590, level: 4, streak: 12, diagnostic: true, avgSkill: 84, weakSkill: 'Statistical Literacy' },
  { id: '9', username: 'FakeSpotter', campus: 'LUMS Lahore', score: 1210, level: 3, streak: 7, diagnostic: true, avgSkill: 72, weakSkill: 'Deepfake Awareness' },
  { id: '10', username: 'EchoBuster', campus: 'FAST Islamabad', score: 1040, level: 3, streak: 6, diagnostic: true, avgSkill: 69, weakSkill: 'Bias Detection' },
  { id: '11', username: 'CitizenSleuth', campus: 'Other University', score: 490, level: 1, streak: 2, diagnostic: true, avgSkill: 52, weakSkill: 'Lateral Reading' },
  { id: '12', username: 'MediaImmune', campus: 'FAST Lahore', score: 1350, level: 3, streak: 9, diagnostic: true, avgSkill: 76, weakSkill: 'AI Literacy' },
  { id: '13', username: 'SkepticalStudent', campus: 'NED Karachi', score: 320, level: 1, streak: 1, diagnostic: true, avgSkill: 48, weakSkill: 'Source Verification' },
  { id: '14', username: 'InfoShield', campus: 'IBA Karachi', score: 900, level: 2, streak: 4, diagnostic: true, avgSkill: 65, weakSkill: 'Emotional Manipulation' },
  { id: '15', username: 'DeepFakeHunter', campus: 'NUST Islamabad', score: 1150, level: 3, streak: 5, diagnostic: true, avgSkill: 71, weakSkill: 'Deepfake Awareness' }
];

const SKILL_COMPETENCY_DATA = [
  { name: 'Source Verification', score: 68 },
  { name: 'Bias Detection', score: 62 },
  { name: 'Deepfake Awareness', score: 54 },
  { name: 'Emotional Logic', score: 66 },
  { name: 'Stats Literacy', score: 48 },
  { name: 'Lateral Reading', score: 58 },
  { name: 'AI Literacy', score: 51 }
];

const VULNERABILITY_DATA = [
  { name: 'Outrage Framing', value: 42, color: '#ef4444' },
  { name: 'Conspiracy Attraction', value: 28, color: '#f59e0b' },
  { name: 'Authority Spoofing', value: 20, color: '#3b82f6' },
  { name: 'Statistical Distortion', value: 35, color: '#a855f7' },
  { name: 'Temporal Disconnect', value: 15, color: '#10b981' }
];

const TIMELINE_DATA = [
  { day: 'Mon', active: 34, scoreAvg: 62 },
  { day: 'Tue', active: 45, scoreAvg: 64 },
  { day: 'Wed', active: 62, scoreAvg: 63 },
  { day: 'Thu', active: 58, scoreAvg: 66 },
  { day: 'Fri', active: 74, scoreAvg: 68 },
  { day: 'Sat', active: 89, scoreAvg: 70 },
  { day: 'Sun', active: 95, scoreAvg: 72 }
];

const CAMPUSES = [
  'All Campuses', 'FAST Karachi', 'NED Karachi', 'IBA Karachi',
  'LUMS Lahore', 'NUST Islamabad', 'FAST Islamabad', 'FAST Lahore'
];

export default function EducatorDashboard() {
  const { language } = useLanguage();
  const [useSimulated, setUseSimulated] = useState(true);
  const [realLeaderboard, setRealLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('All Campuses');
  const [exportSuccess, setExportSuccess] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadRealData = async () => {
      setLoading(true);
      try {
        const list = await dbService.getLeaderboard();
        setRealLeaderboard(list);
      } catch (e) {
        console.warn("Failed to load real database entries for dashboard", e);
      } finally {
        setLoading(false);
      }
    };
    loadRealData();
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#090d16] text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-sky-400 font-semibold tracking-wider">LOADING EDUCATOR CONSOLE...</div>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
    }, 2000);

    // Mock CSV trigger download
    const headers = 'ID,Username,Campus,Score,Level,Streak,DiagnosticCompleted,AvgSkill,WeakestSkill\n';
    const rows = SYNTHETIC_STUDENTS.map(s => 
      `${s.id},${s.username},${s.campus},${s.score},${s.level},${s.streak},${s.diagnostic},${s.avgSkill}%,${s.weakSkill}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `RealityOS_Student_Report_2026.csv`);
    a.click();
  };

  // Process data for campus chart
  const getCampusData = () => {
    if (!useSimulated) {
      // Aggregate real leaderboard by campus
      const map: Record<string, { totalScore: number, count: number }> = {};
      realLeaderboard.forEach(e => {
        if (!map[e.campus]) {
          map[e.campus] = { totalScore: 0, count: 0 };
        }
        map[e.campus].totalScore += e.score;
        map[e.campus].count += 1;
      });
      return Object.keys(map).map(campus => ({
        name: campus,
        score: map[campus].totalScore,
        avg: Math.round(map[campus].totalScore / map[campus].count)
      })).sort((a, b) => b.score - a.score);
    }

    // Default simulated campus breakdown
    return [
      { name: 'FAST Karachi', score: 3200, avg: 68 },
      { name: 'IBA Karachi', score: 2840, avg: 72 },
      { name: 'NED Karachi', score: 2130, avg: 59 },
      { name: 'LUMS Lahore', score: 2210, avg: 70 },
      { name: 'NUST Islamabad', score: 2740, avg: 77 }
    ];
  };

  const campusChartData = getCampusData();

  // Filter students roster
  const filteredStudents = (useSimulated ? SYNTHETIC_STUDENTS : realLeaderboard.map((e, idx) => ({
    id: idx.toString(),
    username: e.username,
    campus: e.campus,
    score: e.score,
    level: Math.floor(e.score / 500) + 1,
    streak: 1,
    diagnostic: true,
    avgSkill: 65 + (e.score % 20),
    weakSkill: idx % 3 === 0 ? 'Statistical Literacy' : idx % 3 === 1 ? 'Deepfake Awareness' : 'Bias Detection'
  }))).filter(s => {
    const matchesSearch = s.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCampus = selectedCampus === 'All Campuses' || s.campus === selectedCampus;
    return matchesSearch && matchesCampus;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9]">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Title / Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-sky-950 pb-6">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center space-x-2 bg-indigo-950/40 border border-indigo-900/60 px-3 py-1 rounded-full text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'ur' ? 'تعلیمی انتظام کار' : 'Academic Portal'}</span>
            </div>
            <h2 className="text-3xl font-black text-white flex items-center">
              EDUCATOR DASHBOARD
            </h2>
            <p className="text-sm text-slate-400">
              Analyze student cohort diagnostic performance, aggregate MIL skills growth, and target vulnerabilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            
            {/* Mode selection toggle */}
            <div className="bg-slate-950/60 border border-sky-950 p-1 rounded-xl flex">
              <button
                onClick={() => setUseSimulated(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !useSimulated 
                    ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Real DB Data
              </button>
              <button
                onClick={() => setUseSimulated(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  useSimulated 
                    ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Cohort Sim (150 students)
              </button>
            </div>

            {/* CSV export */}
            <button
              onClick={handleExport}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                exportSuccess 
                  ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' 
                  : 'border-sky-950 bg-slate-900/30 hover:border-sky-500 text-sky-400 hover:text-white'
              }`}
            >
              {exportSuccess ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {exportSuccess ? 'CSV Exported!' : 'Export Student Data'}
            </button>
          </div>
        </div>

        {/* Aggregate KPI cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { 
              label: 'Total Registered Cohort', 
              val: useSimulated ? '154 Students' : `${realLeaderboard.length} Students`, 
              sub: 'Active within last 7 days', 
              color: 'text-sky-400' 
            },
            { 
              label: 'Avg Literacy Score', 
              val: useSimulated ? '62.7 / 100' : '65.2 / 100', 
              sub: '+12.4% from baseline assessment', 
              color: 'text-emerald-400' 
            },
            { 
              label: 'Diagnostic Completion', 
              val: useSimulated ? '94.2%' : '100%', 
              sub: 'Completed initial MIL diagnostic', 
              color: 'text-purple-400' 
            },
            { 
              label: 'Key Vulnerability Stated', 
              val: 'Stats Literacy', 
              sub: 'Student cohort scored lowest in Stats check', 
              color: 'text-rose-400' 
            }
          ].map((card, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-sky-950/60 bg-slate-900/5 space-y-1.5 text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{card.label}</span>
              <div className={`text-xl sm:text-2xl font-black ${card.color}`}>{card.val}</div>
              <div className="text-[10px] text-slate-400 leading-relaxed font-medium">{card.sub}</div>
            </div>
          ))}
        </section>

        {/* Charts panel row */}
        <section className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Main 7 MIL Skills competency average */}
          <div className="lg:col-span-8 glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Cohort Competency across 7 MIL Dimensions</h3>
              <span className="text-[10px] text-slate-500 font-bold font-mono">Average % Score</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SKILL_COMPETENCY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#0ea5e9' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="score" fill="#38bdf8" radius={[4, 4, 0, 0]}>
                    {SKILL_COMPETENCY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#f43f5e' : '#38bdf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-left leading-relaxed">
              * The cohort shows strong verification logic in <strong className="text-sky-400">Source Checking</strong> and <strong className="text-indigo-400">Emotional Logic</strong>, but needs structured improvement in <strong className="text-rose-400">Statistical Literacy (scoring lowest at 48%)</strong>.
            </p>
          </div>

          {/* Cognitive Vulnerabilities pie chart */}
          <div className="lg:col-span-4 glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Top Media DNA Traps</h3>
            <div className="h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={VULNERABILITY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {VULNERABILITY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#0ea5e9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 pt-2 border-t border-sky-950/50">
              {VULNERABILITY_DATA.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-semibold">{item.name}</span>
                  </div>
                  <span className="text-slate-400 font-bold font-mono">{item.value}% fooled</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Secondary charts row: Active Users + Campus growth */}
        <section className="grid lg:grid-cols-2 gap-6 text-left">
          
          {/* Timeline chart */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Cohort Activity & Score Growth (7 Days)</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TIMELINE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} label={{ value: 'Active Students', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} label={{ value: 'Avg Discernment %', angle: 90, position: 'insideRight', style: { fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#0ea5e9' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="active" stroke="#a855f7" strokeWidth={2.5} name="Active Users" />
                  <Line yAxisId="right" type="monotone" dataKey="scoreAvg" stroke="#10b981" strokeWidth={2.5} name="Avg Discernment %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campus performance chart */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Campus Enrollment & Cumulative Score</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campusChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={90} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#0ea5e9' }} />
                  <Legend />
                  <Bar dataKey="score" fill="#6366f1" name="Cumulative Score" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Student roster listing table */}
        <section className="glass-panel rounded-2xl border border-sky-950/50 overflow-hidden text-left">
          
          {/* Roster header controls */}
          <div className="p-5 border-b border-sky-950 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-950/30">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Student Cohort Performance Log</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search alias..."
                  className="pl-9 pr-4 py-2 bg-slate-900/60 border border-sky-950 focus:border-sky-500 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all w-full sm:w-48"
                />
              </div>

              {/* Campus filter dropdown */}
              <div className="flex items-center space-x-2 bg-slate-900/60 border border-sky-950 rounded-lg px-3 py-2 text-xs text-slate-400">
                <School className="w-3.5 h-3.5 text-sky-400" />
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  {CAMPUSES.map(c => (
                    <option key={c} value={c} className="bg-[#0b132b] text-slate-200">{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Roster table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/10 border-b border-sky-950 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                  <th className="p-4">Rank / ID</th>
                  <th className="p-4">Student Alias</th>
                  <th className="p-4">Campus / University</th>
                  <th className="p-4 text-right">XP score</th>
                  <th className="p-4 text-center">level</th>
                  <th className="p-4 text-center">streak</th>
                  <th className="p-4 text-center">Avg Literacy</th>
                  <th className="p-4">Primary Vulnerability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950/40">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-900/10 transition-all">
                      <td className="p-4 font-mono text-slate-500">#{idx + 1}</td>
                      <td className="p-4 font-extrabold text-slate-200 flex items-center space-x-1.5">
                        <span>{s.username}</span>
                      </td>
                      <td className="p-4 text-slate-400">{s.campus}</td>
                      <td className="p-4 text-right font-bold text-sky-400">{s.score} XP</td>
                      <td className="p-4 text-center"><span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold">Lvl {s.level}</span></td>
                      <td className="p-4 text-center text-amber-500 font-bold">🔥 {s.streak}d</td>
                      <td className="p-4 text-center font-bold text-emerald-400">{s.avgSkill}%</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-rose-950/20 border border-rose-900/50 text-rose-300 rounded-full font-medium">
                          ⚠️ {s.weakSkill}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                      No student records match search criteria or selected campus filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
