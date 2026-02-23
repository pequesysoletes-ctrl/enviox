// ═══════════════════════════════════════════════════════════════
// Screen 03 — Configuración de Redirección
// Redirect mode, banner config, exclusions, VAT defaults
// ═══════════════════════════════════════════════════════════════

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  RadioButton,
  Checkbox,
  TextField,
  Button,
  Banner,
  Badge,
  Box,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { getShop, updateRedirectSettings, updateBannerConfig } from "~/models/shop.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);

  if (!shop) {
    return json({ error: "Shop not found" }, { status: 404 });
  }

  return json({
    redirectMode: shop.redirectMode,
    excludeBots: shop.excludeBots,
    excludeCheckout: shop.excludeCheckout,
    respectUserChoice: shop.respectUserChoice,
    excludedUrls: shop.excludedUrls,
    bannerConfig: shop.bannerConfig,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const redirectMode = formData.get("redirectMode") as string;
  const excludeBots = formData.get("excludeBots") === "true";
  const excludeCheckout = formData.get("excludeCheckout") === "true";
  const respectUserChoice = formData.get("respectUserChoice") === "true";
  const excludedUrls = (formData.get("excludedUrls") as string) || "";

  await updateRedirectSettings(session.shop, {
    redirectMode,
    excludeBots,
    excludeCheckout,
    respectUserChoice,
    excludedUrls,
  });

  return json({ saved: true });
};

export default function SettingsPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const [redirectMode, setRedirectMode] = useState(
    "error" in data ? "auto" : data.redirectMode
  );
  const [excludeBots, setExcludeBots] = useState(
    "error" in data ? true : data.excludeBots
  );
  const [excludeCheckout, setExcludeCheckout] = useState(
    "error" in data ? true : data.excludeCheckout
  );
  const [respectUserChoice, setRespectUserChoice] = useState(
    "error" in data ? true : data.respectUserChoice
  );
  const [excludedUrls, setExcludedUrls] = useState(
    "error" in data ? "" : data.excludedUrls
  );

  const handleSave = useCallback(() => {
    submit(
      {
        redirectMode,
        excludeBots: String(excludeBots),
        excludeCheckout: String(excludeCheckout),
        respectUserChoice: String(respectUserChoice),
        excludedUrls,
      },
      { method: "post" }
    );
  }, [
    submit,
    redirectMode,
    excludeBots,
    excludeCheckout,
    respectUserChoice,
    excludedUrls,
  ]);

  return (
    <Page
      title="Configuración de redirección"
      subtitle="Define cómo se redirige a los visitantes según su geolocalización"
      primaryAction={{
        content: "Guardar configuración",
        onAction: handleSave,
      }}
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <BlockStack gap="500">
        {actionData && "saved" in actionData && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>Configuración guardada correctamente.</p>
          </Banner>
        )}

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Card 1 — Redirect Mode */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Modo de redirección
                  </Text>
                  <BlockStack gap="300">
                    <RadioButton
                      label="Automática (redirect 302 inmediato)"
                      helpText="Redirige al visitante al mercado correcto sin intervención. Recomendado para la mejor experiencia de usuario."
                      checked={redirectMode === "auto"}
                      id="auto"
                      name="redirectMode"
                      onChange={() => setRedirectMode("auto")}
                    />
                    <Badge tone="info">Recomendado</Badge>

                    <RadioButton
                      label="Con banner de confirmación"
                      helpText="Muestra un banner preguntando al visitante si desea cambiar de mercado. Más respetuoso pero puede perder conversiones."
                      checked={redirectMode === "banner"}
                      id="banner"
                      name="redirectMode"
                      onChange={() => setRedirectMode("banner")}
                    />

                    <RadioButton
                      label="Solo selector manual (sin redirect)"
                      helpText="No redirige automáticamente. El visitante elige el mercado usando el widget selector."
                      checked={redirectMode === "manual"}
                      id="manual"
                      name="redirectMode"
                      onChange={() => setRedirectMode("manual")}
                    />
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Card 2 — Banner Config (conditional) */}
              {redirectMode === "banner" && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Banner de confirmación
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Preview del banner que verá el visitante. El texto se
                      adapta automáticamente al idioma detectado.
                    </Text>

                    {/* Banner Preview */}
                    <Box
                      padding="400"
                      background="bg-surface-secondary"
                      borderRadius="200"
                      borderWidth="025"
                      borderColor="border"
                    >
                      <InlineStack
                        align="space-between"
                        blockAlign="center"
                        gap="400"
                      >
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="span" variant="bodyMd">
                            🇫🇷
                          </Text>
                          <Text as="span" variant="bodyMd">
                            Il semble que vous êtes en France. Voulez-vous voir
                            la boutique en français?
                          </Text>
                        </InlineStack>
                        <InlineStack gap="200">
                          <Button variant="primary" size="slim">
                            Oui, changer
                          </Button>
                          <Button size="slim">Non, rester ici</Button>
                        </InlineStack>
                      </InlineStack>
                    </Box>

                    <Banner tone="info">
                      <p>
                        Los textos del banner se generan automáticamente en el
                        idioma del mercado detectado. Puedes personalizarlos en
                        la configuración avanzada.
                      </p>
                    </Banner>
                  </BlockStack>
                </Card>
              )}

              {/* Card 3 — Exclusions */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Exclusiones
                  </Text>

                  <Checkbox
                    label="No redirigir bots de buscadores (Google, Bing, etc.)"
                    helpText="Siempre activado. Los crawlers ven tu página original para mantener el SEO intacto."
                    checked={excludeBots}
                    onChange={setExcludeBots}
                  />

                  <Checkbox
                    label="No redirigir desde páginas de checkout"
                    helpText="Evita interrumpir el proceso de pago con redirecciones."
                    checked={excludeCheckout}
                    onChange={setExcludeCheckout}
                  />

                  <Checkbox
                    label="Respetar elección manual del usuario (30 días)"
                    helpText="Si un visitante cambia de mercado manualmente, no lo redirigimos de nuevo durante 30 días."
                    checked={respectUserChoice}
                    onChange={setRespectUserChoice}
                  />

                  <TextField
                    label="URLs a excluir de redirección"
                    value={excludedUrls}
                    onChange={setExcludedUrls}
                    multiline={4}
                    helpText="Una URL por línea. Ejemplo: /landing-global, /api/*, /admin/*"
                    placeholder="/landing-especial&#10;/promo-global&#10;/api/*"
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar info */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  💡 Recomendaciones
                </Text>
                <Text as="p" variant="bodySm">
                  <strong>Automática</strong> es la opción recomendada para
                  tiendas con público europeo. Los visitantes ven
                  automáticamente el mercado correcto sin fricción.
                </Text>
                <Divider />
                <Text as="p" variant="bodySm">
                  <strong>Banner</strong> es ideal si prefieres pedir
                  consentimiento antes de redirigir. Cumple con las normativas
                  más estrictas de UX.
                </Text>
                <Divider />
                <Text as="p" variant="bodySm">
                  <strong>Manual</strong> es la opción menos intrusiva. Solo
                  muestra el widget selector sin redirigir automáticamente.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
