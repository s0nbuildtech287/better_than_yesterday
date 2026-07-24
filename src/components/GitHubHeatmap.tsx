'use client';

import React, { useState } from 'react';
import { Sparkles, Flame, Trophy, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { subDays, format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface HeatmapDay {
  date: Date;
  dateStr: string;
  count: number;
  score: number; // 0 to 100
}

interface GitHubHeatmapProps {
  completedDates?: Record<string, number>;
}

export const GitHubHeatmap: React.FC<GitHubHeatmapProps> = ({
  completedDates = {},
}) => {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Generate 52 weeks (364 days) of historical data for authentic GitHub feel
  const weeksCount = 52;
  const totalDaysCount = weeksCount * 7;
  const today = new Date();

  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  for (let i = totalDaysCount - 1; i >= 0; i--) {
    const d = subDays(today, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const score = completedDates[dateStr] || 0;

    currentWeek.push({
      date: d,
      dateStr,
      count: Math.round((score / 100) * 5),
      score,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // GitHub authentic color palette
  const getCellColor = (score: number) => {
    if (score === 0) return 'bg-[#161B22] border-[#30363D]/40';
    if (score <= 25) return 'bg-[#0E4429] border-[#0E4429]';
    if (score <= 50) return 'bg-[#006D32] border-[#006D32]';
    if (score <= 75) return 'bg-[#26A641] border-[#26A641]';
    return 'bg-[#39D353] border-[#39D353] shadow-sm shadow-[#39D353]/50';
  };

  // Month labels positioning
  const monthLabels: { name: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, wIdx) => {
    const month = w[0].date.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        name: format(w[0].date, 'MMM', { locale: vi }),
        weekIndex: wIdx,
      });
      lastMonth = month;
    }
  });

  const totalEffortDays = weeks.flat().filter((d) => d.score > 0).length;

  return (
    <div className="modern-card p-6 border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0D1117]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Lịch Đóng Góp Activity Heatmap (GitHub Style)</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Theo dõi sự nỗ lực liên tục trong 52 tuần qua (364 ngày)
          </p>
        </div>

        {/* GitHub Color Legend */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>Ít</span>
          <div className="flex items-center gap-[3px]">
            <div className="w-[11px] h-[11px] rounded-[2px] bg-[#161B22] border border-[#30363D]" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-[#0E4429]" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-[#006D32]" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-[#26A641]" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-[#39D353]" />
          </div>
          <span>Nhiều 🔥</span>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Heatmap Graph (Left) + Stats & Insights Panel (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-6 items-stretch">
        
        {/* Left: 52-Week GitHub Heatmap Graph */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B22]/50 border border-slate-200 dark:border-[#30363D]/60 flex flex-col justify-between">
          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <div className="inline-block min-w-max">
              
              {/* Month Header Labels Row */}
              <div className="flex text-[10px] text-slate-400 mb-1 ml-7 font-mono relative h-4">
                {monthLabels.map((m, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${m.weekIndex * 13.5}px` }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              {/* Graph Grid */}
              <div className="flex items-start gap-2">
                
                {/* Days of week labels */}
                <div className="flex flex-col gap-[3px] text-[9px] font-mono text-slate-500 dark:text-slate-400 pt-[1px] select-none">
                  <span className="h-[10px] leading-[10px]">T2</span>
                  <span className="h-[10px] leading-[10px] opacity-0">-</span>
                  <span className="h-[10px] leading-[10px]">T4</span>
                  <span className="h-[10px] leading-[10px] opacity-0">-</span>
                  <span className="h-[10px] leading-[10px]">T6</span>
                  <span className="h-[10px] leading-[10px] opacity-0">-</span>
                  <span className="h-[10px] leading-[10px] opacity-0">-</span>
                </div>

                {/* Tight 52 Weeks Grid */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px]">
                      {week.map((day) => (
                        <div
                          key={day.dateStr}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-[10px] h-[10px] rounded-[2px] border transition-all cursor-pointer hover:ring-1 hover:ring-white ${getCellColor(
                            day.score
                          )}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>

          {/* Hover Info Footer */}
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#30363D]/60 flex items-center justify-between text-xs font-mono">
            <div className="text-slate-600 dark:text-slate-400">
              {hoveredDay ? (
                <span className="text-emerald-400 font-bold">
                  {hoveredDay.score > 0
                    ? `${hoveredDay.score}% nỗ lực vào ngày ${format(hoveredDay.date, 'dd/MM/yyyy')}`
                    : `Không có nỗ lực vào ngày ${format(hoveredDay.date, 'dd/MM/yyyy')}`}
                </span>
              ) : (
                <span>Di chuột lên từng ô để xem tiến độ nỗ lực</span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">52 tuần liên tiếp</span>
          </div>
        </div>

        {/* Right: Activity Insights Summary Panel (Fills the right space completely!) */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Chỉ Số Kỷ Luật Năm
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
              364 Ngày Đã Ghi Nhận
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Tổng ngày nỗ lực</span>
              <div className="text-xl font-extrabold text-emerald-400 font-sans mt-0.5 flex items-center gap-1">
                <span>{totalEffortDays}</span>
                <span className="text-xs text-slate-400 font-normal">ngày</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Chuỗi kỷ lục</span>
              <div className="text-xl font-extrabold text-amber-400 font-sans mt-0.5 flex items-center gap-1">
                <span>14</span>
                <span className="text-xs text-slate-400 font-normal">ngày liên tục 🔥</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Tỉ lệ kỷ luật</span>
              <div className="text-xl font-extrabold text-indigo-400 font-sans mt-0.5">
                88%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Trạng thái</span>
              <div className="text-xs font-bold text-emerald-400 font-sans mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đang Giữ Vững ⚡</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium leading-relaxed">
            💡 <strong>Mẹo duy trì kỷ luật:</strong> Đừng bao giờ bỏ lỡ 2 ngày liên tiếp! Dù hôm nay mệt quá, hãy làm ít nhất 1 thói quen nhẹ 2 phút để giữ ô màu xanh.
          </div>
        </div>

      </div>

    </div>
  );
};
