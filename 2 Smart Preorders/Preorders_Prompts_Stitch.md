# Smart Preorders — Prompts para Google Stitch + Guía de Workflow

> **Versión optimizada para stitch.withgoogle.com**
> Febrero 2026

---

## PARTE 1: Cómo usar estos prompts en Stitch

### Configuración en Stitch

- **Modo Standard**: Pantallas simples → 01, 08
- **Modo Experimental**: Pantallas complejas → 02, 03, 05, 06, 07
- **Plataforma**: **"Web"**
- **Tema**: Light

### Tips

- Shopify Polaris style — componentes nativos de Shopify admin
- Smart Preorders usa morado (#7C3AED) como accent, ámbar (#F59E0B) para avisos mixtos, y verde (#059669) para ahorro
- Las pantallas 09 y 10 son storefront (no admin) — diseño diferente
- El "ahorro" es el hero — debe ser verde y GRANDE en el dashboard

---

## PARTE 2: Los 12 Prompts

---

### PANTALLA 01 — Onboarding / Welcome

```
Web app onboarding welcome screen for "Smart Preorders", a Shopify app that manages pre-orders and fixes the "double-shipping bug" where merchants lose money on split shipments.

Colors: Shopify green #008060, Preorder purple #7C3AED, warning amber #F59E0B, background #F6F6F7, cards white. Font: Inter / system-ui. Style: Shopify admin panel (Polaris design system).

Centered white card on gray background:
- "Smart Preorders" logo text in #7C3AED bold with a clock/calendar icon ⏳. Below: "Gestiona preventas y deja de perder dinero en envíos dobles"
- Visual infographic (3 connected cards):
  Card A: "📦 Cliente compra: Camiseta (stock) + Zapatillas (preventa)"
  Card B (red accent): "💸 Shopify cobra 1 envío, pero tú pagas 2 = pierdes 6€"
  Card C (green accent): "✅ Smart Preorders detecta y cobra el envío extra"
- 3-step stepper:
  Step 1 "Marcar productos" (active, purple)
  Step 2 "Configurar carrito" (gray)
  Step 3 "Ahorrar" (gray, green tint)
- Primary button: "Empezar configuración" in #008060
- ROI hook text in green: "💰 La app se paga sola con 3 pedidos mixtos/mes"
- Trust badges: "⚡ MVP ultra-ligero • 🔒 Seguro • 🇪🇸 Soporte en español"

All text in Spanish. Shopify Polaris styling.
```

---

### PANTALLA 02 — Dashboard Principal

```
Web app main dashboard for "Smart Preorders", tactical Shopify app for pre-order management. Shopify Polaris + polaris-viz styling.

Colors: Purple #7C3AED, amber #F59E0B, green #059669, background #F6F6F7. Font: Inter.

Shopify admin layout with left sidebar (Dashboard active with purple indicator, Productos, Carrito mixto, Pedidos, Ahorro, Plan, Ayuda).

MAIN CONTENT:

Page title: "Dashboard Smart Preorders"

4 KPI cards:
- "Preorders activos" — "12 productos" — purple badge
- "Pedidos mixtos (mes)" — "23" — amber badge
- "💰 Ahorro estimado" — "€138" — GREEN LARGE TEXT, bold, with "7x ROI" subtitle in green
- "Envíos pendientes" — "8" — indigo badge

Line chart: "Pedidos preorder por semana" — 4 data points, purple line

Two cards side by side:
LEFT: "Próximos envíos pendientes" — 3 rows:
- #1089 — Zapatillas Ltd Ed — est. 15/04/2026 — 3 uds — PURPLE "Pendiente"
- #1075 — Sudadera Drop 7 — est. 22/04/2026 — 1 ud — PURPLE "Pendiente"
- #1071 — Gorra Vintage — Sin fecha — 2 uds — AMBER "Sin fecha"

RIGHT: GREEN highlighted card "Tu ahorro":
- Big number: "€138" in green
- "ahorrados este mes en envíos dobles"
- "Total acumulado: €847"
- "La app se ha pagado 7 veces este mes"
- Small green trending-up icon

All text in Spanish.
```

---

### PANTALLA 03 — Productos en Preventa

```
Web app products list for "Smart Preorders". Shows products marked as pre-order. Shopify Polaris styling.

Colors: #7C3AED purple, #008060 green, #F59E0B amber. Font: Inter. Background #F6F6F7.

Page title: "Productos en preventa"
Button top-right: "Añadir producto a preventa" purple #7C3AED
Toggle below title: "☑ Auto-preventa: activar automáticamente cuando stock = 0" with info tooltip

Shopify IndexTable with product thumbnails:
Columns: Producto | Variante | Stock | Estado | Fecha envío est. | Preorders | Acciones

- [shoe thumbnail] Zapatillas Ltd Ed | T.42 | 0 | PURPLE "Pre-order" badge | 15/04/2026 | 8 | Editar
- [shoe thumbnail] Zapatillas Ltd Ed | T.43 | 0 | PURPLE "Pre-order" | 15/04/2026 | 5 | Editar
- [hoodie thumbnail] Sudadera Drop 7 | M | 0 | PURPLE "Pre-order" | 22/04/2026 | 3 | Editar
- [tshirt thumbnail] Camiseta Summer | L | 15 | GREEN "En stock" badge | — | — | —
- [cap thumbnail] Gorra Vintage | Única | 0 | AMBER "Auto-preorder" | Sin fecha | 1 | Editar

Summary below: "5 productos en preventa • 17 preorders activos"
Info banner blue: "Los productos con auto-preventa se activan automáticamente cuando el stock llega a 0."

All text in Spanish.
```

---

### PANTALLA 04 — Configurar Preorder (Producto)

```
Web app product preorder configuration for "Smart Preorders". Shopify Polaris form styling.

Colors: #7C3AED, #008060. Font: Inter. Background #F6F6F7.

Page title: "Configurar preventa" with back arrow

Card 1 — "Producto" (read-only, light gray):
[Shoe image] "Zapatillas Ltd Ed — Talla 42 — Stock: 0 — SKU: ZAP-42-LTD"

Card 2 — "Configuración de preventa":
- Toggle ON: "☑ Activar preventa para este producto" — purple accent
- Date picker: "Fecha estimada de envío" → showing "15/04/2026" with calendar
- Input: "Nota de preventa" → "Edición limitada — envío abril 2026"
- Input: "Texto del botón" → "⏳ Pre-order"
- Color picker: "Color del botón" → #7C3AED with preview swatch

Card 3 — "Límites":
- Radio: ● "Aceptar preorders ilimitados" — selected
- Radio: ○ "Limitar a [___] preorders" with number input
- Toggle ON: "☑ Desactivar preventa cuando llegue stock"

Card 4 — "Preview" with simulated product page snippet:
- Small mockup showing the purple preorder button and estimated date

Buttons bottom: "Guardar" green #008060 | "Cancelar" outlined

All text in Spanish.
```

---

### PANTALLA 05 — Configuración de Carrito Mixto

```
Web app mixed cart settings for "Smart Preorders". Configure what happens when a customer mixes in-stock and pre-order items. Shopify Polaris styling.

Colors: #7C3AED, #F59E0B amber, #008060. Font: Inter. Background #F6F6F7.

Page title: "Gestión de carrito mixto"
Subtitle: "¿Qué hacer cuando un cliente mezcla productos en stock con preventas?"

Card 1 — "Modo de gestión" (radio with rich descriptions):
● "💶 Cobrar envío extra" — SELECTED, purple border highlight
  "Añade automáticamente un cargo de 'Envío dividido' al carrito."
  Small tag: "Requiere Shopify Functions"
  
○ "🚫 Bloquear compra mixta"
  "Pide al cliente que haga 2 pedidos separados."
  
○ "ℹ️ Solo avisar"
  "Muestra un aviso pero permite checkout normal. Tú asumes el coste."

Card 2 — "Configuración de envío extra":
- Input: "Coste del envío extra" → "6,00 €"
- Input: "Texto en checkout" → "Envío dividido (2 paquetes)"
- Toggle ON: "☑ Solo cobrar si envío original > 0€"

Card 3 — "Aviso en el carrito":
- Input: "Texto del aviso" → "⚠️ Tu pedido se enviará en 2 partes"
- Dropdown: "Color del aviso" → "Ámbar (advertencia)"
- Preview: amber banner showing the warning with timeline

Card 4 — "Preview del carrito" — mockup:
Simulated cart showing:
- Camiseta ×1 — 25€ — "📦 Envío inmediato"
- Zapatillas ×1 — 89€ — "⏳ Preventa"
- Amber warning banner
- Extra line: "Envío dividido: +6,00€"

Green save button at bottom.
All text in Spanish.
```

---

### PANTALLA 06 — Pedidos con Preorder

```
Web app preorder orders list for "Smart Preorders". Shopify Polaris styling.

Colors: #7C3AED purple, #F59E0B amber, #059669 green. Font: Inter. Background #F6F6F7.

Page title: "Pedidos con preventa"
Filter bar: Status dropdown (Todos, Pendiente, Enviado, Mixto) + Date range

IndexTable with 5 rows:
Columns: Pedido | Cliente | Items preorder | Estado | Envío est. | Mixto | Extra cobrado

- #1089 | María García | Zapatillas ×2 | PURPLE "Pendiente" | 15/04 | AMBER "Mixto" badge | GREEN "✅ +6€"
- #1085 | Juan Pérez | Sudadera ×1 | PURPLE "Pendiente" | 22/04 | — | —
- #1082 | Ana López | Zapatillas ×1 | GREEN "Enviado" | 10/02 ✓ | AMBER "Mixto" | GREEN "✅ +6€"
- #1078 | Carlos R. | Gorra ×1 | PURPLE "Pendiente" | Sin fecha | — | —
- #1075 | Laura F. | Camiseta Ed. ×3 | GREEN "Enviado" | 01/02 ✓ | AMBER "Mixto" | GREEN "✅ +6€"

Summary bar purple background:
"8 envíos pendientes • 4 pedidos mixtos • €24 envíos extra cobrados este mes"

Bulk actions: "Marcar como enviado" | "Exportar CSV"

All text in Spanish.
```

---

### PANTALLA 07 — Dashboard de Ahorro

```
Web app savings dashboard for "Smart Preorders". This is the KEY screen — shows the merchant how much money the app saves them. Green-dominant design.

Colors: Green #059669 dominant, #7C3AED purple, #F59E0B. Font: Inter. Background #F6F6F7.

Page title: "💰 Tu ahorro con Smart Preorders"

HERO CARD (large, green gradient background from #059669 to #10B981, white text):
- Big number: "€847" in 48px bold white
- "ahorrados en total desde que usas Smart Preorders"
- Subtext: "La app se ha pagado sola 42 veces ✨"
- Small bar chart inline: 6 months of growing green bars

3 KPI cards below hero:
- "Ahorro este mes" — "€138" green — "+15% vs enero" trending up arrow
- "Pedidos mixtos detectados" — "23 de 89 (26%)" — amber
- "Envíos extra cobrados" — "23 × €6 = €138" — green

DataTable "Desglose mensual":
Columns: Mes | Pedidos mixtos | Envíos cobrados | Ahorro | ROI
- Feb 2026 | 23 | €138 | 7.0x | GREEN "✅"
- Ene 2026 | 18 | €108 | 5.4x | GREEN "✅"
- Dic 2025 | 25 | €150 | 7.5x | GREEN "✅"
- Nov 2025 | 12 | €72 | 3.6x | GREEN "✅"

Bottom card: "💡 Consejo: Con este ratio, el plan Pro (19,99€/mes) te ahorra una media de €127/mes. Es la inversión más rentable de tu tienda."

All text in Spanish. Green-first design to emphasize savings.
```

---

### PANTALLA 08 — Billing / Plans

```
Web app billing page for "Smart Preorders". Shopify Polaris styling.

Colors: #7C3AED purple, #059669 green, #008060. Font: Inter. Background #F6F6F7.

Page title: "Plan y facturación"

2 plan cards:

Card 1 — "Lite":
- "9,99€/mes"
- Features: ✅ 50 preorders/mes, ✅ Botón personalizable, ✅ Aviso carrito mixto, ✅ Tags automáticos, ❌ Cobro envío extra, ❌ Dashboard de ahorro
- Button: "Seleccionar" outlined

Card 2 — "Pro" (HIGHLIGHTED with purple #7C3AED border and "⭐ Recomendado" badge):
- "19,99€/mes"
- Features: ✅ Preorders ilimitados, ✅ Cobro envío extra (Functions), ✅ Dashboard de ahorro + ROI, ✅ Tags + notas automáticas, ✅ Soporte prioritario
- Button: "Seleccionar" filled purple

GREEN ROI callout card below:
"💰 Con 3 pedidos mixtos al mes (ahorro de 18€), el plan Pro ya se paga solo. ¿Tu tienda tiene drops o lanzamientos? Es una inversión obvia."

Bottom: "Los pagos se gestionan a través de Shopify. 7 días de prueba gratuita."

All text in Spanish.
```

---

### PANTALLA 09 — Preview Botón Preorder (Storefront)

```
Web page showing how the pre-order button looks on a merchant's Shopify store product page. NOT an admin page.

Clean e-commerce product page (fashion store, light theme):

LEFT: Product image — stylish sneakers on white background
RIGHT: Product details:
- "Zapatillas Ltd Ed — Summer 2026"
- "89,00€"
- Size selector: 39 40 [41] 42 43
- PURPLE BUTTON full width: "⏳ Pre-order" in #7C3AED, bold, rounded corners
- Below button: "Envío estimado: 15/04/2026" in gray text
- Small badge: "✨ Edición limitada — solo preventa"

SECOND MOCKUP below showing the SAME product page but with stock available:
- Same sneakers, same details
- GREEN BUTTON: "Añadir al carrito" in standard Shopify green
- NO estimated date, NO preorder badge
- Shows the automatic switch from preorder to normal when stock returns

Light background, clean modern product page. Realistic e-commerce styling.
```

---

### PANTALLA 10 — Preview Carrito Mixto (Storefront)

```
Web page showing a Shopify cart with mixed items (in-stock + pre-order) and the Smart Preorders warning. NOT an admin page.

Clean Shopify cart page (light theme):

CART ITEMS:
- [tshirt image] Camiseta algodón orgánico × 1 — 25,00€
  Small green badge: "📦 Envío inmediato"
  
- [sneaker image] Zapatillas Ltd Ed × 1 — 89,00€
  Small purple badge: "⏳ Preventa — est. 15/04/2026"

AMBER WARNING BANNER (full width, amber background #FEF3C7, amber border #F59E0B):
"⚠️ Tu pedido se enviará en 2 partes"
Timeline:
  "📦 Parte 1: Camiseta algodón orgánico → Envío inmediato"
  "⏳ Parte 2: Zapatillas Ltd Ed → Envío est. 15/04/2026"

CART TOTALS:
- Subtotal: 114,00€
- Envío: 5,95€
- Envío dividido: +6,00€ (with small info icon)
- Total: 125,95€

Green checkout button: "Finalizar compra"

Clean, realistic Shopify cart styling. The warning is prominent but not aggressive. All text in Spanish.
```

---

### ESTADOS — Empty State

```
Empty state for "Smart Preorders" when no products are marked as pre-order. Shopify Polaris EmptyState.

Colors: #7C3AED accent. Font: Inter. Background #F6F6F7.

Centered:
- Illustration: package/box with clock icon (purple tinted, Polaris empty state style)
- "Aún no tienes productos en preventa"
- "Marca tus productos agotados o próximos lanzamientos como preventa para empezar a ahorrar en envíos."
- Purple button: "Añadir primer producto"
- Link: "¿Cómo funciona? →"

Shopify Polaris EmptyState. All text in Spanish.
```

---

### ESTADOS — Cross-sell Banner (en Enviox Carriers)

```
Small dismissible banner inside MRW Pro or Correos Pro apps, promoting Smart Preorders.

Colors: #7C3AED purple. Font: Inter.

Small banner at top of the shipments page:
Purple left border, light purple background (#F5F3FF):
"⏳ ¿Haces envíos de preventas? Deja de pagar envíos dobles con Smart Preorders"
Button: "Instalar Smart Preorders →" purple outlined
Dismiss: "×"

Shopify Polaris Banner component. Non-intrusive.
```

---

## PARTE 3: Carpeta de organización

```
Preorders_Mockups/
├── 01_onboarding/
├── 02_dashboard/
├── 03_productos_preventa/
├── 04_config_producto/
├── 05_carrito_mixto/
├── 06_pedidos_preorder/
├── 07_dashboard_ahorro/
├── 08_billing/
├── 09_preview_boton/
├── 10_preview_carrito/
└── estados/
    ├── empty_state.png
    └── cross_sell_banner.png
```
