const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.shop.updateMany({
  data: { onboardingStep: 0, onboardingCompleted: false, marketSyncError: null, lastMarketSync: null }
}).then(r => {
  console.log("Reset", r.count, "shops");
}).catch(e => console.error("Error:", e.message)).finally(() => p.$disconnect());
