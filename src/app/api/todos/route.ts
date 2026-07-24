import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const todos = await prisma.todoItem.findMany({
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json({ success: true, todos }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ success: true, todos: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, priority, dueDate } = body;

    if (!title) {
      return NextResponse.json({ error: 'Tiêu đề công việc là bắt buộc' }, { status: 400 });
    }

    const todo = await prisma.todoItem.create({
      data: {
        title,
        priority: priority || 'MEDIUM',
        dueDate: dueDate || null,
      },
    });

    return NextResponse.json({ success: true, todo }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, completed, priority, dueDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    const updated = await prisma.todoItem.update({
      where: { id },
      data: {
        title,
        completed,
        priority,
        dueDate,
      },
    });

    return NextResponse.json({ success: true, todo: updated }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    await prisma.todoItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
