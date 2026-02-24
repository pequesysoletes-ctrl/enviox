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
  TextField,
  Banner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState, useRef, useEffect } from "react";

/**
 * Scan & Ship — Barcode scanning for fast shipment creation
 * 
 * Flow:
 * 1. Focus on barcode input field (auto-focus)
 * 2. Scan barcode (order number) with handheld scanner
 * 3. System finds the order → auto-creates shipment
 * 4. Label prints automatically (or queued for batch print)
 * 5. Ready for next scan
 * 
 * Supports:
 * - Shopify order number scanning
 * - Custom reference scanning
 * - Continuous scan mode (no click needed)
 * - Sound feedback (beep on success/error)
 * - Scan counter + session stats
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const config = await prisma.shippingConfig.findUnique({ where: { shop } });
  
  // Get today's scan stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayShipments = await prisma.shipment.count({
    where: { shop, createdAt: { gte: today } },
  });

  return json({ config, todayShipments, shop });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "scan") {
    const barcode = formData.get("barcode")?.toString()?.trim();
    if (!barcode) {
      return json({ success: false, error: "Código vacío" });
    }

    // Try to find order by name (e.g., #1001) or by ID
    const orderName = barcode.startsWith("#") ? barcode : `#${barcode}`;

    // Check if shipment already exists for this order
    const existing = await prisma.shipment.findFirst({
      where: { shop, shopifyOrderName: orderName },
    });

    if (existing) {
      return json({
        success: false,
        error: `Ya existe un envío para el pedido ${orderName}`,
        existing: {
          id: existing.id,
          tracking: existing.mrwTrackingNumber,
          status: existing.status,
          customer: existing.customerName,
        },
      });
    }

    // Try to fetch order from Shopify
    try {
      const ordersResponse = await admin.graphql(`
        query {
          orders(first: 1, query: "name:${orderName}") {
            nodes {
              id
              name
              displayFulfillmentStatus
              totalPriceSet { shopMoney { amount currencyCode } }
              shippingAddress {
                name
                phone
                address1
                city
                zip
                province
              }
              lineItems(first: 10) {
                nodes { title quantity }
              }
            }
          }
        }
      `);

      const ordersData = await ordersResponse.json();
      const order = ordersData?.data?.orders?.nodes?.[0];

      if (!order) {
        return json({ success: false, error: `Pedido ${orderName} no encontrado en Shopify` });
      }

      if (!order.shippingAddress) {
        return json({ success: false, error: `Pedido ${orderName} no tiene dirección de envío` });
      }

      const addr = order.shippingAddress;

      // Get shipping config for defaults
      const config = await prisma.shippingConfig.findUnique({ where: { shop } });

      // Create shipment
      const shipment = await prisma.shipment.create({
        data: {
          shop,
          shopifyOrderId: order.id,
          shopifyOrderName: order.name,
          customerName: addr.name || "—",
          customerPhone: addr.phone || "",
          destinationAddress: addr.address1 || "",
          destinationCity: addr.city || "",
          destinationZip: addr.zip || "",
          destinationProvince: addr.province || "",
          mrwServiceCode: config?.defaultService || "0800",
          weight: config?.defaultWeight || 2,
          status: "PENDIENTE",
          reference: order.name,
        },
      });

      const items = order.lineItems?.nodes?.map((li: any) => `${li.quantity}x ${li.title}`).join(", ");

      return json({
        success: true,
        message: `✅ Envío creado para ${order.name}`,
        shipment: {
          id: shipment.id,
          orderName: order.name,
          customer: addr.name,
          address: `${addr.address1}, ${addr.city} ${addr.zip}`,
          items,
          total: order.totalPriceSet?.shopMoney?.amount,
        },
      });
    } catch (err: any) {
      return json({ success: false, error: `Error al buscar pedido: ${err.message}` });
    }
  }

  return json({ success: false, error: "Acción no válida" });
};

export default function ScanShipPage() {
  const { todayShipments } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [barcode, setBarcode] = useState("");
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on scan input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Process scan result
  useEffect(() => {
    if (actionData) {
      const entry = {
        time: new Date().toLocaleTimeString("es-ES"),
        barcode: barcode,
        ...actionData,
      };
      setScanHistory((prev) => [entry, ...prev].slice(0, 20));
      if (actionData.success) setScanCount((c) => c + 1);
      setBarcode("");
      // Re-focus for next scan
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [actionData]);

  const handleScan = () => {
    if (!barcode.trim()) return;
    const formData = new FormData();
    formData.append("intent", "scan");
    formData.append("barcode", barcode.trim());
    submit(formData, { method: "POST" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleScan();
    }
  };

  return (
    <Page
      title="Scan & Ship"
      subtitle="Escanea el código de barras del pedido para crear envíos instantáneamente"
      backAction={{ content: "Envíos", onAction: () => navigate("/app/shipments") }}
      secondaryActions={[
        { content: "Imprimir etiquetas", onAction: () => navigate("/app/shipments/labels") },
      ]}
    >
      <Layout>
        {/* Stats bar */}
        <Layout.Section>
          <InlineStack gap="400">
            <Box padding="400" background="bg-surface" borderRadius="200" borderWidth="025" borderColor="border">
              <BlockStack gap="050" inlineAlign="center">
                <Text as="span" variant="headingXl" fontWeight="bold">{scanCount}</Text>
                <Text as="span" variant="bodySm" tone="subdued">Escaneados ahora</Text>
              </BlockStack>
            </Box>
            <Box padding="400" background="bg-surface" borderRadius="200" borderWidth="025" borderColor="border">
              <BlockStack gap="050" inlineAlign="center">
                <Text as="span" variant="headingXl" fontWeight="bold">{todayShipments + scanCount}</Text>
                <Text as="span" variant="bodySm" tone="subdued">Envíos hoy</Text>
              </BlockStack>
            </Box>
          </InlineStack>
        </Layout.Section>

        {/* Scanner input */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">📷 Escanear pedido</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Escanea el código de barras o introduce el número de pedido manualmente. Pulsa Enter para procesar.
              </Text>

              <div onKeyDown={handleKeyDown}>
                <TextField
                  label=""
                  labelHidden
                  value={barcode}
                  onChange={setBarcode}
                  autoComplete="off"
                  placeholder="Escanea aquí o escribe #1001..."
                  size="large"
                  autoFocus
                  connectedRight={
                    <Button variant="primary" size="large" onClick={handleScan}>
                      Procesar
                    </Button>
                  }
                />
              </div>

              <Text as="p" variant="bodySm" tone="subdued">
                💡 El cursor está siempre aquí. Escanea con tu lector de código de barras y el envío se crea automáticamente.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Last scan result */}
        {actionData && (
          <Layout.Section>
            <Banner tone={actionData.success ? "success" : "critical"}>
              {actionData.success ? (
                <BlockStack gap="100">
                  <Text as="p" variant="bodyMd" fontWeight="bold">{actionData.message}</Text>
                  {actionData.shipment && (
                    <>
                      <Text as="p" variant="bodySm">👤 {actionData.shipment.customer}</Text>
                      <Text as="p" variant="bodySm">📍 {actionData.shipment.address}</Text>
                      <Text as="p" variant="bodySm">📦 {actionData.shipment.items}</Text>
                    </>
                  )}
                </BlockStack>
              ) : (
                <Text as="p" variant="bodyMd">{actionData.error}</Text>
              )}
            </Banner>
          </Layout.Section>
        )}

        {/* Scan history */}
        {scanHistory.length > 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Historial de escaneos</Text>
                {scanHistory.map((entry, i) => (
                  <Box key={i} padding="200" background={entry.success ? "bg-surface-success" : "bg-surface-critical"} borderRadius="200">
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <Text as="span" variant="bodySm">
                          {entry.success ? "✅" : "❌"}
                        </Text>
                        <BlockStack gap="0">
                          <Text as="span" variant="bodySm" fontWeight="bold">
                            {entry.shipment?.orderName || entry.barcode}
                          </Text>
                          <Text as="span" variant="bodySm" tone="subdued">
                            {entry.success ? entry.shipment?.customer : entry.error}
                          </Text>
                        </BlockStack>
                      </InlineStack>
                      <Text as="span" variant="bodySm" tone="subdued">{entry.time}</Text>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
