// ═══════════════════════════════════════════════════════════════
// Bot Filter — Detect search engine crawlers and automated tools
// These should NEVER be redirected (SEO protection)
// ═══════════════════════════════════════════════════════════════

const BOT_PATTERNS = /bot|crawl|spider|slurp|archive|facebook|twitter|linkedin|whatsapp|telegram|preview|fetch|curl|wget|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|site24x7|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogou|exabot|ia_archiver|mj12bot|semrush|ahref|screaming.frog|chrome-lighthouse/i;

export function isBotUA(userAgent: string): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.test(userAgent);
}
