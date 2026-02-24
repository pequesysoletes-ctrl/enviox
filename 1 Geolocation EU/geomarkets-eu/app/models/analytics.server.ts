// ═══════════════════════════════════════════════════════════════
// Analytics Model — GeoEvent Queries + Aggregation
// ═══════════════════════════════════════════════════════════════

import prisma from "~/db.server";

type DateRange = "7d" | "30d" | "90d";

function getDateStart(range: DateRange): Date {
  const now = new Date();
  switch (range) {
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

/**
 * Log a geolocation event (redirect, banner interaction, etc.)
 */
export async function logGeoEvent(data: {
  shopId: string;
  eventType: string;
  countryCode: string;
  fromPath?: string;
  toPath?: string;
  userAgent?: string;
  isBot?: boolean;
}) {
  return prisma.geoEvent.create({
    data: {
      shopId: data.shopId,
      eventType: data.eventType,
      countryCode: data.countryCode.toUpperCase(),
      fromPath: data.fromPath || "/",
      toPath: data.toPath,
      userAgent: data.userAgent || "",
      isBot: data.isBot || false,
    },
  });
}

/**
 * Get dashboard KPIs: total redirects, visitors, active markets, acceptance rate
 */
export async function getDashboardKpis(shopId: string, range: DateRange = "7d") {
  const since = getDateStart(range);

  const [totalRedirects, totalVisitors, bannerStats, activeMarkets] =
    await Promise.all([
      // Total redirects
      prisma.geoEvent.count({
        where: {
          shopId,
          eventType: "redirect",
          occurredAt: { gte: since },
          isBot: false,
        },
      }),

      // Total geolocalized visitors (unique events)
      prisma.geoEvent.count({
        where: {
          shopId,
          eventType: { in: ["redirect", "banner_shown", "selector_change"] },
          occurredAt: { gte: since },
          isBot: false,
        },
      }),

      // Banner acceptance stats
      Promise.all([
        prisma.geoEvent.count({
          where: {
            shopId,
            eventType: "banner_shown",
            occurredAt: { gte: since },
          },
        }),
        prisma.geoEvent.count({
          where: {
            shopId,
            eventType: "banner_accept",
            occurredAt: { gte: since },
          },
        }),
      ]),

      // Active markets count
      prisma.market.count({
        where: { shopId, enabled: true },
      }),
    ]);

  const [bannerShown, bannerAccepted] = bannerStats;
  const acceptanceRate =
    bannerShown > 0 ? Math.round((bannerAccepted / bannerShown) * 100) : 0;

  return {
    totalRedirects,
    totalVisitors,
    activeMarkets,
    acceptanceRate,
  };
}

/**
 * Get top countries by visitor count
 */
export async function getTopCountries(
  shopId: string,
  range: DateRange = "7d",
  limit: number = 10
) {
  const since = getDateStart(range);

  const events = await prisma.geoEvent.groupBy({
    by: ["countryCode"],
    where: {
      shopId,
      occurredAt: { gte: since },
      isBot: false,
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  // For each country, get redirect count and acceptance rate
  const enriched = await Promise.all(
    events.map(async (e) => {
      const [redirects, bannerShown, bannerAccepted] = await Promise.all([
        prisma.geoEvent.count({
          where: {
            shopId,
            countryCode: e.countryCode,
            eventType: "redirect",
            occurredAt: { gte: since },
          },
        }),
        prisma.geoEvent.count({
          where: {
            shopId,
            countryCode: e.countryCode,
            eventType: "banner_shown",
            occurredAt: { gte: since },
          },
        }),
        prisma.geoEvent.count({
          where: {
            shopId,
            countryCode: e.countryCode,
            eventType: "banner_accept",
            occurredAt: { gte: since },
          },
        }),
      ]);

      // Check if this country has a market configured
      const hasMarket = await prisma.market.findFirst({
        where: {
          shopId,
          enabled: true,
          countryCodes: { contains: e.countryCode },
        },
      });

      return {
        countryCode: e.countryCode,
        visitors: e._count.id,
        redirects,
        acceptanceRate:
          bannerShown > 0
            ? Math.round((bannerAccepted / bannerShown) * 100)
            : null,
        hasMarket: !!hasMarket,
      };
    })
  );

  return enriched;
}

/**
 * Get daily redirect trend for charts
 */
export async function getDailyTrend(
  shopId: string,
  range: DateRange = "7d"
) {
  const since = getDateStart(range);

  // Use DailyStat if available, fallback to raw events
  const stats = await prisma.dailyStat.findMany({
    where: {
      shopId,
      date: { gte: since },
    },
    orderBy: { date: "asc" },
  });

  if (stats.length > 0) {
    // Aggregate by date across all countries
    const byDate = new Map<string, {
      visitors: number;
      redirects: number;
      bannerShown: number;
      bannerAccepted: number;
    }>();

    for (const stat of stats) {
      const dateKey = stat.date.toISOString().split("T")[0];
      const existing = byDate.get(dateKey) || {
        visitors: 0,
        redirects: 0,
        bannerShown: 0,
        bannerAccepted: 0,
      };

      byDate.set(dateKey, {
        visitors: existing.visitors + stat.visitors,
        redirects: existing.redirects + stat.redirects,
        bannerShown: existing.bannerShown + stat.bannerShown,
        bannerAccepted: existing.bannerAccepted + stat.bannerAccepted,
      });
    }

    return Array.from(byDate.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  }

  // Fallback: aggregate raw events by day
  // (This is slower but works before DailyStat aggregation is set up)
  const events = await prisma.geoEvent.findMany({
    where: {
      shopId,
      occurredAt: { gte: since },
      isBot: false,
    },
    select: {
      eventType: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: "asc" },
  });

  const dailyMap = new Map<string, {
    visitors: number;
    redirects: number;
    bannerShown: number;
    bannerAccepted: number;
  }>();

  for (const event of events) {
    const dateKey = event.occurredAt.toISOString().split("T")[0];
    const day = dailyMap.get(dateKey) || {
      visitors: 0,
      redirects: 0,
      bannerShown: 0,
      bannerAccepted: 0,
    };

    day.visitors++;
    if (event.eventType === "redirect") day.redirects++;
    if (event.eventType === "banner_shown") day.bannerShown++;
    if (event.eventType === "banner_accept") day.bannerAccepted++;

    dailyMap.set(dateKey, day);
  }

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));
}

/**
 * Get countries that have visitors but no market configured.
 * These are "opportunities" — the merchant should create a market for them.
 */
export async function getOpportunities(
  shopId: string,
  range: DateRange = "30d",
  minVisitors: number = 10
) {
  const since = getDateStart(range);

  // Get all countries with traffic
  const countriesWithTraffic = await prisma.geoEvent.groupBy({
    by: ["countryCode"],
    where: {
      shopId,
      occurredAt: { gte: since },
      isBot: false,
    },
    _count: { id: true },
    having: {
      id: { _count: { gte: minVisitors } },
    },
    orderBy: { _count: { id: "desc" } },
  });

  // Get all countries that have a market
  const markets = await prisma.market.findMany({
    where: { shopId, enabled: true },
    select: { countryCodes: true },
  });

  const coveredCountries = new Set<string>();
  for (const market of markets) {
    const codes = JSON.parse(market.countryCodes) as string[];
    codes.forEach((c) => coveredCountries.add(c));
  }

  // Filter to only countries WITHOUT a market
  return countriesWithTraffic
    .filter((c) => !coveredCountries.has(c.countryCode))
    .map((c) => ({
      countryCode: c.countryCode,
      visitors: c._count.id,
    }));
}

/**
 * Get the last N redirect events (for the "Latest redirects" card)
 */
export async function getLatestRedirects(
  shopId: string,
  limit: number = 10
) {
  return prisma.geoEvent.findMany({
    where: {
      shopId,
      eventType: { in: ["redirect", "banner_accept"] },
      isBot: false,
    },
    orderBy: { occurredAt: "desc" },
    take: limit,
    select: {
      id: true,
      countryCode: true,
      fromPath: true,
      toPath: true,
      eventType: true,
      occurredAt: true,
    },
  });
}
