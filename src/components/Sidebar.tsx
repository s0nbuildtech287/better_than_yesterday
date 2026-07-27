'use client';

import React from 'react';
import { 
  Sparkles, Sun, Moon, Flame, Zap, PlusCircle, LogOut, Wallet,
  LayoutDashboard, Camera, BarChart3, Trophy, CheckSquare, FileText 
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
  className = '',
}) => {
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
      <div>
        <div className="flex items-center gap-3 px-1 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
              Better Than Yesterday
            </h1>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
              Tốt Hơn 1% Mỗi Ngày
            </p>
          </div>
        </div>

        {/* Action Button: Add Habit */}
        <button
          onClick={onOpenAddModal}
          className="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Thêm Thói Quen Mới</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Danh Mục Chính
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
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
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
        
        {/* Streak Badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce-subtle" />
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
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Zap className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>Lười Quá? Nạp Động Lực 🔥</span>
        </button>

        {/* Dark Mode / Light Mode Switch */}
        <button
          onClick={onToggleDarkMode}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
        >
          <span className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Giao diện: {isDarkMode ? 'Chế độ Tối' : 'Chế độ Sáng'}</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold">
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-rose-500/20 whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        )}

      </div>

    </aside>
  );
};
