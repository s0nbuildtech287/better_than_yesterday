import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const jars = await prisma.financeJar.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        transactions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return NextResponse.json({ success: true, data: jars })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, categoryKey, percentage, icon, color, currentBalance } = body

    const newJar = await prisma.financeJar.create({
      data: {
        name: name || 'Hũ Mới',
        categoryKey: categoryKey || 'CUSTOM',
        percentage: parseFloat(percentage) || 10,
        icon: icon || 'PiggyBank',
        color: color || '#10b981',
        currentBalance: parseFloat(currentBalance) || 0,
      },
    })

    return NextResponse.json({ success: true, data: newJar })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { jars, singleJar } = body

    if (singleJar) {
      const updated = await prisma.financeJar.update({
        where: { id: singleJar.id },
        data: {
          name: singleJar.name,
          percentage: parseFloat(singleJar.percentage),
          color: singleJar.color,
          icon: singleJar.icon,
        },
      })
      return NextResponse.json({ success: true, data: updated })
    }

    if (!Array.isArray(jars)) {
      return NextResponse.json({ success: false, error: 'Invalid jars array' }, { status: 400 })
    }

    const updated = await Promise.all(
      jars.map((j: { id: string; percentage?: number; currentBalance?: number; name?: string }) => {
        return prisma.financeJar.update({
          where: { id: j.id },
          data: {
            ...(j.percentage !== undefined && { percentage: parseFloat(String(j.percentage)) }),
            ...(j.currentBalance !== undefined && { currentBalance: parseFloat(String(j.currentBalance)) }),
            ...(j.name !== undefined && { name: j.name }),
          },
        })
      })
    )

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing jar id' }, { status: 400 })
    }

    await prisma.financeJar.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Deleted jar successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
