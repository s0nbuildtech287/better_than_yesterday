'use client';

import React from 'react';
import { Wallet, Coins, TrendingUp, PiggyBank, Sparkles, ShoppingBag, Gift } from 'lucide-react';

interface SavingsVaultProps {
  savedToday: number;
  savedTotal: number;
}

export const SavingsVault: React.FC<SavingsVaultProps> = ({
  savedToday,
  savedTotal,
}) => {
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' VNĐ';
  };

  const bobaCups = Math.floor(savedTotal / 30000);
  const books = Math.floor(savedTotal / 100000);

  return (
    <div className="modern-card p-4 sm:p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-500/10 via-[#0D1117] to-amber-500/10 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Ví Tiền Kỷ Luật (Tiết Kiệm Giả Tưởng)</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Quy đổi thói quen tốt thành tiền tiết kiệm thực tế để nhân đôi động lực!
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <Coins className="w-4 h-4" />
          <span>Tiết kiệm thực tế</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        
        {/* Today's Saved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 space-y-1.5 sm:space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Tiết Kiệm / Thưởng Hôm Nay 💰</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">Hôm nay</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            +{formatVND(savedToday)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tích lũy từ các thói quen bạn đã hoàn thành hôm nay
          </p>
        </div>

        {/* Total All-time Saved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 space-y-1.5 sm:space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Tổng Tiền Đã Tích Lũy 🏦</span>
            <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px]">Tất cả</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            {formatVND(savedTotal)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tổng số tiền bạn tự thưởng/tiết kiệm được từ ngày bắt đầu
          </p>
        </div>

      </div>

      {/* Milestones Conversion & Reward Examples */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 text-xs">
          <Gift className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-slate-300">
            <span className="font-bold text-white">Quy Đổi Động Lực: </span>
            <span>Số tiền tích lũy tương đương <strong className="text-emerald-400">{bobaCups} ly trà sữa 🧋</strong> hoặc <strong className="text-amber-400">{books} cuốn sách 📚</strong>!</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-slate-400 flex-shrink-0">
          <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">🍱 Nấu cơm: +35k</span>
          <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">🥤 Nhịn nước ngọt: +10k</span>
          <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">🏃 Thể dục: +1k</span>
        </div>
      </div>

    </div>
  );
};
