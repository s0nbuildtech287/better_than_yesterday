'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Flame, AlertTriangle, Calendar as CalendarIcon, CheckCircle2, 
  Edit3, Trash2, Sparkles, Save, Tag, Check, MessageSquare, Plus
} from 'lucide-react';
import { HabitItem } from './HabitCard';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  getDay, isSameDay 
} from 'date-fns';
import { vi } from 'date-fns/locale';

interface HabitDetailModalProps {
  isOpen: boolean;
  habit: HabitItem | null;
  onClose: () => void;
  onEdit: (habit: HabitItem) => void;
  onDelete: (habitId: string) => void;
  onUpdated?: () => void;
}

const PRESET_TAGS = [
  '🏃 Chạy bộ',
  '⚽ Đá bóng',
  '🏋️ Gym / Thể thao',
  '📚 Học 15 phút',
  '🍱 Nấu ăn trưa',
  '🪥 Vệ sinh cá nhân',
  '💧 Uống 2L nước',
  '🛌 Ngủ trước 11h',
];

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
  isOpen,
  habit,
  onClose,
  onEdit,
  onDelete,
  onUpdated,
}) => {
  const currentDate = new Date();
  const todayStr = format(currentDate, 'yyyy-MM-dd');

  // Selected date for calendar note editing
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [noteInput, setNoteInput] = useState<string>('');
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Local state for interactive calendar updates
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (habit) {
      setCompletedSet(new Set<string>(habit.completedDates || []));
      setNotesMap(habit.completionNotesMap || {});
      
      // Default select today
      setSelectedDateStr(todayStr);
      setNoteInput(habit.completionNotesMap?.[todayStr] || '');
      setIsDayCompleted((habit.completedDates || []).includes(todayStr));
    }
  }, [habit, todayStr]);

  if (!isOpen || !habit) return null;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;

  const totalCompletedCount = completedSet.size;
  const streakCount = habit.streakCount || 0;
  const breakCount = habit.breakCount || 0;

  const handleSelectDay = (dayStr: string) => {
    setSelectedDateStr(dayStr);
    setNoteInput(notesMap[dayStr] || '');
    setIsDayCompleted(completedSet.has(dayStr));
  };

  const handleSaveDayNote = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId: habit.id,
          date: selectedDateStr,
          completed: isDayCompleted,
          note: noteInput.trim() || null,
        }),
      });

      if (res.ok) {
        // Update local completed set & notes map
        setCompletedSet((prev) => {
          const next = new Set(prev);
          if (isDayCompleted) next.add(selectedDateStr);
          else next.delete(selectedDateStr);
          return next;
        });

        setNotesMap((prev) => ({
          ...prev,
          [selectedDateStr]: noteInput.trim(),
        }));

        if (onUpdated) onUpdated();
      }
    } catch (err) {
      console.error('Error saving day note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa thói quen "${habit.title}" không?`)) {
      onDelete(habit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-4xl modern-card bg-white dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 relative overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-start gap-4 pr-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-3xl flex-shrink-0">
              {habit.icon === 'Dumbbell' ? '🏋️' : habit.icon === 'Smile' ? '🪥' : habit.icon === 'Book' ? '📚' : habit.icon === 'Cooking' ? '🍱' : '✨'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {habit.title}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold whitespace-nowrap">
                  {habit.timeOfDay === 'MORNING' ? 'Buổi Sáng 🌅' : habit.timeOfDay === 'EVENING' ? 'Buổi Tối 🌙' : 'Linh hoạt ⚡'}
                </span>
              </div>
              {habit.description && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats Row: Streak & Break count */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Chuỗi Kỷ Luật</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-500">
                {streakCount} ngày 🔥
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                <AlertTriangle className="w-4 h-4" />
                <span>Số Lần Đứt Quãng</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-rose-500">
                {breakCount} lần ⚠️
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tổng Đã Xong</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                {totalCompletedCount} lần ✨
              </div>
            </div>
          </div>

          {/* Expanded 30-Day Calendar Heatmap with Notes Support */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 text-sm">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                <span>Lịch Sử & Ghi Chú Theo Ngày ({format(currentDate, 'MMMM yyyy', { locale: vi })})</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                👉 Nhấp vào bất kỳ ngày nào để thêm ghi chú (vd: "Chạy 5km", "Đá bóng"...)
              </span>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span>Thứ 2</span>
              <span>Thứ 3</span>
              <span>Thứ 4</span>
              <span>Thứ 5</span>
              <span>Thứ 6</span>
              <span>Thứ 7</span>
              <span>Chủ Nhật</span>
            </div>

            {/* Grid of Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[72px] sm:min-h-[86px] rounded-xl bg-slate-200/20 dark:bg-slate-900/20 opacity-30" />
              ))}

              {daysInMonth.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isDone = completedSet.has(dayStr);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDateStr === dayStr;
                const noteText = notesMap[dayStr];

                return (
                  <div
                    key={dayStr}
                    onClick={() => handleSelectDay(dayStr)}
                    className={`min-h-[72px] sm:min-h-[86px] p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-left group relative ${
                      isSelected
                        ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/10 shadow-md'
                        : isDone
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:border-emerald-500'
                        : isToday
                        ? 'bg-amber-500/5 border-amber-500/30 text-amber-500'
                        : 'bg-white dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {/* Top Row: Day Number & Status */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-extrabold ${isSelected ? 'text-amber-400' : isDone ? 'text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {format(day, 'd')}
                      </span>

                      {isDone && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Note pill rendering inside cell */}
                    {noteText ? (
                      <div className="mt-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold truncate tracking-tight shadow-sm" title={noteText}>
                        ✍️ {noteText}
                      </div>
                    ) : isDone ? (
                      <span className="text-[10px] text-emerald-500/70 font-semibold truncate">Hoàn thành</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Note Editor Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-slate-900 border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  Ghi chú ngày {format(new Date(selectedDateStr), 'dd/MM/yyyy')} 📝
                </h4>
              </div>

              {/* Completion Toggle button */}
              <button
                type="button"
                onClick={() => setIsDayCompleted(!isDayCompleted)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isDayCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isDayCompleted ? 'Đã hoàn thành ngày này' : 'Chưa hoàn thành'}</span>
              </button>
            </div>

            {/* Note text input */}
            <div className="space-y-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Nhập ghi chú cho ngày này (VD: Chạy 5km, Đá bóng với công ty, Đọc 20 trang sách...)"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />

              {/* Quick Preset Tags */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
                  Gợi ý nhanh:
                </span>
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setNoteInput(tag);
                      setIsDayCompleted(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 font-bold text-xs whitespace-nowrap transition-all border border-slate-300/40 dark:border-slate-700/50 flex-shrink-0"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Note Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveDayNote}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu Ghi Chú Ngày Này'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Actions: Delete & Close */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
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
