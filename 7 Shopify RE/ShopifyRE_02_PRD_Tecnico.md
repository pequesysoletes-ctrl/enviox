# SHOPIFY RE
## PRD Técnico — Product Requirements Document
### Documento 2 de 5 — Febrero 2026

---

## 1. Arquitectura del Sistema

### Stack tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    SHOPIFY APP                           │
│  Framework: Remix (Shopify CLI template)                │
│  UI: Shopify Polaris + App Bridge                       │
│  Auth: Shopify OAuth 2.0 + Session Tokens               │
│  Billing: Shopify Billing API (GraphQL)                  │
├─────────────────────────────────────────────────────────┤
│                    BACKEND                               │
│  Runtime: Node.js 20+                                    │
│  Database: PostgreSQL (via Prisma ORM)                   │
│  Sessions: Shopify App Session Storage                   │
│  Cache: Redis (opcional, para NIF validation cache)      │
├─────────────────────────────────────────────────────────┤
│             SHOPIFY PLATFORM APIS                        │
│  Admin API (GraphQL): Customers, Orders, Metafields      │
│  Checkout UI Extensions: RE line in checkout             │
│  Shopify Flow: Automations                               │
│  Webhooks: orders/create, orders/updated                 │
└─────────────────────────────────────────────────────────┘
```

### 1.1 Flujo principal — Pedido con RE

```
Cliente (marcado RE) hace pedido
           │
           ▼
Shopify Checkout
           │
           ▼
Checkout UI Extension detecta:
  → ¿Cliente tiene metafield RE = true?
  → SI → Calcular RE por producto
         → Mostrar línea RE desglosada
         → Añadir RE al total
  → NO → Checkout normal
           │
           ▼
Webhook orders/create recibido
           │
           ▼
Backend procesa:
  → Guarda datos RE del pedido
  → Actualiza métricas dashboard
  → Tag automático en pedido Shopify
           │
           ▼
Merchant ve en admin:
  → Pedido con indicador RE
  → Dashboard actualizado
  → Export CSV para gestoría

NOTA: La app NO genera facturas.
La facturación es responsabilidad del merchant/gestoría
con su software certificado (Verifactu compliant).
```

---

## 2. Modelo de Datos

### Shopify Metafields (Customer)

```json
// Namespace: shopify_re
// Owner: Customer

{
  "re_enabled": {
    "type": "boolean",
    "value": true,
    "description": "Cliente acogido al Recargo de Equivalencia"
  },
  "re_nif": {
    "type": "single_line_text_field",
    "value": "A12345678",
    "description": "NIF/CIF del cliente RE"
  },
  "re_business_name": {
    "type": "single_line_text_field",
    "value": "Alimentación García S.L.",
    "description": "Razón social del cliente RE"
  },
  "re_business_type": {
    "type": "single_line_text_field",
    "value": "Minorista alimentación",
    "description": "Tipo de comercio del cliente"
  },
  "re_address": {
    "type": "multi_line_text_field",
    "value": "Calle Mayor 12, 28001 Madrid",
    "description": "Dirección fiscal del cliente RE"
  },
  "re_active_since": {
    "type": "date",
    "value": "2025-01-15",
    "description": "Fecha desde la que se aplica RE"
  },
  "re_notes": {
    "type": "multi_line_text_field",
    "value": "Certificado verificado",
    "description": "Notas internas sobre el cliente RE"
  }
}
```

### Shopify Metafields (Order)

```json
// Namespace: shopify_re
// Owner: Order

{
  "re_applied": {
    "type": "boolean",
    "value": true
  },
  "re_total": {
    "type": "number_decimal",
    "value": "4.94",
    "description": "Total de RE aplicado en el pedido"
  },
  "re_breakdown": {
    "type": "json",
    "value": {
      "lines": [
        {
          "product_id": "gid://shopify/Product/123",
          "title": "Camiseta algodón",
          "base": 50.00,
          "iva_rate": 21,
          "iva_amount": 10.50,
          "re_rate": 5.2,
          "re_amount": 2.60
        },
        {
          "product_id": "gid://shopify/Product/456",
          "title": "Pantalón chino",
          "base": 45.00,
          "iva_rate": 21,
          "iva_amount": 9.45,
          "re_rate": 5.2,
          "re_amount": 2.34
        }
      ],
      "totals": {
        "base": 95.00,
        "iva": 19.95,
        "re": 4.94,
        "grand_total": 119.89
      }
    }
  },
  "re_customer_nif": {
    "type": "single_line_text_field",
    "value": "A12345678"
  }
}
```

### Base de datos Prisma (app propia)

```prisma
model Shop {
  id             String   @id @default(uuid())
  shopDomain     String   @unique
  accessToken    String
  sellerName     String?
  sellerNif      String?
  sellerAddress  String?
  reEnabled      Boolean  @default(true)
  invoicePrefix  String   @default("RE")  // Para tags y referencias internas
  invoiceCounter Int      @default(1)     // Contador interno de pedidos RE
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  orders         ReOrder[]
}

model ReOrder {
  id              String   @id @default(uuid())
  shopId          String
  shop            Shop     @relation(fields: [shopId], references: [id])
  shopifyOrderId  String
  shopifyOrderName String
  customerName    String
  customerNif     String
  baseTotal       Decimal
  ivaTotal        Decimal
  reTotal         Decimal
  grandTotal      Decimal
  invoiceNumber   String   // Referencia interna (no fiscal), ej: RE-0089
  breakdown       Json
  status          String   @default("completed")
  createdAt       DateTime @default(now())
  
  @@unique([shopId, shopifyOrderId])
}
```

---

## 3. Checkout UI Extension — RE en Checkout

### Concepto

La app utiliza **Shopify Checkout UI Extensions** para inyectar la línea de RE directamente en el checkout. Esto es CRÍTICO porque Shopify no permite modificar el checkout de otra forma (desde Checkout Extensibility).

```tsx
// extensions/checkout-re/src/Checkout.tsx
import {
  reactExtension,
  Banner,
  TextBlock,
  Divider,
  useCustomer,
  useCartLines,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <RecargoEquivalencia />
);

function RecargoEquivalencia() {
  const customer = useCustomer();
  // Fetch RE metafield via app proxy or metafield API
  // If customer is RE → show RE breakdown
  // If not → return null (no render)
  
  return (
    <Banner title="Recargo de Equivalencia aplicado" status="info">
      <TextBlock>
        IVA (21%): €19,95 | RE (5,2%): €4,94
      </TextBlock>
      <TextBlock emphasis="bold">
        Total con RE: €119,89
      </TextBlock>
    </Banner>
  );
}
```

### Limitaciones conocidas:

1. Checkout UI Extensions NO pueden modificar el total directamente — necesitamos usar **Shopify Functions (Cart Transform)** o un **Draft Order** workflow
2. Alternativa: App Proxy que muestra RE info pero el cobro real se hace post-orden via **Additional Fees** o ajuste manual
3. **Solución recomendada**: Usar **Shopify Functions** con la API de `cart-transform` para añadir el RE como un line item oculto

---

## 4. API REST — Endpoints Internos

```
# Clientes RE
GET    /api/customers/re           → Lista clientes RE
POST   /api/customers/re           → Marcar cliente como RE  
PUT    /api/customers/re/:id       → Actualizar datos RE
DELETE /api/customers/re/:id       → Desmarcar cliente RE

# Pedidos
GET    /api/orders/re              → Lista pedidos con RE
GET    /api/orders/re/:id          → Detalle pedido RE
GET    /api/orders/re/:id/export  → Descargar datos RE del pedido (CSV)

# Dashboard
GET    /api/dashboard/stats        → Métricas generales
GET    /api/dashboard/chart        → Datos para gráficos
GET    /api/dashboard/export       → Exportar CSV

# Configuración
GET    /api/settings               → Obtener configuración
PUT    /api/settings               → Guardar configuración

# NIF Validation
POST   /api/validate-nif           → Validar formato NIF/CIF
```

---

## 5. Seguridad y Cumplimiento

### Autenticación
- Shopify OAuth 2.0 con Session Tokens
- Verificación HMAC en webhooks
- Rate limiting en endpoints

### Datos fiscales
- Los datos de NIF y facturación son PII → encriptación en reposo
- Cumplimiento GDPR (derecho de borrado de datos RE del cliente)
- Retención de facturas: mínimo 4 años (obligación fiscal España)

### Validaciones
- NIF/CIF: validación formato + dígito de control
- Porcentajes RE: los tipos se configuran pero tienen defaults legales
- Facturas: numeración secuencial sin huecos (obligación AEAT)

---

*Documento 2 de 5 — PRD Técnico*
*Shopify RE — Febrero 2026*
