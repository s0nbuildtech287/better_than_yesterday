'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { WelcomeWidget } from '@/components/WelcomeWidget';
import { StreakStats } from '@/components/StreakStats';
import { SavingsVault } from '@/components/SavingsVault';
import { EffortMatrix } from '@/components/EffortMatrix';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { HabitCard, HabitItem } from '@/components/HabitCard';
import { TodoListManager } from '@/components/TodoListManager';
import { RichNotesEditor } from '@/components/RichNotesEditor';
import { UploadModal } from '@/components/UploadModal';
import { AddHabitModal } from '@/components/AddHabitModal';
import { EditHabitModal } from '@/components/EditHabitModal';
import { HabitDetailModal } from '@/components/HabitDetailModal';
import { EmergencyMotivationModal } from '@/components/EmergencyMotivationModal';
import { PhotoGallery } from '@/components/PhotoGallery';
import { AuthModal } from '@/components/AuthModal';
import { 
  Sparkles, CheckCircle2, PlusCircle, X, ArrowRight, 
  Compass, LogIn, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { format } from 'date-fns';
import { SyncClient } from '@/lib/syncClient';
import { 
  MOCK_HABITS, MOCK_COMPLETED_IDS, generateMockCompletedDatesMap, 
  MOCK_WEEKLY_SCORES 
} from '@/lib/mockData';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; fullName: string } | null>(null);

  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [savedToday, setSavedToday] = useState<number>(0);
  const [savedTotal, setSavedTotal] = useState<number>(0);
  const [completedDatesMap, setCompletedDatesMap] = useState<Record<string, number>>({});
  const [weeklyScores, setWeeklyScores] = useState<{ day: string; score: number; isToday: boolean }[]>([]);
  const [dailyLog, setDailyLog] = useState<{ proofImageUrl?: string | null; notes?: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Navigation tabs: ALL (Dashboard), HABITS, NOTES, GALLERY, ANALYTICS, BADGES
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [filterTime, setFilterTime] = useState<string>('ALL');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMotivationModalOpen, setIsMotivationModalOpen] = useState(false);
  
  // Habit Detail & Edit Modals state
  const [selectedHabitForDetail, setSelectedHabitForDetail] = useState<HabitItem | null>(null);
  const [selectedHabitForEdit, setSelectedHabitForEdit] = useState<HabitItem | null>(null);

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authReason, setAuthReason] = useState<string>('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Check Auth & Guest Mode
  useEffect(() => {
    const isAuth = localStorage.getItem('bty_auth');
    const guestFlag = localStorage.getItem('bty_guest');
    const userRaw = localStorage.getItem('bty_current_user');

    if (isAuth === 'true') {
      setIsAuthenticated(true);
      setIsGuest(false);
      if (userRaw) {
        try {
          setCurrentUser(JSON.parse(userRaw));
        } catch {
          setCurrentUser({ username: 'xu4ns0n', fullName: 'Nguyễn Xuân Sơn' });
        }
      } else {
        setCurrentUser({ username: 'xu4ns0n', fullName: 'Nguyễn Xuân Sơn' });
      }
    } else {
      // Allow guest exploration seamlessly
      setIsAuthenticated(false);
      setIsGuest(true);
      loadMockGuestData();
    }
  }, []);

  const loadMockGuestData = () => {
    setIsLoading(true);
    setHabits(MOCK_HABITS as unknown as HabitItem[]);
    setCompletedIds(MOCK_COMPLETED_IDS);
    setStreakCount(28);
    setSavedToday(45000);
    setSavedTotal(1450000);
    setCompletedDatesMap(generateMockCompletedDatesMap());
    setWeeklyScores(MOCK_WEEKLY_SCORES);
    setDailyLog({
      proofImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
      notes: 'Chạy bộ 5km công viên sáng sớm và hoàn thành mục tiêu tập luyện!',
    });
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bty_auth');
    localStorage.removeItem('bty_current_user');
    localStorage.setItem('bty_guest', 'true');
    document.cookie = 'bty_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsAuthenticated(false);
    setIsGuest(true);
    loadMockGuestData();
  };

  const handleAuthSuccess = (username: string) => {
    setIsAuthenticated(true);
    setIsGuest(false);
    const userRaw = localStorage.getItem('bty_current_user');
    if (userRaw) {
      try {
        setCurrentUser(JSON.parse(userRaw));
      } catch {
        setCurrentUser({ username, fullName: username });
      }
    }
    fetchData();
  };

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

      // 1. Try SyncClient (Google Sheets / Java Backend)
      const syncData = await SyncClient.fetchAllData(currentUser?.username);
      if (syncData && syncData.habits && syncData.habits.length > 0) {
        setHabits(syncData.habits);
        if (syncData.completedHabitIds) setCompletedIds(syncData.completedHabitIds);
        if (syncData.streakCount !== undefined) setStreakCount(syncData.streakCount);
        if (syncData.savedToday !== undefined) setSavedToday(syncData.savedToday);
        if (syncData.savedTotal !== undefined) setSavedTotal(syncData.savedTotal);
        if (syncData.completedDatesMap) setCompletedDatesMap(syncData.completedDatesMap);
        setIsLoading(false);
        return;
      }

      // 2. Fallback to local Next.js API
      const [habitsRes, logsRes] = await Promise.all([
        fetch('/api/habits', { cache: 'no-store' }),
        fetch(`/api/logs?date=${todayStr}`, { cache: 'no-store' }),
      ]);

      const habitsData = await habitsRes.json();
      const logsData = await logsRes.json();

      if (habitsData.habits && habitsData.habits.length > 0) {
        setHabits(habitsData.habits);
      } else {
        setHabits(MOCK_HABITS as unknown as HabitItem[]);
      }

      if (logsData.completedHabitIds) {
        setCompletedIds(logsData.completedHabitIds);
      }
      if (logsData.streakCount !== undefined) {
        setStreakCount(logsData.streakCount);
      }
      if (logsData.savedToday !== undefined) {
        setSavedToday(logsData.savedToday);
      }
      if (logsData.savedTotal !== undefined) {
        setSavedTotal(logsData.savedTotal);
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
      loadMockGuestData();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleToggleHabit = async (habitId: string, nextState: boolean) => {
    if (isGuest) {
      // Toggle locally for demo feedback
      setCompletedIds((prev) =>
        nextState ? [...prev, habitId] : prev.filter((id) => id !== habitId)
      );
      setAuthReason('Bạn đang ở chế độ Trải nghiệm Khách. Hãy Đăng nhập hoặc Đăng ký để lưu chuỗi thói quen thực tế nhé!');
      setIsAuthModalOpen(true);
      return;
    }

    setCompletedIds((prev) =>
      nextState ? [...prev, habitId] : prev.filter((id) => id !== habitId)
    );

    // Sync to Google Sheets & Java Backend
    SyncClient.postAction({
      action: 'toggleLog',
      habitId,
      completed: nextState,
      date: todayStr,
    });

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
    }
  };

  const handleOpenAddHabit = () => {
    if (isGuest) {
      setAuthReason('Vui lòng Đăng nhập hoặc Tạo tài khoản để bắt đầu thêm các thói quen cá nhân!');
      setIsAuthModalOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleOpenUploadProof = () => {
    if (isGuest) {
      setAuthReason('Vui lòng Đăng nhập hoặc Tạo tài khoản để tải ảnh minh chứng lên kho lưu trữ cá nhân!');
      setIsAuthModalOpen(true);
      return;
    }
    setIsUploadModalOpen(true);
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (isGuest) {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      return;
    }
    try {
      await fetch(`/api/habits?id=${habitId}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  const handleUploadSuccess = (imageUrl: string, notes: string) => {
    setDailyLog((prev) => ({
      ...prev,
      proofImageUrl: imageUrl || prev?.proofImageUrl,
      notes: notes || prev?.notes,
    }));
  };

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
          if (tab === 'FINANCE') {
            router.push('/tai-chinh');
          } else {
            setActiveTab(tab);
          }
          setIsMobileMenuOpen(false);
        }}
        streakCount={streakCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAddModal={handleOpenAddHabit}
        onOpenMotivationModal={() => setIsMotivationModalOpen(true)}
        onLogout={handleLogout}
        isGuest={isGuest}
        onOpenAuth={() => {
          setAuthReason('Đăng nhập hoặc Đăng ký tài khoản để quản lý thói quen cá nhân của riêng bạn');
          setIsAuthModalOpen(true);
        }}
        currentUser={currentUser}
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
                  if (tab === 'FINANCE') {
                    router.push('/tai-chinh');
                  } else {
                    setActiveTab(tab);
                  }
                  setIsMobileMenuOpen(false);
                }}
                streakCount={streakCount}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                onOpenAddModal={() => {
                  handleOpenAddHabit();
                  setIsMobileMenuOpen(false);
                }}
                onOpenMotivationModal={() => {
                  setIsMotivationModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                onLogout={handleLogout}
                isGuest={isGuest}
                onOpenAuth={() => {
                  setAuthReason('Đăng nhập hoặc Đăng ký để lưu thói quen thực tế');
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        <Header
          streakCount={streakCount}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenAddModal={handleOpenAddHabit}
          onOpenMotivationModal={() => setIsMotivationModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          isGuest={isGuest}
          onOpenAuth={() => {
            setAuthReason('Đăng nhập hoặc Đăng ký để lưu trữ thói quen cá nhân');
            setIsAuthModalOpen(true);
          }}
          currentUser={currentUser}
        />

        {/* Guest Mode Notice Strip */}
        {isGuest && (
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-b border-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Compass className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
              <span className="truncate">
                Bạn đang ở <strong>Chế độ Khách (Guest Mode)</strong> — Dữ liệu hiển thị là mẫu thử nghiệm.
              </span>
            </div>
            <button
              onClick={() => {
                setAuthReason('Tạo tài khoản hoặc đăng nhập để bắt đầu lưu chuỗi thói quen thực tế của bạn');
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow hover:bg-amber-400 transition-all flex items-center gap-1 flex-shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập ngay</span>
            </button>
          </div>
        )}

        <main className="p-3.5 sm:p-8 max-w-[1600px] w-full mx-auto flex-1">
          
          {/* VIEW 1: TỔNG QUAN DASHBOARD */}
          {activeTab === 'ALL' && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <WelcomeWidget
                userName={currentUser?.fullName || currentUser?.username || (isGuest ? 'Khách Trải Nghiệm' : 'Sơn')}
                streakCount={streakCount}
                onOpenMotivationModal={() => setIsMotivationModalOpen(true)}
              />

              {/* Virtual Money Savings Vault Widget */}
              <SavingsVault
                savedToday={savedToday}
                savedTotal={savedTotal}
              />

              <StreakStats
                streakCount={streakCount}
                totalHabits={habits.length}
                completedCount={completedCount}
                selectedFilter={filterTime}
                onFilterChange={setFilterTime}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 whitespace-nowrap">
                    <span>Thói Quen Hôm Nay ({filteredHabits.length})</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                      Hôm nay
                    </span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('HABITS')}
                    className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors whitespace-nowrap"
                  >
                    <span>Quản lý tất cả</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="modern-card p-6 h-44 animate-pulse bg-slate-200/50 dark:bg-slate-800/50" />
                    ))}
                  </div>
                ) : filteredHabits.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {filteredHabits.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        isCompleted={completedIds.includes(habit.id)}
                        onToggle={handleToggleHabit}
                        onUploadProof={handleOpenUploadProof}
                        onClickDetail={(h) => setSelectedHabitForDetail(h)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="modern-card p-8 sm:p-10 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
                    <CheckCircle2 className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                    <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                      Chưa có thói quen nào
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                      Bấm nút bên dưới để tạo danh sách thói quen riêng của bạn!
                    </p>
                    <button
                      onClick={handleOpenAddHabit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md whitespace-nowrap"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Thêm Thói Quen Mới</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: QUẢN LÝ THÓI QUEN */}
          {activeTab === 'HABITS' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-slate-900 border border-amber-500/30">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    Quản Lý Thói Quen Của Bạn ⚡
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Nhấp vào thẻ thói quen để xem lịch sử check-in, số lần đứt quãng, chỉnh sửa hoặc xóa
                  </p>
                </div>

                <button
                  onClick={handleOpenAddHabit}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto whitespace-nowrap"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Thói Quen Mới</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'ALL', label: 'Tất cả ✨' },
                  { id: 'MORNING', label: 'Sáng 🌅' },
                  { id: 'EVENING', label: 'Tối 🌙' },
                  { id: 'ANYTIME', label: 'Linh hoạt ⚡' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilterTime(t.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                      filterTime === t.id
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="modern-card p-6 h-44 animate-pulse bg-slate-200/50 dark:bg-slate-800/50" />
                  ))}
                </div>
              ) : filteredHabits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {filteredHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompleted={completedIds.includes(habit.id)}
                      onToggle={handleToggleHabit}
                      onUploadProof={handleOpenUploadProof}
                      onClickDetail={(h) => setSelectedHabitForDetail(h)}
                    />
                  ))}
                </div>
              ) : (
                <div className="modern-card p-8 sm:p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
                  <CheckCircle2 className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                    Chưa có thói quen nào ở danh mục này
                  </h4>
                  <button
                    onClick={handleOpenAddHabit}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tạo Thói Quen Mới</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: GHI CHÚ & TODO LIST */}
          {activeTab === 'NOTES' && (
            <div className="space-y-8 animate-fadeIn">
              <TodoListManager />
              <RichNotesEditor />
            </div>
          )}

          {/* VIEW 4: KHO ẢNH MINH CHỨNG */}
          {activeTab === 'GALLERY' && (
            <div className="space-y-6 animate-fadeIn">
              <PhotoGallery
                proofImageUrl={dailyLog?.proofImageUrl}
                notes={dailyLog?.notes}
                logDate={todayStr}
                onOpenUpload={handleOpenUploadProof}
              />
            </div>
          )}

          {/* VIEW 5: BIỂU ĐỒ & NỖ LỰC */}
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

          {/* VIEW 6: HUY CHƯƠNG THÀNH TÍCH */}
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

      <EditHabitModal
        isOpen={!!selectedHabitForEdit}
        habit={selectedHabitForEdit}
        onClose={() => setSelectedHabitForEdit(null)}
        onUpdated={fetchData}
      />

      <HabitDetailModal
        isOpen={!!selectedHabitForDetail}
        habit={selectedHabitForDetail}
        onClose={() => setSelectedHabitForDetail(null)}
        onEdit={(h) => setSelectedHabitForEdit(h)}
        onDelete={handleDeleteHabit}
        onUpdated={fetchData}
      />

      <EmergencyMotivationModal
        isOpen={isMotivationModalOpen}
        onClose={() => setIsMotivationModalOpen(false)}
      />

      {/* Global Auth Modal for Guest Upgrading */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        reasonMessage={authReason}
      />

    </div>
  );
}
