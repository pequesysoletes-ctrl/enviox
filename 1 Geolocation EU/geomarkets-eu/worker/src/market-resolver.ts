// ═══════════════════════════════════════════════════════════════
// Market Resolver — Maps country code → target market URL
// ═══════════════════════════════════════════════════════════════

export interface MarketConfig {
  name: string;
  countries: string[];   // ISO alpha-2 codes: ["FR","MC","RE"]
  url: string;           // "/fr/", "fr.myshop.com", etc.
  locale: string;        // "fr", "fr-FR"
  currency: string;      // "EUR", "GBP"
  primary?: boolean;     // Is the home/default market
}

/**
 * Find the market that serves a given country code.
 * Returns null if no market is configured for this country.
 */
export function resolveMarket(
  country: string,
  markets: MarketConfig[]
): MarketConfig | null {
  if (!country || !markets || markets.length === 0) return null;

  const upperCountry = country.toUpperCase();

  // First, try exact match
  const match = markets.find(
    (m) => m.countries.includes(upperCountry) && !m.primary
  );
  if (match) return match;

  // If no non-primary match, check if the primary market serves this country
  // (but we don't redirect to primary — user is already there)
  const primaryMatch = markets.find(
    (m) => m.countries.includes(upperCountry) && m.primary
  );
  if (primaryMatch) return null; // Already on the right market

  // No market configured for this country
  return null;
}
