# MRW Pro — Prompts para Mockups UI/UX

> **Instrucciones de uso:** Cada prompt está diseñado para herramientas de IA generativa de diseño como **Galileo AI**, **Uizard**, **Figma AI**, **v0.dev (Vercel)** o **Bolt.new**. Copia y pega cada prompt por separado. Todos siguen el mismo Design System para coherencia visual.

---

## Prompt Base (Design System)

> Incluye este contexto al inicio de cada prompt o como "system prompt" si la herramienta lo permite:

```
Design System context for ALL screens:
- App type: Shopify Embedded App (admin panel)
- UI Library: Shopify Polaris (mandatory)
- Primary font: Inter (Shopify Polaris default)
- Primary color: #0369A1 (MRW navy blue) — CTAs, headers, navigation
- Secondary/Error color: #DC2626 (MRW red) — alerts, errors, pending badges
- Success color: #059669 (green) — delivered shipments
- Warning color: #D97706 (amber) — in transit, warnings
- Layout: Shopify admin embedded app frame with top bar navigation
- Language: Spanish (Spain)
- Brand: MRW Pro (logistics/shipping app for Shopify merchants)
- Style: Clean, professional, minimal. Follow Shopify Polaris design guidelines strictly.
```

---

## Pantalla 01 — Bienvenida

```
Create a Shopify embedded app welcome/onboarding screen for "MRW Pro", a shipping logistics app.

Route: /app/welcome

Layout:
- Centered content card on a light gray Shopify admin background
- MRW Pro logo at the top (use a placeholder shipping/logistics logo in navy blue #0369A1)
- Below the logo: a 3-step horizontal visual stepper showing: "1. Conecta" → "2. Configura" → "3. Envía" with icons (link icon, gear icon, truck icon). Step 1 is active/highlighted in #0369A1, the rest are gray.
- Supporting text below the stepper: "Esta app conecta con tu contrato MRW propio. Necesitas las credenciales API de tu cuenta MRW de empresa."
- Primary CTA button: "Conectar cuenta MRW" in #0369A1
- Secondary text link below: "¿No tengo mis credenciales MRW?" — subtle link style

Use Shopify Polaris components: Page, Card, Button, TextContainer, Stepper/ProgressBar visual.
Clean, professional, welcoming feel. Spanish language.
```

---

## Pantalla 02 — Conexión MRW

```
Create a Shopify embedded app settings/configuration screen for connecting MRW shipping API credentials.

Route: /app/settings/mrw

Layout:
- Shopify Polaris Page component with title "Conexión MRW"
- Warning Banner (amber/yellow) at the top: "Requisito obligatorio — Contrato MRW con acceso API. Esta app requiere un contrato MRW activo con acceso a MRWLink API."
- Card containing a FormLayout with 4 fields:
  1. "Código de cliente MRW" — TextField (required)
  2. "Franquicia MRW asignada" — TextField (required)
  3. "Password API MRW" — TextField type password (required)
  4. "Número de contrato" — TextField (optional, labeled as opcional)
- Primary Button: "Verificar conexión" in #0369A1
- Below the form: a subtle text link "¿Dónde encuentro mis credenciales MRW?" that opens a help modal

Show TWO states side by side or as variations:
- Success state: Green Banner (#059669) saying "✓ Conexión verificada correctamente. Ya puedes configurar tus envíos."
- Error state: Red Banner (#DC2626) saying "✗ Error de autenticación: código de cliente o password incorrectos" with a link "Ver guía de solución de problemas"

Use Shopify Polaris components: Page, Card, Banner, FormLayout, TextField, Button.
```

---

## Pantalla 02b — Modal de Ayuda Credenciales

```
Create a Shopify Polaris Modal overlay for "MRW Pro" app showing help instructions.

Title: "¿Dónde encuentro mis credenciales MRW?"

Content — 3 numbered steps in a clean layout:
- Paso 1: "Accede a mrw.es > Área de clientes > Empresas" (with a subtle browser/web icon)
- Paso 2: "Ve a Integraciones o Conectores" (with a settings/plugin icon)
- Paso 3: "Tus credenciales están en el apartado MRWLink API" (with a key/credential icon)

Below the steps, a gray info box:
"Si no las encuentras, llama a tu oficina MRW asignada o al 902 300 400 (atención empresas MRW) y solicita las credenciales MRWLink de tu contrato."

Footer: "Cerrar" secondary button on the right.

Use Shopify Polaris Modal component. Clean, helpful, scannable layout. Spanish language.
```

---

## Pantalla 03 — Configuración de Envíos

```
Create a Shopify embedded app shipping configuration screen for "MRW Pro".

Route: /app/settings/shipping

Layout:
- Shopify Polaris Page with title "Configuración de envíos"
- Card 1: "Servicio por defecto"
  - Select dropdown with MRW service options: "MRW Urgente", "MRW Express", "MRW Económico", "MRW Bag"
  - Helper text: "Este servicio se usará para todos los envíos automáticos"

- Card 2: "Peso y dimensiones por defecto"
  - TextField: "Peso por defecto (kg)" with value "2"
  - Two inline TextFields: "Largo (cm)" and "Ancho (cm)" and "Alto (cm)"
  - Helper text: "Se aplicará cuando el pedido no tenga peso configurado"

- Card 3: "Automatización"
  - Checkbox/Toggle: "Crear envío automáticamente al completar el pago" — enabled
  - Checkbox/Toggle: "Enviar email de tracking al cliente" — enabled
  - Checkbox/Toggle: "Enviar SMS de tracking al cliente" — disabled

- Primary Button at bottom: "Guardar configuración"

Use Shopify Polaris: Page, Card, Select, TextField, Checkbox or SettingToggle, Button.
```

---

## Pantalla 04 — Lista de Envíos

```
Create a Shopify embedded app shipment list/management screen for "MRW Pro".

Route: /app/shipments

Layout:
- Shopify Polaris Page with title "Envíos" and a primary action button "Crear envío manual"
- Filter bar at the top: search field + filter by status dropdown + date range picker
- DataTable/IndexTable with columns:
  1. Pedido (#1234)
  2. Cliente (name)
  3. Destino (city, province)
  4. Servicio (MRW Urgente, etc.)
  5. Estado — using Polaris Badges:
     - Blue badge "Creado"
     - Amber/yellow badge "En tránsito"
     - Red badge "Incidencia"
     - Green badge "Entregado"
     - Orange badge "Devuelto"
     - Dark red badge "Error creación"
  6. Fecha (dd/mm/yyyy)
  7. Acciones (3-dot menu or action buttons)

Show 6-8 rows with varied statuses to showcase all badge types.
Include pagination at the bottom.

Use Shopify Polaris: Page, IndexTable, Badge, Filters, TextField, Button, Pagination.
```

---

## Pantalla 05 — Detalle de Envío

```
Create a Shopify embedded app shipment detail screen for "MRW Pro".

Route: /app/shipments/:id

Layout:
- Shopify Polaris Page with title "Envío #MRW-2024-00847" and back arrow to shipment list
- Top section — Two-column layout:
  - Left Card: "Información del envío"
    - Pedido Shopify: #1234
    - Cliente: María García
    - Dirección: Calle Ejemplo 15, 28001 Madrid
    - Servicio: MRW Urgente
    - Peso: 2.5 kg
    - Referencia MRW: 0987654321
    - Estado: Green Badge "Entregado"
  - Right Card: "Etiqueta de envío"
    - Placeholder for shipping label preview (rectangle with barcode illustration)
    - Button: "Descargar etiqueta PDF"

- Middle section — Card: "Seguimiento del envío"
  - Vertical timeline with 4-5 tracking events:
    - ✓ "Envío creado en MRW" — 15/02/2026 09:00
    - ✓ "Recogido por mensajero" — 15/02/2026 14:30
    - ✓ "En tránsito — Centro logístico Madrid" — 16/02/2026 06:00
    - ✓ "En reparto" — 16/02/2026 10:15
    - ✓ "Entregado — Firmado por: M. García" — 16/02/2026 12:45
  - Use green checkmarks and a vertical connecting line

- Bottom section — Action buttons:
  - "Cancelar envío" (destructive/red)
  - "Crear devolución" (secondary)

Use Shopify Polaris: Page, Card, Badge, DescriptionList, Button, Timeline visual.
```

---

## Pantalla 06 — Crear Envío Manual

```
Create a Shopify embedded app manual shipment creation screen for "MRW Pro".

Route: /app/shipments/new

Layout:
- Shopify Polaris Page with title "Crear envío manual" and back navigation

- Card 1: "Seleccionar pedido"
  - Shopify ResourcePicker/SearchField: "Buscar pedido por número o cliente..."
  - Selected order preview showing: #1234 — Juan López — 2 productos — 45,00€

- Card 2: "Servicio de envío"
  - RadioButton group or Select with options:
    - MRW Urgente (entrega día siguiente)
    - MRW Express (entrega 24-48h)
    - MRW Económico (entrega 48-72h)
    - MRW Bag (documentos y sobres)

- Card 3: "Peso y dimensiones"
  - TextField: "Peso (kg)" — value "1.5"
  - Inline fields: "Largo (cm)", "Ancho (cm)", "Alto (cm)"
  - Checkbox: "Usar valores por defecto de configuración"

- Card 4: "Confirmar dirección de destino"
  - Pre-filled address from the Shopify order, editable
  - Fields: Nombre, Dirección, Ciudad, Código postal, Provincia, Teléfono

- Footer actions:
  - Primary: "Crear envío en MRW" (#0369A1)
  - Secondary: "Cancelar"

Use Shopify Polaris: Page, Card, ResourcePicker, RadioButton, TextField, FormLayout, Button.
```

---

## Pantalla 07 — Impresión Batch de Etiquetas

```
Create a Shopify embedded app batch label printing screen for "MRW Pro".

Route: /app/shipments/batch

Layout:
- Shopify Polaris Page with title "Impresión de etiquetas en lote"

- Top section: Selection area
  - IndexTable with checkboxes showing recent shipments (6-8 rows):
    - Columns: ☑ Checkbox, Pedido, Cliente, Destino, Estado (badge), Fecha
    - 4 rows selected (checked), 4 unchecked
  - Bulk action bar at top: "4 envíos seleccionados" with buttons

- Middle section: "Opciones de descarga" Card
  - RadioButton group:
    - "PDF combinado (un archivo con todas las etiquetas)" — selected
    - "ZIP (archivos individuales por etiqueta)"
  - Select: "Formato de etiqueta" with options: A4, 10x15cm, Térmica

- Preview section: Card with grid showing 4 small label thumbnails/placeholders

- Footer actions:
  - Primary: "Descargar 4 etiquetas" (#0369A1)
  - Secondary: "Seleccionar todos"

Use Shopify Polaris: Page, IndexTable, Card, RadioButton, Select, Button, Thumbnail.
```

---

## Pantalla 08 — Lista de Devoluciones

```
Create a Shopify embedded app returns list screen for "MRW Pro".

Route: /app/returns

Layout:
- Shopify Polaris Page with title "Devoluciones" and primary action "Crear devolución"
- Filter bar: search field + status filter dropdown

- DataTable/IndexTable with columns:
  1. Pedido (#1234)
  2. Cliente
  3. Motivo (truncated text)
  4. Estado — Badges:
     - Blue "Solicitada"
     - Amber "En tránsito"
     - Green "Recibida"
     - Red "Incidencia"
  5. Fecha solicitud
  6. Etiqueta — Link/button "Descargar"
  7. Acciones (3-dot menu)

Show 5-6 rows with mixed statuses.
Include pagination.

Use Shopify Polaris: Page, IndexTable, Badge, Button, Filters, Pagination.
```

---

## Pantalla 09 — Crear Devolución

```
Create a Shopify embedded app return creation screen for "MRW Pro".

Route: /app/returns/new

Layout:
- Shopify Polaris Page with title "Crear devolución" and back navigation

- Card 1: "Seleccionar pedido"
  - SearchField: "Buscar pedido entregado..."
  - Selected order card: #1234 — María García — Entregado 14/02/2026

- Card 2: "Motivo de la devolución"
  - Select dropdown: "Producto defectuoso", "Talla incorrecta", "No corresponde con la descripción", "Cambio de opinión", "Otro"
  - TextField multiline: "Notas adicionales (opcional)"

- Card 3: "Dirección de recogida"
  - Pre-filled with customer address, editable
  - Toggle: "Usar dirección del pedido original" — enabled
  - Address fields: Nombre, Dirección, Ciudad, CP, Provincia, Teléfono

- Card 4: "Método de devolución"
  - RadioButton:
    - "Generar etiqueta de devolución MRW (el cliente lleva a punto MRW)"
    - "Solicitar recogida en domicilio"

- Footer:
  - Primary: "Generar etiqueta de devolución" (#0369A1)
  - Secondary: "Cancelar"

Use Shopify Polaris: Page, Card, Select, TextField, RadioButton, FormLayout, Button.
```

---

## Pantalla 10 — Recogidas

```
Create a Shopify embedded app pickup scheduling screen for "MRW Pro".

Route: /app/pickups

Layout:
- Shopify Polaris Page with title "Recogidas" and primary action "Nueva recogida"

- Left section (60%): Calendar/schedule view
  - Monthly calendar grid showing current month (February 2026)
  - Some days highlighted/dotted indicating scheduled pickups
  - Today highlighted in #0369A1
  - 2-3 pickup indicators on different dates

- Right section (40%): "Próximas recogidas" Card
  - List of upcoming pickups:
    - 📦 18/02/2026 — 10:00-14:00 — 5 paquetes — "Confirmada" (green badge)
    - 📦 20/02/2026 — 09:00-13:00 — 3 paquetes — "Pendiente" (amber badge)
    - 📦 22/02/2026 — 10:00-14:00 — 8 paquetes — "Pendiente" (amber badge)

- Bottom Card: "Nueva recogida" form (or this opens as a modal)
  - DatePicker: "Fecha de recogida"
  - Select: "Franja horaria" — "09:00-13:00", "10:00-14:00", "14:00-18:00"
  - TextField: "Número de paquetes"
  - TextField: "Notas para el mensajero (opcional)"
  - Button: "Solicitar recogida" (#0369A1)

Use Shopify Polaris: Page, Card, DatePicker, Select, TextField, Badge, Button, ResourceList.
```

---

## Pantalla 11 — Dashboard

```
Create a Shopify embedded app analytics dashboard screen for "MRW Pro".

Route: /app/dashboard

Layout:
- Shopify Polaris Page with title "Dashboard" and date range selector (top right): "Últimos 7 días"

- Top row: 4 metric cards in a horizontal grid
  1. "Envíos hoy" — Large number "12" — with small up arrow "+3 vs ayer" in green
  2. "En tránsito" — Large number "28" — amber/warning colored indicator (#D97706)
  3. "Incidencias activas" — Large number "3" — red indicator (#DC2626) — link "Ver todas"
  4. "Entregados (semana)" — Large number "87" — green indicator (#059669)

- Middle section: Card with bar chart
  - Title: "Envíos por día — Última semana"
  - Horizontal bar chart or vertical bar chart with 7 bars (Lun-Dom)
  - Bars colored in #0369A1
  - Values: Mon 18, Tue 22, Wed 15, Thu 20, Fri 25, Sat 8, Sun 2

- Bottom row: Two cards side by side
  - Left Card: "Incidencias recientes"
    - 3 items list with red badges:
      - "#1847 — Dirección incorrecta — hace 2h"
      - "#1839 — Ausente en domicilio — hace 5h"
      - "#1832 — Paquete dañado — hace 1d"
    - Link: "Ver todas las incidencias"
  - Right Card: "Distribución por servicio"
    - Simple horizontal bars or donut chart:
      - MRW Urgente: 45%
      - MRW Express: 35%
      - MRW Económico: 15%
      - MRW Bag: 5%

Use Shopify Polaris: Page, Card, DataVisualization/BarChart, Badge, ResourceList, Select.
Modern, clean dashboard. Data visualization clear and readable.
```

---

## Pantalla 12 — Facturación

```
Create a Shopify embedded app billing/subscription screen for "MRW Pro".

Route: /app/billing

Layout:
- Shopify Polaris Page with title "Facturación y plan"

- Top Card: "Tu plan actual"
  - Plan name: "MRW Pro — Plan Profesional" with a blue badge "Activo"
  - Price: "29,99€/mes"
  - Description: "Hasta 500 envíos/mes + todas las funcionalidades"
  - Usage bar/progress:
    - "Envíos este mes: 342 / 500" with a progress bar at ~68% filled in #0369A1
    - Helper text: "Te quedan 158 envíos en tu ciclo actual (renueva el 01/03/2026)"
  - Buttons: "Cambiar plan" (secondary), "Cancelar suscripción" (plain/destructive)

- Middle section: Pricing cards — 3 plans side by side
  - Plan Básico: 9,99€/mes — 100 envíos/mes — Funciones básicas — "Downgrade" button
  - Plan Profesional: 29,99€/mes — 500 envíos/mes — Todas las funciones — Current (highlighted border in #0369A1) — "Plan actual" badge
  - Plan Enterprise: 79,99€/mes — Envíos ilimitados — Soporte prioritario + API — "Upgrade" button (#0369A1)

- Bottom Card: "Historial de facturación"
  - Simple table: Fecha, Concepto, Importe, Estado, Factura
  - 3 rows:
    - 01/02/2026 — Plan Profesional — 29,99€ — Pagado (green) — "Descargar"
    - 01/01/2026 — Plan Profesional — 29,99€ — Pagado (green) — "Descargar"
    - 01/12/2025 — Plan Básico — 9,99€ — Pagado (green) — "Descargar"

Use Shopify Polaris: Page, Card, ProgressBar, Button, Badge, DataTable, CalloutCard.
```

---

## Pantalla Extra — Estados Globales

> Estos prompts cubren los estados transversales que aplican a múltiples pantallas:

### Estado: Credenciales No Verificadas

```
Create a Shopify Polaris warning banner that appears persistently at the top of any app screen.

Banner type: Warning (amber)
Message: "⚠ Verifica tu conexión MRW para empezar a crear envíos"
Action button inside banner: "Verificar ahora" — links to /app/settings/mrw
Dismissable: No (persistent until credentials verified)

Show this banner above a grayed-out/disabled shipment list to demonstrate the blocked state.
```

### Estado: Cargando (Skeleton)

```
Create a Shopify Polaris skeleton loading state for a shipment list screen.

Show the full page layout of the shipments list (/app/shipments) but with:
- Skeleton body text for the page title
- SkeletonDisplayText for filters
- SkeletonBodyText rows in the DataTable area (6 rows)
- Gray animated placeholder blocks where badges and buttons would be
- NO spinner — use only Polaris Skeleton components

Clean, professional loading state following Shopify Polaris patterns.
```

### Estado: Sin Datos (Empty State)

```
Create a Shopify Polaris EmptyState screen for the shipments list when there are no shipments yet.

Layout:
- Shopify Polaris EmptyState component centered on page
- Illustration: Placeholder shipping box illustration (use Polaris empty state illustration style)
- Heading: "Aún no tienes envíos"
- Description: "Cuando se complete un pedido en tu tienda, los envíos aparecerán aquí automáticamente. También puedes crear uno manualmente."
- Primary CTA: "Crear envío manual" (#0369A1)
- Secondary link: "Configurar envíos automáticos"

Clean, encouraging, not overwhelming. Spanish language.
```

### Estado: Error de Red

```
Create a Shopify Polaris error state with a red banner for network errors.

Banner type: Critical (red #DC2626)
Message: "No se pudo conectar con MRW. Comprueba tu conexión a Internet e inténtalo de nuevo."
Action button: "Reintentar" (secondary button style)

Show this at the top of a shipment detail page with the content area showing a subtle error illustration.
```

---

## Notas para el Diseñador / IA

1. **Consistencia**: Todas las pantallas deben usar el mismo header con navegación lateral (Shopify admin frame) y los mismos colores del Design System.
2. **Responsive**: Los mockups deben considerar vista desktop (1440px) como principal, pero el layout debe funcionar en tablets.
3. **Badges de estado**: Son un diferenciador clave de la app. Usar siempre los mismos colores: Azul=Creado, Amarillo=Tránsito, Rojo=Incidencia, Verde=Entregado, Naranja=Devuelto, Rojo oscuro=Error.
4. **Polaris obligatorio**: La app será revisada por Shopify para publicarse en su App Store. El uso de Polaris no es opcional.
5. **Idioma**: Todo en español de España. Usar "envío" (no "despacho"), "recogida" (no "pickup"), "facturación" (no "billing" visible al usuario).
