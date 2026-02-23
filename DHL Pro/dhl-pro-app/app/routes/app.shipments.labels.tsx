import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Button,
  Badge,
  Box,
  Banner,
  IndexTable,
  useIndexResourceState,
  Checkbox,
  Select,
  DatePicker,
  Filters,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { IconPackage, IconDocument } from "../components/EnvioIcons";
import { useState, useCallback } from "react";

/**
 * Bulk Label Printing
 * Select multiple shipments → generate combined PDF with all labels
 * Supports:
 * - Print all pending labels
 * - Print selected labels
 * - Filter by date/status
 * - Generate packing slips alongside labels
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status") || "";
  const dateFrom = url.searchParams.get("from") || "";

  const where: any = { shop };
  if (statusFilter) where.status = statusFilter;
  if (dateFrom) where.createdAt = { gte: new Date(dateFrom) };

  const shipments = await prisma.shipment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Count by status
  const statusCounts = await prisma.shipment.groupBy({
    by: ["status"],
    where: { shop },
    _count: true,
  });

  return json({
    shipments,
    statusCounts: statusCounts.reduce((acc: any, s: any) => {
      acc[s.status] = s._count;
      return acc;
    }, {}),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "printBulk") {
    const shipmentIds = formData.get("shipmentIds")?.toString().split(",") || [];

    const shipments = await prisma.shipment.findMany({
      where: { id: { in: shipmentIds }, shop },
    });

    // In production, this would:
    // 1. Call DHL API to get labels for each shipment
    // 2. Combine PDFs into a single document
    // 3. Return the combined PDF URL
    
    // For now, generate a manifest/summary
    const manifest = shipments.map((s) => ({
      tracking: s.correosTrackingNumber || "—",
      name: s.customerName,
      address: `${s.destinationAddress}, ${s.destinationCity} ${s.destinationZip}`,
      service: s.correosServiceCode,
      weight: s.weight,
      packages: s.packages,
      ref: s.reference || s.shopifyOrderName,
    }));

    return json({
      success: true,
      message: `${shipments.length} etiquetas listas para imprimir`,
      manifest,
      printCount: shipments.length,
    });
  }

  if (intent === "printPackingSlips") {
    const shipmentIds = formData.get("shipmentIds")?.toString().split(",") || [];

    const shipments = await prisma.shipment.findMany({
      where: { id: { in: shipmentIds }, shop },
    });

    // Generate packing slip data
    const slips = shipments.map((s) => ({
      orderName: s.shopifyOrderName,
      customer: s.customerName,
      address: `${s.destinationAddress}, ${s.destinationCity} ${s.destinationZip} ${s.destinationProvince}`,
      date: s.createdAt,
      reference: s.reference,
      tracking: s.correosTrackingNumber,
    }));

    return json({
      success: true,
      message: `${slips.length} albaranes generados`,
      slips,
      printCount: slips.length,
    });
  }

  return json({ success: false, message: "Acción no válida" });
};

export default function BulkLabelsPage() {
  const { shipments, statusCounts } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const resourceName = { singular: "envío", plural: "envíos" };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(shipments, { resourceIDResolver: (s: any) => s.id });

  const [statusFilter, setStatusFilter] = useState("");

  const handlePrintLabels = () => {
    if (selectedResources.length === 0) return;
    const formData = new FormData();
    formData.append("intent", "printBulk");
    formData.append("shipmentIds", selectedResources.join(","));
    submit(formData, { method: "POST" });
  };

  const handlePrintSlips = () => {
    if (selectedResources.length === 0) return;
    const formData = new FormData();
    formData.append("intent", "printPackingSlips");
    formData.append("shipmentIds", selectedResources.join(","));
    submit(formData, { method: "POST" });
  };

  const promotedBulkActions = [
    {
      content: `🏷️ Imprimir ${selectedResources.length} etiqueta${selectedResources.length > 1 ? "s" : ""}`,
      onAction: handlePrintLabels,
    },
    {
      content: `📄 Generar ${selectedResources.length} albarán${selectedResources.length > 1 ? "es" : ""}`,
      onAction: handlePrintSlips,
    },
  ];

  const statusBadge = (status: string) => {
    const tones: Record<string, "success" | "warning" | "critical" | "info" | "new"> = {
      ENTREGADO: "success",
      EN_TRANSITO: "info",
      EN_REPARTO: "info",
      PENDIENTE: "warning",
      CREADO: "new",
      INCIDENCIA: "critical",
      ERROR: "critical",
      DEVUELTO: "warning",
    };
    return <Badge tone={tones[status] || "info"}>{status.replace(/_/g, " ")}</Badge>;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const rowMarkup = shipments.map((s: any, index: number) => (
    <IndexTable.Row
      id={s.id}
      key={s.id}
      selected={selectedResources.includes(s.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd" fontWeight="bold">
          {s.correosTrackingNumber || "—"}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodySm">{s.shopifyOrderName}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodySm">{formatDate(s.createdAt)}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <BlockStack gap="050">
          <Text as="span" variant="bodySm" fontWeight="semibold">{s.customerName}</Text>
          <Text as="span" variant="bodySm" tone="subdued">
            {s.destinationCity}, {s.destinationZip}
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {statusBadge(s.status)}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodySm">{s.weight} kg · {s.packages} bto{s.packages > 1 ? "s" : ""}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Button variant="plain" size="slim" url={`/app/shipments/${s.id}`}>Ver</Button>
          {s.labelPdf && (
            <Button variant="plain" size="slim" url={s.labelPdf} external>PDF</Button>
          )}
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page
      title="Impresión masiva de etiquetas"
      subtitle="Selecciona envíos y genera todas las etiquetas en un solo PDF"
      backAction={{ content: "Envíos", onAction: () => navigate("/app/shipments") }}
      primaryAction={{
        content: `Imprimir seleccionados (${selectedResources.length})`,
        onAction: handlePrintLabels,
        disabled: selectedResources.length === 0,
      }}
      secondaryActions={[
        {
          content: "Generar albaranes",
          onAction: handlePrintSlips,
          disabled: selectedResources.length === 0,
        },
      ]}
    >
      <Layout>
        {/* Print results */}
        {actionData?.success && (
          <Layout.Section>
            <Banner tone="success" title={actionData.message}>
              {actionData.manifest && (
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" fontWeight="bold">Resumen de impresión:</Text>
                  {actionData.manifest.map((m: any, i: number) => (
                    <Text key={i} as="p" variant="bodySm">
                      {m.ref} → {m.name} · {m.address} · {m.weight}kg
                    </Text>
                  ))}
                  <Box paddingBlockStart="200">
                    <Text as="p" variant="bodySm" tone="subdued">
                      💡 Con la API Correos conectada, se generará un PDF combinado con todas las etiquetas listas para imprimir.
                    </Text>
                  </Box>
                </BlockStack>
              )}
              {actionData.slips && (
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" fontWeight="bold">Albaranes generados:</Text>
                  {actionData.slips.map((slip: any, i: number) => (
                    <Text key={i} as="p" variant="bodySm">
                      📄 {slip.orderName} — {slip.customer} · {slip.address}
                    </Text>
                  ))}
                </BlockStack>
              )}
            </Banner>
          </Layout.Section>
        )}

        {/* Stats */}
        <Layout.Section>
          <InlineStack gap="300" wrap>
            {Object.entries(statusCounts).map(([status, count]) => (
              <Box key={status} padding="300" background="bg-surface" borderRadius="200">
                <InlineStack gap="200" blockAlign="center">
                  <Text as="span" variant="headingMd">{count as number}</Text>
                  {statusBadge(status)}
                </InlineStack>
              </Box>
            ))}
          </InlineStack>
        </Layout.Section>

        {/* Shipments table */}
        <Layout.Section>
          <Card padding="0">
            <IndexTable
              resourceName={resourceName}
              itemCount={shipments.length}
              selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Tracking" },
                { title: "Pedido" },
                { title: "Fecha" },
                { title: "Destinatario" },
                { title: "Estado" },
                { title: "Peso/Bultos" },
                { title: "" },
              ]}
              promotedBulkActions={promotedBulkActions}
              selectable
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
