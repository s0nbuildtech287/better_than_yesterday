import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const habits = await prisma.habit.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
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
    const { title, description, category, icon, timeOfDay, targetDaysPerWeek } = body;

    if (!title) {
      return NextResponse.json({ error: 'Tên thói quen là bắt buộc' }, { status: 400 });
    }

    const newHabit = await prisma.habit.create({
      data: {
        title,
        description: description || '',
        category: category || 'CUSTOM',
        icon: icon || 'Sparkles',
        timeOfDay: timeOfDay || 'ANYTIME',
        targetDaysPerWeek: targetDaysPerWeek ? Number(targetDaysPerWeek) : 7,
      },
    });

    return NextResponse.json({ success: true, habit: newHabit });
  } catch (error: any) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: error.message || 'Tạo thói quen thất bại' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await prisma.habit.delete({ where: { id } });
    } else {
      // Clear all habits if requested
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
