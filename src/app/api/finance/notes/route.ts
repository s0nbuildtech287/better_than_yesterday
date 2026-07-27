import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jarId = searchParams.get('jarId')

    if (!jarId) {
      return NextResponse.json({ success: false, error: 'Missing jarId parameter' }, { status: 400 })
    }

    const db = prisma as any
    const notes = await db.financeNote.findMany({
      where: { jarId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: notes })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jarId, content } = body

    if (!jarId || !content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Content cannot be empty' }, { status: 400 })
    }

    const db = prisma as any
    const newNote = await db.financeNote.create({
      data: {
        jarId,
        content: content.trim(),
      },
    })

    return NextResponse.json({ success: true, data: newNote })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing note id' }, { status: 400 })
    }

    const db = prisma as any
    await db.financeNote.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Deleted note successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
