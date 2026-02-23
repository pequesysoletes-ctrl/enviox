# GEOMARKETS EU
## Developer Handbook
### Documento 5 de 5 — Febrero 2026

---

## 1. Setup del Entorno

### 1.1 Prerrequisitos

```bash
node --version  # v20.x.x (LTS)
npm install -g @shopify/cli

# PostgreSQL (Docker)
docker run --name geomarkets-db -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:15

# Cloudflare CLI (Wrangler)
npm install -g wrangler
wrangler login
```

### 1.2 Crear el proyecto

```bash
shopify app init --template=remix
cd geomarkets-eu
npm install
npx prisma generate && npx prisma db push
shopify app dev
```

### 1.3 Estructura del proyecto

```
geomarkets-eu/
├── app/
│   ├── routes/
│   │   ├── app._index.tsx           → Dashboard (Pantalla 02)
│   │   ├── app.onboarding.tsx       → Welcome (Pantalla 01)
│   │   ├── app.settings.tsx         → Config redirección (Pantalla 03)
│   │   ├── app.markets.tsx          → Sync Markets (Pantalla 04)
│   │   ├── app.selector.tsx         → Personalización selector (Pantalla 05)
│   │   ├── app.analytics.tsx        → Analytics tráfico (Pantalla 06)
│   │   ├── app.billing.tsx          → Plans (Pantalla 07)
│   │   ├── app.preview.tsx          → Preview selector (Pantalla 08)
│   │   ├── app.banner-preview.tsx   → Preview banner (Pantalla 09)
│   │   └── app.help.tsx             → FAQ (Pantalla 10)
│   ├── models/
│   │   ├── shop.server.ts           → Shop CRUD + settings
│   │   ├── markets.server.ts        → Markets sync operations
│   │   └── analytics.server.ts      → GeoAnalytics queries
│   ├── services/
│   │   ├── markets-sync.ts          → Shopify Markets GraphQL
│   │   ├── geo-config.ts            → Country → Market mapping
│   │   └── billing.server.ts        → Shopify Billing API
│   ├── components/
│   │   ├── GeoMap.tsx               → Mapa visual de tráfico
│   │   ├── MarketTable.tsx          → Tabla de mercados
│   │   ├── CountryStats.tsx         → Stats por país
│   │   ├── SelectorPreview.tsx      → Preview del widget
│   │   └── KpiCards.tsx             → Dashboard KPIs
│   └── shopify.server.ts
├── extensions/
│   └── geo-theme-extension/
│       ├── assets/
│       │   ├── geo-detect.js        → Script detección (<5KB)
│       │   ├── country-selector.js  → Interactividad selector
│       │   ├── flags.svg            → Sprite 27 banderas EU
│       │   └── geo-widget.css       → Estilos selector
│       ├── blocks/
│       │   ├── country-selector.liquid
│       │   └── floating-widget.liquid
│       └── shopify.extension.toml
├── worker/
│   ├── src/
│   │   ├── index.ts                 → Cloudflare Worker entry
│   │   ├── geo-detect.ts            → IP → country logic
│   │   ├── bot-filter.ts            → Bot User-Agent filter
│   │   └── market-resolver.ts       → Country → market URL
│   ├── wrangler.toml                → Worker config
│   └── maxmind/
│       └── update-db.sh             → Script actualización GeoLite2
├── prisma/
│   └── schema.prisma
├── shopify.app.toml
└── .env
```

---

## 2. Cloudflare Worker — Referencia

### Worker principal

```typescript
// worker/src/index.ts
import { detectCountry } from './geo-detect';
import { isBotUA } from './bot-filter';
import { resolveMarket } from './market-resolver';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname !== '/detect') {
      return new Response('Not found', { status: 404 });
    }
    
    const shop = url.searchParams.get('shop');
    if (!shop) {
      return jsonResponse({ error: 'Missing shop parameter' }, 400);
    }
    
    // 1. Check for bots — never redirect
    const ua = request.headers.get('User-Agent') || '';
    if (isBotUA(ua)) {
      return jsonResponse({ redirect: null, reason: 'bot' });
    }
    
    // 2. Detect country from IP
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const country = await detectCountry(ip, env.MAXMIND_KV);
    
    if (!country) {
      return jsonResponse({ redirect: null, reason: 'unknown_country' });
    }
    
    // 3. Resolve market for this country + shop
    const shopConfig = await env.SHOP_CONFIG_KV.get(shop, 'json');
    if (!shopConfig) {
      return jsonResponse({ redirect: null, reason: 'shop_not_configured' });
    }
    
    const market = resolveMarket(country, shopConfig.markets);
    
    return jsonResponse({
      country,
      redirect: market?.url || null,
      lang: market?.locale || null,
      market: market?.name || null,
    });
  }
};

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300', // 5 min cache
    },
  });
}
```

### Bot filter

```typescript
// worker/src/bot-filter.ts
const BOT_PATTERNS = /bot|crawl|spider|slurp|archive|facebook|twitter|linkedin|whatsapp|telegram|preview|fetch|curl|wget/i;

export function isBotUA(userAgent: string): boolean {
  return BOT_PATTERNS.test(userAgent);
}
```

### Market resolver

```typescript
// worker/src/market-resolver.ts
interface MarketConfig {
  name: string;
  countries: string[]; // ISO alpha-2
  url: string;         // "/fr/", "fr.myshop.com", etc.
  locale: string;      // "fr-FR"
}

export function resolveMarket(
  country: string, 
  markets: MarketConfig[]
): MarketConfig | null {
  return markets.find(m => m.countries.includes(country)) || null;
}
```

---

## 3. Markets Sync — GraphQL

```typescript
// app/services/markets-sync.ts
import { authenticate } from "../shopify.server";

const MARKETS_QUERY = `
  query GetMarkets {
    markets(first: 50) {
      edges {
        node {
          id
          name
          enabled
          primary
          regions(first: 50) {
            edges {
              node {
                ... on MarketRegionCountry {
                  code
                  name
                }
              }
            }
          }
          webPresences(first: 5) {
            edges {
              node {
                rootUrls { locale url }
                defaultLocale
              }
            }
          }
        }
      }
    }
  }
`;

export async function syncMarkets(admin: any) {
  const response = await admin.graphql(MARKETS_QUERY);
  const { data } = await response.json();
  
  return data.markets.edges.map(({ node }: any) => ({
    id: node.id,
    name: node.name,
    enabled: node.enabled,
    primary: node.primary,
    countries: node.regions.edges.map((r: any) => r.node.code),
    urls: node.webPresences.edges.flatMap((wp: any) => 
      wp.node.rootUrls.map((ru: any) => ({
        locale: ru.locale,
        url: ru.url,
      }))
    ),
    defaultLocale: node.webPresences.edges[0]?.node.defaultLocale,
  }));
}
```

---

## 4. Script de Detección (Storefront)

```javascript
// extensions/geo-theme-extension/assets/geo-detect.js
// <5KB minificado, inyectado en <head>
(function() {
  'use strict';
  
  // Skip if user already chose a country
  if (document.cookie.indexOf('geo_override') !== -1) return;
  
  // Skip if already on correct market (check meta tag)
  var currentMarket = document.querySelector('meta[name="geo-current-market"]');
  if (!currentMarket) return;
  
  var shop = currentMarket.getAttribute('data-shop');
  var currentPath = currentMarket.getAttribute('data-market-path');
  
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://geo.geomarkets.workers.dev/detect?shop=' + encodeURIComponent(shop), true);
    xhr.timeout = 2000; // 2s max, no blocking forever
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        if (data.redirect && data.redirect !== currentPath) {
          window.location.replace(data.redirect + window.location.search);
        }
      }
    };
    xhr.onerror = function() { /* fail silently */ };
    xhr.ontimeout = function() { /* fail silently */ };
    xhr.send();
  } catch(e) { /* fail silently — never break the store */ }
})();
```

---

## 5. Variables de Entorno

```env
# .env (desarrollo)
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_themes,write_themes,read_locales,read_markets

DATABASE_URL=postgresql://postgres:dev@localhost:5432/geomarkets
SESSION_STORAGE=postgresql

# Cloudflare Worker
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_token
WORKER_URL=https://geo.geomarkets.workers.dev

# MaxMind
MAXMIND_LICENSE_KEY=your_maxmind_key

# Producción
NODE_ENV=production
HOST=https://geomarkets.enviox.es
```

---

## 6. Wrangler Config (Worker)

```toml
# worker/wrangler.toml
name = "geomarkets-detect"
compatibility_date = "2024-01-01"
main = "src/index.ts"

[[kv_namespaces]]
binding = "MAXMIND_KV"
id = "xxxxx"

[[kv_namespaces]]
binding = "SHOP_CONFIG_KV"
id = "yyyyy"

[vars]
ENVIRONMENT = "production"
```

---

## 7. FAQ Técnico

### ¿Puedo usar `cf.country` de Cloudflare en vez de MaxMind?
Sí, es más simple. `request.cf.country` da el país ISO directamente. MaxMind es backup + más preciso (ciudad, región). Para MVP, `cf.country` es suficiente.

### ¿El script síncrono bloquea el render?
Con la versión async (XMLHttpRequest async + timeout 2s), no. Si el Worker no responde en 2s, la tienda carga normal sin redirect.

### ¿Cómo actualizo la DB de MaxMind?
Cron job semanal que descarga GeoLite2-Country.mmdb y lo sube a KV. MaxMind actualiza cada martes.

### ¿Funciona con Shopify CDN / caching?
Sí. El script consulta nuestro Worker (externo) → la página de Shopify puede estar cacheada sin problema.

### ¿Qué pasa si el Worker se cae?
El script tiene `onerror` y `ontimeout` → fail silently. La tienda funciona normal sin redirect. Nunca rompemos la tienda del merchant.

---

*Documento 5 de 5 — Developer Handbook*
*GeoMarkets EU — Febrero 2026*
