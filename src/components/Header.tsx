'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Flame, BrainCircuit, User, Library, Cpu, Activity, ShieldAlert } from 'lucide-react';
import { dbService, Profile } from '@/lib/db';

export default function Header() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  // Poll database profile to keep XP, level, and streak live
  useEffect(() => {
    const fetchProfile = async () => {
      const p = await dbService.getProfile();
      setProfile(p);
    };
    fetchProfile();

    // Trigger update on storage changes or custom events
    const interval = setInterval(fetchProfile, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Battlefield', href: '/battlefield', icon: ShieldAlert },
    { name: 'Arena', href: '/arena', icon: BrainCircuit },
    { name: 'Investigation Lab', href: '/lab', icon: Cpu },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Media DNA', href: '/profile', icon: Activity },
  ];

  const getRankName = (xp: number) => {
    if (xp < 500) return 'Novice Investigator';
    if (xp < 1200) return 'Source Scout';
    if (xp < 2500) return 'Fact Detective';
    if (xp < 4000) return 'Media Guardian';
    return '🏆 Reality Master';
  };

  const xpProgress = profile ? (profile.xp % 500) / 5 : 0;
  const xpNeeded = profile ? 500 - (profile.xp % 500) : 500;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-950 bg-[#090d16]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Glowing Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              REALITY<span className="text-sky-400 font-normal">OS</span>
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-950/80 text-sky-400 border border-sky-800">
            MIL-AI Prototype
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-950/80 text-sky-400 border border-sky-800/60 shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User stats widget */}
        {profile && (
          <div className="flex items-center space-x-4">
            
            {/* Streak Badge */}
            <div className="flex items-center space-x-1 bg-amber-950/30 border border-amber-900/50 px-2 py-1 rounded-lg text-amber-400 text-xs sm:text-sm font-semibold shadow-[0_0_10px_rgba(245,158,11,0.05)]">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{profile.streak} Day Streak</span>
            </div>

            {/* Level and XP Progress Widget */}
            <div className="hidden lg:flex flex-col text-right">
              <div className="text-xs text-slate-400 font-medium">
                {getRankName(profile.xp)} <span className="text-sky-400 font-bold">Lvl {profile.level}</span>
              </div>
              <div className="w-32 bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden border border-sky-950">
                <div 
                  className="bg-gradient-to-r from-sky-400 to-indigo-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">{xpNeeded} XP to next level</span>
            </div>

            {/* Avatar Profile Link */}
            <Link 
              href="/profile" 
              className={`p-1.5 rounded-full border transition-all ${
                pathname === '/profile' 
                  ? 'border-sky-500 bg-sky-950/30' 
                  : 'border-slate-800 bg-slate-950/80 hover:border-slate-600'
              }`}
            >
              <User className="w-5 h-5 text-slate-300" />
            </Link>

          </div>
        )}
      </div>

      {/* Mobile navigation bottom bar for responsive display */}
      <div className="md:hidden w-full border-t border-sky-950 bg-[#090d16]/95 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-semibold transition-all ${
                isActive ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
