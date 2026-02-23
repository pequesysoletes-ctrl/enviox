// ═══════════════════════════════════════════════════════════════
// Billing Service — Shopify Billing API Integration
// Plans: Free → Basic (9.99€) → Pro (19.99€) → Agency (29.99€)
// ═══════════════════════════════════════════════════════════════

import prisma from "~/db.server";

export interface PlanDefinition {
  name: string;
  slug: string;
  price: number;
  currency: string;
  trialDays: number;
  features: string[];
  limits: {
    maxMarkets: number; // -1 = unlimited
    analytics: boolean;
    customCss: boolean;
    multiStore: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    whiteLabel: boolean;
    bannerCustomization: boolean;
    customFlags: boolean;
  };
}

export const PLANS: Record<string, PlanDefinition> = {
  free: {
    name: "Free",
    slug: "free",
    price: 0,
    currency: "EUR",
    trialDays: 0,
    features: [
      "1 mercado",
      "Redirect automático",
      "Selector básico",
    ],
    limits: {
      maxMarkets: 1,
      analytics: false,
      customCss: false,
      multiStore: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
      bannerCustomization: false,
      customFlags: false,
    },
  },
  basic: {
    name: "Basic",
    slug: "basic",
    price: 9.99,
    currency: "EUR",
    trialDays: 7,
    features: [
      "3 mercados",
      "Redirect automático",
      "Selector básico",
      "Exclusión bots SEO",
    ],
    limits: {
      maxMarkets: 3,
      analytics: false,
      customCss: false,
      multiStore: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
      bannerCustomization: false,
      customFlags: false,
    },
  },
  pro: {
    name: "Pro",
    slug: "pro",
    price: 19.99,
    currency: "EUR",
    trialDays: 7,
    features: [
      "Mercados ilimitados",
      "Redirect + banner",
      "CSS personalizable",
      "Analytics completos",
      "Banderas custom",
    ],
    limits: {
      maxMarkets: -1,
      analytics: true,
      customCss: true,
      multiStore: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabel: false,
      bannerCustomization: true,
      customFlags: true,
    },
  },
  agency: {
    name: "Agency",
    slug: "agency",
    price: 29.99,
    currency: "EUR",
    trialDays: 7,
    features: [
      "Todo en Pro",
      "Multi-tienda",
      "API access",
      "Soporte prioritario",
      "White-label option",
    ],
    limits: {
      maxMarkets: -1,
      analytics: true,
      customCss: true,
      multiStore: true,
      apiAccess: true,
      prioritySupport: true,
      whiteLabel: true,
      bannerCustomization: true,
      customFlags: true,
    },
  },
};

/**
 * Get the current plan for a shop
 */
export async function getShopPlan(shopDomain: string): Promise<PlanDefinition> {
  const shop = await prisma.shop.findUnique({
    where: { shopDomain },
    select: { plan: true, trialEndsAt: true },
  });

  if (!shop) return PLANS.free;

  const plan = PLANS[shop.plan];
  if (!plan) return PLANS.free;

  return plan;
}

/**
 * Check if a shop has access to a specific feature
 */
export async function hasFeature(
  shopDomain: string,
  feature: keyof PlanDefinition["limits"]
): Promise<boolean> {
  const plan = await getShopPlan(shopDomain);
  const value = plan.limits[feature];
  return typeof value === "boolean" ? value : value !== 0;
}

/**
 * Check if a shop can add more markets
 */
export async function canAddMarket(shopDomain: string): Promise<boolean> {
  const plan = await getShopPlan(shopDomain);
  if (plan.limits.maxMarkets === -1) return true;

  const shop = await prisma.shop.findUnique({
    where: { shopDomain },
    include: { markets: { where: { enabled: true } } },
  });

  if (!shop) return false;
  return shop.markets.length < plan.limits.maxMarkets;
}

/**
 * Create a Shopify billing subscription using the Billing API.
 * Returns a confirmation URL that the merchant must visit.
 */
export async function createSubscription(
  admin: any,
  planSlug: string,
  shopDomain: string
): Promise<{ confirmationUrl: string } | { error: string }> {
  const plan = PLANS[planSlug];
  if (!plan || plan.price === 0) {
    return { error: "Invalid plan" };
  }

  const BILLING_MUTATION = `
    mutation CreateSubscription($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int!) {
      appSubscriptionCreate(
        name: $name
        lineItems: $lineItems
        returnUrl: $returnUrl
        trialDays: $trialDays
        test: ${process.env.NODE_ENV !== "production"}
      ) {
        appSubscription {
          id
        }
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await admin.graphql(BILLING_MUTATION, {
      variables: {
        name: `GeoMarkets EU ${plan.name}`,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: plan.price, currencyCode: plan.currency },
                interval: "EVERY_30_DAYS",
              },
            },
          },
        ],
        returnUrl: `https://${shopDomain}/admin/apps/geomarkets-eu/billing?plan=${planSlug}`,
        trialDays: plan.trialDays,
      },
    });

    const { data } = await response.json();
    const result = data?.appSubscriptionCreate;

    if (result?.userErrors?.length > 0) {
      return { error: result.userErrors.map((e: any) => e.message).join(", ") };
    }

    if (result?.confirmationUrl) {
      // Store the billing ID for later reference
      await prisma.shop.update({
        where: { shopDomain },
        data: {
          billingId: result.appSubscription?.id,
        },
      });

      return { confirmationUrl: result.confirmationUrl };
    }

    return { error: "No confirmation URL returned" };
  } catch (err: any) {
    return { error: `Billing error: ${err.message}` };
  }
}

/**
 * Activate a plan after merchant confirms billing.
 * Called from the billing return URL.
 */
export async function activatePlan(
  shopDomain: string,
  planSlug: string
): Promise<void> {
  const plan = PLANS[planSlug];
  if (!plan) return;

  const trialEnd = plan.trialDays > 0
    ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000)
    : null;

  await prisma.shop.update({
    where: { shopDomain },
    data: {
      plan: planSlug,
      planActivatedAt: new Date(),
      trialEndsAt: trialEnd,
    },
  });
}
