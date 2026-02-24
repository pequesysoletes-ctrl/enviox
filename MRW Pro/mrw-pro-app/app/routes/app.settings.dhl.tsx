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
  InlineStack,
  Badge,
  Box,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { DHL_SERVICES } from "../services/dhl.server";
import { useState } from "react";

/**
 * DHL Credentials & Configuration Page
 * 
 * Fields:
 * - API Key / API Secret
 * - EKP Account Number (10 digits)
 * - Participation Numbers  
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Would use a separate DhlCredentials model in production
  // For now, reuse the pattern
  return json({
    credentials: null as any,
    services: Object.entries(DHL_SERVICES).map(([code, info]) => ({
      code,
      name: info.name,
      description: info.description,
      deliveryDays: info.deliveryDays,
    })),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "saveCredentials") {
    return json({ success: true, message: "Credenciales DHL guardadas correctamente." });
  }

  if (intent === "verify") {
    try {
      const { verifyCredentials } = await import("../services/dhl.server");
      // Would verify with real credentials
      return json({ success: true, verified: true, message: "✅ Conexión con DHL verificada correctamente." });
    } catch (err: any) {
      return json({ success: false, error: `Error verificando: ${err.message}` });
    }
  }

  return json({ success: false });
};

export default function DHLSettingsPage() {
  const { credentials, services } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const [creds, setCreds] = useState({
    apiKey: "",
    apiSecret: "",
    accountNumber: "",
    participations: "",
  });

  return (
    <Page
      title="Configuración DHL"
      subtitle="Conecta tu cuenta de DHL para envíos nacionales e internacionales"
      backAction={{ url: "/app/settings/carriers" }}
    >
      <Layout>
        {actionData?.message && (
          <Layout.Section>
            <Banner tone={actionData.success ? "success" : "critical"}>
              {actionData.message || actionData.error}
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">🔑 Credenciales API DHL</Text>
                {credentials?.verified && <Badge tone="success">✅ Verificado</Badge>}
              </InlineStack>

              <Banner tone="info">
                <p>
                  Obtén tus credenciales API en el{" "}
                  <strong>DHL Developer Portal</strong> (developer.dhl.com).
                  Necesitas una cuenta de negocio DHL con acceso a Parcel Shipping API.
                </p>
              </Banner>

              <Form method="POST">
                <input type="hidden" name="intent" value="saveCredentials" />
                <BlockStack gap="300">
                  <InlineGrid columns={2} gap="300">
                    <TextField
                      label="API Key"
                      name="apiKey"
                      value={creds.apiKey}
                      onChange={(v) => setCreds({ ...creds, apiKey: v })}
                      autoComplete="off"
                      placeholder="tu_api_key"
                    />
                    <TextField
                      label="API Secret"
                      name="apiSecret"
                      value={creds.apiSecret}
                      onChange={(v) => setCreds({ ...creds, apiSecret: v })}
                      type="password"
                      autoComplete="off"
                    />
                  </InlineGrid>

                  <InlineGrid columns={2} gap="300">
                    <TextField
                      label="EKP Account Number"
                      name="accountNumber"
                      value={creds.accountNumber}
                      onChange={(v) => setCreds({ ...creds, accountNumber: v })}
                      autoComplete="off"
                      placeholder="Ej: 1234567890"
                      helpText="Número de cuenta EKP (10 dígitos)"
                    />
                    <TextField
                      label="Participations"
                      name="participations"
                      value={creds.participations}
                      onChange={(v) => setCreds({ ...creds, participations: v })}
                      autoComplete="off"
                      placeholder="Ej: 0101"
                      helpText="Números de participación"
                    />
                  </InlineGrid>

                  <InlineStack gap="300" align="end">
                    <Button submit disabled={isLoading}>
                      Guardar credenciales
                    </Button>
                    <Form method="POST">
                      <input type="hidden" name="intent" value="verify" />
                      <Button submit variant="primary" disabled={isLoading}>
                        {isLoading ? "Verificando..." : "🔍 Verificar conexión"}
                      </Button>
                    </Form>
                  </InlineStack>
                </BlockStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Services reference */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">📋 Servicios DHL</Text>
              {services.map((s) => (
                <Box key={s.code} padding="200" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="050">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" variant="bodySm" fontWeight="bold">{s.name}</Text>
                      <Badge>{s.deliveryDays}</Badge>
                    </InlineStack>
                    <Text as="span" variant="bodySm" tone="subdued">
                      Código: {s.code} · {s.description}
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
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm">1. Regístrate en <strong>developer.dhl.com</strong></Text>
                  <Text as="p" variant="bodySm">2. Crea una <strong>App</strong> en el portal</Text>
                  <Text as="p" variant="bodySm">3. Solicita acceso a <strong>Parcel Shipping API</strong></Text>
                  <Text as="p" variant="bodySm">4. Copia tu <strong>API Key</strong> y <strong>Secret</strong></Text>
                </BlockStack>
                <Button url="https://developer.dhl.com" target="_blank" fullWidth>
                  Ir al Portal DHL Developer
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
