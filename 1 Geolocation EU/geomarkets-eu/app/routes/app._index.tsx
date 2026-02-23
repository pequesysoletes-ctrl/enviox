// ═══════════════════════════════════════════════════════════════
// Screen 02 — Dashboard Principal
// KPIs + Charts + Countries + Latest Redirects
// ═══════════════════════════════════════════════════════════════

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  DataTable,
  Banner,
  Button,
  Box,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { findOrCreateShop, getShop } from "~/models/shop.server";
import {
  getDashboardKpis,
  getTopCountries,
  getLatestRedirects,
  getOpportunities,
} from "~/models/analytics.server";
import { KpiCards } from "~/components/KpiCards";

// Country code → flag emoji mapping
const FLAGS: Record<string, string> = {
  ES: "🇪🇸", FR: "🇫🇷", DE: "🇩🇪", GB: "🇬🇧", IT: "🇮🇹",
  PT: "🇵🇹", NL: "🇳🇱", BE: "🇧🇪", AT: "🇦🇹", IE: "🇮🇪",
  SE: "🇸🇪", DK: "🇩🇰", FI: "🇫🇮", PL: "🇵🇱", CZ: "🇨🇿",
  GR: "🇬🇷", RO: "🇷🇴", HU: "🇭🇺", CH: "🇨🇭", NO: "🇳🇴",
  HR: "🇭🇷", BG: "🇧🇬", SK: "🇸🇰", LT: "🇱🇹", SI: "🇸🇮",
  LV: "🇱🇻", EE: "🇪🇪", LU: "🇱🇺", MT: "🇲🇹", CY: "🇨🇾",
};

const COUNTRY_NAMES: Record<string, string> = {
  ES: "España", FR: "Francia", DE: "Alemania", GB: "Reino Unido",
  IT: "Italia", PT: "Portugal", NL: "Países Bajos", BE: "Bélgica",
  AT: "Austria", IE: "Irlanda", SE: "Suecia", DK: "Dinamarca",
  FI: "Finlandia", PL: "Polonia", CZ: "Chequia", GR: "Grecia",
  RO: "Rumanía", HU: "Hungría", CH: "Suiza", NO: "Noruega",
  HR: "Croacia", BG: "Bulgaria", SK: "Eslovaquia", LT: "Lituania",
  SI: "Eslovenia", LV: "Letonia", EE: "Estonia", LU: "Luxemburgo",
  MT: "Malta", CY: "Chipre",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  try {
    const shop = await findOrCreateShop(session.shop);

    // If onboarding not completed, signal client to navigate
    if (!shop.onboardingCompleted) {
      return json({ needsOnboarding: true } as any);
    }

    // Safe analytics calls — return empty data on error
    let kpis = { totalVisitors: 0, totalRedirects: 0, bannerClicks: 0, marketsActive: 0, changeVisitors: 0, changeRedirects: 0, changeBannerClicks: 0 };
    let topCountries: any[] = [];
    let latestRedirects: any[] = [];
    let opportunities: any[] = [];

    try {
      [kpis, topCountries, latestRedirects, opportunities] = await Promise.all([
        getDashboardKpis(shop.id),
        getTopCountries(shop.id, "7d", 10),
        getLatestRedirects(shop.id, 5),
        getOpportunities(shop.id, "30d", 10),
      ]);
    } catch (e) {
      console.error("Analytics error (non-fatal):", e);
    }

    // Get flags for active markets
    const marketFlags = shop.markets
      .filter((m) => m.enabled)
      .flatMap((m) => {
        try {
          const codes = JSON.parse(m.countryCodes) as string[];
          return codes.map((c) => FLAGS[c]).filter(Boolean);
        } catch { return []; }
      })
      .slice(0, 7);

    // Format dates server-side to avoid hydration mismatches
    const formattedRedirects = latestRedirects.map((r: any) => ({
      ...r,
      formattedTime: new Date(r.occurredAt).toLocaleString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      }),
    }));

    const formattedLastSync = shop.lastMarketSync
      ? new Date(shop.lastMarketSync).toLocaleString("es-ES")
      : null;

    return json({
      shopDomain: session.shop,
      kpis,
      topCountries,
      latestRedirects: formattedRedirects,
      opportunities,
      marketFlags,
      lastSync: formattedLastSync,
    });
  } catch (error) {
    console.error("Dashboard loader error:", error);
    // On any error, signal client to go to onboarding
    return json({ needsOnboarding: true } as any);
  }
};


export default function DashboardPage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Client-side redirect to preserve App Bridge session token
  useEffect(() => {
    if ((data as any).needsOnboarding) {
      navigate("/app/onboarding");
    }
  }, [data, navigate]);

  if ((data as any).needsOnboarding) {
    return null; // Don't render dashboard while redirecting
  }

  const {
    kpis,
    topCountries,
    latestRedirects,
    opportunities,
    marketFlags,
    lastSync,
  } = data as any;

  return (
    <Page
      title="GeoMarkets EU"
      subtitle="Panel de control — Geolocalización y redirección"
      primaryAction={{
        content: "Sincronizar",
        url: "/app/markets",
      }}
      secondaryActions={[
        { content: "Configuración", url: "/app/settings" },
      ]}
    >
      <BlockStack gap="500">
        {/* KPI Cards */}
        <KpiCards data={kpis} marketFlags={marketFlags} />

        <Layout>
          {/* Main content: 2/3 width */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Traffic by Country */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text variant="headingMd" as="h2">
                      Top países por visitantes
                    </Text>
                    <Button variant="plain" url="/app/analytics">
                      Ver todos
                    </Button>
                  </InlineStack>
                  <BlockStack gap="300">
                    {topCountries.map((country) => (
                      <InlineStack
                        key={country.countryCode}
                        align="space-between"
                        blockAlign="center"
                      >
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="span" variant="bodyMd">
                            {FLAGS[country.countryCode] || "🌍"}{" "}
                            {COUNTRY_NAMES[country.countryCode] ||
                              country.countryCode}
                          </Text>
                          {!country.hasMarket && (
                            <Badge tone="warning">Sin mercado</Badge>
                          )}
                        </InlineStack>
                        <Text as="span" variant="bodyMd" fontWeight="semibold">
                          {new Intl.NumberFormat("es-ES").format(
                            country.visitors
                          )}
                        </Text>
                      </InlineStack>
                    ))}
                    {topCountries.length === 0 && (
                      <Text as="p" tone="subdued">
                        Aún no hay datos de tráfico. Los datos aparecerán cuando
                        los visitantes empiecen a navegar tu tienda.
                      </Text>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Latest Redirects */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Últimas redirecciones
                  </Text>
                  {latestRedirects.length > 0 ? (
                    <DataTable
                      columnContentTypes={[
                        "text",
                        "text",
                        "text",
                        "text",
                      ]}
                      headings={["Hora", "País", "Ruta", "Estado"]}
                      rows={latestRedirects.map((r) => [
                        r.formattedTime,
                        `${FLAGS[r.countryCode] || "🌍"} ${r.countryCode}`,
                        `${r.fromPath} → ${r.toPath || "—"}`,
                        r.eventType === "redirect"
                          ? "✅ Redirect"
                          : "👆 Banner",
                      ])}
                    />
                  ) : (
                    <Text as="p" tone="subdued">
                      Aún no se han registrado redirecciones.
                    </Text>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar: 1/3 width */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Opportunities Card */}
              {opportunities.length > 0 && (
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">
                      🌍 Países sin mercado
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Estos países generan tráfico pero no tienen mercado
                      configurado.
                    </Text>
                    {opportunities.map((opp) => (
                      <InlineStack
                        key={opp.countryCode}
                        align="space-between"
                        blockAlign="center"
                      >
                        <Text as="span" variant="bodyMd">
                          {FLAGS[opp.countryCode] || "🌍"}{" "}
                          {COUNTRY_NAMES[opp.countryCode] || opp.countryCode}
                        </Text>
                        <Badge tone="attention">
                          {opp.visitors} visitas
                        </Badge>
                      </InlineStack>
                    ))}
                    <Box paddingBlockStart="200">
                      <Button variant="primary" url="/app/markets">
                        Configurar Markets
                      </Button>
                    </Box>
                  </BlockStack>
                </Card>
              )}

              {/* Sync Status */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Estado de sincronización
                  </Text>
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone="success">Sincronizado</Badge>
                    <Text as="span" variant="bodySm" tone="subdued">
                      {lastSync
                        ? `Última: ${lastSync}`
                        : "Nunca sincronizado"}
                    </Text>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Quick Links */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Acciones rápidas
                  </Text>
                  <Button variant="plain" url="/app/settings">
                    ⚙️ Configurar redirección
                  </Button>
                  <Button variant="plain" url="/app/selector">
                    🎨 Personalizar selector
                  </Button>
                  <Button variant="plain" url="/app/analytics">
                    📈 Ver analytics completos
                  </Button>
                  <Button variant="plain" url="/app/help">
                    ❓ Centro de ayuda
                  </Button>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
