import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('Clearing database...');
  await prisma.habitCompletion.deleteMany({});
  await prisma.dailyLog.deleteMany({});
  await prisma.habit.deleteMany({});
  await prisma.motivationalQuote.deleteMany({});
  console.log('Database cleared completely!');
}

clearDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
