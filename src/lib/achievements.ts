export interface AchievementDefinition {
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  pointsReward: number;
  criteria: Record<string, unknown>;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    key: 'first_step',
    title: 'First Step',
    description: 'Complete your first task',
    icon: 'Footprints',
    xpReward: 50,
    pointsReward: 10,
    criteria: { type: 'tasks_completed', count: 1 },
  },
  {
    key: 'consistent',
    title: 'Consistent',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
    xpReward: 100,
    pointsReward: 25,
    criteria: { type: 'streak_days', count: 7 },
  },
  {
    key: 'disciplined',
    title: 'Disciplined',
    description: 'Maintain a 30-day streak',
    icon: 'Award',
    xpReward: 500,
    pointsReward: 100,
    criteria: { type: 'streak_days', count: 30 },
  },
  {
    key: 'scholar',
    title: 'Scholar',
    description: 'Complete 100 learning tasks',
    icon: 'BookOpen',
    xpReward: 300,
    pointsReward: 50,
    criteria: { type: 'category_tasks', category: 'LEARNING', count: 100 },
  },
  {
    key: 'warrior',
    title: 'Warrior',
    description: 'Complete 100 fitness tasks',
    icon: 'Dumbbell',
    xpReward: 300,
    pointsReward: 50,
    criteria: { type: 'category_tasks', category: 'FITNESS', count: 100 },
  },
  {
    key: 'builder',
    title: 'Builder',
    description: 'Create 50 custom tasks',
    icon: 'Hammer',
    xpReward: 200,
    pointsReward: 40,
    criteria: { type: 'custom_tasks', count: 50 },
  },
  {
    key: 'ten_tasks',
    title: 'Worker',
    description: 'Complete 10 tasks',
    icon: 'CheckCircle',
    xpReward: 75,
    pointsReward: 15,
    criteria: { type: 'tasks_completed', count: 10 },
  },
  {
    key: 'fifty_tasks',
    title: 'Dedicated',
    description: 'Complete 50 tasks',
    icon: 'Target',
    xpReward: 200,
    pointsReward: 40,
    criteria: { type: 'tasks_completed', count: 50 },
  },
  {
    key: 'hundred_tasks',
    title: 'Century',
    description: 'Complete 100 tasks',
    icon: 'Trophy',
    xpReward: 500,
    pointsReward: 100,
    criteria: { type: 'tasks_completed', count: 100 },
  },
  {
    key: 'level_five',
    title: 'Growing',
    description: 'Reach level 5',
    icon: 'TrendingUp',
    xpReward: 100,
    pointsReward: 20,
    criteria: { type: 'level_reached', level: 5 },
  },
  {
    key: 'level_ten',
    title: 'Rising Star',
    description: 'Reach level 10',
    icon: 'Star',
    xpReward: 300,
    pointsReward: 50,
    criteria: { type: 'level_reached', level: 10 },
  },
  {
    key: 'level_twenty',
    title: 'Champion',
    description: 'Reach level 20',
    icon: 'Crown',
    xpReward: 1000,
    pointsReward: 200,
    criteria: { type: 'level_reached', level: 20 },
  },
  {
    key: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day weekly streak',
    icon: 'CalendarCheck',
    xpReward: 150,
    pointsReward: 30,
    criteria: { type: 'weekly_streak', count: 1 },
  },
  {
    key: 'month_streak',
    title: 'Monthly Mastery',
    description: 'Maintain a 30-day monthly streak',
    icon: 'CalendarDays',
    xpReward: 500,
    pointsReward: 100,
    criteria: { type: 'weekly_streak', count: 4 },
  },
  {
    key: 'ai_explorer',
    title: 'AI Explorer',
    description: 'Complete 10 AI-generated quests',
    icon: 'Sparkles',
    xpReward: 150,
    pointsReward: 25,
    criteria: { type: 'ai_quests_completed', count: 10 },
  },
  {
    key: 'quest_master',
    title: 'Quest Master',
    description: 'Complete 50 daily quests',
    icon: 'Sword',
    xpReward: 400,
    pointsReward: 75,
    criteria: { type: 'daily_quests_completed', count: 50 },
  },
];

export function checkAchievements(
  currentAchievements: string[],
  stats: {
    tasksCompleted: number;
    xp: number;
    level: number;
    dailyStreak: number;
    weeklyStreak: number;
    longestStreak: number;
    fitnessTasksCompleted: number;
    learningTasksCompleted: number;
    customTasksCreated: number;
    aiQuestsCompleted: number;
    dailyQuestsCompleted: number;
  },
): AchievementDefinition[] {
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (currentAchievements.includes(achievement.key)) continue;

    let earned = false;
    const criteria = achievement.criteria;

    switch (criteria.type) {
      case 'tasks_completed':
        earned = stats.tasksCompleted >= (criteria.count as number);
        break;
      case 'streak_days':
        earned = stats.dailyStreak >= (criteria.count as number);
        break;
      case 'category_tasks':
        if (criteria.category === 'FITNESS') {
          earned = stats.fitnessTasksCompleted >= (criteria.count as number);
        } else if (criteria.category === 'LEARNING') {
          earned = stats.learningTasksCompleted >= (criteria.count as number);
        }
        break;
      case 'custom_tasks':
        earned = stats.customTasksCreated >= (criteria.count as number);
        break;
      case 'level_reached':
        earned = stats.level >= (criteria.level as number);
        break;
      case 'weekly_streak':
        earned = stats.weeklyStreak >= (criteria.count as number);
        break;
      case 'ai_quests_completed':
        earned = stats.aiQuestsCompleted >= (criteria.count as number);
        break;
      case 'daily_quests_completed':
        earned = stats.dailyQuestsCompleted >= (criteria.count as number);
        break;
    }

    if (earned) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}
