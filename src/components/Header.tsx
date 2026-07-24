'use client';

import React from 'react';
import { Calendar, PlusCircle, Sparkles, Zap, Sun, Moon, Menu, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface HeaderProps {
  streakCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddModal: () => void;
  onOpenMotivationModal: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streakCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenAddModal,
  onOpenMotivationModal,
  onToggleMobileMenu,
}) => {
  const todayFormatted = format(new Date(), "'Ngày' dd 'Tháng' MM, yyyy", { locale: vi });

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors">
      
      {/* Mobile Menu Trigger & Date Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayFormatted}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Hành Trình Tốt Hơn 1% Mỗi Ngày
          </h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Streak Flame Mobile/Desktop Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce-subtle" />
          <span>{streakCount} Ngày Liên Tục</span>
        </div>

        {/* Motivation Button */}
        <button
          onClick={onOpenMotivationModal}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200" />
          <span>Lười Quá? 🔥</span>
        </button>

        {/* Dark Mode Toggle button for header */}
        <button
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Đổi giao diện Sáng/Tối"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
        </button>

        {/* Add Habit button for mobile header */}
        <button
          onClick={onOpenAddModal}
          className="md:hidden p-2.5 rounded-xl bg-amber-500 text-white shadow-md active:scale-95 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

    </header>
  );
};
