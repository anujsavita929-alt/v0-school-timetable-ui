import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import path from 'path'

// Resolve database path to an absolute path for local SQLite on Windows
const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
// Use forward slashes for file: URL (required by libsql)
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`

const libsql = createClient({
  url: dbUrl,
})

const adapter = new PrismaLibSql(libsql)

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  // Clear existing data
  try { await prisma.timetableEntry.deleteMany(); } catch (e) {}
  try { await prisma.absence.deleteMany(); } catch (e) {}
  try { await prisma.periodSlot.deleteMany(); } catch (e) {}
  try { await prisma.subject.deleteMany(); } catch (e) {}
  try { await prisma.teacher.deleteMany(); } catch (e) {}
  try { await prisma.classGroup.deleteMany(); } catch (e) {}
  try { await prisma.organization.deleteMany(); } catch (e) {}
  try { await prisma.schoolConfig.deleteMany(); } catch (e) {}

  // Create default organization
  const organization = await prisma.organization.create({
    data: {
      name: 'MITS Gwalior',
      code: 'mits-gwalior',
      email: 'admin@mits.edu',
    },
  });

  // Create SchoolConfig
  const schoolConfig = await prisma.schoolConfig.create({
    data: {
      schoolName: 'MITS Gwalior',
      totalPeriodsPerDay: 8,
    },
  });

  // Create BellTimes
  const bellTimes = [
    { periodNumber: 1, label: 'Period 1', startTime: '08:00', endTime: '08:45', isBreak: false },
    { periodNumber: 2, label: 'Period 2', startTime: '08:45', endTime: '09:30', isBreak: false },
    { periodNumber: 3, label: 'Short Break', startTime: '09:30', endTime: '09:35', isBreak: true, breakLabel: 'Short Break' },
    { periodNumber: 4, label: 'Period 3', startTime: '09:35', endTime: '10:20', isBreak: false },
    { periodNumber: 5, label: 'Period 4', startTime: '10:20', endTime: '11:05', isBreak: false },
    { periodNumber: 6, label: 'Lunch', startTime: '11:05', endTime: '12:05', isBreak: true, breakLabel: 'Lunch' },
    { periodNumber: 7, label: 'Period 5', startTime: '12:05', endTime: '12:50', isBreak: false },
    { periodNumber: 8, label: 'Period 6', startTime: '12:50', endTime: '13:35', isBreak: false },
    { periodNumber: 9, label: 'Period 7', startTime: '13:35', endTime: '14:20', isBreak: false },
  ];

  for (const bt of bellTimes) {
    await prisma.bellTime.create({
      data: {
        ...bt,
        schoolConfigId: schoolConfig.id,
      },
    });
  }

  // Create Labs
  const labs = [
    { name: 'Physics Lab', labType: 'Science', capacity: 30 },
    { name: 'Chemistry Lab', labType: 'Science', capacity: 30 },
    { name: 'Computer Lab', labType: 'Computer', capacity: 30 },
    { name: 'Electronics Lab', labType: 'Engineering', capacity: 30 },
    { name: 'Workshop', labType: 'Engineering', capacity: 50 },
  ];

  for (const lab of labs) {
    await prisma.lab.create({
      data: {
        ...lab,
        schoolConfigId: schoolConfig.id,
      },
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
