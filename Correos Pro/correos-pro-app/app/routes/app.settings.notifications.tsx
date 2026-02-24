import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Button,
  TextField,
  Banner,
  Badge,
  Box,
  Checkbox,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState } from "react";

/**
 * Notification Settings Page
 * Configure SMS (Twilio) and WhatsApp (WAHA) for tracking updates
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const config = await prisma.notificationConfig.findUnique({ where: { shop } });
  const shippingConfig = await prisma.shippingConfig.findUnique({ where: { shop } });

  return json({
    config: config || {
      smsEnabled: false,
      whatsappEnabled: false,
      twilioSid: "",
      twilioToken: "",
      twilioFromNumber: "",
      wahaUrl: "",
      wahaApiKey: "",
      wahaSession: "default",
      notifyOnCreated: true,
      notifyOnPickedUp: false,
      notifyOnInTransit: true,
      notifyOnOutForDelivery: true,
      notifyOnDelivered: true,
      notifyOnIncident: true,
    },
    smsEnabledGlobal: shippingConfig?.sendTrackingSms || false,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  const intent = formData.get("intent")?.toString();

  if (intent === "save") {
    const data = {
      smsEnabled: formData.get("smsEnabled") === "true",
      whatsappEnabled: formData.get("whatsappEnabled") === "true",
      twilioSid: formData.get("twilioSid")?.toString() || "",
      twilioToken: formData.get("twilioToken")?.toString() || "",
      twilioFromNumber: formData.get("twilioFromNumber")?.toString() || "",
      wahaUrl: formData.get("wahaUrl")?.toString() || "",
      wahaApiKey: formData.get("wahaApiKey")?.toString() || "",
      wahaSession: formData.get("wahaSession")?.toString() || "default",
      notifyOnCreated: formData.get("notifyOnCreated") === "true",
      notifyOnPickedUp: formData.get("notifyOnPickedUp") === "true",
      notifyOnInTransit: formData.get("notifyOnInTransit") === "true",
      notifyOnOutForDelivery: formData.get("notifyOnOutForDelivery") === "true",
      notifyOnDelivered: formData.get("notifyOnDelivered") === "true",
      notifyOnIncident: formData.get("notifyOnIncident") === "true",
    };

    await prisma.notificationConfig.upsert({
      where: { shop },
      create: { shop, ...data },
      update: data,
    });

    return json({ success: true, message: "Configuración guardada" });
  }

  if (intent === "testSms") {
    // Test SMS notification
    return json({ success: true, message: "SMS de prueba enviado (simulado). Conecta tus credenciales Twilio para envío real." });
  }

  if (intent === "testWhatsapp") {
    // Test WhatsApp notification
    return json({ success: true, message: "WhatsApp de prueba enviado (simulado). Conecta tu instancia WAHA para envío real." });
  }

  return json({ success: false, message: "Acción no válida" });
};

export default function NotificationSettingsPage() {
  const { config } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...config });

  const handleSave = () => {
    const formData = new FormData();
    formData.append("intent", "save");
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    submit(formData, { method: "POST" });
  };

  const handleTest = (channel: string) => {
    const formData = new FormData();
    formData.append("intent", channel === "sms" ? "testSms" : "testWhatsapp");
    submit(formData, { method: "POST" });
  };

  const statusEvents = [
    { key: "notifyOnCreated", label: "📦 Envío registrado", desc: "Cuando se crea el envío en MRW" },
    { key: "notifyOnPickedUp", label: "🚛 Recogido", desc: "Cuando MRW recoge el paquete" },
    { key: "notifyOnInTransit", label: "📍 En tránsito", desc: "Cuando el paquete está en camino" },
    { key: "notifyOnOutForDelivery", label: "🏠 En reparto", desc: "Cuando el repartidor sale con el paquete" },
    { key: "notifyOnDelivered", label: "✅ Entregado", desc: "Cuando se confirma la entrega" },
    { key: "notifyOnIncident", label: "⚠️ Incidencia", desc: "Cuando hay un problema con el envío" },
  ];

  return (
    <Page
      title="Notificaciones SMS & WhatsApp"
      subtitle="Mantén a tus clientes informados del estado de sus envíos"
      backAction={{ content: "Configuración", onAction: () => navigate("/app/settings") }}
      primaryAction={{ content: "Guardar", onAction: handleSave }}
    >
      <Layout>
        {actionData?.message && (
          <Layout.Section>
            <Banner tone={actionData?.success ? "success" : "critical"}>
              <p>{actionData.message}</p>
            </Banner>
          </Layout.Section>
        )}

        {/* WhatsApp exclusive banner */}
        <Layout.Section>
          <Banner tone="success" title="🎉 ¡WhatsApp Tracking — Exclusiva Correos Pro!">
            <p>
              Somos la <strong>única app de envíos en Shopify</strong> que ofrece notificaciones por WhatsApp.
              Tus clientes recibirán actualizaciones directamente en su WhatsApp, sin necesidad de descargar ninguna app.
              Tasa de apertura del <strong>98%</strong> vs 20% del email. 🚀
            </p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <InlineStack gap="400" align="start" wrap>
            {/* SMS Configuration */}
            <Box minWidth="380px">
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h2" variant="headingMd">📱 SMS (Twilio)</Text>
                      <Badge tone={form.smsEnabled ? "success" : "new"}>
                        {form.smsEnabled ? "Activo" : "Inactivo"}
                      </Badge>
                    </InlineStack>
                    <Button variant="plain" onClick={() => handleTest("sms")} disabled={!form.smsEnabled}>
                      Enviar prueba
                    </Button>
                  </InlineStack>

                  <Checkbox
                    label="Activar notificaciones SMS"
                    checked={form.smsEnabled}
                    onChange={(v) => setForm({ ...form, smsEnabled: v })}
                  />

                  {form.smsEnabled && (
                    <>
                      <TextField
                        label="Twilio Account SID"
                        value={form.twilioSid}
                        onChange={(v) => setForm({ ...form, twilioSid: v })}
                        autoComplete="off"
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      />
                      <TextField
                        label="Twilio Auth Token"
                        value={form.twilioToken}
                        onChange={(v) => setForm({ ...form, twilioToken: v })}
                        autoComplete="off"
                        type="password"
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      />
                      <TextField
                        label="Número de envío (From)"
                        value={form.twilioFromNumber}
                        onChange={(v) => setForm({ ...form, twilioFromNumber: v })}
                        autoComplete="off"
                        placeholder="+34612345678"
                        helpText="Tu número Twilio verificado"
                      />

                      <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                        <BlockStack gap="100">
                          <Text as="p" variant="bodySm" fontWeight="bold">💡 Coste estimado SMS España:</Text>
                          <Text as="p" variant="bodySm">~0.07€ por SMS enviado</Text>
                          <Text as="p" variant="bodySm">100 envíos/mes = ~4.20€/mes en SMS</Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            Regístrate en <a href="https://www.twilio.com" target="_blank" rel="noopener">twilio.com</a> y obtén $15 gratis
                          </Text>
                        </BlockStack>
                      </Box>
                    </>
                  )}
                </BlockStack>
              </Card>
            </Box>

            {/* WhatsApp Configuration */}
            <Box minWidth="380px">
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h2" variant="headingMd">💬 WhatsApp</Text>
                      <Badge tone={form.whatsappEnabled ? "success" : "new"}>
                        {form.whatsappEnabled ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge tone="info">★ Exclusivo</Badge>
                    </InlineStack>
                    <Button variant="plain" onClick={() => handleTest("whatsapp")} disabled={!form.whatsappEnabled}>
                      Enviar prueba
                    </Button>
                  </InlineStack>

                  <Checkbox
                    label="Activar notificaciones WhatsApp"
                    checked={form.whatsappEnabled}
                    onChange={(v) => setForm({ ...form, whatsappEnabled: v })}
                  />

                  {form.whatsappEnabled && (
                    <>
                      <TextField
                        label="URL del servidor WAHA"
                        value={form.wahaUrl}
                        onChange={(v) => setForm({ ...form, wahaUrl: v })}
                        autoComplete="off"
                        placeholder="https://waha.tu-servidor.com"
                        helpText="Tu instancia WAHA (WhatsApp HTTP API)"
                      />
                      <TextField
                        label="API Key (opcional)"
                        value={form.wahaApiKey}
                        onChange={(v) => setForm({ ...form, wahaApiKey: v })}
                        autoComplete="off"
                        type="password"
                        placeholder="tu-api-key"
                      />
                      <TextField
                        label="Nombre de sesión"
                        value={form.wahaSession}
                        onChange={(v) => setForm({ ...form, wahaSession: v })}
                        autoComplete="off"
                        placeholder="default"
                        helpText="Nombre de la sesión WAHA conectada"
                      />

                      <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                        <BlockStack gap="100">
                          <Text as="p" variant="bodySm" fontWeight="bold">💡 Ventajas de WhatsApp:</Text>
                          <Text as="p" variant="bodySm">✅ 98% tasa de apertura (vs 20% email)</Text>
                          <Text as="p" variant="bodySm">✅ Respuesta media en 90 segundos</Text>
                          <Text as="p" variant="bodySm">✅ Mensajes con formato rico (bold, links)</Text>
                          <Text as="p" variant="bodySm">✅ GRATIS — sin coste por mensaje</Text>
                        </BlockStack>
                      </Box>
                    </>
                  )}
                </BlockStack>
              </Card>
            </Box>
          </InlineStack>
        </Layout.Section>

        {/* Events configuration */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">¿Cuándo notificar?</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Elige en qué momentos del envío quieres notificar a tus clientes
              </Text>

              {statusEvents.map((event) => (
                <Box key={event.key} padding="200" background="bg-surface-secondary" borderRadius="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text as="span" variant="bodyMd">{event.label}</Text>
                      <Text as="span" variant="bodySm" tone="subdued">{event.desc}</Text>
                    </BlockStack>
                    <Checkbox
                      label=""
                      labelHidden
                      checked={(form as any)[event.key]}
                      onChange={(v) => setForm({ ...form, [event.key]: v })}
                    />
                  </InlineStack>
                </Box>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Preview */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Vista previa de mensajes</Text>

              <InlineStack gap="400" wrap>
                {/* SMS preview */}
                <Box minWidth="300px" padding="300" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="200">
                    <Badge>SMS</Badge>
                    <Box padding="300" background="bg-surface" borderRadius="200" borderWidth="025" borderColor="border">
                      <Text as="p" variant="bodySm">
                        🏠 Tu Tienda: ¡Tu envío MRW-0123456789 sale hoy para entrega! Estate atento.
                        Seguimiento: https://enviox.es/tracking?n=MRW-0123456789
                      </Text>
                    </Box>
                    <Text as="p" variant="bodySm" tone="subdued">~160 caracteres · 1 SMS</Text>
                  </BlockStack>
                </Box>

                {/* WhatsApp preview */}
                <Box minWidth="300px" padding="300" borderRadius="200" background="bg-surface-secondary">
                  <BlockStack gap="200">
                    <InlineStack gap="200">
                      <Badge tone="success">WhatsApp</Badge>
                      <Badge tone="info">★ Exclusivo</Badge>
                    </InlineStack>
                    <Box padding="300" borderRadius="200" borderWidth="025" borderColor="border">
                      <div style={{ background: "#DCF8C6", borderRadius: 8, padding: 12, fontSize: 13 }}>
                        <p style={{ margin: 0 }}>
                          🏠 <strong>Tu Tienda</strong>
                        </p>
                        <p style={{ margin: "8px 0 0 0" }}>
                          ¡Buenas noticias, Juan! Tu envío <strong>MRW-0123456789</strong> <strong>sale hoy para entrega</strong>.
                        </p>
                        <p style={{ margin: "8px 0 0 0" }}>
                          🕐 Estate atento, ¡el repartidor está en camino!
                        </p>
                        <p style={{ margin: "8px 0 0 0", color: "#0088cc", textDecoration: "underline" }}>
                          📍 Seguimiento en vivo
                        </p>
                      </div>
                    </Box>
                  </BlockStack>
                </Box>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
