import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
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
  IndexTable,
  useIndexResourceState,
  Divider,
  Banner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";

/**
 * Pick Lists — Consolidated product lists for warehouse picking
 * 
 * Groups products across multiple pending shipments so warehouse staff
 * can pick all items in one pass instead of going order-by-order.
 * 
 * Output:
 * - Product name + SKU
 * - Total quantity needed (across all orders)
 * - Which orders need this product
 * - Printable pick list
 */

interface PickItem {
  product: string;
  totalQty: number;
  orders: string[];
  locations: string[];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  // Get all pending shipments (not yet shipped)
  const pendingShipments = await prisma.shipment.findMany({
    where: {
      shop,
      status: { in: ["PENDIENTE", "PENDING", "CREADO"] },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // For each shipment, try to get order line items from Shopify
  const pickMap = new Map<string, PickItem>();
  const shipmentList: any[] = [];

  for (const shipment of pendingShipments) {
    try {
      const orderResponse = await admin.graphql(`
        query {
          order(id: "${shipment.shopifyOrderId}") {
            name
            lineItems(first: 20) {
              nodes {
                title
                sku
                quantity
                variant { displayName }
              }
            }
          }
        }
      `);

      const orderData = await orderResponse.json();
      const order = orderData?.data?.order;

      if (order) {
        const items: string[] = [];
        for (const li of order.lineItems?.nodes || []) {
          const key = li.sku || li.title;
          const existing = pickMap.get(key);

          if (existing) {
            existing.totalQty += li.quantity;
            if (!existing.orders.includes(order.name)) {
              existing.orders.push(order.name);
            }
          } else {
            pickMap.set(key, {
              product: li.title + (li.variant?.displayName ? ` — ${li.variant.displayName}` : ""),
              totalQty: li.quantity,
              orders: [order.name],
              locations: [],
            });
          }
          items.push(`${li.quantity}x ${li.title}`);
        }

        shipmentList.push({
          id: shipment.id,
          orderName: order.name,
          customer: shipment.customerName,
          city: shipment.destinationCity,
          items: items.join(", "),
          status: shipment.status,
        });
      }
    } catch (err) {
      // Skip orders that can't be fetched
      shipmentList.push({
        id: shipment.id,
        orderName: shipment.shopifyOrderName,
        customer: shipment.customerName,
        city: shipment.destinationCity,
        items: "(datos no disponibles)",
        status: shipment.status,
      });
    }
  }

  // Convert map to sorted array
  const pickItems = Array.from(pickMap.values()).sort((a, b) => b.totalQty - a.totalQty);
  const totalProducts = pickItems.reduce((sum, item) => sum + item.totalQty, 0);

  return json({
    pickItems,
    shipmentList,
    totalProducts,
    totalOrders: pendingShipments.length,
  });
};

export default function PickListPage() {
  const { pickItems, shipmentList, totalProducts, totalOrders } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Page
      title="Lista de preparación"
      subtitle={`${totalOrders} pedidos pendientes · ${totalProducts} productos a preparar`}
      backAction={{ content: "Envíos", onAction: () => navigate("/app/shipments") }}
      primaryAction={{
        content: "🖨️ Imprimir pick list",
        onAction: handlePrint,
      }}
    >
      <Layout>
        {totalOrders === 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="300" inlineAlign="center">
                <div style={{ fontSize: 48, textAlign: "center" }}>📋</div>
                <Text as="p" variant="bodyLg" alignment="center">
                  No hay pedidos pendientes de preparar
                </Text>
                <Text as="p" variant="bodySm" alignment="center" tone="subdued">
                  Cuando tengas envíos en estado "Pendiente" o "Creado", aparecerán aquí agrupados por producto.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        {/* Consolidated pick list */}
        {pickItems.length > 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">📦 Productos a preparar</Text>
                  <Badge tone="info">{totalProducts} unidades</Badge>
                </InlineStack>

                <Box padding="0">
                  {/* Header */}
                  <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodySm" fontWeight="bold" >PRODUCTO</Text>
                      <InlineStack gap="400">
                        <Box minWidth="60px">
                          <Text as="span" variant="bodySm" fontWeight="bold">CANTIDAD</Text>
                        </Box>
                        <Box minWidth="120px">
                          <Text as="span" variant="bodySm" fontWeight="bold">PEDIDOS</Text>
                        </Box>
                      </InlineStack>
                    </InlineStack>
                  </Box>

                  {/* Items */}
                  {pickItems.map((item, i) => (
                    <Box key={i} padding="300" borderBlockEndWidth="025" borderColor="border">
                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="050">
                          <Text as="span" variant="bodyMd" fontWeight="semibold">
                            {item.product}
                          </Text>
                        </BlockStack>
                        <InlineStack gap="400" blockAlign="center">
                          <Box minWidth="60px">
                            <Badge tone={item.totalQty > 5 ? "warning" : "info"}>
                              {item.totalQty}x
                            </Badge>
                          </Box>
                          <Box minWidth="120px">
                            <Text as="span" variant="bodySm" tone="subdued">
                              {item.orders.join(", ")}
                            </Text>
                          </Box>
                        </InlineStack>
                      </InlineStack>
                    </Box>
                  ))}
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        {/* Orders breakdown */}
        {shipmentList.length > 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">🛒 Desglose por pedido</Text>
                
                {shipmentList.map((s, i) => (
                  <Box key={i} padding="300" background="bg-surface-secondary" borderRadius="200">
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="050">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="span" variant="bodyMd" fontWeight="bold">{s.orderName}</Text>
                          <Badge tone="info">{s.status}</Badge>
                        </InlineStack>
                        <Text as="span" variant="bodySm">👤 {s.customer} · 📍 {s.city}</Text>
                        <Text as="span" variant="bodySm" tone="subdued">📦 {s.items}</Text>
                      </BlockStack>
                      <Button variant="plain" size="slim" url={`/app/shipments/${s.id}`}>
                        Ver
                      </Button>
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
