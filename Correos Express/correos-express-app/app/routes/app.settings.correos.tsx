import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Button,
  Banner,
  Select,
  InlineStack,
  Badge,
  Box,
  Divider,
  Checkbox,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState } from "react";
import { CORREOS_SERVICES } from "../services/correos-services";

/**
 * Correos Credentials & Configuration Page
 * Replaces app.settings.mrw.tsx for Correos Express Pro
 * 
 * Fields:
 * - User / Password (Correos API credentials)
 * - Código de Cliente
 * - Código de Contrato
 * - Código de Etiquetador
 * - Default service selection
 * - Default weight & dimensions
 * - Auto-create toggle
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Reuse MrwCredentials model — field names map differently but schema is the same
  const credentials = await prisma.mrwCredentials.findUnique({ where: { shop } });
  const config = await prisma.shippingConfig.findUnique({ where: { shop } });

  return json({
    credentials: credentials
      ? {
          user: credentials.username,
          password: credentials.password ? "••••••••" : "",
          codigoCliente: credentials.codigoFranquicia,    // Reusing field
          codigoContrato: credentials.codigoAbonado,      // Reusing field
          codEtiquetador: credentials.codigoDepartamento || "",
          verified: credentials.verified,
        }
      : null,
    config: config
      ? {
          defaultService: config.defaultService,
          defaultWeight: config.defaultWeight,
          autoCreateShipment: config.autoCreateShipment,
          sendTrackingEmail: config.sendTrackingEmail,
        }
      : null,
    services: Object.entries(CORREOS_SERVICES).map(([code, info]) => ({
      label: `${info.name} (${code}) — ${info.description}`,
      value: code,
    })),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "saveCredentials") {
    const user = formData.get("user")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const codigoCliente = formData.get("codigoCliente")?.toString() || "";
    const codigoContrato = formData.get("codigoContrato")?.toString() || "";
    const codEtiquetador = formData.get("codEtiquetador")?.toString() || "";

    // Map to existing Prisma model fields
    await prisma.mrwCredentials.upsert({
      where: { shop },
      create: {
        shop,
        username: user,
        password,
        codigoFranquicia: codigoCliente,
        codigoAbonado: codigoContrato,
        codigoDepartamento: codEtiquetador,
        verified: false,
      },
      update: {
        username: user,
        ...(password !== "••••••••" ? { password } : {}),
        codigoFranquicia: codigoCliente,
        codigoAbonado: codigoContrato,
        codigoDepartamento: codEtiquetador,
      },
    });

    return json({ success: true, message: "Credenciales de Correos guardadas correctamente." });
  }

  if (intent === "verify") {
    const creds = await prisma.mrwCredentials.findUnique({ where: { shop } });
    if (!creds) {
      return json({ success: false, error: "Guarda las credenciales primero." });
    }

    // Import and test correos API
    try {
      const { verifyCredentials } = await import("../services/correos.server");
      const result = await verifyCredentials({
        user: creds.username,
        password: creds.password,
        codigoCliente: creds.codigoFranquicia,
        codigoContrato: creds.codigoAbonado,
        codEtiquetador: creds.codigoDepartamento || "",
      });

      if (result.success) {
        await prisma.mrwCredentials.update({
          where: { shop },
          data: { verified: true },
        });
        return json({ success: true, verified: true, message: "✅ Conexión con Correos verificada correctamente." });
      } else {
        return json({ success: false, error: result.error });
      }
    } catch (err: any) {
      return json({ success: false, error: `Error verificando: ${err.message}` });
    }
  }

  if (intent === "saveConfig") {
    const defaultService = formData.get("defaultService")?.toString() || "S0132";
    const defaultWeight = parseInt(formData.get("defaultWeight")?.toString() || "2");
    const autoCreateShipment = formData.get("autoCreateShipment") === "true";
    const sendTrackingEmail = formData.get("sendTrackingEmail") === "true";

    await prisma.shippingConfig.upsert({
      where: { shop },
      create: { shop, defaultService, defaultWeight, autoCreateShipment, sendTrackingEmail },
      update: { defaultService, defaultWeight, autoCreateShipment, sendTrackingEmail },
    });

    return json({ success: true, message: "Configuración de envío guardada." });
  }

  return json({ success: false });
};

export default function CorreosSettingsPage() {
  const { credentials, config, services } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const [creds, setCreds] = useState({
    user: credentials?.user || "",
    password: credentials?.password || "",
    codigoCliente: credentials?.codigoCliente || "",
    codigoContrato: credentials?.codigoContrato || "",
    codEtiquetador: credentials?.codEtiquetador || "",
  });

  const [shipConfig, setShipConfig] = useState({
    defaultService: config?.defaultService || "S0132",
    defaultWeight: String(config?.defaultWeight || 2),
    autoCreateShipment: config?.autoCreateShipment ?? false,
    sendTrackingEmail: config?.sendTrackingEmail ?? true,
  });

  return (
    <Page
      title="Configuración Correos"
      subtitle="Conecta tu cuenta de Correos para enviar automáticamente"
      backAction={{ url: "/app/settings" }}
    >
      <Layout>
        {/* Success/Error messages */}
        {actionData?.message && (
          <Layout.Section>
            <Banner tone={actionData.success ? "success" : "critical"}>
              {actionData.message || actionData.error}
            </Banner>
          </Layout.Section>
        )}
        {actionData?.error && (
          <Layout.Section>
            <Banner tone="critical">{actionData.error}</Banner>
          </Layout.Section>
        )}

        {/* Credentials */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">🔑 Credenciales API Correos</Text>
                {credentials?.verified && <Badge tone="success">✅ Verificado</Badge>}
              </InlineStack>

              <Banner tone="info">
                <p>
                  Estas credenciales las obtienes en el{" "}
                  <strong>Portal de Empresas de Correos</strong> o contactando con tu comercial de Correos.
                  Necesitas una cuenta de empresa con acceso API.
                </p>
              </Banner>

              <Form method="POST">
                <input type="hidden" name="intent" value="saveCredentials" />
                <BlockStack gap="300">
                  <InlineGrid columns={2} gap="300">
                    <TextField
                      label="Usuario API"
                      name="user"
                      value={creds.user}
                      onChange={(v) => setCreds({ ...creds, user: v })}
                      autoComplete="off"
                      placeholder="tu_usuario_api"
                    />
                    <TextField
                      label="Contraseña API"
                      name="password"
                      value={creds.password}
                      onChange={(v) => setCreds({ ...creds, password: v })}
                      type="password"
                      autoComplete="off"
                    />
                  </InlineGrid>

                  <InlineGrid columns={3} gap="300">
                    <TextField
                      label="Código de Cliente"
                      name="codigoCliente"
                      value={creds.codigoCliente}
                      onChange={(v) => setCreds({ ...creds, codigoCliente: v })}
                      autoComplete="off"
                      placeholder="Ej: 12345678"
                      helpText="Identificador de empresa en Correos"
                    />
                    <TextField
                      label="Código de Contrato"
                      name="codigoContrato"
                      value={creds.codigoContrato}
                      onChange={(v) => setCreds({ ...creds, codigoContrato: v })}
                      autoComplete="off"
                      placeholder="Ej: 54321"
                      helpText="Número de contrato con Correos"
                    />
                    <TextField
                      label="Código Etiquetador"
                      name="codEtiquetador"
                      value={creds.codEtiquetador}
                      onChange={(v) => setCreds({ ...creds, codEtiquetador: v })}
                      autoComplete="off"
                      placeholder="Ej: XXXX"
                      helpText="Para generación de etiquetas"
                    />
                  </InlineGrid>

                  <InlineStack gap="300" align="end">
                    <Button submit disabled={isLoading}>
                      Guardar credenciales
                    </Button>
                    <Form method="POST">
                      <input type="hidden" name="intent" value="verify" />
                      <Button submit variant="primary" disabled={isLoading || !credentials}>
                        {isLoading ? "Verificando..." : "🔍 Verificar conexión"}
                      </Button>
                    </Form>
                  </InlineStack>
                </BlockStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Service configuration */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">📦 Configuración de envío</Text>

              <Form method="POST">
                <input type="hidden" name="intent" value="saveConfig" />
                <BlockStack gap="300">
                  <Select
                    label="Servicio por defecto"
                    name="defaultService"
                    options={services}
                    value={shipConfig.defaultService}
                    onChange={(v) => setShipConfig({ ...shipConfig, defaultService: v })}
                    helpText="Se usará cuando no haya reglas de envío que apliquen"
                  />

                  <TextField
                    label="Peso por defecto (gramos)"
                    name="defaultWeight"
                    value={shipConfig.defaultWeight}
                    onChange={(v) => setShipConfig({ ...shipConfig, defaultWeight: v })}
                    type="number"
                    suffix="g"
                    autoComplete="off"
                    helpText="Se usará cuando el producto no tenga peso definido"
                  />

                  <Divider />

                  <Checkbox
                    label="Crear envío automáticamente al recibir un nuevo pedido"
                    helpText="Cada nuevo pedido en Shopify creará un preregistro en Correos automáticamente"
                    checked={shipConfig.autoCreateShipment}
                    onChange={(v) => setShipConfig({ ...shipConfig, autoCreateShipment: v })}
                  />
                  <input type="hidden" name="autoCreateShipment" value={String(shipConfig.autoCreateShipment)} />

                  <Checkbox
                    label="Enviar email de tracking al cliente"
                    helpText="El cliente recibirá un email con el enlace de seguimiento cuando se cree el envío"
                    checked={shipConfig.sendTrackingEmail}
                    onChange={(v) => setShipConfig({ ...shipConfig, sendTrackingEmail: v })}
                  />
                  <input type="hidden" name="sendTrackingEmail" value={String(shipConfig.sendTrackingEmail)} />

                  <InlineStack align="end">
                    <Button submit variant="primary" disabled={isLoading}>
                      💾 Guardar configuración
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Available services reference */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">📋 Servicios Correos</Text>
              {Object.entries(CORREOS_SERVICES).slice(0, 8).map(([code, info]) => (
                <Box key={code} padding="200" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="050">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" variant="bodySm" fontWeight="bold">{info.name}</Text>
                      <Badge>{info.deliveryDays}</Badge>
                    </InlineStack>
                    <Text as="span" variant="bodySm" tone="subdued">
                      Código: {code} · {info.description}
                    </Text>
                  </BlockStack>
                </Box>
              ))}
            </BlockStack>
          </Card>

          <Box paddingBlockStart="400">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">💡 ¿Necesitas ayuda?</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Para obtener credenciales API de Correos:
                </Text>
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm">1. Accede al <strong>Portal de Empresas</strong> de Correos</Text>
                  <Text as="p" variant="bodySm">2. Ve a <strong>Soluciones Digitales → API</strong></Text>
                  <Text as="p" variant="bodySm">3. Solicita acceso al servicio <strong>Preregistro</strong></Text>
                  <Text as="p" variant="bodySm">4. Recibirás tus credenciales por email</Text>
                </BlockStack>
                <Button url="https://www.correos.es/empresas" target="_blank" fullWidth>
                  Ir al Portal de Correos
                </Button>
              </BlockStack>
            </Card>
          </Box>
        </Layout.Section>

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
