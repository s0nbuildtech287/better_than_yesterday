import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const notes = await prisma.noteItem.findMany({
      orderBy: [
        { pinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });
    return NextResponse.json({ success: true, notes }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
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
        content: content || '',
        category: category || 'GENERAL',
        pinned: pinned || false,
      },
    });

    return NextResponse.json({ success: true, note: newNote }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, category, pinned } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID là bắt buộc' }, { status: 400 });
    }

    const updated = await prisma.noteItem.update({
      where: { id },
      data: {
        title,
        content,
        category,
        pinned,
      },
    });

    return NextResponse.json({ success: true, note: updated }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error updating note:', error);
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

    await prisma.noteItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
