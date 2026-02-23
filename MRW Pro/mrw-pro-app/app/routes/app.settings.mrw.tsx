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
  FormLayout,
  Box,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { testConnection } from "../services/mrw.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const credentials = await prisma.mrwCredentials.findUnique({
    where: { shop: session.shop },
  });

  return json({
    credentials: credentials
      ? {
          codigoFranquicia: credentials.codigoFranquicia,
          codigoAbonado: credentials.codigoAbonado,
          username: credentials.username,
          verified: credentials.verified,
          verifiedAt: credentials.verifiedAt?.toISOString() || null,
        }
      : null,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save") {
    const codigoFranquicia = formData.get("codigoFranquicia") as string;
    const codigoAbonado = formData.get("codigoAbonado") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!codigoFranquicia || !codigoAbonado || !username || !password) {
      return json({ error: "Todos los campos son obligatorios", success: false });
    }

    // Test connection with MRW
    const result = await testConnection({
      codigoFranquicia,
      codigoAbonado,
      codigoDepartamento: "",
      username,
      password,
    });

    // Save credentials
    await prisma.mrwCredentials.upsert({
      where: { shop: session.shop },
      update: {
        codigoFranquicia,
        codigoAbonado,
        username,
        password,
        verified: result.success,
        verifiedAt: result.success ? new Date() : null,
      },
      create: {
        shop: session.shop,
        codigoFranquicia,
        codigoAbonado,
        username,
        password,
        verified: result.success,
        verifiedAt: result.success ? new Date() : null,
      },
    });

    if (result.success) {
      return json({
        success: true,
        message: "✓ Conexión verificada correctamente. Ya puedes configurar tus envíos.",
      });
    } else {
      return json({
        success: false,
        error: result.error || "Error al verificar la conexión",
      });
    }
  }

  return json({ success: false });
};

export default function SettingsMrw() {
  const { credentials } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const [codigoFranquicia, setCodigoFranquicia] = useState(credentials?.codigoFranquicia || "");
  const [codigoAbonado, setCodigoAbonado] = useState(credentials?.codigoAbonado || "");
  const [username, setUsername] = useState(credentials?.username || "");
  const [password, setPassword] = useState("");

  const isLoading = fetcher.state !== "idle";
  const actionData = fetcher.data;

  return (
    <Page
      title="Conexión MRW"
      backAction={{ url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <Banner tone="warning">
            <Text as="p" variant="bodyMd">
              <strong>Requisito obligatorio</strong> — Esta app requiere un contrato MRW activo
              con acceso a MRWLink API. Cada tienda usa sus propias credenciales.
            </Text>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Credenciales API MRW
              </Text>

              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="save" />
                <FormLayout>
                  <TextField
                    label="Código de Franquicia MRW"
                    name="codigoFranquicia"
                    value={codigoFranquicia}
                    onChange={setCodigoFranquicia}
                    autoComplete="off"
                    placeholder="Ej: 9999"
                    requiredIndicator
                  />
                  <TextField
                    label="Código de Abonado MRW"
                    name="codigoAbonado"
                    value={codigoAbonado}
                    onChange={setCodigoAbonado}
                    autoComplete="off"
                    placeholder="Ej: 123456"
                    requiredIndicator
                  />
                  <TextField
                    label="Usuario API MRW"
                    name="username"
                    value={username}
                    onChange={setUsername}
                    autoComplete="off"
                    requiredIndicator
                  />
                  <TextField
                    label="Password API MRW"
                    name="password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    autoComplete="off"
                    requiredIndicator
                    helpText={credentials?.verified ? "Deja vacío para mantener el password actual" : ""}
                  />

                  <Button variant={actionData?.success || credentials?.verified ? "secondary" : "primary"} submit loading={isLoading}>
                    {actionData?.success || credentials?.verified ? "Re-verificar conexión" : "Verificar conexión"}
                  </Button>
                </FormLayout>
              </fetcher.Form>

              {actionData?.success && (
                <Banner tone="success">
                  <Text as="p" variant="bodyMd">{actionData.message}</Text>
                </Banner>
              )}

              {(actionData?.success || (credentials?.verified && !actionData)) && (
                <Button variant="primary" size="large" url="/app/settings">
                  Siguiente paso → Configurar envíos
                </Button>
              )}

              {actionData?.error && (
                <Banner tone="critical">
                  <Text as="p" variant="bodyMd">{actionData.error}</Text>
                </Banner>
              )}

              {credentials?.verified && !actionData && (
                <Banner tone="success">
                  <Text as="p" variant="bodyMd">
                    ✓ Conexión verificada — Última verificación: {credentials.verifiedAt ? new Date(credentials.verifiedAt).toLocaleString("es-ES") : "N/A"}
                  </Text>
                </Banner>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                ¿Dónde encuentro mis credenciales?
              </Text>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  <strong>1.</strong> Accede a mrw.es → Área de clientes → Empresas
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>2.</strong> Ve a Integraciones o Conectores
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>3.</strong> Tus credenciales están en el apartado MRWLink API
                </Text>
              </BlockStack>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Si no las encuentras, llama a tu oficina MRW asignada o al 902 300 400
                  (atención empresas MRW) y solicita las credenciales MRWLink de tu contrato.
                </Text>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Brand footer */}
        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
