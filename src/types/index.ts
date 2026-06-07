export type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
export type QuestType = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type Goal = 'FITNESS' | 'LEARNING' | 'CODING' | 'READING' | 'BUSINESS' | 'SELF_IMPROVEMENT' | 'NDA_PREPARATION' | 'CAREER_GROWTH' | 'COMMUNICATION_SKILLS' | 'CREATIVITY' | 'MINDFULNESS' | 'PRODUCTIVITY' | 'FINANCE' | 'HEALTH_WELLNESS' | 'TRAVEL' | 'SOCIAL_SKILLS' | 'WRITING' | 'LANGUAGE' | 'MUSIC';
export type League = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER';

export const LEAGUE_ORDER: League[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER'];

export function getNextLeague(league: League): League | null {
  const idx = LEAGUE_ORDER.indexOf(league);
  if (idx >= LEAGUE_ORDER.length - 1) return null;
  return LEAGUE_ORDER[idx + 1];
}

export function getPrevLeague(league: League): League | null {
  const idx = LEAGUE_ORDER.indexOf(league);
  if (idx <= 0) return null;
  return LEAGUE_ORDER[idx - 1];
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  age: number | null;
  bio: string | null;
  goals: Goal[];
  interests: string[];
  productivityLevel: number | null;
  level: number;
  xp: number;
  rank: string;
  league: League;
  lastPromotion: Date | null;
  achievementPoints: number;
  dailyStreak: number;
  weeklyStreak: number;
  longestStreak: number;
  lastActiveAt: Date | null;
  streakFreeze: number;
  phone: string | null;
  phoneVerified: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  category: string | null;
  deadline: Date | null;
  notes: string | null;
  isAiGenerated: boolean;
  completedAt: Date | null;
  createdAt: Date;
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: QuestType;
  difficulty: TaskDifficulty;
  xpReward: number;
  status: TaskStatus;
  category: string | null;
  isBonus: boolean;
  isStreakQuest: boolean;
  completedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  pointsReward: number;
  criteria: Record<string, unknown>;
  unlocked: boolean;
  unlockedAt: Date | null;
}

export interface XpLog {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  source: string;
  createdAt: Date;
}

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpForNext: number;
  totalXpForCurrent: number;
  progress: number;
  rank: string;
}

export interface DashboardData {
  user: UserProfile;
  todaysTasks: Task[];
  weeklyQuests: Quest[];
  levelInfo: LevelInfo;
  recentAchievements: Achievement[];
  xpToday: number;
  tasksCompletedToday: number;
}
