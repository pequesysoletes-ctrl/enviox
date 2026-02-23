# DHL Pro — Prompts para Google Stitch + Guía de Workflow

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
4. Repite para las 15 pantallas
5. Al final: unifica todo (ver Parte 3)
```

### Configuración en Stitch

- **Modo Standard** (Gemini Flash, 350/mes): Pantallas simples → 01, 02b, 09, 10, 13
- **Modo Experimental** (Gemini Pro, 200/mes): Pantallas complejas → 02, 03, 04, 05, 06, 07, 08, 11, 12
- **Plataforma**: Selecciona siempre **"Web"** (no mobile)
- **Tema**: Light

### Tips para mejores resultados en Stitch

- Si la primera generación no clava los colores, usa el chat: "Change DHL badges to yellow #FFCC00 with dark text and DHL red buttons to #D32011"
- Si corta la pantalla (solo muestra una parte), di: "Show the complete page with all sections visible"
- Si los elementos no están alineados, di: "Fix alignment, center all cards and use consistent spacing"
- Stitch entiende mejor inglés que español. Los prompts están en inglés pero el CONTENIDO de la UI está en español

---

## PARTE 2: Los 15 Prompts adaptados para Stitch

---

### PANTALLA 01 — Bienvenida

```
Web app onboarding welcome screen for "DHL Pro", a dual-service shipping logistics SaaS for DHL in Spain (DHL Express international + DHL eCommerce Ibérica national).

Colors: DHL Yellow #FFCC00, DHL Red #D32011, background light gray #F6F6F7.
Font: Inter. Style: clean, minimal, professional admin panel.

Centered white card on gray background containing:
- Top: "DHL Pro" logo text in #D32011 bold large. Below it a subtle tagline: "DHL Express + eCommerce Ibérica en una sola app"
- 4-step horizontal stepper with icons:
  Step 1 "Conecta DHL" (link icon) — active, highlighted in #D32011
  Step 2 "Datos empresa" (building icon) — gray inactive
  Step 3 "Configura aduanas" (document/customs icon) — gray inactive
  Step 4 "Envía" (truck icon) — gray inactive
- Text below: "Esta app conecta con tu cuenta MyDHL API. Necesitas un Site ID y Password proporcionados por tu delegación DHL."
- Large primary button: "Empezar configuración" — background #D32011, white text
- Small text link below: "¿Cómo solicito mis credenciales MyDHL API?"

All text in Spanish. Clean and welcoming.
```

---

### PANTALLA 02 — Conexión DHL (Dual Service)

```
Web app settings form screen for "DHL Pro" shipping SaaS. This screen has TWO separate credential sections because it supports two DHL services: DHL Express (international) and DHL eCommerce Ibérica (national Spain/Portugal).

Colors: DHL Express yellow-on-dark #FFCC00 on #333, eCommerce Ibérica #D32011, success #059669, warning #D97706. Font: Inter.
Light gray background #F6F6F7 with white cards.

Page title at top: "Conexión DHL"

Warning banner (amber/yellow background #FEF3C7, border #D97706):
"Requisito obligatorio — Necesitas al menos una cuenta activa: DHL Express (internacional) o DHL eCommerce Ibérica (nacional)."

SECTION A — White card with yellow left border (#FFCC00):
Title: "DHL Express" with a small yellow/black DHL Express icon
Subtitle in gray: "Envíos internacionales premium (UE + resto del mundo)"
- Form with 3 input fields:
  1. "Site ID" — text input, required
  2. "Password MyDHL API" — password input with eye toggle, required
  3. "Número cuenta DHL" — text input, required
- Button: "Verificar Express" in dark background #333 with yellow text #FFCC00
- Below: Green success banner: "✓ DHL Express conectado — Cuenta: 123456789"
- Small label: "(Opcional si solo usas eCommerce Ibérica)"

SECTION B — White card with red left border (#D32011):
Title: "DHL eCommerce Ibérica" with red DHL icon
Subtitle in gray: "Envíos nacionales España + Portugal económicos"
- Form with 3 input fields:
  1. "Client ID eCommerce" — text input, required
  2. "Client Secret" — password input with eye toggle, required
  3. "Pickup Account Number" — text input, required
- Button: "Verificar eCommerce" in #D32011
- Below: Status not yet verified (gray empty state)
- Small label: "(Opcional si solo usas DHL Express)"

Bottom of page: Small link "¿Dónde encuentro mis credenciales?" and a note: "Al menos una conexión debe estar verificada para continuar."

All text in Spanish.
```

---

### PANTALLA 02b — Modal Ayuda Credenciales

```
Web app modal dialog overlay for "DHL Pro".

Colors: DHL Yellow #FFCC00, DHL Red #D32011. Font: Inter. Semi-transparent dark backdrop behind white modal.

Modal title: "¿Dónde encuentro mis credenciales?"

Content — TWO sections clearly separated:

SECTION 1 with yellow accent (#FFCC00):
Subtitle: "DHL Express (Internacional)"
3 numbered steps, each with a small icon:
1. (globe icon) "Accede a developer.dhl.com > MyDHL API"
2. (settings icon) "Solicita acceso API a tu delegación DHL o Key Account Manager"
3. (key icon) "Recibirás un Site ID + Password + Número de cuenta por email"

SECTION 2 with red accent (#D32011):
Subtitle: "DHL eCommerce Ibérica (Nacional)"
3 numbered steps:
1. (globe icon) "Contacta con tu comercial DHL Parcel"
2. (settings icon) "Solicita las credenciales API del servicio eCommerce Ibérica"
3. (key icon) "Recibirás Client ID + Client Secret + Pickup Account Number"

Gray info box below:
"Si ya tienes contrato con DHL para tu negocio, puedes solicitar acceso API sin coste adicional. Tu Key Account Manager o delegación comercial te proporcionará las credenciales en 24-48h."

Footer with "Cerrar" button aligned right.

All text in Spanish. Clean, helpful, easy to scan.
```

---

### PANTALLA 03 — Datos de Empresa + Aduanas (EXCLUSIVA DHL)

```
Web app customs and company data configuration screen for "DHL Pro" shipping SaaS. This screen is UNIQUE to DHL — it does not exist in MRW or Correos apps because DHL handles international shipments requiring customs declarations.

Colors: DHL Yellow #FFCC00, DHL Red #D32011, background #F6F6F7. Font: Inter. White cards on gray background.

Page title: "Datos de empresa y aduanas"
Subtitle: "Estos datos se usarán automáticamente en cada envío internacional"

CARD 1 — "Datos del remitente" with building icon:
- Input: "Nombre empresa" showing "Mi Tienda S.L."
- Input: "NIF / CIF" showing "B12345678"
- Input: "Dirección" showing "Calle Ejemplo 15"
- Inline inputs: "Código postal" showing "28001" | "Ciudad" showing "Madrid" | "País" dropdown showing "España (ES)"
- Input: "Teléfono" showing "+34 612 345 678"
- Input: "Email contacto" showing "envios@mitienda.com"

CARD 2 — "Configuración de aduanas (envíos fuera UE)" with customs/document icon:
- Important amber info banner: "⚠ Solo aplica a envíos fuera de la Unión Europea. Los envíos dentro de la UE y nacionales NO requieren datos de aduanas."
- Input: "EORI Number" showing "ES B12345678" with helper text "Obligatorio para exportaciones comerciales desde la UE"
- Dropdown: "Tipo de exportación por defecto" with options "Permanent / Temporary / Return" showing "Permanent"
- Dropdown: "Incoterms por defecto" with options "DAP / DDP / DDU" showing "DAP (Delivered At Place)"
- Input: "Descripción genérica mercancía" showing "Productos textiles" with helper text "Se usará como fallback si el producto no tiene descripción aduanera"
- Input: "Código arancelario por defecto (HS Code)" showing "6109.10" with helper text "Código HS de 6 dígitos. Los productos pueden tener su propio código."
- Dropdown: "Moneda declarada" showing "EUR"

CARD 3 — "Valores por defecto de paquete":
- Inline inputs: "Peso por defecto (kg)" showing "0.5" | "Largo (cm)" showing "30" | "Ancho (cm)" showing "20" | "Alto (cm)" showing "15"
- Checkbox: "☑ Usar peso del producto de Shopify si está disponible"

Bottom button: "Guardar configuración" in #D32011

All text in Spanish. Professional, structured, not overwhelming despite the amount of fields.
```

---

### PANTALLA 04 — Reglas de Enrutamiento (Express vs eCommerce Ibérica)

```
Web app routing rules configuration screen for "DHL Pro" shipping SaaS. The routing engine decides whether to ship with DHL Express (international premium, yellow) or DHL eCommerce Ibérica (national economy, red). This is critical because routing errors are COSTLY — sending a national package via Express instead of eCommerce can cost 3x more.

Colors: DHL Express yellow badge: #FFCC00 background with dark text #333. DHL eCommerce red badge: #D32011 with white text. Background #F6F6F7. Font: Inter. White cards.

Page title: "Reglas de enrutamiento"
Subtitle: "Define qué servicio DHL usar automáticamente para cada pedido"

TOP — Important red warning card:
"⚡ Las reglas de enrutamiento son críticas en DHL — un envío nacional por Express puede costar 3x más que por eCommerce Ibérica. Configura con cuidado."

DATA TABLE — Card with routing rules:
Table columns: Prioridad | Condición | Servicio DHL | Producto | Acciones
- Row 1: 1 | País destino ≠ España | YELLOW badge "DHL Express" | Express Worldwide | ✏️ 🗑️
- Row 2: 2 | País destino = Portugal | RED badge "eCommerce Ibérica" | Parcel Iberia | ✏️ 🗑️
- Row 3: 3 | Importe > 500€ | YELLOW badge "DHL Express" | Express 9:00 | ✏️ 🗑️
- Row 4: 4 | Método envío = Express | YELLOW badge "DHL Express" | Express Worldwide | ✏️ 🗑️
- Row 5 (gray, no delete): ∞ | Por defecto (España) | RED badge "eCommerce Ibérica" | Parcel Connect | ✏️
- Button: "+ Añadir regla" outlined

SIMULATOR CARD — Light yellow background tint:
Title: "🧪 Simulador de enrutamiento"
Subtitle: "Prueba qué servicio DHL se aplicaría a un pedido"
- 4 inline inputs: "Peso (kg)" showing "2.0" | "Importe (€)" showing "85" | "País destino" dropdown showing "Francia" | "Método envío" dropdown showing "Estándar"
- Button: "Simular" outlined
- Result: Arrow icon → "Se aplicaría: Regla 1 → DHL Express — Express Worldwide"
  With result in green success box and yellow DHL Express badge

All text in Spanish.
```

---

### PANTALLA 05 — Lista de Envíos

```
Web app data table screen for "DHL Pro" shipping management SaaS. Each shipment shows which DHL service was used: Express (yellow badge) or eCommerce Ibérica (red badge).

Colors: DHL Express badge: #FFCC00 background with dark #333 text. eCommerce badge: #D32011 with white text. Status badges: blue #0369A1, amber #D97706, green #059669, red #DC2626. Font: Inter.
Background #F6F6F7, white card containing the table.

Page title: "Envíos" with primary button top-right "Crear envío manual" in #D32011.

Filter bar: search input + service dropdown (Todos, DHL Express, eCommerce Ibérica) + status dropdown + date range picker.

Data table with 8 rows:
Columns: Pedido | Cliente | Destino | Servicio DHL | Producto | Estado | Fecha | Acciones

- #2047 | Sophie Laurent | París, Francia | YELLOW "Express" | Express WW | BLUE "Creado" | 17/02 | ⋯
- #2046 | Juan López | Barcelona, España | RED "eCommerce" | Parcel Connect | AMBER "En tránsito" | 16/02 | ⋯
- #2045 | Hans Müller | Berlín, Alemania | YELLOW "Express" | Express 12:00 | GREEN "Entregado" | 16/02 | ⋯
- #2044 | Ana Martín | Valencia, España | RED "eCommerce" | Parcel Connect | GREEN "Entregado" | 15/02 | ⋯
- #2043 | Marco Rossi | Milán, Italia | YELLOW "Express" | Express WW | RED "Incidencia" | 15/02 | ⋯
- #2042 | María García | Sevilla, España | RED "eCommerce" | Parcel Iberia | AMBER "En tránsito" | 14/02 | ⋯
- #2041 | João Silva | Lisboa, Portugal | RED "eCommerce" | Parcel Iberia | GREEN "Entregado" | 14/02 | ⋯
- #2040 | Li Wei | Shanghái, China | YELLOW "Express" | Express WW | DARK RED "Error aduanas" | 13/02 | ⋯

Pagination: "Mostrando 1-8 de 289 envíos"

All text in Spanish.
```

---

### PANTALLA 06 — Detalle de Envío (con Aduanas)

```
Web app detail page for "DHL Pro" shipping SaaS. Shows one international shipment with customs data section — unique to DHL.

Colors: DHL Express #FFCC00, success #059669. Font: Inter. Background #F6F6F7.

Top: back arrow + page title "Envío #DHL-2026-02047"
Next to title: Yellow badge on dark background "DHL Express"

THREE cards layout:

LEFT-TOP CARD — "Información del envío":
- Pedido Shopify: #2047
- Cliente: Sophie Laurent
- Dirección: 15 Rue de Rivoli, 75001 París, Francia
- Servicio: DHL Express (yellow dot)
- Producto: Express Worldwide
- Peso: 1.8 kg
- AWB Number: 1234567890 (bold, monospace)
- Regla aplicada: "Regla 1 → País ≠ España → Express" (subtle gray)
- Estado: green badge "Entregado"

RIGHT-TOP CARD — "Etiqueta de envío":
- Gray placeholder representing a DHL shipping label with yellow header bar
- Button: "Descargar AWB PDF" in #D32011
- Button secondary: "Descargar factura comercial"

MIDDLE CARD — "Datos de aduanas" (with customs icon):
- Small green badge: "Aduanas OK — despacho completado"
- EORI: ES B12345678
- Incoterms: DAP
- Valor declarado: €85.00 EUR
- HS Code: 6109.10
- Descripción: "Camiseta algodón orgánico"
- País origen: España (ES)

BOTTOM CARD — "Seguimiento del envío":
Vertical timeline with checkmarks and connecting line colored in #FFCC00 (yellow for Express):
✓ "AWB creado en MyDHL" — 15/02/2026 09:00
✓ "Recogido por mensajero DHL" — 15/02/2026 14:30
✓ "En hub Madrid-Barajas" — 15/02/2026 22:00
✓ "En tránsito Madrid → París CDG" — 16/02/2026 03:00
✓ "Despacho aduanas Francia — OK" — 16/02/2026 08:30
✓ "En reparto París" — 16/02/2026 10:15
✓ "Entregado — Firmado por: S. Laurent" — 16/02/2026 12:45

BOTTOM buttons:
- Red destructive: "Cancelar envío"
- Secondary outlined: "Crear devolución"

All text in Spanish.
```

---

### PANTALLA 07 — Crear Envío Manual

```
Web app form screen for creating a manual shipment in "DHL Pro" shipping SaaS. Includes rule preview and conditional customs section.

Colors: DHL Express #FFCC00 on dark, eCommerce #D32011. Font: Inter. Background #F6F6F7.

Top: back arrow + title "Crear envío manual"

Card 1 — "Seleccionar pedido":
- Search input: "Buscar pedido por número o cliente..."
- Selected: "#2047 — Sophie Laurent — 1 producto — 85,00€ — París, Francia"

Card 2 — "Servicio DHL":
- Info box showing automatic rule result:
  "🔀 Regla aplicada: País ≠ España → DHL Express — Express Worldwide"
- Toggle: "☐ Cambiar servicio manualmente (override)"
- When override checked, radio buttons:
  ● DHL Express (yellow dot) — dropdown: "Express Worldwide", "Express 12:00", "Express 9:00"
  ○ eCommerce Ibérica (red dot) — dropdown: "Parcel Connect", "Parcel Iberia"

Card 3 — "Peso y dimensiones":
- Input "Peso (kg)" showing "1.8"
- Three inline: "Largo (cm)", "Ancho (cm)", "Alto (cm)"
- Checkbox: "Usar peso del producto de Shopify"

Card 4 — "Dirección de destino":
- Pre-filled: Nombre, Dirección, Ciudad, CP, País (dropdown showing "Francia")

Card 5 — "Datos de aduanas" (CONDITIONAL — only visible when country ≠ Spain):
- Amber info banner: "ℹ Este envío requiere datos de aduanas (destino fuera de España)"
- Inputs pre-filled from defaults: HS Code, Descripción mercancía, Valor declarado, Incoterms dropdown
- Checkbox: "☑ Usar datos de aduanas por defecto de configuración"

Footer: "Crear envío" in #D32011 | "Cancelar" outlined

All text in Spanish.
```

---

### PANTALLA 08 — Impresión Batch de Etiquetas

```
Web app batch label printing screen for "DHL Pro" shipping SaaS. Labels grouped by DHL service.

Colors: DHL Express #FFCC00, eCommerce #D32011. Font: Inter. Background #F6F6F7.

Page title: "Impresión de etiquetas en lote"

Table with checkboxes, 6 rows, 4 checked:
Columns: ☑ | Pedido | Cliente | Servicio badge | Destino | Estado | Fecha
- Mix of yellow "Express" and red "eCommerce" badges
- Bulk action bar: "4 envíos seleccionados (2 Express + 2 eCommerce)"

Card — "Opciones de descarga":
- Radio buttons:
  ● "Separar por servicio (un PDF para Express + un PDF para eCommerce)" — selected
  ○ "PDF combinado"
  ○ "ZIP individual"
- Dropdown: "Formato" with "A4" selected (DHL uses A4 format)
- Checkbox: "☑ Incluir factura comercial en envíos internacionales"

Preview area: Two groups:
- Left with yellow header "DHL Express (2)": 2 gray label thumbnails with yellow top bar
- Right with red header "eCommerce Ibérica (2)": 2 gray label thumbnails with red top bar

Footer: "Descargar 4 etiquetas" in #D32011 | "Seleccionar todos"

All text in Spanish.
```

---

### PANTALLA 09 — Lista de Devoluciones

```
Web app returns list screen for "DHL Pro" shipping SaaS.

Colors: DHL Express #FFCC00, eCommerce #D32011, status badges standard colors. Font: Inter.

Page title: "Devoluciones" with button "Crear devolución" in #D32011.
Filter bar: search + service dropdown + status dropdown.

Data table with 5 rows:
Pedido | Cliente | Servicio | Origen | Motivo | Estado | Fecha | Etiqueta | Acciones

- #2047 | Sophie Laurent | YELLOW "Express" | París, FR | Producto defectuoso | BLUE "Solicitada" | 17/02 | Descargar | ⋯
- #2043 | Marco Rossi | YELLOW "Express" | Milán, IT | Talla incorrecta | AMBER "En tránsito" | 16/02 | Descargar | ⋯
- #2042 | María García | RED "eCommerce" | Sevilla, ES | Cambio de opinión | GREEN "Recibida" | 15/02 | Descargar | ⋯
- #2040 | Juan López | RED "eCommerce" | Barcelona, ES | No corresponde | GREEN "Recibida" | 14/02 | Descargar | ⋯
- #2038 | Hans Müller | YELLOW "Express" | Berlín, DE | Producto dañado | RED "Incidencia" | 13/02 | Descargar | ⋯

Pagination at bottom. All text in Spanish.
```

---

### PANTALLA 10 — Crear Devolución

```
Web app return creation form for "DHL Pro" shipping SaaS.

Colors: DHL Express #FFCC00, eCommerce #D32011. Font: Inter. Background #F6F6F7.

Top: back arrow + title "Crear devolución"

Card 1 — "Seleccionar pedido":
- Search: "Buscar pedido entregado..."
- Selected: "#2047 — Sophie Laurent — Entregado 16/02/2026 — via DHL Express" (yellow badge)

Card 2 — "Motivo":
- Dropdown: "Producto defectuoso", "Talla incorrecta", "No corresponde", "Cambio de opinión", "Otro"
- Textarea: "Notas adicionales (opcional)"

Card 3 — "Servicio para la devolución":
- Radio buttons:
  ● (yellow dot) "DHL Express — Return Worldwide" — selected
  ○ (red dot) "eCommerce Ibérica — Return Connect"
- Helper: "Para devoluciones internacionales se recomienda DHL Express"

Card 4 — "Dirección de recogida":
- Toggle ON: "Usar dirección del pedido original"
- Pre-filled fields

Card 5 — "Método":
- Radio buttons:
  ● "Generar etiqueta (el cliente lleva a punto DHL)"
  ○ "Solicitar recogida en domicilio"

Footer: "Generar etiqueta de devolución" in #D32011 | "Cancelar"

All text in Spanish.
```

---

### PANTALLA 11 — Recogidas

```
Web app pickup scheduling screen for "DHL Pro". Two separate pickup systems for Express and eCommerce.

Colors: DHL Express #FFCC00, eCommerce #D32011, success #059669, warning #D97706. Font: Inter.

Page title: "Recogidas" with button "Nueva recogida" in #D32011.

TOP — Service tab selector:
Two tabs: "DHL Express" (yellow underline, active) | "eCommerce Ibérica" (red, inactive)

Two-column layout:

LEFT (60%) — Monthly calendar February 2026.
- Today (17) highlighted with yellow #FFCC00 circle
- Days with colored dots:
  Day 18: yellow dot (Express pickup)
  Day 20: red dot (eCommerce pickup)
  Day 22: yellow dot (Express pickup)

RIGHT (40%) — Card "Próximas recogidas":
- 📦 18/02 — 10:00-14:00 — 3 paquetes — YELLOW "Express" — green "Confirmada"
- 📦 20/02 — 09:00-18:00 — 8 paquetes — RED "eCommerce" — amber "Pendiente"
- 📦 22/02 — 10:00-14:00 — 2 paquetes — YELLOW "Express" — amber "Pendiente"

BELOW — "Nueva recogida" form:
- Radio: ● DHL Express (yellow) ○ eCommerce Ibérica (red)
- Date picker + time slot dropdown
- Input: "Número de paquetes"
- Input: "Notas para el mensajero"
- Button: "Solicitar recogida" in #D32011

All text in Spanish.
```

---

### PANTALLA 12 — Dashboard

```
Web app analytics dashboard for "DHL Pro" shipping management SaaS. Shows global metrics plus breakdown by service (Express vs eCommerce Ibérica) and geographic distribution.

Colors: DHL Express #FFCC00, eCommerce #D32011, error #DC2626, success #059669. Font: Inter. Background #F6F6F7.

Page title: "Dashboard" with date selector "Últimos 7 días".

TOP ROW — 4 metric cards:
1. "Envíos hoy" — "12" — green "+3 vs ayer"
2. "En tránsito" — "28" — amber indicator
3. "Incidencias aduanas" — "2" — red indicator — "Ver todas"
4. "Entregados (semana)" — "87" — green

SECOND ROW — 2 service cards:
- "DHL Express esta semana" — "52 envíos" — yellow dot — "60% del total"
- "eCommerce Ibérica esta semana" — "35 envíos" — red dot — "40% del total"

MIDDLE — Stacked bar chart:
Title: "Envíos por día — Última semana"
7 bars, each split: bottom yellow (#FFCC00) = Express, top red (#D32011) = eCommerce
Legend: yellow square "Express" + red square "eCommerce"

BOTTOM LEFT — "Top destinos":
Horizontal bars: España (45%), Francia (15%), Alemania (12%), Italia (8%), Portugal (7%), Otros (13%)

BOTTOM RIGHT — "Incidencias recientes":
- "#2043 — Retenido en aduanas — hace 2h" with YELLOW Express badge
- "#2040 — Error datos aduanas — hace 5h" with YELLOW Express badge
- "#2039 — Dirección incorrecta — hace 1d" with RED eCommerce badge
- Link: "Ver todas las incidencias"

All text in Spanish.
```

---

### PANTALLA 13 — Facturación

```
Web app billing screen for "DHL Pro" shipping SaaS.

Colors: DHL Yellow #FFCC00, DHL Red #D32011. Font: Inter. Background #F6F6F7.

Page title: "Facturación y plan"

TOP CARD — "Tu plan actual":
- "Plan Profesional" with green "Activo" badge
- "49,00€/mes"
- "Envíos ilimitados + Datos aduanas automáticos + Soporte prioritario"
- Service breakdown bars:
  Yellow bar: "DHL Express: 156 envíos (62%)"
  Red bar: "eCommerce Ibérica: 96 envíos (38%)"
- "Renueva el 01/03/2026"
- Buttons: "Cambiar plan" | "Cancelar suscripción" (red text)

MIDDLE — 3 pricing cards:
1. "Starter" — 29€/mes — 100 envíos/mes — Solo eCommerce Ibérica — "Downgrade"
2. "Profesional" — 49€/mes — Ilimitados — Express + eCommerce — highlighted #D32011 border — "Plan actual"
3. "Business" — 99€/mes — Ilimitados — Multi-cuenta — Aduanas masivas — Soporte dedicado — "Upgrade" #D32011

BOTTOM — "Historial de facturación" table:
- 01/02/2026 | Plan Profesional | 49,00€ | green "Pagado" | Descargar
- 01/01/2026 | Plan Profesional | 49,00€ | green "Pagado" | Descargar
- 01/12/2025 | Plan Starter | 29,00€ | green "Pagado" | Descargar

All text in Spanish.
```

---

### ESTADOS GLOBALES — Credenciales No Verificadas

```
Web app screen showing a warning banner at the top of a shipping list page for "DHL Pro".

Colors: warning #D97706, DHL Red #D32011. Font: Inter. Background #F6F6F7.

Persistent amber warning banner:
"⚠ Conecta al menos DHL Express o eCommerce Ibérica para empezar a crear envíos" with button "Configurar ahora"

Below: shipments table grayed out and disabled with overlay/reduced opacity.

All text in Spanish.
```

---

### ESTADOS GLOBALES — Empty State

```
Web app empty state for shipping list with no data for "DHL Pro".

Colors: DHL Red #D32011, DHL Yellow #FFCC00. Font: Inter. Background #F6F6F7.

Page title: "Envíos"

Centered:
- Simple illustration of a delivery truck or airplane with DHL yellow styling (minimal line art)
- Heading: "Aún no tienes envíos"
- Description: "Cuando se complete un pedido en tu tienda, los envíos se crearán automáticamente según tus reglas de enrutamiento. También puedes crear uno manualmente."
- Primary button: "Crear envío manual" in #D32011
- Small link: "Configurar reglas de enrutamiento"

All text in Spanish.
```

---

## PARTE 3: Workflow completo — De Stitch a entregable final

### Carpeta de organización

```
DHLPro_Mockups/
├── 01_bienvenida/
│   ├── mockup.png
│   └── index.html
├── 02_conexion_dhl/
├── 02b_modal_ayuda/
├── 03_datos_empresa_aduanas/        ← EXCLUSIVA DHL
├── 04_reglas_enrutamiento/
├── 05_lista_envios/
├── 06_detalle_envio/
├── 07_crear_envio/
├── 08_batch_print/
├── 09_lista_devoluciones/
├── 10_crear_devolucion/
├── 11_recogidas/
├── 12_dashboard/
├── 13_facturacion/
└── estados_globales/
    ├── credenciales_warning.png
    └── empty_state.png
```
