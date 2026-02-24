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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState } from "react";

/**
 * Pickup Points Configuration & Management
 * 
 * Allows merchants to:
 * 1. Enable/disable pickup point option in their store
 * 2. Configure the pickup point selector widget
 * 3. View and manage MRW pickup point network
 * 4. Test pickup point search
 * 
 * In production, this integrates with:
 * - MRW API: GET /puntos-servicio to search points by CP/city
 * - Shopify Carrier Service API: to show pickup points in checkout
 * 
 * The checkout integration requires:
 * - Carrier Service with type: "pickup_point"
 * - Widget JS injected in checkout via Shopify Functions
 */

// Mock pickup points for development (real ones come from MRW API)
const MOCK_PICKUP_POINTS = [
  {
    id: "MRW-28001-01",
    name: "MRW Madrid Centro",
    address: "Calle Gran Vía 42",
    city: "Madrid",
    zip: "28013",
    province: "Madrid",
    lat: 40.4200,
    lng: -3.7025,
    schedule: "L-V: 9:00-20:00 / S: 9:00-14:00",
    phone: "914 567 890",
    services: ["Entrega", "Recogida", "Devoluciones"],
    distance: 0.3,
  },
  {
    id: "MRW-28001-02",
    name: "MRW Sol",
    address: "Puerta del Sol 15",
    city: "Madrid",
    zip: "28013",
    province: "Madrid",
    lat: 40.4169,
    lng: -3.7035,
    schedule: "L-V: 8:30-20:30 / S: 9:00-14:00",
    phone: "915 678 901",
    services: ["Entrega", "Recogida"],
    distance: 0.5,
  },
  {
    id: "MRW-28001-03",
    name: "MRW Callao",
    address: "Plaza del Callao 1",
    city: "Madrid",
    zip: "28013",
    province: "Madrid",
    lat: 40.4197,
    lng: -3.7061,
    schedule: "L-V: 9:00-19:30 / S: 10:00-14:00",
    phone: "913 456 789",
    services: ["Entrega", "Recogida", "Devoluciones"],
    distance: 0.7,
  },
  {
    id: "MRW-08001-01",
    name: "MRW Barcelona Centre",
    address: "Passeig de Gràcia 28",
    city: "Barcelona",
    zip: "08007",
    province: "Barcelona",
    lat: 41.3933,
    lng: 2.1632,
    schedule: "L-V: 9:00-20:00 / S: 9:00-14:00",
    phone: "934 567 890",
    services: ["Entrega", "Recogida", "Devoluciones"],
    distance: 0.2,
  },
  {
    id: "MRW-46001-01",
    name: "MRW Valencia Centro",
    address: "Calle Colón 15",
    city: "Valencia",
    zip: "46004",
    province: "Valencia",
    lat: 39.4699,
    lng: -0.3763,
    schedule: "L-V: 9:00-19:30 / S: 9:00-13:30",
    phone: "963 456 789",
    services: ["Entrega", "Recogida"],
    distance: 0.4,
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const config = await prisma.shippingConfig.findUnique({ where: { shop } });

  return json({
    config,
    shop,
    pickupPointsEnabled: false, // Will come from config when Carrier Service is active
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "search") {
    const query = formData.get("query")?.toString() || "";
    
    // In production: call MRW API to search pickup points
    // For now: filter mock data
    const results = MOCK_PICKUP_POINTS.filter(
      (p) =>
        p.zip.startsWith(query) ||
        p.city.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase())
    );

    return json({ success: true, points: results, query });
  }

  if (intent === "togglePickupPoints") {
    // In production: register/unregister Carrier Service with Shopify
    return json({ success: true, message: "Configuración guardada. Se requiere integración con Shopify Carrier Service API." });
  }

  return json({ success: false });
};

export default function PickupPointsPage() {
  const { pickupPointsEnabled } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [enabled, setEnabled] = useState(pickupPointsEnabled);

  const handleSearch = () => {
    const formData = new FormData();
    formData.append("intent", "search");
    formData.append("query", searchQuery);
    submit(formData, { method: "POST" });
  };

  const points = actionData?.points || [];

  return (
    <Page
      title="Puntos de recogida MRW"
      subtitle="Permite a tus clientes recoger sus pedidos en puntos MRW cercanos"
      backAction={{ content: "Configuración", onAction: () => navigate("/app/settings") }}
    >
      <Layout>
        {/* Enable/disable */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h2" variant="headingMd">📍 Puntos de recogida en el checkout</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Cuando está activado, los clientes pueden elegir recoger su pedido en un punto MRW cercano
                    directamente en el checkout de Shopify.
                  </Text>
                </BlockStack>
                <Button
                  variant={enabled ? "primary" : "secondary"}
                  onClick={() => {
                    setEnabled(!enabled);
                    const formData = new FormData();
                    formData.append("intent", "togglePickupPoints");
                    submit(formData, { method: "POST" });
                  }}
                >
                  {enabled ? "✅ Activado" : "Activar"}
                </Button>
              </InlineStack>

              <Banner tone="info">
                <p>
                  <strong>Requisito:</strong> Esta funcionalidad requiere registrar un{" "}
                  <strong>Carrier Service</strong> en Shopify con soporte de{" "}
                  <strong>pickup points</strong>. Se activará automáticamente cuando esté disponible
                  la API de MRW para consultar puntos de servicio.
                </p>
              </Banner>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* How it works */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">💡 ¿Cómo funciona?</Text>
              <InlineStack gap="400" wrap>
                {[
                  { step: "1", title: "Checkout", desc: "El cliente elige 'Recoger en punto MRW' en el checkout", icon: "🛒" },
                  { step: "2", title: "Buscar", desc: "Introduce su CP y ve los puntos MRW más cercanos", icon: "🔍" },
                  { step: "3", title: "Elegir", desc: "Selecciona su punto favorito con horario y mapa", icon: "📍" },
                  { step: "4", title: "Recoger", desc: "Recoge el paquete en el punto MRW con su DNI", icon: "📦" },
                ].map((s) => (
                  <Box key={s.step} padding="400" background="bg-surface-secondary" borderRadius="200" minWidth="200px">
                    <BlockStack gap="200" inlineAlign="center">
                      <div style={{ fontSize: 32 }}>{s.icon}</div>
                      <Text as="p" variant="bodyMd" fontWeight="bold" alignment="center">{s.title}</Text>
                      <Text as="p" variant="bodySm" tone="subdued" alignment="center">{s.desc}</Text>
                    </BlockStack>
                  </Box>
                ))}
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Search test */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">🔍 Buscar puntos MRW</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Prueba la búsqueda de puntos. Introduce un código postal o ciudad.
              </Text>

              <InlineStack gap="300">
                <div style={{ flex: 1 }}>
                  <TextField
                    label=""
                    labelHidden
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Código postal o ciudad... (28013, Madrid, Barcelona...)"
                    autoComplete="off"
                    onKeyPress={(e: any) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button variant="primary" onClick={handleSearch}>Buscar</Button>
              </InlineStack>

              {/* Results */}
              {points.length > 0 && (
                <BlockStack gap="300">
                  <Text as="p" variant="bodySm" tone="subdued">
                    {points.length} punto{points.length !== 1 ? "s" : ""} encontrado{points.length !== 1 ? "s" : ""} para "{actionData?.query}"
                  </Text>
                  {points.map((point: any) => (
                    <Box key={point.id} padding="300" background="bg-surface-secondary" borderRadius="200">
                      <InlineStack align="space-between" blockAlign="start">
                        <BlockStack gap="100">
                          <InlineStack gap="200" blockAlign="center">
                            <Text as="span" variant="bodyMd" fontWeight="bold">{point.name}</Text>
                            <Badge tone="success">{point.distance} km</Badge>
                          </InlineStack>
                          <Text as="span" variant="bodySm">📍 {point.address}, {point.city} {point.zip}</Text>
                          <Text as="span" variant="bodySm" tone="subdued">🕐 {point.schedule}</Text>
                          <Text as="span" variant="bodySm" tone="subdued">📞 {point.phone}</Text>
                          <InlineStack gap="100">
                            {point.services.map((svc: string) => (
                              <Badge key={svc} tone="info">{svc}</Badge>
                            ))}
                          </InlineStack>
                        </BlockStack>
                        <Button variant="plain" size="slim" url={`https://maps.google.com/?q=${point.lat},${point.lng}`} target="_blank">
                          🗺️ Mapa
                        </Button>
                      </InlineStack>
                    </Box>
                  ))}
                </BlockStack>
              )}

              {actionData?.success && points.length === 0 && (
                <Banner tone="warning">
                  <p>No se encontraron puntos MRW para "{actionData?.query}". Prueba con otro código postal.</p>
                </Banner>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Stats */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">📊 Red MRW</Text>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <BlockStack gap="050" inlineAlign="center">
                  <Text as="span" variant="headingXl" fontWeight="bold">+1.200</Text>
                  <Text as="span" variant="bodySm" tone="subdued">Puntos de servicio</Text>
                </BlockStack>
              </Box>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <BlockStack gap="050" inlineAlign="center">
                  <Text as="span" variant="headingXl" fontWeight="bold">50</Text>
                  <Text as="span" variant="bodySm" tone="subdued">Provincias cubiertas</Text>
                </BlockStack>
              </Box>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <BlockStack gap="050" inlineAlign="center">
                  <Text as="span" variant="headingXl" fontWeight="bold">24/48h</Text>
                  <Text as="span" variant="bodySm" tone="subdued">Disponible en punto</Text>
                </BlockStack>
              </Box>
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
