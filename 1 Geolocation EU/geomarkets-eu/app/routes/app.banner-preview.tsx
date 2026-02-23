// ═══════════════════════════════════════════════════════════════
// Screen 09 — Banner Preview
// Shows how the redirect banner looks in different languages
// ═══════════════════════════════════════════════════════════════

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Select,
  Box,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { getShop } from "~/models/shop.server";

const BANNER_EXAMPLES = [
  {
    lang: "fr",
    flag: "🇫🇷",
    label: "Français",
    text: "Il semble que vous êtes en France. Voulez-vous voir la boutique en français?",
    accept: "Oui, changer",
    reject: "Non, rester ici",
  },
  {
    lang: "de",
    flag: "🇩🇪",
    label: "Deutsch",
    text: "Es sieht so aus, als wären Sie in Deutschland. Möchten Sie den Shop auf Deutsch sehen?",
    accept: "Ja, wechseln",
    reject: "Nein, hier bleiben",
  },
  {
    lang: "it",
    flag: "🇮🇹",
    label: "Italiano",
    text: "Sembra che tu sia in Italia. Vuoi vedere il negozio in italiano?",
    accept: "Sì, cambia",
    reject: "No, resta qui",
  },
  {
    lang: "pt",
    flag: "🇵🇹",
    label: "Português",
    text: "Parece que está em Portugal. Deseja ver a loja em português?",
    accept: "Sim, mudar",
    reject: "Não, ficar aqui",
  },
  {
    lang: "nl",
    flag: "🇳🇱",
    label: "Nederlands",
    text: "Het lijkt erop dat u in Nederland bent. Wilt u de winkel in het Nederlands bekijken?",
    accept: "Ja, wijzigen",
    reject: "Nee, hier blijven",
  },
  {
    lang: "en",
    flag: "🇬🇧",
    label: "English",
    text: "It looks like you're visiting from the UK. Would you like to see the shop in English?",
    accept: "Yes, switch",
    reject: "No, stay here",
  },
  {
    lang: "es",
    flag: "🇪🇸",
    label: "Español",
    text: "Parece que nos visitas desde España. ¿Quieres ver la tienda en español?",
    accept: "Sí, cambiar",
    reject: "No, quedarme aquí",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);

  return json({
    bannerConfig: shop?.bannerConfig || null,
  });
};

export default function BannerPreviewPage() {
  const { bannerConfig } = useLoaderData<typeof loader>();
  const [selectedLang, setSelectedLang] = useState("fr");
  const [position, setPosition] = useState("top");

  const example = BANNER_EXAMPLES.find((b) => b.lang === selectedLang) || BANNER_EXAMPLES[0];

  return (
    <Page
      title="Preview del banner de redirección"
      subtitle="Así verán el banner tus visitantes en diferentes idiomas"
      backAction={{ content: "Configuración", url: "/app/settings" }}
    >
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Language Selector */}
              <Card>
                <InlineStack gap="400" blockAlign="center">
                  <Select
                    label="Idioma"
                    labelInline
                    options={BANNER_EXAMPLES.map((b) => ({
                      label: `${b.flag} ${b.label}`,
                      value: b.lang,
                    }))}
                    value={selectedLang}
                    onChange={setSelectedLang}
                  />
                  <Select
                    label="Posición"
                    labelInline
                    options={[
                      { label: "Superior", value: "top" },
                      { label: "Inferior", value: "bottom" },
                    ]}
                    value={position}
                    onChange={setPosition}
                  />
                </InlineStack>
              </Card>

              {/* Banner Preview — Top */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Preview: Banner {position === "top" ? "superior" : "inferior"}
                  </Text>
                  
                  {/* Simulated store page */}
                  <Box
                    padding="0"
                    background="bg-surface-secondary"
                    borderRadius="300"
                    minHeight="300px"
                  >
                    {/* Banner */}
                    <div
                      style={{
                        background: "#fff",
                        borderBottom: position === "top" ? "2px solid #2563EB" : "none",
                        borderTop: position === "bottom" ? "2px solid #2563EB" : "none",
                        padding: "14px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        fontSize: 14,
                        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        order: position === "bottom" ? 1 : 0,
                        position: "relative",
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{example.flag}</span>
                      <span style={{ color: "#111827" }}>{example.text}</span>
                      <button
                        style={{
                          background: "#008060",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {example.accept}
                      </button>
                      <button
                        style={{
                          background: "transparent",
                          color: "#6B7280",
                          border: "none",
                          textDecoration: "underline",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {example.reject}
                      </button>
                      <button
                        style={{
                          position: "absolute",
                          right: 12,
                          background: "none",
                          border: "none",
                          color: "#9CA3AF",
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Simulated page content */}
                    <Box padding="600">
                      <BlockStack gap="200">
                        <div
                          style={{
                            height: 20,
                            width: "60%",
                            background: "#e5e7eb",
                            borderRadius: 4,
                          }}
                        />
                        <div
                          style={{
                            height: 14,
                            width: "80%",
                            background: "#f3f4f6",
                            borderRadius: 4,
                          }}
                        />
                        <div
                          style={{
                            height: 14,
                            width: "40%",
                            background: "#f3f4f6",
                            borderRadius: 4,
                          }}
                        />
                        <div
                          style={{
                            height: 100,
                            width: "100%",
                            background: "#f9fafb",
                            borderRadius: 8,
                            marginTop: 16,
                          }}
                        />
                      </BlockStack>
                    </Box>
                  </Box>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Idiomas disponibles
                  </Text>
                  {BANNER_EXAMPLES.map((b) => (
                    <InlineStack key={b.lang} gap="200" blockAlign="center">
                      <Text as="span">{b.flag}</Text>
                      <Text as="span" variant="bodySm">
                        {b.label}
                      </Text>
                      <Badge tone="success">Activo</Badge>
                    </InlineStack>
                  ))}
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    💡 Personalización
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Los textos del banner se generan automáticamente en el
                    idioma del mercado detectado. Puedes personalizar los textos
                    para cada idioma en la configuración avanzada.
                  </Text>
                  <Button variant="plain" url="/app/settings">
                    Ir a configuración
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
