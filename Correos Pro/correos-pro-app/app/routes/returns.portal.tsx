import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import prisma from "../db.server";

/**
 * Public Self-Service Returns Portal
 * Accessible at /returns/portal without auth
 * Customer enters order number + email → sees their order → initiates return
 * 
 * This is the feature Outvio charges $125/mo for!
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const orderNumber = url.searchParams.get("order") || "";
  const email = url.searchParams.get("email") || "";
  const shop = url.searchParams.get("shop") || "";

  let shipment = null;
  let error = null;

  if (orderNumber && email && shop) {
    // Find the shipment by order name
    shipment = await prisma.shipment.findFirst({
      where: {
        shop: { contains: shop },
        shopifyOrderName: orderNumber,
      },
    });

    if (!shipment) {
      error = "No hemos encontrado un pedido con esos datos. Verifica el número de pedido y el email.";
    }
  }

  return json({ orderNumber, email, shipment, error, shop });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "search") {
    const orderNumber = formData.get("orderNumber")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const shop = formData.get("shop")?.toString() || "";
    return json({ redirect: `/returns/portal?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}&shop=${encodeURIComponent(shop)}` });
  }

  if (intent === "createReturn") {
    const shipmentId = formData.get("shipmentId")?.toString();
    const reason = formData.get("reason")?.toString() || "";
    const comments = formData.get("comments")?.toString() || "";

    if (!shipmentId) {
      return json({ success: false, error: "ID de envío no válido" });
    }

    const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
    if (!shipment) {
      return json({ success: false, error: "Envío no encontrado" });
    }

    // Create return shipment
    const returnShipment = await prisma.returnShipment.create({
      data: {
        shop: shipment.shop,
        originalShipmentId: shipment.id,
        shopifyOrderId: shipment.shopifyOrderId,
        shopifyOrderName: shipment.shopifyOrderName,
        customerName: shipment.customerName,
        customerPhone: shipment.customerPhone,
        pickupAddress: shipment.destinationAddress,
        pickupCity: shipment.destinationCity,
        pickupZip: shipment.destinationZip,
        pickupProvince: shipment.destinationProvince,
        reason,
        status: "PENDING",
      },
    });

    return json({
      success: true,
      returnId: returnShipment.id,
      message: "¡Devolución registrada correctamente! Te contactaremos para coordinar la recogida.",
    });
  }

  return json({ success: false, error: "Acción no válida" });
};

export default function ReturnsPortal() {
  const { orderNumber, email, shipment, error, shop } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const reasons = [
    "No me gusta el producto",
    "El producto está defectuoso",
    "He recibido un producto incorrecto",
    "El tamaño no es el adecuado",
    "El producto llegó dañado",
    "Ya no lo necesito",
    "Otro motivo",
  ];

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Portal de Devoluciones · Enviox</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: portalStyles }} />
      </head>
      <body>
        <div className="portal">
          <header className="portal-header">
            <div className="portal-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#E30613" />
                <path d="M8 22V10l8-4 8 4v12l-8 4-8-4z" fill="white" opacity="0.9" />
                <path d="M16 6v20M8 10l8 4 8-4" stroke="white" strokeWidth="1.5" />
              </svg>
              <span>Portal de Devoluciones</span>
            </div>
          </header>

          <main className="portal-main">
            {/* Success state */}
            {actionData?.success && (
              <div className="portal-card success">
                <div className="success-icon">✅</div>
                <h2>¡Devolución registrada!</h2>
                <p>{actionData.message}</p>
                <p className="return-id">Referencia: <strong>{actionData.returnId}</strong></p>
                <p className="info-text">
                  Recibirás un email con las instrucciones para enviar el paquete de vuelta.
                  Si tienes dudas, contacta con la tienda.
                </p>
              </div>
            )}

            {/* Search form */}
            {!shipment && !actionData?.success && (
              <div className="portal-card">
                <h1>¿Necesitas hacer una devolución?</h1>
                <p className="subtitle">
                  Introduce tu número de pedido y email para iniciar el proceso de devolución.
                </p>

                {error && (
                  <div className="error-banner">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <Form method="GET" className="search-form">
                  <input type="hidden" name="shop" value={shop} />
                  <div className="form-group">
                    <label htmlFor="order">Número de pedido</label>
                    <input
                      type="text"
                      id="order"
                      name="order"
                      placeholder="#1001"
                      defaultValue={orderNumber}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email de la compra</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="tu@email.com"
                      defaultValue={email}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Buscando..." : "Buscar mi pedido"}
                  </button>
                </Form>

                <div className="help-text">
                  <p>📧 Recibirás el número de pedido en el email de confirmación de tu compra.</p>
                </div>
              </div>
            )}

            {/* Order found → Return form */}
            {shipment && !actionData?.success && (
              <div className="portal-card">
                <h2>Pedido encontrado</h2>

                <div className="order-summary">
                  <div className="order-detail">
                    <span className="label">Pedido</span>
                    <span className="value">{shipment.shopifyOrderName}</span>
                  </div>
                  <div className="order-detail">
                    <span className="label">Destinatario</span>
                    <span className="value">{shipment.customerName}</span>
                  </div>
                  <div className="order-detail">
                    <span className="label">Dirección</span>
                    <span className="value">{shipment.destinationAddress}, {shipment.destinationCity} {shipment.destinationZip}</span>
                  </div>
                  <div className="order-detail">
                    <span className="label">Estado</span>
                    <span className={`status-badge status-${shipment.status.toLowerCase()}`}>
                      {shipment.status === "ENTREGADO" ? "Entregado" : shipment.status}
                    </span>
                  </div>
                  {shipment.correosTrackingNumber && (
                    <div className="order-detail">
                      <span className="label">Tracking</span>
                      <span className="value">{shipment.correosTrackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="divider" />

                <h3>Iniciar devolución</h3>

                <Form method="POST" className="return-form">
                  <input type="hidden" name="intent" value="createReturn" />
                  <input type="hidden" name="shipmentId" value={shipment.id} />

                  <div className="form-group">
                    <label htmlFor="reason">Motivo de la devolución</label>
                    <select id="reason" name="reason" required>
                      <option value="">Selecciona un motivo...</option>
                      {reasons.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comments">Comentarios adicionales (opcional)</label>
                    <textarea
                      id="comments"
                      name="comments"
                      rows={3}
                      placeholder="Describe brevemente el motivo de tu devolución..."
                    />
                  </div>

                  <div className="return-policy">
                    <p>📋 <strong>Política de devolución:</strong></p>
                    <ul>
                      <li>Tienes 14 días desde la entrega para solicitar una devolución</li>
                      <li>El producto debe estar en su estado original y embalaje</li>
                      <li>Se coordinará una recogida gratuita en tu dirección</li>
                    </ul>
                  </div>

                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Procesando..." : "Solicitar devolución"}
                  </button>
                </Form>
              </div>
            )}
          </main>

          <footer className="portal-footer">
            <p>Powered by <strong>Enviox</strong> · Correos Pro</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

const portalStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    min-height: 100vh;
    color: #1a1a2e;
  }
  .portal {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .portal-header {
    background: linear-gradient(135deg, #E30613, #B01020);
    padding: 16px 24px;
    color: white;
  }
  .portal-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    font-size: 18px;
    max-width: 600px;
    margin: 0 auto;
  }
  .portal-main {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 20px;
  }
  .portal-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    max-width: 560px;
    width: 100%;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .portal-card.success {
    text-align: center;
  }
  .success-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  .portal-card h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .portal-card h2 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .portal-card h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .subtitle {
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }
  .form-group {
    margin-bottom: 16px;
  }
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #333;
  }
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    transition: border-color 0.2s;
    outline: none;
  }
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    border-color: #E30613;
  }
  .btn-primary {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, #E30613, #B01020);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
    margin-top: 8px;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  .error-banner {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #DC2626;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .order-summary {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin: 16px 0;
  }
  .order-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  .order-detail:last-child {
    border-bottom: none;
  }
  .order-detail .label {
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }
  .order-detail .value {
    font-size: 14px;
    font-weight: 600;
  }
  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .status-entregado {
    background: #D1FAE5;
    color: #065F46;
  }
  .status-en_transito, .status-en_reparto {
    background: #DBEAFE;
    color: #1E40AF;
  }
  .status-pendiente, .status-pending {
    background: #FEF3C7;
    color: #92400E;
  }
  .divider {
    height: 1px;
    background: #e0e0e0;
    margin: 24px 0;
  }
  .return-policy {
    background: #F0F9FF;
    border: 1px solid #BAE6FD;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    font-size: 13px;
    line-height: 1.6;
  }
  .return-policy ul {
    padding-left: 20px;
    margin-top: 8px;
  }
  .return-policy li {
    margin-bottom: 4px;
  }
  .help-text {
    margin-top: 20px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 13px;
    color: #666;
  }
  .return-id {
    font-size: 14px;
    margin: 12px 0;
  }
  .info-text {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
  .portal-footer {
    text-align: center;
    padding: 20px;
    font-size: 13px;
    color: #999;
  }
  @media (max-width: 600px) {
    .portal-card { padding: 24px 20px; }
    .portal-card h1 { font-size: 20px; }
  }
`;
