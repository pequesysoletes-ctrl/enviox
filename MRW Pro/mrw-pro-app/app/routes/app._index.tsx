import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Banner,
  InlineStack,
  Box,
  InlineGrid,
  Divider,
  Badge,
  ProgressBar,
  Link,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandHeader, EnvioBrandFooter, BrandDivider, BrandAccentBar } from "../components/EnvioBrand";
import { IconPackage, IconTruck, IconAlert, IconCheck, IconEdit, IconClipboard, IconTag, IconCalendar, IconErrorDot, IconChart } from "../components/EnvioIcons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const credentials = await prisma.mrwCredentials.findUnique({
    where: { shop },
  });

  const config = await prisma.shippingConfig.findUnique({
    where: { shop },
  });

  // ── Stats ──
  const totalShipments = await prisma.shipment.count({ where: { shop } });
  const pendingShipments = await prisma.shipment.count({
    where: { shop, status: { in: ["PENDING", "PENDIENTE", "CREADO"] } },
  });
  const inTransitShipments = await prisma.shipment.count({
    where: { shop, status: { in: ["EN_TRANSITO", "EN_REPARTO"] } },
  });
  const deliveredShipments = await prisma.shipment.count({
    where: { shop, status: "ENTREGADO" },
  });
  const errorShipments = await prisma.shipment.count({
    where: { shop, status: { in: ["ERROR", "INCIDENCIA"] } },
  });

  // Recent shipments with errors (for Incidencias section)
  const recentIncidents = await prisma.shipment.findMany({
    where: { shop, status: { in: ["ERROR", "INCIDENCIA"] } },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      shopifyOrderName: true,
      error: true,
      createdAt: true,
    },
  });

  // Service distribution
  const allShipments = await prisma.shipment.findMany({
    where: { shop },
    select: { mrwServiceCode: true },
  });

  const serviceCounts: Record<string, number> = {};
  for (const s of allShipments) {
    const code = s.mrwServiceCode || "0800";
    serviceCounts[code] = (serviceCounts[code] || 0) + 1;
  }

  const serviceNames: Record<string, string> = {
    "0000": "MRW Urgente 10",
    "0100": "MRW Urgente 12",
    "0110": "MRW Urgente 14",
    "0200": "MRW Urgente 19",
    "0300": "MRW Económico",
    "0800": "MRW Ecommerce",
    "0810": "MRW Ecommerce Canje",
  };

  const serviceDistribution = Object.entries(serviceCounts)
    .map(([code, count]) => ({
      name: serviceNames[code] || `Servicio ${code}`,
      count,
      percentage: totalShipments > 0 ? Math.round((count / totalShipments) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Returns count
  const totalReturns = await prisma.returnShipment.count({ where: { shop } });

  // ── Monthly usage for billing ──
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const shipmentsThisMonth = await prisma.shipment.count({
    where: { shop, createdAt: { gte: startOfMonth } },
  });
  const maxShipments = 500; // TODO: get from plan config
  const nextRenewal = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysUntilRenewal = Math.ceil((nextRenewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return json({
    hasCredentials: !!credentials?.verified,
    hasConfig: !!config,
    needsOnboarding: !credentials,
    stats: {
      total: totalShipments,
      pending: pendingShipments,
      inTransit: inTransitShipments,
      delivered: deliveredShipments,
      errors: errorShipments,
      returns: totalReturns,
    },
    usage: {
      shipmentsThisMonth,
      maxShipments,
      daysUntilRenewal,
      renewalDate: nextRenewal.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    },
    recentIncidents,
    serviceDistribution,
  });
};

export default function AppIndex() {
  const {
    hasCredentials,
    hasConfig,
    needsOnboarding,
    stats,
    usage,
    recentIncidents,
    serviceDistribution,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const usagePercent = Math.min(Math.round((usage.shipmentsThisMonth / usage.maxShipments) * 100), 100);
  const remaining = Math.max(usage.maxShipments - usage.shipmentsThisMonth, 0);

  // ─── Onboarding: First time ─────────────────────────
  if (needsOnboarding) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500" inlineAlign="center">
                <Box paddingBlockStart="400">
                  <EnvioBrandHeader size="large" />
                </Box>
                <BrandDivider />
                <Text as="h1" variant="headingXl" alignment="center">
                  Bienvenido a MRW Pro
                </Text>
                <Text as="p" variant="bodyLg" alignment="center">
                  Automatiza tus envíos MRW directamente desde Shopify
                </Text>

                <Divider />

                <BlockStack gap="400">
                  <InlineStack gap="400" align="center">
                    <StepItem number={1} title="Conecta" description="Introduce tus credenciales MRW" active />
                    <StepItem number={2} title="Configura" description="Elige servicio y automatización" />
                    <StepItem number={3} title="Envía" description="Cada pedido genera etiqueta automática" />
                  </InlineStack>
                </BlockStack>

                <Divider />

                <Text as="p" variant="bodyMd" alignment="center" tone="subdued">
                  Esta app conecta con tu contrato MRW propio. Necesitas las credenciales API de tu cuenta MRW de empresa.
                </Text>

                <Button variant="primary" size="large" onClick={() => navigate("/app/settings/mrw")}>
                  Conectar cuenta MRW
                </Button>

                <Button variant="plain" onClick={() => navigate("/app/settings/mrw")}>
                  ¿Dónde encuentro mis credenciales MRW?
                </Button>
                <EnvioBrandFooter />
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // ─── Warning: Credentials not verified ──────────────
  if (!hasCredentials) {
    return (
      <Page title="Dashboard">
        <Layout>
          <Layout.Section>
            <Banner
              title="⚠ Verifica tu conexión MRW para empezar a crear envíos"
              tone="warning"
              action={{ content: "Verificar ahora", onAction: () => navigate("/app/settings/mrw") }}
            />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // ── Time ago helper ──
  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 1) return "hace unos minutos";
    if (diffH < 24) return `hace ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `hace ${diffD}d`;
  };

  // ─── Dashboard: Active ──────────────────────────────
  return (
    <Page
      title="Dashboard"
      subtitle="Visión general de tu actividad logística"
      titleMetadata={<EnvioBrandHeader size="small" />}
    >
      <Layout>
        {/* Config banner */}
        {!hasConfig && (
          <Layout.Section>
            <Banner
              title="Configura tus preferencias de envío"
              tone="info"
              action={{ content: "Configurar", onAction: () => navigate("/app/settings") }}
            >
              Define el servicio por defecto, peso, y opciones de automatización.
            </Banner>
          </Layout.Section>
        )}

        {/* ── Usage Banner ── */}
        <Layout.Section>
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="200">
                <InlineStack gap="200" blockAlign="center">
                  <IconChart size={16} />
                  <Text as="p" variant="bodySm" fontWeight="bold">Plan Profesional</Text>
                  <Badge tone="success">Activo</Badge>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  {usage.shipmentsThisMonth} de {usage.maxShipments} envíos usados · Renueva el {usage.renewalDate} ({usage.daysUntilRenewal} días)
                </Text>
              </BlockStack>
              <Button variant="plain" onClick={() => navigate("/app/billing")}>Ver plan →</Button>
            </InlineStack>
            <Box paddingBlockStart="300">
              <ProgressBar
                progress={usagePercent}
                size="small"
                tone={usagePercent > 90 ? "critical" : usagePercent > 70 ? "highlight" : "primary"}
              />
            </Box>
            {usagePercent >= 80 && (
              <Box paddingBlockStart="200">
                <Banner tone={usagePercent >= 100 ? "critical" : "warning"}>
                  {usagePercent >= 100
                    ? "Has alcanzado el límite de tu plan. Actualiza para seguir creando envíos."
                    : `Te quedan ${remaining} envíos este mes. Considera actualizar tu plan.`
                  }
                </Banner>
              </Box>
            )}
          </Card>
        </Layout.Section>

        {/* ── KPI Cards ── */}
        <Layout.Section>
          <InlineGrid columns={4} gap="400">
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Envíos hoy</Text>
                  <IconPackage size={20} />
                </InlineStack>
                <Text as="p" variant="heading2xl">{stats.pending}</Text>
                <Text as="p" variant="bodySm" tone="success">↗ paquetes</Text>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">En tránsito</Text>
                  <IconTruck size={20} />
                </InlineStack>
                <Text as="p" variant="heading2xl">{stats.inTransit}</Text>
                <Text as="p" variant="bodySm" tone="subdued">paquetes</Text>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Incidencias activas</Text>
                  <IconAlert size={20} />
                </InlineStack>
                <Text as="p" variant="heading2xl">{stats.errors}</Text>
                <Button variant="plain" onClick={() => navigate("/app/shipments")}>Ver todas →</Button>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Entregados (semana)</Text>
                  <IconCheck size={20} />
                </InlineStack>
                <Text as="p" variant="heading2xl">{stats.delivered}</Text>
                <Text as="p" variant="bodySm" tone="success">Completados</Text>
              </BlockStack>
            </Card>
          </InlineGrid>
        </Layout.Section>

        {/* ── Quick actions ── */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Acciones rápidas</Text>
              <InlineStack gap="300">
                <Button variant="primary" icon={<IconEdit size={16} color="#fff" />} onClick={() => navigate("/app/shipments/new")}>
                  Crear envío manual
                </Button>
                <Button icon={<IconClipboard size={16} />} onClick={() => navigate("/app/shipments")}>
                  Ver envíos
                </Button>
                <Button icon={<IconTag size={16} />} onClick={() => navigate("/app/shipments/labels")}>
                  Imprimir etiquetas
                </Button>
                <Button icon={<IconCalendar size={16} />} onClick={() => navigate("/app/pickups")}>
                  Programar recogida
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* ── Bottom sections: Incidents + Service distribution ── */}
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingMd">Incidencias recientes</Text>
                {stats.errors > 0 && (
                  <Badge tone="critical">{stats.errors} Nuevas</Badge>
                )}
              </InlineStack>

              {recentIncidents.length > 0 ? (
                <BlockStack gap="300">
                  {recentIncidents.map((incident: any) => (
                    <Box key={incident.id} padding="300" borderRadius="200">
                      <InlineStack align="space-between" blockAlign="start">
                        <BlockStack gap="100">
                          <InlineStack gap="200" blockAlign="center">
                            <IconErrorDot size={12} />
                            <Text as="span" variant="bodyMd" fontWeight="bold">
                              {incident.shopifyOrderName} — {incident.error?.split(":")[0] || "Error"}
                            </Text>
                          </InlineStack>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {incident.error || "Error desconocido"}
                          </Text>
                        </BlockStack>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {timeAgo(incident.createdAt)}
                        </Text>
                      </InlineStack>
                    </Box>
                  ))}
                  <Divider />
                  <Button variant="plain" onClick={() => navigate("/app/shipments")}>
                    Ver todas las incidencias →
                  </Button>
                </BlockStack>
              ) : (
                <Box padding="400">
                  <InlineStack gap="200" align="center" blockAlign="center">
                    <IconCheck size={16} />
                    <Text as="p" variant="bodyMd" tone="subdued">Sin incidencias activas</Text>
                  </InlineStack>
                </Box>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Distribución por servicio</Text>

              {serviceDistribution.length > 0 ? (
                <BlockStack gap="400">
                  {serviceDistribution.map((svc: any, i: number) => (
                    <BlockStack key={i} gap="100">
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodyMd">{svc.name}</Text>
                        <Text as="p" variant="bodyMd" fontWeight="bold">{svc.percentage}%</Text>
                      </InlineStack>
                      <ProgressBar
                        progress={svc.percentage}
                        size="small"
                        tone={i === 0 ? "primary" : "highlight"}
                      />
                    </BlockStack>
                  ))}
                  <Divider />
                  <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                    Basado en {stats.total} envíos totales
                  </Text>
                </BlockStack>
              ) : (
                <Box padding="400">
                  <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                    Datos disponibles cuando tengas envíos
                  </Text>
                </Box>
              )}
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

// ─── Components ───────────────────────────────────────

function StepItem({ number, title, description, active = false }: {
  number: number;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <Box padding="400" borderRadius="200" background={active ? "bg-surface-info" : "bg-surface-secondary"} minWidth="180px">
      <BlockStack gap="100" inlineAlign="center">
        <Text as="p" variant="headingLg" tone={active ? "info" : "subdued"}>
          {number}
        </Text>
        <Text as="p" variant="headingSm">{title}</Text>
        <Text as="p" variant="bodySm" tone="subdued" alignment="center">{description}</Text>
      </BlockStack>
    </Box>
  );
}
