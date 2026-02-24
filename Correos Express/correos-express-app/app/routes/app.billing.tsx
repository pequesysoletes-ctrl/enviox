import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Badge,
  Button,
  InlineStack,
  Box,
  Divider,
  InlineGrid,
  ProgressBar,
  DataTable,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Count this month's shipments
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const shipmentsThisMonth = await prisma.shipment.count({
    where: {
      shop,
      createdAt: { gte: startOfMonth },
    },
  });

  return json({ shipmentsThisMonth });
};

interface PlanCardProps {
  name: string;
  description: string;
  price: string;
  features: string[];
  isCurrent: boolean;
  buttonLabel?: string;
  onAction?: () => void;
}

function PlanCard({ name, description, price, features, isCurrent, buttonLabel, onAction }: PlanCardProps) {
  return (
    <Box
      padding="500"
      borderRadius="200"
      borderWidth="025"
      borderColor={isCurrent ? "border-info" : "border"}
      background={isCurrent ? "bg-surface" : "bg-surface"}
    >
      <BlockStack gap="400">
        {isCurrent && (
          <Box>
            <Badge tone="info">PLAN ACTUAL</Badge>
          </Box>
        )}
        <Text as="h3" variant="headingMd" fontWeight="bold">{name}</Text>
        <Text as="p" variant="bodySm" tone="subdued">{description}</Text>
        <InlineStack gap="100" blockAlign="baseline">
          <Text as="p" variant="heading2xl" fontWeight="bold">{price}</Text>
          <Text as="span" variant="bodySm" tone="subdued">/mes</Text>
        </InlineStack>

        <BlockStack gap="200">
          {features.map((f, i) => (
            <InlineStack key={i} gap="200" blockAlign="center">
              <Text as="span" variant="bodySm" tone="info">✔</Text>
              <Text as="span" variant="bodySm">{f}</Text>
            </InlineStack>
          ))}
        </BlockStack>

        {isCurrent ? (
          <Button disabled fullWidth>Plan Seleccionado</Button>
        ) : (
          <Button variant={buttonLabel === "Upgrade" ? "primary" : "secondary"} fullWidth onClick={onAction}>
            {buttonLabel || "Seleccionar"}
          </Button>
        )}
      </BlockStack>
    </Box>
  );
}

export default function BillingPage() {
  const { shipmentsThisMonth } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const maxShipments = 500;
  const usagePercent = Math.min(Math.round((shipmentsThisMonth / maxShipments) * 100), 100);
  const remaining = Math.max(maxShipments - shipmentsThisMonth, 0);

  const nextRenewal = new Date();
  nextRenewal.setMonth(nextRenewal.getMonth() + 1);
  nextRenewal.setDate(1);
  const renewalStr = nextRenewal.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

  // Mock billing history
  const now = new Date();
  const billingHistory = [
    [
      new Date(now.getFullYear(), now.getMonth() - 0, 1).toLocaleDateString("es-ES"),
      "Plan Profesional",
      "29,99€",
      "Pagado",
      "Descargar",
    ],
    [
      new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleDateString("es-ES"),
      "Plan Profesional",
      "29,99€",
      "Pagado",
      "Descargar",
    ],
    [
      new Date(now.getFullYear(), now.getMonth() - 2, 1).toLocaleDateString("es-ES"),
      "Plan Básico",
      "9,99€",
      "Pagado",
      "Descargar",
    ],
  ];

  return (
    <Page title="Facturación y plan" subtitle="Gestiona tu suscripción, métodos de pago y descarga tus facturas.">
      <Layout>
        {/* Current plan */}
        <Layout.Section>
          <Card>
            <InlineStack align="space-between" blockAlign="start">
              <BlockStack gap="300">
                <Text as="p" variant="bodySm" tone="subdued" fontWeight="bold">TU PLAN ACTUAL</Text>
                <InlineStack gap="200" blockAlign="center">
                  <Text as="h2" variant="headingXl" fontWeight="bold">Plan Profesional</Text>
                  <Badge tone="success">Activo</Badge>
                </InlineStack>
                <Text as="p" variant="heading2xl" fontWeight="bold">29,99€<Text as="span" variant="bodySm" tone="subdued">/mes</Text></Text>
              </BlockStack>
              <BlockStack gap="200" inlineAlign="end">
                <Button>Cambiar plan</Button>
                <Button variant="plain" tone="critical">Cancelar suscripción</Button>
              </BlockStack>
            </InlineStack>

            <Box paddingBlockStart="400">
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm">
                    Envíos este mes: {shipmentsThisMonth} / {maxShipments}
                  </Text>
                  <Text as="p" variant="bodySm" fontWeight="bold" tone={usagePercent > 90 ? "critical" : "info"}>
                    {usagePercent}%
                  </Text>
                </InlineStack>
                <ProgressBar
                  progress={usagePercent}
                  size="small"
                  tone={usagePercent > 90 ? "critical" : "primary"}
                />
                <Text as="p" variant="bodySm" tone="subdued">
                  ℹ️ Te quedan {remaining} envíos en tu ciclo actual (renueva el {renewalStr})
                </Text>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        {/* Plans comparison */}
        <Layout.Section>
          <InlineGrid columns={3} gap="400">
            <PlanCard
              name="Básico"
              description="Para pequeños envíos ocasionales."
              price="9,99€"
              features={["100 envíos mensuales", "Soporte estándar"]}
              isCurrent={false}
              buttonLabel="Downgrade"
            />
            <PlanCard
              name="Profesional"
              description="La solución ideal para eCommerce en crecimiento."
              price="29,99€"
              features={["500 envíos mensuales", "Soporte prioritario", "Integraciones API"]}
              isCurrent={true}
            />
            <PlanCard
              name="Enterprise"
              description="Para grandes volúmenes y logística compleja."
              price="79,99€"
              features={["Envíos ilimitados", "Account Manager dedicado", "SLA garantizado"]}
              isCurrent={false}
              buttonLabel="Upgrade"
            />
          </InlineGrid>
        </Layout.Section>

        {/* Billing history */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Historial de facturación</Text>
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text"]}
                headings={["FECHA", "CONCEPTO", "IMPORTE", "ESTADO", "FACTURA"]}
                rows={billingHistory.map((row) => [
                  row[0],
                  row[1],
                  row[2],
                  <Badge tone="success">{row[3]}</Badge>,
                  <Button variant="plain" size="micro">📥 {row[4]}</Button>,
                ])}
              />
              <Box paddingBlockStart="200">
                <Button variant="plain" fullWidth>Ver todas las facturas</Button>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Brand footer */}
        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
