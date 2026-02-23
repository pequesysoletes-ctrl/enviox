# Correos Pro — Prompts para Google Stitch + Guía de Workflow

> **Versión optimizada para stitch.withgoogle.com**
> Febrero 2026

---

## PARTE 1: Cómo usar estos prompts en Stitch

### Flujo de trabajo recomendado

```
Por cada pantalla:
1. Copia el prompt en Stitch (modo Experimental para pantallas complejas)
2. Genera → Revisa → Itera con el chat ("cambia X", "alinea Y")
3. Cuando estés satisfecho → Exportar ZIP (imagen + HTML/CSS)
4. Repite para las 17 pantallas
5. Al final: unifica todo (ver Parte 3)
```

### Configuración en Stitch

- **Modo Standard** (Gemini Flash, 350/mes): Pantallas simples → 01, 02b, 08, 09, 12
- **Modo Experimental** (Gemini Pro, 200/mes): Pantallas complejas → 02, 03, 04, 05, 06, 07, 10, 11
- **Plataforma**: Selecciona siempre **"Web"** (no mobile)
- **Tema**: Light

### Tips para mejores resultados en Stitch

- Si la primera generación no clava los colores, usa el chat: "Change Correos Standard badges to #D4351C and Express badges to #1C4F8A"
- Si corta la pantalla (solo muestra una parte), di: "Show the complete page with all sections visible"
- Si los elementos no están alineados, di: "Fix alignment, center all cards and use consistent spacing"
- Stitch entiende mejor inglés que español. Los prompts están en inglés pero el CONTENIDO de la UI está en español

---

## PARTE 2: Los 17 Prompts adaptados para Stitch

---

### PANTALLA 01 — Bienvenida

```
Web app onboarding welcome screen for "Correos Pro", a dual-carrier shipping logistics SaaS for Spanish postal services (Correos Standard + Correos Express).

Colors: Correos Standard red #D4351C, Correos Express blue #1C4F8A, background light gray #F6F6F7.
Font: Inter. Style: clean, minimal, professional admin panel.

Centered white card on gray background containing:
- Top: "Correos Pro" logo text in red #D4351C, bold, large. Below it a subtle tagline: "Correos Standard + Correos Express en una sola app"
- 3-step horizontal stepper with icons:
  Step 1 "Conecta" (link icon) — active, highlighted in #D4351C
  Step 2 "Configura reglas" (settings/routing icon) — gray inactive
  Step 3 "Envía" (truck icon) — gray inactive
- Text below: "Esta app conecta con tu contrato Correos Ecommerce propio. Necesitas las credenciales API de tu cuenta de empresa en Correos."
- Large primary button: "Empezar configuración" — background #D4351C, white text
- Small text link below: "¿No tengo mis credenciales Correos?"

All text in Spanish. Clean and welcoming.
```

---

### PANTALLA 02 — Conexión Correos (Dual Carrier)

```
Web app settings form screen for "Correos Pro" shipping SaaS. This screen has TWO separate credential sections because it supports two carriers: Correos Standard and Correos Express.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A, success #059669, warning #D97706. Font: Inter.
Light gray background #F6F6F7 with white cards.

Page title at top: "Conexión Correos"

Warning banner (amber/yellow background #FEF3C7, border #D97706):
"Requisito obligatorio — Necesitas al menos un contrato activo: Correos Ecommerce o Correos Express con acceso API."

SECTION A — White card with red left border (#D4351C):
Title: "Correos Standard" with a small red postal icon
- Form with 2 input fields:
  1. "Código contrato Correos" — text input, required
  2. "Password API Correos" — password input with eye toggle, required
- Button: "Verificar Standard" in #D4351C
- Below: Green success banner: "✓ Correos Standard conectado correctamente"
- Small label: "(Opcional si solo usas Correos Express)"

SECTION B — White card with blue left border (#1C4F8A):
Title: "Correos Express" with a small blue express/speed icon
- Form with 2 input fields:
  1. "Código contrato Correos Express" — text input, required
  2. "Password API CE" — password input with eye toggle, required
- Button: "Verificar Express" in #1C4F8A
- Below: Red error banner: "✗ Error: credenciales de Correos Express incorrectas"
- Small label: "(Opcional si solo usas Correos Standard)"

Bottom of page: Small link "¿Dónde encuentro mis credenciales?" and a note: "Al menos una conexión debe estar verificada para continuar."

All text in Spanish.
```

---

### PANTALLA 02b — Modal Ayuda Credenciales

```
Web app modal dialog overlay for "Correos Pro".

Colors: Correos Standard #D4351C, Correos Express #1C4F8A. Font: Inter. Semi-transparent dark backdrop behind white modal.

Modal title: "¿Dónde encuentro mis credenciales?"

Content — TWO sections clearly separated:

SECTION 1 with red accent (#D4351C):
Subtitle: "Correos Standard"
3 numbered steps, each with a small icon:
1. (globe icon) "Accede a empresas.correos.es > Mi cuenta"
2. (settings icon) "Ve a Integraciones > API Ecommerce"
3. (key icon) "Tus credenciales están en el apartado de Pre-registro API"

SECTION 2 with blue accent (#1C4F8A):
Subtitle: "Correos Express"
3 numbered steps:
1. (globe icon) "Accede a correosexpress.es > Área privada"
2. (settings icon) "Ve a Integraciones"
3. (key icon) "Solicita las credenciales API a tu delegación Correos Express"

Gray info box below:
"Si tienes contrato activo con Correos o Correos Express, las credenciales existen. Si ya usaste la app oficial de Correos, tus credenciales son las mismas. Contacta con tu gestor comercial si necesitas ayuda."

Footer with "Cerrar" button aligned right.

All text in Spanish. Clean, helpful, easy to scan.
```

---

### PANTALLA 03 — Reglas de Enrutamiento (EXCLUSIVA CORREOS PRO)

```
Web app routing rules configuration screen for "Correos Pro" shipping SaaS. This is the key differentiating feature: an automatic routing engine that decides whether to ship with Correos Standard (red) or Correos Express (blue).

Colors: Correos Standard #D4351C, Correos Express #1C4F8A, background #F6F6F7. Font: Inter. White cards on gray background.

Page title: "Reglas de enrutamiento"
Subtitle: "Define qué transportista usar automáticamente para cada pedido"

TOP SECTION — Card with a data table showing routing rules:
Table columns: Prioridad | Condición | Transportista | Servicio | Acciones
- Row 1: 1 | Peso > 3 kg | Red badge "Correos Standard" | Paquete Azul | ✏️ 🗑️
- Row 2: 2 | Importe > 200€ | Blue badge "Correos Express" | Express 24h | ✏️ 🗑️
- Row 3: 3 | Provincia = Canarias | Red badge "Correos Standard" | Internacional | ✏️ 🗑️
- Row 4: 4 | Método envío = Express | Blue badge "Correos Express" | Express 24h | ✏️ 🗑️
- Row 5 (gray background, no delete): ∞ | Por defecto | Red badge "Correos Standard" | Paq Estándar | ✏️
- Button below table: "+ Añadir regla" — outlined button

MIDDLE SECTION — Card "Simulador" with light blue background tint:
Title: "🧪 Simulador de enrutamiento"
Subtitle: "Prueba qué regla se aplicaría a un pedido"
- 4 inline input fields:
  "Peso (kg)" showing "1.5" | "Importe (€)" showing "45" | "Provincia" dropdown showing "Madrid" | "Método envío" dropdown showing "Estándar"
- Button: "Simular" outlined
- Result area below showing:
  Arrow icon → "Se aplicaría: Regla por defecto → Correos Standard — Paq Estándar"
  With the result highlighted in a green success box

BOTTOM — Small amber warning card:
"⚠ Tienes 1 regla que apunta a Correos Express, pero Correos Express no está conectado."
With link: "Conectar Correos Express →"

All text in Spanish. Clean, professional, functional.
```

---

### PANTALLA 04 — Lista de Envíos (con Badge Carrier)

```
Web app data table screen for "Correos Pro" shipping management SaaS. Key difference from a single-carrier app: each shipment shows which carrier was used (Correos Standard in red or Correos Express in blue).

Colors: Correos Standard #D4351C, Correos Express #1C4F8A, success #059669, warning #D97706, error #DC2626. Font: Inter.
Background #F6F6F7, white card containing the table.

Page title: "Envíos" with primary button top-right "Crear envío manual" in #D4351C.

Filter bar: search input + carrier dropdown filter (Todos, Correos Standard, Correos Express) + status dropdown + date range picker.

Data table with 8 rows and these columns:
Pedido | Cliente | Destino | Transportista | Servicio | Estado | Fecha | Acciones

Sample rows with CARRIER BADGES and STATUS BADGES:
- #2047 | María García | Madrid | RED badge "Standard" | Paq Estándar | BLUE badge "Creado" | 17/02/2026 | ⋯
- #2046 | Juan López | Barcelona | BLUE badge "Express" | Express 24h | AMBER badge "En tránsito" | 16/02/2026 | ⋯
- #2045 | Ana Martín | Valencia | RED badge "Standard" | Paq Premium | GREEN badge "Entregado" | 16/02/2026 | ⋯
- #2044 | Pedro Ruiz | Sevilla | RED badge "Standard" | Paquete Azul | RED badge "Incidencia" | 15/02/2026 | ⋯
- #2043 | Laura Díaz | Bilbao | BLUE badge "Express" | Express 24h | GREEN badge "Entregado" | 15/02/2026 | ⋯
- #2042 | Carlos Sanz | Málaga | RED badge "Standard" | Paq Estándar | ORANGE badge "Devuelto" | 14/02/2026 | ⋯
- #2041 | Elena Vega | Zaragoza | BLUE badge "Express" | Express 48h | AMBER badge "En tránsito" | 14/02/2026 | ⋯
- #2040 | David Moreno | Las Palmas | RED badge "Standard" | Internacional | DARK RED badge "Error creación" | 13/02/2026 | ⋯

Carrier badge colors: Standard red #D4351C, Express blue #1C4F8A.
Status badge colors: blue #0369A1 (Creado), amber #D97706 (En tránsito), green #059669 (Entregado), red #DC2626 (Incidencia), orange #EA580C (Devuelto), dark red #991B1B (Error).

Pagination at bottom: "Mostrando 1-8 de 456 envíos" with page numbers.

All text in Spanish.
```

---

### PANTALLA 05 — Detalle de Envío

```
Web app detail page for "Correos Pro" shipping SaaS. Shows one shipment's full information with carrier-colored timeline.

Colors: Correos Standard #D4351C, success #059669. Font: Inter. Background #F6F6F7.

Top: back arrow + page title "Envío #COR-2026-02047"
Next to the title: Red carrier badge "Correos Standard"

Two cards side by side:

LEFT CARD — "Información del envío":
- Pedido Shopify: #2047
- Cliente: María García
- Dirección: Calle Ejemplo 15, 28001 Madrid
- Transportista: Correos Standard (with small red dot)
- Servicio: Paq Estándar
- Peso: 2.5 kg
- Localizador Correos: PQ4E7X0002345
- Regla aplicada: "Por defecto → Paq Estándar" (subtle gray text)
- Estado: green badge "Entregado"

RIGHT CARD — "Etiqueta de envío":
- Gray placeholder rectangle representing a Correos shipping label with barcode lines
- Button: "Descargar etiqueta PDF" in #D4351C

BELOW — Card "Seguimiento del envío":
Vertical timeline with checkmarks and connecting line, colored in #D4351C (red for Standard):
✓ "Pre-registrado en Correos" — 15/02/2026 09:00
✓ "Admitido en oficina origen" — 15/02/2026 14:30
✓ "En tránsito — Centro logístico Madrid" — 16/02/2026 06:00
✓ "En reparto" — 16/02/2026 10:15
✓ "Entregado — Firmado por: M. García" — 16/02/2026 12:45

BOTTOM — Two buttons:
- Red destructive button: "Cancelar envío"
- Secondary outlined button: "Crear devolución"

All text in Spanish.
```

---

### PANTALLA 06 — Crear Envío Manual

```
Web app form screen for creating a manual shipment in "Correos Pro" shipping SaaS. Includes a rule preview showing which carrier would be automatically selected.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A. Font: Inter. Background #F6F6F7. White cards.

Top: back arrow + title "Crear envío manual"

Card 1 — "Seleccionar pedido":
- Search input: "Buscar pedido por número o cliente..."
- Selected result below: card showing "#2047 — Juan López — 2 productos — 45,00€"

Card 2 — "Transportista y servicio":
- Info box with light background showing the automatic rule result:
  "🔀 Regla aplicada: Por defecto → Correos Standard — Paq Estándar"
- Below: Toggle/checkbox: "☐ Cambiar transportista manualmente (override)"
- When override is checked, show radio button group:
  ● Correos Standard (red dot) — with service dropdown: "Paq Estándar", "Paq Premium", "Paquete Azul", "Carta Certificada"
  ○ Correos Express (blue dot) — with service dropdown: "Express 24h", "Express 48h", "Paq Empresa 14"

Card 3 — "Peso y dimensiones":
- Input "Peso (kg)" showing "1.5"
- Three inline inputs: "Largo (cm)", "Ancho (cm)", "Alto (cm)"
- Checkbox: "Usar valores por defecto de configuración"

Card 4 — "Dirección de destino":
- Pre-filled form fields: Nombre, Dirección, Ciudad, Código postal, Provincia, Teléfono

Footer buttons:
- Primary: "Crear envío" in #D4351C
- Secondary: "Cancelar" outlined

All text in Spanish.
```

---

### PANTALLA 07 — Impresión Batch de Etiquetas

```
Web app batch label printing screen for "Correos Pro" shipping SaaS. Labels are grouped by carrier for organized printing.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A. Font: Inter. Background #F6F6F7.

Page title: "Impresión de etiquetas en lote"

Table with checkboxes on each row (8 rows), 5 checked and highlighted:
Columns: ☑ | Pedido | Cliente | Transportista badge | Destino | Estado badge | Fecha
- Show mix of red "Standard" badges and blue "Express" badges in the Transportista column
- Show bulk action bar: "5 envíos seleccionados (3 Standard + 2 Express)"

Card below — "Opciones de descarga":
- Radio buttons for grouping:
  ● "Separar por transportista (un PDF para Standard + un PDF para Express)" — selected
  ○ "PDF combinado (todas las etiquetas juntas)"
  ○ "ZIP (archivos individuales)"
- Dropdown: "Formato de etiqueta" with "10x15cm" selected

Preview area: Two groups shown side by side:
- Left group with red header "Correos Standard (3)": 3 small gray label thumbnail rectangles
- Right group with blue header "Correos Express (2)": 2 small gray label thumbnail rectangles

Footer:
- Primary button: "Descargar 5 etiquetas" in #D4351C
- Secondary: "Seleccionar todos"

All text in Spanish.
```

---

### PANTALLA 08 — Lista de Devoluciones

```
Web app returns list screen for "Correos Pro" shipping SaaS.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A, status badges: blue #0369A1, amber #D97706, green #059669, red #DC2626. Font: Inter.

Page title: "Devoluciones" with button top-right "Crear devolución" in #D4351C.
Filter bar: search + carrier dropdown + status dropdown.

Data table with 6 rows:
Pedido | Cliente | Transportista | Motivo | Estado | Fecha | Etiqueta | Acciones

- #2047 | María García | RED "Standard" | Producto defectuoso | BLUE "Solicitada" | 17/02 | Descargar | ⋯
- #2043 | Juan López | BLUE "Express" | Talla incorrecta | AMBER "En tránsito" | 16/02 | Descargar | ⋯
- #2040 | Ana Martín | RED "Standard" | Cambio de opinión | GREEN "Recibida" | 15/02 | Descargar | ⋯
- #2038 | Pedro Ruiz | BLUE "Express" | No corresponde | RED "Incidencia" | 14/02 | Descargar | ⋯
- #2035 | Laura Díaz | RED "Standard" | Producto defectuoso | GREEN "Recibida" | 13/02 | Descargar | ⋯
- #2033 | Carlos Sanz | RED "Standard" | Talla incorrecta | AMBER "En tránsito" | 12/02 | Descargar | ⋯

Pagination at bottom.
All text in Spanish.
```

---

### PANTALLA 09 — Crear Devolución

```
Web app return creation form for "Correos Pro" shipping SaaS.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A. Font: Inter. Background #F6F6F7. White cards.

Top: back arrow + title "Crear devolución"

Card 1 — "Seleccionar pedido":
- Search input: "Buscar pedido entregado..."
- Selected: "#2047 — María García — Entregado 14/02/2026 — via Correos Standard" (with small red carrier badge)

Card 2 — "Motivo de la devolución":
- Dropdown: "Producto defectuoso", "Talla incorrecta", "No corresponde con la descripción", "Cambio de opinión", "Otro"
- Textarea: "Notas adicionales (opcional)"

Card 3 — "Transportista para la devolución":
- Radio buttons with colored dots:
  ● (red dot) "Correos Standard — Paq Retorno" — selected
  ○ (blue dot) "Correos Express — Retorno Express"
- Helper text: "El transportista de devolución puede ser diferente al del envío original"

Card 4 — "Dirección de recogida":
- Toggle ON: "Usar dirección del pedido original"
- Form fields pre-filled: Nombre, Dirección, Ciudad, CP, Provincia, Teléfono

Card 5 — "Método de devolución":
- Radio buttons:
  ● "Generar etiqueta (el cliente lleva a oficina Correos)" — selected
  ○ "Solicitar recogida en domicilio"

Footer:
- Primary: "Generar etiqueta de devolución" in #D4351C
- Secondary: "Cancelar"

All text in Spanish.
```

---

### PANTALLA 10 — Recogidas

```
Web app pickup scheduling screen for "Correos Pro" shipping SaaS. Supports scheduling pickups for both carriers.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A, success #059669, warning #D97706. Font: Inter. Background #F6F6F7.

Page title: "Recogidas" with button "Nueva recogida" in #D4351C.

TOP — Carrier tab selector:
Two tabs side by side: "Correos Standard" (red underline, active) | "Correos Express" (blue, inactive)

Two-column layout:

LEFT (60%) — Monthly calendar for February 2026.
- Today (17) highlighted with #D4351C circle
- Days 18, 20, 22 have small colored dot indicators:
  Day 18: red dot (Standard pickup)
  Day 20: blue dot (Express pickup)
  Day 22: red dot (Standard pickup)
- Clean grid with Lun-Dom headers

RIGHT (40%) — Card "Próximas recogidas":
- 📦 18/02/2026 — 10:00-14:00 — 5 paquetes — RED "Standard" badge — green badge "Confirmada"
- 📦 20/02/2026 — 09:00-13:00 — 3 paquetes — BLUE "Express" badge — amber badge "Pendiente"
- 📦 22/02/2026 — 10:00-14:00 — 8 paquetes — RED "Standard" badge — amber badge "Pendiente"

BELOW — Card "Nueva recogida" form:
- Radio buttons for carrier: ● Correos Standard (red) ○ Correos Express (blue)
- Date picker: "Fecha de recogida"
- Dropdown: "Franja horaria" — 09:00-13:00, 10:00-14:00, 14:00-18:00
- Input: "Número de paquetes"
- Input: "Notas para el cartero/mensajero (opcional)"
- Button: "Solicitar recogida" in #D4351C

All text in Spanish.
```

---

### PANTALLA 11 — Dashboard

```
Web app analytics dashboard for "Correos Pro" shipping management SaaS. Shows global metrics plus breakdown by carrier (Standard vs Express).

Colors: Correos Standard #D4351C, Correos Express #1C4F8A, error #DC2626, success #059669, warning #D97706. Font: Inter. Background #F6F6F7.

Page title: "Dashboard" with date selector top-right showing "Últimos 7 días".

TOP ROW — 4 metric cards horizontally:
1. "Envíos hoy" — large "18" — green small text "+5 vs ayer" with up arrow
2. "En tránsito" — large "34" — amber #D97706 indicator dot
3. "Incidencias activas" — large "4" — red #DC2626 indicator — small link "Ver todas"
4. "Entregados (semana)" — large "112" — green #059669 indicator

SECOND ROW — 2 small metric cards:
- "Correos Standard esta semana" — "78 envíos" — with red dot #D4351C — "70% del total"
- "Correos Express esta semana" — "34 envíos" — with blue dot #1C4F8A — "30% del total"

MIDDLE — Card with bar chart:
Title: "Envíos por día — Última semana"
7 vertical bars, each bar SPLIT in two colors (stacked bar chart):
- Bottom part red (#D4351C) = Standard
- Top part blue (#1C4F8A) = Express
Lun(12+5) Mar(15+7) Mié(10+5) Jue(14+6) Vie(18+7) Sáb(6+3) Dom(3+1)
Y-axis with numbers. Small legend: red square "Standard" + blue square "Express"

BOTTOM ROW — Two cards side by side:

Left card "Incidencias recientes":
- "#2044 — Dirección incorrecta — hace 2h" with RED "Standard" carrier badge
- "#2039 — Ausente en domicilio — hace 5h" with BLUE "Express" carrier badge
- "#2032 — Paquete dañado — hace 1d" with RED "Standard" carrier badge
- Link: "Ver todas las incidencias"

Right card "Distribución por servicio":
Horizontal progress bars:
- Paq Estándar: 35% in #D4351C
- Paq Premium: 15% in lighter red
- Paquete Azul: 10% in pink-red
- Express 24h: 25% in #1C4F8A
- Express 48h: 10% in lighter blue
- Otros: 5% in gray

All text in Spanish.
```

---

### PANTALLA 12 — Facturación

```
Web app billing and subscription screen for "Correos Pro" shipping SaaS.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A. Font: Inter. Background #F6F6F7.

Page title: "Facturación y plan"

TOP CARD — "Tu plan actual":
- "Plan Profesional" with green badge "Activo"
- Price: "49,00€/mes"
- "Envíos ilimitados + Motor de reglas + Soporte prioritario"
- Progress bar section showing carrier breakdown:
  "Envíos este mes: 342 total"
  Two stacked bars:
  - Red bar (#D4351C): "Correos Standard: 245 envíos (72%)"
  - Blue bar (#1C4F8A): "Correos Express: 97 envíos (28%)"
- Small text: "Renueva el 01/03/2026"
- Buttons: "Cambiar plan" secondary, "Cancelar suscripción" text red

MIDDLE — 3 pricing cards side by side:
1. "Starter" — 29,00€/mes — 200 envíos/mes (Standard + Express combinados) — Reglas básicas — "Downgrade" outlined button
2. "Profesional" — 49,00€/mes — Envíos ilimitados — Motor de reglas completo — highlighted border #D4351C — badge "Plan actual"
3. "Business" — 99,00€/mes — Ilimitados — Reglas avanzadas — Multi-cuenta — Soporte dedicado — "Upgrade" button #D4351C

BOTTOM CARD — "Historial de facturación":
Simple table: Fecha | Concepto | Importe | Estado | Factura
- 01/02/2026 | Plan Profesional | 49,00€ | green "Pagado" | Descargar
- 01/01/2026 | Plan Profesional | 49,00€ | green "Pagado" | Descargar
- 01/12/2025 | Plan Starter | 29,00€ | green "Pagado" | Descargar

All text in Spanish.
```

---

### ESTADOS GLOBALES — Credenciales No Verificadas

```
Web app screen showing a warning banner at the top of a shipping list page for "Correos Pro".

Colors: warning #D97706, Correos Standard #D4351C. Font: Inter. Background #F6F6F7.

Persistent amber warning banner at the very top:
"⚠ Conecta al menos Correos Standard o Correos Express para empezar a crear envíos" with button "Configurar ahora"

Below the banner: the shipments list table is visible but grayed out and disabled, showing it cannot be used until at least one carrier is connected. Overlay or reduced opacity effect.

All text in Spanish.
```

---

### ESTADOS GLOBALES — Cargando (Skeleton)

```
Web app loading skeleton state for a shipping list page for "Correos Pro".

Colors: light gray placeholders on white. Font: Inter. Background #F6F6F7.

Show the shipments list page layout with ALL content replaced by animated gray skeleton blocks:
- Page title: wide gray rectangle
- Filter bar: 4 gray rounded rectangles (search + carrier filter + status filter + date)
- Table: 6 rows of gray bars of varying widths simulating columns (including carrier badge placeholder)
- No spinner anywhere — only flat gray animated pulse placeholders
- Pagination: small gray blocks at bottom

Clean, professional loading state. The shapes should suggest the table structure without showing real data.
```

---

### ESTADOS GLOBALES — Sin Datos (Empty State)

```
Web app empty state for a shipping list page with no data yet for "Correos Pro".

Colors: Correos Standard #D4351C. Font: Inter. Background #F6F6F7.

Page title: "Envíos"

Centered on the page:
- Simple line illustration of a postal/shipping box with Correos-style postal elements (minimal, not too detailed)
- Heading: "Aún no tienes envíos"
- Description: "Cuando se complete un pedido en tu tienda, los envíos se crearán automáticamente según tus reglas de enrutamiento. También puedes crear uno manualmente."
- Primary button: "Crear envío manual" in #D4351C
- Small link below: "Configurar reglas de enrutamiento"

Encouraging and clean, not overwhelming. All text in Spanish.
```

---

### ESTADOS GLOBALES — Error de Red

```
Web app error state for a shipping detail page with network failure for "Correos Pro".

Colors: error #DC2626. Font: Inter. Background #F6F6F7.

Red error banner at the top:
"No se pudo conectar con Correos. Comprueba tu conexión a Internet e inténtalo de nuevo."
With button: "Reintentar"

Below the banner: page content area showing a subtle gray disconnection icon or cloud-error illustration centered, with faded/empty content area.

All text in Spanish.
```

---

## PARTE 3: Workflow completo — De Stitch a entregable final

### Opción A: Solo con ZIP export (lo más rápido)

Stitch te da un ZIP por pantalla que contiene la **imagen PNG** del mockup y el **código HTML/CSS**. Esto es suficiente si:

- Necesitas los mockups para presentar al equipo o a un stakeholder
- Quieres el HTML como punto de partida para desarrollo
- No necesitas un prototipo interactivo (con navegación clickable entre pantallas)

**Pasos:**

```
1. GENERA cada pantalla en Stitch y exporta ZIP
2. ORGANIZA en carpetas:
   CorreosPro_Mockups/
   ├── 01_bienvenida/
   │   ├── mockup.png
   │   └── index.html
   ├── 02_conexion_correos/
   │   ├── mockup.png
   │   └── index.html
   ├── 02b_modal_ayuda/
   ├── 03_reglas_enrutamiento/
   ├── 04_lista_envios/
   ├── 05_detalle_envio/
   ├── 06_crear_envio/
   ├── 07_batch_print/
   ├── 08_lista_devoluciones/
   ├── 09_crear_devolucion/
   ├── 10_recogidas/
   ├── 11_dashboard/
   ├── 12_facturacion/
   └── estados_globales/
       ├── credenciales_warning.png
       ├── skeleton.png
       ├── empty_state.png
       └── error_red.png

3. CREA un index.html maestro (ver plantilla abajo)
4. REVISA consistencia visual entre pantallas
5. AJUSTA los HTML si hay diferencias de colores o estilos entre pantallas
```

### Plantilla: index.html maestro para unificar todas las pantallas

Crea este archivo en la raíz de tu carpeta para navegar fácilmente:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Correos Pro — Mockups UI/UX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; background: #F6F6F7; color: #1a1a1a; }
    .header { background: #D4351C; color: white; padding: 24px 40px; }
    .header h1 { font-size: 24px; font-weight: 600; }
    .header p { opacity: 0.8; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; padding: 40px; }
    .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.2s; cursor: pointer; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .card img { width: 100%; height: 220px; object-fit: cover; object-position: top; border-bottom: 1px solid #eee; }
    .card .info { padding: 16px; }
    .card .info h3 { font-size: 15px; font-weight: 600; }
    .card .info p { font-size: 13px; color: #666; margin-top: 4px; }
    .card .info .route { font-size: 12px; color: #D4351C; font-family: monospace; margin-top: 8px; }
    .section-title { padding: 40px 40px 0; font-size: 18px; font-weight: 600; color: #333; }
    a { text-decoration: none; color: inherit; }
    .badge { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
    .badge-standard { background: #FEE2E2; color: #D4351C; }
    .badge-express { background: #DBEAFE; color: #1C4F8A; }
    .badge-exclusive { background: #FEF3C7; color: #92400E; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Correos Pro — Mockups UI/UX</h1>
    <p>17 pantallas · Shopify Embedded App · Dual Carrier (Standard + Express) · Febrero 2026</p>
  </div>

  <h2 class="section-title">Flujo principal</h2>
  <div class="grid">
    <a href="01_bienvenida/index.html" class="card">
      <img src="01_bienvenida/mockup.png" alt="Bienvenida">
      <div class="info">
        <h3>01 — Bienvenida</h3>
        <p>Onboarding y conexión inicial</p>
        <div class="route">/app/welcome</div>
      </div>
    </a>
    <a href="02_conexion_correos/index.html" class="card">
      <img src="02_conexion_correos/mockup.png" alt="Conexión Correos">
      <div class="info">
        <h3>02 — Conexión Correos <span class="badge badge-standard">Standard</span> + <span class="badge badge-express">Express</span></h3>
        <p>Credenciales API dual carrier</p>
        <div class="route">/app/settings/correos</div>
      </div>
    </a>
    <a href="02b_modal_ayuda/index.html" class="card">
      <img src="02b_modal_ayuda/mockup.png" alt="Modal Ayuda">
      <div class="info">
        <h3>02b — Modal Ayuda</h3>
        <p>Guía credenciales Standard + Express</p>
        <div class="route">Modal overlay</div>
      </div>
    </a>
    <a href="03_reglas_enrutamiento/index.html" class="card">
      <img src="03_reglas_enrutamiento/mockup.png" alt="Reglas Enrutamiento">
      <div class="info">
        <h3>03 — Reglas de Enrutamiento <span class="badge badge-exclusive">EXCLUSIVA</span></h3>
        <p>Motor de reglas + simulador en tiempo real</p>
        <div class="route">/app/settings/routing</div>
      </div>
    </a>
  </div>

  <h2 class="section-title">Gestión de envíos</h2>
  <div class="grid">
    <a href="04_lista_envios/index.html" class="card">
      <img src="04_lista_envios/mockup.png" alt="Lista Envíos">
      <div class="info">
        <h3>04 — Lista Envíos</h3>
        <p>DataTable con badges carrier + estado</p>
        <div class="route">/app/shipments</div>
      </div>
    </a>
    <a href="05_detalle_envio/index.html" class="card">
      <img src="05_detalle_envio/mockup.png" alt="Detalle Envío">
      <div class="info">
        <h3>05 — Detalle Envío</h3>
        <p>Timeline con colores por carrier</p>
        <div class="route">/app/shipments/:id</div>
      </div>
    </a>
    <a href="06_crear_envio/index.html" class="card">
      <img src="06_crear_envio/mockup.png" alt="Crear Envío">
      <div class="info">
        <h3>06 — Crear Envío Manual</h3>
        <p>Preview regla + override carrier</p>
        <div class="route">/app/shipments/new</div>
      </div>
    </a>
    <a href="07_batch_print/index.html" class="card">
      <img src="07_batch_print/mockup.png" alt="Batch Print">
      <div class="info">
        <h3>07 — Impresión Batch</h3>
        <p>Agrupación por carrier</p>
        <div class="route">/app/shipments/batch</div>
      </div>
    </a>
  </div>

  <h2 class="section-title">Devoluciones y recogidas</h2>
  <div class="grid">
    <a href="08_lista_devoluciones/index.html" class="card">
      <img src="08_lista_devoluciones/mockup.png" alt="Devoluciones">
      <div class="info">
        <h3>08 — Lista Devoluciones</h3>
        <p>Con badge carrier origen</p>
        <div class="route">/app/returns</div>
      </div>
    </a>
    <a href="09_crear_devolucion/index.html" class="card">
      <img src="09_crear_devolucion/mockup.png" alt="Crear Devolución">
      <div class="info">
        <h3>09 — Crear Devolución</h3>
        <p>Selector carrier devolución</p>
        <div class="route">/app/returns/new</div>
      </div>
    </a>
    <a href="10_recogidas/index.html" class="card">
      <img src="10_recogidas/mockup.png" alt="Recogidas">
      <div class="info">
        <h3>10 — Recogidas</h3>
        <p>Calendario con selector carrier</p>
        <div class="route">/app/pickups</div>
      </div>
    </a>
  </div>

  <h2 class="section-title">Dashboard y billing</h2>
  <div class="grid">
    <a href="11_dashboard/index.html" class="card">
      <img src="11_dashboard/mockup.png" alt="Dashboard">
      <div class="info">
        <h3>11 — Dashboard</h3>
        <p>Métricas globales + breakdown Standard/Express</p>
        <div class="route">/app/dashboard</div>
      </div>
    </a>
    <a href="12_facturacion/index.html" class="card">
      <img src="12_facturacion/mockup.png" alt="Facturación">
      <div class="info">
        <h3>12 — Facturación</h3>
        <p>Planes + desglose por carrier</p>
        <div class="route">/app/billing</div>
      </div>
    </a>
  </div>

  <h2 class="section-title">Estados globales</h2>
  <div class="grid">
    <div class="card">
      <img src="estados_globales/credenciales_warning.png" alt="Warning">
      <div class="info">
        <h3>Credenciales no verificadas</h3>
        <p>Banner warning — conecta al menos un carrier</p>
      </div>
    </div>
    <div class="card">
      <img src="estados_globales/skeleton.png" alt="Skeleton">
      <div class="info">
        <h3>Cargando (Skeleton)</h3>
        <p>Estado de carga sin spinner</p>
      </div>
    </div>
    <div class="card">
      <img src="estados_globales/empty_state.png" alt="Empty">
      <div class="info">
        <h3>Sin datos (Empty State)</h3>
        <p>Primera vez sin envíos + mención reglas</p>
      </div>
    </div>
    <div class="card">
      <img src="estados_globales/error_red.png" alt="Error">
      <div class="info">
        <h3>Error de red</h3>
        <p>Fallo de conexión con Correos</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## PARTE 4: Checklist de revisión post-generación

Después de generar todas las pantallas, revisa esto:

```
CONSISTENCIA VISUAL
□ Botones primarios son #D4351C (rojo Correos)
□ Badges Standard son siempre rojos (#D4351C)
□ Badges Express son siempre azules (#1C4F8A)
□ Badges de estado usan los mismos 6 colores que MRW Pro
□ El fondo es siempre #F6F6F7
□ Las cards son siempre blancas con border-radius consistente
□ La tipografía es Inter en todas las pantallas
□ Los tamaños de texto son consistentes

DUAL CARRIER
□ Pantalla 02 muestra DOS secciones (Standard + Express)
□ Pantalla 03 muestra tabla de reglas + simulador
□ Pantalla 04 tiene columna "Transportista" con badge rojo/azul
□ Pantalla 05 timeline usa color del carrier
□ Pantalla 06 muestra preview de regla + override
□ Pantalla 07 agrupa etiquetas por carrier
□ Pantalla 11 tiene breakdown Standard vs Express en gráfico y métricas
□ Pantalla 12 muestra desglose envíos por carrier

CONTENIDO
□ Todo el texto visible está en español de España
□ Se usa "envío" no "despacho"
□ Se usa "recogida" no "pickup"
□ Las fechas están en formato dd/mm/yyyy
□ Los precios usan € y coma decimal (49,00€)
□ Los servicios son correctos: Paq Estándar, Paq Premium, Paquete Azul, Express 24h, Express 48h

FUNCIONALIDAD IMPLÍCITA
□ La pantalla 02 muestra estados éxito Y error
□ La pantalla 03 tiene simulador con resultado visible
□ La pantalla 04 muestra los 6 tipos de badges de estado
□ La pantalla 04 muestra badges de AMBOS carriers
□ La pantalla 05 tiene timeline completo
□ La pantalla 11 tiene gráfico de barras apiladas por carrier
□ La pantalla 12 muestra los 3 planes con el actual destacado

ESTADOS
□ Existe mockup de skeleton loading
□ Existe mockup de empty state
□ Existe mockup de error de red
□ Existe mockup de banner credenciales no verificadas
```

---

## PARTE 5: Orden recomendado de generación

Genera en este orden para optimizar las 350+200 generaciones mensuales de Stitch:

```
RONDA 1 — Pantallas simples (Standard Mode, ~1-2 iteraciones cada una)
  1. Pantalla 01 — Bienvenida
  2. Pantalla 02b — Modal ayuda
  3. Estado: Empty state
  4. Estado: Error de red
  5. Estado: Skeleton loading
  6. Estado: Credenciales warning

RONDA 2 — Formularios (Standard Mode, ~2-3 iteraciones)
  7. Pantalla 09 — Crear devolución
  8. Pantalla 12 — Facturación

RONDA 3 — Pantallas complejas (Experimental Mode, ~3-4 iteraciones)
  9. Pantalla 02 — Conexión Correos dual (2 secciones)
  10. Pantalla 03 — Reglas de enrutamiento + simulador (LA MÁS COMPLEJA)
  11. Pantalla 04 — Lista envíos con badge carrier
  12. Pantalla 06 — Crear envío con preview regla
  13. Pantalla 08 — Lista devoluciones

RONDA 4 — Pantallas más complejas (Experimental Mode, ~3-4 iteraciones)
  14. Pantalla 05 — Detalle envío con timeline carrier
  15. Pantalla 07 — Batch print agrupado
  16. Pantalla 10 — Recogidas con selector carrier
  17. Pantalla 11 — Dashboard con breakdown carrier (gráfico apilado)
```

**Estimación total: ~45-60 generaciones** (de tus 350+200 disponibles al mes)

> **Nota:** La Pantalla 03 (Reglas de Enrutamiento) es la más compleja y única de Correos Pro. Puede requerir 4-5 iteraciones en Stitch para que quede bien. El simulador es el elemento más difícil de representar visualmente.
