# SHOPIFY RE
## Developer Handbook
### Documento 5 de 5 — Febrero 2026

---

## 1. Setup del Entorno

### 1.1 Prerrequisitos

```bash
# Node.js 20+ (recomendado: 20 LTS)
node --version  # v20.x.x

# Shopify CLI
npm install -g @shopify/cli

# PostgreSQL 15+ (local o Docker)
docker run --name shopify-re-db -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:15

# Ruby 3+ (necesario para Shopify CLI themes, opcional)
```

### 1.2 Crear el proyecto

```bash
# Opción A: Desde template Remix (RECOMENDADO)
shopify app init --template=remix

# Opción B: Clone del monorepo Enviox (cuando exista)
git clone [enviox-monorepo] && cd shopify-re

# Instalar dependencias
npm install

# Configurar Prisma
npx prisma generate
npx prisma db push

# Iniciar dev server
shopify app dev
```

### 1.3 Estructura del proyecto

```
shopify-re/
├── app/
│   ├── routes/
│   │   ├── app._index.tsx           → Dashboard
│   │   ├── app.settings.tsx         → Configuración (Pantalla 01)
│   │   ├── app.customers.tsx        → Lista clientes RE (Pantalla 02)
│   │   ├── app.customers.$id.tsx    → Ficha cliente RE (Pantalla 03)
│   │   ├── app.orders.tsx           → Pedidos con RE (Pantalla 05)
│   │   ├── app.dashboard.tsx        → Dashboard reportes (Pantalla 06)
│   │   ├── app.export.tsx           → Export CSV (Pantalla 07)
│   │   ├── // app.invoice (ELIMINADA — la app no genera facturas)
│   │   ├── app.billing.tsx          → Plans (Pantalla 09)
│   │   └── app.welcome.tsx          → Onboarding (Pantalla 10)
│   ├── models/
│   │   ├── shop.server.ts           → Shop operations
│   │   ├── customer-re.server.ts    → Customer RE operations
│   │   ├── order-re.server.ts       → Order RE operations
│   │   └── invoice.server.ts        → Invoice generation
│   ├── services/
│   │   ├── re-calculator.ts         → Motor de cálculo RE
│   │   ├── nif-validator.ts         → Validación NIF/CIF/NIE
│   │   ├── invoice-generator.ts     → Generación PDF
│   │   └── csv-exporter.ts          → Exportación datos
│   ├── components/
│   │   ├── ReCustomerTable.tsx
│   │   ├── ReOrderTable.tsx
│   │   ├── ReDashboardCards.tsx
│   │   ├── ReInvoicePreview.tsx
│   │   └── NifInput.tsx             → Input con validación inline
│   └── shopify.server.ts            → Shopify API setup
├── extensions/
│   ├── checkout-re-ui/              → Checkout UI Extension
│   │   ├── src/
│   │   │   └── Checkout.tsx
│   │   └── shopify.extension.toml
│   └── cart-transform-re/           → Cart Transform Function
│       ├── src/
│       │   └── run.ts
│       └── shopify.extension.toml
├── prisma/
│   └── schema.prisma
├── public/
├── shopify.app.toml
├── package.json
└── .env
```

---

## 2. Motor de Cálculo RE — Referencia

### Clase principal

```typescript
// app/services/re-calculator.ts

interface ReRate {
  ivaRate: number;      // 21, 10, 4
  reRate: number;       // 5.2, 1.4, 0.5
  description: string;  // "Tipo general", etc.
}

interface ReLineItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;    // Precio sin IVA
  ivaRate: number;      // 21, 10, 4
}

interface ReBreakdown {
  lines: {
    productId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;    // unitPrice * quantity
    ivaRate: number;
    ivaAmount: number;
    reRate: number;
    reAmount: number;
    lineTotal: number;   // subtotal + IVA + RE
  }[];
  totals: {
    base: number;
    iva: number;
    re: number;
    grandTotal: number;
  };
}

// Tipos RE vigentes (Ley 37/1992 del IVA)
const RE_RATES: ReRate[] = [
  { ivaRate: 21, reRate: 5.2, description: "Tipo general" },
  { ivaRate: 10, reRate: 1.4, description: "Tipo reducido" },
  { ivaRate: 4, reRate: 0.5, description: "Tipo superreducido" },
];

export function calculateRE(items: ReLineItem[]): ReBreakdown {
  const lines = items.map(item => {
    const subtotal = item.unitPrice * item.quantity;
    const reRate = RE_RATES.find(r => r.ivaRate === item.ivaRate);
    
    if (!reRate) {
      throw new Error(`IVA rate ${item.ivaRate}% not found in RE rates table`);
    }
    
    const ivaAmount = roundTo2(subtotal * (item.ivaRate / 100));
    const reAmount = roundTo2(subtotal * (reRate.reRate / 100));
    
    return {
      productId: item.productId,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal,
      ivaRate: item.ivaRate,
      ivaAmount,
      reRate: reRate.reRate,
      reAmount,
      lineTotal: roundTo2(subtotal + ivaAmount + reAmount),
    };
  });
  
  const totals = {
    base: roundTo2(lines.reduce((sum, l) => sum + l.subtotal, 0)),
    iva: roundTo2(lines.reduce((sum, l) => sum + l.ivaAmount, 0)),
    re: roundTo2(lines.reduce((sum, l) => sum + l.reAmount, 0)),
    grandTotal: 0,
  };
  totals.grandTotal = roundTo2(totals.base + totals.iva + totals.re);
  
  return { lines, totals };
}

function roundTo2(num: number): number {
  return Math.round(num * 100) / 100;
}
```

### Tests del motor

```typescript
// tests/re-calculator.test.ts

import { calculateRE } from '../app/services/re-calculator';

describe('RE Calculator', () => {
  test('calcula RE tipo general (21% IVA → 5.2% RE)', () => {
    const result = calculateRE([
      { productId: '1', title: 'Camiseta', quantity: 2, unitPrice: 25, ivaRate: 21 }
    ]);
    
    expect(result.totals.base).toBe(50.00);
    expect(result.totals.iva).toBe(10.50);    // 50 * 21%
    expect(result.totals.re).toBe(2.60);      // 50 * 5.2%
    expect(result.totals.grandTotal).toBe(63.10);
  });
  
  test('calcula RE tipo reducido (10% IVA → 1.4% RE)', () => {
    const result = calculateRE([
      { productId: '2', title: 'Libro', quantity: 1, unitPrice: 20, ivaRate: 10 }
    ]);
    
    expect(result.totals.re).toBe(0.28);  // 20 * 1.4%
  });
  
  test('calcula RE mixto (productos con diferentes tipos IVA)', () => {
    const result = calculateRE([
      { productId: '1', title: 'Camiseta', quantity: 1, unitPrice: 50, ivaRate: 21 },
      { productId: '2', title: 'Pan artesano', quantity: 3, unitPrice: 5, ivaRate: 4 },
    ]);
    
    // Camiseta: base 50, IVA 10.50, RE 2.60
    // Pan: base 15, IVA 0.60, RE 0.08 (15 * 0.5%)
    expect(result.totals.base).toBe(65.00);
    expect(result.totals.iva).toBe(11.10);
    expect(result.totals.re).toBe(2.68);   // 2.60 + 0.08
    expect(result.totals.grandTotal).toBe(78.78);
  });
  
  test('lanza error si tipo IVA no existe', () => {
    expect(() => calculateRE([
      { productId: '1', title: 'X', quantity: 1, unitPrice: 10, ivaRate: 15 }
    ])).toThrow('IVA rate 15% not found');
  });
});
```

---

## 3. Validación NIF/CIF

```typescript
// app/services/nif-validator.ts

export interface NifValidation {
  valid: boolean;
  type: 'NIF' | 'CIF' | 'NIE' | 'unknown';
  formatted: string;
  error?: string;
}

export function validateNIF(input: string): NifValidation {
  const clean = input.toUpperCase().replace(/[\s.-]/g, '');
  
  if (clean.length !== 9) {
    return { valid: false, type: 'unknown', formatted: clean, error: 'Debe tener 9 caracteres' };
  }
  
  // NIF persona física: 8 dígitos + letra
  if (/^\d{8}[A-Z]$/.test(clean)) {
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = parseInt(clean.substring(0, 8));
    const expected = letters[number % 23];
    const valid = clean[8] === expected;
    return {
      valid,
      type: 'NIF',
      formatted: clean,
      error: valid ? undefined : `Letra incorrecta (esperada: ${expected})`
    };
  }
  
  // NIE: X/Y/Z + 7 dígitos + letra
  if (/^[XYZ]\d{7}[A-Z]$/.test(clean)) {
    const prefix = { X: '0', Y: '1', Z: '2' }[clean[0]] || '0';
    const number = parseInt(prefix + clean.substring(1, 8));
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const expected = letters[number % 23];
    const valid = clean[8] === expected;
    return {
      valid,
      type: 'NIE',
      formatted: clean,
      error: valid ? undefined : `Letra incorrecta (esperada: ${expected})`
    };
  }
  
  // CIF: letra + 7 dígitos + dígito/letra control
  if (/^[ABCDEFGHJNPQRSUVW]\d{7}[A-J0-9]$/.test(clean)) {
    // Simplified CIF validation (full algorithm is complex)
    return { valid: true, type: 'CIF', formatted: clean };
  }
  
  return { valid: false, type: 'unknown', formatted: clean, error: 'Formato no reconocido' };
}
```

---

## 4. Distribución y Publicación

### 4.1 Shopify App Store

A diferencia de WooCommerce RE (distribuido via Freemius/WordPress.org), Shopify RE se distribuye exclusivamente via el **Shopify App Store**.

**Proceso de publicación:**

1. **Partner Dashboard** → Apps → Create app
2. **App listing:**
   - Nombre: "Shopify RE — Recargo de Equivalencia"
   - Categoría: "Finance > Taxes"
   - Idiomas: Español, Inglés
   - Screenshots: 5-8 de las pantallas principales
   - Video demo: 30-60 segundos
3. **Review:** Shopify revisa la app (3-10 días hábiles)
4. **Launch:** Publicar tras aprobación

### 4.2 Billing via Shopify Billing API

```typescript
// app/services/billing.server.ts

const PLANS = {
  starter: {
    name: 'Starter',
    amount: 9.90,
    currencyCode: 'EUR',
    interval: 'EVERY_30_DAYS',
    trialDays: 7,
  },
  growth: {
    name: 'Growth', 
    amount: 19.90,
    currencyCode: 'EUR',
    interval: 'EVERY_30_DAYS',
    trialDays: 7,
  },
  pro: {
    name: 'Pro',
    amount: 39.90,
    currencyCode: 'EUR',
    interval: 'EVERY_30_DAYS',
    trialDays: 7,
  },
};

// Shopify cobra y gestiona el pago → nosotros recibimos 80%
// (Shopify se queda 20% de comisión de App Store)
```

---

## 5. Variables de Entorno

```env
# .env (desarrollo)
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_customers,write_customers,read_orders,write_orders,read_products

DATABASE_URL=postgresql://postgres:dev@localhost:5432/shopify_re
SESSION_STORAGE=postgresql

# Producción
NODE_ENV=production
HOST=https://shopify-re.enviox.es
```

---

## 6. FAQ Técnico

### ¿Puedo modificar el total del checkout directamente?
No con Checkout UI Extensions. Necesitas **Shopify Functions (Cart Transform)** para añadir el RE como line item. O alternativamente, usar **Draft Orders** workflow donde la app crea la order con el total correcto.

### ¿Cómo sé qué tipo de IVA tiene cada producto?
Los productos en Shopify no tienen un metafield de "tipo de IVA" nativo. Opciones:
1. Usar un metafield custom `shopify_re.iva_rate` en cada producto
2. Inferir del Tax Rate configurado en Shopify (via Admin API)
3. Asumir 21% como default y permitir override manual

### ¿Funciona con Shopify Markets?
Sí, pero solo cuando el mercado de destino es España. La app debe detectar el mercado y solo activar RE para ventas en España a clientes marcados como RE.

### ¿Qué pasa si el merchant ya usa una app de facturación (Holded, Quaderno)?
Perfecto — esa es la idea. Shopify RE NO genera facturas. Solo calcula y cobra el RE en el checkout. El merchant exporta los datos RE (CSV) y los importa en su software de facturación certificado para emitir las facturas con Verifactu. Esto elimina cualquier conflicto o duplicidad.

---

*Documento 5 de 5 — Developer Handbook*
*Shopify RE — Febrero 2026*
