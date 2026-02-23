import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  IndexTable,
  Badge,
  InlineStack,
  TextField,
  Select,
  Box,
  EmptyState,
  InlineGrid,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";
  const search = url.searchParams.get("search") || "";

  const where: any = { shop: session.shop };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { shopifyOrderName: { contains: search } },
      { customerName: { contains: search } },
      { mrwTrackingNumber: { contains: search } },
    ];
  }

  const shipments = await prisma.shipment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const total = await prisma.shipment.count({ where: { shop: session.shop } });

  // Service stats
  const pendingCount = await prisma.shipment.count({ where: { shop: session.shop, status: "PENDING" } });
  const inTransitCount = await prisma.shipment.count({ where: { shop: session.shop, status: "EN_TRANSITO" } });
  const deliveredCount = await prisma.shipment.count({ where: { shop: session.shop, status: "ENTREGADO" } });
  const errorCount = await prisma.shipment.count({ where: { shop: session.shop, status: "ERROR" } });

  return json({ shipments, total, stats: { pendingCount, inTransitCount, deliveredCount, errorCount } });
};

const STATUS_MAP: Record<string, { label: string; tone: "info" | "warning" | "success" | "critical" | "attention" }> = {
  PENDING: { label: "Pendiente", tone: "info" },
  CREADO: { label: "Creado", tone: "info" },
  RECOGIDO: { label: "Recogido", tone: "info" },
  EN_TRANSITO: { label: "En tránsito", tone: "warning" },
  EN_REPARTO: { label: "En reparto", tone: "attention" },
  ENTREGADO: { label: "Entregado", tone: "success" },
  INCIDENCIA: { label: "Incidencia", tone: "critical" },
  DEVUELTO: { label: "Devuelto", tone: "critical" },
  ERROR: { label: "Error", tone: "critical" },
};

const SERVICE_NAMES: Record<string, string> = {
  "0000": "Urgente",
  "0005": "Urgente 14H",
  "0010": "Urgente 19H",
  "0100": "Urgente 12",
  "0300": "Económico",
  "0800": "eCommerce",
  "0810": "eComm Canje",
};

export default function ShipmentsPage() {
  const { shipments, total, stats } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statusOptions = [
    { label: "Todos los estados", value: "" },
    ...Object.entries(STATUS_MAP).map(([key, val]) => ({
      label: val.label,
      value: key,
    })),
  ];

  if (total === 0) {
    return (
      <Page
        title="Envíos"
        primaryAction={{ content: "➕ Crear envío manual", onAction: () => navigate("/app/shipments/new") }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Aún no tienes envíos"
                image=""
              >
                <Text as="p" variant="bodyMd">
                  Cuando se complete un pedido en tu tienda, los envíos aparecerán aquí automáticamente.
                  También puedes crear uno manualmente.
                </Text>
                <Box paddingBlockStart="400">
                  <Button variant="primary" onClick={() => navigate("/app/shipments/new")}>
                    Crear envío manual
                  </Button>
                </Box>
              </EmptyState>
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

  const rowMarkup = shipments.map((shipment: any, index: number) => {
    const statusInfo = STATUS_MAP[shipment.status] || { label: shipment.status, tone: "info" as const };
    const date = new Date(shipment.createdAt).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });

    return (
      <IndexTable.Row
        id={shipment.id}
        key={shipment.id}
        position={index}
        onClick={() => navigate(`/app/shipments/${shipment.id}`)}
      >
        <IndexTable.Cell>
          <Text as="span" variant="bodyMd" fontWeight="bold">
            {shipment.shopifyOrderName}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{shipment.customerName}</IndexTable.Cell>
        <IndexTable.Cell>
          {shipment.destinationCity}{shipment.destinationProvince ? `, ${shipment.destinationProvince}` : ""}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="info">
            {SERVICE_NAMES[shipment.mrwServiceCode] || shipment.mrwServiceCode}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" variant="bodySm" fontWeight="bold">
            {shipment.mrwTrackingNumber || "—"}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={statusInfo.tone}>● {statusInfo.label}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <Page
      title="Envíos"
      subtitle={`${total} envíos en total`}
      primaryAction={{ content: "➕ Crear envío manual", onAction: () => navigate("/app/shipments/new") }}
      secondaryActions={[
        { content: "🏷️ Imprimir etiquetas", onAction: () => navigate("/app/shipments/labels") },
      ]}
    >
      <Layout>
        {/* Mini stats bar */}
        <Layout.Section>
          <InlineGrid columns={4} gap="400">
            <Card>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Pendientes</Text>
                <Text as="p" variant="headingLg" fontWeight="bold">{stats.pendingCount}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">En tránsito</Text>
                <Text as="p" variant="headingLg" fontWeight="bold">{stats.inTransitCount}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Entregados</Text>
                <Text as="p" variant="headingLg" fontWeight="bold">{stats.deliveredCount}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Errores</Text>
                <Text as="p" variant="headingLg" fontWeight="bold" tone="critical">{stats.errorCount}</Text>
              </BlockStack>
            </Card>
          </InlineGrid>
        </Layout.Section>

        {/* Filters + Table */}
        <Layout.Section>
          <Card padding="0">
            <Box padding="400">
              <InlineStack gap="400">
                <Box minWidth="350px">
                  <TextField
                    label=""
                    labelHidden
                    placeholder="🔍 Buscar por pedido, cliente o tracking..."
                    value={search}
                    onChange={setSearch}
                    autoComplete="off"
                    clearButton
                    onClearButtonClick={() => setSearch("")}
                  />
                </Box>
                <Box minWidth="200px">
                  <Select
                    label=""
                    labelHidden
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                </Box>
              </InlineStack>
            </Box>

            <IndexTable
              itemCount={shipments.length}
              headings={[
                { title: "PEDIDO" },
                { title: "CLIENTE" },
                { title: "DESTINO" },
                { title: "SERVICIO" },
                { title: "TRACKING" },
                { title: "ESTADO" },
                { title: "FECHA" },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>

            <Box padding="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="p" variant="bodySm" tone="subdued">
                  Mostrando {shipments.length} de {total} envíos
                </Text>
                <InlineStack gap="200">
                  <Button size="micro" disabled>← Anterior</Button>
                  <Button size="micro" disabled>Siguiente →</Button>
                </InlineStack>
              </InlineStack>
            </Box>
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
