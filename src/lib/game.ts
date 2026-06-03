import type { LevelInfo, TaskDifficulty } from '@/types';

const XP_VALUES: Record<TaskDifficulty, number> = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  EPIC: 100,
  LEGENDARY: 250,
};

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

function calculateRank(level: number): string {
  if (level >= 100) return 'Grandmaster';
  if (level >= 75) return 'Legend';
  if (level >= 50) return 'Master';
  if (level >= 35) return 'Veteran';
  if (level >= 25) return 'Elite';
  if (level >= 15) return 'Expert';
  if (level >= 10) return 'Advanced';
  if (level >= 5) return 'Intermediate';
  if (level >= 2) return 'Apprentice';
  return 'Newcomer';
}

export function getLevelInfo(xp: number): LevelInfo {
  let level = 1;
  let xpForNextLevel = xpForLevel(level);

  while (xp >= xpForNextLevel) {
    xp -= xpForNextLevel;
    level++;
    xpForNextLevel = xpForLevel(level);
  }

  const currentLevelXp = xp;
  const totalXpForCurrent = xpForNextLevel;
  const progress = Math.min((currentLevelXp / totalXpForCurrent) * 100, 100);

  return {
    level,
    currentXp: currentLevelXp,
    xpForNext: totalXpForCurrent,
    totalXpForCurrent,
    progress,
    rank: calculateRank(level),
  };
}

export function getXpForDifficulty(difficulty: TaskDifficulty): number {
  return XP_VALUES[difficulty];
}

export function calculateLevel(xp: number): number {
  let level = 1;
  let xpForNextLevel = xpForLevel(level);

  while (xp >= xpForNextLevel) {
    xp -= xpForNextLevel;
    level++;
    xpForNextLevel = xpForLevel(level);
  }

  return level;
}

export function getNewRank(level: number): string {
  return calculateRank(level);
}
