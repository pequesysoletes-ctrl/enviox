const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.shop.findFirst().then(s => {
  if (!s) { console.log("No shop found"); return; }
  console.log("Shop:", s.shopDomain);
  console.log("Onboarding step:", s.onboardingStep);
  console.log("Onboarding completed:", s.onboardingCompleted);
  console.log("Last market sync:", s.lastMarketSync);
  console.log("Market sync error:", s.marketSyncError);
  return p.market.findMany({ where: { shopId: s.id } });
}).then(markets => {
  if (markets) {
    console.log("Markets in DB:", markets.length);
    markets.forEach(m => console.log(`  - ${m.name} (${m.shopifyMarketId}) enabled=${m.enabled}`));
  }
}).catch(e => console.error("Error:", e.message)).finally(() => p.$disconnect());
