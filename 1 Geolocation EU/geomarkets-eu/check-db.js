const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type='table'")
  .then(r => console.log("Tables:", JSON.stringify(r)))
  .catch(e => console.error("Error:", e.message))
  .finally(() => p.$disconnect());
