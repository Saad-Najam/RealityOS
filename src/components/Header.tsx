'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Flame, BrainCircuit, User, Cpu, Activity, ShieldAlert, Globe, GraduationCap } from 'lucide-react';
import { dbService, Profile, getUserRank } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { language, t, setLanguage } = useLanguage();

  // Listen to profile updates to keep XP, level, and streak live
  useEffect(() => {
    const fetchProfile = async () => {
      const p = await dbService.getProfile();
      setProfile(p);
    };
    fetchProfile();

    window.addEventListener('realityos-profile-updated', fetchProfile);
    return () => window.removeEventListener('realityos-profile-updated', fetchProfile);
  }, []);

  const navItems = [
    { name: t.battlefield, href: '/battlefield', icon: ShieldAlert },
    { name: t.arena, href: '/arena', icon: BrainCircuit },
    { name: t.lab, href: '/lab', icon: Cpu },
    { name: t.leaderboard, href: '/leaderboard', icon: Trophy },
    { name: t.profile, href: '/profile', icon: Activity },
    { name: t.educator, href: '/educator', icon: GraduationCap },
  ];

  const xpProgress = profile ? (profile.xp % 500) / 5 : 0;
  const xpNeeded = profile ? 500 - (profile.xp % 500) : 500;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-950 bg-[#090d16]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Glowing Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              {t.logo.split('OS')[0]}<span className="text-sky-400 font-normal">{t.logo.includes('OS') || t.logo.includes('او ایس') ? (language === 'ur' ? ' او ایس' : 'OS') : ''}</span>
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-950/80 text-sky-400 border border-sky-800">
            {t.mil_prototype}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex space-x-1 lg:space-x-2">
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
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:border-sky-500 text-slate-300 hover:text-white transition-all text-xs font-bold cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {profile && (
            <>
              {/* Streak Badge */}
              <div className="hidden sm:flex items-center space-x-1 bg-amber-950/30 border border-amber-900/50 px-2 py-1 rounded-lg text-amber-400 text-xs sm:text-sm font-semibold shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{profile.streak} {t.streak}</span>
              </div>

              {/* Level and XP Progress Widget */}
              <div className="hidden lg:flex flex-col text-right">
                <div className="text-xs text-slate-400 font-medium">
                  {language === 'ur' ? 'تفتیش کار درجہ' : getUserRank(profile.xp)} <span className="text-sky-400 font-bold">{t.lvl} {profile.level}</span>
                </div>
                <div className="w-32 bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden border border-sky-950">
                  <div 
                    className="bg-gradient-to-r from-sky-400 to-indigo-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">{xpNeeded} {t.xp_needed}</span>
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
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation bottom bar for responsive display (or smaller desktops) */}
      <div className="xl:hidden w-full border-t border-sky-950 bg-[#090d16]/95 py-2 flex items-center justify-around">
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
              <span className="max-w-[70px] truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
