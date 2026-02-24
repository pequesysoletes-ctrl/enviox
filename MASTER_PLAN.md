# 🚀 Shopify Transport Apps — Plan Maestro Unificado

> **Dos productos, una arquitectura.**
> Febrero 2026

---

## 1. Visión General

Dos apps independientes para Shopify App Store, cada una con su marca, listing y base de clientes:

| | **MRW Pro** | **Correos Pro** |
|---|---|---|
| **Transportista** | MRW | Correos Standard + Correos Express |
| **Colores** | Navy `#0369A1` + Rojo `#DC2626` | Rojo Correos `#D4351C` + Azul Express `#1C4F8A` |
| **Mercado** | ~2.700 tiendas Shopify con contrato MRW | ~6.000+ tiendas con contrato Correos |
| **App oficial rival** | 1.0 ⭐ (rota, 6 reviews) | ~2-3 ⭐ (mediocre) |
| **API** | MRWLink API (REST/SOAP, no pública) | Correos Pre-Registro + Correos Express API |
| **Pricing** | Starter 29€ / Pro 49€ / Business 99€ | Starter 29€ / Pro 49€ / Business 99€ |
| **Diferenciador único** | — | Motor de reglas de enrutamiento Standard ↔ Express |
| **MVP estimado** | 6 semanas | 7 semanas (motor reglas +1) |

---

## 2. Diferencia Clave: Correos es "Dual-Carrier"

MRW Pro es single-carrier (solo MRW). Correos Pro es **dual-carrier** (Correos Standard + Correos Express = dos empresas diferentes con APIs distintas). Esto introduce:

### Funcionalidades exclusivas de Correos Pro
- Pantalla 02 con **DOS secciones** de credenciales (Standard y Express)
- Pantalla 03 = **Motor de reglas de enrutamiento** (no existe en MRW)
  - Decidir automáticamente qué carrier usar por: peso, importe, provincia, método de envío
  - Simulador en tiempo real
- Badges **duales** en toda la app (rojo = Standard, azul = Express)
- Dashboard con **breakdown por carrier**
- Batch print **agrupado por carrier**
- Funciona con solo UNO de los dos carriers conectado

### Misma funcionalidad en ambas apps
- Onboarding 3 pasos
- Verificación de credenciales API
- Crear envío automático (webhook) o manual
- Etiquetas PDF + batch print ZIP
- Timeline tracking con polling cron
- Devoluciones
- Recogidas con calendario
- Dashboard métricas
- Billing (Shopify Billing API, 3 planes)
- Todos los estados globales (skeleton, empty, error, warning)

---

## 3. Análisis Comparativo de Documentación

### 3.1 Business Plan

| Aspecto | MRW Pro | Correos Pro |
|---------|---------|-------------|
| Oportunidad | App oficial 1.0⭐, nicho vacío | App oficial mediocre, mercado 2-3x mayor |
| Mercado objetivo | 2.700 tiendas | 6.000+ tiendas |
| MRR objetivo 18 meses | 5.000-8.000€/mes | 5.000-8.000€/mes (potencial mayor) |
| Adquisición 1-15 | Reviews negativas app oficial | Reviews negativas app oficial |
| Modelo API | Cliente usa SUS credenciales | Cliente usa SUS credenciales |
| Comisión Shopify | 20% | 20% |

### 3.2 PRD Técnico

| Aspecto | MRW Pro | Correos Pro |
|---------|---------|-------------|
| Stack | React + Polaris + Node + Express + PostgreSQL + Prisma | **IDÉNTICO** |
| Deploy | Railway.app | **IDÉNTICO** |
| Auth | Shopify OAuth | **IDÉNTICO** |
| Tablas BD | shops, shipments, returns, pickups | **IDÉNTICO** + campo `carrier` + `routing_rules` JSONB |
| API carrier | `mrw-client.js` (1 carrier) | `correos-client.js` + `correos-express-client.js` (2 carriers) |
| Webhooks | orders/create, app/uninstalled | **IDÉNTICO** |
| Seguridad | AES-256, HMAC, rate-limit, RGPD | **IDÉNTICO** |
| Motor de reglas | ❌ No tiene | ✅ routing-engine.js + simulador |
| Endpoints API | 14 endpoints | 15 endpoints (+1 routing/preview) |

### 3.3 UI/UX Specs

| Pantalla | MRW Pro | Correos Pro | Diferencias |
|----------|---------|-------------|-------------|
| 01 Bienvenida | ✅ | ✅ | Solo branding |
| 02 Conexión | 1 sección (MRW) | 2 secciones (Standard + Express) | **Layout diferente** |
| 02b Modal ayuda | Portal MRW | Portal empresas.correos.es + correosexpress.es | **Contenido diferente** |
| 03 Config | Servicio/peso/auto | **Motor de reglas + simulador** | **Pantalla completamente diferente** |
| 04 Lista envíos | Sin badge carrier | Con badge carrier (rojo/azul) | Badge extra |
| 05 Detalle | Timeline MRW | Timeline con colores por carrier | Colores timeline |
| 06 Crear envío | Selector servicio MRW | Preview regla + override carrier | Lógica extra |
| 07 Batch print | ZIP/PDF | Agrupación por carrier | Agrupación extra |
| 08 Lista devoluciones | ✅ | + badge carrier | Mínimo |
| 09 Crear devolución | ✅ | + selector carrier devolución | Campo extra |
| 10 Recogidas | ✅ | + selector carrier recogida | Campo extra |
| 11 Dashboard | Métricas globales | + breakdown por carrier | Sección extra |
| 12 Facturación | ✅ | + desglose Standard/Express | Info extra |

### 3.4 Implementation Roadmap

| Fase | MRW Pro | Correos Pro |
|------|---------|-------------|
| Setup + API sandbox | Semana 1 (13h) | Semana 1 (15h) — solicitar 2 sandboxes |
| Integración API core | Semana 2 (18h) | Semanas 2-3 (28h) — 2 clientes + routing engine |
| UI Polaris pantallas 01-07 | Semanas 3-4 (38h) | Semanas 4-5 (42h) — pantalla 03 mucho más compleja |
| Devoluciones, recogidas, dashboard | Semana 5 (20h) | Semana 6 (20h) |
| Billing, QA, submit | Semana 6 (22h) | Semana 7 (22h) |
| Beta privada | Semanas 7-8 (30h) | Semanas 8-9 (30h) |
| Lanzamiento público | Semanas 9-10 (20h) | Semanas 10-11 (20h) |
| **TOTAL hasta lanzamiento** | **10 semanas** | **11 semanas** |

---

## 4. Arquitectura Compartida Recomendada

Aunque son **dos productos separados** en el App Store, internamente comparten ~75% del código.

### Estructura de carpetas propuesta

```
📂 shopify-transport-apps/          ← Monorepo privado
│
├── 📂 packages/
│   ├── 📂 core/                    ← CÓDIGO COMPARTIDO (75%)
│   │   ├── 📂 components/          ← Componentes Polaris reutilizables
│   │   │   ├── ShipmentStatusBadge.jsx
│   │   │   ├── TrackingTimeline.jsx
│   │   │   ├── ShipmentTable.jsx
│   │   │   ├── LabelBatchPrint.jsx
│   │   │   ├── PickupCalendar.jsx
│   │   │   ├── DashboardMetrics.jsx
│   │   │   ├── BillingPlans.jsx
│   │   │   └── EmptyStates.jsx
│   │   ├── 📂 server/
│   │   │   ├── base-carrier-client.js   ← Clase base abstracta
│   │   │   ├── webhooks.js              ← Webhooks Shopify
│   │   │   ├── tracking-job.js          ← Cron tracking
│   │   │   ├── encryption.js            ← AES-256
│   │   │   └── billing.js               ← Shopify Billing
│   │   ├── 📂 prisma/
│   │   │   └── base-schema.prisma       ← Tablas compartidas
│   │   └── 📂 utils/
│   │
│   ├── 📂 mrw-pro/                 ← ESPECÍFICO MRW (25%)
│   │   ├── 📂 app/routes/          ← Páginas MRW
│   │   ├── 📂 server/
│   │   │   └── mrw-client.js        ← API MRWLink
│   │   ├── 📂 prisma/
│   │   │   └── schema.prisma        ← Extiende base (sin routing_rules)
│   │   ├── theme.js                 ← Colores MRW
│   │   └── shopify.app.toml
│   │
│   └── 📂 correos-pro/             ← ESPECÍFICO CORREOS (25%)
│       ├── 📂 app/routes/           ← Páginas Correos
│       ├── 📂 server/
│       │   ├── correos-client.js     ← API Correos Standard
│       │   ├── correos-express-client.js ← API Correos Express
│       │   └── routing-engine.js     ← Motor de reglas (EXCLUSIVO)
│       ├── 📂 prisma/
│       │   └── schema.prisma         ← Extiende base (con routing_rules + carrier)
│       ├── theme.js                  ← Colores Correos
│       └── shopify.app.toml
│
├── package.json                     ← Workspaces npm/pnpm
└── README.md
```

### Estrategia de Infraestructura

**Fase desarrollo + beta (S1-S9):** VPS existente (46.225.55.22)
**Fase producción (S10+):** VPS dedicado exclusivo cuando haya clientes reales

#### Fase 1 — VPS existente (coste 0€ extra)

```
VPS actual (46.225.55.22)
│
├── Nginx (reverse proxy + SSL Certbot)
│   ├── mrw-pro-dev.tudominio.com     → localhost:3000
│   └── correos-pro-dev.tudominio.com → localhost:3001
│
├── Node.js (PM2)
│   ├── MRW Pro      → puerto 3000
│   └── Correos Pro  → puerto 3001
│
├── PostgreSQL 16
│   ├── DB: mrw_pro
│   └── DB: correos_pro
│
└── (convive con BitRenta, Evolution API, etc.)
```

#### Fase 2 — VPS dedicado (~5-8€/mes, cuando haya clientes)

```
VPS Hetzner CX22 (4GB RAM, 2 vCPU, 40GB SSD) — 4,50€/mes
│
├── Nginx + Certbot SSL
│   ├── app.mrwpro.es       → localhost:3000
│   └── app.correospro.es   → localhost:3001
│
├── Node.js (PM2)
│   ├── MRW Pro      → puerto 3000
│   └── Correos Pro  → puerto 3001
│
├── PostgreSQL 16 (datos migrados del VPS anterior)
│   ├── DB: mrw_pro
│   └── DB: correos_pro
│
├── Redis (colas tracking jobs)
│
└── Cron: pg_dump backups diarios
```

> **Criterio de migración:** Migrar a VPS dedicado cuando haya ≥3 clientes de pago o al salir de beta pública.
> **Alternativa:** Escalar el VPS actual a un plan superior (más RAM/CPU) en vez de migrar — evita el proceso de migración.

---

## 5. Plan de Implementación Unificado Optimizado

### Estrategia: Construir core + MRW primero, luego adaptar para Correos

| Semana | Actividad | Output |
|--------|-----------|--------|
| **S1** | Setup: Shopify Partners, monorepo, Prisma base. Solicitar sandbox MRW + sandbox Correos Standard + sandbox Correos Express | Entorno listo, sandboxes solicitados |
| **S2** | `base-carrier-client.js` + `mrw-client.js`. Crear envío MRW real | Primera etiqueta MRW descargable ✅ |
| **S3** | Core UI: Layout, sidebar, pantallas 01, 02 (MRW), 03 (MRW config), estados globales | Flujo onboarding MRW completo |
| **S4** | Core UI: Pantallas 04-07 (envíos, detalle, crear, batch) con MRW | Gestión completa de envíos MRW |
| **S5** | Pantallas 08-12 (devoluciones, recogidas, dashboard, billing) con MRW | **MRW Pro MVP completo** ✅ |
| **S6** | QA MRW + Submit MRW al App Store. Simultáneamente: `correos-client.js` + `correos-express-client.js` | MRW Pro enviado a review |
| **S7** | `routing-engine.js`. Adaptar pantallas 02 (dual) y 03 (reglas) para Correos | Motor de reglas Correos funcionando |
| **S8** | Adaptar resto de pantallas (badges carrier, breakdown dashboard, batch agrupado) | **Correos Pro MVP completo** ✅ |
| **S9** | QA Correos + Submit al App Store. Beta MRW con betatesters | Correos Pro enviado a review |
| **S10-11** | Beta ambas apps. Fix bugs. Reseñas App Store | Ambas apps en el App Store |
| **S12** | Lanzamiento público ambas apps | 🚀 |

**Resultado: 2 apps lanzadas en 12 semanas** (en lugar de 10+11 = 21 semanas por separado).

---

## 6. Checklist Global Pre-Implementación

### 🔴 BLOQUEANTES (hacer ANTES de codificar)

- [ ] Crear cuenta Shopify Partners + 2 tiendas dev (una para cada app)
- [ ] Solicitar credenciales sandbox MRW (3-10 días)
- [ ] Solicitar credenciales sandbox Correos Standard (3-10 días)
- [ ] Solicitar credenciales sandbox Correos Express (3-10 días)
- [ ] Decidir patrón de navegación → **DECIDIDO: Top bar horizontal** (ver docs de revisión de mockups)
- [ ] Confirmar precios de planes con ambos Business Plans
- [ ] Setup monorepo con pnpm workspaces

### 🟡 IMPORTANTE (antes de empezar UI)

- [ ] Confirmar paleta colores MRW: `#0369A1`, `#DC2626`, `#059669`, `#D97706`
- [ ] Confirmar paleta colores Correos: `#D4351C`, `#1C4F8A`, `#059669`, `#D97706`
- [ ] Estandarizar badges de estado (colores consistentes entre apps) → **VER guías canónicas en docs revisión**
- [ ] Confirmar servicios MRW disponibles
- [ ] Confirmar servicios Correos Standard y Express
- [ ] Definir estructura de routing_rules JSONB para Correos

### 🟢 HERRAMIENTAS NECESARIAS

- [ ] Node.js v18+ instalado
- [ ] Shopify CLI (`npm install -g @shopify/cli`)
- [ ] PostgreSQL (local o Railway)
- [ ] Prisma CLI
- [ ] Postman (para probar APIs carrier)
- [ ] Railway cuenta (deploy)

---

## 7. Estructura de Archivos del Proyecto (Actual)

```
📂 1 MRW Shopify/                    ← Carpeta raíz del workspace
│
├── 📄 MASTER_PLAN.md                ← ESTE DOCUMENTO (plan unificado)
│
├── 📂 MRW Pro/                      ← Documentación MRW
│   ├── 📄 MRWPro_01_BusinessPlan.docx
│   ├── 📄 MRWPro_02_PRD_Tecnico.docx
│   ├── 📄 MRWPro_03_UXUI_Specs.docx
│   ├── 📄 MRWPro_04_Implementation_Roadmap.docx
│   ├── 📄 MRWPro_05_Developer_Handbook.docx
│   ├── 📄 MRWPro_Prompts_Mockups.md          ← Prompts para generar mockups
│   ├── 📄 MRWPro_Prompts_Stitch.md           ← Prompts para Google Stitch
│   ├── 📄 MRWPro_Revision_Mockups_Developer.docx  ← Revisión + guía coherencia
│   └── 📂 Mockups/ (18 pantallas con screen.png + code.html)
│
├── 📂 Correos Pro/                  ← Documentación Correos
│   ├── 📄 CorreosPro_01_BusinessPlan.docx
│   ├── 📄 CorreosPro_02_PRD_Tecnico.docx
│   ├── 📄 CorreosPro_03_UXUI_Specs.docx
│   ├── 📄 CorreosPro_04_Implementation_Roadmap.docx
│   ├── 📄 CorreosPro_05_Developer_Handbook.docx
│   ├── 📄 CorreosPro_Prompts_Stitch.md       ← Prompts para Google Stitch
│   ├── 📄 CorreosPro_Revision_Mockups_Developer.md  ← Revisión + guía coherencia
│   └── 📂 Mockups/ (17 pantallas con screen.png + code.html)
│
└── 📂 (futuro: shopify-transport-apps/)  ← Código fuente (monorepo)
```

---

## 8. Riesgos Principales

| Riesgo | Prob. | Impacto | Mitigación |
|--------|-------|---------|------------|
| MRW no da acceso sandbox en <2 semanas | Media | ALTO — bloquea S2 | Contactar semana 1 día 1. Tener plan B con mock |
| Correos no da acceso sandbox | Media | MEDIO — no bloquea MRW | Avanzar MRW, Correos en paralelo |
| API de MRW es SOAP legacy compleja | Alta | MEDIO | Analizar bien en S1. Postman primero |
| Shopify rechaza la app | Baja | MEDIO | Seguir checklist Polaris al pie de la letra |
| Cambio de APIs carriers | Media | BAJO | Arquitectura de adaptadores aísla el impacto |
---

## 9. 🌐 Dominio y Marca — ✅ DECIDIDO

> **Dominio:** `enviox.es` — Comprado 19/02/2026

### Concepto

**Enviox** = marca paraguas para toda la suite de apps de logística (Shopify + WooCommerce futuros). Las apps son embedded (corren dentro del panel admin de la tienda), así que el dominio se usa para:
- **Backend API** — endpoints que Shopify/WooCommerce llaman
- **Landing page** — info pública, SEO, enlace desde App Store
- **Soporte** — FAQ, contacto, documentación

### Arquitectura de subdominios

```
enviox.es                             ← Landing page (info de todos los productos)
├── /mrw-pro                          ← Info MRW Pro Shopify
├── /correos-pro                      ← Info Correos Pro Shopify
├── /mrw-woo                          ← (futuro) MRW WooCommerce
├── /correos-woo                      ← (futuro) Correos WooCommerce
│
app.enviox.es                         ← Backend API (Shopify apps)
├── /mrw/*                            ← Endpoints MRW Pro
└── /correos/*                        ← Endpoints Correos Pro
│
woo.enviox.es                         ← (futuro) Backend WooCommerce
docs.enviox.es                        ← (futuro) Help Center
```

### Landing page (estructura)

```
Hero: "Enviox — Apps de logística para ecommerce"
├── Productos (cards con link a cada App Store / WooCommerce listing)
│   ├── MRW Pro (Shopify)
│   ├── Correos Pro (Shopify)
│   ├── MRW (WooCommerce) — coming soon
│   └── Correos (WooCommerce) — coming soon
├── Features comunes (tracking, etiquetas, dashboard)
├── Pricing
├── FAQ
├── Contacto / Soporte
└── Footer (legal, RGPD)
```

**Coste dominio:** ~8-10€/año

---

## 10. 📋 CHECKLIST POR FASES — Implementación Semana a Semana

> Cada fase incluye los entregables, criterios de éxito, y dependencias.
> Marcar cada item cuando esté completado.

---

### 🏗️ FASE 0 — Pre-Implementación (Semana 0)
> *Antes de escribir una sola línea de código*

**Cuentas y accesos:**
- [ ] Crear cuenta Shopify Partners
- [ ] Crear tienda de desarrollo "MRW Pro Dev"
- [ ] Crear tienda de desarrollo "Correos Pro Dev"
- [ ] Solicitar credenciales sandbox MRW (email a departamento técnico/comercial)
- [ ] Solicitar credenciales sandbox Correos Standard (empresas.correos.es)
- [ ] Solicitar credenciales sandbox Correos Express (delegación comercial)
- [ ] Crear cuenta Railway.app (plan dev gratuito para empezar)
- [ ] Crear repositorio Git privado (GitHub/GitLab)

**Decisiones técnicas:**
- [ ] Confirmar navegación: **Top bar horizontal con menú** (decisión canónica de revisión mockups)
- [ ] Confirmar paleta colores MRW: Navy `#0369A1` + Rojo `#DC2626`
- [ ] Confirmar paleta colores Correos: Rojo `#D4351C` + Azul `#1C4F8A`
- [ ] Confirmar planes de pricing: Starter 29€ / Pro 49€ / Business 99€
- [ ] Confirmar servicios MRW disponibles (Paq Estándar, Premium, etc.)
- [ ] Confirmar servicios Correos Standard (Paq Estándar, Paq Premium, etc.)
- [ ] Confirmar servicios Correos Express (Express 24h, Express 48h, etc.)

**Entorno local:**
- [ ] Node.js v18+ instalado
- [ ] Shopify CLI instalado (`npm install -g @shopify/cli`)
- [ ] PostgreSQL local o en Railway
- [ ] Prisma CLI instalado
- [ ] Postman instalado (para probar APIs)
- [ ] Inter font descargada (Google Fonts)

**📄 Documentación revisada por el dev:**
- [ ] Leer MASTER_PLAN.md (este documento)
- [ ] Leer MRWPro_02_PRD_Tecnico.docx
- [ ] Leer MRWPro_05_Developer_Handbook.docx
- [ ] Leer MRWPro_Revision_Mockups_Developer.docx (reglas de coherencia MRW)
- [ ] Leer CorreosPro_02_PRD_Tecnico.docx
- [ ] Leer CorreosPro_05_Developer_Handbook.docx
- [ ] Leer CorreosPro_Revision_Mockups_Developer.md (reglas de coherencia Correos)

✅ **Criterio de éxito Fase 0:** Todas las cuentas creadas, sandboxes solicitados, entorno local funcional.

---

### ⚙️ FASE 1 — Setup + Infraestructura (Semana 1)
> *Monorepo, base de datos, scaffolding de ambas apps*

**Monorepo:**
- [ ] Inicializar monorepo con pnpm workspaces
- [ ] Crear estructura `packages/core/`, `packages/mrw-pro/`, `packages/correos-pro/`
- [ ] Configurar `package.json` raíz con workspaces
- [ ] Configurar ESLint + Prettier compartido
- [ ] Configurar `.gitignore`

**Shopify Apps:**
- [ ] `shopify app init` para MRW Pro
- [ ] `shopify app init` para Correos Pro
- [ ] Configurar `shopify.app.toml` para MRW Pro (nombre, scopes, URLs)
- [ ] Configurar `shopify.app.toml` para Correos Pro
- [ ] Verificar que `shopify app dev` funciona en ambas

**Base de datos:**
- [ ] Crear base-schema.prisma en `packages/core/prisma/`
- [ ] Definir modelo `Shop` (id, shop_domain, access_token_encrypted, plan, installed_at)
- [ ] Definir modelo `Shipment` (id, shop_id, order_id, carrier, service, tracking_number, status, label_url, created_at)
- [ ] Definir modelo `Return` (id, shop_id, shipment_id, reason, carrier, status, label_url)
- [ ] Definir modelo `Pickup` (id, shop_id, carrier, date, time_slot, packages_count, status)
- [ ] Definir modelo `BillingPlan` (id, shop_id, plan_name, shopify_charge_id, status)
- [ ] Extender schema Correos Pro: campo `carrier` en Shipment, modelo `RoutingRule`
- [ ] Ejecutar primera migración Prisma
- [ ] Crear seed de datos de prueba

**Servidor base:**
- [ ] Configurar Express server en `packages/core/server/`
- [ ] Implementar `encryption.js` (AES-256 para credenciales API)
- [ ] Implementar middleware de autenticación Shopify (verificar session token)
- [ ] Implementar rate-limiting (`express-rate-limit`)
- [ ] Configurar variables de entorno (.env.example)

✅ **Criterio de éxito Fase 1:** `shopify app dev` funciona en ambas apps, DB creada con migraciones, encryption funcional.

---

### 🔌 FASE 2 — Integración API MRW (Semana 2)
> *Primer envío real con MRW. Requiere credenciales sandbox.*

**⚠️ DEPENDENCIA: Credenciales sandbox MRW recibidas**

**API Client:**
- [ ] Implementar `base-carrier-client.js` (clase abstracta con métodos: createShipment, getLabel, getTracking, cancelShipment)
- [ ] Implementar `mrw-client.js` extends base-carrier-client
- [ ] Probar conexión con sandbox MRW en Postman
- [ ] Implementar `createShipment()` → envío creado en sandbox
- [ ] Implementar `getLabel()` → PDF etiqueta descargable
- [ ] Implementar `getTracking()` → consulta estado vía tracking number
- [ ] Implementar `cancelShipment()` → cancelar envío
- [ ] Implementar manejo de errores MRW (códigos específicos de la API)
- [ ] Escribir tests unitarios para mrw-client

**Webhooks Shopify:**
- [ ] Implementar webhook `orders/create` → crear envío automáticamente
- [ ] Implementar webhook `app/uninstalled` → cleanup datos (RGPD)
- [ ] Verificar webhooks con HMAC SHA-256

**API interna (endpoints):**
- [ ] `POST /api/shipments` — crear envío
- [ ] `GET /api/shipments` — listar envíos
- [ ] `GET /api/shipments/:id` — detalle envío
- [ ] `GET /api/shipments/:id/label` — descargar etiqueta PDF
- [ ] `POST /api/shipments/batch-labels` — descargar etiquetas en lote

✅ **Criterio de éxito Fase 2:** Crear un envío MRW desde la app, obtener tracking number, descargar etiqueta PDF.

---

### 🎨 FASE 3 — UI Core + Onboarding MRW (Semana 3)
> *Componentes reutilizables + flujo onboarding MRW completo*

**Componentes compartidos (packages/core/components/):**
- [ ] `<AppNavbar>` — Top bar horizontal con menú (regla canónica de revisión mockups)
- [ ] `<ActionPageHeader>` — ← flecha + título para páginas de acción/detalle
- [ ] `<CarrierBadge>` — Badge con dot + pill (componente parametrizable por carrier)
- [ ] `<StatusBadge>` — Badge de estado de envío (creado, tránsito, entregado, etc.)
- [ ] `<PageHeader>` — Título + subtítulo + CTA
- [ ] `<DataTable>` — Tabla con filtros, paginación (wrapper Polaris IndexTable)
- [ ] `<FilterBar>` — Barra de filtros (búsqueda, carrier, estado, fecha)
- [ ] `<EmptyState>` — Estado vacío con ilustración y CTAs
- [ ] `<ErrorState>` — Estado de error con reintentar
- [ ] `<LoadingSkeleton>` — Skeleton para carga
- [ ] Configurar theme MRW Pro (`theme.js` con colores Navy + Rojo)
- [ ] Configurar theme Correos Pro (`theme.js` con colores Rojo + Azul)

**Pantallas MRW Pro (onboarding):**
- [ ] Pantalla 01 — Bienvenida (stepper 3 pasos, CTA)
- [ ] Pantalla 02 — Conexión MRW (formulario credenciales, verificación)
- [ ] Pantalla 02b — Modal ayuda credenciales MRW
- [ ] Pantalla 03 — Configuración MRW (servicio por defecto, peso, automatización)
- [ ] Estados globales: Skeleton loading
- [ ] Estados globales: Empty state
- [ ] Estados globales: Error de conexión
- [ ] Estados globales: Warning credenciales

✅ **Criterio de éxito Fase 3:** Flujo onboarding MRW completo (Bienvenida → Conexión → Config → Listo). Todos los componentes base creados.

---

### 📦 FASE 4 — Gestión de Envíos MRW (Semana 4)
> *Pantallas principales de envíos con datos reales de MRW*

**Pantallas MRW Pro:**
- [ ] Pantalla 04 — Lista de envíos (tabla 8 columnas, filtros, paginación)
- [ ] Pantalla 05 — Detalle de envío (header, info, timeline tracking, etiqueta QR)
- [ ] Pantalla 06 — Crear envío manual (formulario completo, selección servicio)
- [ ] Pantalla 07 — Batch print (selección, descargar PDF/ZIP)

**Tracking:**
- [ ] Implementar `tracking-job.js` (cron cada 30 min, consulta tracking API)
- [ ] Actualizar status en DB tras cada polling
- [ ] Timeline de tracking en detalle de envío

**Integración:**
- [ ] Conectar pantalla 04 con `GET /api/shipments`
- [ ] Conectar pantalla 05 con `GET /api/shipments/:id`
- [ ] Conectar pantalla 06 con `POST /api/shipments`
- [ ] Conectar pantalla 07 con `POST /api/shipments/batch-labels`
- [ ] Verificar que el webhook `orders/create` crea envíos que aparecen en pantalla 04

✅ **Criterio de éxito Fase 4:** Crear envío, ver en lista, abrir detalle con tracking real, imprimir etiqueta, batch print funcional.

---

### 🔄 FASE 5 — Devoluciones + Recogidas + Dashboard + Billing MRW (Semana 5)
> *Completar todas las pantallas restantes de MRW Pro*

**Devoluciones:**
- [ ] Pantalla 08 — Lista de devoluciones (tabla con motivo, estado, descarga)
- [ ] Pantalla 09 — Crear devolución (formulario, generar etiqueta retorno)
- [ ] Endpoint `POST /api/returns`
- [ ] Endpoint `GET /api/returns`
- [ ] Endpoint `GET /api/returns/:id/label`

**Recogidas:**
- [ ] Pantalla 10 — Recogidas (calendario, lista próximas, formulario nueva recogida)
- [ ] Endpoint `POST /api/pickups`
- [ ] Endpoint `GET /api/pickups`
- [ ] Endpoint `DELETE /api/pickups/:id`

**Dashboard:**
- [ ] Pantalla 11 — Dashboard (4 KPIs, gráfico barras, incidencias recientes)
- [ ] Endpoint `GET /api/dashboard/stats`
- [ ] Endpoint `GET /api/dashboard/incidents`

**Billing:**
- [ ] Pantalla 12 — Facturación y plan (plan actual, comparar planes, historial)
- [ ] Implementar `billing.js` (Shopify Billing API)
- [ ] Configurar 3 planes: Starter 29€, Pro 49€, Business 99€
- [ ] Endpoints `GET /api/billing`, `POST /api/billing/subscribe`, `POST /api/billing/cancel`

✅ **Criterio de éxito Fase 5:** **MRW Pro MVP COMPLETO** ✅ — Todas las 12 pantallas funcionando con datos reales.

---

### 🧪 FASE 6 — QA MRW + Submit + API Correos (Semana 6)
> *MRW Pro va a review. En paralelo: clientes API Correos*

**QA MRW Pro:**
- [ ] Test E2E: Flujo completo Onboarding → Crear envío → Tracking → Etiqueta → Devolución
- [ ] Test en tienda de desarrollo real con pedidos simulados
- [ ] Verificar todos los estados globales (skeleton, empty, error, warning)
- [ ] Verificar responsive en tablet/desktop
- [ ] Verificar accesibilidad básica (teclado, screen reader)
- [ ] Revisar contra checklist Polaris para App Store
- [ ] Crear listing Shopify App Store (nombre, descripción, screenshots, pricing)
- [ ] Submit MRW Pro a review del App Store

**⚠️ DEPENDENCIA: Credenciales sandbox Correos Standard + Express recibidas**

**API Clients Correos (en paralelo):**
- [ ] Implementar `correos-client.js` extends base-carrier-client (Correos Standard / Pre-Registro API)
- [ ] Probar `createShipment()` Correos Standard en sandbox
- [ ] Probar `getLabel()` Correos Standard
- [ ] Probar `getTracking()` Correos Standard
- [ ] Implementar `correos-express-client.js` extends base-carrier-client
- [ ] Probar `createShipment()` Correos Express en sandbox
- [ ] Probar `getLabel()` Correos Express
- [ ] Probar `getTracking()` Correos Express
- [ ] Tests unitarios para ambos clients

✅ **Criterio de éxito Fase 6:** MRW Pro submitted a App Store. Ambos clientes Correos creando envíos en sandbox.

---

### 🧠 FASE 7 — Motor de Reglas + Pantallas Correos (Semana 7)
> *Lo que hace a Correos Pro ÚNICO: el routing engine*

**Routing Engine:**
- [ ] Implementar `routing-engine.js`
- [ ] Lógica de evaluación de reglas por prioridad (primera que coincida)
- [ ] Condiciones soportadas: peso, importe, provincia, método de envío
- [ ] Regla por defecto (siempre la última, no eliminable)
- [ ] Simulador: dado un set de atributos, devolver qué regla aplica
- [ ] Endpoint `GET /api/routing/rules`
- [ ] Endpoint `POST /api/routing/rules`
- [ ] Endpoint `PUT /api/routing/rules/:id`
- [ ] Endpoint `DELETE /api/routing/rules/:id`
- [ ] Endpoint `POST /api/routing/preview` (simulador)
- [ ] Tests unitarios para routing-engine

**Pantallas Correos Pro (específicas):**
- [ ] Pantalla 02 — Conexión Correos DUAL (2 secciones: Standard + Express)
- [ ] Pantalla 02b — Modal ayuda credenciales Correos (empresas.correos.es + correosexpress.es)
- [ ] Pantalla 03 — Reglas de enrutamiento (tabla reglas + simulador + warnings)

**Adaptar componentes compartidos:**
- [ ] `<CarrierBadge>` funciona con `standard` y `express`
- [ ] `<AppNavbar>` con branding Correos (colores, logo)
- [ ] Onboarding Correos (Pantalla 01) — adaptar branding

✅ **Criterio de éxito Fase 7:** Motor de reglas evaluando correctamente. Pantallas exclusivas Correos funcionando. Simulador dando resultados correctos.

---

### 🔀 FASE 8 — Adaptar Resto Pantallas Correos (Semana 8)
> *Clonar pantallas MRW, añadir la capa dual-carrier*

**Adaptar pantallas con dual-carrier:**
- [ ] Pantalla 04 — Lista envíos + columna Transportista con badges Standard/Express
- [ ] Pantalla 05 — Detalle envío + timeline con colores carrier + badge carrier
- [ ] Pantalla 06 — Crear envío + preview regla aplicada + override manual
- [ ] Pantalla 07 — Batch print + agrupación por carrier (PDFs separados)
- [ ] Pantalla 08 — Lista devoluciones + badge carrier
- [ ] Pantalla 09 — Crear devolución + selector carrier para devolución
- [ ] Pantalla 10 — Recogidas + tabs Standard/Express + dots color calendario
- [ ] Pantalla 11 — Dashboard + breakdown Standard vs Express + distribución servicio
- [ ] Pantalla 12 — Facturación + desglose envíos Standard/Express
- [ ] Estados globales adaptados a branding Correos

**Filtros carrier:**
- [ ] Filtro "Transportista" en lista envíos (Todos / Standard / Express)
- [ ] Filtro "Transportista" en lista devoluciones
- [ ] Tabs carrier en recogidas

✅ **Criterio de éxito Fase 8:** **Correos Pro MVP COMPLETO** ✅ — Todas las pantallas adaptadas, dual-carrier visible en toda la app.

---

### 🧪 FASE 9 — QA Correos + Submit + Beta MRW (Semana 9)
> *Correos Pro a review. MRW Pro en beta con testers reales.*

**QA Correos Pro:**
- [ ] Test E2E: Onboarding → Configurar regla → Crear envío automático → Verificar carrier correcto
- [ ] Test con SOLO Standard conectado → verificar que funciona
- [ ] Test con SOLO Express conectado → verificar que funciona
- [ ] Test con AMBOS conectados → verificar routing engine
- [ ] Verificar simulador con diferentes combinaciones
- [ ] Verificar todos los estados globales
- [ ] Verificar responsive
- [ ] Revisar contra checklist Polaris
- [ ] Crear listing Correos Pro en App Store (nombre, descripción, screenshots, pricing)
- [ ] Submit Correos Pro a review del App Store

**Beta MRW Pro:**
- [ ] Reclutar 3-5 beta testers (tiendas Shopify con contrato MRW)
- [ ] Instalar MRW Pro en tiendas beta
- [ ] Recoger feedback inicial
- [ ] Fix bugs críticos encontrados

✅ **Criterio de éxito Fase 9:** Correos Pro submitted. MRW Pro con beta testers reales.

---

### 🐛 FASE 10-11 — Beta + Fix + Reviews (Semanas 10-11)
> *Ambas apps en beta. Pulir, corregir, documentar.*

**Beta y correcciones:**
- [ ] Reclutar 3-5 beta testers Correos Pro
- [ ] Fix bugs MRW reportados por beta testers
- [ ] Fix bugs Correos Pro reportados por beta testers
- [ ] Optimizar rendimiento (queries N+1, caching)
- [ ] Mejorar mensajes de error (UX)
- [ ] Añadir loading states faltantes

**Documentación usuario:**
- [ ] Crear help center / FAQ para MRW Pro
- [ ] Crear help center / FAQ para Correos Pro
- [ ] Grabar video tutorial MRW Pro (2 min)
- [ ] Grabar video tutorial Correos Pro (2 min)

**App Store optimization:**
- [ ] Solicitar reviews a beta testers satisfechos
- [ ] Optimizar screenshots del listing
- [ ] Optimizar descripción con keywords SEO
- [ ] Responder a review de App Store (si ya hay)

✅ **Criterio de éxito Fases 10-11:** ≥3 reviews positivas por app. Bugs críticos = 0.

---

### 🚀 FASE 12 — Lanzamiento Público (Semana 12)
> *Ambas apps públicas en Shopify App Store*

**Lanzamiento:**
- [ ] Verificar que ambas apps están aprobadas en App Store
- [ ] Abrir acceso público MRW Pro
- [ ] Abrir acceso público Correos Pro
- [ ] Activar billing real (Shopify Billing API en producción)
- [ ] Monitorizar errores (Sentry o equivalente)
- [ ] Configurar alertas de nuevas instalaciones

**Marketing D1:**
- [ ] Post en redes sociales
- [ ] Email a contactos de beta
- [ ] Publicar en comunidades Shopify España
- [ ] Contactar blogs ecommerce españoles

✅ **Criterio de éxito Fase 12:** 2 apps públicas en Shopify App Store. Primeras instalaciones reales. 🚀

---

## 11. 📊 Resumen del Estado Actual de Documentación

| Documento | MRW Pro | Correos Pro | Estado |
|-----------|---------|-------------|--------|
| 01 Business Plan | ✅ .docx | ✅ .docx | Completo |
| 02 PRD Técnico | ✅ .docx | ✅ .docx | Completo |
| 03 UI/UX Specs | ✅ .docx | ✅ .docx | Completo |
| 04 Implementation Roadmap | ✅ .docx | ✅ .docx | Completo |
| 05 Developer Handbook | ✅ .docx | ✅ .docx | Completo |
| Prompts Stitch | ✅ .md | ✅ .md | Completo |
| Prompts Mockups | ✅ .md | N/A | Solo MRW (Correos usó directamente Stitch) |
| Mockups generados | ✅ 18 pantallas | ✅ 17 pantallas | Completo |
| Revisión mockups (dev) | ✅ .docx | ✅ .md | Completo |
| Master Plan unificado | ✅ MASTER_PLAN.md | ← compartido | Completo |

**Total documentos:** 21 archivos + 35 mockups (screen.png + code.html)

> **Estado global: ✅ DOCUMENTACIÓN 100% COMPLETA**
> 
> **Próximo paso: FASE 0** — Crear cuentas, solicitar sandboxes, preparar entorno de desarrollo.
