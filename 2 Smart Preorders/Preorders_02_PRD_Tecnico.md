# SMART PREORDERS
## PRD Técnico — Requisitos de Producto
### Documento 2 de 5 — Febrero 2026

---

## 1. Objetivo Técnico

Crear una app Shopify que intercepte el carrito y la creación de pedidos para gestionar productos de preventa mediante metafields, detectar carritos mixtos (in-stock + preorder), y opcionalmente cobrar envío extra via Shopify Functions.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Framework** | Remix (Shopify App Template) | Estándar Enviox |
| **Base de datos** | PostgreSQL + Prisma | Cache rápida de reglas |
| **Cache** | Redis (opcional para MVP) | Lectura rápida de reglas de envío |
| **Admin UI** | Shopify Polaris | Nativo |
| **Storefront** | Theme App Extension (App Block) | Botón preorder + aviso carrito |
| **Checkout** | Shopify Functions (Cart Transform) | Cargo envío extra |
| **Webhooks** | orders/create, orders/updated | Tagging automático |
| **Deploy** | Fly.io | Estándar Enviox |

---

## 3. Requisitos Funcionales (MVP)

### RF1: Etiquetado de Producto como Preorder

- Desde el admin, el merchant marca productos/variantes como "Pre-order"
- Se guarda en metafield del producto: `smart_preorders.is_preorder = true`
- Fecha estimada de envío: `smart_preorders.estimated_ship_date = "2026-04-15"`
- **Auto-detect**: si `inventory_quantity = 0` y auto-preorder está activo → activar automáticamente
- Cuando el stock vuelve a >0, desactivar preorder automáticamente

**Metafields:**
```json
{
  "namespace": "smart_preorders",
  "key": "is_preorder",
  "type": "boolean",
  "value": true
},
{
  "namespace": "smart_preorders",
  "key": "estimated_ship_date",
  "type": "date",
  "value": "2026-04-15"
},
{
  "namespace": "smart_preorders",
  "key": "preorder_note",
  "type": "single_line_text_field",
  "value": "Envío estimado abril 2026"
}
```

### RF2: Botón Inteligente (Theme Extension)

- App Block que **sustituye automáticamente** el botón "Añadir al carrito" por "Pre-order" cuando:
  - El producto tiene `smart_preorders.is_preorder = true`, O
  - El producto tiene stock = 0 y auto-preorder activo
- Debajo del botón muestra: *"Se enviará aproximadamente el [Fecha]"*
- Colores y texto editables desde settings schema del App Block
- Si el producto vuelve a tener stock → el botón vuelve a "Comprar ahora" automáticamente

**Liquid template:**
```liquid
{% if product.metafields.smart_preorders.is_preorder %}
  <button class="sp-preorder-btn" style="background: {{ block.settings.button_color }}">
    {{ block.settings.button_text | default: "Pre-order" }}
  </button>
  <p class="sp-ship-date">
    {{ block.settings.date_prefix | default: "Envío estimado:" }}
    {{ product.metafields.smart_preorders.estimated_ship_date | date: "%d/%m/%Y" }}
  </p>
{% else %}
  <!-- Mostrar botón normal de "Añadir al carrito" -->
{% endif %}
```

### RF3: Detección de Carrito Mixto

Al detectar un producto en stock + un preorder en el carrito:

1. **Aviso visual en el carrito:**
   - Banner: *"⚠️ Tu pedido se enviará en 2 partes"*
   - Timeline:
     - "📦 Parte 1: [Camiseta] → Envío inmediato"
     - "⏳ Parte 2: [Zapatillas] → Envío est. 15/04/2026"

2. **Acción configurable** (según preferencia del merchant):
   - **Modo A — Cobrar extra**: Añadir línea "Envío dividido: +6€" via Shopify Functions
   - **Modo B — Bloquear**: "No puedes mezclar productos en stock con preventas. Haz 2 pedidos separados."
   - **Modo C — Solo avisar**: Mostrar aviso pero permitir checkout normal

**Detección (JS en storefront):**
```javascript
// Analizar cart items
const cartItems = await fetch('/cart.js').then(r => r.json());
const hasInStock = cartItems.items.some(i => !i.properties?._preorder);
const hasPreorder = cartItems.items.some(i => i.properties?._preorder);
const isMixed = hasInStock && hasPreorder;
```

### RF4: Shopify Functions — Cargo de Envío Extra

Para merchants que quieran cobrar el envío extra:

```rust
// extensions/cart-transform/src/run.rs (Shopify Functions, WASM)
// Simplificado — la lógica real sería más compleja

use shopify_function::prelude::*;

#[shopify_function]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let cart_lines = &input.cart.lines;
    
    let has_preorder = cart_lines.iter().any(|line| {
        line.merchandise.product.metafield
            .as_ref()
            .map(|m| m.value == "true")
            .unwrap_or(false)
    });
    
    let has_in_stock = cart_lines.iter().any(|line| {
        !line.merchandise.product.metafield
            .as_ref()
            .map(|m| m.value == "true")
            .unwrap_or(false)
    });
    
    if has_preorder && has_in_stock {
        // Añadir cargo de envío dividido
        // (implementación real usa Cart Transform API)
    }
    
    Ok(output::FunctionRunResult { operations: vec![] })
}
```

### RF5: Tags Automáticos en Pedidos

**Webhook: `orders/create`:**
1. Analizar line items del pedido
2. Si alguno tiene metafield `is_preorder = true`:
   - Añadir tag: `Contiene-Preorder`
   - Si también hay items en stock: `Carrito-Mixto`
   - Añadir tag: `Envío-Pendiente`
3. Actualizar nota del pedido:
   - "Pedido mixto: Parte 1 (en stock) enviar ahora. Parte 2 (preorder) enviar est. 15/04/2026"

### RF6: Dashboard de Ahorro

- **KPIs:**
  - Pedidos con preorder (este mes)
  - Pedidos mixtos detectados
  - Envíos dobles cobrados (si modo A activo)
  - **Ahorro estimado: "€150 ahorrados este mes"**
  - ROI: "La app se pagó sola 7.5 veces"

---

## 4. Modelo de Datos (Prisma)

```prisma
model Shop {
  id              String   @id @default(cuid())
  myshopifyDomain String   @unique
  accessToken     String
  plan            String   @default("lite")
  
  // Settings
  autoPreorder    Boolean  @default(true)   // auto-activate when stock=0
  mixedCartMode   String   @default("warn") // "charge", "block", "warn"
  extraShipCost   Float    @default(6.00)   // coste envío extra
  
  // Button customization
  buttonText      String   @default("Pre-order")
  buttonColor     String   @default("#6B21A8")
  datePrefix      String   @default("Envío estimado:")
  
  // Billing
  billingPlan     String   @default("free")
  billingId       String?
  trialEndsAt     DateTime?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  preorders       PreorderRecord[]
}

model PreorderRecord {
  id          String   @id @default(cuid())
  shopId      String
  shop        Shop     @relation(fields: [shopId], references: [id])
  
  orderId     String   // Shopify order ID
  orderNumber String   // #1089
  isMixed     Boolean  @default(false)
  
  preorderItems   Int  // count of preorder items
  inStockItems    Int  // count of in-stock items
  extraShipCharged Boolean @default(false)
  extraShipAmount  Float?
  
  estimatedShipDate DateTime?
  actualShipDate    DateTime?
  status           String @default("pending") // pending, shipped, cancelled
  
  createdAt   DateTime @default(now())
  
  @@index([shopId, createdAt])
}
```

---

## 5. Casos Críticos (Edge Cases)

| Caso | Comportamiento |
|------|---------------|
| Stock vuelve a >0 | Botón cambia a "Comprar ahora" automáticamente |
| Preorder sin fecha | Mostrar "Fecha por confirmar" |
| Múltiples preorders en carrito | Agrupar por fecha estimada |
| Cancelación de pedido mixto | Solo cancelar la parte correspondiente |
| Merchant cambia coste envío | Aplicar nuevo coste solo a pedidos futuros |
| Idioma del theme | Textos editables, soporte i18n (ES, EN, FR, DE) |
| Shopify Functions no disponible | Fallback: solo avisar (modo C) |
| Producto con variantes mixtas | Detectar por variante, no por producto |

---

## 6. Performance Targets

| Métrica | Target |
|---------|--------|
| Impacto en page load | <50ms |
| Script storefront | <8KB gzipped |
| Cart check latencia | <100ms |
| Webhook processing | <2s |
| Admin page load | <3s |

---

*Documento 2 de 5 — PRD Técnico*
*Smart Preorders — Febrero 2026*
