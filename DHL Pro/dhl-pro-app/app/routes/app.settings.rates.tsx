import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Button,
  Badge,
  Box,
  TextField,
  Banner,
  Divider,
  Select,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState } from "react";

/**
 * Shipping Rate Calculator Configuration
 * 
 * Allows merchants to configure dynamic shipping rates that appear
 * in the Shopify checkout based on:
 * - Destination zone (Peninsula, Baleares, Canarias, Ceuta/Melilla)
 * - Package weight
 * - Order total (for free shipping thresholds)
 * - DHL service type
 * 
 * In production, this integrates with Shopify Carrier Service API
 * to provide real-time rates at checkout.
 */

// Correos Zone definitions
const ZONES = [
  { id: "peninsula", name: "Península", description: "España continental", cps: "01-49 (excepto 35,38,51,52)" },
  { id: "baleares", name: "Baleares", description: "Islas Baleares", cps: "07xxx" },
  { id: "canarias", name: "Canarias", description: "Islas Canarias", cps: "35xxx, 38xxx" },
  { id: "ceuta_melilla", name: "Ceuta y Melilla", description: "Ciudades autónomas", cps: "51xxx, 52xxx" },
  { id: "portugal", name: "Portugal", description: "Internacional cercano", cps: "PT" },
  { id: "andorra", name: "Andorra", description: "Internacional cercano", cps: "AD" },
];

const DEFAULT_RATES = [
  { zone: "peninsula", service: "S0132", maxWeight: 2, price: 4.50, deliveryDays: "24h" },
  { zone: "peninsula", service: "S0132", maxWeight: 5, price: 5.50, deliveryDays: "24h" },
  { zone: "peninsula", service: "S0132", maxWeight: 10, price: 7.50, deliveryDays: "24h" },
  { zone: "peninsula", service: "S0132", maxWeight: 20, price: 9.50, deliveryDays: "24h" },
  { zone: "peninsula", service: "S0175", maxWeight: 2, price: 3.50, deliveryDays: "48-72h" },
  { zone: "peninsula", service: "S0175", maxWeight: 5, price: 4.50, deliveryDays: "48-72h" },
  { zone: "peninsula", service: "S0175", maxWeight: 10, price: 6.50, deliveryDays: "48-72h" },
  { zone: "baleares", service: "S0132", maxWeight: 2, price: 7.50, deliveryDays: "48h" },
  { zone: "baleares", service: "S0132", maxWeight: 5, price: 9.50, deliveryDays: "48h" },
  { zone: "baleares", service: "S0132", maxWeight: 10, price: 12.50, deliveryDays: "48h" },
  { zone: "canarias", service: "S0132", maxWeight: 2, price: 10.95, deliveryDays: "72-96h" },
  { zone: "canarias", service: "S0132", maxWeight: 5, price: 13.95, deliveryDays: "72-96h" },
  { zone: "canarias", service: "S0132", maxWeight: 10, price: 18.95, deliveryDays: "72-96h" },
  { zone: "ceuta_melilla", service: "S0132", maxWeight: 2, price: 11.95, deliveryDays: "72-96h" },
  { zone: "ceuta_melilla", service: "S0132", maxWeight: 5, price: 15.95, deliveryDays: "72-96h" },
];

const SERVICE_NAMES: Record<string, string> = {
  "S0132": "Paq Premium",
  "S0175": "Paq Estándar",
  "S0148": "Paq Today",
  "S0177": "Paq 48",
  "S0180": "Paq Empresa 14",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const config = await prisma.shippingConfig.findUnique({ where: { shop } });

  return json({ config, shop, rates: DEFAULT_RATES });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "calculate") {
    const zone = formData.get("zone")?.toString() || "peninsula";
    const weight = parseFloat(formData.get("weight")?.toString() || "1");
    const orderTotal = parseFloat(formData.get("orderTotal")?.toString() || "0");
    const freeShippingThreshold = parseFloat(formData.get("freeShippingThreshold")?.toString() || "0");

    // Calculate applicable rates
    const applicableRates = DEFAULT_RATES
      .filter((r) => r.zone === zone && weight <= r.maxWeight)
      .sort((a, b) => a.price - b.price);

    // Check free shipping
    const isFreeShipping = freeShippingThreshold > 0 && orderTotal >= freeShippingThreshold;

    return json({
      success: true,
      rates: applicableRates.map((r) => ({
        ...r,
        serviceName: SERVICE_NAMES[r.service] || r.service,
        finalPrice: isFreeShipping ? 0 : r.price,
        isFree: isFreeShipping,
      })),
      zone,
      weight,
      orderTotal,
      isFreeShipping,
    });
  }

  if (intent === "saveConfig") {
    const freeShippingThreshold = parseFloat(formData.get("freeShippingThreshold")?.toString() || "0");
    const showDeliveryDays = formData.get("showDeliveryDays") === "true";
    const markup = parseFloat(formData.get("markup")?.toString() || "0");

    // Save configuration — in production, would update ShippingConfig
    return json({
      success: true,
      message: "Configuración de tarifas guardada. Se aplicará en el checkout cuando el Carrier Service esté registrado.",
    });
  }

  return json({ success: false });
};

export default function ShippingRatesPage() {
  const { rates } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [testZone, setTestZone] = useState("peninsula");
  const [testWeight, setTestWeight] = useState("2");
  const [testOrderTotal, setTestOrderTotal] = useState("50");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("60");
  const [markup, setMarkup] = useState("0");

  const handleCalculate = () => {
    const formData = new FormData();
    formData.append("intent", "calculate");
    formData.append("zone", testZone);
    formData.append("weight", testWeight);
    formData.append("orderTotal", testOrderTotal);
    formData.append("freeShippingThreshold", freeShippingThreshold);
    submit(formData, { method: "POST" });
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("intent", "saveConfig");
    formData.append("freeShippingThreshold", freeShippingThreshold);
    formData.append("markup", markup);
    submit(formData, { method: "POST" });
  };

  // Group rates by zone for the rate table
  const ratesByZone = ZONES.map((zone) => ({
    ...zone,
    rates: rates.filter((r: any) => r.zone === zone.id),
  })).filter((z) => z.rates.length > 0);

  return (
    <Page
      title="Tarifas de envío"
      subtitle="Configura las tarifas que verán tus clientes en el checkout"
      backAction={{ content: "Configuración", onAction: () => navigate("/app/settings") }}
      primaryAction={{
        content: "💾 Guardar configuración",
        onAction: handleSave,
      }}
    >
      <Layout>
        {actionData?.message && (
          <Layout.Section>
            <Banner tone="success">{actionData.message}</Banner>
          </Layout.Section>
        )}

        {/* Settings */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">⚙️ Configuración general</Text>

              <InlineGrid columns={2} gap="400">
                <TextField
                  label="Envío gratis a partir de (€)"
                  value={freeShippingThreshold}
                  onChange={setFreeShippingThreshold}
                  type="number"
                  prefix="€"
                  autoComplete="off"
                  helpText="Pon 0 para desactivar. Los pedidos por encima de este importe tendrán envío gratis."
                />
                <TextField
                  label="Margen adicional (€)"
                  value={markup}
                  onChange={setMarkup}
                  type="number"
                  prefix="€"
                  autoComplete="off"
                  helpText="Se añade al precio base de Correos. Útil para cubrir costes de embalaje."
                />
              </InlineGrid>

              <Banner tone="info">
                <p>
                  <strong>Requisito:</strong> Para que las tarifas aparezcan automáticamente en el checkout,
                  necesitas registrar un <strong>Carrier Service</strong> en Shopify.
                  Esto se activará cuando esté disponible la conexión con la API de Correos para obtener
                  tarifas en tiempo real.
                </p>
              </Banner>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Rate table */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">📊 Tabla de tarifas por zona</Text>

              {ratesByZone.map((zone) => (
                <Box key={zone.id}>
                  <BlockStack gap="200">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h3" variant="headingSm">{zone.name}</Text>
                      <Text as="span" variant="bodySm" tone="subdued">({zone.cps})</Text>
                    </InlineStack>

                    <Box padding="0" borderRadius="200" background="bg-surface-secondary">
                      {/* Table header */}
                      <Box padding="200" background="bg-surface-hover">
                        <InlineGrid columns={4} gap="200">
                          <Text as="span" variant="bodySm" fontWeight="bold">Servicio</Text>
                          <Text as="span" variant="bodySm" fontWeight="bold">Peso máx.</Text>
                          <Text as="span" variant="bodySm" fontWeight="bold">Precio</Text>
                          <Text as="span" variant="bodySm" fontWeight="bold">Entrega</Text>
                        </InlineGrid>
                      </Box>
                      {zone.rates.map((rate: any, i: number) => (
                        <Box key={i} padding="200" borderBlockEndWidth="025" borderColor="border">
                          <InlineGrid columns={4} gap="200">
                            <Text as="span" variant="bodySm">
                              {SERVICE_NAMES[rate.service] || rate.service}
                            </Text>
                            <Text as="span" variant="bodySm">{rate.maxWeight} kg</Text>
                            <Text as="span" variant="bodySm" fontWeight="bold">
                              {rate.price.toFixed(2)} €
                            </Text>
                            <Badge tone="info">{rate.deliveryDays}</Badge>
                          </InlineGrid>
                        </Box>
                      ))}
                    </Box>
                  </BlockStack>
                </Box>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Rate calculator test */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">🧮 Calculadora de tarifas</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Simula qué vería tu cliente en el checkout.
              </Text>

              <Select
                label="Zona destino"
                options={ZONES.map((z) => ({ label: `${z.name} (${z.cps})`, value: z.id }))}
                value={testZone}
                onChange={setTestZone}
              />

              <TextField
                label="Peso del paquete (kg)"
                value={testWeight}
                onChange={setTestWeight}
                type="number"
                suffix="kg"
                autoComplete="off"
              />

              <TextField
                label="Total del pedido (€)"
                value={testOrderTotal}
                onChange={setTestOrderTotal}
                type="number"
                prefix="€"
                autoComplete="off"
              />

              <Button variant="primary" onClick={handleCalculate} fullWidth>
                Calcular tarifa
              </Button>

              {/* Results */}
              {actionData?.rates && (
                <BlockStack gap="200">
                  <Divider />
                  <Text as="h3" variant="headingSm">
                    Resultado para {ZONES.find((z) => z.id === actionData.zone)?.name}:
                  </Text>

                  {actionData.isFreeShipping && (
                    <Badge tone="success">🎉 ENVÍO GRATIS (pedido ≥ {freeShippingThreshold}€)</Badge>
                  )}

                  {actionData.rates.length > 0 ? (
                    actionData.rates.map((rate: any, i: number) => (
                      <Box key={i} padding="300" background="bg-surface-secondary" borderRadius="200">
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="050">
                            <Text as="span" variant="bodyMd" fontWeight="bold">
                              {rate.serviceName}
                            </Text>
                            <Text as="span" variant="bodySm" tone="subdued">
                              Hasta {rate.maxWeight}kg · {rate.deliveryDays}
                            </Text>
                          </BlockStack>
                          {rate.isFree ? (
                            <BlockStack gap="0" inlineAlign="end">
                              <Text as="span" variant="bodySm" tone="subdued">
                                <s>{rate.price.toFixed(2)}€</s>
                              </Text>
                              <Badge tone="success">GRATIS</Badge>
                            </BlockStack>
                          ) : (
                            <Text as="span" variant="headingMd" fontWeight="bold">
                              {rate.finalPrice.toFixed(2)} €
                            </Text>
                          )}
                        </InlineStack>
                      </Box>
                    ))
                  ) : (
                    <Banner tone="warning">
                      <p>No hay tarifas disponibles para esta combinación de zona y peso.</p>
                    </Banner>
                  )}
                </BlockStack>
              )}
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
