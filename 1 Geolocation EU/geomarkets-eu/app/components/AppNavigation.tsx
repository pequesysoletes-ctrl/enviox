// ═══════════════════════════════════════════════════════════════
// AppNavigation — Consistent sidebar for all admin screens
// Based on the design review: P02 Dashboard sidebar is the standard
// ═══════════════════════════════════════════════════════════════

import { useLocation, useNavigate } from "@remix-run/react";
import { NavigationMenu } from "@shopify/app-bridge-react";

/**
 * Shopify App Bridge NavigationMenu — renders in the Shopify admin sidebar.
 * This ensures consistent navigation across ALL admin screens.
 */
export function AppNavigation() {
  return (
    <NavigationMenu
      navigationLinks={[
        { label: "Dashboard", destination: "/" },
        { label: "Configuración", destination: "/settings" },
        { label: "Markets", destination: "/markets" },
        { label: "Selector", destination: "/selector" },
        { label: "Analytics", destination: "/analytics" },
        { label: "Plan", destination: "/billing" },
        { label: "Ayuda", destination: "/help" },
      ]}
      matcher={(link, location) =>
        link.destination === location.pathname ||
        (link.destination !== "/" &&
          location.pathname.startsWith(link.destination))
      }
    />
  );
}
