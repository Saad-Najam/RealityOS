'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle, Shield, Fingerprint } from 'lucide-react';
import { dbService, SkillScores, Profile } from '@/lib/db';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

interface DiagnosticQuestion {
  id: number;
  text: string;
  subText?: string;
  options: {
    text: string;
    scoreWeight: number;
  }[];
  skill: keyof SkillScores;
}

export default function DiagnosticQuiz() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const getLocalizedQuestions = (): DiagnosticQuestion[] => {
    if (language === 'ur') {
      return [
        {
          id: 1,
          text: "آپ کو فیملی گروپ میں واٹس ایپ پر ایک فارورڈ پیغام ملتا ہے جس میں دعویٰ کیا گیا ہے کہ حکومت نے کل عام تعطیل کا اعلان کیا ہے اور تمام امتحانات ملتوی کر دیے گئے ہیں۔",
          subText: "🚨 ہنگامی اطلاع: حکومت کا کل عام تعطیل کا اعلان۔ امتحانات ملتوی ہو گئے! تمام گروپس میں فارورڈ کریں!",
          options: [
            { text: "اپنے دوستوں کو مطلع کرنے کے لیے اسے فوراً اپنی کلاس کے واٹس ایپ گروپس میں شیئر کریں۔", scoreWeight: 20 },
            { text: "فرض کریں کہ یہ سچ ہے کیونکہ یہ دوسرے گروپس میں کئی بار فارورڈ کیا جا چکا ہے۔", scoreWeight: 45 },
            { text: "تصدیق کے لیے ایک سرچ ٹیب کھولیں اور یونیورسٹی یا ایچ ای سی (HEC) کے پورٹل پر سرکاری نوٹیفیکیشن تلاش کریں۔", scoreWeight: 100 }
          ],
          skill: "source_verification"
        },
        {
          id: 2,
          text: "سوشل میڈیا پر ایک عالمی رہنما کی تصویر وائرل ہوتی ہے جس میں انہوں نے ایک انتہائی غیر معمولی فیشن ایبل جیکٹ پہن رکھی ہے۔ جیکٹ کی بناوٹ اصلی معلوم ہوتی ہے، لیکن روشنی کا زاویہ کچھ مصنوعی لگتا ہے۔",
          options: [
            { text: "فوری طور پر ان کے نئے انداز پر ایک مضحکہ خیز جملے کے ساتھ اسے دوبارہ شیئر کریں۔", scoreWeight: 30 },
            { text: "اسے سچ مان لیں کیونکہ مشہور سوشل میڈیا شخصیات اسے پوسٹ کر رہی ہیں۔", scoreWeight: 50 },
            { text: "تصویر کو زوم کر کے ہاتھوں کی لکیروں، پس منظر کی جیومیٹری کو چیک کریں اور انٹرنیٹ پر اس کے بارے میں تحقیقات تلاش کریں۔", scoreWeight: 100 }
          ],
          skill: "deepfake_awareness"
        },
        {
          id: 3,
          text: "ایک صحت بلاگ کی سرخی ہے: 'نئی تحقیق: اعتدال پسند کافی پینے والے اپنی عمر میں 10 سال کا اضافہ کرتے ہیں! ہمیشہ زندہ رہنے کے لیے آج ہی زیادہ کافی پیئیں!'",
          options: [
            { text: "اس پر مکمل یقین کریں اور معمول سے دگنی کافی پینا شروع کر دیں۔", scoreWeight: 20 },
            { text: "اسے تسلیم کر لیں کیونکہ اس سے آپ کو اپنی کافی پینے کی عادت کے بارے میں اچھا محسوس ہوتا ہے۔", scoreWeight: 50 },
            { text: "تحقیق کریں کہ آیا یہ ایک سادہ باہمی تعلق (correlation) کا مطالعہ تھا یا اس میں دیگر عوامل بھی شامل ہیں۔", scoreWeight: 100 }
          ],
          skill: "statistical_literacy"
        },
        {
          id: 4,
          text: "آپ سوشل میڈیا پر ایک لیک ہونے والی آڈیو کلپ سنتے ہیں جس میں ایک امیدوار نجی گفتگو میں یونیورسٹی کے انتخابات میں دھاندلی کا اعتراف کر رہا ہے۔",
          options: [
            { text: "اسے کرپشن کے ناقابلِ تردید ثبوت کے طور پر اپنے سوشل میڈیا فیڈ پر پوسٹ کریں۔", scoreWeight: 25 },
            { text: "یقین کرنے سے پہلے اپنے چند دوستوں کے کلپ سننے کی تصدیق کا انتظار کریں۔", scoreWeight: 55 },
            { text: "غور کریں کہ مصنوعی ذہانت (AI) کے ذریعے آواز کے کلونز آسانی سے بنائے جا سکتے ہیں، اور روبوٹک آواز کی خرابیوں یا مستند میڈیا بیانات کی جانچ کریں۔", scoreWeight: 100 }
          ],
          skill: "ai_literacy"
        },
        {
          id: 5,
          text: "آپ کے فیڈ پر بڑے حروف میں لکھی ایک پوسٹ نظر آتی ہے: '🚨 بین الاقوامی ادارے خفیہ طور پر دوبارہ گھروں میں نظر بندی کی تیاری کر رہے ہیں! جاگیں اور بینک بند ہونے سے پہلے نقد رقم نکال لیں!'",
          options: [
            { text: "اپنے خاندان کو خبردار کرنے کے لیے اسے شیئر کریں؛ احتیاط علاج سے بہتر ہے۔", scoreWeight: 15 },
            { text: "پوسٹ کے سنسنی خیز اور جذباتی لہجے کی وجہ سے اس پر یقین کر لیں۔", scoreWeight: 40 },
            { text: "پہچانیں کہ پوسٹ خوف و ہراس پھیلانے کی کوشش کر رہی ہے، اور سرکاری نوٹس یا بینک بیانات تلاش کریں۔", scoreWeight: 100 }
          ],
          skill: "emotional_manipulation"
        },
        {
          id: 6,
          text: "ایک صارف سپر مارکیٹ میں خالی الماریوں کی تصویر پوسٹ کرتا ہے جس کا عنوان ہے: 'یہ موجودہ گورنر کے دور میں معاشی تباہی کی تصویر ہے۔' تصویر بالکل واضح اور غیر ترمیم شدہ ہے۔",
          options: [
            { text: "حکومت پر تنقید کرتے ہوئے غصے سے بھرپور کمنٹ کریں۔", scoreWeight: 25 },
            { text: "اس پر بھروسہ کریں کیونکہ تصویر بالکل صاف ہے اور اس میں کوئی ترمیم یا فوٹوشاپ نہیں کیا گیا۔", scoreWeight: 50 },
            { text: "تصویر پر ریورس امیج سرچ (reverse image search) چلائیں تاکہ معلوم ہو سکے کہ یہ کسی پرانے واقعے یا کسی اور جگہ کی تو نہیں ہے۔", scoreWeight: 100 }
          ],
          skill: "lateral_reading"
        },
        {
          id: 7,
          text: "آپ ٹیکس کی نئی پالیسی کے بارے میں ایک مضمون پڑھتے ہیں۔ سرخی اسے 'خاندانوں کے لیے تباہ کن دھچکا' کہتی ہے اور 'کرپٹ سیاستدان' اور 'ڈکیتی' جیسے جذباتی الفاظ استعمال کرتی ہے، لیکن صرف ایک اپوزیشن لیڈر کا بیان نقل کرتی ہے۔",
          options: [
            { text: "مضمون سے فوراً اتفاق کریں کیونکہ استعمال کی گئی زبان سچی اور پرجوش معلوم ہوتی ہے۔", scoreWeight: 20 },
            { text: "نظام کی کرپشن کو ظاہر کرنے کے لیے اسے اپنے انسٹاگرام یا واٹس ایپ سٹیٹس پر شیئر کریں۔", scoreWeight: 45 },
            { text: "پہچانیں کہ جذباتی الفاظ اور صرف ایک فریق کا موقف شدید جانب داریت کو ظاہر کرتا ہے، اور ایسی غیر جانبدارانہ رپورٹ تلاش کریں جس میں دونوں فریقین کے بیانات موجود ہوں۔", scoreWeight: 100 }
          ],
          skill: "bias_detection"
        }
      ];
    }

    return [
      {
        id: 1,
        text: "You receive a forwarded WhatsApp message from a family member stating that tomorrow is declared a sudden public holiday and exams are postponed.",
        subText: "🚨 URGENT: Government announces tomorrow as a public holiday. Exams are postponed! Forward to all groups!",
        options: [
          { text: "Share it instantly to your class WhatsApp groups to notify your friends.", scoreWeight: 20 },
          { text: "Assume it is true since it has been forwarded many times in other groups.", scoreWeight: 45 },
          { text: "Open a search tab to look up the official notification on the HEC or university portal.", scoreWeight: 100 }
        ],
        skill: "source_verification"
      },
      {
        id: 2,
        text: "An image goes viral showing a world leader wearing a highly unusual designer puffer jacket in public. The texture looks real, but the lighting seems somewhat artistic.",
        options: [
          { text: "Re-share it immediately with a funny caption about their new style.", scoreWeight: 30 },
          { text: "Assume it is authentic because famous influencers are posting it.", scoreWeight: 50 },
          { text: "Zoom in to check the hands, background geometry, and search for independent image reports.", scoreWeight: 100 }
        ],
        skill: "deepfake_awareness"
      },
      {
        id: 3,
        text: "A health blog headline claims: 'BREAKING STUDY: Moderate coffee drinkers add 10 years to their lifespan! Drink more coffee today to live forever!'",
        options: [
          { text: "Believe it completely and start drinking twice as much coffee.", scoreWeight: 20 },
          { text: "Accept it because it makes you feel good about your coffee habits.", scoreWeight: 50 },
          { text: "Investigate whether the research was a simple correlational study or if other factors are involved.", scoreWeight: 100 }
        ],
        skill: "statistical_literacy"
      },
      {
        id: 4,
        text: "You hear a leaked audio clip on social media where a candidate confesses to manipulating local campus votes in private.",
        options: [
          { text: "Post it on your social feed as undeniable proof of corruption.", scoreWeight: 25 },
          { text: "Wait for a few friends to confirm they heard it too before you believe it.", scoreWeight: 55 },
          { text: "Consider that AI voice clones can be generated easily, and check for robotic artifacts or verified media statements.", scoreWeight: 100 }
        ],
        skill: "ai_literacy"
      },
      {
        id: 5,
        text: "A post written in all caps appears on your feed: '🚨 THE INTERNATIONAL PLANNERS ARE SECRETLY PREPARING FOR ANOTHER COMPULSORY CONFINEMENT! WAKE UP AND RETRIEVE CASH BEFORE THEY SHUT BANKING!'",
        options: [
          { text: "Share it to warn your family; it is better to be safe than sorry.", scoreWeight: 15 },
          { text: "Believe it because of the high urgency and emotional tone of the post.", scoreWeight: 40 },
          { text: "Recognize the text is attempting to trigger fear-driven panic, and search for official notices or bank statements.", scoreWeight: 100 }
        ],
        skill: "emotional_manipulation"
      },
      {
        id: 6,
        text: "A user posts a photo showing empty shelves in a supermarket with the caption: 'This is the economic collapse under the current governor.' The photo is crisp and unedited.",
        options: [
          { text: "Comment angry remarks blaming the government.", scoreWeight: 25 },
          { text: "Trust it since the photo is clear and has not been edited or photoshopped.", scoreWeight: 50 },
          { text: "Run a reverse image search on the photo to see if it is from an older incident or different location.", scoreWeight: 100 }
        ],
        skill: "lateral_reading"
      },
      {
        id: 7,
        text: "You read an article about a new tax policy. The headline calls it a 'Devastating Blow to Families' and uses loaded phrases like 'corrupt politicians' and 'robbery', but quotes only one opposition leader.",
        options: [
          { text: "Agree with the article immediately because the language feels passionate and true.", scoreWeight: 20 },
          { text: "Share it on your stories to show how corrupt the system is.", scoreWeight: 45 },
          { text: "Recognize that the loaded vocabulary and single-sourced perspective indicate severe ideological bias, and seek out neutral reporting that contains both sides.", scoreWeight: 100 }
        ],
        skill: "bias_detection"
      }
    ];
  };

  const localizedQuestions = getLocalizedQuestions();

  const handleSelectOption = (optionWeight: number) => {
    setAnswers({ ...answers, [currentIdx]: optionWeight });
    
    if (currentIdx < localizedQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
      }, 400);
    } else {
      setIsFinishing(true);
      submitDiagnostic();
    }
  };

  const submitDiagnostic = async () => {
    const newScores: SkillScores = {
      source_verification: 50,
      bias_detection: 50,
      deepfake_awareness: 50,
      emotional_manipulation: 50,
      statistical_literacy: 50,
      lateral_reading: 50,
      ai_literacy: 50
    };

    localizedQuestions.forEach((q, idx) => {
      const weight = answers[idx] ?? 50;
      newScores[q.skill as keyof SkillScores] = weight;
    });

    await dbService.updateSkillScores(newScores);
    await dbService.saveBaselineIfMissing(newScores);

    const profile = await dbService.getProfile();
    const updates: Partial<Profile> = {
      completed_diagnostic: true,
      streak: Math.max(profile.streak, 1)
    };

    if (!profile.completed_diagnostic) {
      updates.xp = profile.xp + 200; // 200 XP first-time reward
    }
    
    await dbService.updateProfile(updates);

    setTimeout(() => {
      router.push('/profile');
    }, 2500);
  };

  const progressPercent = ((currentIdx) / localizedQuestions.length) * 100;
  const currentQuestion = localizedQuestions[currentIdx];

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#f1f5f9] relative overflow-hidden">
      
      {/* Laser Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-30 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-[scan_6s_linear_infinite] pointer-events-none" />
      <div className="absolute -top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-2xl glass-panel p-6 sm:p-10 rounded-3xl border border-sky-500/10 shadow-[0_0_60px_rgba(56,189,248,0.06)] relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {isFinishing ? (
              <motion.div 
                key="finishing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center space-y-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-xl animate-pulse" />
                  <Fingerprint className="w-20 h-20 text-sky-400 animate-[pulse_1.5s_infinite] drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-400 uppercase">
                    {t.diagnostic_loading.split('&')[0]}
                  </h2>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                    {t.diagnostic_loading.split('&')[1] || 'Analyzing media vulnerability patterns and building your customized Media DNA map...'}
                  </p>
                </div>

                <div className="w-56 bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-sky-950">
                  <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-1.5 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={currentIdx}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-8"
              >
                {/* Header Progress Widget */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest text-start">
                    <span className="flex items-center text-sky-400">
                      <Shield className="w-3.5 h-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                      {language === 'ur' ? 'ایم آئی ایل اسکین' : 'MIL Scan Protocol'}
                    </span>
                    <span>{language === 'ur' ? `سوال ${currentIdx + 1} از ${localizedQuestions.length}` : `Task ${currentIdx + 1} of ${localizedQuestions.length}`}</span>
                  </div>
                  <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-sky-950">
                    <div 
                      className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Scenario Area */}
                <div className="space-y-5 text-start">
                  <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                    <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-sky-400 shrink-0">
                      <HelpCircle className="w-5.5 h-5.5" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg sm:text-xl font-bold leading-relaxed text-white">
                        {currentQuestion.text}
                      </h3>
                      {currentQuestion.subText && (
                        <div className="p-4 bg-slate-950/80 border-l-4 border-amber-500 rtl:border-r-4 rtl:border-l-0 rounded-r-xl rtl:rounded-l-xl rtl:rounded-r-none text-amber-300 text-xs sm:text-sm font-mono whitespace-pre-line leading-relaxed border border-sky-950/20 text-start">
                          {currentQuestion.subText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2 text-start">
                  {currentQuestion.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(opt.scoreWeight)}
                      className="w-full text-start p-4 sm:p-5 rounded-2xl border border-sky-950 bg-slate-900/10 hover:bg-sky-950/15 hover:border-sky-500/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.05)] text-slate-300 hover:text-white transition-all duration-200 text-sm sm:text-base flex items-center justify-between group active:scale-[0.99] cursor-pointer"
                    >
                      <span className="leading-relaxed pr-6 pl-6 rtl:pl-6 rtl:pr-0">{opt.text}</span>
                      <ArrowRight className="w-5 h-5 text-sky-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:translate-x-0 rtl:group-hover:-translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
