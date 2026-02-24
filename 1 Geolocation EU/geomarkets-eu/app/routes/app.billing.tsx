// ═══════════════════════════════════════════════════════════════
// Screen 07 — Billing / Plans
// Free → Basic → Pro → Agency with feature comparison
// ═══════════════════════════════════════════════════════════════

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
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
  Box,
  Divider,
  List,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { getShop } from "~/models/shop.server";
import {
  PLANS,
  getShopPlan,
  createSubscription,
  activatePlan,
} from "~/services/billing.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);
  const currentPlan = await getShopPlan(session.shop);

  // Check if returning from billing confirmation
  const url = new URL(request.url);
  const confirmPlan = url.searchParams.get("plan");
  const chargeId = url.searchParams.get("charge_id");

  if (confirmPlan && chargeId) {
    await activatePlan(session.shop, confirmPlan);
    return redirect("/app/billing?activated=true");
  }

  const activated = url.searchParams.get("activated") === "true";

  return json({
    currentPlan: currentPlan.slug,
    trialEndsAt: shop?.trialEndsAt?.toISOString() || null,
    activated,
    plans: Object.values(PLANS),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const planSlug = formData.get("plan") as string;

  const result = await createSubscription(admin, planSlug, session.shop);

  if ("confirmationUrl" in result) {
    return redirect(result.confirmationUrl);
  }

  return json({ error: result.error });
};

export default function BillingPage() {
  const { currentPlan, trialEndsAt, activated, plans } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const handleUpgrade = (planSlug: string) => {
    submit({ plan: planSlug }, { method: "post" });
  };

  return (
    <Page
      title="Plan y facturación"
      subtitle="Elige el plan que mejor se adapte a tu negocio"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <BlockStack gap="500">
        {activated && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>
              🎉 ¡Plan activado correctamente! Disfruta de las nuevas
              funcionalidades.
            </p>
          </Banner>
        )}

        {actionData && "error" in actionData && (
          <Banner tone="critical">
            <p>Error: {actionData.error}</p>
          </Banner>
        )}

        {trialEndsAt && (
          <Banner tone="info">
            <p>
              Tu período de prueba termina el{" "}
              <strong>
                {new Date(trialEndsAt).toLocaleDateString("es-ES")}
              </strong>
              .
            </p>
          </Banner>
        )}

        {/* Plan Cards */}
        <InlineGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap="400">
          {plans.map((plan) => {
            const isCurrent = plan.slug === currentPlan;
            const isPopular = plan.slug === "pro";

            return (
              <Card key={plan.slug} padding="400">
                <BlockStack gap="400">
                  {/* Plan Header */}
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text variant="headingMd" as="h2">
                        {plan.name}
                      </Text>
                      {isCurrent && <Badge tone="success">Actual</Badge>}
                      {isPopular && !isCurrent && (
                        <Badge tone="info">Popular</Badge>
                      )}
                    </InlineStack>
                    <InlineStack gap="100" blockAlign="end">
                      <Text variant="headingXl" as="p" fontWeight="bold">
                        {plan.price === 0
                          ? "Gratis"
                          : `${plan.price.toFixed(2)}€`}
                      </Text>
                      {plan.price > 0 && (
                        <Text as="span" variant="bodySm" tone="subdued">
                          /mes
                        </Text>
                      )}
                    </InlineStack>
                    {plan.trialDays > 0 && (
                      <Text as="p" variant="bodySm" tone="success">
                        {plan.trialDays} días gratis de prueba
                      </Text>
                    )}
                  </BlockStack>

                  <Divider />

                  {/* Features */}
                  <BlockStack gap="200">
                    {plan.features.map((feature) => (
                      <Text
                        key={feature}
                        as="p"
                        variant="bodySm"
                      >
                        ✅ {feature}
                      </Text>
                    ))}
                  </BlockStack>

                  {/* CTA */}
                  <Box paddingBlockStart="200">
                    {isCurrent ? (
                      <Button disabled fullWidth>
                        Plan actual
                      </Button>
                    ) : plan.price === 0 ? (
                      <Button fullWidth disabled>
                        Gratis
                      </Button>
                    ) : (
                      <Button
                        variant={isPopular ? "primary" : "secondary"}
                        fullWidth
                        onClick={() => handleUpgrade(plan.slug)}
                      >
                        {currentPlan === "free"
                          ? "Comenzar prueba gratis"
                          : `Cambiar a ${plan.name}`}
                      </Button>
                    )}
                  </Box>
                </BlockStack>
              </Card>
            );
          })}
        </InlineGrid>

        {/* Feature Comparison Table */}
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h2">
              Comparativa de planes
            </Text>
            <Box>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderBottom: "1px solid #e5e5e5",
                        fontWeight: 600,
                      }}
                    >
                      Funcionalidad
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.slug}
                        style={{
                          textAlign: "center",
                          padding: "8px 12px",
                          borderBottom: "1px solid #e5e5e5",
                          fontWeight: 600,
                        }}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Mercados",
                      values: ["1", "3", "∞", "∞"],
                    },
                    {
                      feature: "Redirect automático",
                      values: ["✅", "✅", "✅", "✅"],
                    },
                    {
                      feature: "Selector de país",
                      values: ["✅", "✅", "✅", "✅"],
                    },
                    {
                      feature: "Exclusión de bots SEO",
                      values: ["—", "✅", "✅", "✅"],
                    },
                    {
                      feature: "Analytics completos",
                      values: ["—", "—", "✅", "✅"],
                    },
                    {
                      feature: "CSS personalizable",
                      values: ["—", "—", "✅", "✅"],
                    },
                    {
                      feature: "Banner personalizable",
                      values: ["—", "—", "✅", "✅"],
                    },
                    {
                      feature: "Multi-tienda",
                      values: ["—", "—", "—", "✅"],
                    },
                    {
                      feature: "API access",
                      values: ["—", "—", "—", "✅"],
                    },
                    {
                      feature: "Soporte prioritario",
                      values: ["—", "—", "—", "✅"],
                    },
                    {
                      feature: "White-label",
                      values: ["—", "—", "—", "✅"],
                    },
                  ].map((row) => (
                    <tr key={row.feature}>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {row.feature}
                      </td>
                      {row.values.map((val, i) => (
                        <td
                          key={i}
                          style={{
                            textAlign: "center",
                            padding: "8px 12px",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
