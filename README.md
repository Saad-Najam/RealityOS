# RealityOS
> **Train your mind before the algorithm trains it for you.**
> Flagship submission for the UNESCO AI & Media Literacy Youth Hackathon.

RealityOS is a personal media-literacy training, evaluation, and verification platform designed for youth and social media consumers. Rather than acting as a simple fact-checker, RealityOS is built around a core philosophy: **AI should not decide what people believe—AI should teach people how to decide what to believe.**

---

## 🚀 Flagship Features

### 🥇 1. Information Battlefield (Crisis Simulator)
* **Real-time Crisis Simulation:** Drops the user into a simulated breaking news feed (e.g. a localized earthquake) under a 90-second countdown.
* **Ecosystem Analysis:** Evaluates posts from bots, sponsored clickbait, spoofed officials, and authentic local citizens.
* **Cognitive Vulnerability Mapping:** Breaks down how many manipulation traps the user fell for (such as *Urgency Bias*, *Authority Spoofing*, or *Bandwagon Heuristics*).

### 🧬 2. Media DNA (Measurable Impact Tracking)
* **Baseline Calibration:** Captures an un-gameable snapshot of initial skill scores immediately after the onboarding diagnostic test.
* **Dynamic radar Chart:** Renders a 7-axis competency layout across MIL metrics (Source Verification, Bias Detection, Deepfake Awareness, Emotional Logic, Stats Literacy, Lateral Reading, AI Literacy).
* **Impact Delta Score:** Displays a live, screenshot-able comparison card (e.g. `Score: 50% → 78% | +28 delta`) tracking measurable user improvement.

### 🔬 3. Investigation Lab & Sleuth API
* **Lateral Reading Exercises:** Gamifies tabs switching to cross-reference claims outside the parent host.
* **Live RAG Verification Engine:** Connects to an automated claim decomposition pipeline (powered by Gemini Flash) with custom visual evidence node graphs, featuring an offline demo mode fallback for zero-dependency presentations.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 16 (Turbopack) & React 19 (TypeScript)
* **Styling:** Tailwind CSS v4 & Vanilla CSS (cyberpunk neon theme)
* **Animation:** Framer Motion (page transitions and card swipes)
* **Backend & Security:** Supabase Cloud Database with Row Level Security (RLS) policies
* **Caching & Fallbacks:** Dual-Mode client (`src/lib/db.ts`) with robust localStorage fallbacks for offline presentations.

---

## 💻 Local Quickstart

### 1. Prerequisites
Ensure you have **Node.js v18+** installed.

### 2. Installation
Clone the repository and install the npm dependencies:
```bash
git clone https://github.com/Saad-Najam/RealityOS.git
cd RealityOS
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory (a template is available in the repository):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Add to enable live AI RAG claim decomposition checks
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server
Start the local server:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to demo the app.
