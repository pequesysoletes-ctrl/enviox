import { json, type ActionFunctionArgs, type LoaderFunctionArgs, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { useLoaderData, useActionData, useNavigate, useSubmit, Form } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Box,
  Banner,
  Badge,
  DataTable,
  DropZone,
  Divider,
  TextField,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandFooter } from "../components/EnvioBrand";
import { IconPackage, IconCheck, IconAlert } from "../components/EnvioIcons";
import { useState, useCallback } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({ ok: true });
};

/**
 * Parse CSV text into an array of shipment objects
 * Expected columns: nombre, direccion, ciudad, cp, provincia, telefono, referencia, servicio, peso, bultos, observaciones
 */
function parseCSV(csvText: string): { rows: any[]; errors: string[] } {
  const lines = csvText.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    return { rows: [], errors: ["El archivo CSV debe tener al menos una cabecera y una fila de datos."] };
  }

  // Parse header
  const header = lines[0].split(/[;,\t]/).map((h) => h.trim().toLowerCase().replace(/["']/g, ""));

  // Map known column aliases
  const columnMap: Record<string, string[]> = {
    nombre: ["nombre", "name", "destinatario", "recipient", "customer"],
    direccion: ["direccion", "dirección", "address", "via", "calle"],
    ciudad: ["ciudad", "city", "poblacion", "población", "town"],
    cp: ["cp", "codigo_postal", "postal", "zip", "zipcode", "codigo postal"],
    provincia: ["provincia", "province", "state", "region"],
    telefono: ["telefono", "teléfono", "phone", "tel", "movil", "móvil"],
    referencia: ["referencia", "reference", "ref", "pedido", "order"],
    servicio: ["servicio", "service", "codigo_servicio", "service_code"],
    peso: ["peso", "weight", "kg"],
    bultos: ["bultos", "packages", "paquetes", "pieces"],
    observaciones: ["observaciones", "observations", "notas", "notes", "comentarios"],
    email: ["email", "correo", "mail"],
  };

  // Resolve column indices
  const colIndex: Record<string, number> = {};
  for (const [field, aliases] of Object.entries(columnMap)) {
    const idx = header.findIndex((h) => aliases.includes(h));
    if (idx !== -1) colIndex[field] = idx;
  }

  // Validate required columns
  const required = ["nombre", "direccion", "ciudad", "cp"];
  const missing = required.filter((r) => colIndex[r] === undefined);
  if (missing.length > 0) {
    return { rows: [], errors: [`Columnas obligatorias no encontradas: ${missing.join(", ")}. Cabeceras detectadas: ${header.join(", ")}`] };
  }

  // Parse rows
  const rows: any[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(/[;,\t]/).map((c) => c.trim().replace(/^["']|["']$/g, ""));

    const getValue = (field: string, defaultVal = "") => {
      const idx = colIndex[field];
      return idx !== undefined && idx < cols.length ? cols[idx] || defaultVal : defaultVal;
    };

    const nombre = getValue("nombre");
    const direccion = getValue("direccion");
    const ciudad = getValue("ciudad");
    const cp = getValue("cp");

    if (!nombre || !direccion || !ciudad || !cp) {
      errors.push(`Fila ${i + 1}: faltan datos obligatorios (nombre, dirección, ciudad o CP)`);
      continue;
    }

    rows.push({
      nombre,
      direccion,
      ciudad,
      cp,
      provincia: getValue("provincia"),
      telefono: getValue("telefono"),
      referencia: getValue("referencia", `CSV-${i}`),
      servicio: getValue("servicio", "0800"),
      peso: parseFloat(getValue("peso", "2")) || 2,
      bultos: parseInt(getValue("bultos", "1")) || 1,
      observaciones: getValue("observaciones"),
      email: getValue("email"),
      lineNumber: i + 1,
    });
  }

  return { rows, errors };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: 5_000_000 }); // 5MB max
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);

  const file = formData.get("csv") as File | null;

  if (!file || file.size === 0) {
    return json({ error: "No se ha seleccionado ningún archivo CSV.", results: null });
  }

  const csvText = await file.text();
  const { rows, errors: parseErrors } = parseCSV(csvText);

  if (rows.length === 0) {
    return json({ error: parseErrors.join(". "), results: null });
  }

  // Create shipments in DB (not calling MRW API yet — just queuing)
  const results = {
    total: rows.length,
    created: 0,
    errors: [] as string[],
    parseWarnings: parseErrors,
  };

  for (const row of rows) {
    try {
      await prisma.shipment.create({
        data: {
          shop,
          shopifyOrderId: "",
          shopifyOrderName: row.referencia || `CSV Import`,
          customerName: row.nombre,
          customerPhone: row.telefono || "",
          destinationAddress: row.direccion,
          destinationCity: row.ciudad,
          destinationZip: row.cp,
          destinationProvince: row.provincia || "",
          correosServiceCode: row.servicio || "0800",
          weight: row.peso,
          packages: row.bultos,
          reference: row.referencia || "",
          observations: row.observaciones || "",
          status: "PENDIENTE",
        },
      });

      results.created++;
    } catch (err: any) {
      results.errors.push(`Fila ${row.lineNumber}: ${err.message}`);
    }
  }

  return json({ error: null, results });
};

export default function ImportPage() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const submit = useSubmit();

  const handleDrop = useCallback((_: any, acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const handleSubmit = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("csv", file);
    submit(formData, { method: "POST", encType: "multipart/form-data" });
  };

  const results = actionData?.results;

  return (
    <Page
      title="Importar envíos"
      subtitle="Crea múltiples envíos desde un archivo CSV"
      backAction={{ content: "Envíos", onAction: () => navigate("/app/shipments") }}
    >
      <Layout>
        {/* Instructions */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Formato del archivo CSV</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                El archivo debe incluir las siguientes columnas. Las 4 primeras son obligatorias:
              </Text>

              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <Text as="p" variant="bodySm" fontWeight="semibold">
                  <span style={{ color: "#EF4444" }}>nombre*</span>;
                  <span style={{ color: "#EF4444" }}>direccion*</span>;
                  <span style={{ color: "#EF4444" }}>ciudad*</span>;
                  <span style={{ color: "#EF4444" }}>cp*</span>;
                  provincia;telefono;referencia;servicio;peso;bultos;observaciones
                </Text>
              </Box>

              <Text as="p" variant="bodySm" tone="subdued">
                Separadores aceptados: punto y coma (;), coma (,) o tabulador. Codificación: UTF-8.
              </Text>

              <Divider />

              <Text as="h3" variant="headingSm">Ejemplo:</Text>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <pre style={{ fontSize: "12px", fontFamily: "monospace", margin: 0, whiteSpace: "pre-wrap", color: "#334155" }}>
{`nombre;direccion;ciudad;cp;provincia;telefono;referencia;peso
Juan García;Calle Mayor 15;Madrid;28001;Madrid;612345678;PED-001;2.5
María López;Av. Diagonal 200;Barcelona;08019;Barcelona;698765432;PED-002;1.0
Pedro Ruiz;Plaza España 3;Valencia;46001;Valencia;611223344;PED-003;3.0`}
                </pre>
              </Box>

              <InlineStack gap="200">
                <Badge tone="info">Máximo 500 filas por archivo</Badge>
                <Badge tone="info">Máximo 5 MB</Badge>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Upload */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Subir archivo CSV</Text>

              <DropZone onDrop={handleDrop} accept=".csv,text/csv" allowMultiple={false}>
                {file ? (
                  <Box padding="400">
                    <InlineStack gap="300" blockAlign="center" align="center">
                      <IconPackage size={24} color="#10B981" />
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" fontWeight="bold">{file.name}</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {(file.size / 1024).toFixed(1)} KB
                        </Text>
                      </BlockStack>
                      <Button variant="plain" onClick={() => setFile(null)}>Cambiar</Button>
                    </InlineStack>
                  </Box>
                ) : (
                  <DropZone.FileUpload actionTitle="Seleccionar CSV" actionHint="o arrastra el archivo aquí" />
                )}
              </DropZone>

              <Button
                variant="primary"
                fullWidth
                disabled={!file}
                onClick={handleSubmit}
              >
                Importar envíos
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Results */}
        {actionData?.error && (
          <Layout.Section>
            <Banner tone="critical" title="Error de importación">
              <p>{actionData.error}</p>
            </Banner>
          </Layout.Section>
        )}

        {results && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">Resultado de la importación</Text>
                  <Badge tone={results.created === results.total ? "success" : "warning"}>
                    {results.created} / {results.total} creados
                  </Badge>
                </InlineStack>

                <InlineGrid columns={3} gap="400">
                  <Box padding="400" background="bg-surface-success" borderRadius="200">
                    <BlockStack gap="100" inlineAlign="center">
                      <IconCheck size={24} />
                      <Text as="p" variant="headingLg" alignment="center">{results.created}</Text>
                      <Text as="p" variant="bodySm" tone="subdued" alignment="center">Creados</Text>
                    </BlockStack>
                  </Box>
                  <Box padding="400" background={results.errors.length > 0 ? "bg-surface-critical" : "bg-surface-secondary"} borderRadius="200">
                    <BlockStack gap="100" inlineAlign="center">
                      <IconAlert size={24} color={results.errors.length > 0 ? "#EF4444" : "#94A3B8"} />
                      <Text as="p" variant="headingLg" alignment="center">{results.errors.length}</Text>
                      <Text as="p" variant="bodySm" tone="subdued" alignment="center">Errores</Text>
                    </BlockStack>
                  </Box>
                  <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                    <BlockStack gap="100" inlineAlign="center">
                      <Text as="p" variant="headingLg" alignment="center">{results.parseWarnings.length}</Text>
                      <Text as="p" variant="bodySm" tone="subdued" alignment="center">Advertencias</Text>
                    </BlockStack>
                  </Box>
                </InlineGrid>

                {results.errors.length > 0 && (
                  <>
                    <Divider />
                    <Text as="h3" variant="headingSm">Errores:</Text>
                    <BlockStack gap="100">
                      {results.errors.map((e: string, i: number) => (
                        <Text key={i} as="p" variant="bodySm" tone="critical">{e}</Text>
                      ))}
                    </BlockStack>
                  </>
                )}

                <Button onClick={() => navigate("/app/shipments")}>
                  Ver envíos importados
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
