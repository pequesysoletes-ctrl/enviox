const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    // This will create the database tables if they don't exist
    await prisma.$executeRawUnsafe(`SELECT 1`);
    console.log('DB connection OK');
  } catch (e) {
    console.error('DB error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
