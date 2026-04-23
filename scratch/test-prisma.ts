import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`
console.log("DB URL:", dbUrl)
process.env.DATABASE_URL = dbUrl
const libsql = createClient({ url: dbUrl })
const adapter = new PrismaLibSql(libsql)

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
