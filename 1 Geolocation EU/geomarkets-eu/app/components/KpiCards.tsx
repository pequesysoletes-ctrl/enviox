// ═══════════════════════════════════════════════════════════════
// KpiCards — Dashboard KPI cards with sparkline-style metrics
// ═══════════════════════════════════════════════════════════════

import {
  BlockStack,
  Box,
  Card,
  InlineGrid,
  InlineStack,
  Text,
  Icon,
} from "@shopify/polaris";
import {
  OrderIcon,
  PersonIcon,
  GlobeIcon,
  ChartVerticalIcon,
} from "@shopify/polaris-icons";

interface KpiData {
  totalRedirects: number;
  totalVisitors: number;
  activeMarkets: number;
  acceptanceRate: number;
}

interface KpiCardsProps {
  data: KpiData;
  marketFlags?: string[]; // ["🇪🇸","🇫🇷","🇩🇪",...]
}

export function KpiCards({ data, marketFlags = [] }: KpiCardsProps) {
  const kpis = [
    {
      title: "Redirecciones hoy",
      value: formatNumber(data.totalRedirects),
      icon: OrderIcon,
      trend: null,
    },
    {
      title: "Visitantes geolocalizados",
      value: formatNumber(data.totalVisitors),
      icon: PersonIcon,
      trend: "+12%",
    },
    {
      title: "Mercados activos",
      value: String(data.activeMarkets),
      icon: GlobeIcon,
      subtitle: marketFlags.length > 0 ? marketFlags.join(" ") : undefined,
    },
    {
      title: "Tasa de aceptación",
      value: `${data.acceptanceRate}%`,
      icon: ChartVerticalIcon,
      subtitle: "del banner",
    },
  ];

  return (
    <InlineGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap="400">
      {kpis.map((kpi) => (
        <Card key={kpi.title} padding="400">
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" as="p" tone="subdued">
                {kpi.title}
              </Text>
              <Icon source={kpi.icon} tone="base" />
            </InlineStack>
            <InlineStack gap="200" blockAlign="end">
              <Text variant="headingXl" as="p" fontWeight="bold">
                {kpi.value}
              </Text>
              {kpi.trend && (
                <Text variant="bodySm" as="span" tone="success">
                  {kpi.trend}
                </Text>
              )}
            </InlineStack>
            {kpi.subtitle && (
              <Text variant="bodySm" as="p" tone="subdued">
                {kpi.subtitle}
              </Text>
            )}
          </BlockStack>
        </Card>
      ))}
    </InlineGrid>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000) {
    return new Intl.NumberFormat("es-ES").format(n);
  }
  return String(n);
}
