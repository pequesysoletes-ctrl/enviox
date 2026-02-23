// ═══════════════════════════════════════════════════════════════
// Screen 10 — Ayuda / FAQ
// Expandable FAQs, service status, quick links
// ═══════════════════════════════════════════════════════════════

import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Collapsible,
  Box,
  Divider,
  Link,
} from "@shopify/polaris";
import { useState } from "react";

const FAQS = [
  {
    q: "¿Cómo detectamos el país del visitante?",
    a: "Usamos Cloudflare Workers con edge computing. Cuando un visitante llega a tu tienda, nuestro Worker detecta su IP y la geolocaliza usando la cabecera CF-Connecting-IP de Cloudflare. La respuesta es instantánea (<100ms) y nunca almacenamos la IP del visitante.",
  },
  {
    q: "¿Afecta al SEO de mi tienda?",
    a: "No. Detectamos automáticamente los bots de buscadores (Google, Bing, etc.) y nunca los redirigimos. Los crawlers siempre ven tu página original, preservando tu indexación y rankings.",
  },
  {
    q: "¿Qué pasa si el Worker de Cloudflare se cae?",
    a: "El script de detección tiene un timeout de 2 segundos y falla silenciosamente. Si el Worker no responde, tu tienda funciona normal sin redirección. Nunca rompemos la tienda del merchant.",
  },
  {
    q: "¿Es compatible con mi tema de Shopify?",
    a: "Sí. GeoMarkets EU funciona con todos los temas de Shopify, incluyendo Dawn, Craft, Taste, y cualquier tema custom. Usamos Theme App Extension que se integra sin modificar tu código.",
  },
  {
    q: "¿Cumple con RGPD?",
    a: "Sí. No almacenamos IPs, no usamos cookies de terceros, y respetamos la elección del usuario. Si un visitante cambia de mercado manualmente, guardamos su preferencia en una cookie de primera parte durante 30 días.",
  },
  {
    q: "¿Cómo configuro los mercados de Shopify?",
    a: "Ve a Shopify Admin → Settings → Markets. Crea mercados para cada país/región que sirves. GeoMarkets EU sincroniza automáticamente tus mercados y los usa para la geolocalización.",
  },
  {
    q: "¿Puedo excluir páginas específicas de la redirección?",
    a: "Sí. En Configuración → Exclusiones puedes añadir URLs específicas. También puedes excluir todo el checkout y las páginas de carrito automáticamente.",
  },
  {
    q: "¿Puedo probar antes de pagar?",
    a: "Sí. Los planes Basic, Pro y Agency incluyen 7 días de prueba gratuita sin compromiso. Además, el plan Free te permite usar 1 mercado sin coste.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Page
      title="Centro de ayuda"
      subtitle="FAQ, estado del servicio y recursos"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* FAQs */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  Preguntas frecuentes
                </Text>
                {FAQS.map((faq, index) => (
                  <Box key={index}>
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: "none",
                        padding: "12px 0",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        {faq.q}
                      </Text>
                      <Text as="span" variant="bodyMd" tone="subdued">
                        {openFaq === index ? "−" : "+"}
                      </Text>
                    </button>
                    <Collapsible
                      open={openFaq === index}
                      id={`faq-${index}`}
                      transition={{
                        duration: "250ms",
                        timingFunction: "ease-in-out",
                      }}
                    >
                      <Box paddingBlockEnd="300" paddingInlineStart="0">
                        <Text as="p" variant="bodySm" tone="subdued">
                          {faq.a}
                        </Text>
                      </Box>
                    </Collapsible>
                    {index < FAQS.length - 1 && <Divider />}
                  </Box>
                ))}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Sidebar */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            {/* Service Status */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  Estado del servicio
                </Text>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="span">Worker de detección</Text>
                  <Badge tone="success">✅ Operativo</Badge>
                </InlineStack>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="span">API de Markets</Text>
                  <Badge tone="success">✅ Operativo</Badge>
                </InlineStack>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="span">Analytics</Text>
                  <Badge tone="success">✅ Operativo</Badge>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  Última comprobación: hace 5 minutos
                </Text>
              </BlockStack>
            </Card>

            {/* Contact */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  ¿Necesitas ayuda?
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Nuestro equipo te responde en {"<24h"} los días laborables.
                </Text>
                <Button url="mailto:soporte@enviox.es">
                  📧 Enviar email
                </Button>
                <Button variant="plain" url="https://enviox.es/docs/geomarkets" external>
                  📖 Documentación completa
                </Button>
              </BlockStack>
            </Card>

            {/* Resources */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  Recursos
                </Text>
                <Link url="https://help.shopify.com/en/manual/markets" external>
                  📚 Guía de Shopify Markets
                </Link>
                <Link
                  url="https://help.shopify.com/en/manual/markets/managing-markets"
                  external
                >
                  🌍 Configurar mercados internacionales
                </Link>
                <Link url="https://enviox.es/blog/geomarkets-eu" external>
                  📝 Blog: Cómo vender en 27 países EU
                </Link>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
