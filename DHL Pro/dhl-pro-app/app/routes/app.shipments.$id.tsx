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
  Banner,
  DescriptionList,
  Box,
  InlineStack,
  Divider,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  getTracking,
  getLabel,
  type MrwAuth,
} from "../services/correos.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { id } = params;

  const shipment = await prisma.shipment.findFirst({
    where: { id, shop: session.shop },
    include: { events: { orderBy: { eventDate: "desc" } } },
  });

  if (!shipment) {
    throw new Response("Envío no encontrado", { status: 404 });
  }

  const events = shipment.events || [];
  let mrwEvents: any[] = [];
  let labelBase64: string | null = null;

  // Fetch real tracking from MRW if we have credentials + tracking number
  const credentials = await prisma.mrwCredentials.findUnique({
    where: { shop: session.shop },
  });

  if (credentials?.verified && shipment.correosTrackingNumber) {
    const auth: MrwAuth = {
      codigoFranquicia: credentials.codigoFranquicia,
      codigoAbonado: credentials.codigoAbonado,
      codigoDepartamento: credentials.codigoDepartamento || "",
      username: credentials.username,
      password: credentials.password,
    };

    const trackingResult = await getTracking(auth, shipment.correosTrackingNumber);
    if (trackingResult.success) {
      mrwEvents = trackingResult.events;
    }

    const labelResult = await getLabel(auth, shipment.correosTrackingNumber);
    if (labelResult.success && labelResult.labelBase64) {
      labelBase64 = labelResult.labelBase64;
    }
  }

  return json({ shipment, events, mrwEvents, labelBase64 });
};

// ── Service name helper ──
const SERVICE_NAMES: Record<string, string> = {
  "0000": "MRW Urgente",
  "0005": "MRW Urgente 14H",
  "0010": "MRW Urgente 19H",
  "0100": "MRW Urgente 12",
  "0110": "MRW Urgente 14",
  "0200": "MRW Urgente 19",
  "0300": "MRW Económico",
  "0800": "MRW e-Commerce",
  "0810": "MRW eCommerce Canje",
};

export default function ShipmentDetail() {
  const { shipment, events, mrwEvents, labelBase64 } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const statusInfo = STATUS_MAP[shipment.status] || { label: shipment.status, tone: "info" as const };

  const downloadLabel = () => {
    if (!labelBase64) return;
    const byteChars = atob(labelBase64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `etiqueta-${shipment.correosTrackingNumber || shipment.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Merge timeline events
  const timelineEvents = mrwEvents.length > 0
    ? mrwEvents.map((e: any) => ({
        title: e.descripcion || e.estado,
        location: e.poblacion,
        date: `${e.fecha} ${e.hora}`,
        isFirst: false,
      }))
    : events.map((e: any) => ({
        title: e.description || STATUS_MAP[e.status]?.label || e.status,
        location: e.location,
        date: new Date(e.eventDate).toLocaleString("es-ES"),
        isFirst: false,
      }));

  // Mark the first event as active
  if (timelineEvents.length > 0) timelineEvents[0].isFirst = true;

  return (
    <Page
      title={`Envío ${shipment.shopifyOrderName || shipment.id}`}
      backAction={{ url: "/app/shipments" }}
      titleMetadata={<Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>}
      secondaryActions={[
        { content: "↩️ Crear devolución", onAction: () => navigate("/app/returns/new") },
      ]}
    >
      <Layout>
        {/* ── LEFT COLUMN: Info ── */}
        <Layout.Section>
          {/* Tracking banner */}
          {shipment.correosTrackingNumber && (
            <Box paddingBlockEnd="400">
              <Card background="bg-surface-info">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">TRACKING DHL</Text>
                    <Text as="h2" variant="headingXl" fontWeight="bold">
                      {shipment.correosTrackingNumber}
                    </Text>
                  </BlockStack>
                  <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
                </InlineStack>
              </Card>
            </Box>
          )}

          {/* Recipient */}
          <Box paddingBlockEnd="400">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">📍 Destinatario</Text>
                <DescriptionList
                  items={[
                    { term: "Nombre", description: shipment.customerName },
                    { term: "Teléfono", description: shipment.customerPhone || "—" },
                    { term: "Dirección", description: shipment.destinationAddress },
                    { term: "Ciudad", description: `${shipment.destinationCity}, ${shipment.destinationZip}` },
                    { term: "Provincia", description: shipment.destinationProvince || "—" },
                  ]}
                />
              </BlockStack>
            </Card>
          </Box>

          {/* Shipment details */}
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">📦 Detalles del envío</Text>
              <InlineGrid columns={3} gap="400">
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued">SERVICIO</Text>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    {SERVICE_NAMES[shipment.correosServiceCode] || shipment.correosServiceCode}
                  </Text>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued">PESO</Text>
                  <Text as="p" variant="bodyMd" fontWeight="bold">{shipment.weight} kg</Text>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued">BULTOS</Text>
                  <Text as="p" variant="bodyMd" fontWeight="bold">{shipment.packages}</Text>
                </BlockStack>
              </InlineGrid>

              {(shipment.reference || shipment.observations) && (
                <>
                  <Divider />
                  {shipment.reference && (
                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm" tone="subdued">REFERENCIA</Text>
                      <Text as="p" variant="bodyMd">{shipment.reference}</Text>
                    </BlockStack>
                  )}
                  {shipment.observations && (
                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm" tone="subdued">OBSERVACIONES</Text>
                      <Text as="p" variant="bodyMd">{shipment.observations}</Text>
                    </BlockStack>
                  )}
                </>
              )}

              <Divider />
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">FECHA DE CREACIÓN</Text>
                <Text as="p" variant="bodyMd">
                  {new Date(shipment.createdAt).toLocaleString("es-ES")}
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>

          {/* Error banner */}
          {shipment.error && (
            <Box paddingBlockStart="400">
              <Banner tone="critical" title="⚠ Error en el envío">
                <Text as="p" variant="bodyMd">{shipment.error}</Text>
              </Banner>
            </Box>
          )}
        </Layout.Section>

        {/* ── RIGHT COLUMN: Label + Timeline ── */}
        <Layout.Section variant="oneThird">
          {/* Label preview/download */}
          <Card>
            <BlockStack gap="400" inlineAlign="center">
              <Text as="h2" variant="headingMd">🏷️ Etiqueta DHL</Text>

              {labelBase64 ? (
                <>
                  {/* Label preview placeholder */}
                  <Box
                    padding="600"
                    borderRadius="200"
                    background="bg-surface-secondary"
                    minHeight="200px"
                  >
                    <BlockStack gap="200" inlineAlign="center">
                      <Text as="p" variant="headingLg" alignment="center">📄</Text>
                      <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                        Etiqueta disponible
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                        10 × 15 cm
                      </Text>
                    </BlockStack>
                  </Box>
                  <Button variant="primary" onClick={downloadLabel} fullWidth size="large">
                    📥 Descargar etiqueta PDF
                  </Button>
                </>
              ) : (
                <Box padding="400">
                  <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                    La etiqueta estará disponible cuando DHL Procese el envío.
                  </Text>
                </Box>
              )}
            </BlockStack>
          </Card>

          {/* Timeline */}
          <Box paddingBlockStart="400">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">📋 Seguimiento</Text>

                {timelineEvents.length > 0 ? (
                  <BlockStack gap="0">
                    {timelineEvents.map((event: any, i: number) => (
                      <Box key={i} paddingBlockStart="200" paddingBlockEnd="200">
                        <InlineStack gap="300" blockAlign="start">
                          {/* Timeline dot + line */}
                          <Box minWidth="24px">
                            <BlockStack inlineAlign="center">
                              <Text
                                as="span"
                                variant="bodySm"
                                tone={event.isFirst ? "success" : "subdued"}
                              >
                                {event.isFirst ? "✅" : "○"}
                              </Text>
                              {i < timelineEvents.length - 1 && (
                                <Text as="span" variant="bodySm" tone="subdued">│</Text>
                              )}
                            </BlockStack>
                          </Box>
                          {/* Event content */}
                          <BlockStack gap="100">
                            <Text
                              as="p"
                              variant="bodySm"
                              fontWeight={event.isFirst ? "bold" : "regular"}
                            >
                              {event.title}
                            </Text>
                            {event.location && (
                              <Text as="p" variant="bodySm" tone="subdued">
                                📍 {event.location}
                              </Text>
                            )}
                            <Text as="p" variant="bodySm" tone="subdued">
                              {event.date}
                            </Text>
                          </BlockStack>
                        </InlineStack>
                      </Box>
                    ))}
                  </BlockStack>
                ) : (
                  <Box padding="400">
                    <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                      Sin eventos todavía. Se actualizará cuando DHL Procese el envío.
                    </Text>
                  </Box>
                )}
              </BlockStack>
            </Card>
          </Box>

          {/* Quick actions */}
          <Box paddingBlockStart="400">
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingSm">Acciones</Text>
                <Button fullWidth onClick={() => navigate("/app/returns/new")}>
                  ↩️ Crear devolución
                </Button>
                <Button fullWidth tone="critical">
                  ❌ Cancelar envío
                </Button>
              </BlockStack>
            </Card>
          </Box>
        </Layout.Section>

        {/* Brand footer */}
        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
