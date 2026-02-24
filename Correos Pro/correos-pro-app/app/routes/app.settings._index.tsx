import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
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
  Box,
  InlineStack,
  Divider,
  InlineGrid,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { CORREOS_SERVICES } from "../services/correos-services";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const config = await prisma.shippingConfig.findUnique({
    where: { shop: session.shop },
  });

  const hasCredentials = await prisma.mrwCredentials.findUnique({
    where: { shop: session.shop },
    select: { verified: true },
  });

  return json({
    config: config || {
      defaultService: "S0132",
      defaultWeight: 2,
      defaultLength: 30,
      defaultWidth: 20,
      defaultHeight: 15,
      autoCreateShipment: true,
      sendTrackingEmail: true,
      sendTrackingSms: false,
    },
    hasVerifiedCredentials: hasCredentials?.verified || false,
    services: Object.entries(CORREOS_SERVICES).map(([code, info]) => ({ code, name: `${info.name} — ${info.description}` })),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const data = {
    defaultService: formData.get("defaultService") as string,
    defaultWeight: parseInt(formData.get("defaultWeight") as string) || 2,
    defaultLength: parseInt(formData.get("defaultLength") as string) || 30,
    defaultWidth: parseInt(formData.get("defaultWidth") as string) || 20,
    defaultHeight: parseInt(formData.get("defaultHeight") as string) || 15,
    autoCreateShipment: formData.get("autoCreateShipment") === "true",
    sendTrackingEmail: formData.get("sendTrackingEmail") === "true",
    sendTrackingSms: formData.get("sendTrackingSms") === "true",
  };

  await prisma.shippingConfig.upsert({
    where: { shop: session.shop },
    update: data,
    create: { shop: session.shop, ...data },
  });

  return json({ success: true, message: "✅ Configuración guardada correctamente" });
};

// ── Toggle Switch Component ──
function ToggleRow({
  label,
  helpText,
  checked,
  onChange,
  fieldName,
}: {
  label: string;
  helpText: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  fieldName: string;
}) {
  return (
    <Box paddingBlockStart="200" paddingBlockEnd="200">
      <input type="hidden" name={fieldName} value={String(checked)} />
      <InlineStack align="space-between" blockAlign="center">
        <BlockStack gap="100">
          <Text as="p" variant="bodyMd" fontWeight="bold">{label}</Text>
          <Text as="p" variant="bodySm" tone="subdued">{helpText}</Text>
        </BlockStack>
        <Button
          variant={checked ? "primary" : "secondary"}
          size="slim"
          onClick={() => onChange(!checked)}
        >
          {checked ? "ON" : "OFF"}
        </Button>
      </InlineStack>
    </Box>
  );
}

export default function SettingsPage() {
  const { config, hasVerifiedCredentials, services } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const [defaultService, setDefaultService] = useState(config.defaultService);
  const [defaultWeight, setDefaultWeight] = useState(String(config.defaultWeight));
  const [defaultLength, setDefaultLength] = useState(String(config.defaultLength));
  const [defaultWidth, setDefaultWidth] = useState(String(config.defaultWidth));
  const [defaultHeight, setDefaultHeight] = useState(String(config.defaultHeight));
  const [autoCreate, setAutoCreate] = useState(config.autoCreateShipment);
  const [trackingEmail, setTrackingEmail] = useState(config.sendTrackingEmail);
  const [trackingSms, setTrackingSms] = useState(config.sendTrackingSms);

  const isLoading = fetcher.state !== "idle";
  const actionData = fetcher.data;

  const serviceOptions = services.map((s: any) => ({
    label: `${s.name}`,
    value: s.code,
  }));

  return (
    <Page
      title="Configuración de envíos"
      subtitle="Administra las preferencias generales para tu logística y automatizaciones."
      backAction={{ url: "/app" }}
    >
      <Layout>
        {!hasVerifiedCredentials && (
          <Layout.Section>
            <Banner
              title="Primero conecta tu cuenta Correos"
              tone="warning"
              action={{ content: "Conectar Correos", url: "/app/settings/correos" }}
            >
              Necesitas verificar tus credenciales de Correos antes de configurar los envíos.
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <fetcher.Form method="post">
            <BlockStack gap="500">
              {/* Card 1: Servicio por defecto */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm">◆</Text>
                    <Text as="h2" variant="headingMd">Servicio por defecto</Text>
                  </InlineStack>

                  <Select
                    label="Servicio de mensajería"
                    name="defaultService"
                    options={serviceOptions}
                    value={defaultService}
                    onChange={setDefaultService}
                  />

                  <Text as="p" variant="bodySm" tone="info">
                    ℹ Se usará para todos los envíos automáticos
                  </Text>
                </BlockStack>
              </Card>

              {/* Card 2: Peso y dimensiones */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm">📦</Text>
                    <Text as="h2" variant="headingMd">Peso y dimensiones por defecto</Text>
                  </InlineStack>

                  <InlineGrid columns={4} gap="400">
                    <TextField
                      label="Peso por defecto (kg)"
                      name="defaultWeight"
                      type="number"
                      value={defaultWeight}
                      onChange={setDefaultWeight}
                      autoComplete="off"
                    />
                    <TextField
                      label="Largo (cm)"
                      name="defaultLength"
                      type="number"
                      value={defaultLength}
                      onChange={setDefaultLength}
                      autoComplete="off"
                    />
                    <TextField
                      label="Ancho (cm)"
                      name="defaultWidth"
                      type="number"
                      value={defaultWidth}
                      onChange={setDefaultWidth}
                      autoComplete="off"
                    />
                    <TextField
                      label="Alto (cm)"
                      name="defaultHeight"
                      type="number"
                      value={defaultHeight}
                      onChange={setDefaultHeight}
                      autoComplete="off"
                    />
                  </InlineGrid>
                </BlockStack>
              </Card>

              {/* Card 3: Automatización */}
              <Card>
                <BlockStack gap="200">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm">⚡</Text>
                    <Text as="h2" variant="headingMd">Automatización</Text>
                  </InlineStack>

                  <ToggleRow
                    label="Crear envío automáticamente al completar el pago"
                    helpText="Sincronización instantánea con tu pasarela de pago."
                    checked={autoCreate}
                    onChange={setAutoCreate}
                    fieldName="autoCreateShipment"
                  />

                  <Divider />

                  <ToggleRow
                    label="Enviar email de tracking al cliente"
                    helpText="Notificaciones automáticas por correo electrónico."
                    checked={trackingEmail}
                    onChange={setTrackingEmail}
                    fieldName="sendTrackingEmail"
                  />

                  <Divider />

                  <ToggleRow
                    label="Enviar SMS de tracking al cliente"
                    helpText="Aviso por mensajería móvil (pueden aplicarse cargos adicionales)."
                    checked={trackingSms}
                    onChange={setTrackingSms}
                    fieldName="sendTrackingSms"
                  />
                </BlockStack>
              </Card>

              {actionData?.success && (
                <Banner tone="success">
                  <Text as="p" variant="bodyMd">{actionData.message}</Text>
                </Banner>
              )}

              <Box paddingBlockStart="200" paddingBlockEnd="400">
                <InlineStack align="center">
                  <Button variant="primary" submit loading={isLoading} size="large">
                    💾 Guardar configuración
                  </Button>
                </InlineStack>
              </Box>
            </BlockStack>
          </fetcher.Form>
        </Layout.Section>

        {/* Brand footer */}
        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
