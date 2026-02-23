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
  Badge,
  Box,
  Select,
  TextField,
  Banner,
  Divider,
  Modal,
  FormLayout,
  ChoiceList,
  Icon,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { useState, useCallback } from "react";

/**
 * Shipping Rules Engine
 * Automatically assign DHL service based on conditions:
 * - Weight range
 * - Postal code (prefix)
 * - Order total range
 * - Province
 * - Product tags
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Load existing rules
  const rules = await prisma.shippingRule.findMany({
    where: { shop },
    orderBy: { priority: "asc" },
  });

  return json({ rules });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  if (intent === "create") {
    const name = formData.get("name")?.toString() || "Nueva regla";
    const conditionField = formData.get("conditionField")?.toString() || "weight";
    const conditionOperator = formData.get("conditionOperator")?.toString() || "gte";
    const conditionValue = formData.get("conditionValue")?.toString() || "0";
    const actionService = formData.get("actionService")?.toString() || "0800";
    const actionInsurance = formData.get("actionInsurance") === "true";
    const enabled = formData.get("enabled") !== "false";

    // Get next priority
    const maxPriority = await prisma.shippingRule.aggregate({
      where: { shop },
      _max: { priority: true },
    });

    await prisma.shippingRule.create({
      data: {
        shop,
        name,
        conditionField,
        conditionOperator,
        conditionValue,
        actionService,
        actionInsurance,
        enabled,
        priority: (maxPriority._max.priority || 0) + 1,
      },
    });

    return json({ success: true, message: "Regla creada correctamente" });
  }

  if (intent === "delete") {
    const ruleId = formData.get("ruleId")?.toString();
    if (ruleId) {
      await prisma.shippingRule.delete({ where: { id: ruleId } });
    }
    return json({ success: true, message: "Regla eliminada" });
  }

  if (intent === "toggle") {
    const ruleId = formData.get("ruleId")?.toString();
    const enabled = formData.get("enabled") === "true";
    if (ruleId) {
      await prisma.shippingRule.update({
        where: { id: ruleId },
        data: { enabled },
      });
    }
    return json({ success: true, message: enabled ? "Regla activada" : "Regla desactivada" });
  }

  return json({ success: false, message: "Acción no válida" });
};

// Service evaluation logic (used server-side when creating shipments)
export function evaluateRules(
  rules: any[],
  orderData: { weight: number; postalCode: string; province: string; total: number; tags: string[] }
): { serviceCode: string; insurance: boolean } | null {
  for (const rule of rules.filter((r: any) => r.enabled)) {
    let matches = false;
    const value = parseFloat(rule.conditionValue) || 0;

    switch (rule.conditionField) {
      case "weight":
        matches = compareNumber(orderData.weight, rule.conditionOperator, value);
        break;
      case "total":
        matches = compareNumber(orderData.total, rule.conditionOperator, value);
        break;
      case "postalCode":
        matches = orderData.postalCode.startsWith(rule.conditionValue);
        break;
      case "province":
        matches = orderData.province.toLowerCase().includes(rule.conditionValue.toLowerCase());
        break;
      case "tags":
        matches = orderData.tags.some(t => t.toLowerCase().includes(rule.conditionValue.toLowerCase()));
        break;
    }

    if (matches) {
      return { serviceCode: rule.actionService, insurance: rule.actionInsurance };
    }
  }
  return null; // No rule matched → use default
}

function compareNumber(actual: number, operator: string, target: number): boolean {
  switch (operator) {
    case "gte": return actual >= target;
    case "lte": return actual <= target;
    case "gt": return actual > target;
    case "lt": return actual < target;
    case "eq": return actual === target;
    default: return false;
  }
}

export default function ShippingRulesPage() {
  const { rules } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    conditionField: "weight",
    conditionOperator: "gte",
    conditionValue: "",
    actionService: "0800",
    actionInsurance: false,
  });

  const conditionFields = [
    { label: "Peso (kg)", value: "weight" },
    { label: "Total pedido (€)", value: "total" },
    { label: "Código postal (prefijo)", value: "postalCode" },
    { label: "Provincia", value: "province" },
    { label: "Tag del producto", value: "tags" },
  ];

  const operators = [
    { label: "Mayor o igual que", value: "gte" },
    { label: "Menor o igual que", value: "lte" },
    { label: "Mayor que", value: "gt" },
    { label: "Menor que", value: "lt" },
    { label: "Igual a", value: "eq" },
  ];

  const isTextCondition = ["postalCode", "province", "tags"].includes(newRule.conditionField);

  const services = [
    { label: "e-Commerce (0800)", value: "0800" },
    { label: "Urgente 19h (0200)", value: "0200" },
    { label: "Urgente 14h (0110)", value: "0110" },
    { label: "Urgente 12h (0100)", value: "0100" },
    { label: "Urgente 10h (0000)", value: "0000" },
    { label: "Económico (0300)", value: "0300" },
    { label: "e-Commerce Canje (0810)", value: "0810" },
  ];

  const serviceNames: Record<string, string> = {
    "0000": "Urgente 10h",
    "0100": "Urgente 12h",
    "0110": "Urgente 14h",
    "0200": "Urgente 19h",
    "0300": "Económico",
    "0800": "e-Commerce",
    "0810": "e-Commerce Canje",
  };

  const conditionLabels: Record<string, string> = {
    weight: "Peso",
    total: "Total",
    postalCode: "CP",
    province: "Provincia",
    tags: "Tag",
  };

  const operatorLabels: Record<string, string> = {
    gte: "≥",
    lte: "≤",
    gt: ">",
    lt: "<",
    eq: "=",
  };

  const handleCreate = () => {
    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("name", newRule.name || "Regla sin nombre");
    formData.append("conditionField", newRule.conditionField);
    formData.append("conditionOperator", newRule.conditionOperator);
    formData.append("conditionValue", newRule.conditionValue);
    formData.append("actionService", newRule.actionService);
    formData.append("actionInsurance", String(newRule.actionInsurance));
    submit(formData, { method: "POST" });
    setShowModal(false);
    setNewRule({ name: "", conditionField: "weight", conditionOperator: "gte", conditionValue: "", actionService: "0800", actionInsurance: false });
  };

  const handleDelete = (ruleId: string) => {
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("ruleId", ruleId);
    submit(formData, { method: "POST" });
  };

  const handleToggle = (ruleId: string, enabled: boolean) => {
    const formData = new FormData();
    formData.append("intent", "toggle");
    formData.append("ruleId", ruleId);
    formData.append("enabled", String(!enabled));
    submit(formData, { method: "POST" });
  };

  return (
    <Page
      title="Reglas de envío"
      subtitle="Asigna automáticamente el Servicio Correos según las condiciones del pedido"
      backAction={{ content: "Configuración", onAction: () => navigate("/app/settings") }}
      primaryAction={{
        content: "Nueva regla",
        onAction: () => setShowModal(true),
      }}
    >
      <Layout>
        {actionData?.message && (
          <Layout.Section>
            <Banner tone={actionData?.success ? "success" : "critical"}>
              <p>{actionData.message}</p>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Banner tone="info" title="¿Cómo funcionan las reglas?">
            <p>
              Las reglas se evalúan en orden de prioridad (de arriba a abajo).
              La <strong>primera regla que coincida</strong> se aplica al envío.
              Si ninguna regla coincide, se usa el servicio por defecto de tu configuración.
            </p>
          </Banner>
        </Layout.Section>

        {/* Example rules */}
        {rules.length === 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Ejemplos de reglas</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Añade reglas para automatizar la asignación de Servicio Correos:
                </Text>

                <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="200">
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="info">Peso</Badge>
                      <Text as="span" variant="bodySm">Si peso ≥ 5 kg → Urgente 19h (más barato para pesados)</Text>
                    </InlineStack>
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="warning">CP</Badge>
                      <Text as="span" variant="bodySm">Si CP empieza por 07 (Baleares) → e-Commerce Canje</Text>
                    </InlineStack>
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="success">Total</Badge>
                      <Text as="span" variant="bodySm">Si total ≥ 100€ → Urgente 12h + Seguro</Text>
                    </InlineStack>
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="critical">Tag</Badge>
                      <Text as="span" variant="bodySm">Si producto tiene tag "frágil" → Urgente 14h</Text>
                    </InlineStack>
                  </BlockStack>
                </Box>

                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Crear primera regla
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        {/* Rules list */}
        {rules.length > 0 && (
          <Layout.Section>
            <Card padding="0">
              <BlockStack>
                {rules.map((rule: any, index: number) => (
                  <Box
                    key={rule.id}
                    padding="400"
                    borderBlockEndWidth="025"
                    borderColor="border"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="300" blockAlign="center">
                        <Box padding="200" background={rule.enabled ? "bg-fill-success" : "bg-fill-disabled"} borderRadius="200">
                          <Text as="span" variant="bodySm" fontWeight="bold" tone={rule.enabled ? "success" : "subdued"}>
                            {index + 1}
                          </Text>
                        </Box>
                        <BlockStack gap="050">
                          <Text as="span" variant="bodyMd" fontWeight="bold">
                            {rule.name}
                          </Text>
                          <InlineStack gap="200">
                            <Badge tone="info">
                              {conditionLabels[rule.conditionField] || rule.conditionField}
                              {" "}
                              {isTextCondition ? "contiene" : operatorLabels[rule.conditionOperator] || rule.conditionOperator}
                              {" "}
                              {rule.conditionValue}
                              {rule.conditionField === "weight" ? " kg" : rule.conditionField === "total" ? " €" : ""}
                            </Badge>
                            <Text as="span" variant="bodySm" tone="subdued">→</Text>
                            <Badge tone="success">
                              {serviceNames[rule.actionService] || rule.actionService}
                            </Badge>
                            {rule.actionInsurance && (
                              <Badge tone="warning">+ Seguro</Badge>
                            )}
                          </InlineStack>
                        </BlockStack>
                      </InlineStack>

                      <InlineStack gap="200">
                        <Button
                          variant="plain"
                          onClick={() => handleToggle(rule.id, rule.enabled)}
                        >
                          {rule.enabled ? "Desactivar" : "Activar"}
                        </Button>
                        <Button
                          variant="plain"
                          tone="critical"
                          onClick={() => handleDelete(rule.id)}
                        >
                          Eliminar
                        </Button>
                      </InlineStack>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>

      {/* Create rule modal */}
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Nueva regla de envío"
          primaryAction={{ content: "Crear regla", onAction: handleCreate }}
          secondaryActions={[{ content: "Cancelar", onAction: () => setShowModal(false) }]}
        >
          <Modal.Section>
            <FormLayout>
              <TextField
                label="Nombre de la regla"
                value={newRule.name}
                onChange={(v) => setNewRule({ ...newRule, name: v })}
                placeholder="Ej: Pesados a Urgente 19h"
                autoComplete="off"
              />

              <Select
                label="Si el campo..."
                options={conditionFields}
                value={newRule.conditionField}
                onChange={(v) => setNewRule({ ...newRule, conditionField: v })}
              />

              {!isTextCondition && (
                <Select
                  label="Operador"
                  options={operators}
                  value={newRule.conditionOperator}
                  onChange={(v) => setNewRule({ ...newRule, conditionOperator: v })}
                />
              )}

              <TextField
                label={isTextCondition ? "Contiene / empieza por" : "Valor"}
                value={newRule.conditionValue}
                onChange={(v) => setNewRule({ ...newRule, conditionValue: v })}
                placeholder={
                  newRule.conditionField === "weight" ? "5" :
                  newRule.conditionField === "total" ? "100" :
                  newRule.conditionField === "postalCode" ? "07" :
                  newRule.conditionField === "province" ? "Baleares" :
                  "frágil"
                }
                suffix={newRule.conditionField === "weight" ? "kg" : newRule.conditionField === "total" ? "€" : undefined}
                autoComplete="off"
              />

              <Divider />

              <Select
                label="Entonces usar Servicio Correos:"
                options={services}
                value={newRule.actionService}
                onChange={(v) => setNewRule({ ...newRule, actionService: v })}
              />

              <ChoiceList
                title=""
                choices={[{ label: "Añadir seguro de envío", value: "insurance" }]}
                selected={newRule.actionInsurance ? ["insurance"] : []}
                onChange={(v) => setNewRule({ ...newRule, actionInsurance: v.includes("insurance") })}
              />
            </FormLayout>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
