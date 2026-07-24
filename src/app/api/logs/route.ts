import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format, subDays, startOfWeek, addDays } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

    const habits = await prisma.habit.findMany({
      where: { isActive: true },
      select: { id: true, rewardAmount: true },
    });

    const habitRewardMap = new Map<string, number>();
    habits.forEach((h: { id: string; rewardAmount: number }) => {
      habitRewardMap.set(h.id, h.rewardAmount || 1000);
    });

    const completions = await prisma.habitCompletion.findMany({
      where: { logDate: dateStr, completed: true },
    });

    const completedHabitIds = completions.map((c: { habitId: string }) => c.habitId);

    const savedToday = completedHabitIds.reduce((sum: number, hId: string) => {
      return sum + (habitRewardMap.get(hId) || 1000);
    }, 0);

    const allCompletions = await prisma.habitCompletion.findMany({
      where: { completed: true },
      select: { habitId: true },
    });

    const savedTotal = allCompletions.reduce((sum: number, c: { habitId: string }) => {
      return sum + (habitRewardMap.get(c.habitId) || 1000);
    }, 0);

    const today = new Date();
    let streakCount = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const dStr = format(checkDate, 'yyyy-MM-dd');

      const log = await prisma.dailyLog.findUnique({
        where: { logDate: dStr },
      });

      const dayCompletions = await prisma.habitCompletion.count({
        where: { logDate: dStr, completed: true },
      });

      if ((log && log.effortScore > 0) || dayCompletions > 0) {
        streakCount++;
      } else if (i > 0) {
        break;
      }
    }

    const allLogs = await prisma.dailyLog.findMany({
      orderBy: { logDate: 'desc' },
      take: 90,
    });

    const completedDatesMap: Record<string, number> = {};
    allLogs.forEach((l: { logDate: string; effortScore: number }) => {
      completedDatesMap[l.logDate] = l.effortScore;
    });

    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    const weeklyScores = await Promise.all(
      daysOfWeek.map(async (dayLabel, index) => {
        const dayDate = addDays(startOfCurrentWeek, index);
        const dayStr = format(dayDate, 'yyyy-MM-dd');
        const isToday = dayStr === dateStr;

        const dayLog = await prisma.dailyLog.findUnique({
          where: { logDate: dayStr },
        });

        const dayCompletionsCount = await prisma.habitCompletion.count({
          where: { logDate: dayStr, completed: true },
        });

        let score = dayLog ? dayLog.effortScore : 0;
        if (score === 0 && dayCompletionsCount > 0 && habits.length > 0) {
          score = Math.round((dayCompletionsCount / habits.length) * 100);
        }

        return {
          day: dayLabel,
          score,
          isToday,
        };
      })
    );

    const dailyLog = await prisma.dailyLog.findUnique({
      where: { logDate: dateStr },
    });

    return NextResponse.json({
      success: true,
      logDate: dateStr,
      completedHabitIds,
      streakCount,
      savedToday,
      savedTotal,
      completedDatesMap,
      weeklyScores,
      dailyLog,
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { habitId, date, completed } = body;

    const logDate = date || format(new Date(), 'yyyy-MM-dd');

    if (!habitId) {
      return NextResponse.json({ error: 'habitId là bắt buộc' }, { status: 400 });
    }

    if (completed) {
      await prisma.habitCompletion.upsert({
        where: {
          habitId_logDate: { habitId, logDate },
        },
        update: { completed: true },
        create: { habitId, logDate, completed: true },
      });
    } else {
      await prisma.habitCompletion.deleteMany({
        where: { habitId, logDate },
      });
    }

    const totalHabits = await prisma.habit.count({ where: { isActive: true } });
    const completedCount = await prisma.habitCompletion.count({
      where: { logDate, completed: true },
    });

    const effortScore = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

    await prisma.dailyLog.upsert({
      where: { logDate },
      update: { effortScore },
      create: { logDate, effortScore },
    });

    return NextResponse.json({
      success: true,
      completedCount,
      totalHabits,
      effortScore,
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error saving log:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
