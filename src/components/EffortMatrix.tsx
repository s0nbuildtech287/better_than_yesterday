'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, TrendingUp, Calendar, Zap } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

interface EffortMatrixProps {
  completedCount: number;
  totalCount: number;
  streakCount: number;
  completedDatesMap?: Record<string, number>;
}

export const EffortMatrix: React.FC<EffortMatrixProps> = ({
  completedCount,
  totalCount,
  streakCount,
  completedDatesMap = {},
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get leading empty slots for Monday start
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;

  // Real effort metrics from database
  const totalEffortDaysInMonth = daysInMonth.filter((d) => {
    const dStr = format(d, 'yyyy-MM-dd');
    return (completedDatesMap[dStr] || 0) > 0;
  }).length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Column 1 & 2: Interactive 30-Day Calendar Matrix */}
      <div className="xl:col-span-2 modern-card p-6 border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0D1117] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Ma Trận Nỗ Lực Thực Tế</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị tiến độ hoàn thành thói quen thực tế từ Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize mr-2">
              {format(currentDate, 'MMMM yyyy', { locale: vi })}
            </span>
          </div>
        </div>

        {/* 30-Day Monthly Calendar Grid */}
        <div className="mb-4">
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 dark:text-slate-500 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>CN</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 text-center">
            
            {/* Empty slots before day 1 */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-transparent opacity-30" />
            ))}

            {/* Month days */}
            {daysInMonth.map((day) => {
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDay);
              const dayNum = format(day, 'd');
              const dateStr = format(day, 'yyyy-MM-dd');
              
              // Real score from database
              const score = completedDatesMap[dateStr] || (isToday && completedCount > 0 ? Math.round((completedCount / (totalCount || 1)) * 100) : 0);
              const isDone = score > 0;

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDay(day)}
                  className={`h-12 sm:h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-between transition-all transform active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/30 ring-2 ring-amber-400'
                      : isToday
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/50 text-amber-500 font-extrabold'
                      : isDone
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">{dayNum}</span>
                  {isDone ? (
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`} />
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-200' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Day Status */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ngày chọn: {format(selectedDay, 'dd/MM/yyyy')}</span>
          </span>
          <span className="text-amber-500 font-bold">
            {isSameDay(selectedDay, new Date()) 
              ? `Hôm nay: Đã xong ${completedCount}/${totalCount} thói quen` 
              : (completedDatesMap[format(selectedDay, 'yyyy-MM-dd')] || 0) > 0 
              ? `Nỗ lực: ${completedDatesMap[format(selectedDay, 'yyyy-MM-dd')]}%`
              : 'Chưa ghi nhận thói quen'}
          </span>
        </div>

      </div>

      {/* Column 3: Real Effort Indicators */}
      <div className="modern-card p-6 border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0D1117] flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Chỉ Số Kỷ Luật Thực Tế
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thống kê 100% từ Database Supabase
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Tổng thói quen bạn đã tạo:</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{totalCount} thói quen</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Số ngày có ghi nhận nỗ lực:</div>
              <div className="text-xl font-extrabold text-emerald-400">{totalEffortDaysInMonth} ngày</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Chuỗi ngày kỷ luật liên tục:</div>
              <div className="text-xl font-extrabold text-amber-400">{streakCount} ngày liên tục 🔥</div>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-indigo-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Kỷ Luật Thực Sự</span>
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            &ldquo;Không dùng dữ liệu ảo. Hãy bấm nút [+ Thêm Thói Quen Mới] để tạo danh sách thói quen riêng của chính bạn!&rdquo;
          </p>
        </div>

      </div>

    </div>
  );
};
