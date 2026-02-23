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
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { createShipment as mrwCreateShipment, type MrwAuth, type ShipmentData } from "../services/correos.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const credentials = await prisma.mrwCredentials.findUnique({
    where: { shop: session.shop },
  });

  if (!credentials?.verified) {
    return json({ error: "noCredentials" });
  }

  return json({ error: null });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  const credentials = await prisma.mrwCredentials.findUnique({
    where: { shop },
  });

  if (!credentials?.verified) {
    return json({ error: "Credenciales DHL no configuradas" }, { status: 400 });
  }

  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const pickupAddress = formData.get("pickupAddress") as string;
  const pickupCity = formData.get("pickupCity") as string;
  const pickupZip = formData.get("pickupZip") as string;
  const pickupProvince = formData.get("pickupProvince") as string;
  const reason = formData.get("reason") as string;
  const notes = formData.get("notes") as string;
  const orderRef = formData.get("orderRef") as string;
  const returnMethod = formData.get("returnMethod") as string;

  if (!customerName || !pickupAddress || !pickupCity || !pickupZip || !customerPhone) {
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
      nombre: customerName,
      via: pickupAddress,
      codigoPostal: pickupZip,
      poblacion: pickupCity,
      provincia: pickupProvince,
      telefono: customerPhone,
      referencia: `DEV-${orderRef || Date.now()}`,
      codigoServicio: "0800",
      bultos: 1,
      peso: 2,
      observaciones: `DEVOLUCIÓN (${returnMethod === "pickup" ? "Recogida domicilio" : "Etiqueta"}): ${reason || "Sin motivo"}. ${notes || ""}`.trim(),
    };

    const result = await mrwCreateShipment(auth, shipmentData);

    if (!result.success) {
      return json({ error: result.error || "Error al crear devolución" }, { status: 500 });
    }

    await prisma.returnShipment.create({
      data: {
        shop,
        shopifyOrderName: orderRef || `Dev. manual ${new Date().toLocaleDateString("es-ES")}`,
        customerName,
        customerPhone,
        pickupAddress,
        pickupCity,
        pickupZip,
        pickupProvince,
        correosTrackingNumber: result.trackingNumber || null,
        reason: reason || "",
        status: "PENDING",
      },
    });

    return json({
      success: true,
      trackingNumber: result.trackingNumber,
      message: `✅ Devolución creada — Tracking: ${result.trackingNumber}`,
    });
  } catch (error: any) {
    return json({ error: `Error: ${error.message}` }, { status: 500 });
  }
};

export default function NewReturn() {
  const { error: loaderError } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const isLoading = fetcher.state !== "idle";
  const actionData = fetcher.data;

  const [orderRef, setOrderRef] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [pickupZip, setPickupZip] = useState("");
  const [pickupProvince, setPickupProvince] = useState("");
  const [useOriginalAddress, setUseOriginalAddress] = useState(true);
  const [returnMethod, setReturnMethod] = useState("label");

  // Success state
  if (actionData?.success) {
    return (
      <Page title="Devolución creada" backAction={{ url: "/app/returns" }}>
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="600" inlineAlign="center">
                <Box paddingBlockStart="600" paddingBlockEnd="200">
                  <Text as="h1" variant="heading2xl" alignment="center">
                    ↩️ Devolución creada con éxito
                  </Text>
                </Box>

                <Card background="bg-surface-secondary">
                  <BlockStack gap="400" inlineAlign="center">
                    <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                      TRACKING DE DEVOLUCIÓN MRW
                    </Text>
                    <Text as="h2" variant="heading3xl" alignment="center" fontWeight="bold">
                      {actionData.trackingNumber}
                    </Text>
                  </BlockStack>
                </Card>

                <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                  {returnMethod === "pickup"
                    ? "MRW realizará la recogida en la dirección del cliente."
                    : "El cliente puede llevar el paquete a cualquier oficina Correos con la etiqueta."}
                </Text>

                <Divider />

                <InlineStack gap="400" align="center">
                  <Button variant="primary" size="large" onClick={() => navigate("/app/returns")}>
                    📋 Ver devoluciones
                  </Button>
                  <Button size="large" onClick={() => window.location.reload()}>
                    ➕ Crear otra devolución
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
      <Page title="Crear devolución" backAction={{ url: "/app/returns" }}>
        <Layout>
          <Layout.Section>
            <Banner
              title="Conecta tu cuenta DHL primero"
              tone="warning"
              action={{ content: "Conectar DHL", url: "/app/settings/mrw" }}
            >
              Necesitas verificar tus Credenciales DHL antes de crear devoluciones.
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Crear devolución" backAction={{ url: "/app/returns" }}>
      <Layout>
        <Layout.Section>
          <fetcher.Form method="post">
            <input type="hidden" name="returnMethod" value={returnMethod} />
            <BlockStack gap="500">
              {/* Card 1: Seleccionar pedido */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">1. Seleccionar pedido</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Busque el pedido que desea gestionar
                  </Text>
                  <TextField
                    label="Referencia del pedido"
                    name="orderRef"
                    value={orderRef}
                    onChange={setOrderRef}
                    autoComplete="off"
                    placeholder="#1234"
                    prefix="🔍"
                  />
                </BlockStack>
              </Card>

              {/* Card 2: Motivo */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">2. Motivo de la devolución</Text>
                  <FormLayout>
                    <Select
                      label="Razón del retorno"
                      name="reason"
                      value={reason}
                      onChange={setReason}
                      options={[
                        { label: "Seleccionar motivo", value: "" },
                        { label: "Producto defectuoso", value: "Producto defectuoso" },
                        { label: "Talla incorrecta", value: "Talla incorrecta" },
                        { label: "No corresponde con la descripción", value: "No corresponde con la descripción" },
                        { label: "Cambio de opinión", value: "Cambio de opinión" },
                        { label: "Otro", value: "Otro" },
                      ]}
                    />
                    <TextField
                      label="Notas adicionales (opcional)"
                      name="notes"
                      value={notes}
                      onChange={setNotes}
                      autoComplete="off"
                      multiline={3}
                      placeholder="Escriba aquí cualquier detalle relevante..."
                    />
                  </FormLayout>
                </BlockStack>
              </Card>

              {/* Card 3: Dirección de recogida */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingMd">3. Dirección de recogida</Text>
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" variant="bodySm" tone="subdued">
                        Usar dirección original
                      </Text>
                      <Button
                        variant={useOriginalAddress ? "primary" : "secondary"}
                        size="micro"
                        onClick={() => setUseOriginalAddress(!useOriginalAddress)}
                      >
                        {useOriginalAddress ? "ON" : "OFF"}
                      </Button>
                    </InlineStack>
                  </InlineStack>

                  <FormLayout>
                    <TextField
                      label="NOMBRE COMPLETO"
                      name="customerName"
                      value={customerName}
                      onChange={setCustomerName}
                      autoComplete="off"
                      requiredIndicator
                    />
                    <TextField
                      label="DIRECCIÓN"
                      name="pickupAddress"
                      value={pickupAddress}
                      onChange={setPickupAddress}
                      autoComplete="off"
                      requiredIndicator
                    />
                    <FormLayout.Group>
                      <TextField
                        label="CIUDAD"
                        name="pickupCity"
                        value={pickupCity}
                        onChange={setPickupCity}
                        autoComplete="off"
                        requiredIndicator
                      />
                      <TextField
                        label="CÓDIGO POSTAL"
                        name="pickupZip"
                        value={pickupZip}
                        onChange={setPickupZip}
                        autoComplete="off"
                        requiredIndicator
                        maxLength={5}
                      />
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <TextField
                        label="PROVINCIA"
                        name="pickupProvince"
                        value={pickupProvince}
                        onChange={setPickupProvince}
                        autoComplete="off"
                      />
                      <TextField
                        label="TELÉFONO"
                        name="customerPhone"
                        value={customerPhone}
                        onChange={setCustomerPhone}
                        autoComplete="off"
                        requiredIndicator
                        type="tel"
                      />
                    </FormLayout.Group>
                  </FormLayout>
                </BlockStack>
              </Card>

              {/* Card 4: Método de devolución */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">4. Método de devolución</Text>
                  <Box
                    padding="400"
                    borderRadius="200"
                    background={returnMethod === "label" ? "bg-surface-info" : "bg-surface-secondary"}
                    borderColor={returnMethod === "label" ? "border-info" : "border"}
                    borderWidth="025"
                  >
                    <RadioButton
                      label="Generar etiqueta de devolución MRW (el cliente lleva a oficina Correos)"
                      helpText="Más rápido y flexible para el cliente"
                      checked={returnMethod === "label"}
                      id="method-label"
                      name="returnMethodRadio"
                      onChange={() => setReturnMethod("label")}
                    />
                  </Box>
                  <Box
                    padding="400"
                    borderRadius="200"
                    background={returnMethod === "pickup" ? "bg-surface-info" : "bg-surface-secondary"}
                    borderColor={returnMethod === "pickup" ? "border-info" : "border"}
                    borderWidth="025"
                  >
                    <RadioButton
                      label="Solicitar recogida en domicilio"
                      helpText="Un mensajero pasará por la dirección indicada"
                      checked={returnMethod === "pickup"}
                      id="method-pickup"
                      name="returnMethodRadio"
                      onChange={() => setReturnMethod("pickup")}
                    />
                  </Box>
                </BlockStack>
              </Card>

              {actionData?.error && (
                <Banner tone="critical">
                  <Text as="p" variant="bodyMd">{actionData.error}</Text>
                </Banner>
              )}

              {/* Footer actions */}
              <InlineStack gap="300" align="end">
                <Button onClick={() => navigate("/app/returns")}>Cancelar</Button>
                <Button variant="primary" submit loading={isLoading} size="large">
                  📦 Generar etiqueta de devolución
                </Button>
              </InlineStack>
            </BlockStack>
          </fetcher.Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
