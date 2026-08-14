export interface TranslationDict {
  // Common UI
  logo: string;
  battlefield: string;
  arena: string;
  lab: string;
  leaderboard: string;
  profile: string;
  educator: string;
  loading: string;
  streak: string;
  lvl: string;
  xp_needed: string;
  back: string;
  next: string;
  submit: string;
  cancel: string;
  close: string;
  save: string;
  edit: string;

  // Header / Navigation
  mil_prototype: string;
  onboarding_title: string;

  // Landing Page
  hero_title_1: string;
  hero_title_2: string;
  hero_title_3: string;
  hero_desc: string;
  enter_battlefield: string;
  test_literacy: string;
  free_use: string;
  no_data_sold: string;
  unesco_aligned: string;
  the_problem_title: string;
  the_problem_heading: string;
  the_problem_desc: string;
  problem_stat_1: string;
  problem_stat_1_lbl: string;
  problem_stat_2: string;
  problem_stat_2_lbl: string;
  problem_stat_3: string;
  problem_stat_3_lbl: string;
  how_it_works: string;
  how_it_works_desc: string;
  loop_step_1: string;
  loop_step_1_desc: string;
  loop_step_2: string;
  loop_step_2_desc: string;
  loop_step_3: string;
  loop_step_3_desc: string;
  loop_step_4: string;
  loop_step_4_desc: string;
  loop_step_5: string;
  loop_step_5_desc: string;
  loop_step_6: string;
  loop_step_6_desc: string;
  vs_title: string;
  vs_desc: string;
  trad_title: string;
  trad_1: string;
  trad_2: string;
  trad_3: string;
  trad_4: string;
  ros_title: string;
  ros_1: string;
  ros_2: string;
  ros_3: string;
  ros_4: string;
  features_title: string;
  features_desc: string;
  skills_title: string;
  skills_desc: string;
  impact_title: string;
  impact_desc: string;
  final_cta_heading: string;
  final_cta_span: string;
  final_cta_desc: string;
  footer_unesco: string;

  // Onboarding Page
  onboarding_step_1_title: string;
  onboarding_step_1_sub: string;
  onboarding_step_2_title: string;
  onboarding_step_2_sub: string;
  onboarding_step_3_title: string;
  onboarding_step_3_sub: string;
  onboarding_placeholder: string;
  onboarding_continue: string;
  onboarding_calibrating: string;
  onboarding_start_diagnostic: string;
  onboarding_guest: string;
  onboarding_privacy: string;

  // Diagnostic Page
  diagnostic_title: string;
  diagnostic_sub: string;
  diagnostic_loading: string;
  diagnostic_submitting: string;
  diagnostic_complete: string;
  diagnostic_complete_desc: string;
  diagnostic_see_profile: string;

  // Arena Page
  arena_title: string;
  arena_sub: string;
  arena_confidence: string;
  arena_confidence_low: string;
  arena_confidence_med: string;
  arena_confidence_high: string;
  arena_trust: string;
  arena_investigate: string;
  arena_ignore: string;
  arena_correct: string;
  arena_wrong: string;
  arena_calibration: string;
  arena_calibration_high_correct: string;
  arena_calibration_low_correct: string;
  arena_calibration_high_wrong: string;
  arena_calibration_low_wrong: string;
  arena_calibration_med: string;
  arena_fooled_title: string;
  arena_fooled_desc: string;
  arena_fooled_hint: string;
  arena_next_challenge: string;

  // Lab Page
  lab_title: string;
  lab_sub: string;
  lab_tab_1: string;
  lab_tab_2: string;
  lab_raw_fact: string;
  lab_manipulated: string;
  lab_technique: string;
  lab_quick_demos: string;
  lab_sleuth_input: string;
  lab_sleuth_placeholder: string;
  lab_sleuth_button: string;
  lab_sleuth_analyzing: string;
  lab_verdict: string;
  lab_confidence: string;
  lab_decomposition: string;
  lab_graph: string;
  lab_inspector: string;

  // Leaderboard Page
  lead_title: string;
  lead_sub: string;
  lead_campus_select: string;
  lead_tab_individual: string;
  lead_tab_campus: string;
  lead_rank: string;
  lead_cumulative: string;

  // Profile Page
  prof_title: string;
  prof_sub: string;
  prof_level: string;
  prof_rank: string;
  prof_strength: string;
  prof_weakness: string;
  prof_improved: string;
  prof_recommended: string;
  prof_practice: string;
  prof_breakdown: string;
  prof_baseline: string;
}

export const translations: Record<'en' | 'ur', TranslationDict> = {
  en: {
    logo: "REALITYOS",
    battlefield: "Battlefield",
    arena: "Arena",
    lab: "Investigation Lab",
    leaderboard: "Leaderboard",
    profile: "Media DNA",
    educator: "Educator Dashboard",
    loading: "LOADING...",
    streak: "Day Streak",
    lvl: "Lvl",
    xp_needed: "XP to next level",
    back: "Back",
    next: "Next",
    submit: "Submit",
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    edit: "Edit",

    mil_prototype: "MIL-AI Prototype",
    onboarding_title: "RealityOS Onboarding",

    hero_title_1: "Train your mind",
    hero_title_2: "before the algorithm",
    hero_title_3: "trains it for you.",
    hero_desc: "An adaptive AI-powered media literacy platform that helps young people recognize misinformation, investigate claims, understand AI-generated media and make better information decisions.",
    enter_battlefield: "Enter the Battlefield",
    test_literacy: "Test Your Media Literacy",
    free_use: "Free to use",
    no_data_sold: "No personal data sold",
    unesco_aligned: "Aligned with UNESCO MIL frameworks",
    the_problem_title: "The Problem",
    the_problem_heading: "Information is everywhere. Verification skills are not.",
    the_problem_desc: "Young people are navigating an information environment designed to exploit psychological biases — urgency, authority, social proof, and emotional manipulation. Traditional fact-checkers label content. They don't build skills.",
    problem_stat_1: "3.6B",
    problem_stat_1_lbl: "Social media users globally exposed to misinformation daily",
    problem_stat_2: "59%",
    problem_stat_2_lbl: "Of people share articles without reading beyond the headline",
    problem_stat_3: "6x",
    problem_stat_3_lbl: "Faster — how much quicker false news spreads than true news (MIT Study)",
    how_it_works: "How RealityOS Works",
    how_it_works_desc: "A complete learning loop that turns every mistake into targeted training.",
    loop_step_1: "Experience",
    loop_step_1_desc: "Encounter realistic misinformation in a simulated environment",
    loop_step_2: "Investigate",
    loop_step_2_desc: "Decompose claims, check sources, use lateral reading",
    loop_step_3: "Decide",
    loop_step_3_desc: "Make your verdict before the AI reveals its analysis",
    loop_step_4: "Learn",
    loop_step_4_desc: "Understand why you were right or why you got fooled",
    loop_step_5: "Adapt",
    loop_step_5_desc: "Your training adapts based on your weaknesses",
    loop_step_6: "Improve",
    loop_step_6_desc: "Track measurable growth from your baseline to today",
    vs_title: "RealityOS vs Traditional Fact-Checking",
    vs_desc: "Traditional checkers label news. RealityOS builds the skill to evaluate it yourself.",
    trad_title: "Traditional Fact Checking",
    trad_1: "Labels assertions as \"Fake\" or \"True\" — no tools to learn the reasoning",
    trad_2: "Breeds reliance on external algorithms rather than independent literacy",
    trad_3: "Dull text-heavy reports fail to engage feed-scrolling demographics",
    trad_4: "Cannot adapt to your specific cognitive vulnerabilities",
    ros_title: "The RealityOS Method",
    ros_1: "Asks \"Do you trust this?\" — trains active evaluation skills, not passive consumption",
    ros_2: "Maps atomic sub-claims, traces lateral sources, teaches visual deepfake tells",
    ros_3: "Tracks mistake patterns in real-time, feeding weak areas back into training paths",
    ros_4: "Pre/post assessments provide proof of measurable improvement",
    features_title: "Platform Features",
    features_desc: "Every feature answers: Can the user investigate? Can they understand why? Can they improve?",
    skills_title: "7 Media & Information Literacy Dimensions",
    skills_desc: "We measure and train competencies aligned with UNESCO MIL curriculum frameworks.",
    impact_title: "Measurable Impact",
    impact_desc: "RealityOS doesn't just feel educational. It measures it.",
    final_cta_heading: "Build your",
    final_cta_span: "Media Immunity",
    final_cta_desc: "RealityOS doesn't tell you what to believe. It teaches you how to decide.",
    footer_unesco: "Designed for youth media literacy education. Aligned with UNESCO MIL and digital citizenship frameworks. Not claiming UNESCO endorsement.",

    onboarding_step_1_title: "What should we call you?",
    onboarding_step_1_sub: "Choose a detective alias. This appears on the leaderboard.",
    onboarding_step_2_title: "Your campus",
    onboarding_step_2_sub: "Join your institution's team on the campus leaderboard.",
    onboarding_step_3_title: "Your media literacy experience",
    onboarding_step_3_sub: "This helps us calibrate your starting difficulty.",
    onboarding_placeholder: "E.g. TruthSleuth, MediaGuard42...",
    onboarding_continue: "Continue",
    onboarding_calibrating: "Calibrating Profile...",
    onboarding_start_diagnostic: "Start Media Literacy Diagnostic",
    onboarding_guest: "Continue as Guest →",
    onboarding_privacy: "Your data is used to personalize your training experience. We don't share personal information with third parties.",

    diagnostic_title: "MEDIA LITERACY DIAGNOSTIC",
    diagnostic_sub: "Assess your baseline skills across the 7 MIL dimensions. Takes 60-90 seconds.",
    diagnostic_loading: "Evaluating Responses & Building Profile...",
    diagnostic_submitting: "Submitting Profile...",
    diagnostic_complete: "DIAGNOSTIC COMPLETE",
    diagnostic_complete_desc: "Your media literacy baseline profile has been generated. Explore your personalized Media DNA dashboard.",
    diagnostic_see_profile: "See Your Media DNA Profile",

    arena_title: "REALITY ARENA",
    arena_sub: "Analyze scenarios, check tells, investigate resources, and decide your action.",
    arena_confidence: "How confident are you in your judgment?",
    arena_confidence_low: "Low confidence — investigate before deciding",
    arena_confidence_med: "Moderate confidence — proceed with caution",
    arena_confidence_high: "High confidence — make sure you have evidence",
    arena_trust: "Trust",
    arena_investigate: "Investigate",
    arena_ignore: "Ignore / Flag",
    arena_correct: "Evaluation Correct",
    arena_wrong: "Vulnerability Detected",
    arena_calibration: "Confidence Calibration",
    arena_calibration_high_correct: "Well-calibrated! High confidence matched a correct answer.",
    arena_calibration_low_correct: "Underconfident — you were right but didn't trust your instincts.",
    arena_calibration_high_wrong: "Overconfidence bias — you were highly confident but wrong. This is a key vulnerability.",
    arena_calibration_low_wrong: "Low confidence on a wrong answer. Study this scenario type more.",
    arena_calibration_med: "Correct with moderate confidence — keep building certainty.",
    arena_fooled_title: "Why Did You Get Fooled?",
    arena_fooled_desc: "Your decision was influenced by these cognitive biases:",
    arena_fooled_hint: "Recognizing these patterns is the first step to overcoming them. Your next challenge will focus on this skill.",
    arena_next_challenge: "Acquire Next Challenge",

    lab_title: "INVESTIGATION LAB",
    lab_sub: "Select an exercise to analyze manipulation or decompose viral media claims.",
    lab_tab_1: "Headline Manipulation Lab",
    lab_tab_2: "Sleuth AI Verification Engine",
    lab_raw_fact: "Raw Source Fact (Neutral)",
    lab_manipulated: "Manipulated Post (Viral)",
    lab_technique: "Technique",
    lab_quick_demos: "Quick Demos",
    lab_sleuth_input: "Input suspicious claim or URL",
    lab_sleuth_placeholder: "Paste text, news headline, or WhatsApp forward. E.g. 'Scientists say drinking coffee adds 10 years to lifespan'...",
    lab_sleuth_button: "Run Sleuth Decomposition Check",
    lab_sleuth_analyzing: "Analyzing Claim & Gathering RAG Evidence...",
    lab_verdict: "Evaluation Verdict",
    lab_confidence: "AI Verification Confidence",
    lab_decomposition: "Atomic Claim Decomposition",
    lab_graph: "RAG Evidence Connection Graph",
    lab_inspector: "Node Inspector",

    lead_title: "LEADERBOARD",
    lead_sub: "Compete with student investigators nationwide.",
    lead_campus_select: "Affiliated Campus",
    lead_tab_individual: "Individual Sleuths",
    lead_tab_campus: "Campus Standings",
    lead_rank: "Rank",
    lead_cumulative: "Cumulative",

    prof_title: "MEDIA DNA PROFILE",
    prof_sub: "Your personalized media literacy breakdown.",
    prof_level: "Level",
    prof_rank: "Discerning Status",
    prof_strength: "Your Strength",
    prof_weakness: "Your Weakness",
    prof_improved: "Most Improved",
    prof_recommended: "Recommended Training",
    prof_practice: "Practice",
    prof_breakdown: "MIL Skill Competency Breakdown",
    prof_baseline: "Baseline"
  },
  ur: {
    logo: "رئیلٹی او ایس",
    battlefield: "میدانِ جنگ",
    arena: "رئیلٹی اکھاڑہ",
    lab: "تحقیقاتی لیب",
    leaderboard: "لیڈر بورڈ",
    profile: "میڈیا ڈی این اے",
    educator: "ایجوکیٹر ڈیش بورڈ",
    loading: "لوڈ ہو رہا ہے...",
    streak: "روزانہ کا تسلسل",
    lvl: "لیول",
    xp_needed: "اگلے لیول کیلئے ایکس پی",
    back: "پیچھے",
    next: "آگے",
    submit: "جمع کریں",
    cancel: "منسوخ کریں",
    close: "بند کریں",
    save: "محفوظ کریں",
    edit: "ترمیم کریں",

    mil_prototype: "ایم آئی ایل-اے آئی پروٹوٹائپ",
    onboarding_title: "رئیلٹی او ایس رجسٹریشن",

    hero_title_1: "اپنے ذہن کی تربیت کریں",
    hero_title_2: "اس سے پہلے کہ الگورتھم",
    hero_title_3: "آپ کے ذہن کو کنٹرول کرے۔",
    hero_desc: "مصنوعی ذہانت (AI) سے لیس ایک جدید میڈیا خواندگی پلیٹ فارم جو نوجوانوں کو جھوٹی معلومات کی شناخت کرنے، دعووں کی تصدیق کرنے اور بہتر فیصلے کرنے میں مدد دیتا ہے۔",
    enter_battlefield: "میدانِ جنگ میں داخل ہوں",
    test_literacy: "میڈیا خواندگی کا امتحان لیں",
    free_use: "استعمال بالکل مفت ہے",
    no_data_sold: "ذاتی معلومات کا تحفظ",
    unesco_aligned: "یونیسکو (UNESCO) فریم ورک کے مطابق",
    the_problem_title: "مسئلہ",
    the_problem_heading: "معلومات ہر جگہ موجود ہے۔ تصدیق کرنے کی صلاحیتیں مفقود ہیں۔",
    the_problem_desc: "نوجوانوں کو ایک ایسے معلوماتی ماحول کا سامنا ہے جو ان کی نفسیاتی کمزوریوں — جلدی بازی، جھوٹی اتھارٹی، اور جذباتی ہیرا پھیری کا فائدہ اٹھاتا ہے۔ روایتی فیکٹ چیکرز صرف معلومات پر 'سچ' یا 'جھوٹ' کا لیبل لگاتے ہیں، وہ صلاحیتیں پیدا نہیں کرتے۔",
    problem_stat_1: "3.6 ارب",
    problem_stat_1_lbl: "سوشل میڈیا صارفین روزانہ غلط معلومات کا شکار ہوتے ہیں",
    problem_stat_2: "59%",
    problem_stat_2_lbl: "افراد سرخی سے آگے پڑھے بغیر معلومات شیئر کرتے ہیں",
    problem_stat_3: "6 گنا",
    problem_stat_3_lbl: "تیزی سے جھوٹی خبریں سچی خبروں کی نسبت پھیلتی ہیں (ایم آئی ٹی تحقیق)",
    how_it_works: "یہ کیسے کام کرتا ہے؟",
    how_it_works_desc: "سیکھنے کا ایک مکمل عمل جو ہر غلطی کو ایک تعلیمی سبق میں بدل دیتا ہے۔",
    loop_step_1: "تجربہ کریں",
    loop_step_1_desc: "مصنوعی ماحول میں حقیقت پسندانہ غلط معلومات کا سامنا کریں",
    loop_step_2: "تحقیق کریں",
    loop_step_2_desc: "دعووں کے ٹکڑے کریں، ذرائع کی جانچ کریں اور دیگر ذرائع سے تصدیق کریں",
    loop_step_3: "فیصلہ کریں",
    loop_step_3_desc: "مصنوعی ذہانت کے تجزیہ ظاہر کرنے سے پہلے اپنا فیصلہ درج کریں",
    loop_step_4: "سیکھیں",
    loop_step_4_desc: "سمجھیں کہ آپ کا فیصلہ کیوں درست تھا یا آپ کیوں دھوکہ کھا گئے",
    loop_step_5: "مطابقت پیدا کریں",
    loop_step_5_desc: "آپ کی کمزوریوں کی بنیاد پر تربیت خود بخود تبدیل ہو جاتی ہے",
    loop_step_6: "بہتری لائیں",
    loop_step_6_desc: "پہلے دن سے لے کر اب تک کی کارکردگی کا موازنہ کریں",
    vs_title: "رئیلٹی او ایس بمقابلہ روایتی فیکٹ چیکنگ",
    vs_desc: "روایتی چیکرز خبروں پر لیبل لگاتے ہیں۔ رئیلٹی او ایس آپ کو خود فیصلہ کرنے کی تربیت دیتا ہے۔",
    trad_title: "روایتی فیکٹ چیکنگ",
    trad_1: "دعووں پر 'جھوٹ' یا 'سچ' کا لیبل لگانا — استدلال سیکھنے کے اوزار نہیں ہوتے",
    trad_2: "صارف کو آزادانہ صلاحیت کے بجائے بیرونی الگورتھمز پر انحصار سکھانا",
    trad_3: "خشک اور تحریر سے بھرپور رپورٹس جو نئی نسل کو راغب کرنے میں ناکام رہتی ہیں",
    trad_4: "آپ کے مخصوص نفسیاتی تعصبات کے مطابق تبدیل نہیں ہو سکتی",
    ros_title: "رئیلٹی او ایس کا طریقہ کار",
    ros_1: "پوچھتا ہے \"کیا آپ کو اس پر بھروسہ ہے؟\" — فعال تجزیہ سکھاتا ہے",
    ros_2: "ذیلی دعووں کا نقشہ بناتا ہے، بیرونی ذرائع تلاش کرتا ہے، اور ڈیپ فیک کی نشانیاں سکھاتا ہے",
    ros_3: "غلطیوں کے پیٹرن کو ٹریک کرتا ہے اور ان کمزور صلاحیتوں کی زیادہ مشق کرواتا ہے",
    ros_4: "شروع اور آخر کی جانچ کے ذریعے کارکردگی میں واضح بہتری کا ثبوت دیتا ہے",
    features_title: "پلیٹ فارم کی خصوصیات",
    features_desc: "ہر فیچر کا مقصد: کیا صارف تحقیق کر سکتا ہے؟ کیا وہ اپنی غلطی سمجھ سکتا ہے؟ کیا وہ بہتری لا سکتا ہے؟",
    skills_title: "7 میڈیا اور معلوماتی خواندگی کے شعبے",
    skills_desc: "ہم یونیسکو کے ایم آئی ایل (MIL) نصاب کے مطابق صلاحیتوں کی پیمائش اور تربیت کرتے ہیں۔",
    impact_title: "پیمائش کے قابل نتائج",
    impact_desc: "رئیلٹی او ایس صرف تعلیمی احساس نہیں دیتا، بلکہ نتائج کی واضح پیمائش کرتا ہے۔",
    final_cta_heading: "اپنی",
    final_cta_span: "معلوماتی مدافعت",
    final_cta_desc: "رئیلٹی او ایس آپ کو یہ نہیں بتاتا کہ کس بات پر یقین کرنا ہے، بلکہ یہ سکھاتا ہے کہ خود فیصلہ کیسے کرنا ہے۔",
    footer_unesco: "نوجوانوں کے لیے میڈیا خواندگی کے نصاب کے مطابق تیار کردہ۔ یونیسکو ایم آئی ایل فریم ورک کے ہم آہنگ۔ یونیسکو کی تصدیق کا کوئی دعویٰ نہیں۔",

    onboarding_step_1_title: "ہم آپ کو کس نام سے پکاریں؟",
    onboarding_step_1_sub: "ایک جاسوسی عرفیت منتخب کریں۔ یہ لیڈر بورڈ پر نظر آئے گی۔",
    onboarding_step_2_title: "آپ کا کیمپس / یونیورسٹی",
    onboarding_step_2_sub: "ملک گیر کیمپس لیڈر بورڈ پر اپنے تعلیمی ادارے کی ٹیم میں شامل ہوں۔",
    onboarding_step_3_title: "میڈیا خواندگی کا تجربہ",
    onboarding_step_3_sub: "اس سے ہمیں آپ کی شروعاتی مشکل کی سطح مقرر کرنے میں مدد ملتی ہے۔",
    onboarding_placeholder: "مثال کے طور پر: FactSleuth، MediaGuard42...",
    onboarding_continue: "جاری رکھیں",
    onboarding_calibrating: "پروفائل کی ترتیب کی جا رہی ہے...",
    onboarding_start_diagnostic: "میڈیا خواندگی کا ٹیسٹ شروع کریں",
    onboarding_guest: "بغیر نام کے آگے بڑھیں ←",
    onboarding_privacy: "آپ کا ڈیٹا آپ کی تربیت کو بہتر بنانے کیلئے استعمال ہوتا ہے۔ ہم ذاتی معلومات کسی سے شیئر نہیں کرتے۔",

    diagnostic_title: "میڈیا خواندگی کا تشخیصی ٹیسٹ",
    diagnostic_sub: "تمام 7 معلوماتی جہتوں میں اپنی صلاحیتوں کا جائزہ لیں۔ صرف 60-90 سیکنڈ۔",
    diagnostic_loading: "جوابات کا تجزیہ اور پروفائل تیار کیا جا رہا ہے...",
    diagnostic_submitting: "پروفائل محفوظ کیا جا رہا ہے...",
    diagnostic_complete: "ٹیسٹ مکمل ہو گیا!",
    diagnostic_complete_desc: "آپ کے میڈیا خواندگی کا پروفائل تیار ہے۔ اپنے ذاتی نوعیت کے میڈیا ڈی این اے ڈیش بورڈ کا جائزہ لیں۔",
    diagnostic_see_profile: "میڈیا ڈی این اے پروفائل دیکھیں",

    arena_title: "رئیلٹی اکھاڑہ",
    arena_sub: "واقعات کا تجزیہ کریں، نشانیوں کی تصدیق کریں، شواہد تلاش کریں اور اپنا فیصلہ درج کریں۔",
    arena_confidence: "آپ کو اپنے فیصلے پر کتنا اعتماد ہے؟",
    arena_confidence_low: "کم اعتماد — فیصلہ کرنے سے پہلے مزید تحقیق کریں",
    arena_confidence_med: "درمیانہ اعتماد — احتیاط سے آگے بڑھیں",
    arena_confidence_high: "مکمل اعتماد — یقینی بنائیں کہ آپ کے پاس ثبوت موجود ہے",
    arena_trust: "بھروسہ کریں",
    arena_investigate: "تحقیق کریں",
    arena_ignore: "نظر انداز / رپورٹ کریں",
    arena_correct: "درست تجزیہ",
    arena_wrong: "نفسیاتی تعصب کی نشاندہی",
    arena_calibration: "اعتماد کی جانچ",
    arena_calibration_high_correct: "شاندار! آپ کا بھرپور اعتماد درست فیصلے کے عین مطابق تھا۔",
    arena_calibration_low_correct: "کم اعتمادی — آپ کا فیصلہ درست تھا لیکن آپ کو خود پر پورا بھروسہ نہیں تھا۔",
    arena_calibration_high_wrong: "ضرورت سے زیادہ اعتمادی — آپ کو پورا یقین تھا لیکن آپ کا فیصلہ غلط نکلا۔ یہ ایک اہم کمزوری ہے۔",
    arena_calibration_low_wrong: "غلط فیصلے پر کم اعتماد۔ اس نوعیت کے سوالات کی مزید مشق کریں۔",
    arena_calibration_med: "درمیانے اعتماد کے ساتھ درست فیصلہ — یقین کو مزید پختہ بنائیں۔",
    arena_fooled_title: "آپ دھوکہ کیوں کھا گئے؟",
    arena_fooled_desc: "آپ کا فیصلہ ان ذہنی تعصبات کے زیرِ اثر تھا:",
    arena_fooled_hint: "ان تعصبات کو پہچاننا ان پر قابو پانے کا پہلا قدم ہے۔ آپ کا اگلا چیلنج اسی صلاحیت پر مرکوز ہو گا۔",
    arena_next_challenge: "اگلا چیلنج حاصل کریں",

    lab_title: "تحقیقاتی لیب",
    lab_sub: "ہیرا پھیری کی شناخت کرنے یا خبروں کی تصدیق کرنے کیلئے مشق منتخب کریں۔",
    lab_tab_1: "سرخیوں میں ہیرا پھیری کی لیب",
    lab_tab_2: "سلوتھ اے آئی تصدیقی انجن",
    lab_raw_fact: "بنیادی حقیقت (غیر جانبدار)",
    lab_manipulated: "تبدیل شدہ پوسٹ (وائرل)",
    lab_technique: "تیکنیک",
    lab_quick_demos: "مثالی نمونے",
    lab_sleuth_input: "مشکوک دعویٰ یا لنک درج کریں",
    lab_sleuth_placeholder: "پوسٹ کا متن، خبر کی سرخی، یا واٹس ایپ فارورڈ پیسٹ کریں۔ مثلاً 'کافی پینے سے عمر میں 10 سال اضافہ ہوتا ہے'...",
    lab_sleuth_button: "سلوتھ تجزیہ شروع کریں",
    lab_sleuth_analyzing: "دعوے کا تجزیہ اور شواہد اکٹھے کیے جا رہے ہیں...",
    lab_verdict: "حتمی فیصلہ",
    lab_confidence: "اے آئی تصدیقی اعتماد",
    lab_decomposition: "بنیادی دعووں کے ٹکڑے",
    lab_graph: "شواہد کا گراف",
    lab_inspector: "نوڈ انسپکٹر",

    lead_title: "لیڈر بورڈ",
    lead_sub: "ملک بھر کے ساتھی طالب علموں سے مقابلہ کریں۔",
    lead_campus_select: "وابستہ کیمپس / یونیورسٹی",
    lead_tab_individual: "انفرادی تفتیش کار",
    lead_tab_campus: "کیمپس کی رینکنگ",
    lead_rank: "درجہ",
    lead_cumulative: "مجموعی سکور",

    prof_title: "میڈیا ڈی این اے پروفائل",
    prof_sub: "آپ کی میڈیا خواندگی کا مکمل اور تفصیلی تجزیہ۔",
    prof_level: "لیول",
    prof_rank: "تفتیشی درجہ",
    prof_strength: "آپ کی طاقت",
    prof_weakness: "آپ کی کمزوری",
    prof_improved: "سب سے زیادہ بہتری",
    prof_recommended: "تجویز کردہ مشق",
    prof_practice: "مشق شروع کریں",
    prof_breakdown: "صلاحیتوں کی تفصیلات",
    prof_baseline: "ابتدائی سکور"
  }
};
