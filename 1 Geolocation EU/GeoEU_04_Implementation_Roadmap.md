# GEOMARKETS EU
## Implementation Roadmap
### Documento 4 de 5 — Febrero 2026

---

## 1. Visión General

### Duración total estimada: 6-8 semanas

Reutilizando infraestructura Shopify compartida (auth, billing, Polaris patterns) de MRW Pro / Correos Pro.

### Prerrequisitos

- MRW Pro / Correos Pro desarrollados (reutilizar patrones)
- Cuenta Cloudflare (plan gratis para Workers + KV)
- Shopify Partners + tienda dev con Markets (mínimo 3 mercados)
- MaxMind GeoLite2 licencia gratuita

---

## 2. Backlog Detallado

### Semana 1 — Setup + Cloudflare Worker (~16h)

```
Día 1-2: Setup proyecto Shopify
├── shopify app create remix
├── Prisma + PostgreSQL
├── Copiar patterns auth/billing de MRW Pro
└── CI/CD básico (Fly.io)

Día 3-4: Cloudflare Worker
├── Crear Worker + subir MaxMind GeoLite2 a KV
├── IP → país → JSON response
├── Bot detection (User-Agent)
└── Tests con diferentes IPs

Día 5: Script <head> (<5KB)
├── Consultar Worker → redirect si necesario
├── Cookie override check
├── Minificar + test CLS = 0
```

**Entregable:** Worker detectando IPs, redirect sin parpadeo

---

### Semana 2 — Markets API + Modelo de Datos (~14h)

```
Día 1-2: Integración Markets API
├── Query GraphQL mercados
├── Mapper: país → mercado → URL
├── Cache en Prisma + sync cada 6h

Día 3: Schema Prisma
├── Shop, Settings, GeoAnalytics
├── Migrations + seed data

Día 4-5: Admin API endpoints
├── CRUD settings, markets, analytics
└── Middleware auth (Shopify session)
```

**Entregable:** Markets sincronizados, Worker con mercados reales

---

### Semana 3 — Admin UI Pantallas 01-05 (~18h)

```
Día 1: Pantalla 01 — Onboarding (wizard 3 pasos)
Día 2: Pantalla 02 — Dashboard (KPIs + charts)
Día 3: Pantalla 03 — Config Redirección (auto/banner/manual)
Día 4: Pantalla 04 — Sync Markets (tabla mercados)
Día 5: Pantalla 05 — Personalización Selector (colores, posición)
```

**Entregable:** Panel admin navegable con datos reales

---

### Semana 4 — Theme Extension + Selector (~16h)

```
Día 1-2: Theme App Extension
├── App Block: Country Selector + Floating Widget
├── Liquid templates + settings schema
├── Banderas SVG sprite (27 países EU)

Día 3: CSS + JS del selector
├── Responsive, dropdown, cookie handler
├── Animaciones, accesibilidad

Día 4: Banner de redirección
├── Multi-idioma, botones Sí/No, dismiss

Día 5: Integration testing storefront
├── 5 mercados, mobile, Lighthouse audit
```

**Entregable:** Selector funcional + banner, todo responsive

---

### Semana 5 — Analytics + Pantallas restantes (~14h)

```
Día 1-2: Analytics collector (Worker → API batch)
Día 3: Pantalla 06 — Analytics (charts, tabla por país)
Día 4: Pantalla 07 — Billing (3 plans, Shopify Billing API)
Día 5: Pantallas 08-10 (previews, FAQ, empty states)
```

**Entregable:** App completa, todas las pantallas

---

### Semana 6 — Billing + Polish (~12h)

```
Día 1-2: Shopify Billing API (subs, trial 7d, feature gating)
Día 3: Feature gating (Basic: 3 mercados / Pro: ilimitado)
Día 4-5: Polish (loading states, error handling, fallbacks)
```

**Entregable:** Monetización activa, app pulida

---

### Semana 7 — QA + App Store Listing (~14h)

```
Día 1-2: Testing (unit, integration, E2E, edge cases, Lighthouse)
Día 3: App Store listing (screenshots, video, description, privacy policy)
Día 4-5: Submit for review + iterate feedback
```

**Entregable:** App publicada en Shopify App Store

---

### Semana 8 (buffer) — Post-launch (~10h)

```
├── Monitorizar Worker + App Store metrics
├── Bug fixes, primeras reviews
├── Activar cross-sell en MRW/Correos Pro
├── Blog SEO + Reddit + contactar agencias
```

---

## 3. Hitos

| Hito | Semana | Criterio de éxito |
|------|--------|-------------------|
| **M1: Edge Detection** | S1 | Worker detecta IPs, redirect sin parpadeo |
| **M2: Markets Sync** | S2 | Mercados sincronizados, datos persistidos |
| **M3: Admin UI** | S3 | 5 pantallas funcionales |
| **M4: Storefront** | S4 | Selector + banner en tienda |
| **M5: Analytics + Full UI** | S5 | Dashboard con tráfico real |
| **M6: Monetización** | S6 | Billing activo |
| **M7: Launch** | S7 | App publicada |

---

## 4. Dependencias

| Dependencia | Tipo | Detalle |
|-------------|------|---------|
| MRW Pro / Correos Pro | Código | Auth, Billing, Polaris patterns |
| Cloudflare | Infra | Workers + KV (gratis) |
| MaxMind | Datos | GeoLite2 DB (gratis) |
| Landing enviox.es | Marketing | Página producto GeoMarkets |
| Cross-sell | Marketing | Banner en apps logística |

---

*Documento 4 de 5 — Implementation Roadmap*
*GeoMarkets EU — Febrero 2026*
