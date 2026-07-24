'use client';

import React from 'react';
import { BarChart3, Trophy, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface WeeklyDayScore {
  day: string;
  score: number; // 0 to 100
  isToday: boolean;
}

interface AnalyticsChartsProps {
  completedCount: number;
  totalCount: number;
  streakCount: number;
  weeklyScores?: WeeklyDayScore[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  completedCount,
  totalCount,
  streakCount,
  weeklyScores = [],
}) => {
  const daysOfWeek = weeklyScores.length === 7 ? weeklyScores : [
    { day: 'T2', score: 0, isToday: false },
    { day: 'T3', score: 0, isToday: false },
    { day: 'T4', score: 0, isToday: false },
    { day: 'T5', score: 0, isToday: false },
    { day: 'T6', score: 0, isToday: false },
    { day: 'T7', score: 0, isToday: false },
    { day: 'CN', score: Math.round((completedCount / (totalCount || 1)) * 100), isToday: true },
  ];

  const avgScore = Math.round(daysOfWeek.reduce((acc, curr) => acc + curr.score, 0) / 7);

  const BADGES = [
    {
      title: 'Hộ Vệ Nụ Cười 🪥',
      desc: 'Đánh răng & Skincare 7 ngày liên tiếp',
      unlocked: streakCount >= 7,
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Đầu Bếp Kỷ Luật 🍱',
      desc: 'Nấu cơm mang đi làm 5 ngày/tuần',
      unlocked: streakCount >= 5,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Siêu Nhân Thể Chất 🏋️',
      desc: 'Tập thể dục liên tục 10 ngày',
      unlocked: streakCount >= 10,
      icon: <Zap className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: 'Bậc Thầy Tri Thức 📚',
      desc: 'Học 1 điều mới liên tục 14 ngày',
      unlocked: streakCount >= 14,
      icon: <Trophy className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Weekly Consistency Bar Chart */}
      <div className="modern-card p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Hiệu Suất Nỗ Lực Thực Tế Tuần Này (%)
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Trung bình {avgScore}%
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {daysOfWeek.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.score}%
                </span>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-t-xl overflow-hidden h-full flex items-end max-w-[40px]">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      item.isToday
                        ? 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-md shadow-amber-500/30'
                        : item.score > 0
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ height: `${Math.max(item.score, 4)}%` }}
                  />
                </div>

                <span className={`text-xs font-bold mt-2 ${
                  item.isToday ? 'text-amber-500 font-extrabold' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-2">
          💡 Dữ liệu biểu đồ cột được tính toán 100% từ kết quả check-in thói quen của bạn trong tuần.
        </p>
      </div>

      {/* Chart 2: Badges & Achievements Grid */}
      <div className="modern-card p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Huy Chương Thành Tích Thực Tế
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {BADGES.filter(b => b.unlocked).length}/{BADGES.length} Mở khóa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((badge, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  badge.unlocked
                    ? 'bg-slate-900/60 dark:bg-slate-800/60 border-amber-500/40 shadow-sm'
                    : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  badge.unlocked ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-slate-200 dark:bg-slate-800'
                }`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4">
          🏆 Tự tay tích lũy thói quen hàng ngày để mở khóa toàn bộ huy chương danh giá!
        </p>
      </div>

    </div>
  );
};
