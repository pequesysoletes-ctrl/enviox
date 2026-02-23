import { type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { createShipment, type MrwAuth, type ShipmentData } from "../services/mrw.server";

/**
 * Webhook: orders/create
 * Auto-creates MRW shipment when new order comes in
 * Only if autoCreateShipment is enabled in ShippingConfig
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  console.log(`[Webhook] ${topic} received for ${shop}`);

  if (!payload) {
    console.log("[Webhook] No payload, skipping");
    return new Response("OK", { status: 200 });
  }

  const order = payload as any;

  try {
    // Check if auto-creation is enabled
    const config = await prisma.shippingConfig.findUnique({
      where: { shop },
    });

    if (!config?.autoCreateShipment) {
      console.log(`[Webhook] Auto-create disabled for ${shop}, skipping`);
      return new Response("OK", { status: 200 });
    }

    // Check credentials
    const credentials = await prisma.mrwCredentials.findUnique({
      where: { shop },
    });

    if (!credentials?.verified) {
      console.log(`[Webhook] No verified credentials for ${shop}, skipping`);
      return new Response("OK", { status: 200 });
    }

    // Check if shipment already exists for this order
    const existing = await prisma.shipment.findFirst({
      where: { shop, shopifyOrderId: String(order.id) },
    });

    if (existing) {
      console.log(`[Webhook] Shipment already exists for order ${order.id}, skipping`);
      return new Response("OK", { status: 200 });
    }

    // Extract shipping address
    const shipping = order.shipping_address;
    if (!shipping) {
      console.log(`[Webhook] Order ${order.id} has no shipping address, skipping`);
      // Still create event record
      await prisma.shipment.create({
        data: {
          shop,
          shopifyOrderId: String(order.id),
          shopifyOrderName: order.name || `#${order.order_number}`,
          customerName: order.customer?.first_name
            ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim()
            : "Sin nombre",
          customerPhone: "",
          destinationAddress: "Sin dirección de envío",
          destinationCity: "",
          destinationZip: "",
          status: "ERROR",
          error: "El pedido no tiene dirección de envío",
        },
      });
      return new Response("OK", { status: 200 });
    }

    // Build MRW auth
    const auth: MrwAuth = {
      codigoFranquicia: credentials.codigoFranquicia,
      codigoAbonado: credentials.codigoAbonado,
      codigoDepartamento: credentials.codigoDepartamento || "",
      username: credentials.username,
      password: credentials.password,
    };

    // Build shipment data
    const customerName = shipping.name || 
      `${shipping.first_name || ""} ${shipping.last_name || ""}`.trim() || 
      "Cliente";

    const shipmentData: ShipmentData = {
      nombre: customerName,
      via: `${shipping.address1 || ""}${shipping.address2 ? ", " + shipping.address2 : ""}`,
      codigoPostal: shipping.zip || "",
      poblacion: shipping.city || "",
      provincia: shipping.province || "",
      telefono: shipping.phone || order.phone || order.customer?.phone || "",
      referencia: order.name || `#${order.order_number}`,
      codigoServicio: config.defaultService || "0800",
      bultos: 1,
      peso: config.defaultWeight || 2,
      observaciones: order.note || "",
    };

    // Create shipment via MRW
    const result = await createShipment(auth, shipmentData);

    // Save to DB
    const shipment = await prisma.shipment.create({
      data: {
        shop,
        shopifyOrderId: String(order.id),
        shopifyOrderName: order.name || `#${order.order_number}`,
        customerName,
        customerPhone: shipmentData.telefono,
        destinationAddress: shipmentData.via,
        destinationCity: shipmentData.poblacion,
        destinationZip: shipmentData.codigoPostal,
        destinationProvince: shipmentData.provincia || "",
        mrwTrackingNumber: result.success ? (result.trackingNumber || null) : null,
        mrwServiceCode: shipmentData.codigoServicio,
        weight: shipmentData.peso,
        packages: 1,
        status: result.success ? "PENDIENTE" : "ERROR",
        reference: shipmentData.referencia,
        observations: shipmentData.observaciones || "",
        error: result.success ? null : (result.error || "Error de la API MRW"),
      },
    });

    // Log event
    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: result.success ? "PENDIENTE" : "ERROR",
        description: result.success
          ? `Envío auto-creado. Tracking: ${result.trackingNumber}`
          : `Error al crear envío: ${result.error}`,
        eventDate: new Date(),
      },
    });

    console.log(`[Webhook] ${result.success ? "✅" : "❌"} Shipment for order ${order.name}: ${result.success ? result.trackingNumber : result.error}`);

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error(`[Webhook] Error processing order ${order.id}:`, error.message);

    // Save failed attempt
    try {
      await prisma.shipment.create({
        data: {
          shop,
          shopifyOrderId: String(order.id),
          shopifyOrderName: order.name || `#${order.order_number}`,
          customerName: order.shipping_address?.name || "Error",
          destinationAddress: order.shipping_address?.address1 || "",
          destinationCity: order.shipping_address?.city || "",
          destinationZip: order.shipping_address?.zip || "",
          status: "ERROR",
          error: error.message,
        },
      });
    } catch (e) {
      console.error("[Webhook] Failed to save error record:", e);
    }

    return new Response("OK", { status: 200 });
  }
};
