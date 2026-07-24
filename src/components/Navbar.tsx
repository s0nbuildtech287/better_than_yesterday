'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Image as ImageIcon, PlusCircle, Zap, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  streakCount: number;
  effortScore: number;
  onOpenAddModal: () => void;
  onOpenMotivationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  streakCount,
  effortScore,
  onOpenAddModal,
  onOpenMotivationModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-amber-50/80 dark:bg-slate-900/80 border-b border-amber-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-clay-pill transform group-hover:scale-105 transition-all">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading tracking-tight bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-600 dark:from-amber-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Better Than Yesterday
            </h1>
            <p className="text-xs font-medium text-amber-800/70 dark:text-slate-400 hidden sm:block">
              Tốt Hơn 1% Mỗi Ngày • Thắng Lười Biếng
            </p>
          </div>
        </Link>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Flame Streak Count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 text-amber-700 dark:text-amber-300 font-bold text-sm sm:text-base">
            <Flame className="w-5 h-5 text-amber-500 animate-bounce-subtle fill-amber-500" />
            <span>{streakCount} Ngày 連 續</span>
          </div>

          {/* Emergency Motivation Button */}
          <button
            onClick={onOpenMotivationModal}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-clay-btn hover:brightness-110 active:scale-95 transition-all"
            title="Đang lười quá? Bấm vào đây để lấy động lực!"
          >
            <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200" />
            <span className="hidden sm:inline">Lười Quá? 🔥</span>
          </button>

          {/* Add Custom Habit Button */}
          <button
            onClick={onOpenAddModal}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-clay-lg hover:rotate-90 active:scale-90 transition-all"
            title="Thêm thói quen mới"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

      </div>
    </header>
  );
};
