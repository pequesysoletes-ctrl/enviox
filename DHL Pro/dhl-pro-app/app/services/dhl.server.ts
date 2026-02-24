/**
 * DHL Express API Service — dhl.server.ts
 * 
 * Integration with DHL Express MyDHL API
 * Docs: https://developer.dhl.com/api-reference/dhl-express-mydhl-api
 * 
 * Auth: Basic Auth (DHL site ID + password)
 * Tracking: DHL-API-Key header
 * 
 * Base URLs:
 *   Production: https://express.api.dhl.com/mydhlapi
 *   Sandbox:    https://express.api.dhl.com/mydhlapi/test
 *   Tracking:   https://api-eu.dhl.com/track/shipments
 */

// ─── Types ───────────────────────────────────────────

export interface DhlAuth {
  siteId: string;           // DHL Site ID
  password: string;         // DHL Password
  accountNumber: string;    // DHL Account Number (9-10 digits)
  apiKey: string;           // DHL-API-Key for tracking
}

export interface ShipmentData {
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderZip: string;
  senderPhone: string;
  senderCountry: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientZip: string;
  recipientProvince: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientCountry: string;
  weight: number;           // kg
  packages: number;
  serviceCode: string;      // "N", "P", "U", etc.
  reference: string;
  observations: string;
  length?: number;          // cm
  width?: number;           // cm
  height?: number;          // cm
  declaredValue?: number;
  insurance?: number;
  isDocument?: boolean;
}

export interface TrackingEvent {
  fecha: string;
  hora: string;
  estado: string;
  descripcion: string;
  oficina: string;
  poblacion: string;
}

// ─── Service Codes ───────────────────────────────────

export const DHL_SERVICES: Record<string, { name: string; description: string; deliveryDays: string }> = {
  "N":  { name: "DHL Express Domestic",         description: "Envío nacional express",                  deliveryDays: "24h" },
  "P":  { name: "DHL Express Worldwide",        description: "Envío internacional express",             deliveryDays: "2-5 días" },
  "U":  { name: "DHL Express Worldwide (doc)",  description: "Documentos internacional express",        deliveryDays: "2-5 días" },
  "K":  { name: "DHL Express 9:00",             description: "Entrega garantizada antes de las 9:00",   deliveryDays: "9:00" },
  "E":  { name: "DHL Express 12:00",            description: "Entrega garantizada antes de las 12:00",  deliveryDays: "12:00" },
  "T":  { name: "DHL Express 12:00 (doc)",      description: "Documentos antes de las 12:00",           deliveryDays: "12:00" },
  "Y":  { name: "DHL Express 12:00 (nondoc)",   description: "Paquetes antes de las 12:00",             deliveryDays: "12:00" },
  "D":  { name: "DHL Express Worldwide (nondoc)", description: "Paquetería internacional",              deliveryDays: "3-7 días" },
  "H":  { name: "DHL Economy Select",           description: "Envío económico internacional",            deliveryDays: "5-10 días" },
  "W":  { name: "DHL Economy Select (doc)",     description: "Documentos económico internacional",       deliveryDays: "5-10 días" },
};

// API Base URLs
const API_BASE = "https://express.api.dhl.com/mydhlapi";
const API_SANDBOX = "https://express.api.dhl.com/mydhlapi/test";
const TRACKING_BASE = "https://api-eu.dhl.com/track/shipments";

// ─── Helper: Build Auth Header ───────────────────────

function buildAuthHeader(auth: DhlAuth): string {
  const credentials = Buffer.from(`${auth.siteId}:${auth.password}`).toString("base64");
  return `Basic ${credentials}`;
}

// ─── Verify Credentials ─────────────────────────────

export async function verifyCredentials(
  auth: DhlAuth
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use the rates endpoint with a minimal payload to verify auth
    const response = await fetch(`${API_BASE}/rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        customerDetails: {
          shipperDetails: {
            postalCode: "28001",
            cityName: "Madrid",
            countryCode: "ES",
          },
          receiverDetails: {
            postalCode: "08001",
            cityName: "Barcelona",
            countryCode: "ES",
          },
        },
        accounts: [{ typeCode: "shipper", number: auth.accountNumber }],
        plannedShippingDateAndTime: new Date(Date.now() + 86400000).toISOString().split(".")[0],
        unitOfMeasurement: "metric",
        isCustomsDeclarable: false,
        packages: [{ weight: 1, dimensions: { length: 20, width: 15, height: 10 } }],
      }),
    });

    if (response.status === 401 || response.status === 403) {
      return { success: false, error: "Credenciales DHL incorrectas. Verifica Site ID, password y número de cuenta." };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: `Error de conexión con DHL: ${error.message}` };
  }
}

// ─── Create Shipment ─────────────────────────────────

export async function createShipment(
  auth: DhlAuth,
  data: ShipmentData
): Promise<{ success: boolean; trackingNumber?: string; labelBase64?: string; error?: string }> {
  try {
    const isInternational = (data.senderCountry || "ES") !== (data.recipientCountry || "ES");
    const productCode = data.serviceCode || (isInternational ? "P" : "N");

    const payload: any = {
      plannedShippingDateAndTime: new Date(Date.now() + 3600000).toISOString().split(".")[0],
      pickup: { isRequested: false },
      productCode,
      accounts: [{ typeCode: "shipper", number: auth.accountNumber }],
      customerDetails: {
        shipperDetails: {
          postalAddress: {
            postalCode: data.senderZip,
            cityName: data.senderCity,
            countryCode: data.senderCountry || "ES",
            addressLine1: data.senderAddress,
          },
          contactInformation: {
            phone: data.senderPhone,
            companyName: data.senderName,
            fullName: data.senderName,
          },
        },
        receiverDetails: {
          postalAddress: {
            postalCode: data.recipientZip,
            cityName: data.recipientCity,
            countryCode: data.recipientCountry || "ES",
            addressLine1: data.recipientAddress,
            provinceCode: data.recipientProvince || undefined,
          },
          contactInformation: {
            phone: data.recipientPhone,
            companyName: data.recipientName,
            fullName: data.recipientName,
            email: data.recipientEmail || undefined,
          },
        },
      },
      content: {
        packages: Array.from({ length: data.packages }, (_, i) => ({
          weight: data.weight / data.packages,
          dimensions: {
            length: data.length || 30,
            width: data.width || 20,
            height: data.height || 15,
          },
          customerReferences: [{ value: data.reference || `PKG-${i + 1}`, typeCode: "CU" }],
          description: data.observations || `Package ${i + 1} of ${data.packages}`,
        })),
        isCustomsDeclarable: isInternational,
        description: data.observations || "Merchandise",
        unitOfMeasurement: "metric",
      },
      shipmentNotification: data.recipientEmail ? [{
        typeCode: "email",
        receiverId: data.recipientEmail,
        languageCode: "spa",
        languageCountryCode: "ES",
      }] : undefined,
      customerReferences: data.reference ? [{ value: data.reference, typeCode: "CU" }] : undefined,
      outputImageProperties: {
        printerDPI: 300,
        encodingFormat: "pdf",
        imageOptions: [{
          typeCode: "label",
          templateName: "ECOM26_84_001",
        }],
      },
    };

    // Add customs for international
    if (isInternational) {
      payload.content.exportDeclaration = {
        lineItems: [{
          number: 1,
          description: data.observations || "Merchandise",
          price: data.declaredValue || 50,
          quantity: { value: data.packages, unitOfMeasurement: "PCS" },
          commodityCodes: [{ typeCode: "outbound", value: "9999.99.99.99" }],
          exportReasonType: "permanent",
          manufacturerCountry: "ES",
          weight: { netValue: data.weight, grossValue: data.weight },
        }],
        invoice: {
          number: data.reference || `INV-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
        },
        exportReason: "Sale",
        exportReasonType: "permanent",
      };
    }

    // Insurance
    if (data.insurance && data.insurance > 0) {
      payload.valueAddedServices = [{
        serviceCode: "II",
        value: data.insurance,
        currency: "EUR",
      }];
    }

    const response = await fetch(`${API_BASE}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.detail || result?.message || result?.title || JSON.stringify(result);
      return { success: false, error: `Error DHL (${response.status}): ${errorMsg}` };
    }

    const trackingNumber = result?.shipmentTrackingNumber || result?.packages?.[0]?.trackingNumber;
    const labelDoc = result?.documents?.find((d: any) => d.typeCode === "label");
    const labelBase64 = labelDoc?.content;

    if (!trackingNumber) {
      return { success: false, error: `Respuesta inesperada de DHL: ${JSON.stringify(result).substring(0, 200)}` };
    }

    return { success: true, trackingNumber, labelBase64 };
  } catch (error: any) {
    return { success: false, error: `Error de conexión con DHL: ${error.message}` };
  }
}

// ─── Get Tracking ────────────────────────────────────

export async function getTracking(
  auth: DhlAuth,
  trackingNumber: string
): Promise<{ success: boolean; events: TrackingEvent[]; error?: string }> {
  try {
    const response = await fetch(
      `${TRACKING_BASE}?trackingNumber=${encodeURIComponent(trackingNumber)}&service=express`,
      {
        headers: {
          "Accept": "application/json",
          "DHL-API-Key": auth.apiKey,
        },
      }
    );

    if (!response.ok) {
      return { success: false, events: [], error: `Error tracking DHL (${response.status})` };
    }

    const result = await response.json();
    const shipments = result?.shipments || [];

    if (shipments.length === 0) {
      return { success: true, events: [] };
    }

    const rawEvents = shipments[0]?.events || [];
    const events: TrackingEvent[] = rawEvents.map((e: any) => {
      const dateTime = e.timestamp ? new Date(e.timestamp) : new Date();
      return {
        fecha: dateTime.toLocaleDateString("es-ES"),
        hora: dateTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        estado: e.statusCode || "",
        descripcion: e.description || e.status || "",
        oficina: e.location?.address?.addressLocality || "",
        poblacion: e.location?.address?.addressLocality || "",
      };
    });

    return { success: true, events };
  } catch (error: any) {
    return { success: false, events: [], error: `Error consultando tracking DHL: ${error.message}` };
  }
}

// ─── Get Label (PDF) ─────────────────────────────────

export async function getLabel(
  auth: DhlAuth,
  trackingNumber: string
): Promise<{ success: boolean; labelBase64?: string; error?: string }> {
  try {
    // DHL returns label at shipment creation time
    // This endpoint retrieves it again if needed
    const response = await fetch(
      `${API_BASE}/shipments/${encodeURIComponent(trackingNumber)}/get-image`,
      {
        method: "GET",
        headers: {
          "Authorization": buildAuthHeader(auth),
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: `Error descargando etiqueta DHL (${response.status})` };
    }

    const result = await response.json();
    const labelDoc = result?.documents?.find((d: any) => d.typeCode === "label");

    if (labelDoc?.content) {
      return { success: true, labelBase64: labelDoc.content };
    }

    return { success: false, error: "No se encontró la etiqueta en la respuesta DHL" };
  } catch (error: any) {
    return { success: false, error: `Error descargando etiqueta: ${error.message}` };
  }
}

// ─── Cancel Shipment ─────────────────────────────────

export async function cancelShipment(
  auth: DhlAuth,
  trackingNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${API_BASE}/shipments/${encodeURIComponent(trackingNumber)}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": buildAuthHeader(auth),
        },
      }
    );

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      return {
        success: false,
        error: result?.detail || `Error cancelando envío DHL (${response.status})`,
      };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: `Error: ${error.message}` };
  }
}

// ─── Request Pickup ──────────────────────────────────

export async function requestPickup(
  auth: DhlAuth,
  data: {
    date: string;
    timeFrom: string;
    timeTo: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    contactName: string;
    contactPhone: string;
    packages: number;
    weight: number;
    observations: string;
  }
): Promise<{ success: boolean; pickupCode?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/pickups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        plannedPickupDateAndTime: `${data.date}T${data.timeFrom}:00`,
        closeTime: `${data.timeTo}:00`,
        location: "reception",
        locationType: "business",
        accounts: [{ typeCode: "shipper", number: auth.accountNumber }],
        customerDetails: {
          shipperDetails: {
            postalAddress: {
              postalCode: data.zip,
              cityName: data.city,
              countryCode: data.country || "ES",
              addressLine1: data.address,
            },
            contactInformation: {
              phone: data.contactPhone,
              companyName: data.contactName,
              fullName: data.contactName,
            },
          },
        },
        shipmentDetails: [{
          productCode: "N",
          isCustomsDeclarable: false,
          unitOfMeasurement: "metric",
          packages: [{ weight: data.weight, dimensions: { length: 30, width: 20, height: 15 } }],
        }],
        specialInstructions: [{ value: data.observations }],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result?.detail || `Error al solicitar recogida DHL (${response.status})`,
      };
    }

    return {
      success: true,
      pickupCode: result?.dispatchConfirmationNumbers?.[0] || "OK",
    };
  } catch (error: any) {
    return { success: false, error: `Error: ${error.message}` };
  }
}

// ─── Get Rates ───────────────────────────────────────

export async function getRates(
  auth: DhlAuth,
  data: {
    originZip: string;
    originCity: string;
    originCountry: string;
    destZip: string;
    destCity: string;
    destCountry: string;
    weight: number;
    length?: number;
    width?: number;
    height?: number;
  }
): Promise<{ success: boolean; rates: any[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        customerDetails: {
          shipperDetails: {
            postalCode: data.originZip,
            cityName: data.originCity,
            countryCode: data.originCountry || "ES",
          },
          receiverDetails: {
            postalCode: data.destZip,
            cityName: data.destCity,
            countryCode: data.destCountry || "ES",
          },
        },
        accounts: [{ typeCode: "shipper", number: auth.accountNumber }],
        plannedShippingDateAndTime: new Date(Date.now() + 86400000).toISOString().split(".")[0],
        unitOfMeasurement: "metric",
        isCustomsDeclarable: (data.originCountry || "ES") !== (data.destCountry || "ES"),
        packages: [{
          weight: data.weight,
          dimensions: {
            length: data.length || 30,
            width: data.width || 20,
            height: data.height || 15,
          },
        }],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, rates: [], error: result?.detail || `Error obteniendo tarifas (${response.status})` };
    }

    const rates = (result?.products || []).map((p: any) => ({
      productCode: p.productCode,
      productName: p.productName,
      totalPrice: p.totalPrice?.[0]?.price || 0,
      currency: p.totalPrice?.[0]?.priceCurrency || "EUR",
      deliveryDate: p.deliveryCapabilities?.estimatedDeliveryDateAndTime,
      transitDays: p.deliveryCapabilities?.totalTransitDays,
    }));

    return { success: true, rates };
  } catch (error: any) {
    return { success: false, rates: [], error: `Error: ${error.message}` };
  }
}

// ─── Status Mapping ──────────────────────────────────

export const DHL_STATUS_MAP: Record<string, string> = {
  "pre-transit":   "PENDIENTE",
  "transit":       "EN_TRANSITO",
  "out-for-delivery": "EN_REPARTO",
  "delivered":     "ENTREGADO",
  "failure":       "INCIDENCIA",
  "returned":      "DEVUELTO",
  "unknown":       "PENDIENTE",
};

export function mapDhlStatus(statusCode: string): string {
  return DHL_STATUS_MAP[statusCode?.toLowerCase()] || "EN_TRANSITO";
}
