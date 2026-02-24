/**
 * MRW SOAP API Client
 * 
 * Connects to MRW's SOAP webservice for:
 * - TransmitirEnvio (create shipment)
 * - GetEtiquetaEnvio (get label PDF)
 * - SeguimientoEnvio (tracking)
 * 
 * Uses mock server in dev, real MRW API in production.
 */

const MRW_API_URL = process.env.MRW_API_URL || "http://localhost:3001/MRWEnvio.asmx";
const MRW_TRACKING_URL = process.env.MRW_TRACKING_URL || "http://localhost:3001/wssgmntnvs.asmx";

// ─── Types ──────────────────────────────────────────────

export interface MrwAuth {
  codigoFranquicia: string;
  codigoAbonado: string;
  codigoDepartamento: string;
  username: string;
  password: string;
}

export interface ShipmentData {
  via: string;
  codigoPostal: string;
  poblacion: string;
  provincia?: string;
  nif?: string;
  nombre: string;
  telefono: string;
  contacto?: string;
  atencionDe?: string;
  observaciones?: string;
  referencia: string;
  codigoServicio: string;
  bultos: number;
  peso: number;
  reembolso?: string;
  importeReembolso?: string;
}

export interface MrwResponse {
  success: boolean;
  trackingNumber?: string;
  message?: string;
  error?: string;
}

export interface MrwLabelResponse {
  success: boolean;
  labelBase64?: string;
  error?: string;
}

export interface TrackingEvent {
  fecha: string;
  hora: string;
  estado: string;
  descripcion: string;
  poblacion: string;
}

export interface MrwTrackingResponse {
  success: boolean;
  events: TrackingEvent[];
  error?: string;
}

// ─── SOAP Helpers ───────────────────────────────────────

function buildAuthHeader(auth: MrwAuth): string {
  return `
    <mrw:AuthInfo>
      <mrw:CodigoFranquicia>${auth.codigoFranquicia}</mrw:CodigoFranquicia>
      <mrw:CodigoAbonado>${auth.codigoAbonado}</mrw:CodigoAbonado>
      <mrw:CodigoDepartamento>${auth.codigoDepartamento || ""}</mrw:CodigoDepartamento>
      <mrw:UserName>${auth.username}</mrw:UserName>
      <mrw:Password>${auth.password}</mrw:Password>
    </mrw:AuthInfo>`;
}

function soapEnvelope(header: string, body: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:mrw="http://www.mrw.es/">
  <soap:Header>${header}</soap:Header>
  <soap:Body>${body}</soap:Body>
</soap:Envelope>`;
}

async function soapRequest(url: string, xml: string): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
    body: xml,
  });
  return response.text();
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1] : null;
}

function extractAllTags(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "gi");
  const matches = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

// ─── API Functions ──────────────────────────────────────

/**
 * Test connection to MRW API with given credentials.
 * Returns success if credentials are valid.
 */
export async function testConnection(auth: MrwAuth): Promise<MrwResponse> {
  try {
    const today = new Date().toLocaleDateString("es-ES");
    const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString("es-ES");
    
    const xml = soapEnvelope(
      buildAuthHeader(auth),
      `<mrw:GetEtiquetaEnvio>
        <mrw:request>
          <mrw:NumeroEnvio>TESTCONNECTION</mrw:NumeroEnvio>
        </mrw:request>
      </mrw:GetEtiquetaEnvio>`
    );

    const result = await soapRequest(MRW_API_URL, xml);
    
    // If we get an auth error, credentials are wrong
    if (result.includes("incorrectos") || result.includes("Estado>0")) {
      return {
        success: false,
        error: "Credenciales incorrectas. Verifica tu código de franquicia, abonado y password.",
      };
    }
    
    // Any other response means auth worked
    return {
      success: true,
      message: "Conexión verificada correctamente",
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Error de conexión: ${err.message}`,
    };
  }
}

/**
 * Create a shipment in MRW (TransmitirEnvio).
 */
export async function createShipment(
  auth: MrwAuth,
  data: ShipmentData
): Promise<MrwResponse> {
  try {
    const today = new Date().toLocaleDateString("es-ES");

    const xml = soapEnvelope(
      buildAuthHeader(auth),
      `<mrw:TransmitirEnvio>
        <mrw:request>
          <mrw:DatosEntrega>
            <mrw:Direccion>
              <mrw:Via>${escapeXml(data.via)}</mrw:Via>
              <mrw:CodigoPostal>${data.codigoPostal}</mrw:CodigoPostal>
              <mrw:Poblacion>${escapeXml(data.poblacion)}</mrw:Poblacion>
              <mrw:Provincia>${escapeXml(data.provincia || "")}</mrw:Provincia>
            </mrw:Direccion>
            <mrw:Nif>${data.nif || ""}</mrw:Nif>
            <mrw:Nombre>${escapeXml(data.nombre)}</mrw:Nombre>
            <mrw:Telefono>${data.telefono}</mrw:Telefono>
            <mrw:Contacto>${escapeXml(data.contacto || data.nombre)}</mrw:Contacto>
            <mrw:ALaAtencionDe>${escapeXml(data.atencionDe || data.nombre)}</mrw:ALaAtencionDe>
            <mrw:Observaciones>${escapeXml(data.observaciones || "")}</mrw:Observaciones>
          </mrw:DatosEntrega>
          <mrw:DatosServicio>
            <mrw:Fecha>${today}</mrw:Fecha>
            <mrw:Referencia>${escapeXml(data.referencia)}</mrw:Referencia>
            <mrw:CodigoServicio>${data.codigoServicio}</mrw:CodigoServicio>
            <mrw:NumeroBultos>${data.bultos}</mrw:NumeroBultos>
            <mrw:Peso>${data.peso}</mrw:Peso>
            <mrw:Reembolso>${data.reembolso || "N"}</mrw:Reembolso>
            <mrw:ImporteReembolso>${data.importeReembolso || "0"}</mrw:ImporteReembolso>
          </mrw:DatosServicio>
        </mrw:request>
      </mrw:TransmitirEnvio>`
    );

    const result = await soapRequest(MRW_API_URL, xml);

    // Check for error
    const estado = extractTag(result, "Estado");
    const mensaje = extractTag(result, "Mensaje");
    const numeroEnvio = extractTag(result, "NumeroEnvio");

    if (estado === "0" || !numeroEnvio) {
      return {
        success: false,
        error: mensaje || "Error desconocido al crear el envío",
      };
    }

    return {
      success: true,
      trackingNumber: numeroEnvio,
      message: mensaje || "Envío creado correctamente",
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Error de conexión: ${err.message}`,
    };
  }
}

/**
 * Get shipment label PDF from MRW (GetEtiquetaEnvio).
 */
export async function getLabel(
  auth: MrwAuth,
  trackingNumber: string
): Promise<MrwLabelResponse> {
  try {
    const xml = soapEnvelope(
      buildAuthHeader(auth),
      `<mrw:GetEtiquetaEnvio>
        <mrw:request>
          <mrw:NumeroEnvio>${trackingNumber}</mrw:NumeroEnvio>
        </mrw:request>
      </mrw:GetEtiquetaEnvio>`
    );

    const result = await soapRequest(MRW_API_URL, xml);

    const estado = extractTag(result, "Estado");
    const etiqueta = extractTag(result, "EtiquetaFile");

    if (estado === "0" || !etiqueta) {
      return {
        success: false,
        error: extractTag(result, "Mensaje") || "Error al obtener la etiqueta",
      };
    }

    return {
      success: true,
      labelBase64: etiqueta,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Error de conexión: ${err.message}`,
    };
  }
}

/**
 * Get tracking events for a shipment (SeguimientoEnvio).
 */
export async function getTracking(
  auth: MrwAuth,
  trackingNumber: string
): Promise<MrwTrackingResponse> {
  try {
    const xml = soapEnvelope(
      buildAuthHeader(auth),
      `<mrw:GetSeguimientoEnvio>
        <mrw:request>
          <mrw:NumeroEnvio>${trackingNumber}</mrw:NumeroEnvio>
        </mrw:request>
      </mrw:GetSeguimientoEnvio>`
    );

    const result = await soapRequest(MRW_TRACKING_URL, xml);

    const estado = extractTag(result, "Estado");
    if (estado === "0") {
      return {
        success: false,
        events: [],
        error: extractTag(result, "Mensaje") || "Error al obtener el seguimiento",
      };
    }

    // Parse events from XML
    const fechas = extractAllTags(result, "Fecha");
    const horas = extractAllTags(result, "Hora");
    const estados = extractAllTags(result, "EstadoEnvio");
    const descripciones = extractAllTags(result, "Descripcion");
    const poblaciones = extractAllTags(result, "Poblacion");

    const events: TrackingEvent[] = fechas.map((fecha, i) => ({
      fecha,
      hora: horas[i] || "",
      estado: estados[i] || "",
      descripcion: descripciones[i] || "",
      poblacion: poblaciones[i] || "",
    }));

    return {
      success: true,
      events,
    };
  } catch (err: any) {
    return {
      success: false,
      events: [],
      error: `Error de conexión: ${err.message}`,
    };
  }
}

// ─── MRW Service Codes ──────────────────────────────────

export const MRW_SERVICES = [
  { code: "0800", name: "MRW Ecommerce", description: "Envío estándar ecommerce" },
  { code: "0000", name: "Urgente 10", description: "Entrega antes de las 10:00" },
  { code: "0100", name: "Urgente 12", description: "Entrega antes de las 12:00" },
  { code: "0110", name: "Urgente 14", description: "Entrega antes de las 14:00" },
  { code: "0200", name: "Urgente 19", description: "Entrega antes de las 19:00" },
  { code: "0300", name: "Económico", description: "Entrega 48-72h" },
  { code: "0230", name: "Bag 19", description: "Documentos y sobres" },
];

// ─── Helpers ────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
