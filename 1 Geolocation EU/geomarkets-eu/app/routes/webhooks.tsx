// ═══════════════════════════════════════════════════════════════
// Webhook handlers — App lifecycle + Markets sync
// ═══════════════════════════════════════════════════════════════

import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  switch (topic) {
    case "APP_UNINSTALLED":
      // Clean up shop data (optional — some devs keep data for reinstalls)
      console.log(`[GeoMarkets] App uninstalled from ${shop}`);
      break;

    case "APP_SCOPES_UPDATE":
      console.log(`[GeoMarkets] Scopes updated for ${shop}`);
      break;

    case "MARKETS_CREATE":
    case "MARKETS_UPDATE":
    case "MARKETS_DELETE":
      // Auto-sync markets when they change in Shopify
      console.log(`[GeoMarkets] Market ${topic} for ${shop}`, payload);
      // TODO: Trigger market sync
      break;

    default:
      console.log(`[GeoMarkets] Unhandled webhook topic: ${topic}`);
  }

  return json({ ok: true });
};
