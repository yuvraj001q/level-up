import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Task, Quest, Achievement } from '@/types';

interface AppState {
  user: UserProfile | null;
  tasks: Task[];
  quests: Quest[];
  achievements: Achievement[];
  isLoading: boolean;
  xpAnimation: { amount: number; show: boolean } | null;
  levelUpAnimation: { level: number; show: boolean } | null;
  achievementAnimation: { title: string; show: boolean } | null;

  setUser: (user: UserProfile | null) => void;
  setTasks: (tasks: Task[]) => void;
  setQuests: (quests: Quest[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setLoading: (loading: boolean) => void;
  showXpAnimation: (amount: number) => void;
  showLevelUpAnimation: (level: number) => void;
  showAchievementAnimation: (title: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      tasks: [],
      quests: [],
      achievements: [],
      isLoading: true,
      xpAnimation: null,
      levelUpAnimation: null,
      achievementAnimation: null,

      setUser: (user) => set({ user }),
      setTasks: (tasks) => set({ tasks }),
      setQuests: (quests) => set({ quests }),
      setAchievements: (achievements) => set({ achievements }),
      setLoading: (isLoading) => set({ isLoading }),

      showXpAnimation: (amount) => {
        set({ xpAnimation: { amount, show: true } });
        setTimeout(() => set({ xpAnimation: null }), 2000);
      },

      showLevelUpAnimation: (level) => {
        set({ levelUpAnimation: { level, show: true } });
        setTimeout(() => set({ levelUpAnimation: null }), 3000);
      },

      showAchievementAnimation: (title) => {
        set({ achievementAnimation: { title, show: true } });
        setTimeout(() => set({ achievementAnimation: null }), 3000);
      },

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  updateQuest: (id, updates) =>
    set((state) => ({
      quests: state.quests.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    })),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
    }),
    {
      name: 'level-up-store',
      partialize: (state) => ({
        user: state.user,
        tasks: state.tasks,
        quests: state.quests,
        achievements: state.achievements,
      }),
    }
  )
);
