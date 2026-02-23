import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Box,
  InlineGrid,
  Select,
  Divider,
  Badge,
  ProgressBar,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { IconPackage, IconTruck, IconCheck, IconAlert, IconChart } from "../components/EnvioIcons";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const now = new Date();

  // ── Monthly stats (last 6 months) ──
  const monthlyStats = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const monthName = start.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });

    const total = await prisma.shipment.count({
      where: { shop, createdAt: { gte: start, lte: end } },
    });
    const delivered = await prisma.shipment.count({
      where: { shop, status: "ENTREGADO", createdAt: { gte: start, lte: end } },
    });
    const errors = await prisma.shipment.count({
      where: { shop, status: { in: ["ERROR", "INCIDENCIA"] }, createdAt: { gte: start, lte: end } },
    });

    monthlyStats.push({ month: monthName, total, delivered, errors });
  }

  // ── Weekly stats (last 4 weeks) ──
  const weeklyStats = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - (i + 1) * 7);
    const end = new Date(now);
    end.setDate(now.getDate() - i * 7);
    const label = `Sem ${4 - i}`;

    const total = await prisma.shipment.count({
      where: { shop, createdAt: { gte: start, lte: end } },
    });
    weeklyStats.push({ week: label, total });
  }

  // ── Service breakdown ──
  const allShipments = await prisma.shipment.findMany({
    where: { shop },
    select: { mrwServiceCode: true, status: true },
  });

  const serviceNames: Record<string, string> = {
    "0000": "Urgente 10",
    "0100": "Urgente 12",
    "0110": "Urgente 14",
    "0200": "Urgente 19",
    "0300": "Económico",
    "0800": "e-Commerce",
    "0810": "e-Commerce Canje",
  };

  const serviceCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  for (const s of allShipments) {
    const code = s.mrwServiceCode || "0800";
    serviceCounts[code] = (serviceCounts[code] || 0) + 1;
    statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
  }

  const serviceBreakdown = Object.entries(serviceCounts)
    .map(([code, count]) => ({
      name: serviceNames[code] || `Servicio ${code}`,
      count,
      pct: allShipments.length > 0 ? Math.round((count / allShipments.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const statusBreakdown = Object.entries(statusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  // ── Top destinations ──
  const destinations = await prisma.shipment.groupBy({
    by: ["destinationProvince"],
    where: { shop, destinationProvince: { not: "" } },
    _count: true,
    orderBy: { _count: { destinationProvince: "desc" } },
    take: 8,
  });

  const topDestinations = destinations.map((d) => ({
    province: d.destinationProvince,
    count: d._count,
    pct: allShipments.length > 0 ? Math.round((d._count / allShipments.length) * 100) : 0,
  }));

  // ── KPIs ──
  const totalShipments = allShipments.length;
  const deliveredTotal = statusCounts["ENTREGADO"] || 0;
  const deliveryRate = totalShipments > 0 ? Math.round((deliveredTotal / totalShipments) * 100) : 0;
  const incidentRate = totalShipments > 0 ? Math.round(((statusCounts["ERROR"] || 0) + (statusCounts["INCIDENCIA"] || 0)) / totalShipments * 100) : 0;

  // Average weight
  const avgWeightResult = await prisma.shipment.aggregate({
    where: { shop },
    _avg: { weight: true },
  });

  return json({
    monthlyStats,
    weeklyStats,
    serviceBreakdown,
    statusBreakdown,
    topDestinations,
    kpis: {
      totalShipments,
      deliveryRate,
      incidentRate,
      avgWeight: Math.round((avgWeightResult._avg.weight || 2) * 10) / 10,
    },
  });
};

export default function AnalyticsPage() {
  const {
    monthlyStats,
    weeklyStats,
    serviceBreakdown,
    statusBreakdown,
    topDestinations,
    kpis,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const maxMonthly = Math.max(...monthlyStats.map((m: any) => m.total), 1);

  const statusColors: Record<string, string> = {
    CREADO: "#3B82F6",
    PENDIENTE: "#F59E0B",
    EN_TRANSITO: "#0EA5E9",
    EN_REPARTO: "#8B5CF6",
    ENTREGADO: "#10B981",
    ERROR: "#EF4444",
    INCIDENCIA: "#EF4444",
    DEVUELTO: "#6B7280",
  };

  const statusLabels: Record<string, string> = {
    CREADO: "Registrado",
    PENDIENTE: "Pendiente",
    EN_TRANSITO: "En tránsito",
    EN_REPARTO: "En reparto",
    ENTREGADO: "Entregado",
    ERROR: "Error",
    INCIDENCIA: "Incidencia",
    DEVUELTO: "Devuelto",
  };

  return (
    <Page
      title="Analytics"
      subtitle="Estadísticas detalladas de tu actividad logística"
      backAction={{ content: "Dashboard", onAction: () => navigate("/app") }}
    >
      <Layout>
        {/* KPI summary */}
        <Layout.Section>
          <InlineGrid columns={4} gap="400">
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Total envíos</Text>
                  <IconPackage size={18} />
                </InlineStack>
                <Text as="p" variant="heading2xl">{kpis.totalShipments}</Text>
                <Text as="p" variant="bodySm" tone="subdued">histórico completo</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Tasa de entrega</Text>
                  <IconCheck size={18} />
                </InlineStack>
                <Text as="p" variant="heading2xl">{kpis.deliveryRate}%</Text>
                <ProgressBar progress={kpis.deliveryRate} size="small" tone="primary" />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Tasa de incidencias</Text>
                  <IconAlert size={18} />
                </InlineStack>
                <Text as="p" variant="heading2xl" tone={kpis.incidentRate > 10 ? "critical" : undefined}>
                  {kpis.incidentRate}%
                </Text>
                <ProgressBar progress={kpis.incidentRate} size="small" tone={kpis.incidentRate > 10 ? "critical" : "primary"} />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Peso medio</Text>
                  <IconTruck size={18} />
                </InlineStack>
                <Text as="p" variant="heading2xl">{kpis.avgWeight} kg</Text>
                <Text as="p" variant="bodySm" tone="subdued">por envío</Text>
              </BlockStack>
            </Card>
          </InlineGrid>
        </Layout.Section>

        {/* Monthly chart (bar chart using CSS) */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingMd">Envíos por mes</Text>
                <Text as="p" variant="bodySm" tone="subdued">Últimos 6 meses</Text>
              </InlineStack>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "160px", padding: "0 8px" }}>
                {monthlyStats.map((m: any, i: number) => {
                  const height = maxMonthly > 0 ? Math.max((m.total / maxMonthly) * 140, 4) : 4;
                  const isCurrentMonth = i === monthlyStats.length - 1;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <Text as="span" variant="bodySm" fontWeight="bold">{m.total}</Text>
                      <div style={{
                        width: "100%",
                        height: `${height}px`,
                        background: isCurrentMonth
                          ? "linear-gradient(180deg, #3B82F6, #1D4ED8)"
                          : "#E2E8F0",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.3s ease",
                        position: "relative",
                      }}>
                        {m.errors > 0 && (
                          <div style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            height: `${Math.max((m.errors / m.total) * height, 2)}px`,
                            background: "#FCA5A5",
                            borderRadius: "0 0 6px 6px",
                          }} />
                        )}
                      </div>
                      <Text as="span" variant="bodySm" tone="subdued">{m.month}</Text>
                    </div>
                  );
                })}
              </div>
              <InlineStack gap="400">
                <InlineStack gap="200" blockAlign="center">
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: "#3B82F6" }} />
                  <Text as="span" variant="bodySm" tone="subdued">Envíos</Text>
                </InlineStack>
                <InlineStack gap="200" blockAlign="center">
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: "#FCA5A5" }} />
                  <Text as="span" variant="bodySm" tone="subdued">Errores</Text>
                </InlineStack>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Two columns: Services + Status */}
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Por servicio MRW</Text>
              {serviceBreakdown.length > 0 ? (
                <BlockStack gap="300">
                  {serviceBreakdown.map((s: any, i: number) => (
                    <BlockStack key={i} gap="100">
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodySm">{s.name}</Text>
                        <Text as="p" variant="bodySm" fontWeight="bold">{s.count} ({s.pct}%)</Text>
                      </InlineStack>
                      <ProgressBar progress={s.pct} size="small" tone={i === 0 ? "primary" : "highlight"} />
                    </BlockStack>
                  ))}
                </BlockStack>
              ) : (
                <Text as="p" variant="bodySm" tone="subdued">Sin datos aún</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Por estado</Text>
              {statusBreakdown.length > 0 ? (
                <BlockStack gap="300">
                  {statusBreakdown.map((s: any, i: number) => (
                    <InlineStack key={i} align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: statusColors[s.status] || "#6B7280" }} />
                        <Text as="p" variant="bodySm">{statusLabels[s.status] || s.status}</Text>
                      </InlineStack>
                      <Badge tone={s.status === "ENTREGADO" ? "success" : s.status === "ERROR" ? "critical" : "info"}>
                        {s.count}
                      </Badge>
                    </InlineStack>
                  ))}
                </BlockStack>
              ) : (
                <Text as="p" variant="bodySm" tone="subdued">Sin datos aún</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Top destinations */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Destinos principales</Text>
              {topDestinations.length > 0 ? (
                <InlineGrid columns={2} gap="300">
                  {topDestinations.map((d: any, i: number) => (
                    <InlineStack key={i} align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <Text as="span" variant="bodySm" tone="subdued">{i + 1}.</Text>
                        <Text as="span" variant="bodySm">{d.province}</Text>
                      </InlineStack>
                      <Text as="span" variant="bodySm" fontWeight="bold">{d.count} envíos ({d.pct}%)</Text>
                    </InlineStack>
                  ))}
                </InlineGrid>
              ) : (
                <Text as="p" variant="bodySm" tone="subdued">Datos disponibles cuando tengas envíos con provincia</Text>
              )}
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
