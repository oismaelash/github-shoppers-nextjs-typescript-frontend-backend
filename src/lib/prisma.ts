import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL

  // During build time or if DATABASE_URL is not set, we might want to skip adapter initialization
  // or provide a dummy one if required.
  // However, Prisma 7 requires adapter if schema has no URL.
  
  // If we are in a build environment without DB, we might want to avoid crashing.
  // But typically Next.js apps with Prisma require DATABASE_URL to be set even for build 
  // if they access DB. If not accessing DB, we just need valid types.

  const pool = new Pool({ connectionString: connectionString || 'postgresql://dummy:dummy@localhost:5432/dummy' })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
