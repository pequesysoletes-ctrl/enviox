import { json, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Button,
  Banner,
  Box,
  TextField,
  ProgressBar,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState } from "react";

/**
 * Onboarding Wizard — Step-by-step first-time setup
 * Shows when a new shop installs the app and has no MRW credentials configured.
 * 
 * Steps:
 * 1. Welcome / overview
 * 2. MRW credentials
 * 3. Default shipping config
 * 4. Test connection
 * 5. Done! → Go to dashboard
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const credentials = await prisma.mrwCredentials.findUnique({ where: { shop } });
  const shippingConfig = await prisma.shippingConfig.findUnique({ where: { shop } });

  // Determine current step
  let currentStep = 1;
  if (credentials) currentStep = 2;
  if (credentials && shippingConfig) currentStep = 3;
  if (credentials?.verified) currentStep = 4;

  return json({ currentStep, credentials: !!credentials, config: !!shippingConfig, verified: credentials?.verified || false, shop });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "saveCredentials") {
    const codigoFranquicia = formData.get("codigoFranquicia")?.toString() || "";
    const codigoAbonado = formData.get("codigoAbonado")?.toString() || "";
    const username = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    await prisma.mrwCredentials.upsert({
      where: { shop },
      create: { shop, codigoFranquicia, codigoAbonado, username, password },
      update: { codigoFranquicia, codigoAbonado, username, password },
    });

    return json({ success: true, step: 2 });
  }

  if (intent === "saveConfig") {
    const defaultService = formData.get("defaultService")?.toString() || "0800";
    const defaultWeight = parseInt(formData.get("defaultWeight")?.toString() || "2");

    await prisma.shippingConfig.upsert({
      where: { shop },
      create: { shop, defaultService, defaultWeight },
      update: { defaultService, defaultWeight },
    });

    return json({ success: true, step: 3 });
  }

  if (intent === "skip") {
    return redirect("/app");
  }

  return json({ success: false });
};

export default function OnboardingPage() {
  const { currentStep, credentials, config, verified, shop } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [step, setStep] = useState(currentStep);
  const [creds, setCreds] = useState({
    codigoFranquicia: "",
    codigoAbonado: "",
    username: "",
    password: "",
  });
  const [shipConfig, setShipConfig] = useState({
    defaultService: "0800",
    defaultWeight: "2",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const stepTitles = [
    "",
    "Bienvenido a Enviox",
    "Credenciales MRW",
    "Configuración de envío",
    "¡Todo listo!",
  ];

  const handleSaveCredentials = () => {
    const formData = new FormData();
    formData.append("intent", "saveCredentials");
    Object.entries(creds).forEach(([k, v]) => formData.append(k, v));
    submit(formData, { method: "POST" });
    setStep(3);
  };

  const handleSaveConfig = () => {
    const formData = new FormData();
    formData.append("intent", "saveConfig");
    Object.entries(shipConfig).forEach(([k, v]) => formData.append(k, v));
    submit(formData, { method: "POST" });
    setStep(4);
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="600">
              {/* Progress */}
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">
                    Paso {step} de {totalSteps}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {Math.round(progress)}%
                  </Text>
                </InlineStack>
                <ProgressBar progress={progress} size="small" tone="primary" />
              </BlockStack>

              {/* Step 1: Welcome */}
              {step === 1 && (
                <BlockStack gap="400">
                  <Box padding="400" borderRadius="300" background="bg-surface-secondary">
                    <BlockStack gap="300" inlineAlign="center">
                      <div style={{ fontSize: 48, textAlign: "center" }}>📦</div>
                      <Text as="h1" variant="headingXl" alignment="center">
                        ¡Bienvenido a Enviox!
                      </Text>
                      <Text as="p" variant="bodyLg" alignment="center" tone="subdued">
                        La forma más fácil de enviar con MRW desde tu tienda Shopify.
                        Configura tu cuenta en 2 minutos.
                      </Text>
                    </BlockStack>
                  </Box>

                  <BlockStack gap="200">
                    <InlineStack gap="300" blockAlign="center">
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E30613", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>1</div>
                      <BlockStack gap="050">
                        <Text as="p" variant="bodyMd" fontWeight="bold">Conecta tu cuenta MRW</Text>
                        <Text as="p" variant="bodySm" tone="subdued">Introduce las credenciales de tu franquicia</Text>
                      </BlockStack>
                    </InlineStack>
                    <InlineStack gap="300" blockAlign="center">
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E30613", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>2</div>
                      <BlockStack gap="050">
                        <Text as="p" variant="bodyMd" fontWeight="bold">Configura los ajustes</Text>
                        <Text as="p" variant="bodySm" tone="subdued">Servicio por defecto, peso, dimensiones</Text>
                      </BlockStack>
                    </InlineStack>
                    <InlineStack gap="300" blockAlign="center">
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E30613", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>3</div>
                      <BlockStack gap="050">
                        <Text as="p" variant="bodyMd" fontWeight="bold">¡Empieza a enviar!</Text>
                        <Text as="p" variant="bodySm" tone="subdued">Automático o manual, tu eliges</Text>
                      </BlockStack>
                    </InlineStack>
                  </BlockStack>

                  <InlineStack gap="300" align="end">
                    <Button onClick={() => navigate("/app")}>Saltar por ahora</Button>
                    <Button variant="primary" size="large" onClick={() => setStep(2)}>
                      Comenzar configuración →
                    </Button>
                  </InlineStack>
                </BlockStack>
              )}

              {/* Step 2: MRW Credentials */}
              {step === 2 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingLg">🔑 Credenciales MRW</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Estas credenciales te las proporciona tu franquicia MRW. Si no las tienes,
                    contacta con tu comercial de MRW.
                  </Text>

                  <TextField
                    label="Código de franquicia"
                    value={creds.codigoFranquicia}
                    onChange={(v) => setCreds({ ...creds, codigoFranquicia: v })}
                    placeholder="Ej: 002506"
                    autoComplete="off"
                  />
                  <TextField
                    label="Código de abonado"
                    value={creds.codigoAbonado}
                    onChange={(v) => setCreds({ ...creds, codigoAbonado: v })}
                    placeholder="Ej: 123456"
                    autoComplete="off"
                  />
                  <TextField
                    label="Usuario"
                    value={creds.username}
                    onChange={(v) => setCreds({ ...creds, username: v })}
                    placeholder="Tu usuario MRW"
                    autoComplete="off"
                  />
                  <TextField
                    label="Contraseña"
                    value={creds.password}
                    onChange={(v) => setCreds({ ...creds, password: v })}
                    type="password"
                    autoComplete="off"
                  />

                  <Banner tone="info">
                    <p>💡 Si todavía no tienes credenciales, puedes <strong>saltar este paso</strong> y configurarlo después en Ajustes → MRW.</p>
                  </Banner>

                  <InlineStack gap="300" align="end">
                    <Button onClick={() => setStep(1)}>← Atrás</Button>
                    <Button onClick={() => setStep(3)}>Saltar</Button>
                    <Button variant="primary" onClick={handleSaveCredentials}
                      disabled={!creds.codigoFranquicia || !creds.username}>
                      Guardar y continuar →
                    </Button>
                  </InlineStack>
                </BlockStack>
              )}

              {/* Step 3: Shipping Config */}
              {step === 3 && (
                <BlockStack gap="400">
                  <Text as="h2" variant="headingLg">⚙️ Configuración de envío</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Configura los valores por defecto para tus envíos. Puedes cambiarlos después.
                  </Text>

                  <BlockStack gap="300">
                    <Text as="p" variant="bodyMd" fontWeight="bold">Servicio MRW por defecto:</Text>
                    {[
                      { code: "0800", name: "e-Commerce", desc: "El más usado. Entrega en 24-48h", recommended: true },
                      { code: "0200", name: "Urgente 19h", desc: "Entrega antes de las 19h" },
                      { code: "0110", name: "Urgente 14h", desc: "Entrega antes de las 14h" },
                      { code: "0300", name: "Económico", desc: "La opción más barata. 48-72h" },
                    ].map((svc) => (
                      <Box
                        key={svc.code}
                        padding="300"
                        borderRadius="200"
                        borderWidth="025"
                        borderColor={shipConfig.defaultService === svc.code ? "border-brand" : "border"}
                        background={shipConfig.defaultService === svc.code ? "bg-surface-selected" : "bg-surface"}
                      >
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="050">
                            <InlineStack gap="200" blockAlign="center">
                              <Text as="span" variant="bodyMd" fontWeight="bold">{svc.name}</Text>
                              <Text as="span" variant="bodySm" tone="subdued">({svc.code})</Text>
                              {svc.recommended && <span style={{ background: "#E30613", color: "white", fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>RECOMENDADO</span>}
                            </InlineStack>
                            <Text as="span" variant="bodySm" tone="subdued">{svc.desc}</Text>
                          </BlockStack>
                          <Button
                            variant={shipConfig.defaultService === svc.code ? "primary" : "plain"}
                            onClick={() => setShipConfig({ ...shipConfig, defaultService: svc.code })}
                          >
                            {shipConfig.defaultService === svc.code ? "✓ Seleccionado" : "Seleccionar"}
                          </Button>
                        </InlineStack>
                      </Box>
                    ))}
                  </BlockStack>

                  <TextField
                    label="Peso por defecto (kg)"
                    value={shipConfig.defaultWeight}
                    onChange={(v) => setShipConfig({ ...shipConfig, defaultWeight: v })}
                    type="number"
                    suffix="kg"
                    autoComplete="off"
                    helpText="Se usará cuando el peso no esté definido en el producto"
                  />

                  <InlineStack gap="300" align="end">
                    <Button onClick={() => setStep(2)}>← Atrás</Button>
                    <Button variant="primary" onClick={handleSaveConfig}>
                      Guardar y finalizar →
                    </Button>
                  </InlineStack>
                </BlockStack>
              )}

              {/* Step 4: Done */}
              {step === 4 && (
                <BlockStack gap="400">
                  <Box padding="600" borderRadius="300" background="bg-surface-secondary">
                    <BlockStack gap="400" inlineAlign="center">
                      <div style={{ fontSize: 64, textAlign: "center" }}>🎉</div>
                      <Text as="h1" variant="headingXl" alignment="center">
                        ¡Configuración completada!
                      </Text>
                      <Text as="p" variant="bodyLg" alignment="center" tone="subdued">
                        Tu app MRW Pro está lista para enviar. Aquí tienes algunos accesos rápidos:
                      </Text>
                    </BlockStack>
                  </Box>

                  <InlineStack gap="300" align="center" wrap>
                    <Button variant="primary" size="large" onClick={() => navigate("/app")}>
                      📊 Ir al Dashboard
                    </Button>
                    <Button onClick={() => navigate("/app/shipments/new")}>
                      📦 Crear primer envío
                    </Button>
                    <Button onClick={() => navigate("/app/orders")}>
                      🛒 Ver pedidos Shopify
                    </Button>
                  </InlineStack>

                  <Banner tone="info">
                    <p>
                      💡 <strong>Tip:</strong> Activa la creación automática de envíos en{" "}
                      <strong>Configuración → MRW</strong> para que cada nuevo pedido genere un envío automáticamente.
                    </p>
                  </Banner>
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
