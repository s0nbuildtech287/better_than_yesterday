import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format, subDays, addDays, differenceInDays, parseISO } from 'date-fns';

export async function GET() {
  try {
    const rawHabits = await prisma.habit.findMany({
      where: { isActive: true },
      include: {
        completions: {
          where: { completed: true },
          select: { logDate: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const today = new Date(todayStr);

    const habits = rawHabits.map((h: any) => {
      const completedDatesSet = new Set<string>(h.completions.map((c: any) => c.logDate));

      // Calculate current streak for this habit
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const dStr = format(subDays(today, i), 'yyyy-MM-dd');
        if (completedDatesSet.has(dStr)) {
          streak++;
        } else if (i > 0) {
          break; // streak breaks if missed a past day
        }
      }

      // Calculate break count precisely
      let breakCount = 0;
      if (h.startDate) {
        if (h.startDate > todayStr) {
          // Future start date -> 0 breaks
          breakCount = 0;
        } else {
          try {
            const start = new Date(h.startDate);
            const daysDiff = differenceInDays(today, start);
            let missed = 0;

            for (let i = 0; i <= daysDiff; i++) {
              const checkDate = addDays(start, i);
              const checkStr = format(checkDate, 'yyyy-MM-dd');

              // Only count missed days strictly BEFORE today
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
        streakCount: streak,
        breakCount,
        completedDates: Array.from(completedDatesSet),
      };
    });

    return NextResponse.json({ success: true, habits });
  } catch (error: any) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ success: true, habits: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, icon, timeOfDay, targetDaysPerWeek, startDate } = body;

    if (!title) {
      return NextResponse.json({ error: 'Tên thói quen là bắt buộc' }, { status: 400 });
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const newHabit = await prisma.habit.create({
      data: {
        title,
        description: description || '',
        category: category || 'CUSTOM',
        icon: icon || 'Sparkles',
        timeOfDay: timeOfDay || 'ANYTIME',
        targetDaysPerWeek: targetDaysPerWeek ? Number(targetDaysPerWeek) : 7,
        startDate: startDate || todayStr,
      },
    });

    return NextResponse.json({ success: true, habit: newHabit });
  } catch (error: any) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: error.message || 'Tạo thói quen thất bại' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, timeOfDay, icon, startDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(timeOfDay ? { timeOfDay } : {}),
        ...(icon ? { icon } : {}),
        ...(startDate ? { startDate } : {}),
      },
    });

    return NextResponse.json({ success: true, habit: updatedHabit });
  } catch (error: any) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ error: error.message || 'Cập nhật thói quen thất bại' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await prisma.habit.delete({ where: { id } });
    } else {
      await prisma.habitCompletion.deleteMany({});
      await prisma.dailyLog.deleteMany({});
      await prisma.habit.deleteMany({});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ error: error.message || 'Xóa thất bại' }, { status: 500 });
  }
}
