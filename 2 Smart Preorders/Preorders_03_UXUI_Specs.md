# SMART PREORDERS
## UI/UX Design Specifications
### Documento 3 de 5 — Febrero 2026

---

## 1. Design System

### Plataforma: Shopify Polaris

Smart Preorders usa **Shopify Polaris** para admin y Theme App Extension para storefront.

### Colores clave

```css
/* Shopify Polaris base */
--p-color-bg-primary: #008060;
--p-color-bg-critical: #d72c0d;
--p-color-bg-warning: #916a00;
--p-color-bg-success: #008060;
--p-color-bg: #f6f6f7;
--p-color-bg-surface: #ffffff;

/* Smart Preorders custom */
--sp-accent: #7C3AED;              /* Purple — urgencia/preventa */
--sp-accent-light: #8B5CF6;        /* Light purple hover */
--sp-warning: #F59E0B;             /* Amber — carrito mixto aviso */
--sp-savings: #059669;             /* Green — ahorro/ROI */
--sp-pending: #6366F1;             /* Indigo — envío pendiente */
```

### Filosofía
- **Admin**: funcional, con accent morado para elementos de preventa y verde para ahorro
- **Storefront**: sutil pero urgente — el botón preorder debe sentirse "especial" pero no agresivo
- **Dashboard de ahorro**: verde prominente — el merchant debe VER el dinero que ahorra

---

## 2. Las 10 Pantallas de la App

### Pantalla 01 — Onboarding / Welcome

**Contenido:**
- Logo "Smart Preorders" con icono de reloj/calendario en morado #7C3AED
- Subtítulo: "Gestiona preventas y deja de perder dinero en envíos dobles"
- Infografía visual del problema:
  - 📦 Cliente compra: Camiseta (stock) + Zapatillas (preventa)
  - 💸 Shopify cobra 1 envío, pero tú pagas 2
  - ✅ Smart Preorders detecta y cobra el extra
- 3 pasos: Marcar productos → Configurar carrito → Ahorrar
- CTA: "Empezar configuración" en #008060
- ROI hook: "La app se paga sola con 3 pedidos mixtos/mes"

**Componentes Polaris:** Page, Card, ProgressBar, Button, Banner

---

### Pantalla 02 — Dashboard Principal

**Contenido:**
- 4 KPI cards:
  - "Preorders activos" — "12 productos" — morado
  - "Pedidos mixtos (mes)" — "23" — ámbar
  - "💰 Ahorro estimado" — "€138" — **VERDE GRANDE** — "7x ROI"
  - "Envíos pendientes" — "8" — indigo
- Gráfico: pedidos preorder por semana (4 semanas)
- Card "Próximos envíos pendientes":
  - "#1089 — Zapatillas Ltd Ed — est. 15/04/2026 — 3 unidades"
  - "#1075 — Sudadera Drop 7 — est. 22/04/2026 — 1 unidad"
- Card verde "Tu ahorro":
  - "Este mes: €138 ahorrados en envíos dobles"
  - "Total acumulado: €847"
  - "La app se ha pagado **7 veces** este mes"

**Componentes Polaris:** Page, Card, Layout, DataTable
**Charts:** @shopify/polaris-viz

---

### Pantalla 03 — Productos en Preventa

**Contenido:**
- Page title: "Productos en preventa"
- Button: "Añadir producto a preventa" morado
- Toggle: "☑ Auto-preventa: activar automáticamente cuando stock = 0"

- IndexTable:
  Columnas: Producto | Variante | Stock | Estado | Fecha envío est. | Pedidos | Acciones

  - [img] Zapatillas Ltd Ed | Talla 42 | 0 | PURPLE "Pre-order" | 15/04/2026 | 8 | Editar
  - [img] Zapatillas Ltd Ed | Talla 43 | 0 | PURPLE "Pre-order" | 15/04/2026 | 5 | Editar
  - [img] Sudadera Drop 7 | M | 0 | PURPLE "Pre-order" | 22/04/2026 | 3 | Editar
  - [img] Camiseta Summer | L | 15 | GREEN "En stock" | — | — | Desconecta
  - [img] Gorra Vintage | Única | 0 | AMBER "Auto-preorder" | Sin fecha | 1 | Editar

- Summary: "5 productos/variantes en preventa • 17 preorders activos"

**Componentes Polaris:** Page, IndexTable, Badge, Toggle, Button, Thumbnail

---

### Pantalla 04 — Configurar Preorder (Producto)

**Contenido:**
- Page title: "Configurar preventa" con back arrow
- Card "Producto" (read-only):
  - [img] Zapatillas Ltd Ed — Talla 42 — Stock: 0 — SKU: ZAP-42-LTD

- Card "Configuración de preventa":
  - Toggle ON: "☑ Activar preventa para este producto"
  - Date picker: "Fecha estimada de envío" → 15/04/2026
  - Input: "Nota de preventa" → "Edición limitada — envío abril 2026"
  - Input: "Texto del botón" → "Pre-order" (editable)
  - Color picker: "Color del botón" → #7C3AED

- Card "Comportamiento de stock":
  - Radio: ● "Aceptar preorders ilimitados"
  - Radio: ○ "Limitar a X preorders" → input number
  - Toggle: "☑ Desactivar preorder automáticamente cuando llegue stock"

- Card "Preview": mockup del botón tal como se verá en la tienda

**Componentes Polaris:** Page, Card, FormLayout, DatePicker, TextField, ColorPicker, Toggle

---

### Pantalla 05 — Configuración de Carrito Mixto

**Contenido:**
- Page title: "Gestión de carrito mixto"

- Card "¿Qué hacer cuando un cliente mezcla productos en stock con preventas?"
  - Radio con descripciones:
    ● **"Cobrar envío extra"** — SELECTED, border morado
      "Añade automáticamente un cargo de 'Envío dividido' al carrito. Requiere Shopify Functions."
    ○ **"Bloquear compra mixta"**
      "Muestra un aviso pidiendo al cliente que haga 2 pedidos separados."
    ○ **"Solo avisar"**
      "Muestra un aviso informativo pero permite checkout normal."

- Card "Configuración de envío extra" (solo si modo = cobrar):
  - Input: "Coste del envío extra" → "6,00€"
  - Input: "Texto en checkout" → "Envío dividido (2 paquetes)"
  - Toggle: "☑ Aplicar solo si el coste total de envío es > 0"

- Card "Aviso en carrito":
  - Input: "Texto del aviso" → "⚠️ Tu pedido se enviará en 2 partes"
  - Color picker: fondo del aviso → ámbar

- Card "Preview del carrito": mockup mostrando el aviso y el cargo extra

**Componentes Polaris:** Page, Card, RadioButton, TextField, ColorPicker, Banner

---

### Pantalla 06 — Pedidos con Preorder

**Contenido:**
- Page title: "Pedidos con preventa"
- Filters: estado (pendiente/enviado/mixto), fecha

- IndexTable:
  Columnas: Pedido | Cliente | Items preorder | Estado | Envío est. | Mixto | Extra cobrado

  - #1089 | María García | Zapatillas ×2 | PURPLE "Pendiente" | 15/04 | AMBER "Mixto" | ✅ +6€
  - #1085 | Juan Pérez | Sudadera ×1 | PURPLE "Pendiente" | 22/04 | — | —
  - #1082 | Ana López | Zapatillas ×1 | GREEN "Enviado" | Enviado 10/02 | AMBER "Mixto" | ✅ +6€
  - #1078 | Carlos R. | Gorra ×1 | PURPLE "Pendiente" | Sin fecha | — | —

- Summary bar morada: "8 envíos pendientes • 4 pedidos mixtos • €24 envíos extra cobrados"

**Componentes Polaris:** Page, IndexTable, Badge, Filters, DatePicker

---

### Pantalla 07 — Dashboard de Ahorro

**Contenido:**
- Page title: "💰 Tu ahorro con Smart Preorders"

- HERO card (verde grande, prominente):
  - "€847 ahorrados en total"
  - "La app se ha pagado sola **42 veces**"
  - Gráfico: ahorro por mes (6 meses, barras verdes crecientes)

- 3 KPI cards:
  - "Ahorro este mes" — "€138" — "+15% vs enero"
  - "Pedidos mixtos detectados" — "23" — "de 89 totales (26%)"
  - "Envíos extra cobrados" — "€138" — "23 × €6"

- Card "Desglose":
  - Tabla: mes | pedidos mixtos | envíos extra | ahorro | ROI
  - Feb: 23 | €138 | 7x
  - Ene: 18 | €108 | 5.4x
  - Dic: 25 | €150 | 7.5x

**Componentes Polaris:** Page, Card, Layout
**Charts:** @shopify/polaris-viz (BarChart verde)

---

### Pantalla 08 — Billing / Plans

**Contenido:**
- 2 plan cards:
  - Lite 9,99€/mes — 50 preorders/mes, botón custom, aviso carrito, tags
  - Pro 19,99€/mes — Ilimitado, envío extra (Functions), dashboard ahorro, soporte (DESTACADO, borde morado, "⭐ Recomendado")

- ROI callout: "Con solo 3 pedidos mixtos al mes, el plan Pro se paga solo"
- Trial: 7 días gratis
- Nota: "Pagos gestionados por Shopify"

**Componentes Polaris:** Page, Card, CalloutCard, Badge

---

### Pantalla 09 — Preview Botón (Storefront)

**Contenido:**
- Mockup de una página de producto mostrando:
  - Foto del producto (zapatillas)
  - Nombre, precio, tallas
  - Botón MORADO: "⏳ Pre-order"
  - Debajo: "Envío estimado: 15/04/2026"
  - Badge sutil: "Edición limitada — solo preventa"

- Segundo mockup: el mismo producto cuando tiene stock
  - Botón VERDE normal: "Añadir al carrito"
  - Sin fecha ni badge de preventa

**Nota:** Customer-facing, no admin

---

### Pantalla 10 — Preview Carrito Mixto (Storefront)

**Contenido:**
- Mockup del carrito de Shopify con:
  - Item 1: Camiseta algodón ×1 — 25€ — badge "📦 Envío inmediato"
  - Item 2: Zapatillas Ltd Ed ×1 — 89€ — badge "⏳ Preventa — est. 15/04"
  
- ⚠️ Banner ámbar: "Tu pedido se enviará en 2 partes"
  - "📦 Parte 1: Camiseta → Envío inmediato"
  - "⏳ Parte 2: Zapatillas → Envío est. 15/04/2026"
  
- Línea extra en totals: "Envío dividido: +6,00€"
  
- Total actualizado incluyendo el cargo extra

**Nota:** Customer-facing storefront

---

## 3. Storefront CSS

```css
/* Botón preorder */
.sp-preorder-btn {
  background: var(--sp-btn-bg, #7C3AED);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
}

.sp-preorder-btn:hover {
  background: var(--sp-btn-hover, #6D28D9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.sp-ship-date {
  margin-top: 8px;
  font-size: 13px;
  color: #6B7280;
}

/* Aviso carrito mixto */
.sp-mixed-cart-warning {
  background: #FEF3C7;
  border: 1px solid #F59E0B;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.sp-timeline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 14px;
}
```

---

*Documento 3 de 5 — UI/UX Design Specifications*
*Smart Preorders — Febrero 2026*
