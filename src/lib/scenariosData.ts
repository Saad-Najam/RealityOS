export interface TellItem {
  id: string;
  elementId: string; // DOM element ID to highlight
  label: string;
  description: string;
  x: number; // Percent coordinates for overlays
  y: number;
}

export interface EvidenceNode {
  id: string;
  label: string;
  type: 'claim' | 'source' | 'evidence' | 'context' | 'verdict';
  status?: 'supports' | 'contradicts' | 'neutral' | 'misleading' | 'verified';
  description: string;
}

export interface EvidenceEdge {
  from: string;
  to: string;
  relationship: 'supports' | 'contradicts' | 'details' | 'resolves';
}

export interface Scenario {
  id: number;
  title: string;
  category: 'misinformation' | 'manipulation' | 'source_literacy' | 'ai_literacy' | 'context' | 'social_media';
  difficulty: 'easy' | 'medium' | 'hard';
  format: 'X_POST' | 'WHATSAPP_FORWARD' | 'INSTAGRAM_CARD' | 'NEWS_HEADLINE';
  sender?: string;
  senderAvatar?: string;
  content: string;
  mediaUrl?: string;
  correctAction: 'TRUST' | 'SHARE' | 'INVESTIGATE' | 'IGNORE';
  learningObjective: string;
  manipulationType?: string;
  explanation: string;
  skill: 'Source Verification' | 'Bias Detection' | 'Deepfake Awareness' | 'Emotional Manipulation' | 'Statistical Literacy' | 'Lateral Reading' | 'AI Literacy';
  xp: number;
  tells?: TellItem[];
  evidenceGraph?: {
    nodes: EvidenceNode[];
    edges: EvidenceEdge[];
  };
  lateralSearchQuery?: string;
  lateralClues?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Urgent University Holiday Notification",
    category: "source_literacy",
    difficulty: "easy",
    format: "WHATSAPP_FORWARD",
    sender: "Chacha Shakeel (Family Group)",
    content: "🚨 URGENT: Government announces tomorrow as a public holiday. All universities, including FAST, NED, and IBA will remain closed. Exams are postponed! Forward to all groups!",
    correctAction: "INVESTIGATE",
    learningObjective: "Identify unverified WhatsApp forwards and practice cross-referencing with official university channels.",
    manipulationType: "Urgency and Fake Authority",
    explanation: "Sensational holiday notices circulating in WhatsApp groups are often fabricated. The correct first action is to search for confirmation on the university's official website or official social media accounts rather than sharing it blindly.",
    skill: "Source Verification",
    xp: 100,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: University Closed Tomorrow", type: "claim", description: "Government declared holiday and exams are postponed." },
        { id: "s1", label: "Source: WhatsApp Forward", type: "source", description: "Unverified viral forward in a family chat group." },
        { id: "s2", label: "Official Web Portal", type: "source", description: "FAST/NED University official announcement section." },
        { id: "e1", label: "Evidence: No notification listed", type: "evidence", status: "contradicts", description: "The official academic portal contains no announcements regarding holiday or postponements." },
        { id: "v1", label: "Verdict: Fabricated", type: "verdict", status: "misleading", description: "The claim is false. Rumors are spreading due to lack of verification." }
      ],
      edges: [
        { from: "s1", to: "c1", relationship: "details" },
        { from: "s2", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    },
    lateralSearchQuery: "FAST University official exam announcements tomorrow",
    lateralClues: [
      {
        question: "When you open a new tab to verify this claim, what should you look for first?",
        options: [
          "The university's official verified portal (.edu.pk or verified handle)",
          "An article on a local news blog site",
          "Comment section of a student discussion forum"
        ],
        correctIndex: 0,
        explanation: "Primary, official sources are Tier 1 evidence. Student forums or news blogs are Tier 5 and can propagate unverified claims."
      }
    ]
  },
  {
    id: 2,
    title: "The Pope Balenciaga Deepfake",
    category: "ai_literacy",
    difficulty: "medium",
    format: "INSTAGRAM_CARD",
    sender: "TrendyFeed",
    content: "Pope Francis spotted breaking the internet in a customized white designer puffer coat on the streets of Rome! 🧥🔥 #pope #fashion #style #streetwear",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", // placeholder abstraction
    correctAction: "INVESTIGATE",
    learningObjective: "Examine physical and lighting inconsistencies in AI-generated photos.",
    manipulationType: "AI Image Generation",
    explanation: "This viral image is entirely synthetic, created by Midjourney. Key visual tells include the blurry edge of the Pope's glasses, the strap of the handbag blending into his collar, and reflection mismatch in the eyes.",
    skill: "Deepfake Awareness",
    xp: 150,
    tells: [
      { id: "t1", elementId: "hand-area", label: "🖐️ Hand Asymmetry", description: "The hand clutching the coffee cup is poorly defined, and fingers appear melted.", x: 45, y: 70 },
      { id: "t2", elementId: "glasses-area", label: "👓 Glasses Frame Distortion", description: "The shadow of the glasses does not line up with the bridge of the nose and the lens edges are blurry.", x: 50, y: 35 },
      { id: "t3", elementId: "zipper-area", label: "🪞 Zipper Geometry", description: "The zipper pull splits into two separate tracks that fail to mesh correctly.", x: 48, y: 55 }
    ],
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Pope Wearing Balenciaga", type: "claim", description: "Photos show Pope Francis wearing a luxury puffer jacket in public." },
        { id: "s1", label: "Independent Fact-Checkers", type: "source", description: "Snopes and Reuters Fact Check reports." },
        { id: "e1", label: "AI Image Tagging", type: "evidence", status: "contradicts", description: "Original publisher posted this image on a Reddit forum for Midjourney art." },
        { id: "v1", label: "Verdict: AI-Generated", type: "verdict", status: "misleading", description: "Synthesized using generative AI tools." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    }
  },
  {
    id: 3,
    title: "Leaked Politician Voice Recording",
    category: "ai_literacy",
    difficulty: "hard",
    format: "X_POST",
    sender: "AnonymousVoice_PK",
    content: "🔥 LEAKED AUDIO: Leading politician admits to rigging local university campus elections in private phone call. The truth is finally out! Listen before they take this down! 🔊👇",
    correctAction: "INVESTIGATE",
    learningObjective: "Understand that audio clips can be cloned and that AI voice detection requires metadata and context checking.",
    manipulationType: "Synthetic Speech (AI Voice Clone)",
    explanation: "Voice clones can be generated with under 5 seconds of sample audio. This clip has metallic digital artifacts, lacks natural breath pauses, and has perfectly flat intonation. Always wait for trusted audio-forensic verification.",
    skill: "AI Literacy",
    xp: 200,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Rigging Confession Audio", type: "claim", description: "A voice recording captures a politician confessing to election manipulation." },
        { id: "s1", label: "Audio Forensic Analysis", type: "source", description: "Independent speech labs analyze acoustic fingerprints." },
        { id: "e1", label: "Spectrogram Artifacts", type: "evidence", status: "contradicts", description: "Spectrogram shows metallic robotic frequency cutoffs typical of voice synthesis engines." },
        { id: "v1", label: "Verdict: Voice Clone", type: "verdict", status: "misleading", description: "Fabricated using deep voice synthesis." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    },
    lateralSearchQuery: "Politician rigging voice recording analysis fact-check",
    lateralClues: [
      {
        question: "What is an acoustic sign that an audio file is AI-generated?",
        options: [
          "Perfect studio quality with high bass",
          "Lack of ambient background noises, robotic breathing pauses, and metallic static artifacts",
          "Occasional background wind noise"
        ],
        correctIndex: 1,
        explanation: "AI voice cloning models often fail to capture organic breathing rhythms and produce synthetic metallic digital compression signatures."
      }
    ]
  },
  {
    id: 4,
    title: "Coffee Longevity Headline",
    category: "manipulation",
    difficulty: "easy",
    format: "NEWS_HEADLINE",
    sender: "DailyHealthUpdates",
    content: "☕ BREAKING STUDY: Drinking coffee adds 10 years to your lifespan! Double up your espresso intake starting today to live forever!",
    correctAction: "INVESTIGATE",
    learningObjective: "Distinguish between actual science and exaggerated clickbait reporting.",
    manipulationType: "Exaggerated Claims / Cherry-picking",
    explanation: "This headline exaggerates the findings of an observational study. The actual research only found a mild correlation between moderate coffee consumption and a minor decrease in mortality risk, but did not prove causality or imply a 10-year lifespan boost.",
    skill: "Statistical Literacy",
    xp: 100,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Coffee adds 10 years to life", type: "claim", description: "Exaggerated news report on longevity study." },
        { id: "s1", label: "Primary Academic Study", type: "source", description: "New England Journal of Medicine research paper." },
        { id: "e1", label: "Actual findings: Correlation only", type: "evidence", status: "contradicts", description: "The study showed a 10-15% reduced risk of death over a 12-year window for coffee drinkers, not a 10-year extension of lifespan." },
        { id: "v1", label: "Verdict: Misleading Headline", type: "verdict", status: "misleading", description: "Research exists but the claim exaggerates the scale and type of findings." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    },
    lateralSearchQuery: "New England Journal of Medicine coffee mortality study actual findings",
    lateralClues: [
      {
        question: "What is the key scientific difference between 'correlation' and 'causality' in this scenario?",
        options: [
          "Correlation means coffee definitely causes longer life, while causality is just a theory",
          "Correlation means coffee drinkers and long lifespans tend to occur together, but it could be due to other factors (like income or diet). Causality proves coffee is the direct cause.",
          "They mean exactly the same thing in medical trials"
        ],
        correctIndex: 1,
        explanation: "Observational studies only show associations. Proving that coffee *causes* longevity requires controlling all other lifestyle variables, which this study did not do completely."
      }
    ]
  },
  {
    id: 5,
    title: "Empty Supermarket Shelves Photo",
    category: "context",
    difficulty: "medium",
    format: "X_POST",
    sender: "PatriotPatrol99",
    content: "⚠️ THIS IS WHAT'S HAPPENING UNDER THE NEW GOVERNMENT! Look at our supermarkets. Completely stripped of basic supplies. Total economic disaster! 🛒😡 #inflation #collapse",
    mediaUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop", // generic placeholder
    correctAction: "INVESTIGATE",
    learningObjective: "Recognize when an authentic, unaltered image is repackaged in a false context to create a political narrative.",
    manipulationType: "False Context (Out-of-date media)",
    explanation: "The photo is real, but it was taken in 2020 during the early panic-buying phase of the COVID-19 pandemic in a different country, not under the current government or region claimed by the poster.",
    skill: "Lateral Reading",
    xp: 120,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Current local supply collapse", type: "claim", description: "Images show grocery stores running empty right now." },
        { id: "s1", label: "Reverse Image Search", type: "source", description: "Google Lens or TinEye search engine." },
        { id: "e1", label: "Original source: 2020 pandemic", type: "evidence", status: "contradicts", description: "Image matches news article from March 2020 regarding toilet paper shortages in London." },
        { id: "v1", label: "Verdict: Decontextualized", type: "verdict", status: "misleading", description: "Real photo utilized in an entirely false, misleading time/place context." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    },
    lateralSearchQuery: "Reverse search empty store shelves image covid 2020",
    lateralClues: [
      {
        question: "Which tool is best for verifying when and where an online photo originally appeared?",
        options: [
          "Ask an AI chatbot to describe the photo",
          "Reverse Image Search (like Google Lens, TinEye, or Yandex)",
          "Read the comment section of the post"
        ],
        correctIndex: 1,
        explanation: "Reverse Image Search traces the history of the image file across the web, exposing when it was first indexed."
      }
    ]
  },
  {
    id: 6,
    title: "Free Laptops Scholarship Scam",
    category: "source_literacy",
    difficulty: "easy",
    format: "WHATSAPP_FORWARD",
    sender: "Ami (Family Group)",
    content: "🎓 Higher Education Commission laptop scheme reopened! Free laptops with 5G internet for all Pakistani students. Claim your free laptop today before registration closes! Apply here: http://hec-laptops.gov-registration-portal.net/",
    correctAction: "IGNORE",
    learningObjective: "Analyze URL structure to detect phishing and scam domains masquerading as official government resources.",
    manipulationType: "Phishing / Domain Spoofing",
    explanation: "Official government websites in Pakistan end with `.gov.pk`. The domain `gov-registration-portal.net` is a private, unsecure website designed to steal personal information by imitating government branding.",
    skill: "Source Verification",
    xp: 110,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: HEC offering free laptops", type: "claim", description: "WhatsApp link promises free educational equipment." },
        { id: "s1", label: "Whois Domain Directory", type: "source", description: "Public domain registrar registry lookup." },
        { id: "e1", label: "Registrar Data: Domain Fake", type: "evidence", status: "contradicts", description: "Registered 3 days ago by an anonymous user in a different country." },
        { id: "v1", label: "Verdict: Phishing Scam", type: "verdict", status: "misleading", description: "A malicious link designed to collect student emails and passwords." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    }
  },
  {
    id: 7,
    title: "Terrorizing News Alert",
    category: "manipulation",
    difficulty: "medium",
    format: "NEWS_HEADLINE",
    sender: "TruthBombNews",
    content: "🚨 WORLD HEALTH SCHEMERS ARE SECRETLY PREPARING THE NEXT LOCKDOWN! PREPARE YOUR FAMILIES FOR GLOBAL INCARCERATION!",
    correctAction: "IGNORE",
    learningObjective: "Recognize fearmongering and clickbait headline styles designed to trigger visceral panic.",
    manipulationType: "Emotional Manipulation (Fearmongering)",
    explanation: "This headline uses screaming capital letters, alarming trigger words ('SCHEMERS', 'INCARCERATION'), and offers zero source references. Its purpose is to trigger fear and anxiety to drive clicks.",
    skill: "Emotional Manipulation",
    xp: 100,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Secret lockdown scheduled", type: "claim", description: "A threat alert warning of global confinement." },
        { id: "s1", label: "Official Health Organ Reports", type: "source", description: "WHO and national ministry of health advisories." },
        { id: "e1", label: "Zero actual alerts", type: "evidence", status: "contradicts", description: "No official plans exist for lockdown; current focus is standard surveillance." },
        { id: "v1", label: "Verdict: Clickbait Panic", type: "verdict", status: "misleading", description: "Sensationalized headline relying on fear appeals to gather traffic." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    }
  },
  {
    id: 8,
    title: "Lemon Peels Cure Cancer",
    category: "misinformation",
    difficulty: "medium",
    format: "WHATSAPP_FORWARD",
    sender: "Group Admin",
    content: "🍋 Lemon Peels are 10,000 times stronger than chemotherapy! They kill cancer cells while leaving healthy cells intact. Keep this secret safe from Big Pharma. Share to save lives! 🙏💚",
    correctAction: "INVESTIGATE",
    learningObjective: "Evaluate pseudo-medical claims and look for clinical evidence rather than anonymous conspiracy theories.",
    manipulationType: "Pseudo-Science",
    explanation: "This claim dates back to email hoaxes from 2011. While lemons contain antioxidants, there is zero clinical scientific evidence proving lemon peels cure cancer or outperform oncology drugs.",
    skill: "Bias Detection",
    xp: 130,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Lemon peels cure cancer", type: "claim", description: "Citrus peel compound kills cancer 10000x better than chemo." },
        { id: "s1", label: "Cancer Research Organizations", type: "source", description: "Clinical oncology databases and research journals." },
        { id: "e1", label: "No human trials exist", type: "evidence", status: "contradicts", description: "Limited laboratory studies showed limonene kills some cells in test tubes, but it does not translate to human cures." },
        { id: "v1", label: "Verdict: Fake Medical Hoax", type: "verdict", status: "misleading", description: "Exaggerated laboratory test tube research turned into a dangerous conspiracy theory." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    },
    lateralSearchQuery: "Lemon peel cancer cure research fact-check",
    lateralClues: [
      {
        question: "Why does the phrase 'Big Pharma is hiding this' serve as a red flag?",
        options: [
          "It is a logical proof that the claim is true",
          "It uses a conspiracy narrative to deflect the lack of clinical scientific evidence",
          "It shows the author works for a university"
        ],
        correctIndex: 1,
        explanation: "Conspiracy narratives are frequently used in alternative medicine hoaxes to explain away why medical institutions do not support their claims."
      }
    ]
  },
  {
    id: 9,
    title: "University Exam Postponed Screenshot",
    category: "source_literacy",
    difficulty: "medium",
    format: "WHATSAPP_FORWARD",
    sender: "Class Rep (CR)",
    content: "Hey guys, just received this official notification from FAST University admin. Tomorrow's final exam is canceled! Pls confirm if this is true.",
    mediaUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop", // school background placeholder
    correctAction: "INVESTIGATE",
    learningObjective: "Recognize elements of photoshopped institutional notifications (fonts, date alignments).",
    manipulationType: "Forged Screenshot",
    explanation: "Forged screenshots are commonly created in minutes using inspect-element or image editors. Always verify directly through the official student portal rather than relying on image forwards.",
    skill: "Source Verification",
    xp: 140,
    tells: [
      { id: "t1", elementId: "font-mismatch", label: "📝 Font Inconsistency", description: "The font for the date does not match the font utilized in the body of the notification.", x: 20, y: 15 },
      { id: "t2", elementId: "logo-blurry", label: "🏢 Blurry Institutional Logo", description: "The logo has high compression artifacts around its borders, suggesting it was copy-pasted onto a fake canvas.", x: 10, y: 10 },
      { id: "t3", elementId: "signature-flat", label: "✍️ Floating Signature", description: "The registrar's signature has a white background block that clips over the footer borders.", x: 80, y: 80 }
    ],
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: University exam postponed", type: "claim", description: "A circulated screenshot of a cancellation memo." },
        { id: "s1", label: "Registrar Office Notice Board", type: "source", description: "Official registrar channel or official portal account." },
        { id: "e1", label: "Memo missing from official board", type: "evidence", status: "contradicts", description: "The registrar website does not list any such postponement memo for today." },
        { id: "v1", label: "Verdict: Forged Screenshot", type: "verdict", status: "misleading", description: "A photoshopped notification created to spread panic/confusion among students." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    }
  },
  {
    id: 10,
    title: "The 200% Crime Spike",
    category: "manipulation",
    difficulty: "hard",
    format: "X_POST",
    sender: "KarachiWatchdog",
    content: "📊 CRITICAL DATA: Criminal incidents in this university sector have spiked by a shocking 200% this month alone under the new campus security chief! Resign now! 📉❌ #security #fail",
    correctAction: "INVESTIGATE",
    learningObjective: "Spot manipulation in small sample sizes where percentages exaggerate low absolute numbers.",
    manipulationType: "Statistical Manipulation (Small Sample Bias)",
    explanation: "A '200% spike' sounds catastrophic, but in a small dataset it can represent a move from 1 incident to 3. This is statistical cherry-picking to construct a biased narrative.",
    skill: "Statistical Literacy",
    xp: 180,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Crime spiked by 200%", type: "claim", description: "Post claims campus security has catastrophically failed." },
        { id: "s1", label: "Police & Security Records", type: "source", description: "Official crime reports of the sector." },
        { id: "e1", label: "Absolute numbers: 1 to 3 incidents", type: "evidence", status: "contradicts", description: "Record shows crimes went from 1 case last month to 3 cases this month. A change of 2 incidents total." },
        { id: "v1", label: "Verdict: Misleading Statistics", type: "verdict", status: "misleading", description: "The math is technically correct but the percentages distort the reality due to the tiny sample size." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    },
    lateralSearchQuery: "Sector security crime report statistics absolute numbers",
    lateralClues: [
      {
        question: "Why is presenting percentages without absolute numbers misleading?",
        options: [
          "Because percentages are always false",
          "It hides the actual scale of the data, making small, random changes look like massive trends",
          "It makes it harder to calculate mathematical averages"
        ],
        correctIndex: 1,
        explanation: "In tiny sample sizes (like 1 to 3), percentages explode, leading readers to believe a massive surge occurred when it was actually a minor statistical fluctuation."
      }
    ]
  }
];
