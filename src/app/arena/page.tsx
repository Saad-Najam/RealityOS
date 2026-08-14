'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, ShieldAlert, ShieldCheck, HelpCircle, 
  Search, Eye, Award, ArrowRight, Share2, 
  Flame, Trophy, UserCheck, Shield, ChevronRight, Activity, RotateCcw
} from 'lucide-react';
import { dbService, Profile, SkillScores, getUserRank } from '@/lib/db';
import { Scenario } from '@/lib/scenariosData';
import Header from '@/components/Header';

import { useLanguage } from '@/context/LanguageContext';

export default function RealityArena() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillScores | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [rawScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const { language, t } = useLanguage();

  const getLocalizedScenario = (sc: Scenario): Scenario => {
    if (language !== 'ur') return sc;

    const scenarioTranslations: Record<number, Partial<Scenario>> = {
      1: {
        title: "عام تعطیل کا ہنگامی نوٹس",
        content: "📢 ہنگامی اطلاع: کل یونیورسٹی میں عام تعطیل کا اعلان کیا گیا ہے اور تمام امتحانات ملتوی کر دیے گئے ہیں۔ پرنسپل کے نوٹس کا انتظار کریں۔",
        learningObjective: "سرکاری ویب سائٹوں کے ذریعے ہنگامی تعطیلات کی تصدیق کرنا سیکھیں۔",
        manipulationType: "جلدی بازی اور غیر تصدیق شدہ افواہ",
        explanation: "یہ فیملی گروپ میں واٹس ایپ پر ایک فارورڈ پیغام تھا جس کا کوئی سرکاری لنک نہیں تھا۔ ایسے پیغامات پر بھروسہ کرنے سے پہلے ہمیشہ یونیورسٹی کے آفیشل پورٹل پر جا کر تصدیق کریں۔",
      },
      2: {
        title: "تصویر میں عالمی رہنما کی جیکٹ",
        content: "عالمی رہنما نے فیشن شو کے دوران سستی چمڑے کی جیکٹ پہن رکھی ہے، جو وائرل ہو گئی ہے۔ تصویر بالکل سچی لگتی ہے۔",
        learningObjective: "مصنوعی ذہانت (AI) سے بنی تصاویر میں جسمانی خامیوں کو پکڑنا سیکھیں۔",
        manipulationType: "ڈیپ فیک / اے آئی تصویر",
        explanation: "غور سے دیکھنے پر پس منظر کی سیدھی لائنیں اور رہنما کے ہاتھوں کی انگلیاں غیر متوازن نظر آتی ہیں، جو کہ اے آئی تصویر کی واضح نشانی ہیں۔",
      },
      3: {
        title: "کافی اور عمر کا دعویٰ",
        content: "نئی تحقیق کے مطابق اعتدال پسند کافی پینے والے اپنی عمر میں 10 سال کا اضافہ کرتے ہیں! کافی کا استعمال بڑھائیں۔",
        learningObjective: "اعداد و شمار کی مبالغہ آرائی کو پہچانیں۔",
        manipulationType: "ریاضیاتی مبالغہ آرائی",
        explanation: "تحقیق صرف کافی پینے اور لمبی عمر کے درمیان ایک باہمی تعلق دکھاتی ہے، یہ سائنسی طور پر ثابت نہیں کرتی کہ کافی ہی عمر بڑھانے کا سبب ہے۔",
      },
      4: {
        title: "انتخابات کا لیک آڈیو کلپ",
        content: "انتخابات میں امیدوار کا اعترافی آڈیو کلپ لیک ہو گیا ہے۔",
        learningObjective: "آواز کے کلونز اور ڈیپ فیکس کو پکڑنا سیکھیں۔",
        manipulationType: "اے آئی آڈیو کلون",
        explanation: "اے آئی آواز کے کلونز آسانی سے بنائے جا سکتے ہیں۔ مستند بیانات کے بغیر ایسی آڈیو پر یقین نہ کریں۔",
      },
      5: {
        title: "ہنگامی بینک بندی کی افواہ",
        content: "🚨 بینک بند ہونے والے ہیں! اپنا کیش فوراً نکال لیں ورنہ پچھتائیں گے!",
        learningObjective: "خوف پر مبنی سنسنی خیز خبروں سے بچیں۔",
        manipulationType: "سنسنی خیز خوف کی اپیل",
        explanation: "یہ خوف پھیلا کر معاشی انتشار پیدا کرنے کی کوشش ہے۔ ہمیشہ بینک کے سرکاری نمائندوں سے رجوع کریں۔",
      },
      6: {
        title: "خالی سپر مارکیٹ الماریاں",
        content: "خالی الماریوں کی تصویر کے ساتھ معاشی تباہی کا دعویٰ۔",
        learningObjective: "پرانی تصاویر کے غلط سیاق و سباق کو پہچانیں۔",
        manipulationType: "غلط سیاق و سباق کی تصویر",
        explanation: "ریورس امیج سرچ سے معلوم ہوتا ہے کہ یہ تصویر کئی سال پرانی کسی دوسری جگہ کی ہے۔",
      },
      7: {
        title: "ٹیکس پالیسی پر جانبدار مضمون",
        content: "ٹیکس پالیسی کو 'ڈکیتی' قرار دینے والا یک طرفہ مضمون۔",
        learningObjective: "یک طرفہ بیانات اور جانب داریت کو پہچانیں۔",
        manipulationType: "شدید جانب داریت",
        explanation: "مضمون صرف ایک اپوزیشن لیڈر کا موقف پیش کرتا ہے اور سنسنی خیز الفاظ کا استعمال کرتا ہے۔",
      },
      8: {
        title: "ورچوئل کانفرنس کا دعوت نامہ",
        content: "تعلیمی پورٹل کی ای میل پر ورچوئل کانفرنس کا دعوت نامہ۔",
        learningObjective: "سرکاری تعلیمی دعوت ناموں کی تصدیق کریں۔",
        manipulationType: "تصدیق شدہ آفیشل ای میل",
        explanation: "یہ ایک باضابطہ اور سچا دعوت نامہ ہے جو یونیورسٹی کے تصدیق شدہ ایڈریس سے بھیجا گیا ہے۔",
      },
      9: {
        title: "مفت لیپ ٹاپ اسکیم کی افواہ",
        content: "حکومت کی طرف سے تمام طلبہ کیلئے بالکل مفت لیپ ٹاپ! ابھی اس لنک پر رجسٹر کریں۔",
        learningObjective: "فشنگ اور ڈیٹا چوری کے گھوٹالوں سے بچیں۔",
        manipulationType: "ڈیٹا چوری کا جھوٹا جھانسا",
        explanation: "یہ ڈیٹا چوری کرنے کا فشنگ لنک ہے جو واٹس ایپ پر پھیلایا جا رہا ہے۔ حکومت کی ایسی تمام اسکیمیں آفیشل پورٹل پر ہوتی ہیں۔",
      },
      10: {
        title: "سرکاری پورٹل کی آخری تاریخ",
        content: "فیس جمع کروانے کی تاریخ میں توسیع کا نوٹس۔",
        learningObjective: "آفیشل پورٹل پر تاریخوں کی تصدیق کریں۔",
        manipulationType: "آفیشل توثیق",
        explanation: "یہ یونیورسٹی کے فیس سیکشن پر چڑھا ہوا ایک باضابطہ نوٹیفیکیشن ہے، اسے سچا سمجھنا چاہیے۔",
      },
      11: {
        title: "جعلی بین الاقوامی اسکالرشپ",
        content: "🎓 شاندار موقع! گلوبل یوتھ لیڈر اسکالرشپ 2026 میں اپلائی کریں۔ صرف 72 گھنٹے باقی ہیں!",
        learningObjective: "جھوٹی جلدی بازی اور فرضی اسکالرشپ کی شناخت کریں۔",
        manipulationType: "جھوٹی کمیابی + مبالغہ آرائی",
        explanation: "معتبر ادارے کبھی بھی واٹس ایپ پر ایسی ہنگامی اسکالرشپ فارورڈ نہیں کرتے۔ اس کا کوئی باضابطہ لنک نہیں ہے۔",
      },
      12: {
        title: "موبائل فون اور ذہنی صحت",
        content: "📊 نئی تحقیق: 90 فیصد طلبہ کے موبائل فون نے ان کی ذہنی صحت کو مستقل تباہ کر دیا ہے!",
        learningObjective: "غلط اعداد و شمار کے تعصب کو پہچانیں۔",
        manipulationType: "مبالغہ آمیز اعداد و شمار",
        explanation: "تحقیق صرف معمولی اثرات کا ذکر کرتی ہے، 'مستقل تباہی' کا دعویٰ بالکل من گھڑت اور مبالغہ آرائی ہے۔",
      },
      13: {
        title: "لاہور میں سیلاب کا دعویٰ",
        content: "ابھی کی خبر: لاہور کے وسط میں سیلاب کا پانی داخل ہو گیا! شہری فوراً نکل جائیں! تصویر دیکھیں۔",
        learningObjective: "زلزلہ یا سیلاب کے دوران پرانی تصاویر کی تصدیق کریں۔",
        manipulationType: "پرانا میڈیا پیش کرنا",
        explanation: "ریورس سرچ سے ثابت ہوتا ہے کہ یہ تصویر 2010 کے سیلاب کی ہے، امروز کی نہیں۔",
      },
      14: {
        title: "گنے کا رس اور ڈیری کی افواہ",
        content: "⚠️ اہم طبی انتباہ: گنے کا رس دودھ یا دہی کے ساتھ پینے سے جگر فیل ہو جاتا ہے! فوراً شیئر کریں۔",
        learningObjective: "طبی افواہوں اور جعلی ڈاکٹروں سے بچیں۔",
        manipulationType: "جعلی طبی افواہ",
        explanation: "طبی طور پر اس کا کوئی ثبوت نہیں ہے۔ یہ ایک عام واٹس ایپ افواہ ہے جو خوف پھیلانے کیلئے شیئر کی جاتی ہے۔",
      },
      15: {
        title: "نیند اور الزائمر کی سرخی",
        content: "حیرت انگیز انکشاف: سائنسدانوں کا دعویٰ کہ 4 گھنٹے سے کم سونے والوں میں الزائمر کا خطرہ 340 فیصد بڑھ جاتا ہے!",
        learningObjective: "تحقیقی سرخیوں میں مبالغہ آرائی کو پکڑیں۔",
        manipulationType: "ریاضیاتی مبالغہ آرائی",
        explanation: "یہ موازنہ ریسرچ پیپر کے نتائج کا سنسنی خیز ترجمہ ہے۔ اصل خطرہ اس قدر زیادہ نہیں ہوتا۔",
      }
    };

    const trans = scenarioTranslations[sc.id];
    if (!trans) return sc;

    const localizedGraph = sc.evidenceGraph ? {
      nodes: sc.evidenceGraph.nodes.map((n: any) => {
        let label = n.label;
        let description = n.description;
        if (n.id === 'c1') {
          label = language === 'ur' ? 'مرکزی دعویٰ' : n.label;
          description = trans.title || n.description;
        } else if (n.id === 's1') {
          label = language === 'ur' ? 'خبر کا ذریعہ' : n.label;
        } else if (n.id === 'e1') {
          label = language === 'ur' ? 'شواہد کی جانچ' : n.label;
        } else if (n.id === 'v1') {
          label = language === 'ur' ? 'حتمی فیصلہ' : n.label;
        }
        return { ...n, label, description };
      }),
      edges: sc.evidenceGraph.edges
    } : undefined;

    const localizedClues = sc.lateralClues ? sc.lateralClues.map((c: any) => {
      let question = c.question;
      let options = c.options;
      let explanation = c.explanation;
      if (sc.id === 15) {
        question = language === 'ur' ? 'اصل تحقیق کے نتائج کیا تھے؟' : c.question;
        options = language === 'ur' 
          ? ["نیند کی کمی الزائمر کا شکار بنا دیتی ہے", "نیند کی کمی اور الزائمر کے خطرے میں تعلق ہے لیکن یہ تعلق بہت معمولی ہے", "کم سونے والے سب ہی بیمار ہو جاتے ہیں"]
          : c.options;
        explanation = language === 'ur' ? 'سائنسی بیانات اکثر مبالغہ آمیز بنا کر پیش کیے جاتے ہیں۔' : c.explanation;
      }
      return { ...c, question, options, explanation };
    }) : undefined;

    return {
      ...sc,
      title: trans.title || sc.title,
      content: trans.content || sc.content,
      learningObjective: trans.learningObjective || sc.learningObjective,
      manipulationType: trans.manipulationType || sc.manipulationType,
      explanation: trans.explanation || sc.explanation,
      evidenceGraph: localizedGraph,
      lateralClues: localizedClues
    };
  };

  const currentScenario = rawScenario ? getLocalizedScenario(rawScenario) : null;
  
  // Game simulation stats (persisted locally)
  const [followers, setFollowers] = useState(1200);
  const [credibility, setCredibility] = useState(70);
  const [statDelta, setStatDelta] = useState<{ followers: number; credibility: number } | null>(null);

  // Core Loop states
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  // Investigation Mode states
  const [investigating, setInvestigating] = useState(false);
  const [unlockedNodes, setUnlockedNodes] = useState<string[]>(['c1']);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('c1');
  const [lateralSolved, setLateralSolved] = useState(false);
  const [lateralAnswer, setLateralAnswer] = useState<number | null>(null);
  const [lateralChecked, setLateralChecked] = useState(false);
  const [finalVerdict, setFinalVerdict] = useState<string | null>(null);

  // Visual tells overlay states
  const [showTells, setShowTells] = useState(false);
  const [selectedTellId, setSelectedTellId] = useState<string | null>(null);

  // Confidence calibration
  const [confidenceRating, setConfidenceRating] = useState<number | null>(null);
  const [showConfidencePicker, setShowConfidencePicker] = useState(false);

  // Load database and simulation state
  useEffect(() => {
    const init = async () => {
      const p = await dbService.getProfile();
      const s = await dbService.getSkillScores();
      const sc = await dbService.getScenarios();
      setProfile(p);
      setSkills(s);
      setScenarios(sc);

      // Load follower/credibility count from storage
      if (typeof window !== 'undefined') {
        const savedStats = localStorage.getItem('realityos_sim_stats');
        if (savedStats) {
          const parsed = JSON.parse(savedStats);
          setFollowers(parsed.followers ?? 1200);
          setCredibility(parsed.credibility ?? 70);
        }
      }

      selectAdaptiveScenario(s, sc);
    };
    init();
  }, []);

  const saveSimStats = (newFollowers: number, newCred: number) => {
    setFollowers(newFollowers);
    setCredibility(newCred);
    if (typeof window !== 'undefined') {
      localStorage.setItem('realityos_sim_stats', JSON.stringify({ followers: newFollowers, credibility: newCred }));
    }
  };

  const selectAdaptiveScenario = (userSkills: SkillScores, list: Scenario[]) => {
    if (list.length === 0) return;

    const skillKeyMap: Record<string, keyof SkillScores> = {
      'Source Verification': 'source_verification',
      'Bias Detection': 'bias_detection',
      'Deepfake Awareness': 'deepfake_awareness',
      'Emotional Manipulation': 'emotional_manipulation',
      'Statistical Literacy': 'statistical_literacy',
      'Lateral Reading': 'lateral_reading',
      'AI Literacy': 'ai_literacy'
    };

    let totalWeight = 0;
    const weightedScenarios = list.map(sc => {
      const skillKey = skillKeyMap[sc.skill];
      const score = userSkills[skillKey] ?? 50;
      const weight = Math.max(5, 100 - score);
      totalWeight += weight;
      return { sc, weight };
    });

    let r = Math.random() * totalWeight;
    let selected = list[0];
    for (const item of weightedScenarios) {
      r -= item.weight;
      if (r <= 0) {
        selected = item.sc;
        break;
      }
    }

    setCurrentScenario(selected);
    resetState();
  };

  const resetState = () => {
    setSelectedAction(null);
    setShowExplanation(false);
    setXpGained(0);
    setIsCorrect(false);
    setStatDelta(null);
    
    // Reset investigation
    setInvestigating(false);
    setUnlockedNodes(['c1']);
    setSelectedNodeId('c1');
    setLateralSolved(false);
    setLateralAnswer(null);
    setLateralChecked(false);
    setFinalVerdict(null);

    // Reset tells
    setShowTells(false);
    setSelectedTellId(null);

    // Reset confidence
    setConfidenceRating(null);
    setShowConfidencePicker(false);
  };

  const evaluateStatChanges = (action: string, correct: boolean) => {
    let fDelta = 0;
    let cDelta = 0;

    if (correct) {
      fDelta = Math.floor(Math.random() * 40) + 30; // +30-70 followers
      cDelta = Math.floor(Math.random() * 4) + 3;    // +3-7% credibility
    } else {
      if (action === 'SHARE') {
        fDelta = -(Math.floor(Math.random() * 80) + 100); // lose 100-180 followers for sharing fakes
        cDelta = -(Math.floor(Math.random() * 8) + 8);    // lose 8-16% credibility
      } else {
        fDelta = -(Math.floor(Math.random() * 40) + 30);  // lose 30-70 followers
        cDelta = -(Math.floor(Math.random() * 4) + 3);    // lose 3-7% credibility
      }
    }

    const nextFollowers = Math.max(100, followers + fDelta);
    const nextCred = Math.max(10, Math.min(100, credibility + cDelta));
    
    setStatDelta({ followers: fDelta, credibility: cDelta });
    saveSimStats(nextFollowers, nextCred);
  };

  const handleAction = async (action: 'TRUST' | 'SHARE' | 'IGNORE') => {
    if (!currentScenario || selectedAction) return;

    setSelectedAction(action);
    const correct = currentScenario.correctAction === action;
    setIsCorrect(correct);
    evaluateStatChanges(action, correct);

    const { xpGained: xp, updatedProfile, updatedSkills } = await dbService.recordAttempt(
      currentScenario,
      action,
      correct
    );

    setXpGained(xp);
    setProfile(updatedProfile);
    setSkills(updatedSkills);
    setShowExplanation(true);
    setShowConfidencePicker(false);
  };

  const handleOpenInvestigate = () => {
    setInvestigating(true);
  };

  const handleUnlockNode = (nodeId: string) => {
    if (!unlockedNodes.includes(nodeId)) {
      setUnlockedNodes([...unlockedNodes, nodeId]);
    }
    setSelectedNodeId(nodeId);
  };

  const checkLateralAnswer = () => {
    if (!currentScenario || lateralAnswer === null) return;
    setLateralChecked(true);
    const clue = currentScenario.lateralClues?.[0];
    if (clue && lateralAnswer === clue.correctIndex) {
      setLateralSolved(true);
      if (currentScenario.evidenceGraph) {
        const allNodeIds = currentScenario.evidenceGraph.nodes.map(n => n.id);
        setUnlockedNodes(allNodeIds);
        setSelectedNodeId('s2'); // auto select new evidence details
      }
    }
  };

  const submitInvestigationVerdict = async (verdict: 'TRUST' | 'MISLEADING' | 'IGNORE') => {
    if (!currentScenario || finalVerdict) return;

    setFinalVerdict(verdict);
    
    let correct = false;
    if (verdict === 'TRUST') correct = currentScenario.groundTruthVerdict === 'TRUST';
    if (verdict === 'MISLEADING') correct = currentScenario.groundTruthVerdict === 'MISLEADING';
    if (verdict === 'IGNORE') correct = currentScenario.groundTruthVerdict === 'FABRICATED';

    setIsCorrect(correct);
    evaluateStatChanges('INVESTIGATE', correct);

    const { xpGained: xp, updatedProfile, updatedSkills } = await dbService.recordAttempt(
      currentScenario,
      'INVESTIGATE',
      correct
    );

    setXpGained(xp);
    setProfile(updatedProfile);
    setSkills(updatedSkills);
    setShowExplanation(true);
  };

  const handleNextScenario = () => {
    if (skills && scenarios.length > 0) {
      selectAdaptiveScenario(skills, scenarios);
    }
  };

  const resetGameEngine = () => {
    saveSimStats(1200, 70);
    resetState();
  };

  if (!currentScenario) {
    return (
      <div className="flex flex-col min-h-screen bg-[#090d16] text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-sky-400 font-semibold tracking-wider">LOADING ARENA PROTOCOL...</div>
        </div>
      </div>
    );
  }

  const formatMeta = {
    WHATSAPP_FORWARD: { bg: 'bg-[#0e2a20]/65 border-[#10b981]/25 text-[#e6f4ea]', badge: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30', label: 'WhatsApp Forward' },
    X_POST: { bg: 'bg-slate-900/60 border-slate-800 text-slate-100', badge: 'bg-white/5 text-slate-300 border-white/10', label: 'X Post' },
    INSTAGRAM_CARD: { bg: 'bg-slate-900/40 border-purple-950/30 text-purple-100', badge: 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-400 border-pink-500/20', label: 'Instagram Post' },
    NEWS_HEADLINE: { bg: 'bg-slate-900/50 border-sky-950/60 text-sky-100', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', label: 'News Headline' }
  }[currentScenario.format];

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9] relative">
      <Header />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-8 z-10">
        
        {/* Game Stats HUD panel */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="glass-panel p-4 rounded-xl border border-sky-950/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                {language === 'ur' ? 'سامعین تک رسائی' : 'Follower Reach'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">{followers.toLocaleString()}</div>
            </div>
            {statDelta && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                statDelta.followers >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
              }`}>
                {statDelta.followers >= 0 ? `+${statDelta.followers}` : statDelta.followers}
              </span>
            )}
          </div>

          <div className="glass-panel p-4 rounded-xl border border-sky-950/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                {language === 'ur' ? 'ساکھ کی شرح' : 'Credibility Score'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">{credibility}%</div>
            </div>
            <div className="flex items-center space-x-2">
              {statDelta && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  statDelta.credibility >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}>
                  {statDelta.credibility >= 0 ? `+${statDelta.credibility}%` : `${statDelta.credibility}%`}
                </span>
              )}
            </div>
          </div>

          {/* Quick HUD values */}
          <div className="glass-panel p-4 rounded-xl border border-sky-950/60 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {language === 'ur' ? 'لیول اور رینک' : 'Level & Rank'}
            </span>
            <div className="text-sm font-black text-sky-400 flex items-center justify-between mt-1">
              <span>{t.lvl} {profile?.level || 1}</span>
              <span className="text-[10px] bg-sky-950 px-2 py-0.5 border border-sky-900 rounded text-slate-400 uppercase font-semibold">
                {profile ? (language === 'ur' ? 'تفتیش کار درجہ' : getUserRank(profile.xp)) : 'Novice Investigator'}
              </span>
            </div>
          </div>

          {/* Restart simulation progress */}
          <div className="glass-panel p-4 rounded-xl border border-sky-950/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                {language === 'ur' ? 'تربیتی سیشن' : 'Game Session'}
              </span>
              <span className="text-xs font-bold text-slate-400 mt-1 block">
                {language === 'ur' ? 'سرگرم جانچ' : 'Active Calibration'}
              </span>
            </div>
            <button
              onClick={resetGameEngine}
              className="p-2 bg-slate-900/60 hover:bg-slate-950 border border-sky-950 hover:border-sky-500/40 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
              title={language === 'ur' ? 'دوبارہ ترتیب دیں' : 'Reset Stats & Session'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </section>

        {/* Central Game Panel Layout */}
        <section className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Central Post Swiper Feed */}
          <div className={`${investigating ? 'lg:col-span-5' : 'lg:col-span-6 lg:col-start-4'} space-y-6 transition-all duration-300`}>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentScenario.id}
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className={`glass-panel rounded-3xl border p-6 space-y-5 relative ${formatMeta.bg} shadow-[0_0_35px_rgba(0,0,0,0.4)] overflow-hidden`}
              >
                {/* Meta Sender info */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white uppercase text-sm">
                      {currentScenario.sender ? currentScenario.sender[0] : 'S'}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-white">{currentScenario.sender || 'Anonymous User'}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Circulating in your area</div>
                    </div>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${formatMeta.badge}`}>
                    {formatMeta.label}
                  </span>
                </div>

                {/* Text Body */}
                <div className="space-y-4 pt-1 text-left">
                  {currentScenario.format === 'WHATSAPP_FORWARD' && (
                    <div className="inline-flex items-center space-x-1.5 text-[#128c7e] text-[9px] font-black bg-[#128c7e]/10 border border-[#128c7e]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Share2 className="w-3 h-3" />
                      <span>Viral Forward</span>
                    </div>
                  )}

                  <p className={`text-sm sm:text-base leading-relaxed ${
                    currentScenario.format === 'WHATSAPP_FORWARD' 
                      ? 'font-sans text-[#e1f5fe]' 
                      : currentScenario.format === 'NEWS_HEADLINE' 
                        ? 'font-serif text-lg font-bold text-white leading-snug' 
                        : 'font-sans text-slate-200'
                  }`}>
                    "{currentScenario.content}"
                  </p>

                  {/* Media attachments */}
                  {currentScenario.mediaUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/60 min-h-[220px] max-h-[350px] flex items-center justify-center group/image">
                      <img 
                        src={currentScenario.mediaUrl} 
                        alt="Media attachment" 
                        className="w-full h-full object-cover max-h-[350px] transition-transform duration-500 group-hover/image:scale-[1.02]"
                      />
                      
                      {/* Interactive Visual tells highlights */}
                      {showTells && currentScenario.tells?.map((tell) => {
                        const isSelected = selectedTellId === tell.id;
                        return (
                          <button
                            key={tell.id}
                            onClick={() => setSelectedTellId(isSelected ? null : tell.id)}
                            className={`absolute w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                              isSelected 
                                ? 'bg-purple-600 border-white text-white scale-125 glow-purple' 
                                : 'bg-black/60 border-purple-400 text-purple-400 hover:scale-110 hover:bg-black/80'
                            }`}
                            style={{ left: `${tell.x}%`, top: `${tell.y}%` }}
                          >
                            🔍
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tells description box */}
                {showTells && selectedTellId && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-purple-950/20 border border-purple-900/40 rounded-2xl text-xs space-y-1.5 text-left"
                  >
                    <span className="font-extrabold text-purple-400 uppercase tracking-wider flex items-center">
                      Spotting Tell: {currentScenario.tells?.find(t => t.id === selectedTellId)?.label}
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {currentScenario.tells?.find(t => t.id === selectedTellId)?.description}
                    </p>
                  </motion.div>
                )}

                {/* Tells toggle button */}
                {currentScenario.tells && currentScenario.tells.length > 0 && !investigating && (
                  <button
                    onClick={() => setShowTells(!showTells)}
                    className="w-full py-2.5 bg-purple-950/20 hover:bg-purple-950/30 border border-purple-900/40 rounded-xl text-xs font-bold text-purple-400 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    {showTells ? 'Hide Visual Tells Overlay' : 'Activate Visual Tells Scan'}
                  </button>
                )}

                {/* Confidence picker — shown before actions are taken */}
                {!investigating && !selectedAction && (
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    
                    {/* Confidence rating */}
                    <div className="p-3 bg-slate-950/60 border border-sky-950/60 rounded-xl space-y-2">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">How confident are you in your judgment?</div>
                      <div className="flex items-center gap-2">
                        {[1,2,3,4,5].map(n => (
                          <button
                            key={n}
                            onClick={() => setConfidenceRating(n)}
                            className={`flex-1 py-2 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                              confidenceRating === n
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-amber-700 hover:text-amber-400'
                            }`}
                          >
                            {n === 1 ? '😰' : n === 2 ? '😟' : n === 3 ? '🤔' : n === 4 ? '😌' : '💪'}
                          </button>
                        ))}
                      </div>
                      {confidenceRating && (
                        <div className="text-[10px] text-amber-400/80 font-medium">
                          {confidenceRating <= 2 ? 'Low confidence — investigate before deciding' :
                           confidenceRating === 3 ? 'Moderate confidence — proceed with caution' :
                           'High confidence — make sure you have evidence'}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleAction('TRUST')}
                        className="py-3 bg-[#0d2a20]/40 border border-emerald-900/40 text-slate-300 font-extrabold hover:text-emerald-400 hover:bg-[#0d2a20]/80 hover:border-emerald-500 hover:shadow-[0_0_12px_rgba(16,185,129,0.08)] rounded-xl text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.98]"
                      >
                        Trust Fact
                      </button>
                      <button
                        onClick={() => handleAction('SHARE')}
                        className="py-3 bg-red-950/10 border border-red-950/40 text-slate-300 font-extrabold hover:text-red-400 hover:bg-red-950/30 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.08)] rounded-xl text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.98]"
                      >
                        Share Post
                      </button>
                      <button
                        onClick={() => handleAction('IGNORE')}
                        className="py-3 bg-slate-900/60 border border-slate-950 text-slate-300 font-extrabold hover:text-white hover:bg-slate-800 rounded-xl text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.98]"
                      >
                        Ignore Item
                      </button>
                    </div>

                    <button
                      onClick={handleOpenInvestigate}
                      className="w-full py-3.5 bg-gradient-to-r from-sky-500/10 via-indigo-600/10 to-purple-600/10 border border-sky-850 hover:border-sky-500 text-sky-400 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center group transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Open Active Investigation Board
                    </button>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Explanations popup alerts */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className={`p-6 rounded-3xl border space-y-4 text-left ${
                    isCorrect 
                      ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.03)]' 
                      : 'bg-rose-950/10 border-rose-900/30 text-rose-200 shadow-[0_0_30px_rgba(239,68,68,0.02)]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="flex items-center text-xs sm:text-sm font-extrabold uppercase tracking-widest">
                      {isCorrect ? (
                        <>
                          <ShieldCheck className="w-5 h-5 mr-1.5 text-emerald-400" />
                          Evaluation Correct
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-5 h-5 mr-1.5 text-rose-400" />
                          Vulnerability Detected
                        </>
                      )}
                    </span>
                    <span className="text-xs font-black bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-sky-900 text-sky-400">
                      +{xpGained} XP
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-medium">
                    {currentScenario.explanation}
                  </p>

                  {/* Confidence calibration feedback */}
                  {confidenceRating !== null && (
                    <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isCorrect && confidenceRating >= 4
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                        : !isCorrect && confidenceRating >= 4
                        ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                        : isCorrect && confidenceRating <= 2
                        ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}>
                      <div className="font-bold uppercase tracking-wider text-[10px]">Confidence Calibration</div>
                      <div>
                        {isCorrect && confidenceRating >= 4 && '✅ Well-calibrated! High confidence matched a correct answer.'}
                        {isCorrect && confidenceRating <= 2 && '⚠️ Underconfident — you were right but didn\'t trust your instincts.'}
                        {!isCorrect && confidenceRating >= 4 && '🔴 Overconfidence bias — you were highly confident but wrong. This is a key vulnerability.'}
                        {!isCorrect && confidenceRating <= 2 && '📚 Low confidence on a wrong answer. Study this scenario type more.'}
                        {confidenceRating === 3 && (isCorrect ? '✅ Correct with moderate confidence — keep building certainty.' : '📚 Moderate confidence, wrong answer — review the evidence carefully.')}
                      </div>
                    </div>
                  )}

                  {/* Why Did I Get Fooled? */}
                  {!isCorrect && currentScenario.biasesTriggered && currentScenario.biasesTriggered.length > 0 && (
                    <div className="p-4 bg-amber-950/15 border border-amber-900/30 rounded-xl space-y-3">
                      <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center">
                        <span className="mr-2">🧠</span> Why Did You Get Fooled?
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Your decision was influenced by these cognitive biases:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentScenario.biasesTriggered.map((bias: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-amber-950/30 border border-amber-900/50 text-amber-300 text-[10px] font-bold rounded-full">
                            ⚠️ {bias}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                        Recognizing these patterns is the first step to overcoming them. Your next challenge will focus on this skill.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleNextScenario}
                    className="w-full py-3.5 bg-slate-950 hover:bg-black border border-sky-900 hover:border-sky-500 rounded-xl text-xs font-black text-sky-400 hover:text-white flex items-center justify-center transition-all mt-4 cursor-pointer"
                  >
                    Acquire Next Challenge <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Connected Node Graph (Investigation Mode panel) */}
          <AnimatePresence>
            {investigating && (
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="glass-panel p-6 rounded-3xl border border-sky-500/10 space-y-6 text-left relative overflow-hidden bg-slate-950/20">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-sky-950/50 rounded-lg border border-sky-900 text-sky-400">
                        <Activity className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                        Investigation Board Map
                      </h3>
                    </div>
                    
                    <button 
                      onClick={() => setInvestigating(false)}
                      className="text-xs text-slate-500 hover:text-slate-300 font-bold hover:underline"
                    >
                      Close Workspace
                    </button>
                  </div>

                  {/* SVG Nodes Layout Diagram */}
                  <div className="relative w-full min-h-[140px] border border-sky-950/40 rounded-2xl bg-slate-950/40 p-4 flex flex-col justify-center items-center">
                    
                    {/* SVG Connector Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      {currentScenario.evidenceGraph?.edges.map((edge, idx) => {
                        const fromUnlocked = unlockedNodes.includes(edge.from);
                        const toUnlocked = unlockedNodes.includes(edge.to);
                        const isActive = fromUnlocked && toUnlocked;
                        
                        // We draw simple custom connections mapping index locations
                        let strokeColor = 'rgba(30, 41, 59, 0.4)';
                        let strokeWidth = 1.5;
                        let glow = '';

                        if (isActive) {
                          strokeColor = edge.relationship === 'contradicts' ? '#ef4444' : '#38bdf8';
                          strokeWidth = 2;
                        }

                        // Approximate relative coordinates for horizontal nodes alignment
                        const widthStep = 95 / 4;
                        const posMap: Record<string, { x: number; y: number }> = {
                          c1: { x: 10, y: 50 },
                          s1: { x: 30, y: 25 },
                          s2: { x: 30, y: 75 },
                          e1: { x: 55, y: 25 },
                          e2: { x: 55, y: 75 },
                          v1: { x: 85, y: 50 }
                        };

                        const from = posMap[edge.from] || { x: 10, y: 50 };
                        const to = posMap[edge.to] || { x: 90, y: 50 };

                        return (
                          <line
                            key={idx}
                            x1={`${from.x}%`}
                            y1={`${from.y}%`}
                            x2={`${to.x}%`}
                            y2={`${to.y}%`}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={edge.relationship === 'contradicts' ? '4 2' : 'none'}
                            className="transition-all duration-500"
                          />
                        );
                      })}
                    </svg>

                    {/* Nodes Capsules mapping position */}
                    <div className="w-full flex flex-wrap justify-between items-center z-10 min-h-[90px] relative gap-4">
                      {currentScenario.evidenceGraph?.nodes.map((node) => {
                        const isUnlocked = unlockedNodes.includes(node.id);
                        const isSelected = selectedNodeId === node.id;
                        
                        let nodeStyle = 'border-slate-800/80 text-slate-500 opacity-30 cursor-not-allowed bg-slate-900/10';
                        if (isUnlocked) {
                          if (node.type === 'claim') nodeStyle = 'border-sky-900 bg-sky-950/40 text-sky-400 hover:border-sky-500';
                          if (node.type === 'source') nodeStyle = 'border-purple-900 bg-purple-950/40 text-purple-400 hover:border-purple-500';
                          if (node.type === 'evidence') {
                            nodeStyle = node.status === 'contradicts' 
                              ? 'border-rose-900 bg-rose-950/40 text-rose-400 hover:border-rose-500' 
                              : 'border-emerald-900 bg-emerald-950/40 text-emerald-400 hover:border-emerald-500';
                          }
                          if (node.type === 'verdict') nodeStyle = 'border-amber-900 bg-amber-950/40 text-amber-400 hover:border-amber-500';
                        }

                        if (isUnlocked && isSelected) {
                          nodeStyle += ' scale-105 ring-1 ring-sky-400 glow-cyan';
                        }

                        return (
                          <button
                            key={node.id}
                            disabled={!isUnlocked}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`px-3 py-2 rounded-xl border text-[10px] font-black transition-all uppercase tracking-wider flex items-center space-x-1 cursor-pointer ${nodeStyle}`}
                          >
                            <span>{node.label}</span>
                            {!isUnlocked && <span>🔒</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inspector Panel */}
                  {selectedNodeId && unlockedNodes.includes(selectedNodeId) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-950/95 border border-sky-950 rounded-2xl space-y-2 relative"
                    >
                      <div className="absolute top-3 right-3 text-[9px] text-sky-400/60 font-bold uppercase">Node Data</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Inspecting Item</div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">
                        {currentScenario.evidenceGraph?.nodes.find(n => n.id === selectedNodeId)?.label}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {currentScenario.evidenceGraph?.nodes.find(n => n.id === selectedNodeId)?.description}
                      </p>

                      {selectedNodeId === 'c1' && unlockedNodes.length === 1 && (
                        <button
                          onClick={() => handleUnlockNode('s1')}
                          className="mt-3 px-3.5 py-2 bg-sky-950/80 hover:bg-sky-900 border border-sky-900 hover:border-sky-500 rounded-xl text-[10px] font-black text-sky-400 uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Check Source Authenticity
                        </button>
                      )}

                      {selectedNodeId === 's1' && unlockedNodes.length === 2 && (
                        <div className="pt-3 border-t border-sky-950 mt-3 space-y-3">
                          <div className="text-[10px] text-purple-400 font-black uppercase tracking-wider flex items-center">
                            <Activity className="w-3.5 h-3.5 mr-1" />
                            Verify Outside URL (Lateral Search)
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Research this query in a separate workspace tab. Once solved, all connection nodes will be fully calibrated.
                          </p>
                          <div className="p-3 bg-slate-900/60 border border-purple-950 rounded-xl text-xs font-mono text-purple-200">
                            🔍 Query: "{currentScenario.lateralSearchQuery}"
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Lateral search quiz simulated */}
                  {unlockedNodes.includes('s1') && !lateralSolved && currentScenario.lateralClues && (
                    <div className="border border-purple-950/50 bg-purple-950/5 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center space-x-1.5 text-purple-400 font-black text-xs uppercase tracking-wider">
                        <Search className="w-4 h-4" />
                        <span>Lateral cross-referencing task</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Read the findings gathered from the query search tab, and select the correct interpretation:
                      </p>
                      
                      <div className="space-y-3 pt-1">
                        <span className="text-xs sm:text-sm font-bold text-white block leading-relaxed">
                          {currentScenario.lateralClues[0].question}
                        </span>

                        <div className="space-y-2">
                          {currentScenario.lateralClues[0].options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => setLateralAnswer(oIdx)}
                              disabled={lateralChecked}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                                lateralAnswer === oIdx 
                                  ? 'border-purple-500 bg-purple-950/20 text-purple-300 font-semibold' 
                                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>

                        {!lateralChecked && (
                          <button
                            onClick={checkLateralAnswer}
                            disabled={lateralAnswer === null}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-purple-500/10"
                          >
                            Verify lateral finding
                          </button>
                        )}

                        {lateralChecked && !lateralSolved && (
                          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-400 text-[10px] leading-relaxed flex items-center justify-between">
                            <span>✕ Incorrect fact-checking data interpretation. Select another option and retry.</span>
                            <button onClick={() => setLateralChecked(false)} className="underline font-black text-white hover:text-slate-300 ml-2">Retry</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sourced solved confirmation */}
                  {lateralSolved && (
                    <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 text-emerald-300 rounded-2xl text-xs flex items-center space-x-2">
                      <ShieldCheck className="w-5.5 h-5.5 text-emerald-400 shrink-0" />
                      <span>Search confirmed. The evidence pathways have completed processing. Inspect the graph and select a verdict below.</span>
                    </div>
                  )}

                  {/* Final Verdict submission */}
                  {lateralSolved && !finalVerdict && (
                    <div className="pt-4 border-t border-sky-950 space-y-3">
                      <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Submit Workspace Evaluation Verdict</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => submitInvestigationVerdict('TRUST')}
                          className="py-3 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 font-black rounded-xl text-xs transition-all cursor-pointer"
                        >
                          Supported
                        </button>
                        <button
                          onClick={() => submitInvestigationVerdict('MISLEADING')}
                          className="py-3 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-900/50 text-amber-400 font-black rounded-xl text-xs transition-all cursor-pointer"
                        >
                          Misleading
                        </button>
                        <button
                          onClick={() => submitInvestigationVerdict('IGNORE')}
                          className="py-3 bg-slate-950 hover:bg-slate-900 border border-sky-950 text-slate-400 font-black rounded-xl text-xs transition-all cursor-pointer"
                        >
                          Fabricated
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </section>

      </main>
    </div>
  );
}
