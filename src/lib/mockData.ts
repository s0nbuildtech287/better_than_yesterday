export interface MockHabit {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  timeOfDay: string;
  targetDaysPerWeek: number;
  startDate: string;
  rewardAmount: number;
  isActive: boolean;
  completionsCount?: number;
  currentStreak?: number;
  breakCount?: number;
}

export const MOCK_HABITS: MockHabit[] = [
  {
    id: 'mock-habit-1',
    title: 'Vệ Sinh Sáng & Skincare ✨',
    description: 'Đánh răng, rửa mặt sữa bọt & dưỡng ẩm đầy đủ năng lượng ngày mới',
    category: 'HYGIENE_MORNING',
    icon: 'Sparkles',
    timeOfDay: 'MORNING',
    targetDaysPerWeek: 7,
    startDate: '2026-06-01',
    rewardAmount: 5000,
    isActive: true,
    completionsCount: 28,
    currentStreak: 28,
    breakCount: 0,
  },
  {
    id: 'mock-habit-2',
    title: 'Chạy Bộ 5km / Gym Thể Lực 🏋️‍♂️',
    description: 'Chạy bộ công viên hoặc đẩy tạ kích hoạt trao đổi chất & rèn ý chí',
    category: 'FITNESS',
    icon: 'Dumbbell',
    timeOfDay: 'ANYTIME',
    targetDaysPerWeek: 5,
    startDate: '2026-06-05',
    rewardAmount: 20000,
    isActive: true,
    completionsCount: 24,
    currentStreak: 12,
    breakCount: 2,
  },
  {
    id: 'mock-habit-3',
    title: 'Học Công Nghệ & Tiếng Anh 📚',
    description: '30 phút đọc tài liệu System Architecture hoặc luyện nghe Podcast IELTS',
    category: 'LEARNING',
    icon: 'BookOpen',
    timeOfDay: 'ANYTIME',
    targetDaysPerWeek: 6,
    startDate: '2026-06-10',
    rewardAmount: 15000,
    isActive: true,
    completionsCount: 26,
    currentStreak: 18,
    breakCount: 1,
  },
  {
    id: 'mock-habit-4',
    title: 'Nấu Cơm Healthy Mang Đi Làm 🍱',
    description: 'Tự nấu bữa trưa dinh dưỡng, sạch sẽ, tiết kiệm và kiểm soát calo',
    category: 'MEAL_PREP',
    icon: 'Utensils',
    timeOfDay: 'MORNING',
    targetDaysPerWeek: 5,
    startDate: '2026-06-12',
    rewardAmount: 35000,
    isActive: true,
    completionsCount: 20,
    currentStreak: 9,
    breakCount: 3,
  },
  {
    id: 'mock-habit-5',
    title: 'Uống Đủ 2L Nước Tinh Khiết 💧',
    description: 'Uống đều đặn từng ngụm trong ngày, hạn chế tối đa đồ ngọt nước có gas',
    category: 'CUSTOM',
    icon: 'Activity',
    timeOfDay: 'ANYTIME',
    targetDaysPerWeek: 7,
    startDate: '2026-06-15',
    rewardAmount: 5000,
    isActive: true,
    completionsCount: 28,
    currentStreak: 28,
    breakCount: 0,
  },
  {
    id: 'mock-habit-6',
    title: 'Skincare Tối & Ngủ Trước 23h 🌙',
    description: 'Tẩy trang sạch sâu, đọc 10 trang sách và đi ngủ sớm phục hồi tế bào não',
    category: 'HYGIENE_NIGHT',
    icon: 'Moon',
    timeOfDay: 'EVENING',
    targetDaysPerWeek: 7,
    startDate: '2026-06-01',
    rewardAmount: 10000,
    isActive: true,
    completionsCount: 25,
    currentStreak: 14,
    breakCount: 1,
  },
];

export const MOCK_COMPLETED_IDS = ['mock-habit-1', 'mock-habit-2', 'mock-habit-5'];

// Generate 364 days Heatmap data
export const generateMockCompletedDatesMap = (): Record<string, number> => {
  const map: Record<string, number> = {};
  const today = new Date();
  
  for (let i = 0; i < 364; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Create realistic pattern: high effort on weekdays, some breaks
    const dayOfWeek = d.getDay();
    const seed = (i * 37 + dayOfWeek * 13) % 100;
    
    if (i < 30) {
      // Recent month: very high consistency
      map[dateStr] = seed > 15 ? (seed > 60 ? 5 : seed > 35 ? 4 : 3) : 1;
    } else if (i < 120) {
      map[dateStr] = seed > 25 ? (seed > 50 ? 4 : 3) : (seed > 10 ? 2 : 0);
    } else {
      map[dateStr] = seed > 35 ? (seed > 70 ? 4 : 3) : (seed > 15 ? 1 : 0);
    }
  }
  return map;
};

export const MOCK_WEEKLY_SCORES = [
  { day: 'T2', score: 85, isToday: false },
  { day: 'T3', score: 100, isToday: false },
  { day: 'T4', score: 90, isToday: false },
  { day: 'T5', score: 75, isToday: false },
  { day: 'T6', score: 100, isToday: false },
  { day: 'T7', score: 80, isToday: false },
  { day: 'CN', score: 95, isToday: true },
];

export const MOCK_TODOS = [
  { id: 'todo-1', title: 'Hoàn thành bài tập thiết kế hệ thống Microservices', completed: true, priority: 'HIGH', dueDate: 'Hôm nay' },
  { id: 'todo-2', title: 'Đọc 2 chương sách Atomic Habits (Thói quen nguyên tử)', completed: false, priority: 'MEDIUM', dueDate: 'Tối nay' },
  { id: 'todo-3', title: 'Rà soát danh mục cổ phiếu & phân bổ quỹ lương tháng 11', completed: false, priority: 'HIGH', dueDate: 'Ngày mai' },
  { id: 'todo-4', title: 'Chuẩn bị thực đơn eat clean cho 3 ngày đầu tuần tới', completed: true, priority: 'LOW', dueDate: 'Hôm nay' },
];

export const MOCK_NOTES = [
  {
    id: 'note-1',
    title: '📌 5 Quy Tắc Kỷ Luật Vàng 2026',
    category: 'MỤC TIÊU',
    pinned: true,
    content: '### 1. Không bao giờ bỏ lỡ 2 ngày liên tiếp\nNếu hôm nay bận không chạy được 5km, ít nhất cũng phải chống đẩy 20 cái hoặc đi bộ 15 phút.\n\n### 2. Tiết kiệm trước, tiêu sau\nNgay khi lương về tài khoản, chuyển ngay 20% vào quỹ Đầu Tư Cổ Phiếu và 15% vào Quỹ Tiết Kiệm Dự Phòng.\n\n### 3. Tập trung vào tiến trình, không chỉ đích đến\nMỗi 1% cải thiện mỗi ngày sẽ nhân lên 37 lần sau một năm.'
  },
  {
    id: 'note-2',
    title: '💡 Kế Hoạch Đọc Sách & Phát Triển Bản Thân',
    category: 'HỌC TẬP',
    pinned: false,
    content: '- [x] Sách Deep Work — Cal Newport\n- [ ] Sách The Psychology of Money — Morgan Housel\n- [ ] Sách Designing Data-Intensive Applications'
  }
];

export const MOCK_FINANCE_INCOME = {
  id: 'mock-income-1',
  monthYear: '2026-11',
  monthlySalary: 18000000,
  bonusIncome: 4500000,
  totalIncome: 22500000,
};

export const MOCK_FINANCE_JARS = [
  {
    id: 'jar-1',
    name: 'Tiết Kiệm & Dự Phòng',
    categoryKey: 'SAVINGS',
    percentage: 20,
    icon: 'PiggyBank',
    color: '#10b981',
    currentBalance: 45000000,
    _count: { notes: 2 }
  },
  {
    id: 'jar-2',
    name: 'Đầu Tư Cổ Phiếu / Chứng Khoán',
    categoryKey: 'STOCKS',
    percentage: 30,
    icon: 'TrendingUp',
    color: '#06b6d4',
    currentBalance: 68500000,
    _count: { notes: 4 }
  },
  {
    id: 'jar-3',
    name: 'Đầu Tư Kinh Doanh & Side Hustle',
    categoryKey: 'BUSINESS',
    percentage: 15,
    icon: 'Briefcase',
    color: '#8b5cf6',
    currentBalance: 24200000,
    _count: { notes: 1 }
  },
  {
    id: 'jar-4',
    name: 'Quỹ Du Lịch & Trải Nghiệm',
    categoryKey: 'TRAVEL',
    percentage: 10,
    icon: 'Plane',
    color: '#f59e0b',
    currentBalance: 12000000,
    _count: { notes: 1 }
  },
  {
    id: 'jar-5',
    name: 'Chi Tiêu Tự Do & Sinh Hoạt',
    categoryKey: 'FREE_SPEND',
    percentage: 25,
    icon: 'ShoppingBag',
    color: '#ec4899',
    currentBalance: 8650000,
    _count: { notes: 3 }
  }
];

export const MOCK_FINANCE_TRANSACTIONS = [
  {
    id: 'tx-1',
    jarId: 'jar-2',
    type: 'IN' as const,
    amount: 6750000,
    description: 'Trích 30% thu nhập tháng vào tích sản cổ phiếu FPT & HPG',
    txDate: '2026-11-01',
    createdAt: '2026-11-01T08:00:00Z',
    jar: { name: 'Đầu Tư Cổ Phiếu / Chứng Khoán', color: '#06b6d4', icon: 'TrendingUp' }
  },
  {
    id: 'tx-2',
    jarId: 'jar-1',
    type: 'IN' as const,
    amount: 4500000,
    description: 'Nạp quỹ tiết kiệm khẩn cấp định kỳ',
    txDate: '2026-11-01',
    createdAt: '2026-11-01T08:05:00Z',
    jar: { name: 'Tiết Kiệm & Dự Phòng', color: '#10b981', icon: 'PiggyBank' }
  },
  {
    id: 'tx-3',
    jarId: 'jar-5',
    type: 'OUT' as const,
    amount: 850000,
    description: 'Đi chợ siêu thị mua thực phẩm healthy tuần đầu tháng',
    txDate: '2026-11-01',
    createdAt: '2026-11-01T10:30:00Z',
    jar: { name: 'Chi Tiêu Tự Do & Sinh Hoạt', color: '#ec4899', icon: 'ShoppingBag' }
  },
  {
    id: 'tx-4',
    jarId: 'jar-4',
    type: 'IN' as const,
    amount: 2250000,
    description: 'Tích lũy quỹ du lịch Đà Lạt cuối năm',
    txDate: '2026-11-01',
    createdAt: '2026-11-01T08:10:00Z',
    jar: { name: 'Quỹ Du Lịch & Trải Nghiệm', color: '#f59e0b', icon: 'Plane' }
  }
];

