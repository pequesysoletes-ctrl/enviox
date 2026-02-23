/**
 * Correos API Service — correos.server.ts
 * 
 * Integration with Correos API (Preregistro / Paquetería)
 * Docs: https://www.correos.es/content/dam/correos/documentos/empresas/api
 * 
 * IMPORTANT: Same interface as mrw.server.ts so all routes work without changes.
 * Only the internal implementation differs (REST vs SOAP).
 */

// ─── Types ───────────────────────────────────────────

export interface CorreosAuth {
  user: string;
  password: string;
  codigoCliente: string;
  codigoContrato: string;
  codEtiquetador: string;
}

export interface ShipmentData {
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderZip: string;
  senderPhone: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientZip: string;
  recipientProvince: string;
  recipientPhone: string;
  recipientEmail: string;
  weight: number;        // grams
  packages: number;
  serviceCode: string;   // '63', '54', 'S0132', etc.
  reference: string;
  observations: string;
  cashOnDelivery?: number;
  insurance?: number;
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

export const CORREOS_SERVICES: Record<string, { name: string; description: string; deliveryDays: string }> = {
  "S0132": { name: "Paq Premium", description: "Envío urgente 24h puerta a puerta", deliveryDays: "24h" },
  "S0175": { name: "Paq Estándar", description: "Envío económico 48-72h", deliveryDays: "48-72h" },
  "S0148": { name: "Paq Today", description: "Entrega en el mismo día", deliveryDays: "Hoy" },
  "S0236": { name: "Paq Retorno", description: "Logística inversa / Devoluciones", deliveryDays: "48-72h" },
  "S0176": { name: "Paq Ligero", description: "Paquetes hasta 2kg", deliveryDays: "48-72h" },
  "S0177": { name: "Paq 48", description: "Entrega en 48h", deliveryDays: "48h" },
  "S0178": { name: "Paq 72", description: "Entrega en 72h", deliveryDays: "72h" },
  "S0180": { name: "Paq Empresa 14", description: "Entrega antes de las 14h", deliveryDays: "24h (<14h)" },
  "63":    { name: "Paq Premium Internacional", description: "Envío internacional urgente", deliveryDays: "3-5 días" },
  "54":    { name: "Paq Light Internacional", description: "Envío internacional económico", deliveryDays: "5-10 días" },
};

// API Base URLs
const API_BASE_PREREGISTRO = "https://preregistroenvios.correos.es/preregistroenvios";
const API_BASE_TRACKING = "https://localizador.correos.es/canonico";
const API_BASE_LABEL = "https://preregistroenvios.correos.es/preregistroenvios";

// For testing/sandbox
const SANDBOX_BASE = "https://preregistroenviospre.correos.es/preregistroenvios";

// ─── Verify Credentials ─────────────────────────────

export async function verifyCredentials(auth: CorreosAuth): Promise<{ success: boolean; error?: string }> {
  try {
    // Correos API doesn't have a dedicated "ping" endpoint
    // We verify by making a minimal pre-register request and checking auth
    const response = await fetch(`${API_BASE_PREREGISTRO}/preregistro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${auth.user}:${auth.password}`).toString("base64")}`,
      },
      body: JSON.stringify({
        CodEtiquetador: auth.codEtiquetador,
        Care: "",
        TotalBultos: "0",
        // Minimal request to test auth — will fail validation but succeed auth
      }),
    });

    if (response.status === 401 || response.status === 403) {
      return { success: false, error: "Credenciales incorrectas. Verifica usuario, contraseña y código de cliente." };
    }

    // If we get any response other than auth error, credentials are valid
    return { success: true };
  } catch (error: any) {
    return { success: false, error: `Error de conexión: ${error.message}` };
  }
}

// ─── Create Shipment ─────────────────────────────────

export async function createShipment(
  auth: CorreosAuth,
  data: ShipmentData
): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
  try {
    const requestBody = {
      CodEtiquetador: auth.codEtiquetador,
      Care: auth.codigoContrato,
      TotalBultos: String(data.packages),
      ModDevEtworkiniqueta: "2", // PDF
      Remitente: {
        Nombre: data.senderName,
        Direccion: data.senderAddress,
        Localidad: data.senderCity,
        CodPostal: data.senderZip,
        Telefonocontacto: data.senderPhone,
        Pais: "ES",
      },
      Destinatario: {
        Nombre: data.recipientName,
        Direccion: data.recipientAddress,
        Localidad: data.recipientCity,
        CodPostal: data.recipientZip,
        Telefonocontacto: data.recipientPhone,
        Email: data.recipientEmail,
        Pais: "ES",
      },
      Envio: {
        NumBulto: "1",
        CodProducto: data.serviceCode,
        ReferenciaCliente: data.reference,
        TipoFranqueo: "FP", // Franqueo pagado
        Pesos: {
          Peso: {
            TipoPeso: "R", // Real
            Valor: String(data.weight),
          },
        },
        Observaciones1: data.observations,
        ...(data.cashOnDelivery && data.cashOnDelivery > 0
          ? { ValoresDeclarados: { Reembolso: String(data.cashOnDelivery) } }
          : {}),
        ...(data.insurance && data.insurance > 0
          ? { ValoresDeclarados: { ValorDeclarado: String(data.insurance) } }
          : {}),
      },
    };

    const response = await fetch(`${API_BASE_PREREGISTRO}/preregistro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${auth.user}:${auth.password}`).toString("base64")}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Error Correos (${response.status}): ${text}` };
    }

    const result = await response.json();
    const trackingNumber = result?.CodEnvio || result?.BultosList?.[0]?.CodEnvio;

    if (!trackingNumber) {
      return { success: false, error: `Respuesta inesperada de Correos: ${JSON.stringify(result)}` };
    }

    return { success: true, trackingNumber };
  } catch (error: any) {
    return { success: false, error: `Error de conexión con Correos: ${error.message}` };
  }
}

// ─── Get Tracking ────────────────────────────────────

export async function getTracking(
  auth: CorreosAuth,
  trackingNumber: string
): Promise<{ success: boolean; events: TrackingEvent[]; error?: string }> {
  try {
    // Correos public tracking API (no auth needed for basic tracking)
    const response = await fetch(
      `${API_BASE_TRACKING}/eventos?id=${encodeURIComponent(trackingNumber)}&codIdioma=1`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { success: false, events: [], error: `Error tracking (${response.status})` };
    }

    const result = await response.json();
    const rawEvents = result?.evento || result?.eventos || [];

    const events: TrackingEvent[] = rawEvents.map((e: any) => ({
      fecha: e.fecEvento || e.fecha || "",
      hora: e.horEvento || e.hora || "",
      estado: e.desEstado || e.codEvento || "",
      descripcion: e.desTextoAmpliado || e.desEvento || e.desEstado || "",
      oficina: e.unidad || "",
      poblacion: e.desPoblacion || "",
    }));

    return { success: true, events };
  } catch (error: any) {
    return { success: false, events: [], error: `Error consultando tracking: ${error.message}` };
  }
}

// ─── Get Label (PDF) ─────────────────────────────────

export async function getLabel(
  auth: CorreosAuth,
  trackingNumber: string
): Promise<{ success: boolean; labelBase64?: string; error?: string }> {
  try {
    const response = await fetch(
      `${API_BASE_LABEL}/preregistro/${encodeURIComponent(trackingNumber)}/etiqueta?tipoEtiqueta=PDF`,
      {
        headers: {
          "Authorization": `Basic ${Buffer.from(`${auth.user}:${auth.password}`).toString("base64")}`,
          "Accept": "application/pdf",
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: `Error descargando etiqueta (${response.status})` };
    }

    const buffer = await response.arrayBuffer();
    const labelBase64 = Buffer.from(buffer).toString("base64");

    return { success: true, labelBase64 };
  } catch (error: any) {
    return { success: false, error: `Error descargando etiqueta: ${error.message}` };
  }
}

// ─── Cancel Shipment ─────────────────────────────────

export async function cancelShipment(
  auth: CorreosAuth,
  trackingNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${API_BASE_PREREGISTRO}/preregistro/${encodeURIComponent(trackingNumber)}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${auth.user}:${auth.password}`).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: `Error cancelando envío (${response.status})` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: `Error cancelando envío: ${error.message}` };
  }
}

// ─── Create Return ───────────────────────────────────

export async function createReturn(
  auth: CorreosAuth,
  data: ShipmentData
): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
  // Returns use the same API but with service code S0236 (Paq Retorno)
  // and swapped sender/recipient
  return createShipment(auth, {
    ...data,
    serviceCode: "S0236",
    // Swap origin/destination for return
    senderName: data.recipientName,
    senderAddress: data.recipientAddress,
    senderCity: data.recipientCity,
    senderZip: data.recipientZip,
    senderPhone: data.recipientPhone,
    recipientName: data.senderName,
    recipientAddress: data.senderAddress,
    recipientCity: data.senderCity,
    recipientZip: data.senderZip,
    recipientPhone: data.senderPhone,
  });
}

// ─── Request Pickup ──────────────────────────────────

export async function requestPickup(
  auth: CorreosAuth,
  data: {
    date: string;        // YYYY-MM-DD
    timeFrom: string;    // HH:MM
    timeTo: string;      // HH:MM
    address: string;
    city: string;
    zip: string;
    contactName: string;
    contactPhone: string;
    packages: number;
    observations: string;
  }
): Promise<{ success: boolean; pickupCode?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_PREREGISTRO}/solicitudrecogida`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${auth.user}:${auth.password}`).toString("base64")}`,
      },
      body: JSON.stringify({
        CodEtiquetador: auth.codEtiquetador,
        FechaRecogida: data.date.replace(/-/g, ""),
        HoraDesde: data.timeFrom.replace(":", ""),
        HoraHasta: data.timeTo.replace(":", ""),
        Direccion: data.address,
        Localidad: data.city,
        CodPostal: data.zip,
        PersonaContacto: data.contactName,
        TelefonoContacto: data.contactPhone,
        NumBultos: String(data.packages),
        Observaciones: data.observations,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Error solicitando recogida (${response.status}): ${text}` };
    }

    const result = await response.json();
    return { success: true, pickupCode: result?.CodSolicitud || "OK" };
  } catch (error: any) {
    return { success: false, error: `Error solicitando recogida: ${error.message}` };
  }
}

// ─── Search Pickup Points ────────────────────────────

export async function searchPickupPoints(
  zip: string,
  radius: number = 5000
): Promise<{ success: boolean; points: any[]; error?: string }> {
  try {
    // Correos CityPaq / pickup points API
    const response = await fetch(
      `https://localizador.correos.es/canonico/oficinas?cp=${encodeURIComponent(zip)}&radio=${radius}&tipo=OFI`,
      {
        headers: { "Accept": "application/json" },
      }
    );

    if (!response.ok) {
      return { success: false, points: [], error: `Error buscando oficinas (${response.status})` };
    }

    const result = await response.json();
    const points = (result?.oficinas || []).map((o: any) => ({
      id: o.unidad || o.codOficina,
      name: o.desOficina || o.nombre,
      address: o.direccion || o.calle,
      city: o.localidad || o.poblacion,
      zip: o.codPostal || o.cp,
      phone: o.telefono || "",
      lat: o.latitud,
      lng: o.longitud,
      schedule: o.horario || "",
      services: o.servicios || [],
    }));

    return { success: true, points };
  } catch (error: any) {
    return { success: false, points: [], error: `Error buscando oficinas: ${error.message}` };
  }
}

// ─── Status Mapping ──────────────────────────────────

export const CORREOS_STATUS_MAP: Record<string, string> = {
  "A0": "PENDIENTE",        // Pre-registrado
  "A1": "CREADO",           // Admitido
  "B1": "EN_TRANSITO",      // En tránsito
  "C0": "EN_REPARTO",       // En reparto
  "D0": "ENTREGADO",        // Entregado
  "E0": "INCIDENCIA",       // Incidencia
  "F0": "DEVUELTO",         // Devuelto
  "I1": "EN_TRANSITO",      // En oficina de cambio
  "P0": "EN_TRANSITO",      // Procesado
  "R0": "DEVUELTO",         // Rehusado
};

export function mapCorreosStatus(codEvento: string): string {
  return CORREOS_STATUS_MAP[codEvento] || "EN_TRANSITO";
}
