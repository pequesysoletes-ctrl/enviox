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
  DropZone,
  Thumbnail,
  Banner,
  Divider,
  ColorPicker,
  Box,
  Checkbox,
  hsbToHex,
  hexToHsb,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState, useCallback } from "react";

/**
 * Branded Tracking Configuration
 * Allows merchants to customize their public tracking page with:
 * - Store logo
 * - Custom colors (primary, secondary, accent)
 * - Store name display
 * - Custom footer text
 * - Show/hide "Powered by Enviox" badge
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const config = await prisma.trackingConfig.findUnique({ where: { shop } });

  // Get shop info for defaults
  return json({
    config: config || {
      primaryColor: "#E30613",
      secondaryColor: "#1A1A2E",
      accentColor: "#10B981",
      showStoreName: true,
      storeName: shop.replace(".myshopify.com", ""),
      showPoweredBy: true,
      logoUrl: null,
      footerText: null,
      customCss: null,
    },
    trackingUrl: `https://enviox.es/tracking`,
    shop,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  const data = {
    primaryColor: formData.get("primaryColor")?.toString() || "#E30613",
    secondaryColor: formData.get("secondaryColor")?.toString() || "#1A1A2E",
    accentColor: formData.get("accentColor")?.toString() || "#10B981",
    showStoreName: formData.get("showStoreName") === "true",
    storeName: formData.get("storeName")?.toString() || "",
    showPoweredBy: formData.get("showPoweredBy") === "true",
    footerText: formData.get("footerText")?.toString() || null,
    customCss: formData.get("customCss")?.toString() || null,
    logoUrl: formData.get("logoUrl")?.toString() || null,
  };

  await prisma.trackingConfig.upsert({
    where: { shop },
    create: { shop, ...data },
    update: data,
  });

  return json({ success: true, message: "Configuración de tracking guardada" });
};

export default function BrandedTrackingPage() {
  const { config, trackingUrl, shop } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    primaryColor: config.primaryColor || "#E30613",
    secondaryColor: config.secondaryColor || "#1A1A2E",
    accentColor: config.accentColor || "#10B981",
    showStoreName: config.showStoreName,
    storeName: config.storeName || "",
    showPoweredBy: config.showPoweredBy,
    footerText: config.footerText || "",
    logoUrl: config.logoUrl || "",
    customCss: config.customCss || "",
  });

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    submit(formData, { method: "POST" });
  };

  return (
    <Page
      title="Tracking personalizado"
      subtitle="Personaliza la página de seguimiento con tu marca"
      backAction={{ content: "Configuración", onAction: () => navigate("/app/settings") }}
      primaryAction={{ content: "Guardar cambios", onAction: handleSave }}
    >
      <Layout>
        {actionData?.success && (
          <Layout.Section>
            <Banner tone="success">
              <p>{actionData.message}</p>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <InlineStack gap="400" align="start">
            {/* Config form */}
            <Box minWidth="400px">
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Identidad de marca</Text>

                    <TextField
                      label="Nombre de tu tienda"
                      value={form.storeName}
                      onChange={(v) => setForm({ ...form, storeName: v })}
                      autoComplete="off"
                      helpText="Se muestra en la cabecera de la página de tracking"
                    />

                    <TextField
                      label="URL del logo"
                      value={form.logoUrl}
                      onChange={(v) => setForm({ ...form, logoUrl: v })}
                      autoComplete="off"
                      placeholder="https://tu-tienda.com/logo.png"
                      helpText="Logo de tu tienda (recomendado: 200x60px, fondo transparente)"
                    />

                    <Checkbox
                      label="Mostrar nombre de la tienda"
                      checked={form.showStoreName}
                      onChange={(v) => setForm({ ...form, showStoreName: v })}
                    />

                    <Checkbox
                      label="Mostrar 'Powered by Enviox'"
                      checked={form.showPoweredBy}
                      onChange={(v) => setForm({ ...form, showPoweredBy: v })}
                    />
                  </BlockStack>
                </Card>

                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Colores</Text>

                    <InlineStack gap="400">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm">Color principal</Text>
                        <InlineStack gap="200" blockAlign="center">
                          <Box
                            background="bg-fill-critical"
                            borderRadius="100"
                            minHeight="32px"
                            minWidth="32px"
                          >
                            <div style={{
                              width: 32, height: 32, borderRadius: 4,
                              backgroundColor: form.primaryColor,
                              border: "2px solid #ddd"
                            }} />
                          </Box>
                          <TextField
                            label=""
                            labelHidden
                            value={form.primaryColor}
                            onChange={(v) => setForm({ ...form, primaryColor: v })}
                            autoComplete="off"
                            maxLength={7}
                          />
                        </InlineStack>
                      </BlockStack>

                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm">Color secundario</Text>
                        <InlineStack gap="200" blockAlign="center">
                          <div style={{
                            width: 32, height: 32, borderRadius: 4,
                            backgroundColor: form.secondaryColor,
                            border: "2px solid #ddd"
                          }} />
                          <TextField
                            label=""
                            labelHidden
                            value={form.secondaryColor}
                            onChange={(v) => setForm({ ...form, secondaryColor: v })}
                            autoComplete="off"
                            maxLength={7}
                          />
                        </InlineStack>
                      </BlockStack>

                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm">Color acento</Text>
                        <InlineStack gap="200" blockAlign="center">
                          <div style={{
                            width: 32, height: 32, borderRadius: 4,
                            backgroundColor: form.accentColor,
                            border: "2px solid #ddd"
                          }} />
                          <TextField
                            label=""
                            labelHidden
                            value={form.accentColor}
                            onChange={(v) => setForm({ ...form, accentColor: v })}
                            autoComplete="off"
                            maxLength={7}
                          />
                        </InlineStack>
                      </BlockStack>
                    </InlineStack>

                    <Box paddingBlockStart="200">
                      <InlineStack gap="200">
                        <Badge>Presets:</Badge>
                        <Button variant="plain" size="slim" onClick={() => setForm({ ...form, primaryColor: "#E30613", secondaryColor: "#1A1A2E", accentColor: "#10B981" })}>MRW Clásico</Button>
                        <Button variant="plain" size="slim" onClick={() => setForm({ ...form, primaryColor: "#000000", secondaryColor: "#111111", accentColor: "#FFFFFF" })}>Minimalista</Button>
                        <Button variant="plain" size="slim" onClick={() => setForm({ ...form, primaryColor: "#4F46E5", secondaryColor: "#1E1B4B", accentColor: "#818CF8" })}>Violeta Premium</Button>
                        <Button variant="plain" size="slim" onClick={() => setForm({ ...form, primaryColor: "#059669", secondaryColor: "#064E3B", accentColor: "#34D399" })}>Eco Green</Button>
                      </InlineStack>
                    </Box>
                  </BlockStack>
                </Card>

                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">Personalización avanzada</Text>

                    <TextField
                      label="Texto del footer"
                      value={form.footerText}
                      onChange={(v) => setForm({ ...form, footerText: v })}
                      autoComplete="off"
                      placeholder="© 2026 Tu Tienda · Todos los derechos reservados"
                      helpText="Se muestra en el pie de la página de tracking"
                    />

                    <TextField
                      label="CSS personalizado"
                      value={form.customCss}
                      onChange={(v) => setForm({ ...form, customCss: v })}
                      autoComplete="off"
                      multiline={4}
                      placeholder=".tracking-header { border-radius: 12px; }"
                      helpText="CSS adicional para ajustar estilos (avanzado)"
                    />
                  </BlockStack>
                </Card>
              </BlockStack>
            </Box>

            {/* Live preview */}
            <Box minWidth="380px">
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">Vista previa</Text>
                  <Box
                    borderRadius="200"
                    padding="0"
                    borderWidth="025"
                    borderColor="border"
                  >
                    {/* Preview header */}
                    <div style={{
                      background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                      padding: "20px 24px",
                      borderRadius: "8px 8px 0 0",
                      color: "white",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {form.logoUrl ? (
                          <img src={form.logoUrl} alt="Logo" style={{ height: 32, maxWidth: 120, objectFit: "contain" }} />
                        ) : (
                          <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>
                            {form.storeName?.charAt(0) || "E"}
                          </div>
                        )}
                        {form.showStoreName && (
                          <span style={{ fontWeight: 700, fontSize: 16 }}>{form.storeName || "Tu Tienda"}</span>
                        )}
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>Seguimiento de envío</div>
                        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>CE-0123456789</div>
                      </div>
                    </div>

                    {/* Preview body */}
                    <div style={{ padding: "16px 24px" }}>
                      {/* Status */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: form.accentColor }} />
                        <span style={{ fontWeight: 600, color: form.accentColor }}>En tránsito</span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ background: "#f0f0f0", borderRadius: 8, height: 6, marginBottom: 20 }}>
                        <div style={{ background: form.accentColor, borderRadius: 8, height: 6, width: "60%" }} />
                      </div>

                      {/* Timeline items */}
                      {["En tránsito — Madrid", "Recogido — Barcelona", "Registrado"].map((event, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                          <div style={{
                            width: 8, height: 8, borderRadius: "50%", marginTop: 6,
                            background: i === 0 ? form.accentColor : "#ddd",
                          }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#1a1a1a" : "#888" }}>{event}</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>20 Feb 2026 · {14 - i * 3}:00</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Preview footer */}
                    <div style={{
                      padding: "12px 24px",
                      borderTop: "1px solid #eee",
                      fontSize: 11,
                      color: "#999",
                      textAlign: "center",
                    }}>
                      {form.footerText || (form.showPoweredBy ? "Powered by Enviox · Correos Express Pro" : "")}
                    </div>
                  </Box>

                  <Banner tone="info">
                    <p>
                      URL de tracking: <strong>{trackingUrl}?n=TRACKING</strong>
                      <br />
                      Comparte este enlace con tus clientes. Se mostrará con tu marca.
                    </p>
                  </Banner>
                </BlockStack>
              </Card>
            </Box>
          </InlineStack>
        </Layout.Section>

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
