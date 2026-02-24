/**
 * Correos Express API Service — correos-express.server.ts
 * 
 * Integration with Correos Express REST API
 * Docs: https://www.correosexpress.com (Portal integración)
 * 
 * IMPORTANT: Same interface as correos.server.ts so all routes work without changes.
 * Auth: Basic Auth (Base64 encoded user:password)
 */

// ─── Types ───────────────────────────────────────────

export interface CorreosExpressAuth {
  user: string;
  password: string;
  solicitante: string;    // Código cliente
  codRte: string;         // Código remitente
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
  weight: number;         // kg
  packages: number;
  serviceCode: string;
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

export const CORREOS_EXPRESS_SERVICES: Record<string, { name: string; description: string; deliveryDays: string }> = {
  "63":  { name: "Paq 24",         description: "Entrega en 24h en domicilio",          deliveryDays: "24h" },
  "92":  { name: "Paq 10",         description: "Entrega antes de las 10:00",           deliveryDays: "10:00" },
  "90":  { name: "Paq 14",         description: "Entrega antes de las 14:00",           deliveryDays: "14:00" },
  "91":  { name: "Paq 24",         description: "Entrega en 24h laborables",            deliveryDays: "24h" },
  "93":  { name: "ePaq 24",        description: "eCommerce entrega 24h",                deliveryDays: "24h" },
  "66":  { name: "Paq Empresa 14", description: "B2B entrega antes de las 14h",         deliveryDays: "14:00" },
  "67":  { name: "Paq 48",         description: "Entrega en 48h laborables",            deliveryDays: "48h" },
  "69":  { name: "ePaq 48",        description: "eCommerce entrega 48h",                deliveryDays: "48h" },
  "54":  { name: "Paq Retorno",    description: "Devoluciones prepagadas",              deliveryDays: "48h" },
  "76":  { name: "Paq Internacional", description: "Envío internacional",               deliveryDays: "5-10 días" },
};

// API Base URLs
const API_BASE = "https://www.correosexpress.com/wpsc";
const API_SANDBOX = "https://test.correosexpress.com/wpsc";

// ─── Helper: Build Auth Header ───────────────────────

function buildAuthHeader(auth: CorreosExpressAuth): string {
  const credentials = Buffer.from(`${auth.user}:${auth.password}`).toString("base64");
  return `Basic ${credentials}`;
}

// ─── Verify Credentials ─────────────────────────────

export async function verifyCredentials(
  auth: CorreosExpressAuth
): Promise<{ success: boolean; error?: string }> {
  try {
    // Try a simple API call to verify credentials work
    const response = await fetch(`${API_BASE}/apiRestGrabacionEnvio/json/grabacionEnvio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        // Minimal test payload - will fail validation but auth should pass
        solicitante: auth.solicitante,
        codRte: auth.codRte,
      }),
    });

    // If we get 401/403 = bad credentials, any other response = credentials OK
    if (response.status === 401 || response.status === 403) {
      return { success: false, error: "Credenciales incorrectas. Verifica usuario y contraseña." };
    }

    return { success: true };
  } catch (error: any) {
    // If connection fails, try sandbox
    try {
      const response = await fetch(`${API_SANDBOX}/apiRestGrabacionEnvio/json/grabacionEnvio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": buildAuthHeader(auth),
        },
        body: JSON.stringify({
          solicitante: auth.solicitante,
          codRte: auth.codRte,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        return { success: false, error: "Credenciales incorrectas." };
      }
      return { success: true };
    } catch {
      return { success: false, error: `Error de conexión: ${error.message}` };
    }
  }
}

// ─── Create Shipment ─────────────────────────────────

export async function createShipment(
  auth: CorreosExpressAuth,
  data: ShipmentData
): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
  try {
    const payload = {
      solicitante: auth.solicitante,
      canalEntrada: "",
      numEnvio: "",
      ref: data.reference,
      refCliente: data.reference,
      fecha: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }),
      codRte: auth.codRte,
      nomRte: data.senderName,
      nifRte: "",
      dirRte: data.senderAddress,
      worRte: data.senderCity,
      codPosNacRte: data.senderZip,
      worPobRte: data.senderCity,
      telRte: data.senderPhone,
      worEmailRte: "",
      codDest: "",
      nomDest: data.recipientName,
      nifDest: "",
      dirDest: data.recipientAddress,
      worDest: data.recipientCity,
      codPosNacDest: data.recipientZip,
      worPobDest: data.recipientCity,
      worProvDest: data.recipientProvince,
      telDest: data.recipientPhone,
      worEmailDest: data.recipientEmail || "",
      contlessDest: "",
      worObserv: data.observations,
      numBultos: data.packages,
      kilos: data.weight,
      volumen: "",
      alto: 0,
      largo: 0,
      ancho: 0,
      producto: data.serviceCode || "63",
      poression: "",
      reembolso: data.cashOnDelivery ? "O" : "",
      worImpReworb: data.cashOnDelivery || 0,
      seguro: data.insurance ? "S" : "",
      worImpSeguro: data.insurance || 0,
      codDirecDestino: "",
      worPassword: "",
      worAtencion: "",
      listaBultos: Array.from({ length: data.packages }, (_, i) => ({
        alto: 0,
        largo: 0,
        ancho: 0,
        codBultoCli: `${data.reference}-${i + 1}`,
        codUnico: "",
        descripcion: `Bulto ${i + 1} de ${data.packages}`,
        kilos: data.weight / data.packages,
        observaciones: data.observations,
        orden: i + 1,
        referencia: data.reference,
        volumen: 0,
      })),
    };

    const response = await fetch(`${API_BASE}/apiRestGrabacionEnvio/json/grabacionEnvio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.codigoRetorno === 0 || result.datosResultado) {
      return {
        success: true,
        trackingNumber: result.datosResultado || result.numEnvio || result.envio,
      };
    }

    return {
      success: false,
      error: result.mensajeRetorno || result.descError || `Error Correos Express: código ${result.codigoRetorno}`,
    };
  } catch (error: any) {
    return { success: false, error: `Error de conexión con Correos Express: ${error.message}` };
  }
}

// ─── Get Tracking ────────────────────────────────────

export async function getTracking(
  auth: CorreosExpressAuth,
  trackingNumber: string
): Promise<{ success: boolean; events: TrackingEvent[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/apiRestSeguimientoEnvios/json/seguimientoEnvio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        solicitante: auth.solicitante,
        dato: trackingNumber,
      }),
    });

    const result = await response.json();

    if (result.estadoEnvios && Array.isArray(result.estadoEnvios)) {
      const events: TrackingEvent[] = result.estadoEnvios.map((ev: any) => ({
        fecha: ev.fecha || "",
        hora: ev.hora || "",
        estado: ev.codEstado || "",
        descripcion: ev.descEstado || ev.estado || "",
        oficina: ev.codDelegacion || "",
        poblacion: ev.desPoblacion || "",
      }));
      return { success: true, events };
    }

    return { success: true, events: [] };
  } catch (error: any) {
    return { success: false, events: [], error: `Error de seguimiento: ${error.message}` };
  }
}

// ─── Get Label (PDF) ─────────────────────────────────

export async function getLabel(
  auth: CorreosExpressAuth,
  trackingNumber: string
): Promise<{ success: boolean; labelBase64?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/apiRestEtiquetaEnvio/json/etiquetaEnvio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        solicitante: auth.solicitante,
        dato: trackingNumber,
      }),
    });

    const result = await response.json();

    if (result.etiqueta) {
      return { success: true, labelBase64: result.etiqueta };
    }

    return {
      success: false,
      error: result.mensajeRetorno || "No se pudo obtener la etiqueta",
    };
  } catch (error: any) {
    return { success: false, error: `Error al obtener etiqueta: ${error.message}` };
  }
}

// ─── Cancel Shipment ─────────────────────────────────

export async function cancelShipment(
  auth: CorreosExpressAuth,
  trackingNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/apiRestAnulacionEnvio/json/anulacionEnvio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        solicitante: auth.solicitante,
        dato: trackingNumber,
      }),
    });

    const result = await response.json();

    if (result.codigoRetorno === 0) {
      return { success: true };
    }

    return {
      success: false,
      error: result.mensajeRetorno || "Error al anular envío",
    };
  } catch (error: any) {
    return { success: false, error: `Error: ${error.message}` };
  }
}

// ─── Create Return ───────────────────────────────────

export async function createReturn(
  auth: CorreosExpressAuth,
  data: ShipmentData
): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
  // For returns, we swap sender/recipient and use return service code
  const returnData = {
    ...data,
    serviceCode: "54", // Paq Retorno
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
  };

  return createShipment(auth, returnData);
}

// ─── Request Pickup ──────────────────────────────────

export async function requestPickup(
  auth: CorreosExpressAuth,
  data: {
    date: string;
    timeFrom: string;
    timeTo: string;
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
    const response = await fetch(`${API_BASE}/apiRestGrabacionRecogida/json/grabacionRecogida`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": buildAuthHeader(auth),
      },
      body: JSON.stringify({
        solicitante: auth.solicitante,
        codRte: auth.codRte,
        fechaRecogida: data.date,
        horaDesde: data.timeFrom,
        horaHasta: data.timeTo,
        direccion: data.address,
        poblacion: data.city,
        codigoPostal: data.zip,
        personaContacto: data.contactName,
        telefonoContacto: data.contactPhone,
        numBultos: data.packages,
        observaciones: data.observations,
      }),
    });

    const result = await response.json();

    if (result.codigoRetorno === 0) {
      return {
        success: true,
        pickupCode: result.codRecogida || result.dato,
      };
    }

    return {
      success: false,
      error: result.mensajeRetorno || "Error al solicitar recogida",
    };
  } catch (error: any) {
    return { success: false, error: `Error: ${error.message}` };
  }
}

// ─── Status Mapping ──────────────────────────────────

export const CE_STATUS_MAP: Record<string, string> = {
  "1":  "PENDIENTE",
  "2":  "EN_TRANSITO",
  "3":  "EN_REPARTO",
  "4":  "ENTREGADO",
  "5":  "INCIDENCIA",
  "6":  "DEVUELTO",
  "7":  "EN_TRANSITO",
  "8":  "RECOGIDO",
  "9":  "EN_TRANSITO",
  "10": "EN_REPARTO",
};

export function mapCEStatus(codEstado: string): string {
  return CE_STATUS_MAP[codEstado] || "PENDIENTE";
}
