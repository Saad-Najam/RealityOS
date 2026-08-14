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
  groundTruthVerdict: 'TRUST' | 'MISLEADING' | 'FABRICATED';
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
  biasesTriggered?: string[];
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
    groundTruthVerdict: "FABRICATED",
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
    groundTruthVerdict: "FABRICATED",
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
    groundTruthVerdict: "FABRICATED",
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
    groundTruthVerdict: "MISLEADING",
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
    groundTruthVerdict: "MISLEADING",
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
    groundTruthVerdict: "FABRICATED",
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
    groundTruthVerdict: "MISLEADING",
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
    groundTruthVerdict: "FABRICATED",
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
    title: "Official Meteorological Department Alert",
    category: "source_literacy",
    difficulty: "easy",
    format: "X_POST",
    sender: "PakMetDept (Verified)",
    content: "⚠️ WEATHER ADVISORY: A strong dust storm followed by moderate to heavy rainfall is expected across Karachi and coastal areas of Sindh tonight. Citizens are advised to secure loose structures and avoid unnecessary travel. Stay safe! ⛈️",
    correctAction: "TRUST",
    groundTruthVerdict: "TRUST",
    learningObjective: "Recognize verified official weather alerts and understand when to trust timely warning sources.",
    manipulationType: "None (Verified Source)",
    explanation: "This is an official advisory posted by the Pakistan Meteorological Department's verified handle. In times of urgent weather warnings, verified primary agency channels should be trusted and followed immediately for safety.",
    skill: "Source Verification",
    xp: 100,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Heavy rain advisory", type: "claim", description: "Official Meteorological department announces incoming storm." },
        { id: "s1", label: "Verified Met Office Account", type: "source", description: "The post originates from the official verified meteorological agency handle." },
        { id: "e1", label: "Corroboration: Major News Outlets", type: "evidence", status: "verified", description: "Dawn and Express Tribune are running live weather alerts corroborating the same advisory." },
        { id: "v1", label: "Verdict: Authentic Warning", type: "verdict", status: "verified", description: "The advisory is authentic and originates from the primary authorized meteorological source." }
      ],
      edges: [
        { from: "s1", to: "c1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "supports" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    }
  },
  {
    id: 10,
    title: "Official Academic Portal Extension Notice",
    category: "source_literacy",
    difficulty: "easy",
    format: "NEWS_HEADLINE",
    sender: "FAST University Registrar Office",
    content: "📢 Spring Registration Fee Payment deadline has been extended to Friday, 20th August. Eligible students can download their updated fee challan from the official slate portal.",
    correctAction: "TRUST",
    groundTruthVerdict: "TRUST",
    learningObjective: "Acknowledge official academic portal communications and understand verified extension alerts.",
    manipulationType: "None (Verified Channel)",
    explanation: "This is a real administrative notification posted directly on the verified university portal. Since it links to the primary university portal, it should be trusted rather than dismissed as a rumor.",
    skill: "Source Verification",
    xp: 100,
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Registration deadline extended", type: "claim", description: "Registrar office extended payment deadline." },
        { id: "s1", label: "Official Academic Portal", type: "source", description: "FAST academic portal system." },
        { id: "e1", label: "Challan download system active", type: "evidence", status: "verified", description: "The portal's fee section shows the new deadline dates and active challan prints." },
        { id: "v1", label: "Verdict: Official Directive", type: "verdict", status: "verified", description: "The extension is true and verified directly via the school's primary administrative database." }
      ],
      edges: [
        { from: "s1", to: "c1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "supports" },
        { from: "e1", to: "v1", relationship: "resolves" }
      ]
    }
  },
  {
    id: 11,
    title: "The Fake International Scholarship",
    category: "source_literacy",
    difficulty: "medium",
    format: "WHATSAPP_FORWARD",
    sender: "University Group Chat",
    content: "🎓 AMAZING OPPORTUNITY! Apply now for the Global Youth Leader Scholarship 2026! Full funding, €25,000 stipend, flight covered! Only 72 hours left to apply via the link. Forwarded from: Scholarship Pakistan Group.",
    correctAction: "IGNORE",
    groundTruthVerdict: "FABRICATED",
    learningObjective: "Recognize fake scholarship scams using urgency, vague sponsor names, and no verifiable official source.",
    manipulationType: "Scarcity + Authority Bias",
    explanation: "Legitimate scholarships from recognized institutions do not circulate exclusively via WhatsApp forwards with 72-hour windows. There is no verifiable sponsoring body, no official application portal URL, and the financial figures are inconsistent with any known 2026 scholarship programs.",
    skill: "Source Verification",
    xp: 150,
    biasesTriggered: ["Scarcity Bias", "Authority Bias", "FOMO (Fear of Missing Out)"],
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Real scholarship opportunity", type: "claim", description: "WhatsApp chain message claiming full scholarship." },
        { id: "s1", label: "Source: 'Scholarship Pakistan Group'", type: "source", description: "Anonymous forwarding chain — no verifiable institution." },
        { id: "e1", label: "Evidence: No official portal found", type: "evidence", status: "contradicts", description: "Searching 'Global Youth Leader Scholarship 2026' returns no official program page from any government or foundation." }
      ],
      edges: [
        { from: "s1", to: "c1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" }
      ]
    }
  },
  {
    id: 12,
    title: "The Misleading 90% Statistic",
    category: "misinformation",
    difficulty: "medium",
    format: "INSTAGRAM_CARD",
    sender: "EduFacts_Daily",
    content: "📊 NEW STUDY: 90% of students say their mental health has been permanently destroyed by smartphones! Put down your phone and read a book! Share to spread awareness. Source: 'Student Mental Health Institute 2024'",
    correctAction: "IGNORE",
    groundTruthVerdict: "MISLEADING",
    learningObjective: "Identify missing statistical context: sample size, methodology, exact question wording, and cherry-picked framing.",
    manipulationType: "Cherry-Picking + Misleading Statistics",
    explanation: "The statistic distorts a real survey. The original study asked 'Do you sometimes feel your screen time affects your mood?' — not whether phones 'permanently destroy' mental health. The 90% figure is accurate but the conclusion and framing are a dramatic exaggeration with no causal evidence.",
    skill: "Statistical Literacy",
    xp: 150,
    biasesTriggered: ["Availability Bias", "Emotional Appeal"],
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: 90% mental health destroyed", type: "claim", description: "Viral infographic making extreme causal claims." },
        { id: "s1", label: "Source: Student Mental Health Inst.", type: "source", description: "Real organization — but the post misquotes their findings." },
        { id: "e1", label: "Evidence: Original survey methodology", type: "evidence", status: "contradicts", description: "The question asked about mood effects, not permanent damage. The '90%' is technically accurate but grossly misrepresented." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" }
      ]
    }
  },
  {
    id: 13,
    title: "The Old Photo Presented as Current",
    category: "context",
    difficulty: "medium",
    format: "X_POST",
    sender: "@BreakingAlerts_PK",
    content: "JUST IN: Massive flood waters have reached the center of Lahore today! Citizens should evacuate immediately! Photo from the scene right now. RT urgently!",
    correctAction: "IGNORE",
    groundTruthVerdict: "MISLEADING",
    learningObjective: "Use reverse image search to verify that a photo is current and from the claimed location.",
    manipulationType: "False Temporal Context (Old Media)",
    explanation: "A reverse image search reveals this photo was taken during the 2010 Pakistan floods, not today. The image is real but presented with completely false temporal and geographic context. This is a common manipulation technique during disaster events to amplify panic.",
    skill: "Lateral Reading",
    xp: 175,
    biasesTriggered: ["Availability Bias", "Urgency Bias", "Emotional Outrage"],
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Current Lahore flooding today", type: "claim", description: "Account claiming photo is from today's flood emergency." },
        { id: "s1", label: "Reverse Image Search Result", type: "source", description: "Google Lens reverse search of uploaded image." },
        { id: "e1", label: "Evidence: Image from 2010 floods", type: "evidence", status: "contradicts", description: "Multiple news archives from 2010 contain identical image tagged in Sindh, not Lahore 2026." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" }
      ]
    }
  },
  {
    id: 14,
    title: "Viral WhatsApp Sugar Warning",
    category: "misinformation",
    difficulty: "easy",
    format: "WHATSAPP_FORWARD",
    sender: "Family Group",
    content: "⚠️ VERY IMPORTANT HEALTH WARNING ⚠️ Doctors at Aga Khan Hospital have discovered that combining sugarcane juice with any dairy product causes fatal liver failure within hours. Please share with all your contacts immediately. Forwarded from Dr. Waqas Khawaja.",
    correctAction: "IGNORE",
    groundTruthVerdict: "FABRICATED",
    learningObjective: "Recognize fabricated health warnings that use false authority, urgency, and unverifiable expert attribution.",
    manipulationType: "Authority Spoofing + Health Fear Appeal",
    explanation: "Aga Khan Hospital has issued no such advisory. 'Dr. Waqas Khawaja' is not a registered health official at the hospital. The medical claim is nutritionally baseless — no peer-reviewed research supports a fatal interaction between sugarcane juice and dairy. This is a common viral health scare format.",
    skill: "Source Verification",
    xp: 100,
    biasesTriggered: ["Authority Bias", "Fear Appeal", "Social Proof"],
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: Juice+dairy causes liver failure", type: "claim", description: "Health scare chain message." },
        { id: "s1", label: "Source: Aga Khan Hospital (Spoofed)", type: "source", description: "Name-dropped without verification." },
        { id: "e1", label: "AKH confirms no such advisory", type: "evidence", status: "contradicts", description: "Aga Khan Hospital media office confirmed no such statement was ever issued." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" }
      ]
    }
  },
  {
    id: 15,
    title: "The Clickbait Science Headline",
    category: "misinformation",
    difficulty: "hard",
    format: "NEWS_HEADLINE",
    sender: "ScienceToday.net",
    content: "BREAKTHROUGH: Scientists FINALLY Confirm That Sleeping Less Than 4 Hours Makes You 340% More Likely To Get Dementia — Experts Say This Changes Everything About Modern Sleep",
    correctAction: "INVESTIGATE",
    groundTruthVerdict: "MISLEADING",
    learningObjective: "Distinguish between exaggerated science headlines and actual research findings by checking sample size, relative vs absolute risk, and original study source.",
    manipulationType: "Statistical Exaggeration + Clickbait Headline",
    explanation: "A real University College London study (2021, n=7,959) found associations between sleep deprivation and cognitive decline. However, the '340% more likely' figure is a relative risk misrepresentation. The absolute risk increase is far smaller. The word 'FINALLY' implies false scientific consensus, and 'changes everything' is editorial hyperbole not found in the original paper.",
    skill: "Statistical Literacy",
    xp: 200,
    biasesTriggered: ["Authority Bias", "Confirmation Bias"],
    evidenceGraph: {
      nodes: [
        { id: "c1", label: "Claim: 4hr sleep = 340% dementia risk", type: "claim", description: "Sensationalized health headline." },
        { id: "s1", label: "Source: UCL Research (Tier 1 Academic)", type: "source", description: "Actual peer-reviewed longitudinal study." },
        { id: "e1", label: "Evidence: Relative vs Absolute Risk", type: "evidence", status: "contradicts", description: "The actual absolute risk increase was far more modest. Relative risk figures inflate the perceived danger significantly." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" }
      ]
    },
    lateralSearchQuery: "UCL sleep deprivation dementia study 2021 original findings",
    lateralClues: [{
      question: "What did the original UCL study actually conclude about sleep and dementia?",
      options: [
        "Sleeping under 4 hours definitely causes dementia with 340% certainty",
        "There is a statistical association between chronic sleep deprivation and cognitive decline, but causation was not established and absolute risk differences are small",
        "The study proved that all adults need exactly 8 hours of sleep or they will develop dementia"
      ],
      correctIndex: 1,
      explanation: "Scientific studies often show correlations, not causations. Relative risk figures are routinely misrepresented in popular media to create alarming headlines."
    }]
  }
];
