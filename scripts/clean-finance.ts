import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Xóa sạch dữ liệu Module Tài Chính trong Database...')

  await prisma.financeTransaction.deleteMany({})
  await prisma.financeJar.deleteMany({})
  await prisma.financeIncome.deleteMany({})

  console.log('✨ Dữ liệu Module Tài chính đã được làm sạch 100%! Bạn có thể bắt đầu tạo hũ mới từ 0.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
