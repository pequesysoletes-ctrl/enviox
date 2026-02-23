import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Banner,
  InlineStack,
  Badge,
  Box,
  Divider,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { EnvioBrandHeader, EnvioBrandFooter, BrandAccentBar } from "../components/EnvioBrand";
import { CARRIERS, PRICING_TIERS, type CarrierId } from "../services/carrier.server";
import { useState } from "react";

/**
 * Carrier Selection & Configuration Hub
 * 
 * The merchant activates carriers here and configures each one.
 * Links to individual carrier settings pages for credentials.
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  // In production, load from DB which carriers are active
  return json({
    carriers: Object.values(CARRIERS),
    activeCarriers: ["mrw"] as CarrierId[], // Default — would come from DB
    currentPlan: "starter" as keyof typeof PRICING_TIERS,
    tiers: PRICING_TIERS,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "toggleCarrier") {
    const carrier = formData.get("carrier")?.toString() as CarrierId;
    // In production: toggle carrier in DB, check plan limits
    return json({ success: true, message: `Carrier ${carrier} actualizado.` });
  }

  return json({ success: false });
};

// ─── Carrier Card Component ─────────────────────────

function CarrierCard({
  carrier,
  isActive,
  canActivate,
}: {
  carrier: typeof CARRIERS[CarrierId];
  isActive: boolean;
  canActivate: boolean;
}) {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const settingsUrl: Record<CarrierId, string> = {
    mrw: "/app/settings/mrw",
    correos: "/app/settings/correos",
    dhl: "/app/settings/dhl",
  };

  return (
    <Card>
      <BlockStack gap="400">
        {/* Header with color bar */}
        <div
          style={{
            height: "4px",
            background: carrier.color,
            borderRadius: "4px 4px 0 0",
            marginTop: "-16px",
            marginLeft: "-16px",
            marginRight: "-16px",
          }}
        />

        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="300" blockAlign="center">
            <span style={{ fontSize: "32px" }}>{carrier.logo}</span>
            <BlockStack gap="050">
              <Text as="h2" variant="headingLg">{carrier.name}</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {carrier.id === "mrw" && "Mensajería urgente nacional · SOAP API"}
                {carrier.id === "correos" && "Paquetería nacional e internacional · REST API"}
                {carrier.id === "dhl" && "Express internacional · REST API v2"}
              </Text>
            </BlockStack>
          </InlineStack>

          {isActive ? (
            <Badge tone="success">✅ Activo</Badge>
          ) : (
            <Badge tone="attention">Inactivo</Badge>
          )}
        </InlineStack>

        {/* Services preview */}
        <Box padding="300" background="bg-surface-secondary" borderRadius="200">
          <BlockStack gap="100">
            <Text as="p" variant="bodySm" fontWeight="bold">Servicios disponibles:</Text>
            {carrier.id === "mrw" && (
              <Text as="p" variant="bodySm" tone="subdued">
                e-Commerce 24-48h · Urgente 19h · Urgente 14h · Económico · Devoluciones
              </Text>
            )}
            {carrier.id === "correos" && (
              <Text as="p" variant="bodySm" tone="subdued">
                Paq Premium 24h · Paq Estándar 48-72h · Paq Today · Paq 48 · Paq Retorno · Internacional
              </Text>
            )}
            {carrier.id === "dhl" && (
              <Text as="p" variant="bodySm" tone="subdued">
                DHL Paket · DHL Express · Europaket · Warenpost · Express 9:00 · Express 12:00
              </Text>
            )}
          </BlockStack>
        </Box>

        {/* Actions */}
        <InlineStack gap="300" align="end">
          {isActive ? (
            <>
              <Button url={settingsUrl[carrier.id]}>
                ⚙️ Configurar credenciales
              </Button>
              <Form method="POST">
                <input type="hidden" name="intent" value="toggleCarrier" />
                <input type="hidden" name="carrier" value={carrier.id} />
                <Button submit tone="critical" variant="plain" disabled={isLoading}>
                  Desactivar
                </Button>
              </Form>
            </>
          ) : (
            <Form method="POST">
              <input type="hidden" name="intent" value="toggleCarrier" />
              <input type="hidden" name="carrier" value={carrier.id} />
              <Button
                submit
                variant="primary"
                disabled={isLoading || !canActivate}
              >
                {canActivate ? "🚀 Activar carrier" : "🔒 Upgrade necesario"}
              </Button>
            </Form>
          )}
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────

export default function CarriersSettingsPage() {
  const { carriers, activeCarriers, currentPlan, tiers } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const currentTier = tiers[currentPlan];

  return (
    <Page
      title="Carriers de envío"
      subtitle="Activa y configura los transportistas que usarás en tu tienda"
      backAction={{ url: "/app/settings" }}
    >
      <Layout>
        {actionData?.message && (
          <Layout.Section>
            <Banner tone={actionData.success ? "success" : "critical"}>
              {actionData.message}
            </Banner>
          </Layout.Section>
        )}

        {/* Current plan info */}
        <Layout.Section>
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <InlineStack gap="200" blockAlign="center">
                  <Text as="h2" variant="headingMd">Plan actual:</Text>
                  <Badge tone="info">{currentTier.name} — {currentTier.price}€/mes</Badge>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  Usando {activeCarriers.length} de {currentTier.maxCarriers} carrier{currentTier.maxCarriers > 1 ? "s" : ""} disponibles
                </Text>
              </BlockStack>
              <Button url="/app/billing" variant="plain">
                Cambiar plan →
              </Button>
            </InlineStack>
          </Card>
        </Layout.Section>

        {/* Carrier Cards */}
        <Layout.Section>
          <InlineGrid columns={3} gap="400">
            {carriers.map((carrier) => (
              <CarrierCard
                key={carrier.id}
                carrier={carrier}
                isActive={activeCarriers.includes(carrier.id)}
                canActivate={activeCarriers.length < currentTier.maxCarriers}
              />
            ))}
          </InlineGrid>
        </Layout.Section>

        {/* Pricing comparison */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">📋 Comparativa de planes</Text>

              <InlineGrid columns={3} gap="400">
                {Object.entries(tiers).map(([key, tier]) => (
                  <Box
                    key={key}
                    padding="400"
                    background={key === currentPlan ? "bg-surface-selected" : "bg-surface-secondary"}
                    borderRadius="300"
                    borderWidth={key === currentPlan ? "050" : "0"}
                    borderColor="border-interactive"
                  >
                    <BlockStack gap="300">
                      <BlockStack gap="050">
                        <Text as="h3" variant="headingMd">{tier.name}</Text>
                        <InlineStack gap="100" blockAlign="baseline">
                          <Text as="span" variant="headingXl">{tier.price}€</Text>
                          <Text as="span" variant="bodySm" tone="subdued">/mes</Text>
                        </InlineStack>
                      </BlockStack>

                      <Divider />

                      <BlockStack gap="100">
                        {tier.features.map((feature, i) => (
                          <Text key={i} as="p" variant="bodySm">
                            ✅ {feature}
                          </Text>
                        ))}
                      </BlockStack>

                      {key === currentPlan ? (
                        <Badge tone="success">Plan actual</Badge>
                      ) : (
                        <Button url="/app/billing" fullWidth>
                          {Number(tier.price) > Number(currentTier.price) ? "Upgrade" : "Downgrade"}
                        </Button>
                      )}
                    </BlockStack>
                  </Box>
                ))}
              </InlineGrid>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
