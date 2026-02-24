import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">Dashboard</Link>
        <Link to="/app/shipments">Envíos</Link>
        <Link to="/app/returns">Devoluciones</Link>
        <Link to="/app/pickups">Recogidas</Link>
        <Link to="/app/billing">Facturación</Link>
        <Link to="/app/settings">Configuración</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Error boundary MUST NOT use Polaris components since AppProvider may not be available
export function ErrorBoundary() {
  const error = useRouteError();

  // Let Shopify handle auth errors (redirects, etc.)
  if (isRouteErrorResponse(error) && (error.status === 401 || error.status === 403)) {
    return boundary.error(error);
  }

  const statusCode = isRouteErrorResponse(error) ? error.status : 500;
  const errorMessage = isRouteErrorResponse(error)
    ? error.statusText || "Error desconocido"
    : error instanceof Error
      ? error.message
      : "Ha ocurrido un error inesperado";

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: 600,
      margin: "80px auto",
      padding: "0 24px",
      textAlign: "center",
    }}>
      <div style={{
        background: "#FEE2E2",
        border: "1px solid #FCA5A5",
        borderRadius: 12,
        padding: 32,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#991B1B", margin: "0 0 8px" }}>
          Error {statusCode}
        </h1>
        <p style={{ color: "#B91C1C", margin: 0, fontSize: 15 }}>
          {errorMessage}
        </p>
      </div>

      <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>
        Si el problema persiste, contacta con{" "}
        <a href="mailto:contacto@enviox.es" style={{ color: "#3B82F6" }}>
          contacto@enviox.es
        </a>
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <a
          href="/app"
          style={{
            padding: "10px 20px",
            background: "#3B82F6",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Volver al dashboard
        </a>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "#F1F5F9",
            color: "#334155",
            borderRadius: 8,
            border: "1px solid #CBD5E1",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
