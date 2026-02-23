# SMART PREORDERS
## Implementation Roadmap
### Documento 4 de 5 — Febrero 2026

---

## 1. Visión General

### Duración total estimada: 4 semanas (MVP táctico)

Este es el producto **táctico** — desarrollo rápido, ROI claro. Reutiliza patterns de auth/billing de MRW Pro.

### Prerrequisitos
- MRW Pro / Correos Pro (reutilizar auth, billing, Polaris patterns)
- Shopify Partners + tienda dev con productos de prueba
- Shopify Functions habilitado en dev store (plan Shopify Plus o Partner dev store)

---

## 2. Backlog Detallado

### Semana 1 — Setup + Metafields + Botón (~18h)

```
Día 1-2: Setup proyecto
├── shopify app create remix
├── Prisma + PostgreSQL
├── Copiar patterns auth/billing de MRW Pro
├── Definir metafields: is_preorder, estimated_ship_date, preorder_note
└── CRUD productos preorder (admin API)

Día 3: Theme App Extension — Botón Preorder
├── shopify app generate extension --type theme
├── App Block: botón "Pre-order" (Liquid)
├── Leer metafield is_preorder → cambiar botón
├── Mostrar fecha estimada
└── Settings schema: colores, texto, posición

Día 4-5: Auto-preorder + product list
├── Webhook products/update → si stock=0, activar preorder
├── Pantalla admin: lista productos en preventa (IndexTable)
├── Formulario: configurar preorder por producto
└── Toggle: activar/desactivar auto-preorder
```

**Entregable:** Botón preorder funcional en tienda, admin para gestionar productos

---

### Semana 2 — Carrito Mixto + Aviso (~16h)

```
Día 1-2: Detección carrito mixto
├── JS storefront: analizar cart items
├── Detectar mezcla in-stock + preorder
├── Inyectar aviso ámbar en carrito
├── Timeline visual: "Parte 1 envío ahora / Parte 2 envío en X"
└── CSS responsive para aviso

Día 3: Configuración admin del carrito mixto
├── Pantalla settings: modo carrito (cobrar/bloquear/avisar)
├── Input: coste envío extra
├── Input: textos personalizables
└── Preview del aviso

Día 4-5: Shopify Functions (Cart Transform)
├── shopify app generate extension --type cart_transform
├── Función: detectar carrito mixto
├── Añadir line item "Envío dividido" con coste configurado
├── Testing en checkout dev
└── Fallback: si Functions no disponible → solo avisar
```

**Entregable:** Carrito mixto detectado, aviso visible, envío extra cobrado

---

### Semana 3 — Webhooks + Dashboard + Billing (~16h)

```
Día 1: Webhooks orders/create
├── Analizar line items del pedido
├── Detectar items con metafield preorder
├── Añadir tags: Contiene-Preorder, Carrito-Mixto, Envío-Pendiente
├── Actualizar nota del pedido
└── Crear registro PreorderRecord en DB

Día 2: Pantalla pedidos con preorder
├── IndexTable con pedidos preorder
├── Filtros: estado, fecha, mixto
├── Badges: Pendiente, Enviado, Mixto
└── Summary bar con totales

Día 3: Dashboard de ahorro + KPIs
├── Dashboard principal con 4 KPIs
├── Gráfico ahorro por mes
├── Card "ROI" prominente
├── Próximos envíos pendientes
└── Cálculo automático de ahorro

Día 4: Dashboard ahorro detallado
├── Hero card verde con total ahorrado
├── Desglose por mes
├── ROI calculator
└── Export data

Día 5: Shopify Billing API
├── 2 planes (Lite 9,99€, Pro 19,99€)
├── Feature gating (50 preorders vs ilimitado)
├── Trial 7 días
└── Billing page con ROI callout
```

**Entregable:** App completa con tracking, dashboard, monetización

---

### Semana 4 — QA + Launch (~12h)

```
Día 1-2: Testing
├── Tests: botón preorder (stock=0, stock>0, producto marcado)
├── Tests: carrito mixto (detección, aviso, cargo extra)
├── Tests: webhooks (tags, nota, PreorderRecord)
├── Tests: billing (trial, feature gating)
├── Edge cases: stock vuelve, múltiples preorders, cancelación
└── Performance: Lighthouse con app instalada

Día 3: Onboarding + polish
├── Pantalla welcome/onboarding
├── Empty states
├── Loading states
├── Error handling
└── Responsive review

Día 4: App Store listing
├── Screenshots (6-8)
├── App icon (reloj/calendario morado, estilo Enviox)
├── Descripción EN+ES con keyword "double shipping"
├── Video demo 30-45s
├── Privacy policy
└── Submit for review

Día 5: Launch prep
├── Blog: "El error de los 6€"
├── Reddit post preparado
├── Cross-sell banner en MRW/Correos Pro
└── Agencias: email de lanzamiento
```

**Entregable:** App publicada en Shopify App Store

---

## 3. Hitos

| Hito | Semana | Criterio |
|------|--------|---------|
| **M1: Botón Preorder** | S1 | Botón funcional en storefront |
| **M2: Carrito Mixto** | S2 | Detección + aviso + cargo extra |
| **M3: Dashboard** | S3 | Tracking, ahorro, billing |
| **M4: Launch** | S4 | App publicada |

---

## 4. Dependencias

| Dependencia | Tipo | Detalle |
|-------------|------|---------|
| MRW Pro | Código | Auth, Billing, Polaris patterns |
| Shopify Functions | Feature | Cart Transform (plan Plus/Partner) |
| Metafields | API | Shopify Admin API |
| Landing enviox.es | Marketing | Página producto Preorders |

---

*Documento 4 de 5 — Implementation Roadmap*
*Smart Preorders — Febrero 2026*
