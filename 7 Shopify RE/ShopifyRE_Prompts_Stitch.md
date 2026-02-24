# Shopify RE — Prompts para Google Stitch + Guía de Workflow

> **Versión optimizada para stitch.withgoogle.com**
> Febrero 2026

---

## PARTE 1: Cómo usar estos prompts en Stitch

### Flujo de trabajo recomendado

```
Por cada pantalla:
1. Copia el prompt en Stitch (modo Experimental para pantallas complejas)
2. Genera → Revisa → Itera con el chat
3. Exportar → Carpeta
4. Repite para las 12 pantallas
```

### Configuración en Stitch

- **Modo Standard**: Pantallas simples → 01, 09, 10
- **Modo Experimental**: Pantallas complejas → 02, 03, 05, 06, 07, 08
- **Plataforma**: **"Web"**
- **Tema**: Light

### Tips

- Shopify Polaris style — componentes nativos de Shopify admin
- RE tiene un toque de morado (#6B21A8) como accent propio para diferenciar de las apps de logística (que son verdes)
- Todo en español (mercado España)
- La pantalla 04 (checkout) es DIFERENTE — es una Checkout Extension, no admin Polaris

---

## PARTE 2: Los 12 Prompts

---

### PANTALLA 01 — Onboarding / Welcome

```
Web app onboarding welcome screen for "Shopify RE", a Shopify app that manages Recargo de Equivalencia (a Spanish tax surcharge for wholesale-to-retail transactions).

Colors: Shopify green #008060, RE purple accent #6B21A8, background #F6F6F7, cards white. Font: Inter / system-ui. Style: Shopify admin panel (Polaris design system).

Centered white card on gray background:
- "Shopify RE" logo text in #6B21A8 bold. Below: "Gestión automática del Recargo de Equivalencia"
- 3-step stepper:
  Step 1 "Configura" (active, purple #6B21A8)
  Step 2 "Clientes RE" (gray)
  Step 3 "Factura" (gray)
- Description text: "El Recargo de Equivalencia es un régimen especial de IVA para comerciantes minoristas en España. Esta app lo gestiona automáticamente: identifica clientes RE, calcula el recargo y genera facturas con desglose."
- Info table preview:
  | Tipo IVA | % IVA | % RE | Total |
  | General | 21% | 5.2% | 26.2% |
  | Reducido | 10% | 1.4% | 11.4% |
  | Superreducido | 4% | 0.5% | 4.5% |
- Primary button: "Empezar configuración" in #008060
- Small link: "¿Qué es el Recargo de Equivalencia? →"
- Trust badges: "🔒 Datos encriptados • 📋 Cumple normativa AEAT • 🇪🇸 100% España"

All text in Spanish. Shopify Polaris styling.
```

---

### PANTALLA 02 — Configuración

```
Web app settings screen for "Shopify RE", a Shopify app managing Recargo de Equivalencia (Spanish tax surcharge). Shopify admin Polaris styling.

Colors: Shopify green #008060, RE purple #6B21A8, background #F6F6F7. Font: Inter.

Shopify admin layout with left sidebar (Dashboard, Clientes RE, Pedidos RE, Dashboard, Exportar, Facturación, Configuración — with Configuración active with purple indicator).

MAIN CONTENT:

Page title: "Configuración del Recargo de Equivalencia"

Card 1 — "Estado del plugin" with purple header accent:
- Toggle ON: "☑ Activar Recargo de Equivalencia"
- Info banner (blue): "El RE es obligatorio para vendedores que facturan a comerciantes minoristas acogidos al régimen especial. Tipos vigentes: 5.2% (general), 1.4% (reducido), 0.5% (superreducido)."
- Table of current RE rates:
  | Tipo IVA | % IVA | % RE | Total |
  | General | 21% | 5.2% | 26.2% |
  | Reducido | 10% | 1.4% | 11.4% |
  | Superreducido | 4% | 0.5% | 4.5% |

Card 2 — "Comportamiento":
- Radio buttons:
  ● "Aplicar RE automáticamente a clientes marcados" — selected
  ○ "Solo aplicar RE manualmente"
- Toggle: "☑ Mostrar desglose RE en facturas"
- Toggle: "☑ Incluir RE como línea en checkout"
- Dropdown: "Tipo IVA por defecto para productos sin configurar" → "21% (General)"

Card 3 — "Datos fiscales del vendedor":
- Input: "Nombre empresa" showing "Mi Tienda S.L."
- Input: "NIF / CIF" showing "B12345678" with green checkmark "✓ Válido"
- Input: "Dirección fiscal" showing "Calle Ejemplo 15, 28001 Madrid"
- Input: "Prefijo facturas RE" showing "RE"
- Input: "Siguiente número factura" showing "1"

Bottom: green button "Guardar configuración" #008060

All text in Spanish. Shopify Polaris form components.
```

---

### PANTALLA 03 — Lista de Clientes RE

```
Web app customer list screen for "Shopify RE". Shows customers marked as Recargo de Equivalencia eligible. Shopify Polaris styling.

Colors: Shopify green #008060, RE purple #6B21A8 for RE badges, background #F6F6F7. Font: Inter.

Shopify admin layout with sidebar.

Page title: "Clientes con Recargo de Equivalencia"
Button top-right: "Añadir cliente RE" in purple #6B21A8

Filter bar: Search "Buscar por nombre, email o NIF..." + Status dropdown

Shopify IndexTable with 6 rows:
Columns: Cliente | Email | NIF/CIF | Tipo Comercio | Estado RE | Pedidos RE | Último pedido | Acciones

- María García López | maria@tienda.es | A12345678 | Minorista alimentación | PURPLE "Activo RE" badge | 23 | 15/02/2026 | Editar
- Juan Pérez Ruiz | juan@comercio.es | B87654321 | Minorista textil | PURPLE "Activo RE" | 15 | 14/02/2026 | Editar
- Ana Martín Sanz | ana@bazar.es | C11223344 | Bazar/Regalo | PURPLE "Activo RE" | 8 | 12/02/2026 | Editar
- Pedro López Díaz | pedro@ferret.es | B99887766 | Ferretería | AMBER "Pendiente" | 0 | — | Verificar
- Laura Fernández | laura@papeleria.es | A55667788 | Papelería | GRAY "Inactivo" | 12 | 10/01/2026 | Reactivar
- Carlos Rodríguez | carlos@bazarmax.es | B33445566 | Bazar | PURPLE "Activo RE" | 31 | 16/02/2026 | Editar

Summary card below:
"42 clientes RE activos • €127.340 facturado con RE • €6.621 RE cobrado este año"

All text in Spanish. Shopify Polaris IndexTable.
```

---

### PANTALLA 04 — Checkout (Customer-facing)

```
Web page showing a Shopify checkout page as seen by the CUSTOMER. This shows how Recargo de Equivalencia appears in the checkout when the buyer is a registered RE customer.

This is NOT an admin page — it's the Shopify Checkout with a Checkout UI Extension.

Colors: Shopify checkout style — clean white background, Shopify green #008060 buttons, text dark #333. Font: system-ui.

Standard Shopify checkout layout:

LEFT SIDE — Order summary:
Product thumbnails with names and prices:
- [img] Camiseta algodón orgánico × 2 — 50,00€
- [img] Pantalón chino slim × 1 — 45,00€

ORDER TOTALS (right side or below):
- Subtotal: 95,00€
- Envío: 4,95€
- IVA (21%): 19,95€
- **Recargo de Equivalencia (5,2%): 4,94€** ← This line is highlighted with a subtle purple left border and info icon (i)
- ─────────────
- **Total: 124,84€**

INFO BANNER (injected by Checkout UI Extension):
Purple tinted info banner: "🏪 Recargo de Equivalencia aplicado automáticamente a su cuenta de comerciante minorista."

Small info tooltip on hover: "El RE (5,2%) se aplica según Art. 154-163 Ley 37/1992 del IVA para comerciantes acogidos al régimen especial."

Green "Pagar ahora" button at bottom.

Clean, standard Shopify checkout with the RE additions being subtle but clearly visible. All text in Spanish.
```

---

### PANTALLA 05 — Lista de Pedidos con RE

```
Web app orders list for "Shopify RE". Shows only orders with Recargo de Equivalencia applied. Shopify Polaris styling.

Colors: Shopify green #008060, RE purple #6B21A8, background #F6F6F7. Font: Inter.

Page title: "Pedidos con Recargo de Equivalencia"
Filter bar: Date range + Customer dropdown + Status dropdown

Shopify IndexTable with 6 rows:
Columns: Pedido | Cliente | NIF | Subtotal | IVA | RE | Total | Estado | Fecha | Factura

- #1089 | María García | A12345678 | 95,00€ | 19,95€ | 4,94€ | 119,89€ | GREEN "Completado" | 15/02 | 📄
- #1085 | Juan Pérez | B87654321 | 230,00€ | 48,30€ | 11,96€ | 290,26€ | GREEN "Completado" | 14/02 | 📄
- #1082 | Carlos Rodríguez | B33445566 | 67,00€ | 14,07€ | 3,48€ | 84,55€ | BLUE "En proceso" | 13/02 | 📄
- #1078 | Ana Martín | C11223344 | 150,00€ | 31,50€ | 7,80€ | 189,30€ | GREEN "Completado" | 12/02 | 📄
- #1075 | María García | A12345678 | 45,00€ | 9,45€ | 2,34€ | 56,79€ | GREEN "Completado" | 10/02 | 📄
- #1071 | Juan Pérez | B87654321 | 320,00€ | 67,20€ | 16,64€ | 403,84€ | RED "Reembolsado" | 08/02 | 📄

Summary bar with purple background:
"Total RE cobrado: 47,16€ | Facturado con RE: 907,00€ | 6 pedidos"

Bulk actions: "Descargar facturas" | "Exportar CSV"

All text in Spanish. Shopify Polaris styling.
```

---

### PANTALLA 06 — Dashboard Reportes

```
Web app fiscal reporting dashboard for "Shopify RE". Shopify Polaris + polaris-viz styling.

Colors: RE purple #6B21A8, Shopify green #008060, background #F6F6F7. Font: Inter.

Page title: "Dashboard RE — Informes Fiscales"
Period selector: "Febrero 2026 ▼"

4 KPI cards (purple accent):
- "Total RE cobrado" — "€847,32" — purple indicator
- "Pedidos con RE" — "38" — "+12 vs enero"
- "Clientes RE activos" — "42"
- "Ticket medio RE" — "€127,50" — "+8%"

Bar chart: "RE cobrado por mes" — 6 bars in purple gradient #6B21A8, months Sep-Feb, increasing trend

Two cards side by side:
LEFT: "Desglose por tipo IVA" — horizontal bars:
- General (21%→5.2%): €712,40 (84%) — dark purple
- Reducido (10%→1.4%): €98,50 (12%) — medium purple
- Superreducido (4%→0.5%): €36,42 (4%) — light purple

RIGHT: "Top clientes RE" — mini table:
- María García — 12 pedidos — €234,50
- Carlos Rodríguez — 8 — €189,20
- Juan Pérez — 6 — €156,80

Bottom: amber reminder card:
"📅 Modelo 309: presentar antes del 20/04/2026 (Q1 2026)"
Button: "Exportar datos fiscales Q1"

All text in Spanish.
```

---

### PANTALLA 07 — Export CSV

```
Web app data export for "Shopify RE". Shopify Polaris styling.

Colors: #008060, #6B21A8. Font: Inter.

Page title: "Exportar datos fiscales RE"

Card 1 — Period: Radio (Mes / Trimestre Q1 / Año / Custom) with Trimestre selected
Card 2 — Data: Checklist all checked (pedidos, clientes, IVA, RE, totales, resumen)
Card 3 — Format: Radio (CSV selected / Excel / PDF)
Card 4 — Preview: mini table 3 rows showing Pedido|Fecha|Cliente|NIF|Base|IVA|RE|Total
Summary green box: "Q1 2026: 38 pedidos | Base: €4.850 | IVA: €1.018 | RE: €252"
Buttons: "Descargar" green | "Enviar por email" outlined

All text in Spanish. Shopify Polaris form components.
```

---

### PANTALLA 08 — Factura Preview

```
Web app showing a PDF invoice preview generated by "Shopify RE". Professional A4 invoice with RE breakdown.

Colors: white document, RE purple #6B21A8 accents. Font: Inter.

Professional invoice:

HEADER: Company logo + "Mi Tienda S.L." + NIF: B12345678 + Address
Right: "FACTURA" + RE-2026-0089 + Date: 15/02/2026

CLIENT: María García López + NIF: A12345678 + "Alimentación García S.L." + Address
Purple badge: "🏪 Régimen Recargo de Equivalencia"

ITEMS TABLE:
- Camiseta algodón × 2 — 50,00€
- Pantalón chino × 1 — 45,00€

TOTALS:
- Base imponible: 95,00€
- IVA (21%): 19,95€
- **RE (5,2%): 4,94€** ← purple left border highlight
- TOTAL: 119,89€

FOOTER: "Art. 154-163 Ley 37/1992 del IVA"

Buttons above: "Descargar PDF" | "Enviar al cliente" | "Imprimir"

All text in Spanish. Clean professional invoice.
```

---

### PANTALLA 09 — Billing / Plans

```
Web app billing page for "Shopify RE". Shopify Polaris styling.

Colors: #008060, #6B21A8. Font: Inter.

Page title: "Plan y facturación"

3 plan cards:
- Starter 9,90€/mes — 10 clientes RE, facturas, CSV
- Growth 19,90€/mes — 50 clientes, dashboard (HIGHLIGHTED purple border, "Popular")
- Pro 39,90€/mes — Ilimitado, API, soporte

Bottom: billing history managed by Shopify
Note: "Los pagos se gestionan a través de Shopify"

All text in Spanish.
```

---

### PANTALLA 10 — Ficha Cliente RE

```
Web app customer RE detail form for "Shopify RE". Shopify Polaris form styling.

Colors: #008060, #6B21A8. Font: Inter. Background #F6F6F7.

Page title: "Ficha de Cliente RE" with back arrow

Card 1 — "Cliente Shopify" (read-only gray):
"María García López (#145) — maria@tienda.es — Registrada: 01/01/2025"

Card 2 — "Datos fiscales RE":
- Input: "NIF/CIF" showing "A12345678" with green "✓ NIF válido"
- Input: "Razón social" showing "Alimentación García S.L."
- Dropdown: "Tipo comercio" showing "Minorista alimentación"
- Input: "Dirección fiscal"

Card 3 — "Estado RE":
- Toggle ON: "☑ Aplicar RE a este cliente"
- "Activo desde: 15/01/2025"
- Dropdown: "Tipo RE" — "Todos los tipos"
- Textarea: "Notas internas"

Card 4 — "Documentación":
- DropZone: "Subir certificado comerciante (PDF/JPG)"
- "📄 certificado_garcia.pdf (15/01/2025)"

Amber warning: "⚠ El vendedor es responsable de verificar que el cliente cumple requisitos RE."

Buttons: "Guardar" green | "Cancelar"

All text in Spanish. Polaris forms.
```

---

### ESTADOS — Empty State

```
Empty state for "Shopify RE" when no RE customers exist. Shopify Polaris EmptyState component.

Colors: #6B21A8 accent. Font: Inter. Background #F6F6F7.

Centered:
- Illustration: shop/store icon with tax document (Shopify Polaris empty state style)
- "Aún no tienes clientes con Recargo de Equivalencia"
- "Añade tus clientes mayoristas para que el RE se aplique automáticamente."
- Purple button: "Añadir primer cliente RE"
- Link: "¿Qué es el RE? →"

Shopify Polaris EmptyState styling. All text in Spanish.
```

---

### ESTADOS — Cross-sell Banner

```
Web app banner that appears inside MRW Pro or Correos Pro apps, promoting Shopify RE.

Colors: RE purple #6B21A8, Shopify green #008060. Font: Inter.

Small dismissible banner at top of a logistic app page:
Purple left border, white background:
"🏪 ¿Vendes a comerciantes minoristas? Gestiona el Recargo de Equivalencia automáticamente con Shopify RE"
Button: "Descubrir Shopify RE →" purple outlined
Dismiss: "×" close button

Clean, non-intrusive. Shopify Polaris Banner component.
```

---

## PARTE 3: Carpeta de organización

```
ShopifyRE_Mockups/
├── 01_onboarding/
├── 02_configuracion/
├── 03_lista_clientes/
├── 04_checkout_preview/
├── 05_lista_pedidos/
├── 06_dashboard/
├── 07_export_csv/
├── 08_factura_preview/
├── 09_billing/
├── 10_ficha_cliente/
└── estados/
    ├── empty_state.png
    └── cross_sell_banner.png
```
