// ═══════════════════════════════════════════════════════════════
// Screen 06 — Analytics de Tráfico
// Top countries, daily trend, opportunities, export CSV
// ═══════════════════════════════════════════════════════════════

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Select,
  DataTable,
  Banner,
  Box,
  ProgressBar,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { getShop } from "~/models/shop.server";
import {
  getDashboardKpis,
  getTopCountries,
  getDailyTrend,
  getOpportunities,
} from "~/models/analytics.server";
import { getShopPlan } from "~/services/billing.server";
import { KpiCards } from "~/components/KpiCards";

const FLAGS: Record<string, string> = {
  ES: "🇪🇸", FR: "🇫🇷", DE: "🇩🇪", GB: "🇬🇧", IT: "🇮🇹",
  PT: "🇵🇹", NL: "🇳🇱", BE: "🇧🇪", AT: "🇦🇹", IE: "🇮🇪",
  SE: "🇸🇪", DK: "🇩🇰", FI: "🇫🇮", PL: "🇵🇱", CZ: "🇨🇿",
  GR: "🇬🇷", RO: "🇷🇴", HU: "🇭🇺", CH: "🇨🇭", NO: "🇳🇴",
};

const COUNTRY_NAMES: Record<string, string> = {
  ES: "España", FR: "Francia", DE: "Alemania", GB: "Reino Unido",
  IT: "Italia", PT: "Portugal", NL: "Países Bajos", BE: "Bélgica",
  AT: "Austria", IE: "Irlanda", SE: "Suecia", DK: "Dinamarca",
  FI: "Finlandia", PL: "Polonia", CZ: "Chequia", GR: "Grecia",
  RO: "Rumanía", HU: "Hungría", CH: "Suiza", NO: "Noruega",
};

type DateRange = "7d" | "30d" | "90d";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);
  const plan = await getShopPlan(session.shop);

  if (!shop) {
    return json({ error: "Shop not found" });
  }

  // Check if analytics are available on this plan
  if (!plan.limits.analytics && plan.slug !== "free") {
    return json({ locked: true, plan: plan.slug });
  }

  const url = new URL(request.url);
  const range = (url.searchParams.get("range") as DateRange) || "7d";

  const [kpis, topCountries, dailyTrend, opportunities] = await Promise.all([
    getDashboardKpis(shop.id, range),
    getTopCountries(shop.id, range, 20),
    getDailyTrend(shop.id, range),
    getOpportunities(shop.id, "30d", 5),
  ]);

  return json({
    kpis,
    topCountries,
    dailyTrend,
    opportunities,
    range,
    plan: plan.slug,
  });
};

export default function AnalyticsPage() {
  const data = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  if ("locked" in data) {
    return (
      <Page
        title="Analytics"
        backAction={{ content: "Dashboard", url: "/app" }}
      >
        <Banner tone="warning">
          <p>
            Analytics completos están disponibles en el plan <strong>Pro</strong>
            . Actualiza tu plan para acceder a datos detallados de tráfico por
            país.
          </p>
          <Box paddingBlockStart="200">
            <Button variant="primary" url="/app/billing">
              Ver planes
            </Button>
          </Box>
        </Banner>
      </Page>
    );
  }

  if ("error" in data) {
    return (
      <Page title="Analytics">
        <Banner tone="critical">
          <p>Error cargando analytics.</p>
        </Banner>
      </Page>
    );
  }

  const { kpis, topCountries, dailyTrend, opportunities, range } = data;
  const maxVisitors = Math.max(...topCountries.map((c) => c.visitors), 1);

  return (
    <Page
      title="Analytics de tráfico"
      subtitle="Rendimiento de geolocalización y redirección"
      backAction={{ content: "Dashboard", url: "/app" }}
      secondaryActions={[
        {
          content: "Exportar CSV",
          onAction: () => {
            // CSV export
            const csv = [
              "País,Código,Visitantes,Redirecciones,Tasa aceptación,Mercado configurado",
              ...topCountries.map(
                (c) =>
                  `${COUNTRY_NAMES[c.countryCode] || c.countryCode},${
                    c.countryCode
                  },${c.visitors},${c.redirects},${
                    c.acceptanceRate !== null ? c.acceptanceRate + "%" : "N/A"
                  },${c.hasMarket ? "Sí" : "No"}`
              ),
            ].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `geomarkets-analytics-${range}.csv`;
            a.click();
          },
        },
      ]}
    >
      <BlockStack gap="500">
        {/* Date Range Selector */}
        <InlineStack align="end">
          <Select
            label="Período"
            labelInline
            options={[
              { label: "Últimos 7 días", value: "7d" },
              { label: "Últimos 30 días", value: "30d" },
              { label: "Últimos 90 días", value: "90d" },
            ]}
            value={range}
            onChange={(value) =>
              setSearchParams({ range: value })
            }
          />
        </InlineStack>

        {/* KPI Cards */}
        <KpiCards data={kpis} />

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Daily Trend Chart (simplified text-based) */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    📈 Tendencia diaria
                  </Text>
                  {dailyTrend.length > 0 ? (
                    <BlockStack gap="200">
                      {dailyTrend.slice(-7).map((day) => (
                        <InlineStack
                          key={day.date}
                          align="space-between"
                          blockAlign="center"
                        >
                          <Text as="span" variant="bodySm" tone="subdued">
                            {new Date(day.date).toLocaleDateString("es-ES", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </Text>
                          <InlineStack gap="300">
                            <Text as="span" variant="bodySm">
                              👥 {day.visitors}
                            </Text>
                            <Text as="span" variant="bodySm" tone="success">
                              🔄 {day.redirects}
                            </Text>
                          </InlineStack>
                        </InlineStack>
                      ))}
                    </BlockStack>
                  ) : (
                    <Text as="p" tone="subdued">
                      No hay datos de tendencia para este período.
                    </Text>
                  )}
                </BlockStack>
              </Card>

              {/* Country Table (detailed) */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Desglose por país
                  </Text>
                  {topCountries.length > 0 ? (
                    <DataTable
                      columnContentTypes={[
                        "text",
                        "numeric",
                        "numeric",
                        "text",
                        "text",
                      ]}
                      headings={[
                        "País",
                        "Visitantes",
                        "Redirecciones",
                        "Tasa aceptación",
                        "Mercado",
                      ]}
                      rows={topCountries.map((c) => [
                        `${FLAGS[c.countryCode] || "🌍"} ${
                          COUNTRY_NAMES[c.countryCode] || c.countryCode
                        }`,
                        c.visitors,
                        c.redirects,
                        c.acceptanceRate !== null
                          ? `${c.acceptanceRate}%`
                          : "—",
                        c.hasMarket ? "✅ Activo" : "⚠️ Sin mercado",
                      ])}
                      sortable={[true, true, true, false, false]}
                    />
                  ) : (
                    <Text as="p" tone="subdued">
                      No hay datos de tráfico para este período.
                    </Text>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Top Countries Visual */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    🏆 Top 5 países
                  </Text>
                  {topCountries.slice(0, 5).map((c) => (
                    <BlockStack key={c.countryCode} gap="100">
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodySm">
                          {FLAGS[c.countryCode]} {COUNTRY_NAMES[c.countryCode]}
                        </Text>
                        <Text as="span" variant="bodySm" fontWeight="bold">
                          {c.visitors}
                        </Text>
                      </InlineStack>
                      <ProgressBar
                        progress={Math.round((c.visitors / maxVisitors) * 100)}
                        size="small"
                        tone="primary"
                      />
                    </BlockStack>
                  ))}
                </BlockStack>
              </Card>

              {/* Opportunities */}
              {opportunities.length > 0 && (
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">
                      🌍 Oportunidades
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Países con tráfico pero sin mercado configurado.
                    </Text>
                    {opportunities.map((opp) => (
                      <InlineStack
                        key={opp.countryCode}
                        align="space-between"
                        blockAlign="center"
                      >
                        <Text as="span">
                          {FLAGS[opp.countryCode]}{" "}
                          {COUNTRY_NAMES[opp.countryCode]}
                        </Text>
                        <Badge tone="attention">
                          {opp.visitors} visitas
                        </Badge>
                      </InlineStack>
                    ))}
                    <Button variant="primary" url="/app/markets">
                      Configurar Markets
                    </Button>
                  </BlockStack>
                </Card>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
