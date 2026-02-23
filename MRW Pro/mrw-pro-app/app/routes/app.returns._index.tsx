import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Badge,
  IndexTable,
  EmptyState,
  Box,
  Filters,
  TextField,
  Select,
  InlineStack,
  Button,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

const STATUS_MAP: Record<string, { label: string; tone: "info" | "warning" | "success" | "critical" }> = {
  PENDING: { label: "Solicitada", tone: "info" },
  IN_TRANSIT: { label: "En tránsito", tone: "warning" },
  RECEIVED: { label: "Recibida", tone: "success" },
  INCIDENT: { label: "Incidencia", tone: "critical" },
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const where: any = { shop: session.shop };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { shopifyOrderName: { contains: search } },
      { customerName: { contains: search } },
      { mrwTrackingNumber: { contains: search } },
    ];
  }

  const returns = await prisma.returnShipment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const total = await prisma.returnShipment.count({ where: { shop: session.shop } });

  return json({ returns, total });
};

export default function ReturnsList() {
  const { returns, total } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("search", value);
    else url.searchParams.delete("search");
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  }, [navigate]);

  const handleStatusFilter = useCallback((value: string) => {
    setStatusFilter(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("status", value);
    else url.searchParams.delete("status");
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  }, [navigate]);

  if (returns.length === 0 && !search && !statusFilter) {
    return (
      <Page
        title="Devoluciones"
        subtitle="Gestiona las solicitudes de retorno de tus clientes."
        primaryAction={{
          content: "Crear devolución",
          onAction: () => navigate("/app/returns/new"),
        }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <EmptyState
                heading="Sin devoluciones"
                image=""
              >
                <Text as="p" variant="bodyMd">
                  Cuando generes una devolución, aparecerá aquí con su etiqueta y tracking.
                </Text>
                <Box paddingBlockStart="400">
                  <Button variant="primary" onClick={() => navigate("/app/returns/new")}>
                    Crear devolución
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

  return (
    <Page
      title="Devoluciones"
      subtitle="Gestiona las solicitudes de retorno de tus clientes."
      primaryAction={{
        content: "Crear devolución",
        onAction: () => navigate("/app/returns/new"),
      }}
    >
      <Layout>
        {/* Filters */}
        <Layout.Section>
          <Card padding="400">
            <InlineStack gap="400" align="start" blockAlign="end">
              <Box minWidth="300px">
                <TextField
                  label=""
                  labelHidden
                  value={search}
                  onChange={handleSearch}
                  placeholder="Buscar pedido o cliente..."
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => handleSearch("")}
                />
              </Box>
              <Box minWidth="200px">
                <Select
                  label=""
                  labelHidden
                  options={[
                    { label: "Todos los estados", value: "" },
                    { label: "Solicitada", value: "PENDING" },
                    { label: "En tránsito", value: "IN_TRANSIT" },
                    { label: "Recibida", value: "RECEIVED" },
                    { label: "Incidencia", value: "INCIDENT" },
                  ]}
                  value={statusFilter}
                  onChange={handleStatusFilter}
                />
              </Box>
            </InlineStack>
          </Card>
        </Layout.Section>

        {/* Table */}
        <Layout.Section>
          <Card padding="0">
            <IndexTable
              itemCount={returns.length}
              headings={[
                { title: "PEDIDO" },
                { title: "CLIENTE" },
                { title: "MOTIVO" },
                { title: "ESTADO" },
                { title: "FECHA" },
                { title: "ETIQUETA" },
                { title: "ACCIONES" },
              ]}
              selectable={false}
            >
              {returns.map((ret: any, index: number) => {
                const statusInfo = STATUS_MAP[ret.status] || { label: ret.status, tone: "info" as const };
                return (
                  <IndexTable.Row id={ret.id} key={ret.id} position={index}>
                    <IndexTable.Cell>
                      <Text as="span" variant="bodyMd" fontWeight="bold" tone="info">
                        {ret.shopifyOrderName || "—"}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>{ret.customerName}</IndexTable.Cell>
                    <IndexTable.Cell>
                      <Text as="span" variant="bodySm">
                        {ret.reason ? (ret.reason.length > 25 ? ret.reason.substring(0, 25) + "..." : ret.reason) : "—"}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      {new Date(ret.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      {ret.mrwTrackingNumber ? (
                        <Button variant="plain" size="micro">
                          📥 Descargar
                        </Button>
                      ) : (
                        <Text as="span" variant="bodySm" tone="subdued">—</Text>
                      )}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Button variant="plain" size="micro">👁</Button>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                );
              })}
            </IndexTable>
          </Card>
          <Box paddingBlockStart="300">
            <Text as="p" variant="bodySm" tone="subdued">
              Mostrando 1 a {returns.length} de {total} resultados
            </Text>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
