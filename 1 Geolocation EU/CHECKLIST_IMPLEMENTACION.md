# ✅ GeoMarkets EU — Checklist de Implementación
## Progresión por Semanas | Última actualización: 21/02/2026 23:50

---

## Semana 1 — Setup + Cloudflare Worker

### Día 1-2: Setup proyecto Shopify
- [x] `package.json` — dependencias y scripts
- [x] `shopify.app.toml` — config app, scopes, webhooks, app proxy
- [x] `vite.config.ts` — Vite + Remix config
- [x] `tsconfig.json` — TypeScript config
- [x] `app/root.tsx` — Root layout
- [x] `app/shopify.server.ts` — Auth + session (patrón MRW Pro)
- [x] `app/db.server.ts` — Prisma client singleton
- [x] `prisma/schema.prisma` — 7 modelos: Session, Shop, Market, SelectorConfig, BannerConfig, GeoEvent, DailyStat
- [x] `.env.example` — Variables de entorno documentadas
- [x] `app/routes/app.tsx` — Layout principal con NavMenu
- [x] `app/routes/auth.$.tsx` — Auth entry
- [x] `app/routes/auth.login.tsx` — Auth callback
- [x] `app/routes/webhooks.tsx` — Webhook handlers
- [ ] `npm install` — Instalar dependencias
- [ ] `npx prisma generate` — Generar client
- [ ] `npx prisma db push` — Crear BD
- [ ] Crear app en Shopify Partners (obtener client_id real)
- [ ] `shopify app dev` — Primer run exitoso

### Día 3-4: Cloudflare Worker
- [x] `worker/src/index.ts` — Entry point Worker (/detect, /event, /health)
- [x] `worker/src/bot-filter.ts` — Detección de bots (30+ patterns)
- [x] `worker/src/market-resolver.ts` — Country → Market URL (con primary check)
- [x] `worker/wrangler.toml` — Config Cloudflare con KV
- [ ] Crear cuenta Cloudflare (si no existe)
- [ ] `wrangler deploy` — Deploy Worker
- [ ] Test con IPs de diferentes países
- [ ] Verificar latencia < 100ms

### Día 5: Script <head> + Theme Extension
- [x] `extensions/geo-theme-extension/assets/geo-detect.js` — Script detección (<5KB) con cookie mgmt, banner display, ARIA
- [x] `extensions/geo-theme-extension/shopify.extension.toml` — Country Selector + Floating Widget blocks
- [ ] Verificar CLS = 0 (no layout shift)
- [ ] Lighthouse audit del script

---

## Semana 2 — Markets API + Modelo de Datos

### Servicios
- [x] `app/services/markets-sync.server.ts` — GraphQL Markets sync con upsert + delete detection + currency resolver + Worker config builder
- [x] `app/services/billing.server.ts` — 4 planes (Free/Basic/Pro/Agency) con feature gating + Shopify Billing API

### Modelos
- [x] `app/models/shop.server.ts` — CRUD + settings + onboarding + multi-lang banner defaults
- [x] `app/models/analytics.server.ts` — KPIs, top countries, daily trend, opportunities, latest redirects

### Pendiente
- [ ] Test sync con tienda dev (mínimo 3 mercados)
- [ ] Cache sync en Prisma cada 6h
- [ ] Webhook auto-sync en markets/create|update|delete
- [ ] Migrations en producción
- [ ] Seed data para dev

---

## Semana 3 — Admin UI: 10 Pantallas

### Pantallas completadas (estructura funcional)
- [x] `app/routes/app.onboarding.tsx` — P01: Wizard 3 pasos con trust badges
- [x] `app/routes/app._index.tsx` — P02: Dashboard KPIs + Top Countries + Redirects + Opportunities
- [x] `app/routes/app.settings.tsx` — P03: 3 modos redirect + banner preview + exclusiones
- [x] `app/routes/app.markets.tsx` — P04: IndexTable con sync + stats sidebar
- [x] `app/routes/app.selector.tsx` — P05: Position + content + design + CSS (plan-gated)
- [x] `app/routes/app.analytics.tsx` — P06: Date range + KPIs + trend + table + export CSV + plan-gated
- [x] `app/routes/app.billing.tsx` — P07: 4 plan cards + feature comparison table + Shopify Billing
- [x] `app/routes/app.preview.tsx` — P08: 4 variantes visuales (floating/header/footer/dropdown)
- [x] `app/routes/app.banner-preview.tsx` — P09: 7 idiomas + posición + simulated store page
- [x] `app/routes/app.help.tsx` — P10: 8 FAQs collapsible + service status + contact

### Componentes compartidos
- [x] `app/components/AppNavigation.tsx` — Sidebar consistente (App Bridge NavMenu)
- [x] `app/components/KpiCards.tsx` — 4 KPI cards con icons de Polaris

### Pendiente UI
- [ ] Conectar todas las pantallas con datos reales
- [ ] Charts con @shopify/polaris-viz (Analytics)
- [ ] Loading states (skeletons)
- [ ] Error handling (toasts, banners)
- [ ] Empty states para todas las pantallas
- [ ] Responsive testing

---

## Semana 4 — Theme Extension + Selector

- [ ] App Block: Country Selector (Liquid)
- [ ] App Block: Floating Widget (Liquid)
- [ ] `extensions/geo-theme-extension/assets/country-selector.js` — Interactividad selector
- [ ] `extensions/geo-theme-extension/assets/flags.svg` — Sprite 27 banderas EU
- [ ] `extensions/geo-theme-extension/assets/geo-widget.css` — Estilos selector
- [ ] Cookie handler (respetar elección 30 días)
- [ ] Animaciones + accesibilidad (ARIA)
- [ ] Test en 3 temas populares (Dawn, Craft, Taste)

---

## Semana 5 — Analytics Collector + Polish

- [ ] Worker → API batch (enviar eventos de redirect)
- [ ] Agregación por país/día (DailyStat cron)
- [ ] Rate limiting para prevenir abuse
- [ ] Feature gating funcional (Basic: 3 mercados / Pro: ilimitado)
- [ ] Trial 7 días
- [ ] Upgrade/downgrade flow
- [ ] Exportar CSV funcional

---

## Semana 6 — Internacionalización (i18n) de la App

### Objetivo: Toda la interfaz admin en el idioma del merchant
- [ ] Setup framework i18n (Shopify App Translations / archivos JSON de locale)
- [ ] Extraer TODOS los textos hardcoded de las 10 pantallas a claves i18n
- [ ] `locales/es.json` — Español (base, ya escrito)
- [ ] `locales/en.json` — Inglés (obligatorio para App Store)
- [ ] `locales/fr.json` — Francés
- [ ] `locales/de.json` — Alemán
- [ ] `locales/it.json` — Italiano
- [ ] `locales/pt.json` — Portugués
- [ ] `locales/nl.json` — Holandés
- [ ] Hook `useTranslation()` integrado en todos los componentes
- [ ] Detección automática del idioma del merchant (Shopify locale)
- [ ] Textos del banner de confirmación multi-idioma (ya preparado en BannerConfig)
- [ ] Test: verificar que TODAS las pantallas se ven correctamente en cada idioma

---

## Semana 7 — QA + Polish

- [ ] Loading states (skeletons)
- [ ] Error handling (toasts, banners)
- [ ] Fallbacks si Worker falla
- [ ] Empty states para todas las pantallas
- [ ] Responsive admin UI
- [ ] Unit tests (services, models)
- [ ] Integration tests (API endpoints)

---

## Semana 8 — App Store Listing

- [ ] Screenshots (usar mockups corregidos)
- [ ] Video demo (< 2 min)
- [ ] Descripción EN + ES
- [ ] Privacy policy
- [ ] Submit for Shopify review

---

## Semana 9 — Post-launch

- [ ] Monitorizar Worker (Cloudflare dashboard)
- [ ] Monitorizar App Store metrics
- [ ] Bug fixes, primeras reviews
- [ ] Cross-sell en MRW Pro / Correos Pro
- [ ] Blog SEO en enviox.es/blog

---

## 📊 Progreso Global

| Componente | Archivos | Estado |
|------------|----------|--------|
| Config (package.json, toml, vite, ts, env) | 5 | ✅ Completo |
| Core App (root, shopify, db, auth, webhooks) | 5 | ✅ Completo |
| Prisma Schema (7 modelos) | 1 | ✅ Completo |
| Services (markets-sync, billing) | 2 | ✅ Completo |
| Models (shop, analytics) | 2 | ✅ Completo |
| Components (nav, kpis) | 2 | ✅ Completo |
| Routes (10 pantallas + layout) | 11 | ✅ Completo |
| Worker (index, bot, resolver, config) | 4 | ✅ Completo |
| Theme Extension (script, toml) | 2 | ✅ Base |
| **Total archivos creados** | **34** | **Estructura completa** |

### Próximo paso: `npm install` + `npx prisma generate` + `shopify app dev`

---

*Actualizar este archivo al final de cada sesión de trabajo.*
