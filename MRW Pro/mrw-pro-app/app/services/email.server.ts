/**
 * Email notification service for MRW Pro
 * Sends tracking notifications to end customers
 *
 * Uses Shopify's email notification system where possible,
 * falls back to direct SMTP for custom notifications
 */

interface TrackingEmailData {
  customerName: string;
  customerEmail: string;
  orderName: string;
  trackingNumber: string;
  trackingUrl: string;
  serviceName: string;
  estimatedDelivery?: string;
  shopName: string;
  locale?: string;
}

interface StatusUpdateEmailData {
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  trackingUrl: string;
  newStatus: string;
  statusDescription: string;
  shopName: string;
  locale?: string;
}

/**
 * Generate the HTML for a tracking notification email
 */
export function generateTrackingEmail(data: TrackingEmailData): { subject: string; html: string } {
  const subject = `Tu pedido ${data.orderName} ha sido enviado — ${data.shopName}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:#0F172A;padding:24px 32px;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
                      ENVIO<span style="color:#3B82F6;">X</span>
                    </span>
                    <span style="background:rgba(59,130,246,0.2);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:4px;margin-left:8px;">
                      MR<span style="color:#E30613;">W</span> PRO
                    </span>
                  </td>
                  <td align="right" style="color:#94A3B8;font-size:13px;">
                    ${data.shopName}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <h1 style="font-size:22px;color:#0F172A;margin:0 0 8px;">
                ¡Tu pedido está en camino! 🚚
              </h1>
              <p style="color:#64748B;font-size:15px;margin:0 0 24px;line-height:1.5;">
                Hola <strong>${data.customerName}</strong>, tu pedido <strong>${data.orderName}</strong>
                ha sido enviado a través de <strong>${data.serviceName}</strong>.
              </p>

              <!-- Tracking box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#0369A1;font-size:12px;font-weight:600;text-transform:uppercase;margin:0 0 6px;">
                      Número de seguimiento
                    </p>
                    <p style="color:#0F172A;font-size:22px;font-weight:700;margin:0;letter-spacing:1px;">
                      ${data.trackingNumber}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${data.trackingUrl}" style="display:inline-block;background:#3B82F6;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">
                      Seguir mi envío →
                    </a>
                  </td>
                </tr>
              </table>

              ${data.estimatedDelivery ? `
              <p style="color:#64748B;font-size:14px;text-align:center;margin:0 0 16px;">
                Entrega estimada: <strong style="color:#0F172A;">${data.estimatedDelivery}</strong>
              </p>
              ` : ''}

              <!-- Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E2E8F0;padding-top:20px;">
                <tr>
                  <td style="color:#94A3B8;font-size:13px;line-height:1.6;">
                    <p style="margin:0 0 4px;">
                      También puedes seguir tu envío en la web de MRW:
                      <a href="https://www.mrw.es/seguimiento_envios/MRW_seguimiento_envios.asp?num=${data.trackingNumber}" style="color:#3B82F6;text-decoration:none;">
                        mrw.es/seguimiento
                      </a>
                    </p>
                    <p style="margin:0;">
                      Si tienes alguna pregunta, contacta con ${data.shopName}.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;">
              <table width="100%">
                <tr>
                  <td style="color:#94A3B8;font-size:11px;">
                    Enviado a través de
                    <strong style="color:#64748B;">ENVIO<span style="color:#3B82F6;">X</span></strong>
                    · <a href="https://enviox.es" style="color:#3B82F6;text-decoration:none;">enviox.es</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * Generate HTML for a status update email
 */
export function generateStatusUpdateEmail(data: StatusUpdateEmailData): { subject: string; html: string } {
  const statusLabels: Record<string, string> = {
    EN_TRANSITO: "en tránsito",
    EN_REPARTO: "en reparto",
    ENTREGADO: "entregado",
    INCIDENCIA: "con incidencia",
    DEVUELTO: "devuelto",
  };

  const statusColors: Record<string, string> = {
    EN_TRANSITO: "#0EA5E9",
    EN_REPARTO: "#10B981",
    ENTREGADO: "#10B981",
    INCIDENCIA: "#EF4444",
    DEVUELTO: "#6B7280",
  };

  const statusText = statusLabels[data.newStatus] || data.newStatus;
  const statusColor = statusColors[data.newStatus] || "#3B82F6";

  const subject = `Tu envío ${data.trackingNumber} está ${statusText} — ${data.shopName}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#0F172A;padding:20px 32px;">
              <span style="font-size:18px;font-weight:800;color:#fff;">
                ENVIO<span style="color:#3B82F6;">X</span>
              </span>
              <span style="background:rgba(59,130,246,0.2);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;margin-left:6px;">
                MR<span style="color:#E30613;">W</span> PRO
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="color:#64748B;font-size:13px;margin:0 0 16px;">Hola ${data.customerName},</p>

              <table width="100%" style="background:#F8FAFC;border-left:4px solid ${statusColor};border-radius:0 8px 8px 0;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:${statusColor};font-size:16px;font-weight:700;margin:0 0 4px;">
                      Tu envío está ${statusText}
                    </p>
                    <p style="color:#64748B;font-size:13px;margin:0;">
                      ${data.statusDescription}
                    </p>
                    <p style="color:#94A3B8;font-size:12px;margin:8px 0 0;">
                      Seguimiento: <strong>${data.trackingNumber}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%">
                <tr>
                  <td align="center">
                    <a href="${data.trackingUrl}" style="display:inline-block;background:#3B82F6;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
                      Ver seguimiento completo →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#F8FAFC;padding:12px 32px;border-top:1px solid #E2E8F0;color:#94A3B8;font-size:11px;">
              Enviado por ${data.shopName} via
              <strong style="color:#64748B;">ENVIO<span style="color:#3B82F6;">X</span></strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * Send email via Shopify's notification system or custom SMTP
 * This is a placeholder — in production, integrate with:
 * 1. Shopify Admin API (preferred) — uses store's email settings
 * 2. SendGrid / Resend / Mailgun for custom sending
 */
export async function sendTrackingNotification(
  admin: any,
  data: TrackingEmailData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { subject, html } = generateTrackingEmail(data);

    // Option 1: Use Shopify's notification system
    // This sends through the store's configured email
    // Note: Requires the 'write_customers' scope
    console.log(`[Email] Would send tracking notification to ${data.customerEmail}`);
    console.log(`[Email] Subject: ${subject}`);
    console.log(`[Email] Tracking: ${data.trackingNumber}`);

    // TODO: Implement actual sending via:
    // - Shopify Admin API order notifications
    // - Or direct SMTP/API (SendGrid, Resend, etc.)
    //
    // Example with Resend:
    // const response = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     from: `${data.shopName} <noreply@enviox.es>`,
    //     to: data.customerEmail,
    //     subject,
    //     html,
    //   }),
    // });

    return { success: true };
  } catch (error: any) {
    console.error("[Email] Error sending notification:", error);
    return { success: false, error: error.message };
  }
}
