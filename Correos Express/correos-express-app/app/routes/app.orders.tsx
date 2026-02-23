import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Badge,
  Button,
  Box,
  Banner,
  IndexTable,
  useIndexResourceState,
  Thumbnail,
  Filters,
  ChoiceList,
  EmptyState,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { IconPackage, IconTruck } from "../components/EnvioIcons";
import { useState, useCallback } from "react";

/**
 * Fetches unfulfilled orders from Shopify that don't have Correos Express shipments yet
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  // Fetch unfulfilled orders from Shopify
  const response = await admin.graphql(`
    query GetUnfulfilledOrders {
      orders(first: 50, query: "fulfillment_status:unfulfilled OR fulfillment_status:partial", sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              firstName
              lastName
              email
              phone
            }
            shippingAddress {
              name
              address1
              address2
              city
              zip
              province
              country
              phone
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  image {
                    url
                    altText
                  }
                }
              }
            }
            totalWeight
          }
        }
      }
    }
  `);

  const data = await response.json();
  const orders = data?.data?.orders?.edges?.map((edge: any) => edge.node) || [];

  // Check which orders already have Correos Express shipments
  const existingShipments = await prisma.shipment.findMany({
    where: {
      shop,
      shopifyOrderId: { in: orders.map((o: any) => o.id.replace("gid://shopify/Order/", "")) },
    },
    select: { shopifyOrderId: true, status: true, correosTrackingNumber: true },
  });

  const existingMap = new Map(
    existingShipments.map((s) => [s.shopifyOrderId, s])
  );

  // Get shipping config for defaults
  const config = await prisma.shippingConfig.findUnique({ where: { shop } });

  const enrichedOrders = orders.map((order: any) => {
    const orderId = order.id.replace("gid://shopify/Order/", "");
    const existing = existingMap.get(orderId);
    return {
      ...order,
      orderId,
      hasShipment: !!existing,
      shipmentStatus: existing?.status || null,
      trackingNumber: existing?.correosTrackingNumber || null,
      hasShippingAddress: !!order.shippingAddress,
    };
  });

  return json({
    orders: enrichedOrders,
    defaultService: config?.defaultService || "0800",
    defaultWeight: config?.defaultWeight || 2,
    totalPending: enrichedOrders.filter((o: any) => !o.hasShipment && o.hasShippingAddress).length,
  });
};

/**
 * Creates Correos Express shipments for selected orders
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const orderIds = formData.get("orderIds")?.toString().split(",") || [];
  const serviceCode = formData.get("serviceCode")?.toString() || "0800";

  if (orderIds.length === 0) {
    return json({ error: "No se seleccionaron pedidos", results: null });
  }

  // Get credentials
  const credentials = await prisma.mrwCredentials.findUnique({ where: { shop } });
  if (!credentials?.verified) {
    return json({ error: "Credenciales Correos Express no verificadas. Ve a Configuración primero.", results: null });
  }

  const config = await prisma.shippingConfig.findUnique({ where: { shop } });

  const results = {
    total: orderIds.length,
    created: 0,
    errors: [] as string[],
    shipments: [] as { orderId: string; orderName: string; trackingNumber: string }[],
  };

  for (const orderId of orderIds) {
    try {
      // Fetch full order data
      const orderResponse = await admin.graphql(`
        query GetOrder($id: ID!) {
          order(id: $id) {
            id
            name
            customer { firstName lastName email phone }
            shippingAddress {
              name address1 address2 city zip province phone
            }
            note
            totalWeight
          }
        }
      `, { variables: { id: `gid://shopify/Order/${orderId}` } });

      const orderData = await orderResponse.json();
      const order = orderData?.data?.order;

      if (!order) {
        results.errors.push(`Pedido ${orderId}: no encontrado`);
        continue;
      }

      if (!order.shippingAddress) {
        results.errors.push(`Pedido ${order.name}: sin dirección de envío`);
        continue;
      }

      // Check if already exists
      const existing = await prisma.shipment.findFirst({
        where: { shop, shopifyOrderId: orderId },
      });

      if (existing) {
        results.errors.push(`Pedido ${order.name}: ya tiene envío (${existing.correosTrackingNumber || existing.status})`);
        continue;
      }

      const shipping = order.shippingAddress;
      const customerName = shipping.name ||
        `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() ||
        "Cliente";

      // Create shipment in DB (Correos Express API call happens here when real API is connected)
      // For now, we create in PENDIENTE status — the Correos Express API service will process it
      const shipment = await prisma.shipment.create({
        data: {
          shop,
          shopifyOrderId: orderId,
          shopifyOrderName: order.name,
          customerName,
          customerPhone: shipping.phone || order.customer?.phone || "",
          destinationAddress: `${shipping.address1 || ""}${shipping.address2 ? ", " + shipping.address2 : ""}`,
          destinationCity: shipping.city || "",
          destinationZip: shipping.zip || "",
          destinationProvince: shipping.province || "",
          correosServiceCode: serviceCode,
          weight: config?.defaultWeight || (order.totalWeight ? order.totalWeight / 1000 : 2),
          packages: 1,
          reference: order.name,
          observations: order.note || "",
          status: "PENDIENTE",
        },
      });

      // Create event log
      await prisma.shipmentEvent.create({
        data: {
          shipmentId: shipment.id,
          status: "PENDIENTE",
          description: `Envío creado desde pedido Shopify ${order.name}`,
          eventDate: new Date(),
        },
      });

      results.created++;
      results.shipments.push({
        orderId,
        orderName: order.name,
        trackingNumber: shipment.correosTrackingNumber || "pendiente",
      });

    } catch (err: any) {
      results.errors.push(`Pedido ${orderId}: ${err.message}`);
    }
  }

  return json({ error: null, results });
};

export default function OrdersToShipPage() {
  const { orders, totalPending, defaultService } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const pendingOrders = orders.filter((o: any) => !o.hasShipment && o.hasShippingAddress);
  const resourceName = { singular: "pedido", plural: "pedidos" };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(pendingOrders, { resourceIDResolver: (order: any) => order.orderId });

  const handleBulkShip = () => {
    if (selectedResources.length === 0) return;
    const formData = new FormData();
    formData.append("orderIds", selectedResources.join(","));
    formData.append("serviceCode", defaultService);
    submit(formData, { method: "POST" });
  };

  const promotedBulkActions = [
    {
      content: `Crear ${selectedResources.length} envío${selectedResources.length > 1 ? "s" : ""} MRW`,
      onAction: handleBulkShip,
      loading: isSubmitting,
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const rowMarkup = pendingOrders.map((order: any, index: number) => {
    const firstItem = order.lineItems?.edges?.[0]?.node;
    const itemCount = order.lineItems?.edges?.length || 0;
    const totalItems = order.lineItems?.edges?.reduce((sum: number, e: any) => sum + e.node.quantity, 0) || 0;

    return (
      <IndexTable.Row
        id={order.orderId}
        key={order.orderId}
        selected={selectedResources.includes(order.orderId)}
        position={index}
      >
        <IndexTable.Cell>
          <Text as="span" variant="bodyMd" fontWeight="bold">{order.name}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" variant="bodySm">{formatDate(order.createdAt)}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <BlockStack gap="100">
            <Text as="span" variant="bodySm" fontWeight="semibold">
              {order.shippingAddress?.name || order.customer?.firstName || "—"}
            </Text>
            <Text as="span" variant="bodySm" tone="subdued">
              {order.shippingAddress?.city}, {order.shippingAddress?.zip}
            </Text>
          </BlockStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" variant="bodySm">
            {firstItem?.title || "—"}{itemCount > 1 ? ` +${itemCount - 1} más` : ""}
          </Text>
          <Text as="span" variant="bodySm" tone="subdued"> ({totalItems} uds.)</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" variant="bodyMd" fontWeight="bold">
            {order.totalPriceSet?.shopMoney?.amount} {order.totalPriceSet?.shopMoney?.currencyCode}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={order.displayFinancialStatus === "PAID" ? "success" : "warning"}>
            {order.displayFinancialStatus === "PAID" ? "Pagado" : order.displayFinancialStatus}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button
            variant="primary"
            size="slim"
            onClick={() => {
              const formData = new FormData();
              formData.append("orderIds", order.orderId);
              formData.append("serviceCode", defaultService);
              submit(formData, { method: "POST" });
            }}
            loading={isSubmitting}
          >
            Enviar →
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  // Orders already shipped
  const shippedOrders = orders.filter((o: any) => o.hasShipment);

  return (
    <Page
      title="Pedidos pendientes de envío"
      subtitle={`${totalPending} pedidos listos para enviar con MRW`}
      primaryAction={{
        content: `Enviar seleccionados (${selectedResources.length})`,
        onAction: handleBulkShip,
        disabled: selectedResources.length === 0 || isSubmitting,
        loading: isSubmitting,
      }}
    >
      <Layout>
        {/* Results banner */}
        {actionData?.results && (
          <Layout.Section>
            <Banner
              tone={actionData.results.errors.length === 0 ? "success" : "warning"}
              title={`${actionData.results.created} de ${actionData.results.total} envíos creados`}
            >
              {actionData.results.shipments.map((s: any) => (
                <p key={s.orderId}>✅ {s.orderName} → Tracking: {s.trackingNumber}</p>
              ))}
              {actionData.results.errors.map((e: string, i: number) => (
                <p key={i}>❌ {e}</p>
              ))}
            </Banner>
          </Layout.Section>
        )}

        {actionData?.error && (
          <Layout.Section>
            <Banner tone="critical" title="Error">
              <p>{actionData.error}</p>
            </Banner>
          </Layout.Section>
        )}

        {/* Quick Stats */}
        <Layout.Section>
          <InlineStack gap="400" wrap={false}>
            <Box padding="400" background="bg-surface" borderRadius="200" minWidth="180px">
              <InlineStack gap="300" blockAlign="center">
                <IconPackage size={28} color="#F59E0B" />
                <BlockStack gap="050">
                  <Text as="p" variant="headingLg">{totalPending}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">Pendientes de envío</Text>
                </BlockStack>
              </InlineStack>
            </Box>
            <Box padding="400" background="bg-surface" borderRadius="200" minWidth="180px">
              <InlineStack gap="300" blockAlign="center">
                <IconTruck size={28} color="#10B981" />
                <BlockStack gap="050">
                  <Text as="p" variant="headingLg">{shippedOrders.length}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">Ya enviados</Text>
                </BlockStack>
              </InlineStack>
            </Box>
          </InlineStack>
        </Layout.Section>

        {/* Orders table */}
        <Layout.Section>
          {pendingOrders.length > 0 ? (
            <Card padding="0">
              <IndexTable
                resourceName={resourceName}
                itemCount={pendingOrders.length}
                selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "Pedido" },
                  { title: "Fecha" },
                  { title: "Destinatario" },
                  { title: "Productos" },
                  { title: "Total" },
                  { title: "Pago" },
                  { title: "" },
                ]}
                promotedBulkActions={promotedBulkActions}
                selectable
              >
                {rowMarkup}
              </IndexTable>
            </Card>
          ) : (
            <Card>
              <EmptyState
                heading="¡Todo enviado! 🎉"
                image=""
              >
                <p>No tienes pedidos pendientes de envío. Los nuevos pedidos aparecerán aquí automáticamente.</p>
              </EmptyState>
            </Card>
          )}
        </Layout.Section>

        {/* Already shipped section */}
        {shippedOrders.length > 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Pedidos ya enviados ({shippedOrders.length})</Text>
                {shippedOrders.slice(0, 5).map((order: any) => (
                  <InlineStack key={order.orderId} align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" variant="bodySm" fontWeight="bold">{order.name}</Text>
                      <Text as="span" variant="bodySm" tone="subdued">
                        {order.shippingAddress?.name || "—"} → {order.shippingAddress?.city}
                      </Text>
                    </InlineStack>
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="success">{order.shipmentStatus}</Badge>
                      {order.trackingNumber && (
                        <Text as="span" variant="bodySm" fontWeight="semibold">{order.trackingNumber}</Text>
                      )}
                    </InlineStack>
                  </InlineStack>
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
