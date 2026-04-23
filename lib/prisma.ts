import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import path from 'path'

// Resolve database path to an absolute path for local SQLite on Windows
const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
// Use forward slashes for file: URL (required by libsql)
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`
process.env.DATABASE_URL = dbUrl
console.log("Initializing LibSQL with URL:", dbUrl)

const libsql = createClient({
  url: dbUrl,
})

const adapter = new PrismaLibSql(libsql)

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma ?? new PrismaClient({
  adapter,
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
