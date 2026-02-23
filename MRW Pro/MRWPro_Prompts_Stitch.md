# MRW Pro — Prompts para Google Stitch + Guía de Workflow

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

- **Modo Standard** (Gemini Flash, 350/mes): Pantallas simples → 01, 02b, 03, 08, 09, 10, 12
- **Modo Experimental** (Gemini Pro, 200/mes): Pantallas complejas → 02, 04, 05, 06, 07, 11
- **Plataforma**: Selecciona siempre **"Web"** (no mobile)
- **Tema**: Light

### Tips para mejores resultados en Stitch

- Si la primera generación no clava los colores, usa el chat: "Change primary buttons to #0369A1 and error badges to #DC2626"
- Si corta la pantalla (solo muestra una parte), di: "Show the complete page with all sections visible"
- Si los elementos no están alineados, di: "Fix alignment, center all cards and use consistent spacing"
- Stitch entiende mejor inglés que español. Los prompts están en inglés pero el CONTENIDO de la UI está en español

---

## PARTE 2: Los 17 Prompts adaptados para Stitch

---

### PANTALLA 01 — Bienvenida

```
Web app onboarding welcome screen for "MRW Pro", a shipping logistics SaaS.

Colors: primary #0369A1 (navy blue), secondary #DC2626 (red), background light gray #F6F6F7.
Font: Inter. Style: clean, minimal, professional admin panel.

Centered white card on gray background containing:
- Top: "MRW Pro" logo text in navy #0369A1, bold, large
- 3-step horizontal stepper with icons:
  Step 1 "Conecta" (link icon) — active, highlighted in #0369A1
  Step 2 "Configura" (gear icon) — gray inactive
  Step 3 "Envía" (truck icon) — gray inactive
- Text below: "Esta app conecta con tu contrato MRW propio. Necesitas las credenciales API de tu cuenta MRW de empresa."
- Large primary button: "Conectar cuenta MRW" — background #0369A1, white text
- Small text link below: "¿No tengo mis credenciales MRW?"

All text in Spanish. Clean and welcoming.
```

---

### PANTALLA 02 — Conexión MRW

```
Web app settings form screen for "MRW Pro" shipping SaaS.

Colors: primary #0369A1, error #DC2626, success #059669, warning #D97706. Font: Inter.
Light gray background #F6F6F7 with white cards.

Page title at top: "Conexión MRW"

Warning banner (amber/yellow background #FEF3C7, border #D97706):
"Requisito obligatorio — Esta app requiere un contrato MRW activo con acceso a MRWLink API."

White card with form containing 4 input fields stacked vertically:
1. "Código de cliente MRW" — text input, required
2. "Franquicia MRW asignada" — text input, required
3. "Password API MRW" — password input with eye toggle, required
4. "Número de contrato" — text input, labeled "(opcional)"

Primary button below form: "Verificar conexión" in #0369A1

Below the button show TWO states:
- Green success banner (#059669 border, #ECFDF5 background): "✓ Conexión verificada correctamente. Ya puedes configurar tus envíos."
- Red error banner (#DC2626 border, #FEF2F2 background): "✗ Error: código de cliente o password incorrectos"

Small link at bottom: "¿Dónde encuentro mis credenciales MRW?"

All text in Spanish.
```

---

### PANTALLA 02b — Modal Ayuda Credenciales

```
Web app modal dialog overlay for "MRW Pro".

Colors: primary #0369A1. Font: Inter. Semi-transparent dark backdrop behind white modal.

Modal title: "¿Dónde encuentro mis credenciales MRW?"

Content — 3 numbered steps, each with a small icon on the left:
1. (globe icon) "Accede a mrw.es > Área de clientes > Empresas"
2. (settings icon) "Ve a Integraciones o Conectores"
3. (key icon) "Tus credenciales están en el apartado MRWLink API"

Gray info box below the steps:
"Si no las encuentras, llama a tu oficina MRW asignada o al 902 300 400 (atención empresas MRW) y solicita las credenciales MRWLink de tu contrato."

Footer with "Cerrar" button aligned right.

All text in Spanish. Clean, helpful, easy to scan.
```

---

### PANTALLA 03 — Configuración de Envíos

```
Web app settings configuration screen for "MRW Pro" shipping SaaS.

Colors: primary #0369A1, background #F6F6F7. Font: Inter. White cards on gray background.

Page title: "Configuración de envíos"

Card 1 — "Servicio por defecto":
- Dropdown select with options visible: "MRW Urgente", "MRW Express", "MRW Económico", "MRW Bag"
- Helper text: "Se usará para todos los envíos automáticos"

Card 2 — "Peso y dimensiones por defecto":
- Input: "Peso por defecto (kg)" showing "2"
- Three inputs in a row: "Largo (cm)", "Ancho (cm)", "Alto (cm)"

Card 3 — "Automatización":
- Toggle switch ON: "Crear envío automáticamente al completar el pago"
- Toggle switch ON: "Enviar email de tracking al cliente"
- Toggle switch OFF: "Enviar SMS de tracking al cliente"

Primary button at bottom: "Guardar configuración" in #0369A1

All text in Spanish.
```

---

### PANTALLA 04 — Lista de Envíos

```
Web app data table screen for "MRW Pro" shipping management SaaS.

Colors: primary #0369A1, error #DC2626, success #059669, warning #D97706. Font: Inter.
Background #F6F6F7, white card containing the table.

Page title: "Envíos" with primary button top-right "Crear envío manual" in #0369A1.

Filter bar: search input + status dropdown filter + date range picker.

Data table with 8 rows and these columns:
Pedido | Cliente | Destino | Servicio | Estado | Fecha | Acciones

Sample rows with colored status badges:
- #1847 | María García | Madrid | MRW Urgente | BLUE badge "Creado" | 17/02/2026 | ⋯
- #1846 | Juan López | Barcelona | MRW Express | AMBER badge "En tránsito" | 16/02/2026 | ⋯
- #1845 | Ana Martín | Valencia | MRW Urgente | GREEN badge "Entregado" | 16/02/2026 | ⋯
- #1844 | Pedro Ruiz | Sevilla | MRW Económico | RED badge "Incidencia" | 15/02/2026 | ⋯
- #1843 | Laura Díaz | Bilbao | MRW Bag | GREEN badge "Entregado" | 15/02/2026 | ⋯
- #1842 | Carlos Sanz | Málaga | MRW Urgente | ORANGE badge "Devuelto" | 14/02/2026 | ⋯
- #1841 | Elena Vega | Zaragoza | MRW Express | AMBER badge "En tránsito" | 14/02/2026 | ⋯
- #1840 | David Moreno | Murcia | MRW Urgente | DARK RED badge "Error creación" | 13/02/2026 | ⋯

Badge colors: blue #0369A1, amber #D97706, green #059669, red #DC2626, orange #EA580C, dark red #991B1B.

Pagination at bottom: "Mostrando 1-8 de 342 envíos" with page numbers.

All text in Spanish.
```

---

### PANTALLA 05 — Detalle de Envío

```
Web app detail page for "MRW Pro" shipping SaaS. Shows one shipment's full information.

Colors: primary #0369A1, success #059669. Font: Inter. Background #F6F6F7.

Top: back arrow + page title "Envío #MRW-2024-00847"

Two cards side by side:

LEFT CARD — "Información del envío":
- Pedido Shopify: #1234
- Cliente: María García
- Dirección: Calle Ejemplo 15, 28001 Madrid
- Servicio: MRW Urgente
- Peso: 2.5 kg
- Referencia MRW: 0987654321
- Estado: green badge "Entregado"

RIGHT CARD — "Etiqueta de envío":
- Gray placeholder rectangle representing a shipping label with barcode lines
- Button: "Descargar etiqueta PDF"

BELOW — Card "Seguimiento del envío":
Vertical timeline with green checkmarks and connecting line:
✓ "Envío creado en MRW" — 15/02/2026 09:00
✓ "Recogido por mensajero" — 15/02/2026 14:30
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
Web app form screen for creating a manual shipment in "MRW Pro" shipping SaaS.

Colors: primary #0369A1. Font: Inter. Background #F6F6F7. White cards.

Top: back arrow + title "Crear envío manual"

Card 1 — "Seleccionar pedido":
- Search input: "Buscar pedido por número o cliente..."
- Selected result below: card showing "#1234 — Juan López — 2 productos — 45,00€"

Card 2 — "Servicio de envío":
- Radio button group, 4 options:
  ○ MRW Urgente (entrega día siguiente)
  ● MRW Express (entrega 24-48h) — selected
  ○ MRW Económico (entrega 48-72h)
  ○ MRW Bag (documentos y sobres)

Card 3 — "Peso y dimensiones":
- Input "Peso (kg)" showing "1.5"
- Three inline inputs: "Largo (cm)", "Ancho (cm)", "Alto (cm)"
- Checkbox: "Usar valores por defecto de configuración"

Card 4 — "Dirección de destino":
- Pre-filled form fields: Nombre, Dirección, Ciudad, Código postal, Provincia, Teléfono

Footer buttons:
- Primary: "Crear envío en MRW" in #0369A1
- Secondary: "Cancelar" outlined

All text in Spanish.
```

---

### PANTALLA 07 — Impresión Batch de Etiquetas

```
Web app batch label printing screen for "MRW Pro" shipping SaaS.

Colors: primary #0369A1. Font: Inter. Background #F6F6F7.

Page title: "Impresión de etiquetas en lote"

Table with checkboxes on each row (8 rows), 4 checked and highlighted:
Columns: ☑ | Pedido | Cliente | Destino | Estado badge | Fecha
Show bulk action bar: "4 envíos seleccionados"

Card below — "Opciones de descarga":
- Radio buttons:
  ● "PDF combinado (un archivo con todas las etiquetas)" — selected
  ○ "ZIP (archivos individuales por etiqueta)"
- Dropdown: "Formato de etiqueta" with "10x15cm" selected

Preview area: 4 small gray rectangles in a row representing label thumbnails with barcode lines.

Footer:
- Primary button: "Descargar 4 etiquetas" in #0369A1
- Secondary: "Seleccionar todos"

All text in Spanish.
```

---

### PANTALLA 08 — Lista de Devoluciones

```
Web app returns list screen for "MRW Pro" shipping SaaS.

Colors: primary #0369A1, badges: blue #0369A1, amber #D97706, green #059669, red #DC2626. Font: Inter.

Page title: "Devoluciones" with button top-right "Crear devolución" in #0369A1.
Filter bar: search + status dropdown.

Data table with 6 rows:
Pedido | Cliente | Motivo | Estado | Fecha | Etiqueta | Acciones

- #1234 | María García | Producto defectuoso | BLUE "Solicitada" | 17/02 | Descargar | ⋯
- #1230 | Juan López | Talla incorrecta | AMBER "En tránsito" | 16/02 | Descargar | ⋯
- #1228 | Ana Martín | Cambio de opinión | GREEN "Recibida" | 15/02 | Descargar | ⋯
- #1225 | Pedro Ruiz | No corresponde | RED "Incidencia" | 14/02 | Descargar | ⋯
- #1222 | Laura Díaz | Producto defectuoso | GREEN "Recibida" | 13/02 | Descargar | ⋯
- #1220 | Carlos Sanz | Talla incorrecta | AMBER "En tránsito" | 12/02 | Descargar | ⋯

Pagination at bottom.
All text in Spanish.
```

---

### PANTALLA 09 — Crear Devolución

```
Web app return creation form for "MRW Pro" shipping SaaS.

Colors: primary #0369A1. Font: Inter. Background #F6F6F7. White cards.

Top: back arrow + title "Crear devolución"

Card 1 — "Seleccionar pedido":
- Search input: "Buscar pedido entregado..."
- Selected: "#1234 — María García — Entregado 14/02/2026"

Card 2 — "Motivo de la devolución":
- Dropdown: "Producto defectuoso", "Talla incorrecta", "No corresponde", "Cambio de opinión", "Otro"
- Textarea: "Notas adicionales (opcional)"

Card 3 — "Dirección de recogida":
- Toggle ON: "Usar dirección del pedido original"
- Form fields pre-filled: Nombre, Dirección, Ciudad, CP, Provincia, Teléfono

Card 4 — "Método de devolución":
- Radio buttons:
  ● "Generar etiqueta (el cliente lleva a punto MRW)" — selected
  ○ "Solicitar recogida en domicilio"

Footer:
- Primary: "Generar etiqueta de devolución" in #0369A1
- Secondary: "Cancelar"

All text in Spanish.
```

---

### PANTALLA 10 — Recogidas

```
Web app pickup scheduling screen for "MRW Pro" shipping SaaS.

Colors: primary #0369A1, success #059669, warning #D97706. Font: Inter. Background #F6F6F7.

Page title: "Recogidas" with button "Nueva recogida" in #0369A1.

Two-column layout:

LEFT (60%) — Monthly calendar for February 2026.
- Today (17) highlighted with #0369A1 circle
- Days 18, 20, 22 have small dot indicators showing scheduled pickups
- Clean grid with Mon-Sun headers

RIGHT (40%) — Card "Próximas recogidas":
- 18/02/2026 — 10:00-14:00 — 5 paquetes — green badge "Confirmada"
- 20/02/2026 — 09:00-13:00 — 3 paquetes — amber badge "Pendiente"
- 22/02/2026 — 10:00-14:00 — 8 paquetes — amber badge "Pendiente"

BELOW — Card "Nueva recogida" form:
- Date picker: "Fecha de recogida"
- Dropdown: "Franja horaria" — 09:00-13:00, 10:00-14:00, 14:00-18:00
- Input: "Número de paquetes"
- Input: "Notas para el mensajero (opcional)"
- Button: "Solicitar recogida" in #0369A1

All text in Spanish.
```

---

### PANTALLA 11 — Dashboard

```
Web app analytics dashboard for "MRW Pro" shipping management SaaS.

Colors: primary #0369A1, error #DC2626, success #059669, warning #D97706. Font: Inter. Background #F6F6F7.

Page title: "Dashboard" with date selector top-right showing "Últimos 7 días".

TOP ROW — 4 metric cards horizontally:
1. "Envíos hoy" — large "12" — green small text "+3 vs ayer" with up arrow
2. "En tránsito" — large "28" — amber #D97706 indicator dot
3. "Incidencias activas" — large "3" — red #DC2626 indicator — small link "Ver todas"
4. "Entregados (semana)" — large "87" — green #059669 indicator

MIDDLE — Card with bar chart:
Title: "Envíos por día — Última semana"
7 vertical bars in #0369A1 for Lun(18) Mar(22) Mié(15) Jue(20) Vie(25) Sáb(8) Dom(2)
Y-axis with numbers. Clean and readable.

BOTTOM ROW — Two cards side by side:

Left card "Incidencias recientes":
- "#1847 — Dirección incorrecta — hace 2h" with red dot
- "#1839 — Ausente en domicilio — hace 5h" with red dot
- "#1832 — Paquete dañado — hace 1d" with red dot
- Link: "Ver todas las incidencias"

Right card "Distribución por servicio":
Horizontal progress bars:
- MRW Urgente: 45% in #0369A1
- MRW Express: 35% in lighter blue
- MRW Económico: 15% in gray-blue
- MRW Bag: 5% in light gray

All text in Spanish.
```

---

### PANTALLA 12 — Facturación

```
Web app billing and subscription screen for "MRW Pro" shipping SaaS.

Colors: primary #0369A1. Font: Inter. Background #F6F6F7.

Page title: "Facturación y plan"

TOP CARD — "Tu plan actual":
- "Plan Profesional" with blue badge "Activo"
- Price: "29,99€/mes"
- "Hasta 500 envíos/mes + todas las funcionalidades"
- Progress bar at 68% filled in #0369A1: "Envíos este mes: 342 / 500"
- Small text: "Te quedan 158 envíos (renueva 01/03/2026)"
- Buttons: "Cambiar plan" secondary, "Cancelar suscripción" text red

MIDDLE — 3 pricing cards side by side:
1. "Básico" — 9,99€/mes — 100 envíos — "Downgrade" outlined button
2. "Profesional" — 29,99€/mes — 500 envíos — highlighted border #0369A1 — badge "Plan actual"
3. "Enterprise" — 79,99€/mes — Ilimitados — "Upgrade" button #0369A1

BOTTOM CARD — "Historial de facturación":
Simple table: Fecha | Concepto | Importe | Estado | Factura
- 01/02/2026 | Plan Profesional | 29,99€ | green "Pagado" | Descargar
- 01/01/2026 | Plan Profesional | 29,99€ | green "Pagado" | Descargar
- 01/12/2025 | Plan Básico | 9,99€ | green "Pagado" | Descargar

All text in Spanish.
```

---

### ESTADOS GLOBALES — Credenciales No Verificadas

```
Web app screen showing a warning banner at the top of a shipping list page.

Colors: warning #D97706, primary #0369A1. Font: Inter. Background #F6F6F7.

Persistent amber warning banner at the very top:
"⚠ Verifica tu conexión MRW para empezar a crear envíos" with button "Verificar ahora"

Below the banner: the shipments list table is visible but grayed out and disabled, showing it cannot be used until credentials are verified. Overlay or reduced opacity effect.

All text in Spanish.
```

---

### ESTADOS GLOBALES — Cargando (Skeleton)

```
Web app loading skeleton state for a shipping list page.

Colors: light gray placeholders on white. Font: Inter. Background #F6F6F7.

Show the shipments list page layout with ALL content replaced by animated gray skeleton blocks:
- Page title: wide gray rectangle
- Filter bar: 3 gray rounded rectangles
- Table: 6 rows of gray bars of varying widths simulating columns
- No spinner anywhere — only flat gray animated pulse placeholders
- Pagination: small gray blocks at bottom

Clean, professional loading state. The shapes should suggest the table structure without showing real data.
```

---

### ESTADOS GLOBALES — Sin Datos (Empty State)

```
Web app empty state for a shipping list page with no data yet.

Colors: primary #0369A1. Font: Inter. Background #F6F6F7.

Page title: "Envíos"

Centered on the page:
- Simple line illustration of a shipping box (minimal, not detailed)
- Heading: "Aún no tienes envíos"
- Description: "Cuando se complete un pedido en tu tienda, los envíos aparecerán aquí automáticamente. También puedes crear uno manualmente."
- Primary button: "Crear envío manual" in #0369A1
- Small link below: "Configurar envíos automáticos"

Encouraging and clean, not overwhelming. All text in Spanish.
```

---

### ESTADOS GLOBALES — Error de Red

```
Web app error state for a shipping detail page with network failure.

Colors: error #DC2626. Font: Inter. Background #F6F6F7.

Red error banner at the top:
"No se pudo conectar con MRW. Comprueba tu conexión a Internet e inténtalo de nuevo."
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
   MRWPro_Mockups/
   ├── 01_bienvenida/
   │   ├── mockup.png
   │   └── index.html
   ├── 02_conexion_mrw/
   │   ├── mockup.png
   │   └── index.html
   ├── 03_config_envios/
   ...
   └── estados_globales/
       ├── skeleton.png
       ├── empty_state.png
       ├── error_red.png
       └── credenciales_warning.png

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
  <title>MRW Pro — Mockups UI/UX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; background: #F6F6F7; color: #1a1a1a; }
    .header { background: #0369A1; color: white; padding: 24px 40px; }
    .header h1 { font-size: 24px; font-weight: 600; }
    .header p { opacity: 0.8; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; padding: 40px; }
    .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.2s; cursor: pointer; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .card img { width: 100%; height: 220px; object-fit: cover; object-position: top; border-bottom: 1px solid #eee; }
    .card .info { padding: 16px; }
    .card .info h3 { font-size: 15px; font-weight: 600; }
    .card .info p { font-size: 13px; color: #666; margin-top: 4px; }
    .card .info .route { font-size: 12px; color: #0369A1; font-family: monospace; margin-top: 8px; }
    .section-title { padding: 40px 40px 0; font-size: 18px; font-weight: 600; color: #333; }
    a { text-decoration: none; color: inherit; }
  </style>
</head>
<body>
  <div class="header">
    <h1>MRW Pro — Mockups UI/UX</h1>
    <p>17 pantallas · Shopify Embedded App · Febrero 2026</p>
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
    <a href="02_conexion_mrw/index.html" class="card">
      <img src="02_conexion_mrw/mockup.png" alt="Conexión MRW">
      <div class="info">
        <h3>02 — Conexión MRW</h3>
        <p>Credenciales API MRWLink</p>
        <div class="route">/app/settings/mrw</div>
      </div>
    </a>
    <a href="02b_modal_ayuda/index.html" class="card">
      <img src="02b_modal_ayuda/mockup.png" alt="Modal Ayuda">
      <div class="info">
        <h3>02b — Modal Ayuda</h3>
        <p>Guía para obtener credenciales</p>
        <div class="route">Modal overlay</div>
      </div>
    </a>
    <a href="03_config_envios/index.html" class="card">
      <img src="03_config_envios/mockup.png" alt="Config Envíos">
      <div class="info">
        <h3>03 — Config Envíos</h3>
        <p>Servicios, pesos, automatización</p>
        <div class="route">/app/settings/shipping</div>
      </div>
    </a>
  </div>

  <h2 class="section-title">Gestión de envíos</h2>
  <div class="grid">
    <a href="04_lista_envios/index.html" class="card">
      <img src="04_lista_envios/mockup.png" alt="Lista Envíos">
      <div class="info">
        <h3>04 — Lista Envíos</h3>
        <p>DataTable con badges de estado</p>
        <div class="route">/app/shipments</div>
      </div>
    </a>
    <a href="05_detalle_envio/index.html" class="card">
      <img src="05_detalle_envio/mockup.png" alt="Detalle Envío">
      <div class="info">
        <h3>05 — Detalle Envío</h3>
        <p>Timeline tracking + etiqueta</p>
        <div class="route">/app/shipments/:id</div>
      </div>
    </a>
    <a href="06_crear_envio/index.html" class="card">
      <img src="06_crear_envio/mockup.png" alt="Crear Envío">
      <div class="info">
        <h3>06 — Crear Envío Manual</h3>
        <p>Formulario de creación</p>
        <div class="route">/app/shipments/new</div>
      </div>
    </a>
    <a href="07_batch_print/index.html" class="card">
      <img src="07_batch_print/mockup.png" alt="Batch Print">
      <div class="info">
        <h3>07 — Impresión Batch</h3>
        <p>Etiquetas en lote</p>
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
        <p>Gestión de devoluciones</p>
        <div class="route">/app/returns</div>
      </div>
    </a>
    <a href="09_crear_devolucion/index.html" class="card">
      <img src="09_crear_devolucion/mockup.png" alt="Crear Devolución">
      <div class="info">
        <h3>09 — Crear Devolución</h3>
        <p>Formulario nueva devolución</p>
        <div class="route">/app/returns/new</div>
      </div>
    </a>
    <a href="10_recogidas/index.html" class="card">
      <img src="10_recogidas/mockup.png" alt="Recogidas">
      <div class="info">
        <h3>10 — Recogidas</h3>
        <p>Calendario y programación</p>
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
        <p>Métricas y gráficos</p>
        <div class="route">/app/dashboard</div>
      </div>
    </a>
    <a href="12_facturacion/index.html" class="card">
      <img src="12_facturacion/mockup.png" alt="Facturación">
      <div class="info">
        <h3>12 — Facturación</h3>
        <p>Planes y billing</p>
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
        <p>Banner warning persistente</p>
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
        <p>Primera vez sin envíos</p>
      </div>
    </div>
    <div class="card">
      <img src="estados_globales/error_red.png" alt="Error">
      <div class="info">
        <h3>Error de red</h3>
        <p>Fallo de conexión con MRW</p>
      </div>
    </div>
  </div>
</body>
</html>
```

### Opción B: Con Figma (si necesitas prototipo interactivo)

Solo merece la pena si necesitas:
- Navegación clickable entre pantallas (demo interactiva)
- Entregar diseño a un equipo de desarrollo externo
- Iterar sobre componentes reutilizables

**Pasos:**

```
1. Genera en Stitch → usa "Copy to Figma" en cada pantalla
2. En Figma crea un proyecto "MRW Pro" con estas páginas:
   - 🎨 Design System (colores, tipografía, badges, botones)
   - 📱 Pantallas (todas las 12+4 estados)
   - 🔗 Prototype (conectar flujos)
3. Unifica estilos: revisa que Stitch no haya cambiado colores entre pantallas
4. Crea componentes reutilizables: badges de estado, header, botones
5. Conecta prototype: Welcome → Conexión → Config → Lista envíos, etc.
```

---

## PARTE 4: Checklist de revisión post-generación

Después de generar todas las pantallas, revisa esto:

```
CONSISTENCIA VISUAL
□ Todos los botones primarios son #0369A1
□ Todos los badges usan los mismos 6 colores (azul, amarillo, verde, rojo, naranja, rojo oscuro)
□ El fondo es siempre #F6F6F7
□ Las cards son siempre blancas con border-radius consistente
□ La tipografía es Inter en todas las pantallas
□ Los tamaños de texto son consistentes (títulos, body, labels)

CONTENIDO
□ Todo el texto visible está en español de España
□ Se usa "envío" no "despacho"
□ Se usa "recogida" no "pickup"
□ Las fechas están en formato dd/mm/yyyy
□ Los precios usan € y coma decimal (29,99€)

FUNCIONALIDAD IMPLÍCITA
□ La pantalla 02 muestra estados de éxito Y error
□ La pantalla 04 muestra los 6 tipos de badges
□ La pantalla 05 tiene timeline completo
□ La pantalla 11 tiene gráfico de barras con datos
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
  3. Pantalla 03 — Config envíos
  4. Estado: Empty state
  5. Estado: Error de red
  6. Estado: Skeleton loading
  7. Estado: Credenciales warning

RONDA 2 — Formularios (Standard Mode, ~2-3 iteraciones)
  8. Pantalla 06 — Crear envío manual
  9. Pantalla 09 — Crear devolución
  10. Pantalla 10 — Recogidas

RONDA 3 — Tablas y datos (Experimental Mode, ~2-3 iteraciones)
  11. Pantalla 04 — Lista envíos
  12. Pantalla 08 — Lista devoluciones
  13. Pantalla 07 — Batch print

RONDA 4 — Pantallas complejas (Experimental Mode, ~3-4 iteraciones)
  14. Pantalla 02 — Conexión MRW (con estados éxito/error)
  15. Pantalla 05 — Detalle envío (timeline)
  16. Pantalla 11 — Dashboard (gráficos)
  17. Pantalla 12 — Facturación (pricing cards)
```

**Estimación total: ~35-50 generaciones** (de tus 350+200 disponibles al mes)
