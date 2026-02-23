import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
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
  Select,
  InlineStack,
  Box,
  Divider,
  RadioButton,
  Checkbox,
  InlineGrid,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { createShipment as mrwCreateShipment, type MrwAuth, type ShipmentData } from "../services/mrw.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const credentials = await prisma.mrwCredentials.findUnique({
    where: { shop: session.shop },
  });

  const config = await prisma.shippingConfig.findUnique({
    where: { shop: session.shop },
  });

  if (!credentials?.verified) {
    return json({ error: "noCredentials", config: null });
  }

  return json({ error: null, config });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  const credentials = await prisma.mrwCredentials.findUnique({
    where: { shop },
  });

  if (!credentials?.verified) {
    return json({ error: "Credenciales MRW no configuradas" }, { status: 400 });
  }

  const recipientName = formData.get("recipientName") as string;
  const recipientPhone = formData.get("recipientPhone") as string;
  const recipientAddress = formData.get("recipientAddress") as string;
  const recipientCity = formData.get("recipientCity") as string;
  const recipientPostalCode = formData.get("recipientPostalCode") as string;
  const recipientProvince = formData.get("recipientProvince") as string;
  const weight = formData.get("weight") as string;
  const packages = formData.get("packages") as string;
  const serviceCode = formData.get("serviceCode") as string;
  const reference = formData.get("reference") as string;
  const notes = formData.get("notes") as string;

  if (!recipientName || !recipientAddress || !recipientCity || !recipientPostalCode || !recipientPhone) {
    return json({ error: "Completa todos los campos obligatorios" }, { status: 400 });
  }

  try {
    const auth: MrwAuth = {
      codigoFranquicia: credentials.codigoFranquicia,
      codigoAbonado: credentials.codigoAbonado,
      codigoDepartamento: credentials.codigoDepartamento || "",
      username: credentials.username,
      password: credentials.password,
    };

    const shipmentData: ShipmentData = {
      nombre: recipientName,
      via: recipientAddress,
      codigoPostal: recipientPostalCode,
      poblacion: recipientCity,
      provincia: recipientProvince || recipientCity,
      telefono: recipientPhone,
      referencia: reference || `Manual-${Date.now()}`,
      codigoServicio: serviceCode || "0800",
      bultos: parseInt(packages) || 1,
      peso: parseFloat(weight) || 2,
      observaciones: notes || "",
    };

    const result = await mrwCreateShipment(auth, shipmentData);

    if (!result.success) {
      return json({ error: result.error || "Error al crear envío" }, { status: 500 });
    }

    // Save to DB
    await prisma.shipment.create({
      data: {
        shop,
        shopifyOrderId: "",
        shopifyOrderName: reference || `Manual ${new Date().toLocaleDateString("es-ES")}`,
        customerName: recipientName,
        customerEmail: "",
        customerPhone: recipientPhone,
        destinationAddress: recipientAddress,
        destinationCity: recipientCity,
        destinationZip: recipientPostalCode,
        destinationProvince: recipientProvince || "",
        mrwTrackingNumber: result.trackingNumber || null,
        mrwServiceCode: serviceCode || "0800",
        weight: parseFloat(weight) || 2,
        packages: parseInt(packages) || 1,
        reference: reference || "",
        observations: notes || "",
        status: "CREADO",
      },
    });

    return json({
      success: true,
      trackingNumber: result.trackingNumber,
    });
  } catch (error: any) {
    return json({ error: `Error: ${error.message}` }, { status: 500 });
  }
};

export default function NewShipment() {
  const { error: loaderError, config } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const isLoading = fetcher.state !== "idle";
  const actionData = fetcher.data;

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [recipientPostalCode, setRecipientPostalCode] = useState("");
  const [recipientProvince, setRecipientProvince] = useState("");
  const [weight, setWeight] = useState(String(config?.defaultWeight || 2));
  const [packages, setPackages] = useState("1");
  const [serviceCode, setServiceCode] = useState(config?.defaultService || "0800");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [useDefaults, setUseDefaults] = useState(true);
  const [length, setLength] = useState(String(config?.defaultLength || 0));
  const [width, setWidth] = useState(String(config?.defaultWidth || 0));
  const [height, setHeight] = useState(String(config?.defaultHeight || 0));

  // Success state
  if (actionData?.success) {
    return (
      <Page title="Envío creado" backAction={{ url: "/app/shipments" }}>
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="600" inlineAlign="center">
                <Box paddingBlockStart="600" paddingBlockEnd="200">
                  <Text as="h1" variant="heading2xl" alignment="center">
                    🚚 Envío creado con éxito
                  </Text>
                </Box>

                <Card background="bg-surface-secondary">
                  <BlockStack gap="400" inlineAlign="center">
                    <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                      NÚMERO DE TRACKING MRW
                    </Text>
                    <Text as="h2" variant="heading3xl" alignment="center" fontWeight="bold">
                      {actionData.trackingNumber}
                    </Text>
                  </BlockStack>
                </Card>

                <Divider />

                <InlineStack gap="400" align="center">
                  <Button variant="primary" size="large" onClick={() => navigate("/app/shipments")}>
                    📋 Ver envíos
                  </Button>
                  <Button size="large" onClick={() => window.location.reload()}>
                    ➕ Crear otro envío
                  </Button>
                  <Button onClick={() => navigate("/app/shipments/labels")}>
                    🏷️ Imprimir etiqueta
                  </Button>
                </InlineStack>

                <Box paddingBlockEnd="400" />
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

  if (loaderError === "noCredentials") {
    return (
      <Page title="Crear envío manual" backAction={{ url: "/app/shipments" }}>
        <Layout>
          <Layout.Section>
            <Banner
              title="Conecta tu cuenta MRW primero"
              tone="warning"
              action={{ content: "Conectar MRW", url: "/app/settings/mrw" }}
            >
              Necesitas verificar tus credenciales MRW antes de crear envíos.
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const serviceOptions = [
    { name: "MRW Express (entrega 24-48h)", code: "0800", price: "5,90€", delivery: "Mañana" },
    { name: "MRW Urgente 10", code: "0000", price: "12,50€", delivery: "Antes de las 10:00" },
    { name: "MRW Urgente 19", code: "0010", price: "8,90€", delivery: "Antes de las 19:00" },
    { name: "MRW Economy", code: "0300", price: "4,50€", delivery: "48-72h" },
  ];

  return (
    <Page
      title="Crear envío manual"
      subtitle="Complete los detalles para generar la etiqueta de envío"
      backAction={{ url: "/app/shipments" }}
    >
      <Layout>
        <fetcher.Form method="post">
          <input type="hidden" name="serviceCode" value={serviceCode} />

          {/* ── LEFT COLUMN ── */}
          <Layout.Section>
            {/* Seleccionar pedido (optional search) */}
            <Box paddingBlockEnd="400">
              <Card>
                <BlockStack gap="400">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm">🛒</Text>
                    <Text as="h2" variant="headingMd">Seleccionar pedido</Text>
                  </InlineStack>
                  <TextField
                    label=""
                    labelHidden
                    placeholder="Buscar por ID, cliente o email..."
                    prefix="🔍"
                    value={reference}
                    name="reference"
                    onChange={setReference}
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            </Box>

            {/* Servicio de envío */}
            <Card>
              <BlockStack gap="400">
                <InlineStack gap="200" blockAlign="center">
                  <Text as="span" variant="bodySm">🚛</Text>
                  <Text as="h2" variant="headingMd">Servicio de envío</Text>
                </InlineStack>

                {serviceOptions.map((svc) => (
                  <Box
                    key={svc.code}
                    padding="400"
                    borderRadius="200"
                    background={serviceCode === svc.code ? "bg-surface-info" : "bg-surface-secondary"}
                    borderColor={serviceCode === svc.code ? "border-info" : "border"}
                    borderWidth="025"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <RadioButton
                        label={svc.name}
                        helpText={`Entrega estimada: ${svc.delivery}`}
                        checked={serviceCode === svc.code}
                        id={`svc-${svc.code}`}
                        name="serviceRadio"
                        onChange={() => setServiceCode(svc.code)}
                      />
                      <Text as="span" variant="headingSm" fontWeight="bold">
                        {svc.price}
                      </Text>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* ── RIGHT COLUMN ── */}
          <Layout.Section variant="oneThird">
            {/* Peso y dimensiones */}
            <Card>
              <BlockStack gap="400">
                <InlineStack gap="200" blockAlign="center">
                  <Text as="span" variant="bodySm">📦</Text>
                  <Text as="h2" variant="headingMd">Peso y dimensiones</Text>
                </InlineStack>

                <TextField
                  label="Peso total"
                  name="weight"
                  type="number"
                  value={weight}
                  onChange={setWeight}
                  autoComplete="off"
                  suffix="kg"
                  min={0.1}
                  step={0.1}
                />

                <InlineGrid columns={3} gap="300">
                  <TextField
                    label="Largo (cm)"
                    type="number"
                    value={length}
                    onChange={setLength}
                    autoComplete="off"
                  />
                  <TextField
                    label="Ancho (cm)"
                    type="number"
                    value={width}
                    onChange={setWidth}
                    autoComplete="off"
                  />
                  <TextField
                    label="Alto (cm)"
                    type="number"
                    value={height}
                    onChange={setHeight}
                    autoComplete="off"
                  />
                </InlineGrid>

                <Checkbox
                  label="Usar valores por defecto de configuración"
                  checked={useDefaults}
                  onChange={setUseDefaults}
                />
              </BlockStack>
            </Card>

            {/* Dirección de destino */}
            <Box paddingBlockStart="400">
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" variant="bodySm">📍</Text>
                      <Text as="h2" variant="headingMd">Dirección de destino</Text>
                    </InlineStack>
                    <Button variant="plain" size="micro">Editar</Button>
                  </InlineStack>

                  <FormLayout>
                    <TextField
                      label="NOMBRE COMPLETO"
                      name="recipientName"
                      value={recipientName}
                      onChange={setRecipientName}
                      autoComplete="off"
                      requiredIndicator
                    />
                    <TextField
                      label="DIRECCIÓN"
                      name="recipientAddress"
                      value={recipientAddress}
                      onChange={setRecipientAddress}
                      autoComplete="off"
                      requiredIndicator
                    />
                    <FormLayout.Group>
                      <TextField
                        label="CIUDAD"
                        name="recipientCity"
                        value={recipientCity}
                        onChange={setRecipientCity}
                        autoComplete="off"
                        requiredIndicator
                      />
                      <TextField
                        label="CÓDIGO POSTAL"
                        name="recipientPostalCode"
                        value={recipientPostalCode}
                        onChange={setRecipientPostalCode}
                        autoComplete="off"
                        requiredIndicator
                        maxLength={5}
                      />
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <TextField
                        label="PROVINCIA"
                        name="recipientProvince"
                        value={recipientProvince}
                        onChange={setRecipientProvince}
                        autoComplete="off"
                      />
                      <TextField
                        label="TELÉFONO"
                        name="recipientPhone"
                        value={recipientPhone}
                        onChange={setRecipientPhone}
                        autoComplete="off"
                        requiredIndicator
                        type="tel"
                        placeholder="+34 600 000 000"
                      />
                    </FormLayout.Group>
                  </FormLayout>
                </BlockStack>
              </Card>
            </Box>

            {/* Notes */}
            <Box paddingBlockStart="400">
              <Card>
                <BlockStack gap="300">
                  <Text as="h3" variant="headingSm">📝 Observaciones (opcional)</Text>
                  <TextField
                    label=""
                    labelHidden
                    name="notes"
                    value={notes}
                    onChange={setNotes}
                    autoComplete="off"
                    multiline={2}
                    placeholder="Dejar en portería si no está"
                  />
                  <input type="hidden" name="packages" value={packages} />
                </BlockStack>
              </Card>
            </Box>
          </Layout.Section>

          {/* Footer action */}
          <Layout.Section>
            {actionData?.error && (
              <Box paddingBlockEnd="400">
                <Banner tone="critical">
                  <Text as="p" variant="bodyMd">{actionData.error}</Text>
                </Banner>
              </Box>
            )}

            <InlineStack gap="300" align="end">
              <Button onClick={() => navigate("/app/shipments")}>Cancelar</Button>
              <Button variant="primary" submit loading={isLoading} size="large">
                ▶ Crear envío en MRW
              </Button>
            </InlineStack>
          </Layout.Section>
        </fetcher.Form>
      </Layout>
    </Page>
  );
}
