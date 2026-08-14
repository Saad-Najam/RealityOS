'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Clock, Shield, 
  HelpCircle, Eye, AlertTriangle, RefreshCw, Terminal, 
  UserX, Heart, Share2, Flame, Trophy, Play, CheckCircle2, XCircle
} from 'lucide-react';
import { dbService, Profile, SkillScores } from '@/lib/db';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

interface BattlefieldPost {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  role: 'journalist' | 'bot' | 'influencer' | 'advertiser' | 'citizen' | 'spoofed_official';
  roleLabel: string;
  content: string;
  likes: number;
  shares: number;
  isFake: boolean;
  manipulationType?: string;
  biasesTriggered: string[];
  explanation: string;
}

export default function Battlefield() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillScores | null>(null);
  const { language, t } = useLanguage();
  
  // Game state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  
  // User selections: map post ID to 'TRUST', 'FLAG', or 'UNASSIGNED'
  const [sortActions, setSortActions] = useState<Record<number, 'TRUST' | 'FLAG'>>({});
  
  // Post slider navigation
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  // Results calculation
  const [showReport, setShowReport] = useState(false);
  const [stats, setStats] = useState({
    correctTrust: 0,
    correctFlag: 0,
    incorrectTrust: 0,
    incorrectFlag: 0,
    unassigned: 0,
    score: 0,
    followersDelta: 0,
    credibilityDelta: 0,
    biasesUnlocked: [] as string[]
  });

  const getLocalizedFeed = (): BattlefieldPost[] => {
    if (language === 'ur') {
      return [
        {
          id: 1,
          author: "جیو نیٹ پاکستان",
          handle: "@GeoNet_PK",
          avatar: "G",
          role: "journalist",
          roleLabel: "تصدیق شدہ خبر رساں ادارہ (سطح ۲)",
          content: "🚨 زلزلے کی اطلاع: دارالحکومت کے قریبی علاقے میں 6.1 شدت کا زلزلہ آیا ہے۔ امدادی ٹیمیں نقصان کا جائزہ لے رہی ہیں۔ گھروں کے اندر رہیں اور باضابطہ بیانات مانیٹر کریں۔ افواہیں نہ پھیلائیں۔",
          likes: 4500,
          shares: 1200,
          isFake: false,
          biasesTriggered: [],
          explanation: "یہ ایک معتبر خبر رساں ادارے کی سائنسی اور متوازن رپورٹ ہے جس میں پرسکون رہنے کی ہدایت کی گئی ہے۔"
        },
        {
          id: 2,
          author: "پاکستان کرائسز واچ",
          handle: "@CrisisWatch_PK",
          avatar: "🤖",
          role: "bot",
          roleLabel: "خود کار بوٹ اکاؤنٹ (سطح ۶)",
          content: "🔥 ہنگامی خبر: زلزلے کے جھٹکوں کی وجہ سے شمالی صنعتی سیکٹر کا نیوکلیئر کولنگ پلانٹ پھٹ گیا ہے! زہریلے کیمیکل کا اخراج جاری ہے! فوراً جنوب کی طرف بھاگیں! حکومت اس خبر کو دبا رہی ہے! ☢️🚨",
          likes: 8900,
          shares: 4800,
          isFake: true,
          manipulationType: "خوف اور سازش کا مفروضہ",
          biasesTriggered: ["جلدی بازی کا تعصب", "سازش پسندی"],
          explanation: "یہ پوسٹ خوف و ہراس، مبالغہ آرائی اور سازشی مفروضے پر مبنی ہے۔ نیوکلیئر پلانٹ بالکل محفوظ ہے اور ایسی خبریں خوف پھیلانے کا سبب بنتی ہیں۔"
        },
        {
          id: 3,
          author: "زویا خان ولاگز",
          handle: "@Zoya_K_Fashion",
          avatar: "Z",
          role: "influencer",
          roleLabel: "سوشل میڈیا انفلوئنسر (سطح ۶)",
          content: "توبہ! کلفٹن کے فلیٹس زلزلے کی وجہ سے مکمل منہدم ہو گئے! میرے ایک فالوور نے ابھی یہ ویڈیو بھیجی ہے۔ انتہائی خوفناک منظر! سب کو وارن کرنے کیلئے اسے ری ٹویٹ کریں! 😱💔 #earthquake #karachi",
          likes: 12000,
          shares: 6200,
          isFake: true,
          manipulationType: "پرانا اور غلط سیاق و سباق",
          biasesTriggered: ["بھیڑ چال تعصب", "جذباتی اشتعال"],
          explanation: "ویڈیو تو حقیقی ہے لیکن یہ 2019 میں دوسرے ملک میں گرائی گئی ایک پرانی عمارت کی ہے۔ بحران کے دوران پرانی ویڈیو شیئر کرنے سے جھوٹا ہراس پھیلتا ہے۔"
        },
        {
          id: 4,
          author: "ایمرجنسی سپلائز کارپوریشن",
          handle: "@EmergSupplies_PK",
          avatar: "📦",
          role: "advertiser",
          roleLabel: "تجارتی اشتہار (سطح ۵)",
          content: "زلزلے بنا بتائے آتے ہیں! اپنے پیاروں کی حفاظت کو یقینی بنائیں۔ ہنگامی راشن اور حفاظتی کٹ پر 50 فیصد رعایت، صرف اگلے 2 گھنٹوں کیلئے! لنک بائیو میں دیکھیں۔ 🛡️⚡",
          likes: 210,
          shares: 45,
          isFake: false,
          biasesTriggered: ["کمیاب اشیاء کا تعصب"],
          explanation: "یہ ایک تجارتی اشتہار ہے جو لوگوں کے خوف کا فائدہ اٹھا کر اپنی فروخت بڑھانے کی کوشش کر رہا ہے۔"
        },
        {
          id: 5,
          author: "حمزہ صدیقی",
          handle: "@HamzaS_FAST",
          avatar: "H",
          role: "citizen",
          roleLabel: "عام شہری (سطح ۶)",
          content: "گلشن بلاک 4 میں زلزلے کے شدید جھٹکے محسوس کیے گئے۔ پنکھا جھول رہا تھا اور کتابوں کی الماری گر گئی۔ سب لوگ سڑکوں پر نکل آئے ہیں۔ ہمارے بلاک میں کوئی بڑا نقصان نہیں دکھا۔",
          likes: 85,
          shares: 12,
          isFake: false,
          biasesTriggered: [],
          explanation: "یہ ایک عام رہائشی کی حقیقی اور سادہ رپورٹ ہے جس میں بغیر کسی مبالغہ آرائی کے فوری حالات بتائے گئے ہیں۔"
        },
        {
          id: 6,
          author: "چیف کمشنر سیکیورٹی",
          handle: "@ChiefComm_Sec_PK",
          avatar: "🏛️",
          role: "spoofed_official",
          roleLabel: "جعلی سرکاری اکاؤنٹ (سطح ۶)",
          content: "⚠️ سرکاری ہنگامی الرٹ: تمام رہائشی فوری طور پر علاقہ خالی کر دیں کیونکہ ایک اور شدید جھٹکا متوقع ہے۔ تلاشی ٹیموں کی آسانی کیلئے گھروں کے دروازے کھلے چھوڑ دیں۔ فوری عمل کریں۔",
          likes: 15400,
          shares: 9800,
          isFake: true,
          manipulationType: "جعلی نوٹیفیکیشن ٹیمپلیٹ",
          biasesTriggered: ["جھوٹی اتھارٹی کا تعصب", "غلط سیکیورٹی ہدایات"],
          explanation: "یہ ایک جعلی اکاؤنٹ ہے جس کا نام اور ہینڈل ملتا جلتا ہے۔ سرکاری ہدایات میں کبھی بھی چوروں کی آسانی کیلئے دروازے کھلے رکھنے کا نہیں کہا جاتا۔"
        }
      ];
    }

    return [
      {
        id: 1,
        author: "GeoNet Pakistan",
        handle: "@GeoNet_PK",
        avatar: "G",
        role: "journalist",
        roleLabel: "Verified News Agency (Tier 2)",
        content: "🚨 SEISMIC UPDATE: A 6.1 magnitude earthquake has hit 25km north-east of the metropolitan area. Civil defence teams are assessing damage. Stay indoors and monitor official portals. Do not panic.",
        likes: 4500,
        shares: 1200,
        isFake: false,
        biasesTriggered: [],
        explanation: "This is a reliable report from an established news agency with specific scientific coordinates and a calm, advisory tone."
      },
      {
        id: 2,
        author: "Pakistan Crisis Watch",
        handle: "@CrisisWatch_PK",
        avatar: "🤖",
        role: "bot",
        roleLabel: "Coordinated Bot Account (Tier 6)",
        content: "🔥 URGENT: The nuclear cooling grid in the northern industrial sector has CRACKED due to the tremor! Toxic radiation leak imminent! FLEE SOUTH IMMEDIATELY! Big pharma and authorities are hiding this! ☢️🚨",
        likes: 8900,
        shares: 4800,
        isFake: true,
        manipulationType: "Urgency Appeal & Conspiracy",
        biasesTriggered: ["Urgency Bias", "Conspiracy Deflection"],
        explanation: "This post uses high-intensity alarms, capitalization, and conspiracy framing. There is no radiation leak, and sharing this causes artificial mass panic."
      },
      {
        id: 3,
        author: "Zoya Khan Vlogs",
        handle: "@Zoya_K_Fashion",
        avatar: "Z",
        role: "influencer",
        roleLabel: "Social Influencer (Tier 6)",
        content: "OMG! Clifton high-rise apartments just completely collapsed! Look at this clip a follower sent me. Absolute horror! Retweet to warn everyone! 😱💔 #earthquake #karachi",
        likes: 12000,
        shares: 6200,
        isFake: true,
        manipulationType: "False Context (Out-of-date media)",
        biasesTriggered: ["Bandwagon Effect", "Emotional Outrage"],
        explanation: "The video Zoya shared is real, but it is from a building demolition in another country back in 2019. Sharing it during a crisis spreads dangerous spatial panic."
      },
      {
        id: 4,
        author: "Emergency Supplies Corp",
        handle: "@EmergSupplies_PK",
        avatar: "📦",
        role: "advertiser",
        roleLabel: "Commercial Advertiser (Tier 5)",
        content: "Earthquakes strike without warning! Protect your loved ones. Get our Tactical Disaster Preparedness Kit with 120h rations at 50% discount for the next 2 hours only! Link in bio. 🛡️⚡",
        likes: 210,
        shares: 45,
        isFake: false,
        biasesTriggered: ["Scarcity Framing"],
        explanation: "This is commercial spam taking advantage of public fear during a crisis to drive sales."
      },
      {
        id: 5,
        author: "Hamza Siddiqui",
        handle: "@HamzaS_FAST",
        avatar: "H",
        role: "citizen",
        roleLabel: "Ordinary Resident (Tier 6)",
        content: "Ground shook solid for 15 seconds here in Gulshan Block 4. Fan was swaying, bookshelf fell. Everyone is out in the streets. No structural damage visible on our block though.",
        likes: 85,
        shares: 12,
        isFake: false,
        biasesTriggered: [],
        explanation: "This is an authentic personal citizen report describing immediate physical surroundings without exaggerations."
      },
      {
        id: 6,
        author: "Chief Commissioner Security",
        handle: "@ChiefComm_Sec_PK",
        avatar: "🏛️",
        role: "spoofed_official",
        roleLabel: "Spoofed Official Handle (Tier 6)",
        content: "⚠️ OFFICIAL MANDATORY NOTICE: The Provincial Command orders immediate evacuation of all residential sectors due to imminent tectonic aftershock. Leave building doors unlocked for sweep teams. Evacuate immediately.",
        likes: 15400,
        shares: 9800,
        isFake: true,
        manipulationType: "Forged Authority Screenshot",
        biasesTriggered: ["Authority Bias", "False Security Guidelines"],
        explanation: "This account has a slightly misspelled handle. Official commands do not ask citizens to leave keys or doors unlocked, which is a tactic used by burglars during evacuations."
      }
    ];
  };

  const localizedFeed = getLocalizedFeed();

  useEffect(() => {
    const load = async () => {
      const p = await dbService.getProfile();
      const s = await dbService.getSkillScores();
      setProfile(p);
      setSkills(s);
    };
    load();
  }, []);

  // Timer loop
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft === 0 && isPlaying) {
        calculateEcosystemReport();
      }
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setTimeLeft(90);
    setSortActions({});
    setActiveCardIdx(0);
    setShowReport(false);
  };

  const handleAction = (postId: number, action: 'TRUST' | 'FLAG') => {
    setSortActions(prev => ({ ...prev, [postId]: action }));
    if (activeCardIdx < localizedFeed.length - 1) {
      setTimeout(() => {
        setActiveCardIdx(activeCardIdx + 1);
      }, 350);
    }
  };

  const calculateEcosystemReport = async () => {
    setIsPlaying(false);

    let correctTrust = 0;
    let correctFlag = 0;
    let incorrectTrust = 0; // trusted a fake post
    let incorrectFlag = 0;  // flagged a true post
    let unassigned = 0;
    const biases: string[] = [];

    localizedFeed.forEach(post => {
      const action = sortActions[post.id];
      if (!action) {
        unassigned++;
        return;
      }

      if (action === 'TRUST') {
        if (!post.isFake) {
          correctTrust++;
        } else {
          incorrectTrust++;
          post.biasesTriggered.forEach(b => {
            if (!biases.includes(b)) biases.push(b);
          });
        }
      } else { // FLAG
        if (post.isFake) {
          correctFlag++;
        } else {
          incorrectFlag++;
        }
      }
    });

    const totalAnswered = correctTrust + correctFlag + incorrectTrust + incorrectFlag;
    const score = totalAnswered > 0 
      ? Math.round(((correctTrust + correctFlag) / localizedFeed.length) * 100) 
      : 0;

    // Follower and credibility impacts
    const followersDelta = (correctTrust + correctFlag) * 50 - (incorrectTrust * 150) - (unassigned * 20);
    const credibilityDelta = (correctTrust + correctFlag) * 5 - (incorrectTrust * 10) - (unassigned * 2);

    setStats({
      correctTrust,
      correctFlag,
      incorrectTrust,
      incorrectFlag,
      unassigned,
      score,
      followersDelta,
      credibilityDelta,
      biasesUnlocked: biases
    });

    // Record XP and achievements updates
    const xpGained = score >= 60 ? 300 : 100;
    if (profile) {
      const updatedProfile = await dbService.updateProfile({
        xp: profile.xp + xpGained,
        streak: profile.streak + 1
      });
      setProfile(updatedProfile);
      await dbService.syncLeaderboardScore(updatedProfile.username, updatedProfile.campus, updatedProfile.xp);

      // Sync simulation stats locally
      if (typeof window !== 'undefined') {
        const savedStats = localStorage.getItem('realityos_sim_stats');
        const currentStats = savedStats ? JSON.parse(savedStats) : { followers: 1200, credibility: 70 };
        const nextFollowers = Math.max(100, currentStats.followers + followersDelta);
        const nextCred = Math.max(10, Math.min(100, currentStats.credibility + credibilityDelta));
        localStorage.setItem('realityos_sim_stats', JSON.stringify({ followers: nextFollowers, credibility: nextCred }));
      }
    }

    // Adaptively adjust skill scores
    if (skills) {
      const scale = score >= 60 ? 8 : -4;
      await dbService.updateSkillScores({
        lateral_reading: Math.max(10, Math.min(100, skills.lateral_reading + scale)),
        source_verification: Math.max(10, Math.min(100, skills.source_verification + scale))
      });
    }

    setShowReport(true);
  };

  const progressPercent = ((Object.keys(sortActions).length) / localizedFeed.length) * 100;
  const currentPost = localizedFeed[activeCardIdx];

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9] relative">
      <Header />

      {/* Emergency flashing overlay alert */}
      {isPlaying && (
        <div className="w-full bg-rose-950/40 border-b border-rose-900/60 py-2.5 px-4 text-center text-xs font-black text-rose-400 flex items-center justify-center space-x-2 uppercase tracking-widest animate-pulse z-25">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{language === 'ur' ? '⚠️ ہنگامی صورتحال سیمولیشن چالو ہے: زلزلے کی لائیو افواہیں' : '⚠️ EMERGENCY SIMULATION PROTOCOL ACTIVE: SECTOR 4 BREAKING INCIDENT'}</span>
        </div>
      )}

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 space-y-8 z-10">
        
        {!isPlaying && !showReport ? (
          /* Introduction Screen */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 sm:p-12 rounded-3xl border border-sky-500/10 text-center space-y-8 max-w-2xl mx-auto shadow-[0_0_50px_rgba(56,189,248,0.05)] mt-10"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 bg-rose-950/30 border border-rose-900/50 px-3 py-1 rounded-full text-rose-400 text-xs font-semibold tracking-wide uppercase">
                <Terminal className="w-3.5 h-3.5" />
                <span>{language === 'ur' ? 'میدانِ جنگ سیمولیشن' : 'Ecosystem Crisis Simulation'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">{language === 'ur' ? 'معلوماتی میدانِ جنگ' : 'INFORMATION BATTLEFIELD'}</h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                {language === 'ur' 
                  ? '"صرف غلط معلومات کی شناخت نہ کریں۔ اس کے درمیان بچنا سیکھیں۔" وقت کے شدید دباؤ میں سچ اور جھوٹ کو الگ کریں۔'
                  : '"Don\'t just detect misinformation. Survive it." Evaluate a live stream of crisis news under pressure. Sort facts from rumors.'}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-start pt-2">
              <div className="p-4 bg-slate-900/20 border border-sky-950 rounded-xl space-y-1">
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">{language === 'ur' ? 'زلزلے کا چیلنج' : 'Crisis Scenario'}</span>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{language === 'ur' ? 'ایک اچانک 6.1 شدت کا زلزلہ اور شہریوں میں شدید الجھن اور افواہیں' : 'A sudden 6.1 magnitude earthquake triggers mass public confusion.'}</p>
              </div>
              <div className="p-4 bg-slate-900/20 border border-sky-950 rounded-xl space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">{language === 'ur' ? 'سرگرم خطرہ' : 'Active Threat'}</span>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{language === 'ur' ? 'خودکار بوٹس، اشتہارات اور جھوٹے سرکاری بیانات کا سیلاب' : 'Coordinated bots, spam ads, and fake official statements flood feeds.'}</p>
              </div>
              <div className="p-4 bg-slate-900/20 border border-sky-950 rounded-xl space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">{language === 'ur' ? 'نتائج' : 'Consequences'}</span>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{language === 'ur' ? 'غلط معلومات پر یقین کرنے سے فالوورز اور ساکھ میں شدید کمی ہو گی' : 'Poor choices crash your credibility and drop your follower reach.'}</p>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-indigo-600 font-bold rounded-xl text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center"
            >
              <Play className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 fill-white" />
              {language === 'ur' ? 'سیمولیشن شروع کریں (90 سیکنڈ)' : 'Launch Battle Protocol (90s)'}
            </button>
          </motion.div>
        ) : isPlaying ? (
          /* Active Gameplay Room */
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Feed area Left Column */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Progress and countdown display */}
              <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-sky-950/60">
                <div className="space-y-1.5 flex-grow pr-6 text-start">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>{language === 'ur' ? 'معلومات کی درجہ بندی' : 'Ecosystem Sorting'}</span>
                    <span>{language === 'ur' ? `پوسٹ ${activeCardIdx + 1} از ${localizedFeed.length}` : `${activeCardIdx + 1} of ${localizedFeed.length} Items`}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-sky-950">
                    <div 
                      className="bg-gradient-to-r from-rose-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse text-rose-400 font-mono font-bold text-lg bg-rose-950/15 border border-rose-900/40 px-3.5 py-1.5 rounded-xl">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Ticking Card view */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPost.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-950 space-y-5 text-start relative overflow-hidden bg-slate-900/10 min-h-[220px]"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <div className="text-sm font-extrabold text-white flex items-center">
                        {currentPost.author}
                        <span className="ml-2 rtl:mr-2 rtl:ml-0 text-[9px] text-slate-500 font-bold font-mono">{currentPost.handle}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block mt-0.5">{currentPost.roleLabel}</span>
                    </div>
                    
                    {sortActions[currentPost.id] && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        sortActions[currentPost.id] === 'TRUST' 
                          ? 'bg-emerald-950 border-emerald-900 text-emerald-400' 
                          : 'bg-rose-950 border-rose-900 text-rose-400'
                      }`}>
                        {sortActions[currentPost.id] === 'TRUST' ? (language === 'ur' ? 'بھروسہ مند حقیقت' : 'VERIFIED FACT') : (language === 'ur' ? 'مشکوک افواہ' : 'FLAGGED RUMOR')}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-medium">
                    "{currentPost.content}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-3">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <span>👍 {currentPost.likes.toLocaleString()}</span>
                      <span>🔄 {currentPost.shares.toLocaleString()}</span>
                    </div>
                    <span className="font-semibold italic">{language === 'ur' ? 'فیصلہ درکار ہے' : 'Decision Required'}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Sorting buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAction(currentPost.id, 'TRUST')}
                  className="py-4 bg-[#0d2a20]/40 border border-emerald-900 hover:border-emerald-400 text-slate-300 font-bold hover:text-emerald-400 hover:bg-[#0d2a20]/80 rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{language === 'ur' ? 'بھروسہ اور شیئر' : 'Trust & Bulletin'}</span>
                </button>
                <button
                  onClick={() => handleAction(currentPost.id, 'FLAG')}
                  className="py-4 bg-red-950/15 border border-red-950 hover:border-red-500 text-slate-300 font-bold hover:text-red-400 hover:bg-red-950/30 rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span>{language === 'ur' ? 'افواہ قرار دیں' : 'Flag as Rumor'}</span>
                </button>
              </div>

              {/* Card deck navigations */}
              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={activeCardIdx === 0}
                  onClick={() => setActiveCardIdx(activeCardIdx - 1)}
                  className="px-4 py-2 bg-slate-900 border border-sky-950 hover:border-sky-800 disabled:opacity-30 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  {language === 'ur' ? 'پچھلا آئٹم' : 'Previous Item'}
                </button>
                <button
                  disabled={activeCardIdx === localizedFeed.length - 1}
                  onClick={() => setActiveCardIdx(activeCardIdx + 1)}
                  className="px-4 py-2 bg-slate-900 border border-sky-950 hover:border-sky-800 disabled:opacity-30 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  {language === 'ur' ? 'اگلا آئٹم' : 'Next Item'}
                </button>
              </div>

            </div>

            {/* Sidebar Overview Right Column */}
            <div className="md:col-span-4 space-y-6 text-start">
              
              {/* Checklist overview box */}
              <div className="glass-panel p-5 rounded-2xl border border-sky-950/60 space-y-4">
                <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">{language === 'ur' ? 'فیڈز کا خلاصہ' : 'Ecosystem Status'}</h4>
                
                <div className="space-y-2">
                  {localizedFeed.map((post, idx) => {
                    const action = sortActions[post.id];
                    return (
                      <div 
                        key={post.id} 
                        onClick={() => setActiveCardIdx(idx)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          idx === activeCardIdx 
                            ? 'border-purple-500 bg-purple-950/10' 
                            : 'border-sky-950/40 bg-slate-950/30'
                        }`}
                      >
                        <span className="font-bold truncate w-24">{post.author}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-black border ${
                          action === 'TRUST' 
                            ? 'bg-emerald-950 border-emerald-900/50 text-emerald-400' 
                            : action === 'FLAG'
                              ? 'bg-rose-950 border-rose-900/50 text-rose-400'
                              : 'bg-slate-900 border-slate-950 text-slate-500'
                        }`}>
                          {action === 'TRUST' ? (language === 'ur' ? 'حق' : 'TRUST') : action === 'FLAG' ? (language === 'ur' ? 'افواہ' : 'FLAG') : (language === 'ur' ? 'باقی ہے' : 'PENDING')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={calculateEcosystemReport}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:scale-[1.01] transition-all cursor-pointer"
                >
                  {language === 'ur' ? 'فائنل رپورٹ جمع کریں' : 'Submit Final Report'}
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* TAB 3: Survival report popup details */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            
            {/* Top Score stats panel */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(56,189,248,0.04)] text-start">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{language === 'ur' ? 'میڈیا مدافعت الرٹ' : 'Crisis Standing'}</span>
                <h3 className="text-3xl font-black text-white flex items-center">
                  {language === 'ur' ? 'رپورٹ کارڈ' : 'SURVIVAL STAGE REPORT'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  {language === 'ur' 
                    ? 'آپ نے کامیابی سے کچھ افواہوں کو پکڑا لیکن الگورتھم کی کچھ چالوں کا شکار ہو گئے۔'
                    : 'You successfully verified key reports, but fell for coordinated media manipulation tactics.'}
                </p>
              </div>

              <div className="flex gap-4">
                <div className="bg-slate-950/80 border border-sky-950 p-4 rounded-2xl text-center min-w-[90px]">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">{language === 'ur' ? 'میڈیا فہم' : 'Discernment'}</span>
                  <div className="text-2xl font-black text-sky-400 mt-1">{stats.score}%</div>
                </div>
                <div className="bg-slate-950/80 border border-sky-950 p-4 rounded-2xl text-center min-w-[90px]">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">{language === 'ur' ? 'فالوورز' : 'Audience'}</span>
                  <div className={`text-2xl font-black mt-1 ${stats.followersDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stats.followersDelta >= 0 ? `+${stats.followersDelta}` : stats.followersDelta}
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-sky-950 p-4 rounded-2xl text-center min-w-[90px]">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">{language === 'ur' ? 'ساکھ' : 'Credibility'}</span>
                  <div className={`text-2xl font-black mt-1 ${stats.credibilityDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stats.credibilityDelta >= 0 ? `+${stats.credibilityDelta}%` : `${stats.credibilityDelta}%`}
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Biases Unlocked */}
            {stats.biasesUnlocked.length > 0 && (
              <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-rose-950/30 text-start space-y-4">
                <h4 className="text-sm font-extrabold text-rose-400 flex items-center uppercase tracking-wider">
                  <UserX className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'نفسیاتی کمزوریاں جن کا الگورتھم نے فائدہ اٹھایا' : 'Cognitive Vulnerabilities Exploited'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ur' 
                    ? 'بحران کے دوران الگورتھم نے آپ کے ان تعصبات کو نشانہ بنایا:'
                    : 'During the crisis pressure, the algorithm exploited the following psychological heuristics in your profile:'}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {stats.biasesUnlocked.map((bias, bIdx) => (
                    <span 
                      key={bIdx}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/20 border border-rose-900/60 text-rose-300"
                    >
                      ⚠️ {bias}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Detail breakdown lists */}
            <div className="space-y-4 text-start">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">{language === 'ur' ? 'خبروں کا تفصیلی تجزیہ' : 'Ecosystem Feed Analysis'}</h4>
              <div className="space-y-3">
                {localizedFeed.map((post) => {
                  const action = sortActions[post.id];
                  const correct = action === (post.isFake ? 'FLAG' : 'TRUST');
                  
                  let borderStyle = 'border-slate-800/80';
                  let feedbackText = language === 'ur' ? 'بغیر جانچ چھوڑا گیا' : 'Item Unassessed';
                  let feedbackColor = 'text-slate-500';

                  if (action) {
                    if (correct) {
                      borderStyle = 'border-emerald-950/60 bg-emerald-950/5';
                      feedbackText = action === 'TRUST' 
                        ? (language === 'ur' ? 'درست فیصلہ: سچی سرکاری خبر پر بھروسہ کیا' : 'Correctly trusted official fact') 
                        : (language === 'ur' ? 'درست فیصلہ: جھوٹی افواہ کو پکڑا' : 'Correctly flagged manipulation rumor');
                      feedbackColor = 'text-emerald-400';
                    } else {
                      borderStyle = 'border-rose-950/60 bg-rose-950/5';
                      feedbackText = action === 'TRUST' 
                        ? (language === 'ur' ? 'نفسیاتی تعصب: جھوٹی افواہ پر بھروسہ کر لیا' : 'Vulnerable: Trusted fake post') 
                        : (language === 'ur' ? 'زیادہ شکی مزاجی: سچی سرکاری خبر کو رد کر دیا' : 'Over-skeptical: Flagged authentic news');
                      feedbackColor = 'text-rose-400';
                    }
                  }

                  return (
                    <div key={post.id} className={`glass-panel p-5 rounded-2xl border transition-all ${borderStyle}`}>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <div>
                          <span className="text-xs font-bold text-slate-200">{post.author}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-2 rtl:mr-2 rtl:ml-0">{post.handle}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${feedbackColor}`}>
                          {feedbackText}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-3 font-sans font-medium">
                        "{post.content}"
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed pt-2.5 mt-2.5 border-t border-white/5">
                        <strong className="text-sky-400">{language === 'ur' ? 'تجزیہ:' : 'Analysis:'}</strong> {post.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back action */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-950 border border-sky-900 hover:border-sky-500 rounded-xl text-xs font-black text-sky-400 hover:text-white uppercase tracking-wider transition-all cursor-pointer"
              >
                {language === 'ur' ? 'سیمولیشن دوبارہ شروع کریں' : 'Restart Simulation'}
              </button>
            </div>

          </motion.div>
        )}

      </main>
    </div>
  );
}
