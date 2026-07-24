import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format, subDays, startOfWeek, addDays } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

    // Fetch all active habits with their reward amounts
    const habits = await prisma.habit.findMany({
      where: { isActive: true },
      select: { id: true, rewardAmount: true },
    });

    const habitRewardMap = new Map<string, number>();
    habits.forEach((h: { id: string; rewardAmount: number }) => {
      habitRewardMap.set(h.id, h.rewardAmount || 1000);
    });

    // Get completions for today
    const completions = await prisma.habitCompletion.findMany({
      where: { logDate: dateStr, completed: true },
    });

    // Calculate today's total money saved/earned
    let savedToday = 0;
    completions.forEach((c: { habitId: string }) => {
      savedToday += habitRewardMap.get(c.habitId) || 1000;
    });

    // Calculate all-time total money saved
    const allCompletions = await prisma.habitCompletion.findMany({
      where: { completed: true },
      select: { habitId: true },
    });

    let savedTotal = 0;
    allCompletions.forEach((c: { habitId: string }) => {
      savedTotal += habitRewardMap.get(c.habitId) || 1000;
    });

    // Get daily log for notes, mood & proof image
    const dailyLog = await prisma.dailyLog.findUnique({
      where: { logDate: dateStr },
    });

    // Fetch all logs for streak calculation & calendar matrix
    const allLogs = await prisma.dailyLog.findMany({
      orderBy: { logDate: 'desc' },
      take: 365,
    });

    // Calculate real Streak Count
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDateStr = format(subDays(today, i), 'yyyy-MM-dd');
      const log = allLogs.find((l: { logDate: string; effortScore: number }) => l.logDate === checkDateStr);
      if (log && log.effortScore > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // Map of dateStr -> effortScore for monthly matrix
    const completedDatesMap: Record<string, number> = {};
    allLogs.forEach((l: { logDate: string; effortScore: number }) => {
      completedDatesMap[l.logDate] = l.effortScore;
    });

    // Calculate real Weekly Scores for Mon-Sun
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weeklyScores: { day: string; score: number; isToday: boolean }[] = [];
    const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    for (let i = 0; i < 7; i++) {
      const dayDate = addDays(currentWeekStart, i);
      const dayStr = format(dayDate, 'yyyy-MM-dd');
      const log = allLogs.find((l: { logDate: string; effortScore: number }) => l.logDate === dayStr);
      weeklyScores.push({
        day: DAY_NAMES[i],
        score: log ? log.effortScore : 0,
        isToday: dayStr === dateStr,
      });
    }

    return NextResponse.json({
      success: true,
      logDate: dateStr,
      completedHabitIds: completions.map((c: { habitId: string }) => c.habitId),
      dailyLog: dailyLog || null,
      streakCount: streak,
      completedDatesMap,
      weeklyScores,
      savedToday,
      savedTotal,
    });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({
      success: true,
      logDate: format(new Date(), 'yyyy-MM-dd'),
      completedHabitIds: [],
      dailyLog: null,
      streakCount: 0,
      completedDatesMap: {},
      weeklyScores: [],
      savedToday: 0,
      savedTotal: 0,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { habitId, date, completed, notes, mood, proofImageUrl } = body;
    const dateStr = date || format(new Date(), 'yyyy-MM-dd');

    if (habitId) {
      if (completed) {
        await prisma.habitCompletion.upsert({
          where: {
            habitId_logDate: {
              habitId,
              logDate: dateStr,
            },
          },
          update: { completed: true, completedAt: new Date() },
          create: {
            habitId,
            logDate: dateStr,
            completed: true,
          },
        });
      } else {
        await prisma.habitCompletion.deleteMany({
          where: { habitId, logDate: dateStr },
        });
      }
    }

    const totalHabitsCount = await prisma.habit.count({ where: { isActive: true } });
    const completedCount = await prisma.habitCompletion.count({
      where: { logDate: dateStr, completed: true },
    });

    const effortScore = totalHabitsCount > 0 ? Math.round((completedCount / totalHabitsCount) * 100) : 0;

    const updatedLog = await prisma.dailyLog.upsert({
      where: { logDate: dateStr },
      update: {
        effortScore,
        ...(notes !== undefined ? { notes } : {}),
        ...(mood !== undefined ? { mood } : {}),
        ...(proofImageUrl !== undefined ? { proofImageUrl } : {}),
      },
      create: {
        logDate: dateStr,
        effortScore,
        notes: notes || '',
        mood: mood || 'GOOD',
        proofImageUrl: proofImageUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      logDate: dateStr,
      effortScore,
      dailyLog: updatedLog,
    });
  } catch (error: any) {
    console.error('Error updating log:', error);
    return NextResponse.json({ error: error.message || 'Failed to update log' }, { status: 500 });
  }
}
