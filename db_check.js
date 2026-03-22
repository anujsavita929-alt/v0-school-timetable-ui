const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.teacher.count().catch(() => 0);
  const classes = await prisma.classGroup.count().catch(() => 0);
  const periods = await prisma.periodSlot.count().catch(() => 0);
  const subjects = await prisma.subject.count().catch(() => 0);
  
  console.log(`Teachers: ${users}`);
  console.log(`Classes: ${classes}`);
  console.log(`Periods: ${periods}`);
  console.log(`Subjects: ${subjects}`);
}

check().then(() => prisma.$disconnect());
