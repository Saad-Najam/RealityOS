'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, ShieldAlert, Award, Star, School, Search, RefreshCw, UserCheck } from 'lucide-react';
import { dbService, Profile, LeaderboardEntry } from '@/lib/db';
import Header from '@/components/Header';

export default function LeaderboardView() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [list, setList] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'campus'>('individual');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const campuses = [
    'FAST Karachi',
    'NED Karachi',
    'IBA Karachi',
    'LUMS Lahore',
    'NUST Islamabad',
    'Independent'
  ];

  const loadData = async () => {
    const p = await dbService.getProfile();
    const l = await dbService.getLeaderboard();
    setProfile(p);
    setSelectedCampus(p.campus);
    setList(l);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateCampus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const campus = e.target.value;
    setSelectedCampus(campus);
    setIsUpdating(true);
    
    if (profile) {
      const updated = await dbService.updateProfile({ campus });
      setProfile(updated);
      await dbService.syncLeaderboardScore(updated.username, campus, updated.xp);
      const l = await dbService.getLeaderboard();
      setList(l);
    }
    
    setTimeout(() => {
      setIsUpdating(false);
    }, 600);
  };

  // Aggregate scores by campus
  const getCampusStandings = () => {
    const map: Record<string, number> = {};
    list.forEach(e => {
      map[e.campus] = (map[e.campus] || 0) + e.score;
    });

    return Object.keys(map)
      .map(campus => ({ campus, score: map[campus] }))
      .sort((a, b) => b.score - a.score);
  };

  const campusStandings = getCampusStandings();
  const topThree = list.slice(0, 3);
  const remaining = list.slice(3);

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9]">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center">
              <Trophy className="w-8 h-8 mr-2.5 text-amber-500 fill-amber-500/10 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
              LEADERBOARD
            </h2>
            <p className="text-sm text-slate-400">Compete with student investigators nationwide.</p>
          </div>

          {/* Campus Selector widget */}
          {profile && (
            <div className="glass-panel px-4 py-3 rounded-xl border border-sky-950 flex items-center space-x-3 w-full sm:w-auto">
              <School className="w-5 h-5 text-sky-400" />
              <div className="flex-grow">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Affiliated Campus</div>
                <select
                  value={selectedCampus}
                  onChange={handleUpdateCampus}
                  disabled={isUpdating}
                  className="bg-transparent text-sm text-slate-200 font-semibold focus:outline-none cursor-pointer pr-4"
                >
                  {campuses.map(c => (
                    <option key={c} value={c} className="bg-[#0b132b] text-slate-200">{c}</option>
                  ))}
                </select>
              </div>
              {isUpdating && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />}
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-sky-950">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'individual'
                ? 'border-sky-400 text-sky-400 bg-sky-950/10 shadow-[inset_0_-2px_0_#0ea5e9]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Individual Sleuths
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'campus'
                ? 'border-sky-400 text-sky-400 bg-sky-950/10 shadow-[inset_0_-2px_0_#0ea5e9]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Campus Standings
          </button>
        </div>

        {/* Ranks list */}
        {activeTab === 'individual' ? (
          <div className="space-y-6">
            
            {/* Top 3 Podium visualization */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4">
              
              {/* Silver (Rank 2) */}
              {topThree[1] && (
                <div className="glass-panel p-4 rounded-xl border border-slate-700/30 flex flex-col items-center justify-center text-center mt-6 order-1">
                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-800 rounded-full border-2 border-slate-400 flex items-center justify-center font-black text-slate-400 text-sm">2</div>
                    <Award className="w-5 h-5 text-slate-400 absolute -bottom-1 -right-1" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mt-3 truncate w-full">{topThree[1].username}</h4>
                  <span className="text-[10px] text-slate-500 truncate w-full">{topThree[1].campus}</span>
                  <span className="text-xs font-bold text-sky-400 mt-2">{topThree[1].score} XP</span>
                </div>
              )}

              {/* Gold (Rank 1) */}
              {topThree[0] && (
                <div className="glass-panel p-5 rounded-xl border border-amber-500/30 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(245,158,11,0.05)] order-2 relative -translate-y-4">
                  <div className="absolute -top-3 px-2 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full uppercase tracking-wider">Leader</div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-amber-950/40 rounded-full border-2 border-amber-400 flex items-center justify-center font-black text-amber-400 text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">1</div>
                    <Star className="w-6 h-6 text-amber-400 fill-amber-500 absolute -bottom-1 -right-1" />
                  </div>
                  <h4 className="text-base font-black text-white mt-3 truncate w-full">{topThree[0].username}</h4>
                  <span className="text-[10px] text-slate-400 truncate w-full">{topThree[0].campus}</span>
                  <span className="text-sm font-black text-amber-400 mt-2">{topThree[0].score} XP</span>
                </div>
              )}

              {/* Bronze (Rank 3) */}
              {topThree[2] && (
                <div className="glass-panel p-4 rounded-xl border border-amber-800/20 flex flex-col items-center justify-center text-center mt-10 order-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-amber-950/20 rounded-full border-2 border-amber-800 flex items-center justify-center font-black text-amber-700 text-sm">3</div>
                    <Award className="w-4 h-4 text-amber-700 absolute -bottom-1 -right-1" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mt-3 truncate w-full">{topThree[2].username}</h4>
                  <span className="text-[10px] text-slate-500 truncate w-full">{topThree[2].campus}</span>
                  <span className="text-xs font-bold text-sky-400 mt-2">{topThree[2].score} XP</span>
                </div>
              )}

            </div>

            {/* List for remainder ranks */}
            <div className="glass-panel rounded-2xl border border-sky-950/50 divide-y divide-sky-950/40 overflow-hidden">
              {remaining.map((entry, idx) => {
                const rankNum = idx + 4;
                const isCurrentUser = profile && entry.username === profile.username;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-4 transition-all ${
                      isCurrentUser ? 'bg-sky-950/20 border-l-4 border-sky-400' : 'hover:bg-slate-900/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <span className="text-sm font-bold text-slate-500 w-6 text-center">{rankNum}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-200 flex items-center">
                          {entry.username}
                          {isCurrentUser && <span className="ml-2 text-[10px] px-1.5 py-0.2 bg-sky-950 border border-sky-900 text-sky-400 rounded">You</span>}
                        </div>
                        <span className="text-xs text-slate-400 truncate block mt-0.5">{entry.campus}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-sky-400">{entry.score} XP</span>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* Campus Standing listing */
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl border border-sky-950/50 divide-y divide-sky-950/40 overflow-hidden">
              {campusStandings.map((standing, idx) => {
                const rankNum = idx + 1;
                const isUserSchool = profile && standing.campus === profile.campus;
                
                // Get medallion styles
                const rankBadgeColor = rankNum === 1 
                  ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' 
                  : rankNum === 2 
                    ? 'bg-slate-800/40 text-slate-400 border-slate-500/30' 
                    : rankNum === 3 
                      ? 'bg-amber-900/10 text-amber-700 border-amber-800/30' 
                      : 'bg-slate-950 text-slate-500 border-sky-950/60';

                return (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-5 transition-all ${
                      isUserSchool ? 'bg-sky-950/20 border-l-4 border-sky-400' : 'hover:bg-slate-900/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border ${rankBadgeColor}`}>
                        {rankNum}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm sm:text-base font-bold text-slate-200 flex items-center">
                          {standing.campus}
                          {isUserSchool && <span className="ml-2.5 text-[9px] px-1.5 py-0.5 bg-sky-950 border border-sky-900 text-sky-400 rounded-full font-bold uppercase tracking-wider">Your Campus</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-sky-400 block">{standing.score} XP</span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Cumulative</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
