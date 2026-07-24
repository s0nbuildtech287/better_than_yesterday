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
  const todayFormatted = format(new Date(), 'dd/MM/yyyy');

  return (
    <header className="w-full bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 transition-colors">
      
      {/* Mobile Menu Trigger & Header Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0"
          title="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Ngày {todayFormatted}</span>
          </div>
          <h2 className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap truncate">
            Better Than Yesterday
          </h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        
        {/* Streak Flame Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-extrabold whitespace-nowrap">
          <Flame className="w-4 h-4 fill-amber-500 flex-shrink-0" />
          <span>{streakCount} ngày</span>
        </div>

        {/* Motivation Button */}
        <button
          onClick={onOpenMotivationModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
          <span>Nạp động lực</span>
        </button>

        {/* Dark Mode Toggle button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Đổi giao diện Sáng/Tối"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Add Habit button for mobile header */}
        <button
          onClick={onOpenAddModal}
          className="md:hidden p-2 rounded-xl bg-amber-500 text-white shadow-md active:scale-95 transition-all flex items-center justify-center"
          title="Thêm thói quen"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

    </header>
  );
};
