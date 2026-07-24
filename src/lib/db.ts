import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const DEFAULT_HABITS = [
  {
    id: 'habit-hygiene-morning',
    title: 'Vệ Sinh Cá Nhân Sáng ✨',
    description: 'Đánh răng, rửa mặt & skincare sáng đầy đủ năng lượng',
    category: 'HYGIENE_MORNING',
    icon: 'Sparkles',
    timeOfDay: 'MORNING',
    targetDaysPerWeek: 7,
  },
  {
    id: 'habit-hygiene-night',
    title: 'Vệ Sinh Cá Nhân Tối 🌙',
    description: 'Tẩy trang, đánh răng & dưỡng da ban đêm trước khi ngủ',
    category: 'HYGIENE_NIGHT',
    icon: 'Moon',
    timeOfDay: 'EVENING',
    targetDaysPerWeek: 7,
  },
  {
    id: 'habit-fitness',
    title: 'Tập Thể Dục 🏋️‍♂️',
    description: 'Chạy bộ, gym hoặc stretching ít nhất 20 phút',
    category: 'FITNESS',
    icon: 'Dumbbell',
    timeOfDay: 'ANYTIME',
    targetDaysPerWeek: 5,
  },
  {
    id: 'habit-learning',
    title: 'Học 1 Điều Mới 📚',
    description: 'Đọc sách, học tiếng Anh hoặc nghiên cứu 15 phút',
    category: 'LEARNING',
    icon: 'BookOpen',
    timeOfDay: 'ANYTIME',
    targetDaysPerWeek: 6,
  },
  {
    id: 'habit-mealprep',
    title: 'Nấu Cơm Mang Đi Làm 🍱',
    description: 'Tự tay nấu đồ ăn sạch, tiết kiệm và lành mạnh',
    category: 'MEAL_PREP',
    icon: 'Utensils',
    timeOfDay: 'MORNING',
    targetDaysPerWeek: 5,
  },
];
