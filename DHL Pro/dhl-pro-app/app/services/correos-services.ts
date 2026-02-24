/**
 * DHL Express Service Codes — shared between server and client
 * Uses same export name CORREOS_SERVICES for compatibility with existing route imports.
 * TODO: Rename to DHL_SERVICES in routes when fully adapted.
 */

export const CORREOS_SERVICES: Record<string, { name: string; description: string; deliveryDays: string }> = {
  "N":  { name: "DHL Express Domestic",       description: "Envío nacional express",                  deliveryDays: "24h" },
  "P":  { name: "DHL Express Worldwide",      description: "Envío internacional express",             deliveryDays: "2-5 días" },
  "U":  { name: "DHL Express WW (doc)",       description: "Documentos internacional express",        deliveryDays: "2-5 días" },
  "K":  { name: "DHL Express 9:00",           description: "Entrega antes de las 9:00",               deliveryDays: "9:00" },
  "E":  { name: "DHL Express 12:00",          description: "Entrega antes de las 12:00",              deliveryDays: "12:00" },
  "D":  { name: "DHL Express WW (nondoc)",    description: "Paquetería internacional",                deliveryDays: "3-7 días" },
  "H":  { name: "DHL Economy Select",         description: "Envío económico internacional",            deliveryDays: "5-10 días" },
};
