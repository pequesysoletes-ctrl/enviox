/**
 * Correos Service Codes — shared between server and client
 * Extracted from correos.server.ts to avoid server-only import in client components
 */

export const CORREOS_SERVICES: Record<string, { name: string; description: string; deliveryDays: string }> = {
  "S0132": { name: "Paq Premium", description: "Entrega en domicilio 24-48h", deliveryDays: "24-48h" },
  "S0133": { name: "Paq Estándar", description: "Entrega en domicilio 48-72h", deliveryDays: "48-72h" },
  "S0148": { name: "Paq Today", description: "Entrega en el día (ciudades principales)", deliveryDays: "Mismo día" },
  "S0175": { name: "Paq Empresa 14", description: "Entrega a empresas antes de las 14h", deliveryDays: "24h" },
  "S0176": { name: "Paq Retorno", description: "Devoluciones prepagadas", deliveryDays: "48-72h" },
  "S0177": { name: "Paq Empresa", description: "Envío B2B con recogida en oficina", deliveryDays: "24-72h" },
  "S0178": { name: "Paquetería CityPaq", description: "Entrega en punto CityPaq 24h", deliveryDays: "24h" },
  "S0235": { name: "Paquetería Oficina", description: "Recogida en oficina de Correos", deliveryDays: "48-72h" },
  "S0236": { name: "ePaq24", description: "eCommerce 24h paquetería ligera", deliveryDays: "24h" },
  "54":    { name: "Paq Light Internacional", description: "Envío internacional económico", deliveryDays: "5-10 días" },
};
