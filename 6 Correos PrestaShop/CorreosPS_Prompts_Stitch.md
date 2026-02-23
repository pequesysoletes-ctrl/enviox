# Correos PrestaShop — Prompts para Google Stitch + Guía de Workflow

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
4. Repite para las 14 pantallas
5. Al final: unifica todo (ver Parte 3)
```

### Configuración en Stitch

- **Modo Standard**: Pantallas simples → 01, 02b, 08, 09
- **Modo Experimental**: Pantallas complejas → 02, 03, 04, 05, 06, 07, 10, 11
- **Plataforma**: Selecciona siempre **"Web"** (no mobile)
- **Tema**: Light

### Tips para mejores resultados en Stitch

- PrestaShop tiene su propio estilo de back-office (no WordPress, no Shopify)
- Si no clava el estilo PS, di: "Make it look like a PrestaShop 1.7+ back-office module page with the standard PrestaShop admin styling"
- Colores: Correos Standard rojo #D4351C, Correos Express azul #1C4F8A (mismos que Correos Pro Shopify)
- IMPORTANTE: Incluir el badge ENV (PRO/PRE) que es diferenciador único

---

## PARTE 2: Los 14 Prompts adaptados para Stitch

---

### PANTALLA 01 — Bienvenida / Instalación

```
Web app onboarding screen for "Correos PrestaShop", a dual-carrier shipping module for PrestaShop that integrates Correos Standard and Correos Express. This runs inside the PrestaShop back-office.

Colors: Correos Standard red #D4351C, Correos Express blue #1C4F8A, PrestaShop back-office gray background #EBEFF4, cards white, success green #72C279. Font: Open Sans (PrestaShop default).

PrestaShop back-office layout with left sidebar showing PS menu items (Dashboard, Pedidos, Catálogo, Clientes, Transporte, Módulos, etc.) with "Correos Pro" highlighted.

MAIN CONTENT:

Top bar showing: "Módulos > Correos Pro" breadcrumb
Page title: "Correos Pro — Configuración inicial"

Centered white card:
- "Correos Pro" logo text in #D4351C, bold. Below: "Correos Standard + Correos Express para PrestaShop"
- 3-step stepper:
  Step 1 "Conecta" (active, red #D4351C)
  Step 2 "Reglas de enrutamiento" (gray)
  Step 3 "Envía" (gray)
- Text: "Este módulo conecta con tu contrato propio de Correos Ecommerce y/o Correos Express. Necesitas credenciales API."
- Primary button: "Empezar configuración" in #D4351C
- Link: "¿No tengo mis credenciales?"

TOP-RIGHT CORNER — Small badge:
Green badge "PRO" or red badge "PRE" — this is the ENV badge showing if the module is connected to Production or Pre-production API. Currently showing: amber "SIN CONEXIÓN"

All text in Spanish. PrestaShop back-office styling.
```

---

### PANTALLA 02 — Conexión Correos (Dual Carrier)

```
Web app settings form for "Correos PrestaShop" module. TWO separate credential sections for Correos Standard and Correos Express. PrestaShop back-office style.

Colors: Correos Standard #D4351C, Correos Express #1C4F8A, PS back-office #EBEFF4. Font: Open Sans.

PrestaShop back-office layout.

Page title: "Conexión con Correos"

ENV BADGE top-right: Green badge "🟢 PRO" (showing production environment)

Warning banner (amber):
"Requisito: Necesitas al menos un contrato activo — Correos Ecommerce o Correos Express con acceso API."

SECTION A — "Correos Standard" card with red left border (#D4351C):
Title with red postal icon: "Correos Standard"
- Input: "Código contrato Correos" — required
- Input: "Password API" — password field with toggle
- Dropdown: "Entorno" — "Producción" / "Pre-producción (pruebas)"
- Button: "Verificar Standard" in #D4351C
- Green success: "✓ Correos Standard conectado — Entorno: PRO"
- Small: "(Opcional si solo usas Express)"

SECTION B — "Correos Express" card with blue left border (#1C4F8A):
Title with blue express icon: "Correos Express"
- Input: "Código contrato Correos Express" — required
- Input: "Password API CE" — password field
- Dropdown: "Entorno" — "Producción" / "Pre-producción"
- Button: "Verificar Express" in #1C4F8A
- Red error: "✗ Error: credenciales incorrectas"
- Small: "(Opcional si solo usas Standard)"

Bottom: Link "¿Dónde encuentro mis credenciales?" + note "Al menos una conexión debe estar verificada."

All text in Spanish. PrestaShop styling.
```

---

### PANTALLA 02b — Modal Ayuda Credenciales

```
Modal dialog for "Correos PrestaShop" showing how to find API credentials.

Colors: Standard #D4351C, Express #1C4F8A. Font: Open Sans. Dark backdrop.

Modal title: "¿Dónde encuentro mis credenciales?"

SECTION 1 (red accent):
"Correos Standard"
1. "Accede a empresas.correos.es > Mi cuenta"
2. "Ve a Integraciones > API Ecommerce"
3. "Tus credenciales están en Pre-registro API"

SECTION 2 (blue accent):
"Correos Express"
1. "Accede a correosexpress.es > Área privada"
2. "Ve a Integraciones"
3. "Solicita credenciales API a tu delegación"

Info box: "Si ya usaste el módulo oficial de Correos, tus credenciales son las mismas."

Footer: "Cerrar" button.

All text in Spanish. PrestaShop modal styling.
```

---

### PANTALLA 03 — Reglas de Enrutamiento

```
Web app routing rules screen for "Correos PrestaShop" module. Same concept as Correos Pro Shopify — automatic routing between Standard (red) and Express (blue). PrestaShop back-office style.

Colors: Standard #D4351C, Express #1C4F8A, PS background #EBEFF4. Font: Open Sans.

PrestaShop back-office layout.

Page title: "Reglas de enrutamiento"
Subtitle: "Define qué transportista usar automáticamente"

ENV BADGE top-right: Green "🟢 PRO"

RULES TABLE card:
Columns: Prioridad | Condición | Transportista | Servicio | Acciones
- Row 1: 1 | Peso > 3 kg | RED badge "Standard" | Paquete Azul | ✏️ 🗑️
- Row 2: 2 | Importe > 200€ | BLUE badge "Express" | Express 24h | ✏️ 🗑️
- Row 3: 3 | Zona = Canarias | RED badge "Standard" | Internacional | ✏️ 🗑️
- Row 4: 4 | Método envío = Express | BLUE badge "Express" | Express 24h | ✏️ 🗑️
- Row 5 (gray, no delete): ∞ | Por defecto | RED badge "Standard" | Paq Estándar | ✏️
- Button: "+ Añadir regla"

SIMULATOR card (light blue tint):
Title: "🧪 Simulador"
4 inputs: Peso | Importe | Provincia dropdown | Método envío dropdown
Button: "Simular"
Result: "→ Regla por defecto → Correos Standard — Paq Estándar" in green box

Bottom amber warning: "⚠ 1 regla apunta a Express pero Express no está conectado. Conectar →"

All text in Spanish. PrestaShop back-office styling.
```

---

### PANTALLA 04 — Lista de Envíos

```
Web app shipment list for "Correos PrestaShop" module. PrestaShop back-office style with carrier badges.

Colors: Standard #D4351C, Express #1C4F8A, status badges standard. Font: Open Sans. PS background #EBEFF4.

PrestaShop back-office layout.

Page title: "Envíos" with button "Crear envío manual" in #D4351C

ENV BADGE top-right: Green "🟢 PRO"

Filter bar: search + carrier dropdown + status dropdown + date range

Data table (PrestaShop admin table style) — 8 rows:
Pedido | Cliente | Destino | Transportista | Servicio | Estado | Fecha | Acciones

- #2047 | María García | Madrid | RED "Standard" | Paq Estándar | BLUE "Creado" | 17/02 | ⋯
- #2046 | Juan López | Barcelona | BLUE "Express" | Express 24h | AMBER "En tránsito" | 16/02 | ⋯
- #2045 | Ana Martín | Valencia | RED "Standard" | Paq Premium | GREEN "Entregado" | 16/02 | ⋯
- #2044 | Pedro Ruiz | Sevilla | RED "Standard" | Paquete Azul | RED "Incidencia" | 15/02 | ⋯
- #2043 | Laura Díaz | Bilbao | BLUE "Express" | Express 24h | GREEN "Entregado" | 15/02 | ⋯
- #2042 | Carlos Sanz | Málaga | RED "Standard" | Paq Estándar | AMBER "En tránsito" | 14/02 | ⋯
- #2041 | Elena Vega | Zaragoza | BLUE "Express" | Express 48h | GREEN "Entregado" | 14/02 | ⋯
- #2040 | David Moreno | Las Palmas | RED "Standard" | Internacional | DARK RED "Error" | 13/02 | ⋯

Pagination: "Mostrando 1-8 de 345 envíos"

All text in Spanish. PrestaShop admin table styling.
```

---

### PANTALLA 05 — Detalle de Envío

```
Web app shipment detail for "Correos PrestaShop". Shows full shipment info with tracking timeline.

Colors: Standard #D4351C. Font: Open Sans. PS background #EBEFF4.

PrestaShop back-office layout.

Top: "← Envíos" back link + "Envío #COR-2026-02047" + RED "Standard" badge

ENV BADGE: Green "🟢 PRO"

Two cards side by side:

LEFT — "Información del envío":
- Pedido PS: #2047
- Cliente: María García
- Dirección: Calle Ejemplo 15, 28001 Madrid
- Transportista: Correos Standard (red dot)
- Servicio: Paq Estándar
- Peso: 2.5 kg
- Localizador: PQ4E7X0002345
- Regla aplicada: "Por defecto → Paq Estándar"
- Estado: GREEN "Entregado"

RIGHT — "Etiqueta":
- Gray label placeholder
- Button: "Descargar etiqueta PDF" in #D4351C

BELOW — "Seguimiento":
Timeline in #D4351C:
✓ "Pre-registrado en Correos" — 15/02 09:00
✓ "Admitido en oficina origen" — 15/02 14:30
✓ "En tránsito — Madrid" — 16/02 06:00
✓ "En reparto" — 16/02 10:15
✓ "Entregado — M. García" — 16/02 12:45

Buttons: "Cancelar envío" red | "Crear devolución" outlined

All text in Spanish. PrestaShop styling.
```

---

### PANTALLA 06 — Crear Envío Manual

```
Web app form for manual shipment creation in "Correos PrestaShop". PrestaShop back-office.

Colors: Standard #D4351C, Express #1C4F8A. Font: Open Sans.

Top: "← Envíos" + "Crear envío manual"

Card 1 — "Seleccionar pedido":
- Search: "Buscar pedido..."
- Selected: "#2047 — Juan López — 2 productos — 45,00€"

Card 2 — "Transportista y servicio":
- Info box: "🔀 Regla: Por defecto → Correos Standard — Paq Estándar"
- Toggle: "☐ Cambiar manualmente"
- Radio when override:
  ● Standard (red) — dropdown services
  ○ Express (blue) — dropdown services

Card 3 — "Peso y dimensiones":
- Input: Peso, Largo, Ancho, Alto
- Checkbox: "Usar valores por defecto"

Card 4 — "Dirección destino":
- Pre-filled from order

Footer: "Crear envío" #D4351C | "Cancelar"

All text in Spanish. PrestaShop admin form styling.
```

---

### PANTALLA 07 — Impresión Batch

```
Web app batch label printing for "Correos PrestaShop". Labels grouped by carrier.

Colors: Standard #D4351C, Express #1C4F8A. Font: Open Sans. PS background.

Page title: "Impresión en lote"

Table with checkboxes, 6 rows, 4 checked:
Mix of RED "Standard" and BLUE "Express" badges
Bulk bar: "4 seleccionados (3 Standard + 1 Express)"

Options card:
- Radio: ● Separar por transportista ○ PDF combinado ○ ZIP
- Dropdown: "Formato: 10x15cm"

Preview: Two groups:
- Left "Standard (3)": 3 gray thumbnails
- Right "Express (1)": 1 gray thumbnail

Button: "Descargar 4 etiquetas" #D4351C

All text in Spanish. PrestaShop styling.
```

---

### PANTALLA 08 — Devoluciones

```
Web app returns list for "Correos PrestaShop". PrestaShop back-office style.

Colors: Standard #D4351C, Express #1C4F8A. Font: Open Sans.

Page title: "Devoluciones" with button "Crear devolución" #D4351C
Filter bar + data table with 5 rows showing carrier badges and status badges.

Standard PrestaShop admin table. All text in Spanish.
```

---

### PANTALLA 09 — Crear Devolución

```
Web app return creation form for "Correos PrestaShop". PrestaShop styling.

Colors: Standard #D4351C, Express #1C4F8A. Font: Open Sans.

Top: "Crear devolución"

Card 1: Select delivered order (with carrier badge)
Card 2: Return reason dropdown + notes
Card 3: Carrier for return (radio Standard/Express)
Card 4: Pickup address (toggle use original)
Card 5: Method (generate label / request pickup)

Footer: "Generar etiqueta" #D4351C | "Cancelar"

All text in Spanish. PrestaShop form styling.
```

---

### PANTALLA 10 — Recogidas

```
Web app pickup scheduling for "Correos PrestaShop". Calendar view with dual carrier.

Colors: Standard #D4351C, Express #1C4F8A. Font: Open Sans. PS background.

Page title: "Recogidas" with "Nueva recogida" button

Tab selector: "Correos Standard" (red active) | "Correos Express" (blue)

Two columns:
LEFT (60%): Monthly calendar Feb 2026 with colored dots on scheduled days
RIGHT (40%): "Próximas recogidas" list with carrier badges and status

Below: "Nueva recogida" form: carrier radio, date, time slot, packages, notes
Button: "Solicitar recogida" #D4351C

ENV BADGE: Green "🟢 PRO"

All text in Spanish. PrestaShop styling.
```

---

### PANTALLA 11 — Dashboard

```
Web app dashboard for "Correos PrestaShop" module. Global metrics with Standard/Express breakdown.

Colors: Standard #D4351C, Express #1C4F8A. Font: Open Sans. PS background #EBEFF4.

PrestaShop back-office layout.

Page title: "Dashboard" with date selector "Últimos 7 días"

ENV BADGE: Green "🟢 PRO"

4 metric cards: Envíos hoy (18), En tránsito (34), Incidencias (4), Entregados semana (112)

2 carrier cards: Standard 78 envíos (70%) | Express 34 envíos (30%)

Stacked bar chart: "Envíos por día" — 7 bars split red (Standard) + blue (Express)

Bottom row:
- Left: "Incidencias recientes" with carrier badges
- Right: "Distribución por servicio" horizontal bars (Paq Estándar, Paq Premium, Express 24h, etc.)

All text in Spanish. PrestaShop admin styling.
```

---

### PANTALLA 12 — Facturación / Licencia

```
Web app module license and billing for "Correos PrestaShop".

Colors: Correos #D4351C. Font: Open Sans. PS background.

Page title: "Licencia del módulo"

TOP — "Tu licencia actual":
- "Plan Profesional" green "Activo"
- "49,00€/mes" — "Envíos ilimitados + Motor reglas + Soporte"
- Carrier breakdown: Standard 245 (72%) | Express 97 (28%)
- "Renueva: 01/03/2026"

MIDDLE — 3 plan cards:
- Starter 29€ | Profesional 49€ (highlighted, current) | Business 99€

BOTTOM — "Historial de pagos" table

All text in Spanish. PrestaShop styling.
```

---

### ESTADOS — ENV Badge Detail

```
Web app showing the ENV badge system for "Correos PrestaShop". This is a UNIQUE differentiator — shows whether API calls go to Production or Pre-production.

Colors: PRO badge green #72C279, PRE badge amber #FFBA00, ERROR badge red #DC3232. Font: Open Sans.

Show THREE states of the same page header corner:

State 1: Green badge "🟢 PRO" with tooltip: "Conectado a Correos Producción — Los envíos son REALES"
State 2: Amber badge "🟡 PRE" with tooltip: "Conectado a Correos Pre-producción — Los envíos son de PRUEBA, no se generarán etiquetas reales"
State 3: Red badge "🔴 SIN CONEXIÓN" with tooltip: "No hay conexión activa con Correos"

Small info card below explaining the badge:
"Este badge es visible en TODAS las pantallas del módulo. Evita el error histórico de sep 2025 donde envíos reales se enviaron al entorno de pruebas sin darse cuenta."

All text in Spanish.
```

---

### ESTADOS — Empty State

```
Empty state for "Correos PrestaShop" shipments list.

Colors: #D4351C. Font: Open Sans. PS background.

Centered:
- Postal box illustration (line art)
- "Aún no tienes envíos"
- "Los envíos se crearán automáticamente según tus reglas. También puedes crear uno manualmente."
- Button: "Crear envío manual" #D4351C
- Link: "Configurar reglas"

PrestaShop admin empty state styling. All text in Spanish.
```

---

## PARTE 3: Workflow completo

### Carpeta de organización

```
CorreosPS_Mockups/
├── 01_bienvenida/
│   ├── mockup.png
│   └── index.html
├── 02_conexion_correos/
├── 02b_modal_ayuda/
├── 03_reglas_enrutamiento/
├── 04_lista_envios/
├── 05_detalle_envio/
├── 06_crear_envio/
├── 07_batch_print/
├── 08_devoluciones/
├── 09_crear_devolucion/
├── 10_recogidas/
├── 11_dashboard/
├── 12_licencia/
└── estados/
    ├── env_badge.png
    └── empty_state.png
```
