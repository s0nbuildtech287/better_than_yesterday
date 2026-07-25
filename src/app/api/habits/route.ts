import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format, subDays, addDays, differenceInDays } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const rawHabits = await prisma.habit.findMany({
      where: { isActive: true },
      include: {
        completions: {
          where: { completed: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const today = new Date(todayStr);

    const habits = rawHabits.map((h: any) => {
      const completedDatesSet = new Set<string>(h.completions.map((c: any) => c.logDate));
      const completionNotesMap: Record<string, string> = {};
      h.completions.forEach((c: any) => {
        if (c.note) {
          completionNotesMap[c.logDate] = c.note;
        }
      });

      // Calculate current streak for this habit
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const dStr = format(subDays(today, i), 'yyyy-MM-dd');
        if (completedDatesSet.has(dStr)) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      // Calculate break count
      let breakCount = 0;
      if (h.startDate) {
        if (h.startDate > todayStr) {
          breakCount = 0;
        } else {
          try {
            const start = new Date(h.startDate);
            const daysDiff = differenceInDays(today, start);
            let missed = 0;

            for (let i = 0; i <= daysDiff; i++) {
              const checkDate = addDays(start, i);
              const checkStr = format(checkDate, 'yyyy-MM-dd');

              if (checkStr < todayStr && !completedDatesSet.has(checkStr)) {
                missed++;
              }
            }
            breakCount = missed;
          } catch {
            breakCount = 0;
          }
        }
      }

      return {
        id: h.id,
        title: h.title,
        description: h.description,
        category: h.category,
        icon: h.icon,
        timeOfDay: h.timeOfDay,
        targetDaysPerWeek: h.targetDaysPerWeek,
        startDate: h.startDate,
        rewardAmount: h.rewardAmount || 1000,
        streakCount: streak,
        breakCount,
        completedDates: Array.from(completedDatesSet),
        completionNotesMap,
      };
    });

    return NextResponse.json({ habits }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, icon, timeOfDay, targetDaysPerWeek, startDate, rewardAmount } = body;

    if (!title) {
      return NextResponse.json({ error: 'Tên thói quen là bắt buộc' }, { status: 400 });
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        category: category || 'SỨC KHỎE',
        icon: icon || 'Sparkles',
        timeOfDay: timeOfDay || 'ANYTIME',
        targetDaysPerWeek: targetDaysPerWeek || 7,
        startDate: startDate || todayStr,
        rewardAmount: rewardAmount !== undefined ? parseInt(rewardAmount, 10) : 1000,
      },
    });

    return NextResponse.json({ success: true, habit }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, category, icon, timeOfDay, targetDaysPerWeek, startDate, rewardAmount } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    const updated = await prisma.habit.update({
      where: { id },
      data: {
        title,
        description,
        category,
        icon,
        timeOfDay,
        targetDaysPerWeek,
        startDate,
        rewardAmount: rewardAmount !== undefined ? parseInt(rewardAmount, 10) : 1000,
      },
    });

    return NextResponse.json({ success: true, habit: updated }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID thói quen là bắt buộc' }, { status: 400 });
    }

    await prisma.habitCompletion.deleteMany({
      where: { habitId: id },
    });

    await prisma.habit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
