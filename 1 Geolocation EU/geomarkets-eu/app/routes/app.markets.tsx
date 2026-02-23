// ═══════════════════════════════════════════════════════════════
// Screen 04 — Sincronización de Markets
// Table of Shopify Markets + sync status + market stats
// ═══════════════════════════════════════════════════════════════

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Banner,
  IndexTable,
  useIndexResourceState,
  Divider,
  Box,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { getShop } from "~/models/shop.server";
import { syncMarkets } from "~/services/markets-sync.server";

const FLAGS: Record<string, string> = {
  ES: "🇪🇸", FR: "🇫🇷", DE: "🇩🇪", GB: "🇬🇧", IT: "🇮🇹",
  PT: "🇵🇹", NL: "🇳🇱", BE: "🇧🇪", AT: "🇦🇹", IE: "🇮🇪",
  SE: "🇸🇪", DK: "🇩🇰", FI: "🇫🇮", PL: "🇵🇱", CZ: "🇨🇿",
  GR: "🇬🇷", RO: "🇷🇴", HU: "🇭🇺", CH: "🇨🇭", NO: "🇳🇴",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);

  if (!shop) {
    return json({ error: "Shop not found", markets: [], lastSync: null, shopDomain: session.shop });
  }

  return json({
    markets: shop.markets.map((m) => ({
      id: m.id,
      name: m.name,
      enabled: m.enabled,
      primary: m.primary,
      countryCodes: JSON.parse(m.countryCodes) as string[],
      defaultLocale: m.defaultLocale,
      currency: m.currency,
      rootUrl: m.rootUrl,
      hasTranslation: m.hasTranslation,
      translationWarning: m.translationWarning,
    })),
    lastSync: shop.lastMarketSync
      ? new Date(shop.lastMarketSync).toLocaleString("es-ES")
      : null,
    syncError: shop.marketSyncError,
    shopDomain: session.shop,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  const result = await syncMarkets(admin, shop.id, session.shop);
  return json({
    synced: result.synced,
    errors: result.errors,
    success: result.errors.length === 0,
  });
};

export default function MarketsPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSyncing = navigation.state === "submitting";

  const markets = "markets" in data ? data.markets : [];
  const activeMarkets = markets.filter((m) => m.enabled);

  const resourceName = {
    singular: "mercado",
    plural: "mercados",
  };

  return (
    <Page
      title="Sincronización de Markets"
      subtitle="Tus mercados de Shopify sincronizados con GeoMarkets EU"
      backAction={{ content: "Dashboard", url: "/app" }}
      primaryAction={{
        content: isSyncing ? "Sincronizando..." : "Sincronizar ahora",
        loading: isSyncing,
        onAction: () => submit({}, { method: "post" }),
      }}
    >
      <BlockStack gap="500">
        {/* Sync status */}
        {actionData && "success" in actionData && actionData.success && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>
              ✅ Sincronización completada. {actionData.synced} mercados
              actualizados.
            </p>
          </Banner>
        )}

        {actionData && "errors" in actionData && actionData.errors.length > 0 && (
          <Banner tone="warning">
            <p>Errores durante la sincronización:</p>
            <ul>
              {actionData.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </Banner>
        )}

        <Layout>
          <Layout.Section>
            <Card padding="0">
              <BlockStack gap="0">
                <Box padding="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" as="h2">
                      Mercados detectados
                    </Text>
                    <Badge tone="info">
                      {activeMarkets.length} activos
                    </Badge>
                  </InlineStack>
                </Box>

                <IndexTable
                  resourceName={resourceName}
                  itemCount={markets.length}
                  headings={[
                    { title: "Mercado" },
                    { title: "Países" },
                    { title: "Idioma" },
                    { title: "Moneda" },
                    { title: "URL" },
                    { title: "Estado" },
                  ]}
                  selectable={false}
                >
                  {markets.map((market, index) => {
                    const flags = market.countryCodes
                      .map((c) => FLAGS[c] || c)
                      .join(" ");

                    return (
                      <IndexTable.Row
                        key={market.id}
                        id={market.id}
                        position={index}
                      >
                        <IndexTable.Cell>
                          <InlineStack gap="200" blockAlign="center">
                            <Text as="span" fontWeight="semibold">
                              {flags.split(" ")[0]} {market.name}
                            </Text>
                            {market.primary && (
                              <Badge>Principal</Badge>
                            )}
                          </InlineStack>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodySm">
                            {market.countryCodes.join(", ")}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span">{market.defaultLocale}</Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Badge>{market.currency}</Badge>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text as="span" variant="bodySm" tone="subdued">
                            {market.rootUrl}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          {market.enabled ? (
                            market.hasTranslation ? (
                              <Badge tone="success">✅ Activo</Badge>
                            ) : (
                              <Badge tone="warning">
                                ⚠️ Sin traducción
                              </Badge>
                            )
                          ) : (
                            <Badge tone="critical">Desactivado</Badge>
                          )}
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    );
                  })}
                </IndexTable>

                {markets.length === 0 && (
                  <Box padding="400">
                    <Text as="p" tone="subdued" alignment="center">
                      No se encontraron mercados. Configúralos en Shopify Admin →
                      Markets y pulsa "Sincronizar ahora".
                    </Text>
                  </Box>
                )}
              </BlockStack>
            </Card>

            {/* Info Banner */}
            <Box paddingBlockStart="400">
              <Banner tone="info">
                <p>
                  Los mercados se configuran en{" "}
                  <strong>Shopify Admin → Settings → Markets</strong>. Esta app
                  lee tu configuración y la usa para geolocalizar y redirigir
                  visitantes.
                </p>
              </Banner>
            </Box>
          </Layout.Section>

          {/* Sidebar: Stats */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  📊 Estadísticas de Markets
                </Text>
                <Divider />
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Activos
                  </Text>
                  <Text as="span" fontWeight="bold">
                    {activeMarkets.length}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Países cubiertos
                  </Text>
                  <Text as="span" fontWeight="bold">
                    {new Set(
                      markets.flatMap((m) => m.countryCodes)
                    ).size}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Idiomas
                  </Text>
                  <Text as="span" fontWeight="bold">
                    {new Set(markets.map((m) => m.defaultLocale)).size}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Monedas
                  </Text>
                  <Text as="span" fontWeight="bold">
                    {new Set(markets.map((m) => m.currency)).size}
                  </Text>
                </InlineStack>
                <Divider />
                <Text as="p" variant="bodySm" tone="subdued">
                  Última sincronización:{" "}
                  {"lastSync" in data && data.lastSync
                    ? data.lastSync
                    : "Nunca"}
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
