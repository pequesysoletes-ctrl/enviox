// ═══════════════════════════════════════════════════════════════
// Screen 01 — Onboarding / Welcome Wizard
// 3-step wizard: Sync Markets → Configure Redirect → Customize Selector
// ═══════════════════════════════════════════════════════════════

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  ProgressBar,
  Banner,
  Box,
  Icon,
  Divider,
  List,
} from "@shopify/polaris";
import {
  GlobeIcon,
  SettingsIcon,
  PaintBrushFlatIcon,
  LockIcon,
  ClockIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "~/shopify.server";
import { findOrCreateShop, completeOnboardingStep } from "~/models/shop.server";
import { syncMarkets } from "~/services/markets-sync.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = await findOrCreateShop(session.shop);

  // Already completed onboarding? Go to dashboard
  if (shop.onboardingCompleted) {
    return redirect("/app");
  }

  return json({
    shopDomain: session.shop,
    currentStep: shop.onboardingStep,
    marketsCount: shop.markets.length,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action") as string;
  const shop = await findOrCreateShop(session.shop);

  switch (action) {
    case "sync-markets": {
      const result = await syncMarkets(admin, shop.id, session.shop);
      await completeOnboardingStep(session.shop, 1);
      return json({
        success: true,
        step: 1,
        synced: result.synced,
        errors: result.errors,
      });
    }

    case "configure-redirect": {
      await completeOnboardingStep(session.shop, 2);
      return json({ success: true, step: 2 });
    }

    case "complete": {
      await completeOnboardingStep(session.shop, 3);
      return redirect("/app");
    }

    default:
      return json({ error: "Unknown action" }, { status: 400 });
  }
};

export default function OnboardingPage() {
  const { currentStep, marketsCount } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const [step, setStep] = useState(currentStep);

  // Sync local state when loader data updates after action
  useEffect(() => {
    setStep(currentStep);
  }, [currentStep]);

  const handleAction = useCallback(
    (actionName: string) => {
      submit({ action: actionName }, { method: "post" });
    },
    [submit]
  );

  const progress = Math.round((step / 3) * 100);

  const steps = [
    {
      number: 1,
      title: "Sincronizar Markets",
      description:
        "Conectamos con tu configuración de Shopify Markets para detectar tus mercados activos.",
      icon: GlobeIcon,
      action: "sync-markets",
      actionLabel: "Conectar con Shopify Markets",
    },
    {
      number: 2,
      title: "Configurar redirección",
      description:
        "Elige cómo redirigir a los visitantes: automáticamente, con un banner de confirmación, o solo selector manual.",
      icon: SettingsIcon,
      action: "configure-redirect",
      actionLabel: "Usar configuración recomendada",
    },
    {
      number: 3,
      title: "Personalizar selector",
      description:
        "Ajusta los colores y la posición del selector de país para que encaje con tu tema.",
      icon: PaintBrushFlatIcon,
      action: "complete",
      actionLabel: "Completar configuración",
    },
  ];

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <BlockStack gap="600">
            {/* Header */}
            <Card>
              <BlockStack gap="400">
                <InlineStack gap="300" blockAlign="center">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>🌍</span>
                  </div>
                  <BlockStack gap="100">
                    <Text variant="headingLg" as="h1">
                      GeoMarkets EU
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Detecta el país de tus visitantes y adáptales la tienda
                      automáticamente
                    </Text>
                  </BlockStack>
                </InlineStack>
                <ProgressBar progress={progress} size="small" tone="primary" />
                <Text as="p" variant="bodySm" tone="subdued">
                  Paso {Math.min(step + 1, 3)} de 3
                </Text>
              </BlockStack>
            </Card>

            {/* Wizard Steps */}
            {steps.map((s) => {
              const isActive = s.number === step + 1;
              const isCompleted = s.number <= step;
              const isLocked = s.number > step + 1;

              return (
                <Card key={s.number}>
                  <BlockStack gap="300">
                    <InlineStack gap="300" blockAlign="center">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: isCompleted
                            ? "#059669"
                            : isActive
                            ? "#2563EB"
                            : "#E5E7EB",
                          color: isCompleted || isActive ? "#fff" : "#9CA3AF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {isCompleted ? "✓" : s.number}
                      </div>
                      <BlockStack gap="050">
                        <Text
                          variant="headingMd"
                          as="h2"
                          tone={isLocked ? "subdued" : undefined}
                        >
                          {s.title}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {s.description}
                        </Text>
                      </BlockStack>
                    </InlineStack>

                    {isActive && (
                      <Box paddingBlockStart="200" paddingInlineStart="1200">
                        <Button
                          variant="primary"
                          onClick={() => handleAction(s.action)}
                        >
                          {s.actionLabel}
                        </Button>
                      </Box>
                    )}

                    {isCompleted && (
                      <Box paddingInlineStart="1200">
                        <Text as="p" variant="bodySm" tone="success">
                          ✅ Completado
                          {s.number === 1 && marketsCount > 0
                            ? ` — ${marketsCount} mercados detectados`
                            : ""}
                        </Text>
                      </Box>
                    )}
                  </BlockStack>
                </Card>
              );
            })}

            {/* Action feedback */}
            {actionData && "success" in actionData && actionData.success && (
              <Banner tone="success">
                <p>
                  {actionData.step === 1
                    ? `¡Mercados sincronizados! Se detectaron ${
                        (actionData as any).synced || 0
                      } mercados.`
                    : actionData.step === 2
                    ? "Configuración de redirección guardada."
                    : "¡Configuración completada!"}
                </p>
              </Banner>
            )}

            {/* Trust Badges */}
            <Card>
              <InlineStack gap="600" align="center">
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={LockIcon} tone="subdued" />
                  <Text as="p" variant="bodySm" tone="subdued">
                    No almacenamos IPs
                  </Text>
                </InlineStack>
                <InlineStack gap="200" blockAlign="center">
                  <Text as="span" variant="bodySm">
                    🇪🇺
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    RGPD compliant
                  </Text>
                </InlineStack>
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={ClockIcon} tone="subdued" />
                  <Text as="p" variant="bodySm" tone="subdued">
                    {"<100ms latencia"}
                  </Text>
                </InlineStack>
              </InlineStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Right column: Europe map / info */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                ¿Cómo funciona?
              </Text>
              <List type="number">
                <List.Item>
                  Detectamos el país del visitante en {"<100ms"} usando
                  Cloudflare Workers (edge computing).
                </List.Item>
                <List.Item>
                  Comparamos con tus Shopify Markets configurados.
                </List.Item>
                <List.Item>
                  Redirigimos al mercado correcto (idioma, moneda, precios
                  locales).
                </List.Item>
              </List>
              <Divider />
              <Text variant="headingSm" as="h3">
                Compatible con:
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                ✅ Todos los temas de Shopify
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                ✅ Shopify Markets (subfolders, subdomains, domains)
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                ✅ Multi-idioma y multi-moneda
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                ✅ SEO-safe (no redirige bots)
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
