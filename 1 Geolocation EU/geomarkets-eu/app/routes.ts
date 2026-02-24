// ═══════════════════════════════════════════════════════════════
// Route Config — Remix v3 compatible route discovery
// Uses flat-file routes convention from @remix-run/fs-routes
// ═══════════════════════════════════════════════════════════════

import { type RouteConfig } from "@remix-run/route-config";
import { flatRoutes } from "@remix-run/fs-routes";

export default flatRoutes() satisfies RouteConfig;

