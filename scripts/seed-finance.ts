import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding default Finance Jars & Monthly Income...')

  const monthYear = new Date().toISOString().slice(0, 7) // e.g. "2026-07"

  // 1. Seed or Upsert default income (7,000,000 VNĐ)
  await prisma.financeIncome.upsert({
    where: { monthYear },
    update: {},
    create: {
      monthYear,
      monthlySalary: 7000000,
      bonusIncome: 0,
      totalIncome: 7000000,
    },
  })

  // 2. Seed default 5 Jars if empty
  const count = await prisma.financeJar.count()
  if (count === 0) {
    const defaultJars = [
      {
        name: 'Tiết kiệm & Dự phòng',
        categoryKey: 'SAVINGS',
        percentage: 20,
        icon: 'PiggyBank',
        color: '#10b981', // Emerald
        currentBalance: 1400000,
      },
      {
        name: 'Đầu tư Cổ phiếu / Chứng khoán',
        categoryKey: 'STOCKS',
        percentage: 15,
        icon: 'TrendingUp',
        color: '#3b82f6', // Electric Blue
        currentBalance: 1050000,
      },
      {
        name: 'Đầu tư Kinh doanh / Side Hustle',
        categoryKey: 'BUSINESS',
        percentage: 15,
        icon: 'Briefcase',
        color: '#8b5cf6', // Purple
        currentBalance: 1050000,
      },
      {
        name: 'Quỹ Du lịch & Trải nghiệm',
        categoryKey: 'TRAVEL',
        percentage: 10,
        icon: 'Plane',
        color: '#ec4899', // Pink
        currentBalance: 700000,
      },
      {
        name: 'Chi tiêu Tự do & Thiết yếu',
        categoryKey: 'FREE_SPEND',
        percentage: 40,
        icon: 'ShoppingBag',
        color: '#f97316', // Orange
        currentBalance: 2800000,
      },
    ]

    for (const jar of defaultJars) {
      await prisma.financeJar.create({ data: jar })
    }
    console.log('✅ Created 5 default Finance Jars!')
  }

  console.log('✨ Finance Seeding Completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
