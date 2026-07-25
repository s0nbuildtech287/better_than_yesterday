'use client';

import React from 'react';
import { 
  Sparkles, CheckCircle2, Circle, Clock, Camera, 
  Flame, Calendar, AlertTriangle, ChevronRight, Coins 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { format, parseISO } from 'date-fns';

export interface HabitItem {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  icon?: string | null;
  timeOfDay: string;
  targetDaysPerWeek: number;
  startDate?: string | null;
  rewardAmount?: number;
  streakCount?: number;
  breakCount?: number;
  completedDates?: string[];
  completionNotesMap?: Record<string, string>;
}

interface HabitCardProps {
  habit: HabitItem;
  isCompleted: boolean;
  onToggle: (id: string, nextState: boolean) => void;
  onUploadProof?: (id: string) => void;
  onClickDetail?: (habit: HabitItem) => void;
}

const ICON_MAP: Record<string, string> = {
  Sparkles: '✨',
  Smile: '🪥',
  Dumbbell: '🏋️',
  Book: '📚',
  Cooking: '🍱',
  Bed: '🌙',
  Water: '💧',
  Heart: '❤️',
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onToggle,
  onUploadProof,
  onClickDetail,
}) => {
  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isCompleted;
    if (nextState) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });
    }
    onToggle(habit.id, nextState);
  };

  const emojiIcon = ICON_MAP[habit.icon || 'Sparkles'] || '✨';

  let formattedStartDate = '';
  if (habit.startDate) {
    try {
      formattedStartDate = format(parseISO(habit.startDate), 'dd/MM/yyyy');
    } catch {
      formattedStartDate = habit.startDate;
    }
  }

  const streak = habit.streakCount || 0;
  const breakCount = habit.breakCount || 0;
  const reward = habit.rewardAmount || 1000;

  const formatVND = (num: number) => {
    if (num >= 1000) return `+${num / 1000}kđ`;
    return `+${num}đ`;
  };

  return (
    <div
      onClick={() => onClickDetail && onClickDetail(habit)}
      className={`modern-card p-4 sm:p-5 border flex flex-col justify-between transition-all duration-300 transform cursor-pointer ${
        isCompleted
          ? 'bg-slate-100/60 dark:bg-[#0E1422]/90 border-emerald-500/40 shadow-sm opacity-90'
          : 'bg-white dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-md hover:shadow-lg'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-inner ${
              isCompleted ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'
            }`}>
              {emojiIcon}
            </div>

            <div className="flex flex-col gap-1">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border self-start ${
                habit.timeOfDay === 'MORNING'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  : habit.timeOfDay === 'EVENING'
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {habit.timeOfDay === 'MORNING' ? 'Sáng 🌅' : habit.timeOfDay === 'EVENING' ? 'Tối 🌙' : 'Linh hoạt ⚡'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Money Reward Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] sm:text-xs font-black">
              <Coins className="w-3.5 h-3.5" />
              <span>{formatVND(reward)}</span>
            </span>

            <button
              onClick={handleCheck}
              className={`p-2 rounded-2xl transition-all transform active:scale-90 ${
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10'
              }`}
              title="Đánh dấu hoàn thành"
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Circle className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Habit Title */}
        <h4 className={`text-sm sm:text-base font-bold mb-1 ${
          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
        }`}>
          {habit.title}
        </h4>

        {/* Description */}
        {habit.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
            {habit.description}
          </p>
        )}

        {/* Streak & Break Count Badges Row (Flex Wrap for Mobile) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 pt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] sm:text-[11px] font-bold">
            <Flame className="w-3 h-3 fill-amber-500" />
            <span>{streak} ngày</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] sm:text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3" />
            <span>{breakCount} đứt</span>
          </span>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        
        {/* Start Date Indicator */}
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>{formattedStartDate ? `Từ: ${formattedStartDate}` : 'Mới tạo'}</span>
        </div>

        <div className="flex items-center gap-1">
          {onUploadProof && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUploadProof(habit.id);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-500/10 text-slate-600 dark:text-slate-400 hover:text-amber-500 font-bold transition-all text-[10px] sm:text-[11px]"
              title="Tải ảnh minh chứng"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ảnh</span>
            </button>
          )}

          <span className="p-1 rounded-lg text-slate-400 hover:text-amber-500">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

    </div>
  );
};
