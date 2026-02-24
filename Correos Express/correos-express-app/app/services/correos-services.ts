/**
 * Correos Express Service Codes — shared between server and client
 * This file uses the same export name CORREOS_SERVICES so all imports work unchanged.
 */

export const CORREOS_SERVICES: Record<string, { name: string; description: string; deliveryDays: string }> = {
  "63":  { name: "Paq 24",         description: "Entrega en 24h en domicilio",          deliveryDays: "24h" },
  "92":  { name: "Paq 10",         description: "Entrega antes de las 10:00",           deliveryDays: "10:00" },
  "90":  { name: "Paq 14",         description: "Entrega antes de las 14:00",           deliveryDays: "14:00" },
  "93":  { name: "ePaq 24",        description: "eCommerce entrega 24h",                deliveryDays: "24h" },
  "66":  { name: "Paq Empresa 14", description: "B2B entrega antes de las 14h",         deliveryDays: "14:00" },
  "67":  { name: "Paq 48",         description: "Entrega en 48h laborables",            deliveryDays: "48h" },
  "69":  { name: "ePaq 48",        description: "eCommerce entrega 48h",                deliveryDays: "48h" },
  "54":  { name: "Paq Retorno",    description: "Devoluciones prepagadas",              deliveryDays: "48h" },
  "76":  { name: "Paq Internacional", description: "Envío internacional",               deliveryDays: "5-10 días" },
};
