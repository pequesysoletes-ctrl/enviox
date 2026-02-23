# SHOPIFY RE
## Implementation Roadmap
### Documento 4 de 5 — Febrero 2026

---

## 1. Visión General

### Duración total estimada: 7-8 semanas

Al reutilizar la lógica conceptual de WooCommerce RE y la infraestructura compartida Enviox (auth, billing, UI patterns), el desarrollo se reduce de 12 semanas (desde cero) a 7-8 semanas.

### Prerrequisitos

- WooCommerce RE o MRW Pro/Correos Pro desarrollados previamente (para reutilizar patrones Shopify)
- Acceso a Shopify Partners
- Tienda de desarrollo (dev store) para testing
- Checkout Extensibility habilitado en dev store

---

## 2. Backlog Detallado

### Semana 1 — Setup + Modelo de Datos (~14h)

```
Día 1-2: Setup del proyecto
├── shopify app create remix (Shopify CLI)
├── Configurar Prisma + PostgreSQL
├── Configurar deployment (Fly.io / Railway)
├── Estructura de carpetas Enviox estándar
└── CI/CD básico

Día 3-4: Modelo de datos
├── Schema Prisma (Shop, ReOrder)
├── Definición de metafields (customer + order)
├── Seed data para dev
└── Migrations iniciales

Día 5: APIs base
├── Endpoints CRUD clientes RE
├── Endpoint configuración
└── Middleware auth (Shopify session)
```

**Entregable:** Proyecto funcionando en dev store, CRUD de clientes RE vía API

---

### Semana 2 — Lógica Core RE (~18h)

```
Día 1-2: Motor de cálculo RE
├── Función: calcularRE(productos, tipoIVA) → desglose
├── Tablas de tipos RE vigentes (constantes)
├── Detección automática tipo IVA por producto
├── Tests unitarios del motor de cálculo
└── Edge cases: productos exentos, tipos mixtos

Día 3-4: Validación NIF
├── Algoritmo validación NIF/CIF/NIE
├── Dígito de control
├── Tests de validación
└── Cache de validaciones (opcional)

Día 5: Export de datos RE
├── Generación de CSV con desglose RE por pedido
├── Formato compatible con gestorías (A3, Sage, Holded)
├── Desglose IVA + RE separados
├── Selección de período
└── Tests de export
```

**Entregable:** Motor RE funcional, NIF validado, export CSV operativo

---

### Semana 3 — UI Admin Pantallas 01-04 (~16h)

```
Día 1: Pantalla 01 — Configuración
├── FormLayout con opciones RE
├── Tabla tipos vigentes
├── Datos fiscales vendedor
└── Guardar en Shop model

Día 2-3: Pantalla 02 — Lista clientes RE
├── IndexTable con filtros
├── Badges de estado
├── Acciones bulk
├── Búsqueda por nombre/NIF
└── Resumen inferior

Día 4: Pantalla 03 — Ficha cliente RE
├── Formulario datos fiscales
├── Validación NIF inline
├── Upload documentación (DropZone)
├── Toggle estado RE
└── Link al perfil Shopify del cliente

Día 5: Pantalla 04 — Preview checkout
├── Mockup visual de cómo se ve el RE
├── Instrucciones de configuración
└── Link a Checkout Extensibility docs
```

**Entregable:** Panel de administración funcional para gestión RE

---

### Semana 4 — UI Admin Pantallas 05-07 + Dashboard (~16h)

```
Día 1-2: Pantalla 05 — Lista pedidos RE
├── IndexTable con pedidos que tienen RE
├── Columnas: pedido, cliente, NIF, IVA, RE, total
├── Filtros por fecha, cliente, estado
├── Resumen totales del período
└── Link a detalle pedido RE

Día 3: Pantalla 06 — Dashboard
├── 4 KPI cards (polaris-viz)
├── Gráfico RE por mes (BarChart)
├── Desglose por tipo IVA
├── Top clientes
└── Obligaciones fiscales próximas

Día 4: Pantalla 07 — Export CSV
├── Selector de período
├── Checklist de datos
├── Vista previa tabla
├── Generación CSV/Excel
└── Descarga + envío por email

Día 5: (Disponible — pantalla factura eliminada)
├── Pulir UX de export CSV
├── Añadir export Excel (.xlsx)
└── Test de formatos de export
```

**Entregable:** App admin completa con todas las pantallas

---

### Semana 5 — Checkout Extension + Webhooks (~18h)

```
Día 1-2: Checkout UI Extension
├── Extension scaffold (shopify app generate extension)
├── Target: purchase.checkout.cart-line-list.render-after
├── Detección de cliente RE (via metafield query)
├── Banner con desglose RE
├── Componentes: Banner, TextBlock, InlineLayout
└── Testing en checkout dev

Día 3: Shopify Function (Cart Transform)
├── Extension tipo cart-transform
├── Añadir line item oculto con importe RE
├── Asegurar que el total incluye RE
└── Testing con diferentes tipos IVA

Día 4: Webhooks
├── orders/create → procesar RE, guardar datos, tag pedido
├── orders/updated → actualizar si cambia
├── orders/cancelled → marcar pedido RE cancelado
├── customers/update → sincronizar datos RE
└── HMAC validation

Día 5: Integration testing
├── Flujo completo: marcar cliente → pedido → checkout → datos RE guardados
├── Test con tipos mixtos (21% + 10% en mismo pedido)
├── Test cancelación/reembolso
└── Test bulk operations
```

**Entregable:** RE funcionando end-to-end en checkout real

---

### Semana 6 — Billing + Onboarding (~12h)

```
Día 1-2: Shopify Billing API
├── 3 planes (Starter, Growth, Pro)
├── Subscription create/update/cancel
├── Feature gating por plan
├── Trial period (7 días)
└── Upgrade/downgrade flow

Día 3: Onboarding
├── Pantalla 10 — Welcome screen
├── Setup wizard 3 pasos
├── Empty states para nuevos usuarios
└── Tooltips y ayuda contextual

Día 4-5: Pantalla 09 — Billing page
├── Plan actual, próximo cobro Shopify
├── Cards de planes con CTAs
├── Historial (gestionado por Shopify)
└── FAQ
```

**Entregable:** Monetización activa, onboarding pulido

---

### Semana 7 — QA + App Store Listing (~14h)

```
Día 1-2: Testing exhaustivo
├── Tests unitarios (motor RE, NIF, export CSV)
├── Tests de integración (API endpoints)
├── Tests E2E (flujo checkout completo)
├── Tests de edge cases
├── Performance (load time < 3s)
└── Accesibilidad (lighthouse score)

Día 3: App Store listing
├── Screenshots (5-8) de todas las pantallas
├── App icon (siguiendo Enviox brand guidelines)
├── Descripción en español + inglés
├── Privacy policy
├── FAQ / Help docs
└── Video demo (30-60s)

Día 4-5: Submission + correcciones
├── Shopify App Review checklist
├── Submit for review
├── Iterar si hay feedback
└── Preparar launch plan
```

**Entregable:** App publicada en Shopify App Store

---

### Semana 8 (buffer) — Post-launch (~10h)

```
├── Monitorizar métricas post-launch
├── Responder reviews
├── Bug fixes urgentes
├── Cross-sell setup (banner en MRW/Correos Pro)
├── Blog post SEO
└── Preparar iteración v1.1
```

---

## 3. Hitos

| Hito | Semana | Criterio de éxito |
|------|--------|-------------------|
| **M1: Backend funcional** | S1 | CRUD clientes RE, modelo de datos |
| **M2: Motor RE** | S2 | Cálculo RE correcto, NIF validado, export CSV |
| **M3: Admin UI** | S3-S4 | 8 pantallas funcionales |
| **M4: Checkout** | S5 | RE en checkout real, webhooks |
| **M5: Monetización** | S6 | Billing activo, onboarding |
| **M6: Launch** | S7 | App publicada en App Store |

---

## 4. Dependencias con otros productos Enviox

| Dependencia | Tipo | Detalle |
|-------------|------|---------|
| MRW Pro / Correos Pro | Código reutilizable | Auth flow, Billing patterns, Polaris layouts |
| WooCommerce RE | Lógica reutilizable | Motor de cálculo RE, validación NIF, formato datos |
| Landing enviox.es | Marketing | Página de producto RE en la landing |
| Cross-sell | Marketing | Banner RE dentro de apps de logística |

---

*Documento 4 de 5 — Implementation Roadmap*
*Shopify RE — Febrero 2026*
