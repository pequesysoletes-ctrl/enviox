// ═══════════════════════════════════════════════════════════════
// Screen 08 — Selector Preview
// Shows 4 visual variants of the selector in different positions
// ═══════════════════════════════════════════════════════════════

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Box,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { getShop } from "~/models/shop.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);

  return json({
    config: shop?.selectorConfig || {},
    markets: (shop?.markets || []).map((m) => ({
      name: m.name,
      countryCodes: JSON.parse(m.countryCodes),
      currency: m.currency,
      defaultLocale: m.defaultLocale,
    })),
  });
};

const FLAGS: Record<string, string> = {
  ES: "🇪🇸", FR: "🇫🇷", DE: "🇩🇪", GB: "🇬🇧", IT: "🇮🇹",
  PT: "🇵🇹", NL: "🇳🇱", BE: "🇧🇪", AT: "🇦🇹", IE: "🇮🇪",
};

export default function PreviewPage() {
  const { config, markets } = useLoaderData<typeof loader>();
  const c = config as any;

  const selectorStyle = {
    background: c.bgColor || "#fff",
    color: c.textColor || "#111827",
    borderRadius: c.borderRadius || "8px",
    padding: c.size === "compact" ? "6px 10px" : c.size === "large" ? "12px 18px" : "8px 14px",
    boxShadow: c.shadow !== false ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    border: "1px solid #e5e5e5",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontSize: c.size === "compact" ? 13 : c.size === "large" ? 16 : 14,
  };

  return (
    <Page
      title="Vista previa del selector"
      subtitle="Así se verá el selector de país en tu tienda"
      backAction={{ content: "Selector", url: "/app/selector" }}
    >
      <BlockStack gap="500">
        <Layout>
          {/* Variant 1: Floating bottom-right */}
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h2">
                    Flotante (esquina inferior)
                  </Text>
                  <Badge tone={c.position === "floating" ? "success" : undefined}>
                    {c.position === "floating" ? "Seleccionado" : "Variante"}
                  </Badge>
                </InlineStack>
                <Box
                  padding="600"
                  background="bg-surface-secondary"
                  borderRadius="300"
                  minHeight="200px"
                >
                  {/* Simulated store page */}
                  <Box padding="200" background="bg-surface" borderRadius="200">
                    <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                      [Contenido de la tienda]
                    </Text>
                  </Box>
                  <div
                    style={{
                      position: "relative",
                      marginTop: 24,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div style={selectorStyle}>
                      {c.showFlags !== false && <span>🇪🇸</span>}
                      {c.showCountryName !== false && <span>España</span>}
                      {c.showCurrency !== false && (
                        <span style={{ color: c.accentColor || "#2563EB", fontWeight: 600 }}>
                          EUR
                        </span>
                      )}
                      <span style={{ opacity: 0.4 }}>▾</span>
                    </div>
                  </div>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Variant 2: Header integrated */}
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h2">
                    Header
                  </Text>
                  <Badge tone={c.position === "header" ? "success" : undefined}>
                    {c.position === "header" ? "Seleccionado" : "Variante"}
                  </Badge>
                </InlineStack>
                <Box
                  padding="400"
                  background="bg-surface-secondary"
                  borderRadius="300"
                >
                  {/* Simulated header */}
                  <Box padding="200" background="bg-surface" borderRadius="200">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="span" fontWeight="bold">
                        Mi Tienda
                      </Text>
                      <InlineStack gap="300" blockAlign="center">
                        <Text as="span" variant="bodySm">
                          Inicio
                        </Text>
                        <Text as="span" variant="bodySm">
                          Productos
                        </Text>
                        <div style={{ ...selectorStyle, padding: "4px 8px", fontSize: 13 }}>
                          🇪🇸 <span style={{ opacity: 0.4 }}>▾</span>
                        </div>
                      </InlineStack>
                    </InlineStack>
                  </Box>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Variant 3: Footer */}
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h2">
                    Footer
                  </Text>
                  <Badge tone={c.position === "footer" ? "success" : undefined}>
                    {c.position === "footer" ? "Seleccionado" : "Variante"}
                  </Badge>
                </InlineStack>
                <Box
                  padding="400"
                  background="bg-surface-secondary"
                  borderRadius="300"
                >
                  <Box
                    padding="300"
                    background="bg-surface"
                    borderRadius="200"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="span" variant="bodySm" tone="subdued">
                        © 2026 Mi Tienda
                      </Text>
                      <div style={selectorStyle}>
                        🇪🇸 España · EUR <span style={{ opacity: 0.4 }}>▾</span>
                      </div>
                    </InlineStack>
                  </Box>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Dropdown preview */}
        <Card>
          <BlockStack gap="300">
            <Text variant="headingMd" as="h2">
              Dropdown del selector
            </Text>
            <Box
              padding="400"
              background="bg-surface-secondary"
              borderRadius="200"
            >
              <div
                style={{
                  background: c.bgColor || "#fff",
                  borderRadius: c.borderRadius || "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  border: "1px solid #e5e5e5",
                  width: 260,
                  overflow: "hidden",
                }}
              >
                {[
                  { flag: "🇪🇸", name: "España", currency: "EUR", active: true },
                  { flag: "🇫🇷", name: "France", currency: "EUR", active: false },
                  { flag: "🇩🇪", name: "Deutschland", currency: "EUR", active: false },
                  { flag: "🇬🇧", name: "United Kingdom", currency: "GBP", active: false },
                  { flag: "🇮🇹", name: "Italia", currency: "EUR", active: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    style={{
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: item.active ? (c.accentColor || "#2563EB") + "10" : "transparent",
                      borderLeft: item.active
                        ? `3px solid ${c.accentColor || "#2563EB"}`
                        : "3px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{item.flag}</span>
                      <span style={{ color: c.textColor || "#111827" }}>{item.name}</span>
                    </span>
                    <span
                      style={{
                        color: c.accentColor || "#2563EB",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {item.currency}
                    </span>
                  </div>
                ))}
              </div>
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
