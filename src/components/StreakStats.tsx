'use client';

import React from 'react';
import { Flame, Trophy, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';

interface StreakStatsProps {
  streakCount: number;
  totalHabits: number;
  completedCount: number;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const StreakStats: React.FC<StreakStatsProps> = ({
  streakCount,
  totalHabits,
  completedCount,
  selectedFilter,
  onFilterChange,
}) => {
  const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  let levelTitle = 'Tân Binh Kỷ Luật 🌱';
  let levelGradient = 'from-amber-500 to-orange-500';

  if (streakCount >= 30) {
    levelTitle = 'Bậc Thầy Thói Quen 👑';
    levelGradient = 'from-purple-500 to-indigo-600';
  } else if (streakCount >= 14) {
    levelTitle = 'Chiến Binh Kỷ Luật ⚡';
    levelGradient = 'from-emerald-500 to-teal-600';
  } else if (streakCount >= 7) {
    levelTitle = 'Hộ Vệ Kỷ Luật 🔥';
    levelGradient = 'from-amber-500 to-rose-500';
  }

  return (
    <div className="modern-card p-4 sm:p-6 mb-6 sm:mb-8 border-slate-200 dark:border-slate-800">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-6">
        
        {/* Streak Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-slate-800/60 border border-amber-500/20 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30 flex-shrink-0">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 fill-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {streakCount} Ngày
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap truncate">
              Chuỗi Kỷ Luật Liên Tục 🔥
            </div>
          </div>
        </div>

        {/* Badge Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/10 dark:bg-slate-800/60 border border-indigo-500/20 flex items-center gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${levelGradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Danh Hiệu Hiện Tại
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 whitespace-nowrap truncate">
              {levelTitle}
            </div>
          </div>
        </div>

        {/* Progress Bar Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 dark:bg-slate-800/60 border border-emerald-500/20 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow-md shadow-emerald-500/30 flex-shrink-0">
            {percentage}%
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 whitespace-nowrap">
              <span>Đã xong hôm nay</span>
              <span>{completedCount}/{totalHabits}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Routine Time-of-Day Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Lọc thói quen:
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: 'Tất cả ✨' },
            { id: 'MORNING', label: 'Sáng 🌅' },
            { id: 'EVENING', label: 'Tối 🌙' },
            { id: 'ANYTIME', label: 'Linh hoạt ⚡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                selectedFilter === tab.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
