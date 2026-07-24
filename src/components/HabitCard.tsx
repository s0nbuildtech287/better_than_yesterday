'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Moon, Dumbbell, BookOpen, Utensils, CheckCircle2, Circle, 
  Camera, Sun, Clock 
} from 'lucide-react';

export interface HabitItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  timeOfDay: string;
  targetDaysPerWeek: number;
}

interface HabitCardProps {
  habit: HabitItem;
  isCompleted: boolean;
  onToggle: (habitId: string, nextState: boolean) => void;
  onUploadProof: (habitId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Moon: <Moon className="w-5 h-5 text-indigo-400" />,
  Dumbbell: <Dumbbell className="w-5 h-5 text-emerald-500" />,
  BookOpen: <BookOpen className="w-5 h-5 text-sky-400" />,
  Utensils: <Utensils className="w-5 h-5 text-rose-500" />,
};

const TIME_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  MORNING: { label: 'Buổi Sáng 🌅', bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300' },
  EVENING: { label: 'Buổi Tối 🌙', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-700 dark:text-indigo-300' },
  ANYTIME: { label: 'Bất Kỳ Lúc Nào ⚡', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' },
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onToggle,
  onUploadProof,
}) => {
  const handleCheckClick = (e: React.MouseEvent) => {
    const nextState = !isCompleted;
    if (nextState) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x, y },
        colors: ['#F59E0B', '#10B981', '#8B5CF6', '#3B82F6'],
      });
    }
    onToggle(habit.id, nextState);
  };

  const timeBadge = TIME_BADGES[habit.timeOfDay] || TIME_BADGES.ANYTIME;

  return (
    <div 
      className={`modern-card p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
        isCompleted 
          ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/40 dark:border-emerald-500/50' 
          : 'hover:border-amber-500/40 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${timeBadge.bg} ${timeBadge.text}`}>
            {timeBadge.label}
          </span>

          <button
            onClick={() => onUploadProof(habit.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            title="Upload ảnh minh chứng nỗ lực"
          >
            <Camera className="w-3.5 h-3.5 text-amber-500" />
            <span>Ảnh Minh Chứng</span>
          </button>
        </div>

        {/* Content & Icon */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
            {ICON_MAP[habit.icon] || <Sparkles className="w-5 h-5 text-amber-500" />}
          </div>
          <div>
            <h3 className={`text-base font-bold transition-colors ${
              isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
            }`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {habit.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          Mục tiêu: {habit.targetDaysPerWeek} ngày/tuần
        </span>

        <button
          onClick={handleCheckClick}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all transform active:scale-95 shadow-sm ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã Hoàn Thành! 🎉</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              <span>Đánh Dấu Nỗ Lực</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
