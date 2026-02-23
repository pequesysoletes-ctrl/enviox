// ═══════════════════════════════════════════════════════════════
// Shop Model — CRUD + Settings
// ═══════════════════════════════════════════════════════════════

import prisma from "~/db.server";

/**
 * Find or create a Shop record on first install.
 * Called during auth flow — ensures we always have a shop record.
 */
export async function findOrCreateShop(shopDomain: string) {
  return prisma.shop.upsert({
    where: { shopDomain },
    create: {
      shopDomain,
      selectorConfig: {
        create: {}, // Create with all defaults
      },
      bannerConfig: {
        create: {
          textTemplates: JSON.stringify({
            fr: "Il semble que vous êtes en France. Voulez-vous voir la boutique en français?",
            de: "Es sieht so aus, als wären Sie in Deutschland. Möchten Sie den Shop auf Deutsch sehen?",
            it: "Sembra che tu sia in Italia. Vuoi vedere il negozio in italiano?",
            pt: "Parece que está em Portugal. Deseja ver a loja em português?",
            nl: "Het lijkt erop dat u in Nederland bent. Wilt u de winkel in het Nederlands bekijken?",
            en: "It looks like you're visiting from the UK. Would you like to see the shop in English?",
          }),
          buttonLabels: JSON.stringify({
            fr: { accept: "Oui, changer", reject: "Non, rester ici" },
            de: { accept: "Ja, wechseln", reject: "Nein, hier bleiben" },
            it: { accept: "Sì, cambia", reject: "No, resta qui" },
            pt: { accept: "Sim, mudar", reject: "Não, ficar aqui" },
            nl: { accept: "Ja, wijzigen", reject: "Nee, hier blijven" },
            en: { accept: "Yes, switch", reject: "No, stay here" },
          }),
        },
      },
    },
    update: {}, // Don't overwrite existing settings
    include: {
      markets: true,
      selectorConfig: true,
      bannerConfig: true,
    },
  });
}

/**
 * Get full shop data with all relations
 */
export async function getShop(shopDomain: string) {
  return prisma.shop.findUnique({
    where: { shopDomain },
    include: {
      markets: { orderBy: { name: "asc" } },
      selectorConfig: true,
      bannerConfig: true,
    },
  });
}

/**
 * Update redirect settings
 */
export async function updateRedirectSettings(
  shopDomain: string,
  settings: {
    redirectMode?: string;
    excludeBots?: boolean;
    excludeCheckout?: boolean;
    respectUserChoice?: boolean;
    excludedUrls?: string;
  }
) {
  return prisma.shop.update({
    where: { shopDomain },
    data: settings,
  });
}

/**
 * Update selector config
 */
export async function updateSelectorConfig(
  shopId: string,
  config: {
    position?: string;
    showFlags?: boolean;
    showCountryName?: boolean;
    showCurrency?: boolean;
    showLanguage?: boolean;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverColor?: string;
    accentColor?: string;
    borderRadius?: string;
    size?: string;
    shadow?: boolean;
    customCss?: string;
  }
) {
  return prisma.selectorConfig.upsert({
    where: { shopId },
    create: { shopId, ...config },
    update: config,
  });
}

/**
 * Update banner config
 */
export async function updateBannerConfig(
  shopId: string,
  config: {
    textTemplates?: string;
    buttonLabels?: string;
    bgColor?: string;
    textColor?: string;
    acceptBtnColor?: string;
    rejectBtnStyle?: string;
    bannerPosition?: string;
    showFlag?: boolean;
    showDismiss?: boolean;
  }
) {
  return prisma.bannerConfig.upsert({
    where: { shopId },
    create: { shopId, ...config },
    update: config,
  });
}

/**
 * Complete onboarding step
 */
export async function completeOnboardingStep(
  shopDomain: string,
  step: number
) {
  const isComplete = step >= 3;
  return prisma.shop.update({
    where: { shopDomain },
    data: {
      onboardingStep: step,
      onboardingCompleted: isComplete,
    },
  });
}
