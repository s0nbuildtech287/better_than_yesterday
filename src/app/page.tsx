'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { WelcomeWidget } from '@/components/WelcomeWidget';
import { StreakStats } from '@/components/StreakStats';
import { EffortMatrix } from '@/components/EffortMatrix';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { HabitCard, HabitItem } from '@/components/HabitCard';
import { UploadModal } from '@/components/UploadModal';
import { AddHabitModal } from '@/components/AddHabitModal';
import { EmergencyMotivationModal } from '@/components/EmergencyMotivationModal';
import { PhotoGallery } from '@/components/PhotoGallery';
import { Sparkles, CheckCircle2, PlusCircle, X, Sun, Moon, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function HomePage() {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [completedDatesMap, setCompletedDatesMap] = useState<Record<string, number>>({});
  const [weeklyScores, setWeeklyScores] = useState<{ day: string; score: number; isToday: boolean }[]>([]);
  const [dailyLog, setDailyLog] = useState<{ proofImageUrl?: string | null; notes?: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Strict Isolated Views: ALL (Dashboard), HABITS, GALLERY, ANALYTICS, BADGES
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [filterTime, setFilterTime] = useState<string>('ALL'); // ALL, MORNING, EVENING, ANYTIME
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMotivationModalOpen, setIsMotivationModalOpen] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [habitsRes, logsRes] = await Promise.all([
        fetch('/api/habits'),
        fetch(`/api/logs?date=${todayStr}`),
      ]);

      const habitsData = await habitsRes.json();
      const logsData = await logsRes.json();

      if (habitsData.habits) {
        setHabits(habitsData.habits);
      }
      if (logsData.completedHabitIds) {
        setCompletedIds(logsData.completedHabitIds);
      }
      if (logsData.streakCount !== undefined) {
        setStreakCount(logsData.streakCount);
      }
      if (logsData.completedDatesMap) {
        setCompletedDatesMap(logsData.completedDatesMap);
      }
      if (logsData.weeklyScores) {
        setWeeklyScores(logsData.weeklyScores);
      }
      if (logsData.dailyLog) {
        setDailyLog(logsData.dailyLog);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleHabit = async (habitId: string, nextState: boolean) => {
    setCompletedIds((prev) =>
      nextState ? [...prev, habitId] : prev.filter((id) => id !== habitId)
    );

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId,
          date: todayStr,
          completed: nextState,
        }),
      });
      fetchData();
    } catch (err) {
      console.error('Error toggling habit:', err);
      fetchData();
    }
  };

  const handleUploadSuccess = (imageUrl: string, notes: string) => {
    setDailyLog((prev) => ({
      ...prev,
      proofImageUrl: imageUrl || prev?.proofImageUrl,
      notes: notes || prev?.notes,
    }));
  };

  // Filter habits based on time of day
  const filteredHabits = habits.filter((h) => {
    if (filterTime === 'ALL') return true;
    return h.timeOfDay === filterTime;
  });

  const completedCount = habits.filter((h) => completedIds.includes(h.id)).length;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Left Navigator Sidebar (Desktop) */}
      <Sidebar
        className="hidden md:flex"
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        streakCount={streakCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenMotivationModal={() => setIsMotivationModalOpen(true)}
      />

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm md:hidden flex">
          <div className="w-4/5 max-w-xs bg-white dark:bg-[#0E131F] h-full p-4 flex flex-col justify-between">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm">Menu Quản Lý</h3>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Sidebar
                className="w-full h-full border-none p-0"
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                streakCount={streakCount}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                onOpenAddModal={() => {
                  setIsAddModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                onOpenMotivationModal={() => {
                  setIsMotivationModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Main Content Area (Wide Layout - max-w-[1600px]) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <Header
          streakCount={streakCount}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenMotivationModal={() => setIsMotivationModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Content Container */}
        <main className="p-4 sm:p-8 max-w-[1600px] w-full mx-auto flex-1">
          
          {/* ==================== VIEW 1: TỔNG QUAN DASHBOARD ==================== */}
          {activeTab === 'ALL' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Welcome Greeting & Real-time Clock Widget */}
              <WelcomeWidget
                userName="Sơn"
                streakCount={streakCount}
                onOpenMotivationModal={() => setIsMotivationModalOpen(true)}
              />

              {/* Stats Bar */}
              <StreakStats
                streakCount={streakCount}
                totalHabits={habits.length}
                completedCount={completedCount}
                selectedFilter={filterTime}
                onFilterChange={setFilterTime}
              />

              {/* Habit Checklist Section (Compact Overview) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Thói Quen Cần Làm Hôm Nay</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Hôm nay
                    </span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('HABITS')}
                    className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
                  >
                    <span>Quản lý tất cả thói quen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="modern-card p-6 h-44 animate-pulse bg-slate-200/50 dark:bg-slate-800/50" />
                    ))}
                  </div>
                ) : habits.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {habits.slice(0, 4).map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        isCompleted={completedIds.includes(habit.id)}
                        onToggle={handleToggleHabit}
                        onUploadProof={() => setIsUploadModalOpen(true)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="modern-card p-10 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
                    <CheckCircle2 className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                    <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                      Chưa có thói quen nào
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                      Bấm nút bên dưới để tạo danh sách thói quen riêng của bạn!
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Thêm Thói Quen Mới</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==================== VIEW 2: QUẢN LÝ THÓI QUEN ==================== */}
          {activeTab === 'HABITS' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-slate-900 border border-amber-500/30">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Quản Lý Thói Quen Của Bạn ⚡
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Danh sách các thói quen vệ sinh, sức khỏe, nấu ăn và học tập bạn tự thiết lập
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Thói Quen Mới</span>
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'ALL', label: 'Tất Cả Thói Quen ✨' },
                  { id: 'MORNING', label: 'Buổi Sáng 🌅' },
                  { id: 'EVENING', label: 'Buổi Tối 🌙' },
                  { id: 'ANYTIME', label: 'Bất Kỳ Lúc Nào ⚡' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilterTime(t.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filterTime === t.id
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Habits Cards Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="modern-card p-6 h-44 animate-pulse bg-slate-200/50 dark:bg-slate-800/50" />
                  ))}
                </div>
              ) : filteredHabits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompleted={completedIds.includes(habit.id)}
                      onToggle={handleToggleHabit}
                      onUploadProof={() => setIsUploadModalOpen(true)}
                    />
                  ))}
                </div>
              ) : (
                <div className="modern-card p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
                  <CheckCircle2 className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                    Chưa có thói quen nào ở danh mục này
                  </h4>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tạo Thói Quen Mới</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ==================== VIEW 3: KHO ẢNH MINH CHỨNG ==================== */}
          {activeTab === 'GALLERY' && (
            <div className="space-y-6 animate-fadeIn">
              <PhotoGallery
                proofImageUrl={dailyLog?.proofImageUrl}
                notes={dailyLog?.notes}
                logDate={todayStr}
                onOpenUpload={() => setIsUploadModalOpen(true)}
              />
            </div>
          )}

          {/* ==================== VIEW 4: BIỂU ĐỒ & NỖ LỰC ==================== */}
          {activeTab === 'ANALYTICS' && (
            <div className="space-y-8 animate-fadeIn">
              <EffortMatrix
                completedCount={completedCount}
                totalCount={habits.length}
                streakCount={streakCount}
                completedDatesMap={completedDatesMap}
              />
            </div>
          )}

          {/* ==================== VIEW 5: HUY CHƯƠNG THÀNH TÍCH ==================== */}
          {activeTab === 'BADGES' && (
            <div className="space-y-8 animate-fadeIn">
              <AnalyticsCharts
                completedCount={completedCount}
                totalCount={habits.length}
                streakCount={streakCount}
                weeklyScores={weeklyScores}
              />
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        currentNotes={dailyLog?.notes || ''}
      />

      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={fetchData}
      />

      <EmergencyMotivationModal
        isOpen={isMotivationModalOpen}
        onClose={() => setIsMotivationModalOpen(false)}
      />

    </div>
  );
}
