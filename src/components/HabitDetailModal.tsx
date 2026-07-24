'use client';

import React from 'react';
import { 
  X, Flame, AlertTriangle, Calendar, CheckCircle2, 
  Edit3, Trash2, Sparkles, TrendingUp 
} from 'lucide-react';
import { HabitItem } from './HabitCard';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  getDay, isSameDay, parseISO 
} from 'date-fns';
import { vi } from 'date-fns/locale';

interface HabitDetailModalProps {
  isOpen: boolean;
  habit: HabitItem | null;
  onClose: () => void;
  onEdit: (habit: HabitItem) => void;
  onDelete: (habitId: string) => void;
}

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
  isOpen,
  habit,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !habit) return null;

  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;

  const completedSet = new Set<string>(habit.completedDates || []);

  const totalCompletedCount = completedSet.size;
  const streakCount = habit.streakCount || 0;
  const breakCount = habit.breakCount || 0;

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa thói quen "${habit.title}" không?`)) {
      onDelete(habit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl modern-card bg-white dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-2xl flex-shrink-0">
            {habit.icon === 'Dumbbell' ? '🏋️' : habit.icon === 'Smile' ? '🪥' : habit.icon === 'Book' ? '📚' : habit.icon === 'Cooking' ? '🍱' : '✨'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats Row: Streak & Break count */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Chuỗi Kỷ Luật</span>
            </div>
            <div className="text-xl font-extrabold text-amber-500">
              {streakCount} ngày 🔥
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
              <AlertTriangle className="w-4 h-4" />
              <span>Số Lần Đứt Quãng</span>
            </div>
            <div className="text-xl font-extrabold text-rose-500">
              {breakCount} lần ⚠️
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tổng Đã Xong</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-400">
              {totalCompletedCount} lần ✨
            </div>
          </div>
        </div>

        {/* Mini 30-Day Calendar Heatmap */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Biểu Đồ Lịch Sử Check-in Tháng Này</span>
            </span>
            <span className="text-slate-400 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: vi })}
            </span>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 pb-1 mb-1 border-b border-slate-200 dark:border-slate-800">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>CN</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 rounded-lg bg-slate-200/20 dark:bg-slate-900/20 opacity-30" />
            ))}

            {daysInMonth.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isDone = completedSet.has(dayStr);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dayStr}
                  className={`h-8 rounded-xl flex items-center justify-center text-[11px] font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : isToday
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50'
                      : 'bg-slate-200/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
                  }`}
                  title={isDone ? `Đã xong ngày ${format(day, 'dd/MM/yyyy')}` : `Chưa xong ngày ${format(day, 'dd/MM/yyyy')}`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs border border-rose-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Thói Quen</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Đóng
            </button>

            <button
              onClick={() => {
                onEdit(habit);
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh Sửa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
