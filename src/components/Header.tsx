'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, PlusCircle, Sparkles, Zap, Sun, Moon, Menu, Flame, Compass, LogIn, User } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  streakCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddModal: () => void;
  onOpenMotivationModal: () => void;
  onToggleMobileMenu?: () => void;
  isGuest?: boolean;
  onOpenAuth?: () => void;
  onOpenIntro?: () => void;
  currentUser?: { username: string; fullName: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  streakCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenAddModal,
  onOpenMotivationModal,
  onToggleMobileMenu,
  isGuest = false,
  onOpenAuth,
  onOpenIntro,
  currentUser,
}) => {
  const router = useRouter();
  const todayFormatted = format(new Date(), 'dd/MM/yyyy');

  const handleGoIntro = () => {
    if (onOpenIntro) {
      onOpenIntro();
    } else {
      router.push('/intro');
    }
  };

  return (
    <header className="w-full bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 transition-colors">
      
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
            {isGuest && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30 ml-1.5">
                Chế độ Khách (Guest)
              </span>
            )}
          </div>
          <h2 
            onClick={handleGoIntro}
            className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap truncate cursor-pointer hover:text-amber-500 transition-colors"
          >
            Better Than Yesterday
          </h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        
        {/* Intro 3D Shortcut */}
        <button
          onClick={handleGoIntro}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20 transition-all whitespace-nowrap"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Giới Thiệu 3D</span>
        </button>

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

        {/* Guest: Sign in button */}
        {isGuest ? (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow hover:from-amber-600 transition-all whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
        ) : (
          /* Add Habit button for authenticated user */
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm thói quen</span>
          </button>
        )}

      </div>
    </header>
  );
};
