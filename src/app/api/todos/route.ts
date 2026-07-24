import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const todos = await prisma.todoItem.findMany({
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json({ success: true, todos });
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

    return NextResponse.json({ success: true, todo });
  } catch (error: any) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: error.message || 'Tạo công việc thất bại' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, completed, title, priority, dueDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    const updatedTodo = await prisma.todoItem.update({
      where: { id },
      data: {
        ...(completed !== undefined ? { completed } : {}),
        ...(title ? { title } : {}),
        ...(priority ? { priority } : {}),
        ...(dueDate !== undefined ? { dueDate } : {}),
      },
    });

    return NextResponse.json({ success: true, todo: updatedTodo });
  } catch (error: any) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: error.message || 'Cập nhật thất bại' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    await prisma.todoItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: error.message || 'Xóa thất bại' }, { status: 500 });
  }
}
