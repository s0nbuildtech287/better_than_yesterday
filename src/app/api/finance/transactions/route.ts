import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jarId = searchParams.get('jarId')

    const transactions = await prisma.financeTransaction.findMany({
      where: jarId ? { jarId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        jar: {
          select: { name: true, color: true, icon: true },
        },
      },
      take: 50,
    })

    return NextResponse.json({ success: true, data: transactions })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jarId, type, amount, description, txDate } = body

    if (!jarId || !amount || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const parsedAmount = Math.abs(parseFloat(amount))
    const dateStr = txDate || new Date().toISOString().slice(0, 10)

    // Create transaction & update jar balance atomically
    const transaction = await prisma.financeTransaction.create({
      data: {
        jarId,
        type: type.toUpperCase(), // "IN" or "OUT"
        amount: parsedAmount,
        description: description || (type.toUpperCase() === 'IN' ? 'Nạp tiền vào hũ' : 'Chi tiêu từ hũ'),
        txDate: dateStr,
      },
    })

    const balanceDelta = type.toUpperCase() === 'IN' ? parsedAmount : -parsedAmount

    await prisma.financeJar.update({
      where: { id: jarId },
      data: {
        currentBalance: {
          increment: balanceDelta,
        },
      },
    })

    return NextResponse.json({ success: true, data: transaction })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
