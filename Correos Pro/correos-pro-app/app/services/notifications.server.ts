/**
 * SMS & WhatsApp Notification Service
 * Sends tracking updates to customers via SMS (Twilio) and WhatsApp (WAHA/Evolution)
 * 
 * Supports:
 * - Shipment created → "Tu pedido #1234 ha sido enviado con MRW"
 * - In transit → "Tu envío está en camino"
 * - Out for delivery → "Tu envío saldrá hoy para entrega"
 * - Delivered → "Tu envío ha sido entregado"
 * - Incident → "Hay una incidencia con tu envío"
 */

interface NotificationConfig {
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  twilioSid?: string;
  twilioToken?: string;
  twilioFromNumber?: string;
  wahaUrl?: string;
  wahaApiKey?: string;
  wahaSession?: string;
}

interface ShipmentNotification {
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  orderName: string;
  status: string;
  storeName: string;
  trackingUrl: string;
  destinationCity?: string;
  estimatedDelivery?: string;
}

// ─── Message Templates ─────────────────────────────────

const SMS_TEMPLATES: Record<string, (data: ShipmentNotification) => string> = {
  CREADO: (d) =>
    `📦 ${d.storeName}: Tu pedido ${d.orderName} ha sido registrado para envío con MRW. Seguimiento: ${d.trackingUrl}`,

  RECOGIDO: (d) =>
    `🚛 ${d.storeName}: Tu pedido ${d.orderName} ha sido recogido por MRW. Tracking: ${d.trackingNumber}. Síguelo: ${d.trackingUrl}`,

  EN_TRANSITO: (d) =>
    `📍 ${d.storeName}: Tu envío ${d.trackingNumber} está en camino${d.destinationCity ? ` hacia ${d.destinationCity}` : ""}. Seguimiento: ${d.trackingUrl}`,

  EN_REPARTO: (d) =>
    `🏠 ${d.storeName}: ¡Tu envío ${d.trackingNumber} sale hoy para entrega! Estate atento. Seguimiento: ${d.trackingUrl}`,

  ENTREGADO: (d) =>
    `✅ ${d.storeName}: Tu envío ${d.trackingNumber} ha sido entregado. ¡Gracias por tu compra! 🎉`,

  INCIDENCIA: (d) =>
    `⚠️ ${d.storeName}: Hay una incidencia con tu envío ${d.trackingNumber}. Contacta con nosotros para más info.`,

  DEVUELTO: (d) =>
    `↩️ ${d.storeName}: Tu envío ${d.trackingNumber} ha sido devuelto. Contacta con nosotros: ${d.trackingUrl}`,
};

const WHATSAPP_TEMPLATES: Record<string, (data: ShipmentNotification) => string> = {
  CREADO: (d) =>
    `📦 *${d.storeName}*\n\n¡Hola ${d.customerName}! Tu pedido *${d.orderName}* ha sido registrado para envío.\n\n🔢 Tracking: *${d.trackingNumber}*\n📍 Seguimiento: ${d.trackingUrl}\n\nTe mantendremos informado del estado de tu envío.`,

  RECOGIDO: (d) =>
    `🚛 *${d.storeName}*\n\n¡Hola ${d.customerName}! MRW ha recogido tu pedido *${d.orderName}*.\n\n🔢 Tracking: *${d.trackingNumber}*\n📍 Seguimiento: ${d.trackingUrl}\n\n¡Tu paquete ya está en camino! 🎉`,

  EN_TRANSITO: (d) =>
    `📍 *${d.storeName}*\n\nTu envío *${d.trackingNumber}* está en tránsito${d.destinationCity ? ` hacia *${d.destinationCity}*` : ""}.\n\n${d.estimatedDelivery ? `📅 Entrega estimada: *${d.estimatedDelivery}*\n` : ""}📍 Seguimiento: ${d.trackingUrl}`,

  EN_REPARTO: (d) =>
    `🏠 *${d.storeName}*\n\n¡Buenas noticias, ${d.customerName}! Tu envío *${d.trackingNumber}* *sale hoy para entrega*.\n\n🕐 Estate atento, ¡el repartidor está en camino!\n📍 Seguimiento: ${d.trackingUrl}`,

  ENTREGADO: (d) =>
    `✅ *${d.storeName}*\n\n¡Hola ${d.customerName}! Tu envío *${d.trackingNumber}* ha sido *entregado* correctamente. 🎉\n\n¡Gracias por tu compra! Si tienes algún problema, no dudes en contactarnos.\n\n⭐ ¿Contento con tu compra? ¡Déjanos una reseña!`,

  INCIDENCIA: (d) =>
    `⚠️ *${d.storeName}*\n\nHola ${d.customerName}, hay una *incidencia* con tu envío *${d.trackingNumber}*.\n\nNuestro equipo ya está trabajando para resolverlo. Te contactaremos con más información.\n\n📍 Seguimiento: ${d.trackingUrl}`,

  DEVUELTO: (d) =>
    `↩️ *${d.storeName}*\n\nHola ${d.customerName}, tu envío *${d.trackingNumber}* ha sido *devuelto*.\n\nContacta con nosotros para gestionar el reenvío o reembolso.\n\n📍 Detalles: ${d.trackingUrl}`,
};

// ─── SMS via Twilio ─────────────────────────────────────

export async function sendSMS(
  config: NotificationConfig,
  data: ShipmentNotification
): Promise<{ success: boolean; error?: string }> {
  if (!config.smsEnabled || !config.twilioSid || !config.twilioToken || !config.twilioFromNumber) {
    return { success: false, error: "SMS not configured" };
  }

  const phone = normalizePhone(data.customerPhone);
  if (!phone) {
    return { success: false, error: "Invalid phone number" };
  }

  const template = SMS_TEMPLATES[data.status];
  if (!template) {
    return { success: false, error: `No SMS template for status: ${data.status}` };
  }

  const message = template(data);

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${config.twilioSid}/Messages.json`;
    const auth = Buffer.from(`${config.twilioSid}:${config.twilioToken}`).toString("base64");

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: config.twilioFromNumber,
        To: phone,
        Body: message,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[SMS] Twilio error:", err);
      return { success: false, error: `Twilio error: ${response.status}` };
    }

    const result = await response.json();
    console.log(`[SMS] Sent to ${phone}: ${result.sid}`);
    return { success: true };

  } catch (err: any) {
    console.error("[SMS] Send failed:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── WhatsApp via WAHA ──────────────────────────────────

export async function sendWhatsApp(
  config: NotificationConfig,
  data: ShipmentNotification
): Promise<{ success: boolean; error?: string }> {
  if (!config.whatsappEnabled || !config.wahaUrl) {
    return { success: false, error: "WhatsApp not configured" };
  }

  const phone = normalizePhone(data.customerPhone);
  if (!phone) {
    return { success: false, error: "Invalid phone number" };
  }

  const template = WHATSAPP_TEMPLATES[data.status];
  if (!template) {
    return { success: false, error: `No WhatsApp template for status: ${data.status}` };
  }

  const message = template(data);
  // Clean WhatsApp number (no + prefix for WAHA)
  const waPhone = phone.replace("+", "");

  try {
    const url = `${config.wahaUrl}/api/sendText`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.wahaApiKey) {
      headers["X-Api-Key"] = config.wahaApiKey;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session: config.wahaSession || "default",
        chatId: `${waPhone}@c.us`,
        text: message,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[WhatsApp] WAHA error:", err);
      return { success: false, error: `WAHA error: ${response.status}` };
    }

    console.log(`[WhatsApp] Sent to ${waPhone}`);
    return { success: true };

  } catch (err: any) {
    console.error("[WhatsApp] Send failed:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── Unified notification dispatcher ────────────────────

export async function sendTrackingNotification(
  config: NotificationConfig,
  data: ShipmentNotification
): Promise<{ sms: boolean; whatsapp: boolean; errors: string[] }> {
  const errors: string[] = [];
  let smsOk = false;
  let waOk = false;

  // Send SMS
  if (config.smsEnabled) {
    const smsResult = await sendSMS(config, data);
    smsOk = smsResult.success;
    if (!smsOk && smsResult.error) errors.push(`SMS: ${smsResult.error}`);
  }

  // Send WhatsApp
  if (config.whatsappEnabled) {
    const waResult = await sendWhatsApp(config, data);
    waOk = waResult.success;
    if (!waOk && waResult.error) errors.push(`WhatsApp: ${waResult.error}`);
  }

  return { sms: smsOk, whatsapp: waOk, errors };
}

// ─── Helpers ────────────────────────────────────────────

function normalizePhone(phone: string): string | null {
  if (!phone) return null;

  // Clean non-numeric chars except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Spanish numbers
  if (cleaned.startsWith("6") || cleaned.startsWith("7") || cleaned.startsWith("9")) {
    cleaned = "+34" + cleaned;
  } else if (cleaned.startsWith("34") && !cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  } else if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  // Validate minimum length
  if (cleaned.length < 10) return null;

  return cleaned;
}

/**
 * Build tracking URL for a shipment
 */
export function buildTrackingUrl(trackingNumber: string, domain: string = "enviox.es"): string {
  return `https://${domain}/tracking?n=${encodeURIComponent(trackingNumber)}`;
}
