// ═══════════════════════════════════════════════════════════════
// Markets Sync Service — Shopify Markets GraphQL
// Syncs merchant's Shopify Markets into our DB
// ═══════════════════════════════════════════════════════════════

import prisma from "~/db.server";

const MARKETS_QUERY = `
  query GetMarkets {
    markets(first: 50) {
      edges {
        node {
          id
          name
          enabled
          primary
          regions(first: 100) {
            edges {
              node {
                ... on MarketRegionCountry {
                  code
                  name
                }
              }
            }
          }
          webPresences(first: 5) {
            edges {
              node {
                rootUrls {
                  locale
                  url
                }
                defaultLocale {
                  locale
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface MarketNode {
  id: string;
  name: string;
  enabled: boolean;
  primary: boolean;
  regions: {
    edges: Array<{
      node: { code: string; name: string };
    }>;
  };
  webPresences: {
    edges: Array<{
      node: {
        rootUrls: Array<{ locale: string; url: string }>;
        defaultLocale: { locale: string };
      };
    }>;
  };
}

interface ParsedMarket {
  shopifyMarketId: string;
  name: string;
  enabled: boolean;
  primary: boolean;
  countryCodes: string[];
  rootUrl: string;
  defaultLocale: string;
  currency: string;
}

/**
 * Fetches markets from Shopify GraphQL API and syncs to our DB.
 * Uses upsert pattern — safe to call repeatedly.
 */
export async function syncMarkets(
  admin: any,
  shopId: string,
  shopDomain: string
): Promise<{ synced: number; errors: string[] }> {
  const errors: string[] = [];

  try {
    const response = await admin.graphql(MARKETS_QUERY);
    const responseJson = await response.json();
    const { data } = responseJson;

    console.log("[markets-sync] Raw response keys:", Object.keys(responseJson));
    console.log("[markets-sync] data?.markets:", JSON.stringify(data?.markets, null, 2));

    if (!data?.markets?.edges) {
      console.log("[markets-sync] No markets edges found. Full data:", JSON.stringify(data, null, 2));
      return { synced: 0, errors: ["No markets data returned from Shopify"] };
    }

    console.log("[markets-sync] Found", data.markets.edges.length, "markets");
    const parsed = parseMarkets(data.markets.edges);
    console.log("[markets-sync] Parsed markets:", JSON.stringify(parsed, null, 2));

    // Get existing market IDs for this shop to detect deletions
    const existingMarkets = await prisma.market.findMany({
      where: { shopId },
      select: { id: true, shopifyMarketId: true },
    });
    const existingIds = new Set(existingMarkets.map((m) => m.shopifyMarketId));
    const incomingIds = new Set(parsed.map((m) => m.shopifyMarketId));

    // Upsert all incoming markets
    let synced = 0;
    for (const market of parsed) {
      try {
        await prisma.market.upsert({
          where: {
            shopId_shopifyMarketId: {
              shopId,
              shopifyMarketId: market.shopifyMarketId,
            },
          },
          create: {
            shopId,
            shopifyMarketId: market.shopifyMarketId,
            name: market.name,
            enabled: market.enabled,
            primary: market.primary,
            countryCodes: JSON.stringify(market.countryCodes),
            rootUrl: market.rootUrl,
            defaultLocale: market.defaultLocale,
            currency: market.currency,
            hasTranslation: true, // Assume true, we'll check later
            lastSyncedAt: new Date(),
          },
          update: {
            name: market.name,
            enabled: market.enabled,
            primary: market.primary,
            countryCodes: JSON.stringify(market.countryCodes),
            rootUrl: market.rootUrl,
            defaultLocale: market.defaultLocale,
            currency: market.currency,
            lastSyncedAt: new Date(),
          },
        });
        synced++;
      } catch (err: any) {
        errors.push(`Failed to upsert market ${market.name}: ${err.message}`);
      }
    }

    // Remove markets that no longer exist in Shopify
    const removedIds = [...existingIds].filter((id) => !incomingIds.has(id));
    if (removedIds.length > 0) {
      await prisma.market.deleteMany({
        where: {
          shopId,
          shopifyMarketId: { in: removedIds },
        },
      });
    }

    // Update shop sync timestamp
    await prisma.shop.update({
      where: { id: shopId },
      data: {
        lastMarketSync: new Date(),
        marketSyncError: errors.length > 0 ? errors.join("; ") : null,
      },
    });

    return { synced, errors };
  } catch (err: any) {
    const errorMsg = `Market sync failed: ${err.message}`;
    errors.push(errorMsg);

    await prisma.shop.update({
      where: { id: shopId },
      data: { marketSyncError: errorMsg },
    });

    return { synced: 0, errors };
  }
}

/**
 * Parse raw Shopify GraphQL response into clean market objects
 */
function parseMarkets(
  edges: Array<{ node: MarketNode }>
): ParsedMarket[] {
  return edges.map(({ node }) => {
    const countryCodes = node.regions.edges.map((r) => r.node.code);
    const webPresence = node.webPresences.edges[0]?.node;
    const rootUrl = webPresence?.rootUrls[0]?.url || "/";
    const defaultLocale = webPresence?.defaultLocale?.locale || "en";

    // Determine currency from locale (simplified EU mapping)
    const currency = getCurrencyForLocale(defaultLocale, countryCodes);

    return {
      shopifyMarketId: node.id,
      name: node.name,
      enabled: node.enabled,
      primary: node.primary,
      countryCodes,
      rootUrl,
      defaultLocale,
      currency,
    };
  });
}

/**
 * Determine currency based on locale and country codes.
 * Most EU countries use EUR, with exceptions for GBP, SEK, etc.
 */
function getCurrencyForLocale(
  locale: string,
  countryCodes: string[]
): string {
  const NON_EUR_COUNTRIES: Record<string, string> = {
    GB: "GBP",
    SE: "SEK",
    DK: "DKK",
    PL: "PLN",
    CZ: "CZK",
    HU: "HUF",
    RO: "RON",
    BG: "BGN",
    CH: "CHF",
    NO: "NOK",
  };

  for (const code of countryCodes) {
    if (NON_EUR_COUNTRIES[code]) {
      return NON_EUR_COUNTRIES[code];
    }
  }

  return "EUR";
}

/**
 * Build the country→market mapping that gets pushed to Cloudflare KV.
 * This is what the Worker uses to resolve redirects.
 */
export async function buildWorkerConfig(shopId: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      markets: { where: { enabled: true } },
      selectorConfig: true,
      bannerConfig: true,
    },
  });

  if (!shop) return null;

  return {
    shopDomain: shop.shopDomain,
    redirectMode: shop.redirectMode,
    excludeBots: shop.excludeBots,
    excludeCheckout: shop.excludeCheckout,
    respectUserChoice: shop.respectUserChoice,
    excludedUrls: shop.excludedUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean),
    markets: shop.markets.map((m) => ({
      name: m.name,
      countries: JSON.parse(m.countryCodes) as string[],
      url: m.rootUrl,
      locale: m.defaultLocale,
      currency: m.currency,
      primary: m.primary,
    })),
    banner: shop.bannerConfig
      ? {
          textTemplates: JSON.parse(shop.bannerConfig.textTemplates),
          buttonLabels: JSON.parse(shop.bannerConfig.buttonLabels),
          bgColor: shop.bannerConfig.bgColor,
          textColor: shop.bannerConfig.textColor,
          acceptBtnColor: shop.bannerConfig.acceptBtnColor,
          showFlag: shop.bannerConfig.showFlag,
          showDismiss: shop.bannerConfig.showDismiss,
          position: shop.bannerConfig.bannerPosition,
        }
      : null,
  };
}
