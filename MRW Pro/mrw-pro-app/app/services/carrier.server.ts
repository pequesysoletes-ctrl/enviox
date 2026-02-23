/**
 * Carrier Dispatcher — carrier.server.ts
 * 
 * Unified interface for all carriers (MRW, Correos, DHL).
 * Routes automatically call this instead of a specific carrier.
 * The dispatcher selects the correct API based on the carrier field.
 */

import * as mrw from "./mrw.server";
import * as correos from "./correos.server";
import * as dhl from "./dhl.server";
import prisma from "../db.server";

// ─── Types ───────────────────────────────────────────

export type CarrierId = "mrw" | "correos" | "dhl";

export interface CarrierInfo {
  id: CarrierId;
  name: string;
  logo: string;
  color: string;
  website: string;
}

export const CARRIERS: Record<CarrierId, CarrierInfo> = {
  mrw: {
    id: "mrw",
    name: "MRW",
    logo: "🔴",
    color: "#E30613",
    website: "https://www.mrw.es",
  },
  correos: {
    id: "correos",
    name: "Correos",
    logo: "📮",
    color: "#FFCC00",
    website: "https://www.correos.es",
  },
  dhl: {
    id: "dhl",
    name: "DHL",
    logo: "📦",
    color: "#FFCC00",
    website: "https://www.dhl.es",
  },
};

// ─── Get Active Carriers for Shop ────────────────────

export async function getActiveCarriers(shop: string): Promise<CarrierId[]> {
  const creds = await prisma.mrwCredentials.findUnique({ where: { shop } });
  if (!creds) return [];

  const active: CarrierId[] = [];
  
  // Check which carriers have saved credentials
  // In production, each carrier would have its own credentials table
  // For now, we check via the metadata/department field to know which are enabled
  if (creds.verified) {
    // The base credentials model is used for whichever carrier(s) are configured
    // We look at the shop's carrier settings to determine which are active
    active.push("mrw"); // Default if credentials exist
  }

  return active.length > 0 ? active : ["mrw"];
}

// ─── Get Carrier Services ────────────────────────────

export function getCarrierServices(carrier: CarrierId) {
  switch (carrier) {
    case "mrw":
      return mrw.MRW_SERVICES;
    case "correos":
      return correos.CORREOS_SERVICES;
    case "dhl":
      return dhl.DHL_SERVICES;
    default:
      return mrw.MRW_SERVICES;
  }
}

// ─── Get All Services (combined) ─────────────────────

export function getAllServices(carriers: CarrierId[]) {
  return carriers.flatMap((c) => {
    const services = getCarrierServices(c);
    if (Array.isArray(services)) {
      return services.map((s: any) => ({ ...s, carrier: c }));
    }
    return Object.entries(services).map(([code, info]) => ({
      code,
      ...info,
      carrier: c,
    }));
  });
}

// ─── Unified Create Shipment ─────────────────────────

export async function createShipment(
  shop: string,
  carrier: CarrierId,
  data: any
): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
  const creds = await prisma.mrwCredentials.findUnique({ where: { shop } });
  if (!creds) return { success: false, error: "No hay credenciales configuradas" };

  switch (carrier) {
    case "mrw":
      return mrw.createShipment(
        {
          codigoFranquicia: creds.codigoFranquicia,
          codigoAbonado: creds.codigoAbonado,
          codigoDepartamento: creds.codigoDepartamento || "",
          username: creds.username,
          password: creds.password,
        },
        data
      );
    case "correos":
      return correos.createShipment(
        {
          user: creds.username,
          password: creds.password,
          codigoCliente: creds.codigoFranquicia,
          codigoContrato: creds.codigoAbonado,
          codEtiquetador: creds.codigoDepartamento || "",
        },
        data
      );
    case "dhl":
      return dhl.createShipment(
        {
          apiKey: creds.username,
          apiSecret: creds.password,
          accountNumber: creds.codigoFranquicia,
          participations: creds.codigoAbonado,
        },
        data
      );
    default:
      return { success: false, error: `Carrier desconocido: ${carrier}` };
  }
}

// ─── Unified Get Tracking ────────────────────────────

export async function getTracking(
  shop: string,
  carrier: CarrierId,
  trackingNumber: string
): Promise<{ success: boolean; events: any[]; error?: string }> {
  const creds = await prisma.mrwCredentials.findUnique({ where: { shop } });
  if (!creds) return { success: false, events: [], error: "No hay credenciales" };

  switch (carrier) {
    case "mrw":
      return mrw.getTracking(
        { codigoFranquicia: creds.codigoFranquicia, codigoAbonado: creds.codigoAbonado, codigoDepartamento: creds.codigoDepartamento || "", username: creds.username, password: creds.password },
        trackingNumber
      );
    case "correos":
      return correos.getTracking(
        { user: creds.username, password: creds.password, codigoCliente: creds.codigoFranquicia, codigoContrato: creds.codigoAbonado, codEtiquetador: creds.codigoDepartamento || "" },
        trackingNumber
      );
    case "dhl":
      return dhl.getTracking(
        { apiKey: creds.username, apiSecret: creds.password, accountNumber: creds.codigoFranquicia, participations: creds.codigoAbonado },
        trackingNumber
      );
    default:
      return { success: false, events: [], error: `Carrier desconocido: ${carrier}` };
  }
}

// ─── Unified Get Label ───────────────────────────────

export async function getLabel(
  shop: string,
  carrier: CarrierId,
  trackingNumber: string
): Promise<{ success: boolean; labelBase64?: string; error?: string }> {
  const creds = await prisma.mrwCredentials.findUnique({ where: { shop } });
  if (!creds) return { success: false, error: "No hay credenciales" };

  switch (carrier) {
    case "mrw":
      return mrw.getLabel(
        { codigoFranquicia: creds.codigoFranquicia, codigoAbonado: creds.codigoAbonado, codigoDepartamento: creds.codigoDepartamento || "", username: creds.username, password: creds.password },
        trackingNumber
      );
    case "correos":
      return correos.getLabel(
        { user: creds.username, password: creds.password, codigoCliente: creds.codigoFranquicia, codigoContrato: creds.codigoAbonado, codEtiquetador: creds.codigoDepartamento || "" },
        trackingNumber
      );
    case "dhl":
      return dhl.getLabel(
        { apiKey: creds.username, apiSecret: creds.password, accountNumber: creds.codigoFranquicia, participations: creds.codigoAbonado },
        trackingNumber
      );
    default:
      return { success: false, error: `Carrier desconocido: ${carrier}` };
  }
}

// ─── Unified Cancel Shipment ─────────────────────────

export async function cancelShipment(
  shop: string,
  carrier: CarrierId,
  trackingNumber: string
): Promise<{ success: boolean; error?: string }> {
  const creds = await prisma.mrwCredentials.findUnique({ where: { shop } });
  if (!creds) return { success: false, error: "No hay credenciales" };

  switch (carrier) {
    case "mrw":
      return mrw.cancelShipment(
        { codigoFranquicia: creds.codigoFranquicia, codigoAbonado: creds.codigoAbonado, codigoDepartamento: creds.codigoDepartamento || "", username: creds.username, password: creds.password },
        trackingNumber
      );
    case "correos":
      return correos.cancelShipment(
        { user: creds.username, password: creds.password, codigoCliente: creds.codigoFranquicia, codigoContrato: creds.codigoAbonado, codEtiquetador: creds.codigoDepartamento || "" },
        trackingNumber
      );
    case "dhl":
      return dhl.cancelShipment(
        { apiKey: creds.username, apiSecret: creds.password, accountNumber: creds.codigoFranquicia, participations: creds.codigoAbonado },
        trackingNumber
      );
    default:
      return { success: false, error: `Carrier desconocido: ${carrier}` };
  }
}

// ─── Carrier Pricing Tiers ───────────────────────────

export const PRICING_TIERS = {
  starter: {
    name: "Starter",
    price: 9.99,
    maxCarriers: 1,
    maxShipments: 100,
    features: ["1 carrier", "100 envíos/mes", "Tracking básico", "Etiquetas PDF"],
  },
  pro: {
    name: "Pro",
    price: 19.99,
    maxCarriers: 2,
    maxShipments: 500,
    features: ["2 carriers", "500 envíos/mes", "Tracking + SMS", "Reglas auto", "Analytics"],
  },
  business: {
    name: "Business",
    price: 29.99,
    maxCarriers: 3,
    maxShipments: -1, // unlimited
    features: ["3 carriers (todos)", "Envíos ilimitados", "Tracking + SMS + WhatsApp", "Reglas auto", "Analytics avanzado", "Soporte prioritario"],
  },
};
