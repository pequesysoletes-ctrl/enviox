# SMART PREORDERS
## Developer Handbook
### Documento 5 de 5 — Febrero 2026

---

## 1. Setup del Entorno

### 1.1 Prerrequisitos

```bash
node --version  # v20.x.x (LTS)
npm install -g @shopify/cli
docker run --name preorders-db -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:15
```

### 1.2 Crear el proyecto

```bash
shopify app init --template=remix
cd smart-preorders
npm install
npx prisma generate && npx prisma db push
shopify app dev
```

### 1.3 Estructura del proyecto

```
smart-preorders/
├── app/
│   ├── routes/
│   │   ├── app._index.tsx             → Dashboard (Pantalla 02)
│   │   ├── app.onboarding.tsx         → Welcome (Pantalla 01)
│   │   ├── app.products.tsx           → Productos preventa (Pantalla 03)
│   │   ├── app.products.$id.tsx       → Config preorder (Pantalla 04)
│   │   ├── app.settings.tsx           → Config carrito mixto (Pantalla 05)
│   │   ├── app.orders.tsx             → Pedidos preorder (Pantalla 06)
│   │   ├── app.savings.tsx            → Dashboard ahorro (Pantalla 07)
│   │   ├── app.billing.tsx            → Plans (Pantalla 08)
│   │   └── webhooks.orders.create.tsx → Webhook handler
│   ├── models/
│   │   ├── shop.server.ts
│   │   ├── preorder-record.server.ts
│   │   └── product-preorder.server.ts
│   ├── services/
│   │   ├── preorder-detector.ts       → Detectar items preorder
│   │   ├── savings-calculator.ts      → Calcular ahorro
│   │   ├── order-tagger.ts            → Tags automáticos
│   │   └── billing.server.ts
│   ├── components/
│   │   ├── PreorderProductTable.tsx
│   │   ├── MixedCartConfig.tsx
│   │   ├── SavingsHero.tsx
│   │   ├── OrderPreorderTable.tsx
│   │   └── RoiCallout.tsx
│   └── shopify.server.ts
├── extensions/
│   ├── preorder-theme/
│   │   ├── assets/
│   │   │   ├── preorder-button.js     → Botón preorder
│   │   │   ├── mixed-cart-check.js    → Detección carrito mixto
│   │   │   └── preorder-styles.css
│   │   ├── blocks/
│   │   │   ├── preorder-button.liquid
│   │   │   └── cart-warning.liquid
│   │   └── shopify.extension.toml
│   └── cart-transform/
│       ├── src/run.rs                 → Shopify Function (WASM)
│       ├── input.graphql
│       └── shopify.extension.toml
├── prisma/
│   └── schema.prisma
├── shopify.app.toml
└── .env
```

---

## 2. Metafields — Referencia

### Definición de metafields

```typescript
// app/services/metafield-definitions.ts

const METAFIELD_DEFINITIONS = [
  {
    namespace: "smart_preorders",
    key: "is_preorder",
    type: "boolean",
    name: "Es preventa",
    description: "Marca el producto como disponible en preventa",
    ownerType: "PRODUCT",
  },
  {
    namespace: "smart_preorders",
    key: "estimated_ship_date",
    type: "date",
    name: "Fecha estimada de envío",
    description: "Cuándo se espera enviar este producto",
    ownerType: "PRODUCT",
  },
  {
    namespace: "smart_preorders",
    key: "preorder_note",
    type: "single_line_text_field",
    name: "Nota de preventa",
    description: "Texto visible al cliente sobre la preventa",
    ownerType: "PRODUCT",
  },
  {
    namespace: "smart_preorders",
    key: "max_preorders",
    type: "number_integer",
    name: "Máximo preorders",
    description: "Límite de preorders aceptados (0 = ilimitado)",
    ownerType: "PRODUCT",
  },
];

// Mutation para crear las definiciones en la tienda
const CREATE_METAFIELD_DEF = `
  mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id }
      userErrors { field message }
    }
  }
`;
```

---

## 3. Detector de Preorder

```typescript
// app/services/preorder-detector.ts

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  properties: Record<string, string>;
  product_id: number;
}

interface CartAnalysis {
  hasPreorder: boolean;
  hasInStock: boolean;
  isMixed: boolean;
  preorderItems: CartItem[];
  inStockItems: CartItem[];
}

export function analyzeCart(items: CartItem[]): CartAnalysis {
  const preorderItems = items.filter(i => 
    i.properties?._preorder === 'true'
  );
  const inStockItems = items.filter(i => 
    !i.properties?._preorder || i.properties._preorder !== 'true'
  );
  
  return {
    hasPreorder: preorderItems.length > 0,
    hasInStock: inStockItems.length > 0,
    isMixed: preorderItems.length > 0 && inStockItems.length > 0,
    preorderItems,
    inStockItems,
  };
}
```

---

## 4. Order Tagger (Webhook)

```typescript
// app/routes/webhooks.orders.create.tsx
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, payload } = await authenticate.webhook(request);
  
  const order = payload;
  const lineItems = order.line_items;
  
  // Check for preorder items
  const preorderItems = lineItems.filter((item: any) => {
    return item.properties?.some(
      (p: any) => p.name === '_preorder' && p.value === 'true'
    );
  });
  
  if (preorderItems.length === 0) return new Response("OK");
  
  // Build tags
  const tags: string[] = ['Contiene-Preorder'];
  const inStockItems = lineItems.filter((item: any) => {
    return !item.properties?.some(
      (p: any) => p.name === '_preorder' && p.value === 'true'
    );
  });
  
  if (inStockItems.length > 0) {
    tags.push('Carrito-Mixto');
  }
  tags.push('Envío-Pendiente');
  
  // Apply tags via GraphQL
  const TAG_MUTATION = `
    mutation addTags($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        userErrors { field message }
      }
    }
  `;
  
  await admin.graphql(TAG_MUTATION, {
    variables: { id: order.admin_graphql_api_id, tags },
  });
  
  // Update order note
  const NOTE_MUTATION = `
    mutation updateNote($input: OrderInput!) {
      orderUpdate(input: $input) {
        userErrors { field message }
      }
    }
  `;
  
  const preorderNames = preorderItems.map((i: any) => i.title).join(', ');
  const note = `⏳ Pedido con preventa: ${preorderNames}. Envío pendiente.`;
  
  await admin.graphql(NOTE_MUTATION, {
    variables: {
      input: { id: order.admin_graphql_api_id, note },
    },
  });
  
  return new Response("OK");
};
```

---

## 5. Savings Calculator

```typescript
// app/services/savings-calculator.ts

interface SavingsReport {
  totalSaved: number;
  mixedOrders: number;
  extraShipCharged: number;
  roi: number; // times the app has paid for itself
  monthlyBreakdown: { month: string; saved: number; orders: number }[];
}

export async function calculateSavings(
  shopId: string,
  planCost: number = 19.99
): Promise<SavingsReport> {
  const records = await prisma.preorderRecord.findMany({
    where: { shopId, isMixed: true },
    orderBy: { createdAt: 'desc' },
  });
  
  const totalSaved = records.reduce(
    (sum, r) => sum + (r.extraShipAmount || 0), 0
  );
  
  return {
    totalSaved,
    mixedOrders: records.length,
    extraShipCharged: records.filter(r => r.extraShipCharged).length,
    roi: Math.round((totalSaved / planCost) * 10) / 10,
    monthlyBreakdown: groupByMonth(records),
  };
}
```

---

## 6. Storefront Script

```javascript
// extensions/preorder-theme/assets/mixed-cart-check.js
(function() {
  'use strict';
  
  async function checkMixedCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      
      let hasPreorder = false;
      let hasInStock = false;
      const preorderItems = [];
      const inStockItems = [];
      
      cart.items.forEach(function(item) {
        const isPreorder = item.properties && item.properties._preorder === 'true';
        if (isPreorder) {
          hasPreorder = true;
          preorderItems.push(item);
        } else {
          hasInStock = true;
          inStockItems.push(item);
        }
      });
      
      if (hasPreorder && hasInStock) {
        showMixedCartWarning(inStockItems, preorderItems);
      } else {
        hideMixedCartWarning();
      }
    } catch(e) { /* fail silently */ }
  }
  
  function showMixedCartWarning(inStock, preorder) {
    var existing = document.getElementById('sp-mixed-warning');
    if (existing) existing.remove();
    
    var warning = document.createElement('div');
    warning.id = 'sp-mixed-warning';
    warning.className = 'sp-mixed-cart-warning';
    warning.innerHTML = '<strong>⚠️ Tu pedido se enviará en 2 partes</strong>'
      + '<div class="sp-timeline-item">📦 Parte 1: ' + inStock.map(i => i.title).join(', ') + ' → Envío inmediato</div>'
      + '<div class="sp-timeline-item">⏳ Parte 2: ' + preorder.map(i => i.title).join(', ') + ' → Envío posterior</div>';
    
    var cartForm = document.querySelector('form[action="/cart"]') || document.querySelector('.cart');
    if (cartForm) cartForm.prepend(warning);
  }
  
  function hideMixedCartWarning() {
    var el = document.getElementById('sp-mixed-warning');
    if (el) el.remove();
  }
  
  // Check on page load and after cart updates
  checkMixedCart();
  document.addEventListener('cart:updated', checkMixedCart);
  
  // Observe DOM changes for SPA themes
  var observer = new MutationObserver(function() { checkMixedCart(); });
  var cartEl = document.querySelector('.cart, [data-cart]');
  if (cartEl) observer.observe(cartEl, { childList: true, subtree: true });
})();
```

---

## 7. Variables de Entorno

```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_products,write_products,read_orders,write_orders

DATABASE_URL=postgresql://postgres:dev@localhost:5432/smart_preorders
SESSION_STORAGE=postgresql

NODE_ENV=production
HOST=https://preorders.enviox.es
```

---

## 8. FAQ Técnico

### ¿Puedo cobrar envío extra sin Shopify Functions?
No directamente en checkout. Alternativas: Draft Orders (crear pedido manual con línea extra), o usar la propiedad line_item como carrier service surcharge. Functions es la solución clean.

### ¿Cómo detecto que un item es preorder en el carrito?
Usamos `line item properties`: al añadir al carrito desde nuestro botón, incluimos `_preorder: true` como propiedad oculta. El script de carrito lee esta propiedad.

### ¿Funciona con todos los temas?
El botón es un App Block (Shopify 2.0) — funciona con cualquier tema compatible con bloques. Para temas legacy (Vintage), el botón se inyecta via ScriptTag como fallback.

### ¿Qué pasa si el merchant no tiene Shopify Functions?
Functions requiere plan Shopify Plus o Partner dev store. Si no tiene Functions, la app funciona en "modo avisar" — muestra el aviso pero no cobra extra.

---

*Documento 5 de 5 — Developer Handbook*
*Smart Preorders — Febrero 2026*
