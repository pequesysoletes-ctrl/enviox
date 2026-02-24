# GEOMARKETS EU
## PRD Técnico — Requisitos de Producto
### Documento 2 de 5 — Febrero 2026

---

## 1. Objetivo Técnico

Desarrollar una aplicación Shopify que detecte la ubicación geográfica del visitante por IP y lo redirija al mercado correcto de Shopify Markets, con latencia inferior a 100ms, usando Edge Computing (Cloudflare Workers). Sin parpadeo visual ni impacto en Core Web Vitals.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Framework** | Remix (Shopify App Template) | Estándar Shopify, reutiliza patterns Enviox |
| **Base de datos** | PostgreSQL + Prisma ORM | Consistente con stack Enviox |
| **Edge Detection** | Cloudflare Workers | Latencia <50ms, no depende del server |
| **GeoIP Database** | MaxMind GeoLite2 (vía KV storage) | Gratis, actualiza semanal, precisión >99% |
| **Admin UI** | Shopify Polaris | Nativo de Shopify, UX consistente |
| **Theme Extension** | App Block (Shopify 2.0) | Editable desde editor de temas |
| **Frontend inject** | Liquid + JS (<5KB) | Script ligero en `<head>` |
| **Deployment** | Fly.io / Railway | Igual que otros productos Enviox |
| **Cache** | Cloudflare KV | País → mercado mapping, TTL 24h |

---

## 3. Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    VISITANTE (Browser)                    │
│                                                          │
│  1. Primera visita → <head> script consulta Worker       │
│  2. Worker detecta IP → país → mercado correcto          │
│  3. Si país ≠ mercado actual → redirect 302              │
│  4. Si país = mercado actual → no hace nada              │
│  5. Si usuario cambió manualmente → cookie override      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              CLOUDFLARE WORKER (Edge)                     │
│                                                          │
│  - Lee IP del request (CF-Connecting-IP)                  │
│  - Consulta MaxMind DB en KV Storage                     │
│  - Devuelve { country: "FR", market: "/fr", lang: "fr" } │
│  - NO almacena la IP (RGPD compliant)                    │
│  - Excluye bots de Google (User-Agent check)             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              APP BACKEND (Remix on Fly.io)                │
│                                                          │
│  - Admin panel (Polaris UI)                               │
│  - Shopify Markets API integration                        │
│  - Settings CRUD (shop preferences)                       │
│  - Analytics collector (country, redirects, conversions)  │
│  - Billing API (subscription management)                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              THEME EXTENSION (App Block)                  │
│                                                          │
│  - Selector País/Idioma/Moneda                            │
│  - Posición configurable (flotante/header/footer)         │
│  - Banderas SVG optimizadas                               │
│  - CSS customizable desde editor de temas                 │
│  - Responsive (mobile-first)                              │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Requisitos Funcionales (MVP)

### RF1: Integración con Shopify Markets API

- Leer automáticamente los mercados configurados via GraphQL Admin API:
  ```graphql
  query {
    markets(first: 20) {
      edges {
        node {
          id
          name
          enabled
          primary
          regions { edges { node { name, code } } }
          webPresences { edges { node { 
            rootUrls { locale, url }
            defaultLocale
          } } }
        }
      }
    }
  }
  ```
- Sincronizar cada 6 horas o cuando el merchant cambia Markets
- Mapear: país → mercado → URL de redirección

### RF2: Motor de Redirección en el Edge

**Reglas críticas:**
1. **NUNCA usar `useEffect`** en el frontend para redirigir (causa parpadeo/CLS)
2. Implementar script inline en `<head>` que consulta el Worker
3. El Worker responde en <50ms con `{ redirect: "/fr", lang: "fr-FR" }` o `{ redirect: null }`
4. Si `redirect !== null` → `window.location.replace(redirect)` inmediato
5. Si cookie `geo_override` existe → NO redirigir
6. Si `referrer` es buscador → NO redirigir (SEO)

**Pseudocódigo del script `<head>`:**
```javascript
// <5KB, inline, blocking
(function() {
  if (document.cookie.includes('geo_override')) return;
  var x = new XMLHttpRequest();
  x.open('GET', 'https://geo.geomarkets.workers.dev/detect?shop=' + SHOP_DOMAIN, false); // síncrono
  x.send();
  if (x.status === 200) {
    var r = JSON.parse(x.responseText);
    if (r.redirect && r.redirect !== window.location.pathname) {
      window.location.replace(r.redirect);
    }
  }
})();
```

### RF3: Selector País/Idioma (App Block)

- Bloque de app Shopify 2.0 (Theme App Extension)
- Editable desde el editor de temas (colores, posición, tipografía)
- Opciones de posición: flotante esquina inferior, integrado en header, footer
- Muestra: 🇪🇸 España (EUR) ▼
- Al cambiar: setea cookie `geo_override` y redirige al mercado seleccionado
- Banderas SVG inline (no imágenes externas)
- Mobile: drawer/modal con lista de países

### RF4: Exclusión de Bots SEO

**NO redirigir nunca a:**
- Googlebot, Bingbot, Baiduspider, YandexBot
- Cualquier User-Agent que contenga "bot", "crawler", "spider"
- Esto es **CRÍTICO** — redirigir crawlers causa penalizaciones SEO masivas

**Implementación:**
```javascript
// En el Cloudflare Worker
const BOT_UA = /bot|crawl|spider|slurp|archive|facebook|twitter|linkedin/i;
if (BOT_UA.test(request.headers.get('User-Agent'))) {
  return new Response(JSON.stringify({ redirect: null, reason: 'bot' }));
}
```

### RF5: Respeto de Elección del Usuario

- Si un usuario español visita la versión francesa y cambia manualmente a `/es/`:
  - Setear cookie: `geo_override=es; max-age=2592000; path=/` (30 días)
  - El Worker ve la cookie y NO redirige
  - El selector muestra el país elegido, no el detectado

### RF6: Banner de Confirmación (opcional)

- Configurable por el merchant: "¿Mostrar banner antes de redirigir?"
- Si activo: en vez de redirect automático, mostrar banner:
  - *"Parece que estás en Francia. ¿Quieres ver la tienda en francés?"*
  - Botones: "Sí, cambiar" / "No, quedarme aquí"
- Obligatorio en algunos mercados EU por regulación

### RF7: Dashboard de Analytics

- Visitantes por país (top 10)
- Redirecciones realizadas por día/semana/mes
- Países sin mercado configurado (oportunidad)
- Tasa de bounce pre/post redirect
- Conversión por mercado

---

## 5. Modelo de Datos (Prisma)

```prisma
model Shop {
  id              String    @id @default(cuid())
  myshopifyDomain String    @unique
  accessToken     String
  plan            String    @default("basic")
  
  // Settings
  redirectMode    String    @default("auto")    // auto, banner, manual
  excludeUrls     String[]  @default([])
  showBanner      Boolean   @default(false)
  bannerPosition  String    @default("top")
  
  // Design
  selectorStyle   String    @default("floating") // floating, header, footer
  selectorColors  Json?     // { bg, text, border, hover }
  showFlags       Boolean   @default(true)
  
  // Markets cache
  marketsData     Json?     // cached Markets API response
  marketsUpdatedAt DateTime?
  
  // Billing
  billingPlan     String    @default("free")
  billingId       String?
  trialEndsAt     DateTime?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  analytics       GeoAnalytics[]
}

model GeoAnalytics {
  id          String   @id @default(cuid())
  shopId      String
  shop        Shop     @relation(fields: [shopId], references: [id])
  
  date        DateTime @default(now())
  country     String   // ISO 3166-1 alpha-2
  action      String   // "redirect", "banner_shown", "banner_accept", "banner_dismiss", "selector_change"
  fromMarket  String?  // market user was on
  toMarket    String?  // market redirected to
  
  @@index([shopId, date])
  @@index([shopId, country])
}
```

---

## 6. Seguridad y RGPD

### Anonimización de IP

**Principio: NUNCA almacenamos la IP del visitante.**

1. La IP entra al Cloudflare Worker
2. Se consulta MaxMind → se obtiene código de país (ej: "FR")
3. La IP se descarta inmediatamente
4. Solo almacenamos el código de país en analytics (dato no personal)
5. Cumple RGPD Art. 25 (Privacy by Design)

### Cookie consent

- La cookie `geo_override` es una **cookie funcional** (no de tracking)
- No requiere consentimiento explícito bajo ePrivacy Directive
- El selector de país actúa como consentimiento implícito
- Documentar en la Privacy Policy del merchant

### Datos almacenados

| Dato | Personal? | Retención | Justificación |
|------|:---------:|-----------|---------------|
| País del visitante | ❌ No | 90 días | Analytics agregado |
| Acción (redirect/banner) | ❌ No | 90 días | Analytics |
| Shop domain | ❌ No | Mientras instalado | Necesario para funcionar |
| Access token | ⚠️ Sensible | Mientras instalado | Shopify OAuth |

---

## 7. Performance Targets

| Métrica | Target | Cómo |
|---------|--------|------|
| **Latencia detección** | <100ms (P95) | Cloudflare Worker en Edge |
| **Tamaño script** | <5KB gzipped | Inline JS, sin frameworks |
| **CLS impact** | 0 | Redirect antes de render, no useEffect |
| **LCP impact** | <50ms | Script síncrono antes de body parse |
| **Worker cold start** | <10ms | Cloudflare Workers = no cold start |
| **Uptime** | 99.95% | Cloudflare SLA |
| **DB de GeoIP** | Actualización semanal | MaxMind GeoLite2 auto-update |

---

## 8. Shopify Extensions Config

### shopify.extension.toml (Theme App Extension)

```toml
name = "GeoMarkets Selector"
type = "theme"

[[extensions.blocks]]
name = "Country Selector"
target = "section"
template = "blocks/country-selector.liquid"

[[extensions.blocks]]
name = "Floating Geo Widget"
target = "body"
template = "blocks/floating-widget.liquid"
```

### Assets a incluir

| Asset | Tamaño | Función |
|-------|--------|---------|
| `geo-detect.js` | <5KB | Script de detección en `<head>` |
| `country-selector.js` | <8KB | Interactividad del selector |
| `flags.svg` | <15KB | Sprite SVG con 27 banderas EU |
| `geo-widget.css` | <3KB | Estilos del selector flotante |

---

*Documento 2 de 5 — PRD Técnico*
*GeoMarkets EU — Febrero 2026*
