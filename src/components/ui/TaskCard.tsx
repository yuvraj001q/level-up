'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Zap, AlertCircle, Flag } from 'lucide-react';
import type { Task, TaskDifficulty } from '@/types';

const DIFFICULTY_CONFIG: Record<TaskDifficulty, { color: string; label: string; xp: number }> = {
  EASY: { color: 'text-accent-green', label: 'Easy', xp: 10 },
  MEDIUM: { color: 'text-accent-blue', label: 'Medium', xp: 25 },
  HARD: { color: 'text-accent-orange', label: 'Hard', xp: 50 },
  EPIC: { color: 'text-accent-purple', label: 'Epic', xp: 100 },
  LEGENDARY: { color: 'text-accent-red', label: 'Legendary', xp: 250 },
};

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const config = DIFFICULTY_CONFIG[task.difficulty];
  const isCompleted = task.status === 'COMPLETED';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`glass-hover p-4 flex items-start gap-3 ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => onComplete(task.id)}
        className="mt-0.5 flex-shrink-0 p-1 -ml-1"
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-accent-green" />
        ) : (
          <Circle className="w-5 h-5 text-text-muted hover:text-accent-blue transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted ? 'line-through text-text-muted' : 'text-text-primary'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-text-muted mt-1">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className={`text-xs font-medium ${config.color}`}>
            <Zap className="w-3 h-3 inline mr-0.5" />
            +{config.xp} XP
          </span>
          <span className="text-xs text-text-muted">
            <Flag className="w-3 h-3 inline mr-0.5" />
            {config.label}
          </span>
          {task.deadline && (
            <span className="text-xs text-text-muted">
              <Clock className="w-3 h-3 inline mr-0.5" />
              {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
          {task.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-glass text-text-muted">
              {task.category}
            </span>
          )}
        </div>
      </div>

      {task.isAiGenerated && (
        <div className="flex-shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
            AI
          </span>
        </div>
      )}
    </motion.div>
  );
}
