-- Supabase SQL Schema for RealityOS
-- Copy and paste this into the Supabase SQL Editor to initialize the database tables.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  completed_diagnostic boolean default false,
  campus text default 'Independent',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKILL SCORES TABLE (MIL curriculum competencies)
create table if not exists public.user_skill_scores (
  profile_id uuid references public.profiles(id) on delete cascade primary key,
  source_verification integer default 50, -- Out of 100
  bias_detection integer default 50,
  deepfake_awareness integer default 50,
  emotional_manipulation integer default 50,
  statistical_literacy integer default 50,
  lateral_reading integer default 50,
  ai_literacy integer default 50,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SCENARIOS TABLE (Content Feed challenges)
create table if not exists public.scenarios (
  id serial primary key,
  title text not null,
  category text not null, -- 'misinformation', 'manipulation', 'source_literacy', 'ai_literacy', 'context', 'social_media'
  difficulty text not null, -- 'easy', 'medium', 'hard'
  content text not null, -- The text post content
  format text not null, -- 'X_POST', 'WHATSAPP_FORWARD', 'INSTAGRAM_CARD', 'NEWS_HEADLINE'
  media_url text, -- URL to deepfake images or diagrams
  correct_action text not null, -- 'TRUST', 'SHARE', 'INVESTIGATE', 'IGNORE'
  ground_truth_verdict text, -- 'TRUST', 'MISLEADING', 'FABRICATED'
  learning_objective text not null,
  manipulation_type text, -- 'Clickbait', 'Emotional Appeal', 'Out of Context', 'AI Fake'
  explanation text not null, -- Why it is correct
  skill text not null, -- Key skill targeted
  xp integer default 100,
  tells jsonb, -- Highlights of visual tells (for Deepfakes/Screenshots)
  evidence_graph jsonb, -- Map for Investigation Mode
  lateral_search_query text, -- Recommended lateral reading query
  lateral_clues jsonb -- Questions & clues for lateral reading tabs
);

-- ATTEMPTS TABLE
create table if not exists public.attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scenario_id integer references public.scenarios(id) on delete cascade not null,
  selected_action text not null,
  is_correct boolean not null,
  xp_earned integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEADERBOARDS TABLE
create table if not exists public.leaderboards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  username text not null,
  campus text not null,
  score integer not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVESTIGATIONS BOARD
create table if not exists public.investigations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  claim_text text not null,
  nodes jsonb not null, -- Graph nodes representing Source, Evidence, Verdict
  edges jsonb not null, -- Graph connections
  verdict text default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_skill_scores enable row level security;
alter table public.scenarios enable row level security;
alter table public.attempts enable row level security;
alter table public.leaderboards enable row level security;
alter table public.investigations enable row level security;

-- Create basic access policies
create policy "Allow public read access to scenarios" on public.scenarios for select using (true);
create policy "Users can read any leaderboard" on public.leaderboards for select using (true);
create policy "Users can insert their own leaderboard score" on public.leaderboards for insert with check (auth.uid() = user_id);
create policy "Users can update their own leaderboard score" on public.leaderboards for update using (auth.uid() = user_id);

create policy "Users can read their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view their own skill scores" on public.user_skill_scores for select using (auth.uid() = profile_id);
create policy "Users can update their own skill scores" on public.user_skill_scores for update using (auth.uid() = profile_id);
create policy "Users can insert their own skill scores" on public.user_skill_scores for insert with check (auth.uid() = profile_id);

create policy "Users can view their own attempts" on public.attempts for select using (auth.uid() = user_id);
create policy "Users can record attempts" on public.attempts for insert with check (auth.uid() = user_id);

create policy "Users can view their own investigations" on public.investigations for select using (auth.uid() = user_id);
create policy "Users can manage their own investigations" on public.investigations for all using (auth.uid() = user_id);

-- BASELINE SKILL SCORES TABLE (MIL curriculum competencies captured after diagnostic)
create table if not exists public.baseline_skill_scores (
  profile_id uuid references public.profiles(id) on delete cascade primary key,
  source_verification integer default 50,
  bias_detection integer default 50,
  deepfake_awareness integer default 50,
  emotional_manipulation integer default 50,
  statistical_literacy integer default 50,
  lateral_reading integer default 50,
  ai_literacy integer default 50,
  captured_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.baseline_skill_scores enable row level security;

create policy "Users can view their own baseline skill scores" on public.baseline_skill_scores for select using (auth.uid() = profile_id);
create policy "Users can insert their own baseline skill scores" on public.baseline_skill_scores for insert with check (auth.uid() = profile_id);

