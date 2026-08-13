import { createClient } from '@supabase/supabase-js';
import { INITIAL_SCENARIOS, Scenario } from './scenariosData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase only if variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface Profile {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  completed_diagnostic: boolean;
  campus: string;
}

export interface SkillScores {
  source_verification: number;
  bias_detection: number;
  deepfake_awareness: number;
  emotional_manipulation: number;
  statistical_literacy: number;
  lateral_reading: number;
  ai_literacy: number;
}

export interface Attempt {
  scenarioId: number;
  selectedAction: string;
  isCorrect: boolean;
  xpEarned: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  username: string;
  campus: string;
  score: number;
}

// LocalStorage Fallback database helper keys
const KEYS = {
  PROFILE: 'realityos_profile',
  SKILLS: 'realityos_skills',
  BASELINE: 'realityos_baseline_skills',
  ATTEMPTS: 'realityos_attempts',
  LEADERBOARD: 'realityos_leaderboard',
  INVESTIGATIONS: 'realityos_investigations'
};

// Default seed data for LocalStorage fallback
const DEFAULT_PROFILE: Profile = {
  id: 'local-user-uuid-12345',
  username: 'Sleuth_Novice',
  xp: 0,
  level: 1,
  streak: 0,
  completed_diagnostic: false,
  campus: 'FAST Karachi'
};

const DEFAULT_SKILLS: SkillScores = {
  source_verification: 50,
  bias_detection: 50,
  deepfake_awareness: 50,
  emotional_manipulation: 50,
  statistical_literacy: 50,
  lateral_reading: 50,
  ai_literacy: 50
};

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { username: 'FactCheckerPro', campus: 'FAST Karachi', score: 1450 },
  { username: 'SleuthGirl', campus: 'IBA Karachi', score: 1320 },
  { username: 'LogicalGuy', campus: 'NED Karachi', score: 1100 },
  { username: 'AntiFakeNews', campus: 'LUMS Lahore', score: 980 },
  { username: 'TruthHunter', campus: 'FAST Karachi', score: 850 },
  { username: 'BiasDetector', campus: 'NED Karachi', score: 710 },
  { username: 'GraphWizard', campus: 'IBA Karachi', score: 620 }
];

export const dbService = {
  async getProfile(): Promise<Profile> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (data && !error) return data as Profile;
        }
      } catch (e) {
        console.warn("Supabase profile fetch failed, using local storage", e);
      }
    }
    
    // Local fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(KEYS.PROFILE);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse local profile, resetting defaults", e);
        }
      }
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    }
    return DEFAULT_PROFILE;
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile();
    const updated = { ...current, ...updates };

    // Handle Level Up Logic based on XP (every 500 XP is a level)
    if (updates.xp !== undefined) {
      const nextLevel = Math.floor(updated.xp / 500) + 1;
      if (nextLevel > updated.level) {
        updated.level = nextLevel;
      }
    }

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);
        }
      } catch (e) {
        console.warn("Supabase profile update failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(updated));
    }
    return updated;
  },

  async getSkillScores(): Promise<SkillScores> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('user_skill_scores')
            .select('*')
            .eq('profile_id', user.id)
            .single();
          if (data && !error) {
            // Map table column names to interface keys
            return {
              source_verification: data.source_verification,
              bias_detection: data.bias_detection,
              deepfake_awareness: data.deepfake_awareness,
              emotional_manipulation: data.emotional_manipulation,
              statistical_literacy: data.statistical_literacy,
              lateral_reading: data.lateral_reading,
              ai_literacy: data.ai_literacy
            };
          }
        }
      } catch (e) {
        console.warn("Supabase skill fetch failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(KEYS.SKILLS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse skills data, resetting defaults", e);
        }
      }
      localStorage.setItem(KEYS.SKILLS, JSON.stringify(DEFAULT_SKILLS));
    }
    return DEFAULT_SKILLS;
  },

  async updateSkillScores(updates: Partial<SkillScores>): Promise<SkillScores> {
    const current = await this.getSkillScores();
    const updated = { ...current, ...updates };

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_skill_scores')
            .update(updates)
            .eq('profile_id', user.id);
        }
      } catch (e) {
        console.warn("Supabase skill update failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.SKILLS, JSON.stringify(updated));
    }
    return updated;
  },

  async getBaselineSkillScores(): Promise<SkillScores | null> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('baseline_skill_scores')
            .select('*')
            .eq('profile_id', user.id)
            .single();
          if (data && !error) {
            return {
              source_verification: data.source_verification,
              bias_detection: data.bias_detection,
              deepfake_awareness: data.deepfake_awareness,
              emotional_manipulation: data.emotional_manipulation,
              statistical_literacy: data.statistical_literacy,
              lateral_reading: data.lateral_reading,
              ai_literacy: data.ai_literacy
            };
          }
        }
      } catch (e) {
        console.warn("Supabase baseline fetch failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(KEYS.BASELINE);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse baseline skills", e);
        }
      }
    }
    return null;
  },

  async saveBaselineIfMissing(scores: SkillScores): Promise<SkillScores> {
    const existing = await this.getBaselineSkillScores();
    if (existing) {
      return existing;
    }

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('baseline_skill_scores')
            .insert({
              profile_id: user.id,
              source_verification: scores.source_verification,
              bias_detection: scores.bias_detection,
              deepfake_awareness: scores.deepfake_awareness,
              emotional_manipulation: scores.emotional_manipulation,
              statistical_literacy: scores.statistical_literacy,
              lateral_reading: scores.lateral_reading,
              ai_literacy: scores.ai_literacy
            });
        }
      } catch (e) {
        console.warn("Supabase baseline insert failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.BASELINE, JSON.stringify(scores));
    }
    return scores;
  },

  async getScenarios(): Promise<Scenario[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('scenarios')
          .select('*');
        if (data && data.length > 0 && !error) return data as Scenario[];
      } catch (e) {
        console.warn("Supabase scenarios query failed, using static seeds", e);
      }
    }
    return INITIAL_SCENARIOS;
  },

  async getAttempts(): Promise<Attempt[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('attempts')
          .select('*');
        if (data && !error) {
          return data.map(d => ({
            scenarioId: d.scenario_id,
            selectedAction: d.selected_action,
            isCorrect: d.is_correct,
            xpEarned: d.xp_earned,
            timestamp: d.created_at
          }));
        }
      } catch (e) {
        console.warn("Supabase attempts fetch failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(KEYS.ATTEMPTS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse attempts history", e);
        }
      }
      return [];
    }
    return [];
  },

  async recordAttempt(scenario: Scenario, selectedAction: string, isCorrect: boolean): Promise<{ xpGained: number, updatedProfile: Profile, updatedSkills: SkillScores }> {
    const xpGained = isCorrect ? scenario.xp : Math.round(scenario.xp / 4); // Partial credit for attempts
    
    // Save attempt
    const newAttempt: Attempt = {
      scenarioId: scenario.id,
      selectedAction,
      isCorrect,
      xpEarned: xpGained,
      timestamp: new Date().toISOString()
    };

    // Update attempts
    const attempts = await this.getAttempts();
    attempts.push(newAttempt);
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(attempts));
    }

    // Dynamic Skill Scoring adjustments
    const skills = await this.getSkillScores();
    const skillKeyMap: Record<string, keyof SkillScores> = {
      'Source Verification': 'source_verification',
      'Bias Detection': 'bias_detection',
      'Deepfake Awareness': 'deepfake_awareness',
      'Emotional Manipulation': 'emotional_manipulation',
      'Statistical Literacy': 'statistical_literacy',
      'Lateral Reading': 'lateral_reading',
      'AI Literacy': 'ai_literacy'
    };

    const targetKey = skillKeyMap[scenario.skill];
    if (targetKey) {
      const currentScore = skills[targetKey];
      // Gain +5 if correct, lose -3 if incorrect. Bound between 10 and 100.
      const adjustment = isCorrect ? 8 : -4;
      skills[targetKey] = Math.max(10, Math.min(100, currentScore + adjustment));
      await this.updateSkillScores({ [targetKey]: skills[targetKey] });
    }

    // Update Profile Streak & XP
    const profile = await this.getProfile();
    const newStreak = isCorrect ? profile.streak + 1 : 0;
    const updatedProfile = await this.updateProfile({
      xp: profile.xp + xpGained,
      streak: newStreak
    });

    // Update Leaderboard score
    await this.syncLeaderboardScore(updatedProfile.username, updatedProfile.campus, updatedProfile.xp + xpGained);

    // Sync to Supabase in background if enabled
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('attempts').insert({
            user_id: user.id,
            scenario_id: scenario.id,
            selected_action: selectedAction,
            is_correct: isCorrect,
            xp_earned: xpGained
          });
        }
      } catch (e) {
        console.warn("Supabase recordAttempt failed", e);
      }
    }

    return {
      xpGained,
      updatedProfile,
      updatedSkills: skills
    };
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leaderboards')
          .select('username, campus, score')
          .order('score', { ascending: false });
        if (data && !error) return data as LeaderboardEntry[];
      } catch (e) {
        console.warn("Supabase leaderboard query failed", e);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(KEYS.LEADERBOARD);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse leaderboard scores", e);
        }
      }
      localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(DEFAULT_LEADERBOARD));
    }
    return DEFAULT_LEADERBOARD;
  },

  async syncLeaderboardScore(username: string, campus: string, score: number): Promise<void> {
    const list = await this.getLeaderboard();
    const existingIndex = list.findIndex(e => e.username === username);
    if (existingIndex >= 0) {
      list[existingIndex].score = score;
      list[existingIndex].campus = campus;
    } else {
      list.push({ username, campus, score });
    }
    
    // Sort descending
    list.sort((a, b) => b.score - a.score);

    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(list));
    }

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('leaderboards').upsert({
            user_id: user.id,
            username,
            campus,
            score,
            updated_at: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn("Supabase leaderboard sync failed", e);
      }
    }
  }
};
