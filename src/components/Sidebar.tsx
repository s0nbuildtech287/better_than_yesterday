'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Sun, Moon, Flame, Zap, PlusCircle, LogOut, Wallet,
  LayoutDashboard, Camera, BarChart3, Trophy, CheckSquare, FileText,
  Compass, User, LogIn
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  streakCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddModal: () => void;
  onOpenMotivationModal: () => void;
  onLogout?: () => void;
  isGuest?: boolean;
  onOpenAuth?: () => void;
  currentUser?: { username: string; fullName: string } | null;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  streakCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenAddModal,
  onOpenMotivationModal,
  onLogout,
  isGuest = false,
  onOpenAuth,
  currentUser,
  className = '',
}) => {
  const router = useRouter();

  const NAV_ITEMS = [
    { id: 'ALL', label: 'Tổng Quan Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'FINANCE', label: 'Quản Lý Tài Chính', icon: <Wallet className="w-5 h-5" /> },
    { id: 'HABITS', label: 'Quản Lý Thói Quen', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'NOTES', label: 'Ghi Chú & Todo List', icon: <FileText className="w-5 h-5" /> },
    { id: 'GALLERY', label: 'Kho Ảnh Minh Chứng', icon: <Camera className="w-5 h-5" /> },
    { id: 'ANALYTICS', label: 'Biểu Đồ & Lịch Activity', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'BADGES', label: 'Huy Chương Thành Tích', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <aside className={`w-72 h-screen sticky top-0 flex flex-col justify-between p-5 bg-white dark:bg-[#0E131F] border-r border-slate-200 dark:border-slate-800/80 transition-colors z-30 flex-shrink-0 ${className}`}>
      
      {/* Top Branding Section */}
      <div className="overflow-y-auto pr-1">
        
        {/* Branding header */}
        <div 
          className="flex items-center gap-3 px-1 py-2 mb-4 cursor-pointer group"
          onClick={() => router.push('/intro')}
          title="Xem trang giới thiệu 3D"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-white animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[14px] font-black tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
                Better Than Yesterday
              </h1>
            </div>
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
              Tốt Hơn 1% Mỗi Ngày
            </p>
          </div>
        </div>

        {/* Guest Mode Indicator Banner */}
        {isGuest && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">
                Chế độ trải nghiệm
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tài khoản Khách
              </span>
            </div>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] shadow hover:bg-amber-400 transition-all flex items-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        )}

        {/* Action Button: Add Habit */}
        <button
          onClick={onOpenAddModal}
          className="w-full mb-4 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm Thói Quen Mới</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Danh Mục Chính
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20 font-bold border-l-4 border-amber-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className={isActive ? 'text-amber-500' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Intro 3D Button */}
          <button
            onClick={() => router.push('/intro')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-all mt-2 border border-amber-500/20"
          >
            <Compass className="w-5 h-5 text-amber-500" />
            <span className="font-bold">✨ Giới Thiệu 3D (Intro)</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
        
        {/* Streak Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {streakCount} Ngày Liên Tục
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 whitespace-nowrap">
                Giữ vững ngọn lửa kỷ luật!
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Motivation Trigger */}
        <button
          onClick={onOpenMotivationModal}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Zap className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Lười Quá? Nạp Động Lực 🔥</span>
        </button>

        {/* Dark Mode / Light Mode Switch */}
        <button
          onClick={onToggleDarkMode}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
        >
          <span className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span className="text-[11px]">{isDarkMode ? 'Giao diện Tối' : 'Giao diện Sáng'}</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold">
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </button>

        {/* User Identity or Guest Sign In */}
        {isGuest ? (
          <button
            onClick={onOpenAuth}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập / Đăng Ký</span>
          </button>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-black">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {currentUser?.fullName || currentUser?.username || 'xu4ns0n'}
                </span>
                <span className="text-[10px] text-slate-500 block">Đã xác thực</span>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Đăng xuất"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>

    </aside>
  );
};
