'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, CheckCircle, ArrowRight, 
  ShieldCheck, RefreshCw, XCircle, Search, HelpCircle as HelpIcon, 
  Network, Database, HelpCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

interface LabPair {
  id: number;
  topic: string;
  original: string;
  manipulated: string;
  question: string;
  options: string[];
  correctIndex: number;
  technique: string;
  explanation: string;
}

export default function ManipulationLab() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'headlines' | 'sleuth'>('headlines');
  
  // Tab 1: Headlines states
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Tab 2: Sleuth engine states
  const [claimInput, setClaimInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState<any | null>(null);

  const getLocalizedLabPairs = (): LabPair[] => {
    if (language === 'ur') {
      return [
        {
          id: 1,
          topic: "ماحولیاتی سائنس",
          original: "سائنسدانوں نے نئی ماحولیاتی تحقیق شائع کی ہے جس کے مطابق گزشتہ دہائی میں عالمی درجہ حرارت میں اوسطاً 1.2 ڈگری سیلسیس کا اضافہ ہوا ہے۔",
          manipulated: "🚨 ماحولیاتی تباہی سر پر آ پہنچی! سائنسدانوں نے کچھ ایسا خوفناک دریافت کیا جسے انہوں نے چھپانے کی کوشش کی! جاگ جاؤ!",
          question: "تبدیل شدہ سرخی میں بنیادی طور پر کون سی ہیرا پھیری کی تیکنیک استعمال کی گئی ہے؟",
          options: [
            "خوف پھیلانا اور کلک بیٹ (سنسنی خیز اور سازشی سرخی کا استعمال)",
            "اعداد و شمار کی ہیرا پھیری (ریاضیاتی فارمولے تبدیل کرنا)",
            "غیر مجاز حوالہ جات کا استعمال (بغیر اجازت بیرونی ماہر کا نام لکھنا)"
          ],
          correctIndex: 0,
          technique: "خوف پھیلانا اور سنسنی خیزی",
          explanation: "تبدیل شدہ سرخی مخصوص سائنسی ڈیٹا (1.2 ڈگری کا اضافہ) کو ختم کر کے سنسنی خیز الفاظ ('تباہی'، 'خوفناک') اور ایک فرضی سازش ('چھپانے کی کوشش') شامل کرتی ہے تاکہ پڑھنے والے کے تجسس اور خوف کو بھڑکایا جا سکے۔"
        },
        {
          id: 2,
          topic: "تجارتی قوانین",
          original: "مقامی سپر مارکیٹیں ماحولیاتی قوانین کی تعمیل کے لیے اگلے پیر سے ایک بار استعمال ہونے والے پلاسٹک بیگز پر پابندی لگائیں گی۔",
          manipulated: "⚠️ حکومت کا پلاسٹک بیگز پر جبری پابندی کا قانون: دکاندار شہریوں سے تھیلوں کے پیسے بٹورنے لگے!",
          question: "تبدیل شدہ سرخی میں ہیرا پھیری کا کون سا انداز اختیار کیا گیا ہے؟",
          options: [
            "تکنیکی سائنسی الفاظ کا غلط استعمال",
            "اشتیاق اور غصہ بھڑکانا (مثلاً 'جبری پابندی'، 'پیسے بٹورنا' جیسے الفاظ کا استعمال)",
            "مصنوعی ذہانت سے تیار شدہ متن"
          ],
          correctIndex: 1,
          technique: "غصہ اور اشتیاق بھڑکانا",
          explanation: "ایک عام ماحولیاتی اقدام کو حکومت کی 'زبردستی' اور دکانداروں کی 'لوٹ مار' کے طور پر پیش کر کے، مصنف شہریوں میں سیاسی غصہ پیدا کرنے کی کوشش کرتا ہے تاکہ پوسٹ کو زیادہ سے زیادہ شیئر کیا جا سکے۔"
        },
        {
          id: 3,
          topic: "تعلیمی سروے",
          original: "ایک یونیورسٹی سروے کے مطابق امتحانات کے ہفتوں میں 65 فیصد طلبہ ذہنی دباؤ محسوس کرتے ہیں، جو کہ ماضی کے اوسط کے مطابق ہے۔",
          manipulated: "💔 امتحانات کا نفسیاتی بحران: امتحانات کی وجہ سے 65 فیصد طلبہ کا ذہنی توازن بگڑ گیا!",
          question: "تبدیل شدہ سرخی میں کون سا اہم پس منظر غائب ہے؟",
          options: [
            "تحقیقاتی لائبریری کا پتہ",
            "ماضی کا موازنہ (امتحانات کے دوران دباؤ ایک فطری بات ہے اور یہ ماضی کے مطابق ہی ہے، کوئی نیا نفسیاتی بحران نہیں ہے)",
            "اساتذہ کی کل تعداد کا سروے"
          ],
          correctIndex: 1,
          technique: "پس منظر کے بغیر اعداد و شمار پیش کرنا",
          explanation: "تبدیل شدہ سرخی انتہائی سنسنی خیز الفاظ ('نفسیاتی بحران'، 'ذہنی توازن بگڑنا') استعمال کرتی ہے اور 65 فیصد کے اعداد و شمار کو ایک بڑی تباہی کے طور پر پیش کرتی ہے، جبکہ یہ بات چھپا لیتی ہے کہ یہ دباؤ عارضی ہے اور معمول کے مطابق ہے۔"
        },
        {
          id: 4,
          topic: "طبی ریسرچ",
          original: "200 مریضوں پر کیے گئے تجربے سے معلوم ہوا کہ دوا X نے پلیسبو کے مقابلے میں بلڈ پریشر میں اوسطاً 6mmHg کی معمولی کمی کی ہے۔",
          manipulated: "🚨 ڈاکٹروں نے معجزاتی دوا چھپا لی! دوا X بلڈ پریشر کو ہمیشہ کے لیے ختم کر دیتی ہے! فارما کمپنیاں آپ کو یہ نہیں بتانا چاہتیں! 💊",
          question: "تبدیل شدہ پوسٹ میں ہیرا پھیری کی کون سی تیکنیک استعمال ہوئی ہے؟",
          options: [
            "سازشی مفروضہ اور جھوٹی یقین دہانی (معمولی کمی کو 'معجزاتی علاج' اور 'ہمیشہ کا خاتمہ' بتانا اور سازشی رخ دینا)",
            "جھوٹے ڈاکٹروں کے اقوال منسوب کرنا",
            "دوا لینے سے روکنے کے لیے خوف پیدا کرنا"
          ],
          correctIndex: 0,
          technique: "سازش کا تانا بانا اور مبالغہ آرائی",
          explanation: "اصل خبر ایک معمولی طبی نتیجے کی رپورٹ کرتی ہے۔ وائرل پوسٹ تمام سائنسی حقیقت کو ختم کر کے اسے 'معجزاتی علاج' کا نام دیتی ہے اور فارما کمپنیوں کی سازش کا مفروضہ بناتی ہے۔"
        },
        {
          id: 5,
          topic: "سیاسی واقعات",
          original: "شہری کونسل نے 4 ماہ کی مشاورت کے بعد نئے پارک کی تعمیر کے حق میں 7 کے مقابلے میں 3 ووٹوں سے فیصلہ پاس کر دیا۔",
          manipulated: "⚠️ حکومت نے شہریوں کی مرضی کے خلاف خفیہ منصوبہ پاس کر دیا! عوام مشتعل! صرف 3 کونسل ممبرز نے آواز اٹھائی!",
          question: "تبدیل شدہ سرخی میں کون سا تعصب بھڑکایا جا رہا ہے؟",
          options: [
            "مبینہ غلط توازن (یہ ظاہر کرنا کہ اقلیت کی رائے ہی عوام کی رائے ہے جبکہ 7 کونسل ممبرز نے حق میں ووٹ دیا تھا)",
            "بھیڑ چال کا تعصب",
            "انفرادی کہانیوں کا جھوٹا سہارا"
          ],
          correctIndex: 0,
          technique: "اقلیت کو اکثریت کے طور پر پیش کرنا",
          explanation: "کونسل کا ووٹ 7 کے مقابلے میں 3 تھا۔ بدلی ہوئی سرخی اقلیتی ووٹ کو 'عوامی آواز' بتاتی ہے اور اکثریتی جمہوری فیصلے کو 'خفیہ ظلم' بنا کر پیش کرتی ہے۔"
        },
        {
          id: 6,
          topic: "شناختی تعصب",
          original: "معاشی بحران کے دوران تمام آبادیوں میں جرائم کی شرح میں 3 فیصد کا اضافہ دیکھنے میں آیا ہے۔",
          manipulated: "🚨 غیر ملکی تارکین وطن جرائم کی لہر کے ذمہ دار: آپ کا علاقہ خطرے میں ہے! اپنے خاندان کی حفاظت کریں اور اسے شیئر کریں!",
          question: "اس بدلی ہوئی سرخی میں کون سا تعصب استعمال کیا گیا ہے؟",
          options: [
            "قربانی کا بکرا بنانا اور شناختی خطرہ (بغیر ثبوت کے جرائم کا ذمہ دار کسی ایک گروہ کو ٹھہرانا اور کمیونٹی کو خوف دلانا)",
            "اعداد و شمار کو راؤنڈ اپ کرنا",
            "جھوٹے پولیس افسر کا بیان پیش کرنا"
          ],
          correctIndex: 0,
          technique: "قربانی کا بکرا بنانا اور تعصب بھڑکانا",
          explanation: "اصل رپورٹ معاشی بحران کے دوران جرائم میں 3 فیصد عمومی اضافے کی بات کرتی ہے۔ وائرل پوسٹ بغیر کسی ثبوت کے جرائم کو تارکینِ وطن سے جوڑتی ہے تاکہ نفرت اور خوف پیدا کیا جا سکے۔"
        }
      ];
    }

    return [
      {
        id: 1,
        topic: "Climate Science",
        original: "Scientists publish new climate research showing a 1.2-degree Celsius average increase in global temperatures over the last decade.",
        manipulated: "🚨 CLIMATE MELTDOWN IMMINENT! SCIENTISTS JUST DISCOVERED SOMETHING TERRIFYING THAT THEY TRIED TO HIDE! WAKE UP!",
        question: "What main manipulation technique is used in the modified headline?",
        options: [
          "Fear Appeal & Clickbait (Urgent capitalizations, alarming verbs, and conspiracy framing)",
          "Statistical manipulation (Faking mathematical formulas)",
          "Unauthorised quoting (Citing external authorities without permission)"
        ],
        correctIndex: 0,
        technique: "Fearmongering & Urgency Appeals",
        explanation: "The manipulated version strips away the specific data (1.2-degree rise) and replaces it with extreme trigger words ('MELTDOWN', 'TERRIFYING'), screaming capital letters, and a conspiracy element ('tried to hide'). This bypasses rational analysis by appealing directly to fear and curiosity."
      },
      {
        id: 2,
        topic: "Commerce Regulations",
        original: "Local department stores will limit single-use plastics starting next Monday to comply with the new environmental municipal code.",
        manipulated: "⚠️ GOVERNMENT PLASTIC FORCED BAN: RETAILERS EXPLOIT NEW RULES TO MAKE CITIZENS PAY TO CARRY FOOD!",
        question: "Identify the manipulation framing technique utilized in the doctored headline.",
        options: [
          "Technical jargon spoofing (using overly complex scientific terminology)",
          "Hostile/Outrage Framing (using words like 'FORCED', 'EXPLOIT' to create anger and opposition)",
          "AI Deepfake Text spoofing"
        ],
        correctIndex: 1,
        technique: "Outrage / Hostile Framing",
        explanation: "By framing a standard environmental compliance measure around emotional words of coercion ('FORCED BAN') and corruption ('RETAILERS EXPLOIT'), the creator triggers political anger and defensiveness in readers to encourage sharing."
      },
      {
        id: 3,
        topic: "Academic Surveys",
        original: "A university health survey reports that 65% of students report feelings of stress during final exam weeks, reflecting typical historical averages.",
        manipulated: "💔 EXAM DEPRESSION CRISIS: MASSIVE 65% OF STUDENT BODIES MENTALLY BROKEN BY THE SYSTEM!",
        question: "What statistical context is missing from the manipulated headline?",
        options: [
          "The exact location of the research library",
          "Historical Baseline Context (stress increases during exams naturally, and this matches historical norms; it is not a new 'mental breakdown' epidemic)",
          "The sample size of teachers surveyed"
        ],
        correctIndex: 1,
        technique: "Cherry-picking without Baseline Context",
        explanation: "The modified version uses extreme language ('DEPRESSION CRISIS', 'MENTALLY BROKEN') and presents the 65% figure as a shocking new catastrophe, omitting the baseline context that exam stress is normal, temporary, and matches historical levels."
      },
      {
        id: 4,
        topic: "Medical Research",
        original: "A clinical trial of 200 patients found that Drug X modestly reduced blood pressure by 6mmHg on average compared to a placebo group.",
        manipulated: "🚨 DOCTORS ARE HIDING THIS MIRACLE CURE! Drug X REVERSES hypertension PERMANENTLY! The pharmaceutical industry doesn't want you to know! 💊",
        question: "What combination of manipulation techniques is used in the altered version?",
        options: [
          "Conspiracy theory framing + False clinical certainty (claims 'permanent reversal' vs a modest reduction, adds conspiracy element to suppress rational skepticism)",
          "Quote manipulation (incorrectly attributing quotes to real doctors)",
          "Scare tactic (exaggerating risks to prevent people from taking medicine)"
        ],
        correctIndex: 0,
        technique: "Conspiracy Framing + False Clinical Certainty",
        explanation: "The original reports a modest, statistically bounded clinical result. The viral version strips all context, replaces quantitative precision with 'MIRACLE CURE', invents a pharmaceutical cover-up conspiracy, and uses 'PERMANENTLY' to claim certainty far beyond what the evidence supports."
      },
      {
        id: 5,
        topic: "Political Event Coverage",
        original: "The city council voted 7-3 in favor of the new urban green space development project after a 4-month public consultation process.",
        manipulated: "⚠️ GOVERNMENT SECRETLY PASSES CONTROVERSIAL PROJECT AGAINST PUBLIC WILL! Citizens OUTRAGED! Only 3 brave council members opposed the tyrants!",
        question: "Which bias-triggering technique is primarily used in the manipulated headline?",
        options: [
          "False balance framing (implying the 3 opposing votes represent the majority of public opinion when the actual vote was 7-3 in favor)",
          "Bandwagon effect (claiming everyone agrees with the article's stance)",
          "Anecdotal reasoning (using individual personal stories instead of data)"
        ],
        correctIndex: 0,
        technique: "False Minority = Majority Framing",
        explanation: "The vote was 7-3. The original presents this transparently. The manipulated version inverts public reality — it implies the minority (3 votes) represents 'the public' while the majority (7 votes) are 'tyrants.' This is a textbook false equivalence designed to frame a democratically reached decision as an authoritarian act."
      },
      {
        id: 6,
        topic: "Identity-Based Misinformation",
        original: "Urban neighborhood crime statistics showed a 3% increase across all demographics during the economic recession period.",
        manipulated: "🚨 LOCAL IMMIGRANTS RESPONSIBLE FOR CRIME SURGE: Your community is under attack! Protect your family and SHARE this truth they don't want you to see!",
        question: "What is the primary misinformation technique used in this manipulated post?",
        options: [
          "Scapegoating + Identity Threat Framing (attributing aggregate crime data to a specific ethnic/immigration group without evidence, then activating in-group protection instincts)",
          "Statistical rounding (rounding up crime figures to seem more alarming)",
          "False expert attribution (inventing a criminologist's quote)"
        ],
        correctIndex: 0,
        technique: "Scapegoating + Identity Threat Activation",
        explanation: "The original reports a 3% general increase during a recession — a well-documented economic correlation affecting all groups. The viral version fabricates attribution to immigrants (with zero supporting data), adds 'your community is under attack' to trigger in-group identity threat, and 'SHARE this truth they don't want you to see' to weaponize social networks against a vulnerable group."
      }
    ];
  };

  const localizedLabPairs = getLocalizedLabPairs();
  const currentPair = localizedLabPairs[activeIdx];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOpt(idx);
    setHasAnswered(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setHasAnswered(false);
    setActiveIdx((activeIdx + 1) % localizedLabPairs.length);
  };

  const runVerification = async (text: string) => {
    if (!text.trim() || verifying) return;
    
    // Map Urdu input queries to English for internal RAG mock endpoint compatibility
    let queryCall = text;
    if (text.includes("کافی") || text.includes("coffee")) {
      queryCall = "coffee";
    } else if (text.includes("لاک ڈاؤن") || text.includes("lockdown")) {
      queryCall = "lockdown";
    }

    setClaimInput(text);
    setVerifying(true);
    setVerificationResult(null);
    setSelectedGraphNode(null);

    try {
      const res = await fetch('/api/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryCall })
      });
      const data = await res.json();
      
      // If language is Urdu, localize key RAG verdict outputs dynamically
      if (language === 'ur' && data) {
        if (data.verdict === 'MISLEADING') data.verdict = 'گمراہ کن';
        if (data.verdict === 'FABRICATED') data.verdict = 'من گھڑت';
        if (data.verdict === 'SUPPORTED') data.verdict = 'ثابت شدہ';
        if (data.verdict === 'UNVERIFIED') data.verdict = 'غیر مصدقہ';
      }

      setVerificationResult(data);
      if (data?.graph?.nodes?.length > 0) {
        setSelectedGraphNode(data.graph.nodes[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const isCorrect = selectedOpt === currentPair.correctIndex;

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9]">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-10 space-y-8">
        
        {/* Page Title */}
        <div className="space-y-1 text-start">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Cpu className="w-8 h-8 text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]" />
            {t.lab}
          </h2>
          <p className="text-sm text-slate-400">{t.lab_sub}</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-sky-950">
          <button
            onClick={() => setActiveTab('headlines')}
            className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'headlines'
                ? 'border-purple-400 text-purple-400 bg-purple-950/10 shadow-[inset_0_-2px_0_#a855f7]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.lab_tab_1}
          </button>
          <button
            onClick={() => setActiveTab('sleuth')}
            className={`px-6 py-3 font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'sleuth'
                ? 'border-purple-400 text-purple-400 bg-purple-950/10 shadow-[inset_0_-2px_0_#a855f7]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.lab_tab_2}
          </button>
        </div>

        {activeTab === 'headlines' ? (
          /* TAB 1: Headline manipulation comparing quiz */
          <div className="space-y-8">
            
            {/* Progress + topic */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400 text-start">
                {language === 'ur' ? 'موضوع' : 'Topic'}: <span className="text-sky-400">{currentPair.topic}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {localizedLabPairs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveIdx(i); setSelectedOpt(null); setHasAnswered(false); }}
                    className={`w-6 h-1.5 rounded-full transition-all cursor-pointer ${i === activeIdx ? 'bg-purple-400' : 'bg-slate-700 hover:bg-slate-500'}`}
                  />
                ))}
                <span className="text-[10px] text-slate-500 font-bold ml-1 rtl:mr-1 rtl:ml-0">{activeIdx + 1}/{localizedLabPairs.length}</span>
              </div>
            </div>

            {/* Headline grids */}
            <div className="grid md:grid-cols-2 gap-6 text-start">
              <div className="glass-panel p-6 rounded-2xl border border-sky-950/60 bg-slate-900/10 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{t.lab_raw_fact}</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-medium">
                    "{currentPair.original}"
                  </p>
                </div>
                <div className="mt-6 text-[10px] text-slate-500 uppercase font-semibold">{language === 'ur' ? 'لہجہ: غیر جانبدار، سائنسی، متوازن' : 'Tones: Objective, scientific, measured'}</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-rose-950/40 bg-rose-950/5 flex flex-col justify-between min-h-[220px] shadow-[0_0_20px_rgba(239,68,68,0.02)]">
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">{t.lab_manipulated}</span>
                  </div>
                  <p className="text-sm sm:text-base text-rose-100 font-extrabold leading-relaxed font-sans">
                    "{currentPair.manipulated}"
                  </p>
                </div>
                <div className="mt-6 text-[10px] text-rose-400/80 uppercase font-bold">{t.lab_manipulated}: {currentPair.technique}</div>
              </div>
            </div>

            {/* Interaction Panel */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sky-950/60 shadow-[0_0_30px_rgba(56,189,248,0.03)] space-y-6 text-start">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-purple-950/40 border border-purple-900/50 rounded-lg text-purple-400 shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentPair.question}
                </h3>
              </div>

              <div className="space-y-3">
                {currentPair.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  let btnClass = 'border-sky-950 bg-slate-900/20 text-slate-300 hover:bg-sky-950/20 hover:border-sky-800';
                  
                  if (hasAnswered) {
                    if (idx === currentPair.correctIndex) {
                      btnClass = 'border-emerald-500 bg-emerald-950/20 text-emerald-400';
                    } else if (isSelected) {
                      btnClass = 'border-rose-500 bg-rose-950/20 text-rose-400';
                    } else {
                      btnClass = 'border-sky-950 opacity-40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-start p-4 rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer ${btnClass}`}
                    >
                      <span className="leading-relaxed pr-4 pl-4 rtl:pl-4 rtl:pr-0">{opt}</span>
                      {!hasAnswered && (
                        <ArrowRight className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 rtl:rotate-180" />
                      )}
                      {hasAnswered && idx === currentPair.correctIndex && (
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {hasAnswered && isSelected && idx !== currentPair.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`p-5 rounded-xl border leading-relaxed space-y-2 text-sm ${
                      isCorrect 
                        ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200' 
                        : 'bg-rose-950/10 border-rose-900/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="font-extrabold uppercase text-xs tracking-wider">
                        {isCorrect ? (language === 'ur' ? 'درست تجزیہ' : 'Correct Analysis') : (language === 'ur' ? 'غلط تشریح' : 'Incorrect Interpretation')} — {language === 'ur' ? 'وضاحت' : 'Explanation'}
                      </span>
                    </div>
                    <p className="leading-relaxed text-xs sm:text-sm pt-1">
                      {currentPair.explanation}
                    </p>
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleNext}
                        className="inline-flex items-center px-4 py-2 bg-slate-900/80 border border-sky-900/60 rounded-lg text-xs font-bold text-sky-400 hover:text-white hover:bg-slate-950 hover:border-sky-500 transition-all gap-1.5 cursor-pointer"
                      >
                        {language === 'ur' ? 'اگلی سرخی' : 'Next Headline Pair'} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          /* TAB 2: Sleuth AI claim decomposition and verification graph */
          <div className="space-y-6 text-start">
            
            {/* Input card */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950 space-y-4">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-sky-400" />
                {t.lab_sleuth_input}
              </h3>
              
              <div className="relative">
                <textarea
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  placeholder={t.lab_sleuth_placeholder}
                  rows={3}
                  className="w-full bg-slate-950/80 border border-sky-900/60 focus:border-sky-500 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all resize-none text-start"
                />
              </div>

              {/* Sample Quick links */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <span className="text-slate-500 font-bold uppercase text-[10px]">{t.lab_quick_demos}:</span>
                <button 
                  onClick={() => runVerification(language === 'ur' ? "کافی پینے سے عمر میں 10 سال اضافہ ہوتا ہے" : "Scientists say drinking coffee adds 10 years to your life.")}
                  className="px-2.5 py-1 bg-sky-950/40 border border-sky-900/50 rounded-lg text-sky-400 hover:bg-sky-900/30 transition-all cursor-pointer font-medium"
                >
                  {language === 'ur' ? '☕ کافی اور عمر' : '☕ Coffee Lifespan'}
                </button>
                <button 
                  onClick={() => runVerification(language === 'ur' ? "حکومتیں فوری طور پر لاک ڈاؤن نافذ کرنے والی ہیں" : "Governments are preparing mandatory lockdown cash bans.")}
                  className="px-2.5 py-1 bg-sky-950/40 border border-sky-900/50 rounded-lg text-sky-400 hover:bg-sky-900/30 transition-all cursor-pointer font-medium"
                >
                  {language === 'ur' ? '🚨 لاک ڈاؤن افواہ' : '🚨 Imminent Lockdown'}
                </button>
              </div>

              <button
                onClick={() => runVerification(claimInput)}
                disabled={!claimInput.trim() || verifying}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/10 text-white font-extrabold rounded-xl text-sm transition-all flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                    {t.lab_sleuth_analyzing}
                  </>
                ) : (
                  <>
                    {t.lab_sleuth_button}
                  </>
                )}
              </button>
            </div>

            {/* Results workspace displays */}
            <AnimatePresence>
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-12 gap-6 items-start"
                >
                  
                  {/* Verdict & Decomposition text summary */}
                  <div className="md:col-span-6 space-y-6">
                    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-4">
                      
                      {/* Verdict Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.lab_verdict}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                          verificationResult.verdict.includes('ثابت') || verificationResult.verdict === 'SUPPORTED'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                            : verificationResult.verdict.includes('گمراہ') || verificationResult.verdict === 'MISLEADING'
                              ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                              : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                        }`}>
                          {verificationResult.verdict}
                        </span>
                      </div>

                      {verificationResult.mode === 'demo' && (
                        <div className="p-3 bg-amber-950/15 border border-amber-900/40 rounded-xl text-amber-300 text-xs font-medium leading-relaxed flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="animate-pulse text-sm">⚠️</span>
                          <span>{language === 'ur' ? 'آف لائن ڈیمو موڈ: مصنوعی ذہانت کا لوکل سیمولیٹر چل رہا ہے۔' : 'Offline Demo Mode: Running on simulated local intelligence patterns.'}</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">
                          {t.lab_confidence}: <span className="font-bold text-sky-400">{verificationResult.confidence}%</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed pt-1">
                          {verificationResult.summary}
                        </p>
                      </div>

                      {/* Decomposition bullets list */}
                      <div className="pt-4 border-t border-sky-950 space-y-4">
                        <h4 className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-sky-400" />
                          {t.lab_decomposition}
                        </h4>
                        
                        <div className="space-y-3">
                          {verificationResult.claims.map((claim: any, cIdx: number) => (
                            <div key={cIdx} className="p-3 bg-slate-950/60 border border-sky-950 rounded-lg flex items-start space-x-2.5 rtl:space-x-reverse">
                              {claim.status === 'SUPPORTED' ? (
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : claim.status === 'CONTRADICTED' ? (
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <HelpIcon className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-1 text-start">
                                <div className="text-xs font-bold text-slate-200">{claim.text}</div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">{claim.why}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Visual Evidence Graph */}
                  <div className="md:col-span-6 space-y-6">
                    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-sky-950/60 space-y-5">
                      <h4 className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <Network className="w-4 h-4 text-purple-400" />
                        {t.lab_graph}
                      </h4>

                      {/* Display Node buttons map */}
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {verificationResult.graph?.nodes.map((node: any) => {
                          const isSelected = selectedGraphNode?.id === node.id;
                          
                          let style = 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-950/30';
                          if (node.type === 'claim') style = 'border-sky-950 text-sky-400 bg-sky-950/10 hover:border-sky-800';
                          if (node.type === 'source') style = 'border-purple-950 text-purple-400 bg-purple-950/10 hover:border-purple-800';
                          if (node.type === 'evidence') {
                            style = node.status === 'contradicts' 
                              ? 'border-rose-950 text-rose-400 bg-rose-950/10 hover:border-rose-800' 
                              : 'border-emerald-950 text-emerald-400 bg-emerald-950/10 hover:border-emerald-800';
                          }

                          if (isSelected) {
                            style += ' ring-1 ring-sky-400 scale-105 shadow-[0_0_10px_rgba(56,189,248,0.15)]';
                          }

                          return (
                            <button
                              key={node.id}
                              onClick={() => setSelectedGraphNode(node)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer ${style}`}
                            >
                              <span>{node.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Node descriptor panel */}
                      {selectedGraphNode && (
                        <div className="p-4 bg-slate-950/80 border border-sky-950 rounded-xl space-y-2">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">{t.lab_inspector}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{selectedGraphNode.label}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {selectedGraphNode.description}
                          </p>
                        </div>
                      )}

                      {/* Connections guide list */}
                      <div className="pt-2 space-y-2 border-t border-sky-950 text-[10px] text-slate-500 font-semibold uppercase">
                        <div>{language === 'ur' ? 'شواہد کا باہمی تعلق:' : 'Map Connections:'}</div>
                        <div className="space-y-1 bg-slate-950/50 p-2.5 rounded-lg border border-sky-950/60 font-mono text-[9px] text-slate-400 normal-case">
                          {verificationResult.graph?.edges.map((edge: any, eIdx: number) => {
                            const fromNode = verificationResult.graph.nodes.find((n: any) => n.id === edge.from);
                            const toNode = verificationResult.graph.nodes.find((n: any) => n.id === edge.to);
                            const fromLabel = fromNode ? fromNode.label : edge.from;
                            const toLabel = toNode ? toNode.label : edge.to;
                            return (
                              <div key={eIdx} className="flex items-center space-x-1.5 rtl:space-x-reverse py-0.5">
                                <span className="font-bold text-slate-200">"{fromLabel.slice(0, 15)}..."</span>
                                <span className="text-purple-400 font-bold font-sans">── {edge.relationship} ──&gt;</span>
                                <span className="font-bold text-slate-200">"{toLabel.slice(0, 15)}..."</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </main>
    </div>
  );
}
