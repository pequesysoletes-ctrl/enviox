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
  IndexTable,
  Badge,
  InlineStack,
  Box,
  Divider,
  InlineGrid,
} from "@shopify/polaris";
import { useState, useMemo } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";

const STATUS_MAP: Record<string, { label: string; tone: "info" | "warning" | "success" | "critical" }> = {
  PENDING: { label: "PENDIENTE", tone: "warning" },
  CONFIRMED: { label: "CONFIRMADA", tone: "success" },
  COMPLETED: { label: "COMPLETADA", tone: "success" },
  CANCELLED: { label: "CANCELADA", tone: "critical" },
};

const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const pickups = await prisma.pickup.findMany({
    where: { shop: session.shop },
    orderBy: { date: "desc" },
    take: 50,
  });

  return json({ pickups });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const date = formData.get("date") as string;
  const timeSlot = formData.get("timeSlot") as string;
  const numPackages = formData.get("packages") as string;
  const notes = formData.get("notes") as string;

  if (!date || !timeSlot) {
    return json({ error: "Selecciona fecha y franja horaria" }, { status: 400 });
  }

  const pickupDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (pickupDate < today) {
    return json({ error: "La fecha debe ser hoy o futura" }, { status: 400 });
  }

  await prisma.pickup.create({
    data: {
      shop: session.shop,
      date: pickupDate,
      timeSlot,
      packages: parseInt(numPackages) || 1,
      notes: notes || "",
      status: "PENDING",
    },
  });

  return json({
    success: true,
    message: `✅ Recogida programada para ${pickupDate.toLocaleDateString("es-ES")} (${timeSlot})`,
  });
};

// ── Mini Calendar Component ──
function MiniCalendar({ pickupDates }: { pickupDates: Set<string> }) {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1; // Monday is 0
  if (startDay < 0) startDay = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) currentWeek.push(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  while (currentWeek.length < 7 && currentWeek.length > 0) currentWeek.push(null);
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const hasPickup = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return pickupDates.has(dateStr);
  };

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text as="h2" variant="headingMd" fontWeight="bold">
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </Text>
          <InlineStack gap="200">
            <Button variant="plain" onClick={prevMonth}>←</Button>
            <Button variant="plain" onClick={nextMonth}>→</Button>
          </InlineStack>
        </InlineStack>

        <InlineStack gap="100" blockAlign="center">
          <Box paddingInlineEnd="200">
            <InlineStack gap="100" blockAlign="center">
              <Text as="span" variant="bodySm" tone="info">●</Text>
              <Text as="span" variant="bodySm" tone="subdued">PROGRAMADA</Text>
            </InlineStack>
          </Box>
          <InlineStack gap="100" blockAlign="center">
            <Text as="span" variant="bodySm">○</Text>
            <Text as="span" variant="bodySm" tone="subdued">HOY</Text>
          </InlineStack>
        </InlineStack>

        {/* Day headers */}
        <InlineGrid columns={7} gap="0">
          {DAYS.map((d) => (
            <Box key={d} padding="200">
              <Text as="p" variant="bodySm" tone="subdued" alignment="center" fontWeight="bold">
                {d}
              </Text>
            </Box>
          ))}
        </InlineGrid>

        {/* Calendar grid */}
        {weeks.map((week, wi) => (
          <InlineGrid columns={7} gap="0" key={wi}>
            {week.map((day, di) => (
              <Box key={`${wi}-${di}`} padding="200" minHeight="40px">
                {day ? (
                  <BlockStack gap="0" inlineAlign="center">
                    <Box
                      padding="100"
                      borderRadius="full"
                      background={isToday(day) ? "bg-fill-info" : undefined}
                      minWidth="32px"
                    >
                      <Text
                        as="p"
                        variant="bodySm"
                        alignment="center"
                        fontWeight={isToday(day) ? "bold" : "regular"}
                        tone={isToday(day) ? "text-inverse" : undefined}
                      >
                        {day}
                      </Text>
                    </Box>
                    {hasPickup(day) && (
                      <Text as="span" variant="bodySm" tone="info" alignment="center">●</Text>
                    )}
                  </BlockStack>
                ) : null}
              </Box>
            ))}
          </InlineGrid>
        ))}
      </BlockStack>
    </Card>
  );
}

export default function PickupsPage() {
  const { pickups } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const isLoading = fetcher.state !== "idle";
  const actionData = fetcher.data;

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [packages, setPackages] = useState("1");
  const [notes, setNotes] = useState("");

  const timeSlotOptions = [
    { label: "Seleccionar franja", value: "" },
    { label: "09:00 — 13:00", value: "09:00-13:00" },
    { label: "10:00 — 14:00", value: "10:00-14:00" },
    { label: "14:00 — 18:00", value: "14:00-18:00" },
  ];

  const today = new Date().toISOString().split("T")[0];

  // Build set of pickup dates for calendar dots
  const pickupDateSet = useMemo(() => {
    const set = new Set<string>();
    for (const p of pickups as any[]) {
      const d = new Date(p.date);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    }
    return set;
  }, [pickups]);

  // Upcoming pickups only
  const upcoming = (pickups as any[])
    .filter((p) => new Date(p.date) >= new Date(new Date().toDateString()))
    .slice(0, 5);

  return (
    <Page
      title="Recogidas"
      subtitle="Gestiona tus programaciones y solicita nuevos servicios."
      primaryAction={{
        content: "Nueva recogida",
        url: "#new",
      }}
    >
      <Layout>
        {/* Left: Calendar */}
        <Layout.Section variant="oneHalf">
          <MiniCalendar pickupDates={pickupDateSet} />

          {/* Info banner */}
          <Box paddingBlockStart="400">
            <Banner tone="info">
              <Text as="p" variant="bodySm">
                <strong>Información de servicio:</strong> Las recogidas solicitadas antes de las 11:00 AM pueden programarse para el mismo día en la franja de tarde. El mensajero contactará por teléfono antes de la llegada.
              </Text>
            </Banner>
          </Box>
        </Layout.Section>

        {/* Right: Upcoming + Form */}
        <Layout.Section variant="oneHalf">
          {/* Próximas recogidas */}
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">Próximas recogidas</Text>
                {upcoming.length > 0 && (
                  <Badge tone="info">{upcoming.length} activas</Badge>
                )}
              </InlineStack>

              {upcoming.length > 0 ? (
                <BlockStack gap="300">
                  {upcoming.map((pickup: any) => {
                    const statusInfo = STATUS_MAP[pickup.status] || { label: pickup.status, tone: "info" as const };
                    return (
                      <Box key={pickup.id} padding="300" borderRadius="200" background="bg-surface-secondary">
                        <InlineStack align="space-between" blockAlign="start">
                          <BlockStack gap="100">
                            <Text as="p" variant="bodyMd" fontWeight="bold">
                              {new Date(pickup.date).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">{pickup.timeSlot}</Text>
                            <InlineStack gap="100" blockAlign="center">
                              <Text as="span" variant="bodySm">📦</Text>
                              <Text as="span" variant="bodySm" tone="subdued">
                                {pickup.packages} paquetes
                              </Text>
                            </InlineStack>
                          </BlockStack>
                          <BlockStack gap="100" inlineAlign="end">
                            <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
                            <Button variant="plain" size="micro">Detalles ↗</Button>
                          </BlockStack>
                        </InlineStack>
                      </Box>
                    );
                  })}
                </BlockStack>
              ) : (
                <Box padding="400">
                  <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                    No hay recogidas programadas
                  </Text>
                </Box>
              )}
            </BlockStack>
          </Card>

          {/* Nueva solicitud form */}
          <Box paddingBlockStart="400">
            <Card>
              <fetcher.Form method="post">
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Nueva solicitud</Text>

                  <TextField
                    label="Fecha de recogida"
                    name="date"
                    type="date"
                    value={date}
                    onChange={setDate}
                    autoComplete="off"
                    requiredIndicator
                    min={today}
                  />

                  <Select
                    label="Franja horaria"
                    name="timeSlot"
                    options={timeSlotOptions}
                    value={timeSlot}
                    onChange={setTimeSlot}
                    requiredIndicator
                  />

                  <TextField
                    label="Número de paquetes"
                    name="packages"
                    type="number"
                    value={packages}
                    onChange={setPackages}
                    autoComplete="off"
                    min={1}
                    prefix="📦"
                    placeholder="Ej: 5"
                  />

                  <TextField
                    label="Notas para el mensajero (opcional)"
                    name="notes"
                    value={notes}
                    onChange={setNotes}
                    autoComplete="off"
                    multiline={3}
                    placeholder="Ej: Llamar al timbre de recepción, código de portal 1234..."
                  />

                  {actionData?.success && (
                    <Banner tone="success">
                      <Text as="p" variant="bodyMd">{actionData.message}</Text>
                    </Banner>
                  )}

                  {actionData?.error && (
                    <Banner tone="critical">
                      <Text as="p" variant="bodyMd">{actionData.error}</Text>
                    </Banner>
                  )}

                  <Button variant="primary" submit loading={isLoading} fullWidth size="large">
                    🚛 Solicitar recogida
                  </Button>
                </BlockStack>
              </fetcher.Form>
            </Card>
          </Box>
        </Layout.Section>

        {/* Brand footer */}
        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
