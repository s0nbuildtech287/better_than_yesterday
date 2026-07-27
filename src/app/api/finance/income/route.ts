import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthYear = searchParams.get('monthYear') || new Date().toISOString().slice(0, 7)

    let income = await prisma.financeIncome.findUnique({
      where: { monthYear },
    })

    if (!income) {
      income = await prisma.financeIncome.create({
        data: {
          monthYear,
          monthlySalary: 7000000,
          bonusIncome: 0,
          totalIncome: 7000000,
        },
      })
    }

    return NextResponse.json({ success: true, data: income })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { monthYear, monthlySalary, bonusIncome } = body

    const targetMonth = monthYear || new Date().toISOString().slice(0, 7)
    const salary = parseFloat(monthlySalary) || 0
    const bonus = parseFloat(bonusIncome) || 0
    const total = salary + bonus

    const income = await prisma.financeIncome.upsert({
      where: { monthYear: targetMonth },
      update: {
        monthlySalary: salary,
        bonusIncome: bonus,
        totalIncome: total,
      },
      create: {
        monthYear: targetMonth,
        monthlySalary: salary,
        bonusIncome: bonus,
        totalIncome: total,
      },
    })

    return NextResponse.json({ success: true, data: income })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
