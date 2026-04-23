import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
const db = new Database(dbPath)
const adapter = new PrismaBetterSqlite3(db)

const prisma = new PrismaClient({ adapter })

async function test() {
  try {
    const count = await prisma.organization.count()
    console.log("Organization count:", count)
  } catch (e) {
    console.error("Test failed:", e)
  } finally {
    await prisma.$disconnect()
  }
}

test()
