import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const notes = await prisma.noteItem.findMany({
      orderBy: [
        { pinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });
    return NextResponse.json({ success: true, notes });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ success: true, notes: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, pinned } = body;

    const newNote = await prisma.noteItem.create({
      data: {
        title: title || 'Ghi chú mới',
        content: content || '# Ghi chú của tôi\n\n- Ý lớn H1\n- Ý nhỏ H2\n',
        category: category || 'GENERAL',
        pinned: pinned || false,
      },
    });

    return NextResponse.json({ success: true, note: newNote });
  } catch (error: any) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: error.message || 'Tạo ghi chú thất bại' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, category, pinned } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    const updatedNote = await prisma.noteItem.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(pinned !== undefined ? { pinned } : {}),
      },
    });

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error: any) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: error.message || 'Cập nhật ghi chú thất bại' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    await prisma.noteItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: error.message || 'Xóa ghi chú thất bại' }, { status: 500 });
  }
}
