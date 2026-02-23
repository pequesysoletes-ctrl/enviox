import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import prisma from "../db.server";

/**
 * Public tracking page — accessible WITHOUT Shopify auth
 * URL: /tracking?n=TRACKING_NUMBER  or  /tracking (search form)
 * This page is served as an App Proxy by Shopify at: tutienda.com/a/mrw/tracking
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const trackingNumber = url.searchParams.get("n") || url.searchParams.get("tracking") || "";

  if (!trackingNumber) {
    return json({ shipment: null, events: [], trackingNumber: "" });
  }

  // Find shipment by tracking number
  const shipment = await prisma.shipment.findFirst({
    where: { mrwTrackingNumber: trackingNumber },
    select: {
      id: true,
      shopifyOrderName: true,
      customerName: true,
      destinationCity: true,
      destinationProvince: true,
      destinationZip: true,
      mrwTrackingNumber: true,
      mrwServiceCode: true,
      status: true,
      weight: true,
      packages: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!shipment) {
    return json({ shipment: null, events: [], trackingNumber });
  }

  // Get tracking events
  const events = await prisma.shipmentEvent.findMany({
    where: { shipmentId: shipment.id },
    orderBy: { eventDate: "desc" },
    select: {
      status: true,
      description: true,
      eventDate: true,
      location: true,
    },
  });

  return json({ shipment, events, trackingNumber });
};

// Status display configuration
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; step: number }> = {
  CREADO:       { label: "Envío registrado",    color: "#3B82F6", icon: "📋", step: 1 },
  PENDIENTE:    { label: "Pendiente recogida",  color: "#F59E0B", icon: "📦", step: 1 },
  RECOGIDO:     { label: "Recogido",            color: "#8B5CF6", icon: "🏪", step: 2 },
  EN_TRANSITO:  { label: "En tránsito",         color: "#0EA5E9", icon: "🚚", step: 3 },
  EN_REPARTO:   { label: "En reparto",          color: "#10B981", icon: "🛵", step: 4 },
  ENTREGADO:    { label: "Entregado",           color: "#10B981", icon: "✅", step: 5 },
  INCIDENCIA:   { label: "Incidencia",          color: "#EF4444", icon: "⚠️", step: -1 },
  ERROR:        { label: "Error",               color: "#EF4444", icon: "❌", step: -1 },
  DEVUELTO:     { label: "Devuelto",            color: "#6B7280", icon: "↩️", step: -1 },
};

const SERVICE_NAMES: Record<string, string> = {
  "0000": "MRW Urgente 10",
  "0100": "MRW Urgente 12",
  "0110": "MRW Urgente 14",
  "0200": "MRW Urgente 19",
  "0300": "MRW Económico",
  "0800": "MRW e-Commerce",
  "0810": "MRW e-Commerce Canje",
};

export default function TrackingPage() {
  const { shipment, events, trackingNumber } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(trackingNumber || "");

  const statusInfo = shipment ? (STATUS_CONFIG[shipment.status] || STATUS_CONFIG.PENDIENTE) : null;
  const currentStep = statusInfo?.step || 0;

  const steps = [
    { step: 1, label: "Registrado" },
    { step: 2, label: "Recogido" },
    { step: 3, label: "En tránsito" },
    { step: 4, label: "En reparto" },
    { step: 5, label: "Entregado" },
  ];

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {shipment
            ? `Seguimiento ${shipment.mrwTrackingNumber} — MRW Pro`
            : "Seguimiento de envío — MRW Pro by Enviox"
          }
        </title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: TRACKING_CSS }} />
      </head>
      <body>
        <div className="tracking-page">
          {/* Header */}
          <header className="tracking-header">
            <div className="header-content">
              <div className="brand">
                <span className="brand-logo">ENVIO<span className="x">X</span></span>
                <span className="brand-badge">MR<span className="w">W</span> PRO</span>
              </div>
              <span className="header-subtitle">Seguimiento de envío</span>
            </div>
          </header>

          {/* Search bar */}
          <section className="search-section">
            <form method="GET" className="search-form">
              <input
                type="text"
                name="n"
                placeholder="Introduce tu número de seguimiento MRW..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="search-input"
                autoFocus={!trackingNumber}
              />
              <button type="submit" className="search-btn">Buscar</button>
            </form>
          </section>

          {/* Results */}
          <main className="tracking-main">
            {trackingNumber && !shipment && (
              <div className="not-found">
                <div className="not-found-icon">🔍</div>
                <h2>Envío no encontrado</h2>
                <p>No hemos encontrado un envío con el número <strong>{trackingNumber}</strong>.</p>
                <p>Verifica el número e inténtalo de nuevo.</p>
              </div>
            )}

            {shipment && statusInfo && (
              <>
                {/* Status hero */}
                <div className="status-hero" style={{ borderColor: statusInfo.color }}>
                  <div className="status-icon" style={{ background: statusInfo.color }}>
                    {statusInfo.icon}
                  </div>
                  <div className="status-info">
                    <h2 className="status-label" style={{ color: statusInfo.color }}>
                      {statusInfo.label}
                    </h2>
                    <p className="tracking-number">N.º seguimiento: <strong>{shipment.mrwTrackingNumber}</strong></p>
                  </div>
                </div>

                {/* Progress steps */}
                {currentStep > 0 && (
                  <div className="progress-bar">
                    {steps.map((s) => (
                      <div key={s.step} className={`progress-step ${currentStep >= s.step ? "active" : ""} ${currentStep === s.step ? "current" : ""}`}>
                        <div className="step-dot" style={currentStep >= s.step ? { background: "#10B981" } : {}}>
                          {currentStep >= s.step ? "✓" : s.step}
                        </div>
                        <span className="step-label">{s.label}</span>
                      </div>
                    ))}
                    <div className="progress-line">
                      <div className="progress-fill" style={{ width: `${Math.max(0, ((currentStep - 1) / 4) * 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Shipment details */}
                <div className="details-grid">
                  <div className="detail-card">
                    <h3>Detalles del envío</h3>
                    <div className="detail-row">
                      <span className="detail-label">Destino</span>
                      <span className="detail-value">{shipment.destinationCity}, {shipment.destinationProvince}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">C.P.</span>
                      <span className="detail-value">{shipment.destinationZip}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Servicio</span>
                      <span className="detail-value">{SERVICE_NAMES[shipment.mrwServiceCode || "0800"] || "MRW Estándar"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Bultos</span>
                      <span className="detail-value">{shipment.packages || 1}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Peso</span>
                      <span className="detail-value">{shipment.weight || 2} kg</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fecha creación</span>
                      <span className="detail-value">
                        {new Date(shipment.createdAt).toLocaleDateString("es-ES", {
                          day: "2-digit", month: "long", year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="detail-card">
                    <h3>Historial de seguimiento</h3>
                    {events.length > 0 ? (
                      <div className="timeline">
                        {events.map((event: any, i: number) => {
                          const evStatus = STATUS_CONFIG[event.status] || { color: "#6B7280", icon: "•" };
                          return (
                            <div key={i} className={`timeline-item ${i === 0 ? "latest" : ""}`}>
                              <div className="timeline-dot" style={{ background: evStatus.color }} />
                              <div className="timeline-content">
                                <p className="timeline-desc">{event.description}</p>
                                <div className="timeline-meta">
                                  <span>{new Date(event.eventDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                                  {event.location && <span> · {event.location}</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="no-events">Aún no hay eventos de seguimiento registrados.</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {!trackingNumber && (
              <div className="welcome">
                <div className="welcome-icon">📦</div>
                <h2>Rastrea tu envío MRW</h2>
                <p>Introduce tu número de seguimiento en el campo de búsqueda para ver el estado de tu envío en tiempo real.</p>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="tracking-footer">
            <div className="footer-content">
              <span className="footer-brand">
                Powered by <strong>ENVIO<span style={{ color: "#3B82F6" }}>X</span></strong>
              </span>
              <span className="footer-sep">·</span>
              <a href="https://enviox.es" target="_blank" rel="noopener noreferrer">enviox.es</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

// ─── CSS ──────────────────────────────────────────────
const TRACKING_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    background: #F1F5F9;
    color: #1E293B;
    min-height: 100vh;
  }

  .tracking-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  .tracking-header {
    background: #0F172A;
    padding: 16px 24px;
  }
  .header-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-logo { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  .brand-logo .x { color: #3B82F6; }
  .brand-badge {
    background: rgba(59,130,246,0.2);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }
  .brand-badge .w { color: #E30613; }
  .header-subtitle { color: #94A3B8; font-size: 14px; }

  /* Search */
  .search-section {
    background: #0F172A;
    padding: 0 24px 32px;
  }
  .search-form {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    gap: 8px;
  }
  .search-input {
    flex: 1;
    padding: 14px 20px;
    border: 2px solid #334155;
    border-radius: 12px;
    background: #1E293B;
    color: #fff;
    font-size: 16px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: #3B82F6; }
  .search-input::placeholder { color: #64748B; }
  .search-btn {
    padding: 14px 28px;
    background: #3B82F6;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .search-btn:hover { background: #2563EB; }

  /* Main */
  .tracking-main {
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 32px 24px;
    flex: 1;
  }

  /* Status hero */
  .status-hero {
    background: #fff;
    border-radius: 16px;
    padding: 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-left: 5px solid;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    margin-bottom: 24px;
  }
  .status-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
  }
  .status-label {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .tracking-number {
    font-size: 0.9rem;
    color: #64748B;
  }

  /* Progress bar */
  .progress-bar {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin: 0 auto 32px;
    padding: 0 12px;
  }
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 1;
    flex: 1;
  }
  .step-dot {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #CBD5E1;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    transition: all 0.3s;
  }
  .progress-step.current .step-dot {
    box-shadow: 0 0 0 4px rgba(16,185,129,0.25);
    transform: scale(1.15);
  }
  .step-label {
    font-size: 12px;
    color: #94A3B8;
    font-weight: 500;
    text-align: center;
  }
  .progress-step.active .step-label { color: #1E293B; font-weight: 600; }
  .progress-line {
    position: absolute;
    top: 18px;
    left: 40px;
    right: 40px;
    height: 3px;
    background: #E2E8F0;
    border-radius: 2px;
    z-index: 0;
  }
  .progress-fill {
    height: 100%;
    background: #10B981;
    border-radius: 2px;
    transition: width 0.5s ease;
  }

  /* Details grid */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 640px) {
    .details-grid { grid-template-columns: 1fr; }
    .search-form { flex-direction: column; }
    .status-hero { flex-direction: column; text-align: center; }
    .progress-bar { gap: 4px; }
    .step-label { font-size: 10px; }
  }
  .detail-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .detail-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: #0F172A;
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #F1F5F9;
  }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #64748B; font-size: 0.85rem; }
  .detail-value { font-weight: 500; font-size: 0.85rem; text-align: right; }

  /* Timeline */
  .timeline { display: flex; flex-direction: column; gap: 0; }
  .timeline-item {
    display: flex;
    gap: 14px;
    padding: 10px 0;
    position: relative;
  }
  .timeline-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 28px;
    bottom: -2px;
    width: 2px;
    background: #E2E8F0;
  }
  .timeline-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
  }
  .timeline-item.latest .timeline-dot {
    box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
  }
  .timeline-desc { font-size: 0.85rem; font-weight: 500; margin-bottom: 2px; }
  .timeline-meta { font-size: 0.75rem; color: #94A3B8; }
  .no-events { color: #94A3B8; font-size: 0.9rem; text-align: center; padding: 20px; }

  /* Empty states */
  .not-found, .welcome {
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .not-found-icon, .welcome-icon { font-size: 48px; margin-bottom: 16px; }
  .not-found h2, .welcome h2 { font-size: 1.3rem; margin-bottom: 8px; }
  .not-found p, .welcome p { color: #64748B; font-size: 0.95rem; margin-bottom: 4px; }

  /* Footer */
  .tracking-footer {
    background: #0F172A;
    padding: 20px 24px;
    margin-top: auto;
  }
  .footer-content {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    font-size: 13px;
    color: #64748B;
  }
  .footer-content a { color: #3B82F6; text-decoration: none; }
  .footer-content strong { color: #94A3B8; }
  .footer-sep { margin: 0 6px; }
`;
