// ═══════════════════════════════════════════════════════════════
// Screen 05 — Personalización del Selector
// Position, flags, colors, size, custom CSS
// ═══════════════════════════════════════════════════════════════

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  RadioButton,
  Checkbox,
  TextField,
  Button,
  Banner,
  Badge,
  Select,
  Box,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { getShop, updateSelectorConfig } from "~/models/shop.server";
import { getShopPlan, PLANS } from "~/services/billing.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);
  const plan = await getShopPlan(session.shop);

  if (!shop) {
    return json({ error: "Shop not found" });
  }

  return json({
    config: shop.selectorConfig || {},
    plan: plan.slug,
    canCustomCss: plan.limits.customCss,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);
  if (!shop) return json({ error: "Shop not found" }, { status: 404 });

  const formData = await request.formData();
  const config = {
    position: formData.get("position") as string,
    showFlags: formData.get("showFlags") === "true",
    showCountryName: formData.get("showCountryName") === "true",
    showCurrency: formData.get("showCurrency") === "true",
    showLanguage: formData.get("showLanguage") === "true",
    bgColor: formData.get("bgColor") as string,
    textColor: formData.get("textColor") as string,
    accentColor: formData.get("accentColor") as string,
    borderRadius: formData.get("borderRadius") as string,
    size: formData.get("size") as string,
    shadow: formData.get("shadow") === "true",
    customCss: (formData.get("customCss") as string) || "",
  };

  await updateSelectorConfig(shop.id, config);
  return json({ saved: true });
};

export default function SelectorPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const config = "config" in data ? (data.config as any) : {};
  const canCustomCss = "canCustomCss" in data ? data.canCustomCss : false;

  const [position, setPosition] = useState(config.position || "floating");
  const [showFlags, setShowFlags] = useState(config.showFlags !== false);
  const [showCountryName, setShowCountryName] = useState(config.showCountryName !== false);
  const [showCurrency, setShowCurrency] = useState(config.showCurrency !== false);
  const [showLanguage, setShowLanguage] = useState(config.showLanguage || false);
  const [bgColor, setBgColor] = useState(config.bgColor || "#FFFFFF");
  const [textColor, setTextColor] = useState(config.textColor || "#111827");
  const [accentColor, setAccentColor] = useState(config.accentColor || "#2563EB");
  const [borderRadius, setBorderRadius] = useState(config.borderRadius || "8px");
  const [size, setSize] = useState(config.size || "normal");
  const [shadow, setShadow] = useState(config.shadow !== false);
  const [customCss, setCustomCss] = useState(config.customCss || "");

  const handleSave = useCallback(() => {
    submit(
      {
        position,
        showFlags: String(showFlags),
        showCountryName: String(showCountryName),
        showCurrency: String(showCurrency),
        showLanguage: String(showLanguage),
        bgColor,
        textColor,
        accentColor,
        borderRadius,
        size,
        shadow: String(shadow),
        customCss,
      },
      { method: "post" }
    );
  }, [
    submit, position, showFlags, showCountryName, showCurrency,
    showLanguage, bgColor, textColor, accentColor, borderRadius,
    size, shadow, customCss,
  ]);

  return (
    <Page
      title="Personalizar Selector"
      subtitle="Configura el aspecto del selector de país en tu storefront"
      primaryAction={{
        content: "Guardar cambios",
        onAction: handleSave,
      }}
      secondaryActions={[
        { content: "Vista previa", url: "/app/preview" },
      ]}
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <BlockStack gap="500">
        {actionData && "saved" in actionData && (
          <Banner tone="success" onDismiss={() => {}}>
            <p>Configuración del selector guardada.</p>
          </Banner>
        )}

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Position */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Posición del selector
                  </Text>
                  <BlockStack gap="200">
                    <RadioButton
                      label="Flotante (esquina inferior)"
                      helpText="Se muestra como un botón flotante en la esquina inferior de la tienda."
                      checked={position === "floating"}
                      id="floating"
                      name="position"
                      onChange={() => setPosition("floating")}
                    />
                    <RadioButton
                      label="Header"
                      helpText="Se integra en la barra de navegación del tema."
                      checked={position === "header"}
                      id="header"
                      name="position"
                      onChange={() => setPosition("header")}
                    />
                    <RadioButton
                      label="Footer"
                      helpText="Se integra en el pie de página del tema."
                      checked={position === "footer"}
                      id="footer"
                      name="position"
                      onChange={() => setPosition("footer")}
                    />
                    <RadioButton
                      label="Oculto (solo redirect)"
                      helpText="No muestra ningún selector. Solo actúa el redirect automático."
                      checked={position === "hidden"}
                      id="hidden"
                      name="position"
                      onChange={() => setPosition("hidden")}
                    />
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Content */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Contenido del selector
                  </Text>
                  <Checkbox
                    label="Mostrar banderas"
                    checked={showFlags}
                    onChange={setShowFlags}
                  />
                  <Checkbox
                    label="Mostrar nombre del país"
                    checked={showCountryName}
                    onChange={setShowCountryName}
                  />
                  <Checkbox
                    label="Mostrar moneda"
                    checked={showCurrency}
                    onChange={setShowCurrency}
                  />
                  <Checkbox
                    label="Mostrar idioma"
                    checked={showLanguage}
                    onChange={setShowLanguage}
                  />
                </BlockStack>
              </Card>

              {/* Design */}
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Diseño
                  </Text>

                  <InlineStack gap="400">
                    <TextField
                      label="Color fondo"
                      value={bgColor}
                      onChange={setBgColor}
                      type="text"
                      prefix={
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            backgroundColor: bgColor,
                            border: "1px solid #ccc",
                          }}
                        />
                      }
                      autoComplete="off"
                    />
                    <TextField
                      label="Color texto"
                      value={textColor}
                      onChange={setTextColor}
                      type="text"
                      prefix={
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            backgroundColor: textColor,
                            border: "1px solid #ccc",
                          }}
                        />
                      }
                      autoComplete="off"
                    />
                    <TextField
                      label="Color acento"
                      value={accentColor}
                      onChange={setAccentColor}
                      type="text"
                      prefix={
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            backgroundColor: accentColor,
                            border: "1px solid #ccc",
                          }}
                        />
                      }
                      autoComplete="off"
                    />
                  </InlineStack>

                  <Select
                    label="Border radius"
                    options={[
                      { label: "Recto (0px)", value: "0px" },
                      { label: "Sutil (4px)", value: "4px" },
                      { label: "Redondeado (8px)", value: "8px" },
                      { label: "Muy redondeado (12px)", value: "12px" },
                      { label: "Píldora (9999px)", value: "9999px" },
                    ]}
                    value={borderRadius}
                    onChange={setBorderRadius}
                  />

                  <Select
                    label="Tamaño"
                    options={[
                      { label: "Compacto", value: "compact" },
                      { label: "Normal", value: "normal" },
                      { label: "Grande", value: "large" },
                    ]}
                    value={size}
                    onChange={setSize}
                  />

                  <Checkbox
                    label="Sombra (box-shadow)"
                    checked={shadow}
                    onChange={setShadow}
                  />
                </BlockStack>
              </Card>

              {/* Custom CSS */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" as="h2">
                      CSS personalizado
                    </Text>
                    {!canCustomCss && (
                      <Badge tone="attention">Plan Pro</Badge>
                    )}
                  </InlineStack>
                  <TextField
                    label="CSS personalizado"
                    labelHidden
                    value={customCss}
                    onChange={setCustomCss}
                    multiline={6}
                    disabled={!canCustomCss}
                    placeholder=".geo-selector { /* tus estilos */ }"
                    helpText={
                      canCustomCss
                        ? "Añade estilos CSS personalizados al selector."
                        : "Disponible en el plan Pro. Actualiza para desbloquear."
                    }
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Live Preview Sidebar */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  Vista previa
                </Text>
                {/* Inline selector preview */}
                <Box
                  padding="300"
                  borderRadius="200"
                  borderWidth="025"
                  borderColor="border"
                >
                  <div
                    style={{
                      background: bgColor,
                      color: textColor,
                      borderRadius: borderRadius,
                      padding: size === "compact" ? "6px 10px" : size === "large" ? "12px 18px" : "8px 14px",
                      boxShadow: shadow ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                      border: `1px solid ${accentColor}20`,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: size === "compact" ? 13 : size === "large" ? 16 : 14,
                      cursor: "pointer",
                    }}
                  >
                    {showFlags && <span>🇪🇸</span>}
                    {showCountryName && <span>España</span>}
                    {showCurrency && (
                      <span style={{ color: accentColor, fontWeight: 600 }}>
                        EUR
                      </span>
                    )}
                    <span style={{ opacity: 0.4 }}>▾</span>
                  </div>
                </Box>

                <Text as="p" variant="bodySm" tone="subdued">
                  Esto es una preview aproximada. Usa "Vista previa" para ver
                  cómo se ve en tu tienda real.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
