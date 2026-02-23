# Enviox Project — Notas Persistentes

## ⚠️ SERVIDOR EXCLUSIVO ENVIOX — 49.13.132.241
- **IP**: `49.13.132.241`
- **SSH**: `root@49.13.132.241`
- **USO**: TODOS los proyectos Enviox/Shopify (carriers, módulos, apps, landing)
- **SSL**: Let's Encrypt (Certbot)
- **Nginx**: `/etc/nginx/sites-available/` + symlinks en `/etc/nginx/sites-enabled/`
- **PM2**: Process manager para todas las apps Node.js

> ⛔ **NUNCA desplegar proyectos Enviox en 46.225.55.22**. Ese VPS es compartido (BitRenta, RV360, Reservame...).
> Todos los proyectos de esta carpeta raíz van en **49.13.132.241**.

---

## Todos los proyectos Enviox (VPS 49.13.132.241)

### ✅ Desplegados y activos

| Subdominio | Puerto | App | PM2 Name | Directorio VPS | Estado |
|------------|--------|-----|----------|----------------|--------|
| `mrw.enviox.es` | 3000 | MRW Pro | `mrw-pro` | `/var/www/mrw-pro/` | ✅ Live |
| `correos.enviox.es` | 3001 | Correos Pro | `correos-pro` | `/var/www/correos-pro/` | ✅ Live |
| `correos-express.enviox.es` | 3003 | Correos Express Pro | `correos-express-pro` | `/var/www/correos-express-pro/` | ✅ Live |
| `dhl.enviox.es` | 3004 | DHL Pro | `dhl-pro` | `/var/www/dhl-pro/` | ✅ Live |
| `enviox.es` | — | Landing Page | — | `/var/www/enviox.es/` | ✅ Static |

### 📋 Pendientes de desarrollo/deploy (TAMBIÉN van en 49.13.132.241)

| Subdominio previsto | Puerto | App | Carpeta local | Estado |
|---------------------|--------|-----|---------------|--------|
| `geomarkets.enviox.es` | 3005 | GeoMarkets EU | `1 Geolocation EU/geomarkets-eu/` | 🔨 Código existe, pendiente deploy |
| `re.enviox.es` | 3006 | Shopify RE (Recargo Equivalencia) | `7 Shopify RE/` | 📋 En diseño |
| `preorders.enviox.es` | 3007 | Smart Preorders | `2 Smart Preorders/` | 📋 En diseño |
| `bundler.enviox.es` | 3008 | ShopifyBundler Pro | `4 ShopifyBundler Pro/` | 📋 En diseño |
| `correos-prestashop.enviox.es` | 3009 | Correos PrestaShop | `6 Correos PrestaShop/` | 📋 En diseño |
| `woo-re.enviox.es` | 3010 | WooCommerce RE | `5 WooCommerce RE/` | 📋 En diseño |
| `shipping.enviox.es` | 3011 | Enviox Shipping (Pack) | `Enviox Shipping/` | 📋 Business Plan |

---

## 🚨 LECCIONES CRÍTICAS DE DEPLOY (22-23 Feb 2026)

### 1. ESM + PM2 + dotenv = server.mjs obligatorio
Las apps Shopify Remix usan ESM (`"type": "module"`). PM2 no pasa env vars a ESM.

**Solución**: `server.mjs` custom:
```javascript
import { config } from 'dotenv';
config();
import express from 'express';
import { createRequestHandler } from '@remix-run/express';
const app = express();
const port = process.env.PORT || 3000;
app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
app.use(express.static('build/client', { maxAge: '1h' }));
const build = await import('./build/server/index.js');
app.all('*', createRequestHandler({ build }));
app.listen(port, '0.0.0.0', () => console.log('App on port ' + port));
```

### 2. Procesos zombie y EADDRINUSE
```bash
pm2 kill && fuser -k <port>/tcp && sleep 2
pm2 start server.mjs --name <app-name> && pm2 save
```

### 3. Windows → Linux: \r\n
```bash
sed -i 's/\r$//' /var/www/<app>/.env
sed -i 's/\r$//' /etc/nginx/sites-available/<config>
```

### 4. NUNCA mezclar servidores
- **49.13.132.241** = Enviox (TODOS los proyectos de esta carpeta)
- **46.225.55.22** = BitRenta, RV360, GeoMarkets (legacy), WAHA
- **78.46.213.244** = Reservame

---

## Proceso de Deploy

### En local (Windows):
```powershell
cd "<App>\<app-dir>"
npx prisma generate
npx remix vite:build
scp -r build package.json package-lock.json server.mjs prisma root@49.13.132.241:/var/www/<app>/
scp .env.production root@49.13.132.241:/var/www/<app>/.env
```

### En server (SSH 49.13.132.241):
```bash
cd /var/www/<app>
sed -i 's/\r$//' .env
npm install --omit=dev
npx prisma generate && npx prisma db push
pm2 start server.mjs --name <app-name> && pm2 save
```

---

## Shopify Partners (org: Bitrenta)

| App | client_id | application_url | Estado |
|-----|-----------|-----------------|--------|
| **MRW Pro** | `API_KEY_REDACTED` | `https://mrw.enviox.es` | ✅ |
| **Correos Pro** | `4ccacd3f5f82dcc84f516e943b0225fc` | `https://correos.enviox.es` | ✅ |
| **Correos Express Pro** | `e3a83ddf0c37ce373a1080044d3bb1fc` | `https://correos-express.enviox.es` | ✅ |
| **DHL Pro** | `5ea11a5ed457c69407593ca4acbafb51` | `https://dhl.enviox.es` | ✅ |
| **GeoMarkets EU** | (ver shopify.app.toml) | `https://geomarkets.enviox.es` | ✅ |

---

## Carrier API Integration

| Carrier | Auth | Endpoints |
|---------|------|-----------|
| **MRW** | AbonMRW + Franquicia + User/Pass (SOAP) | localhost SOAP proxy |
| **Correos** | User/Pass (REST) | Correos Standard API |
| **Correos Express** | User/Pwd (REST) | Correos Express API |
| **DHL Express** | Basic Auth (siteId:password) + DHL-API-Key | `express.api.dhl.com/mydhlapi` + `api-eu.dhl.com/track/shipments` |

---

## GitHub
- **Repo**: `https://github.com/pequesysoletes-ctrl/enviox`
- **Deploy key**: `enviox-vps-deploy` (ed25519, write access)

---

## Estrategia de Producto

### Apps individuales — 9,99€/mes cada una:
- MRW Pro, Correos Pro, Correos Express Pro, DHL Pro
- GeoMarkets EU, Shopify RE, Smart Preorders, BundlerPro

### Pack premium:
- **Enviox Shipping** — 19,99€/mes (4 carriers + smart routing + dashboard unificado)

---

## Estructura del monorepo local

```
c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\
├── MRW Pro\mrw-pro-app\                 # ✅ 49.13.132.241:3000
├── Correos Pro\correos-pro-app\         # ✅ 49.13.132.241:3001
├── Correos Express\correos-express-app\ # ✅ 49.13.132.241:3003
├── DHL Pro\dhl-pro-app\                 # ✅ 49.13.132.241:3004
├── 1 Geolocation EU\geomarkets-eu\      # 🔨 → 49.13.132.241:3005
├── 2 Smart Preorders\                   # 📋 → 49.13.132.241:3007
├── 4 ShopifyBundler Pro\                # 📋 → 49.13.132.241:3008
├── 5 WooCommerce RE\                    # 📋 → 49.13.132.241:3010
├── 6 Correos PrestaShop\                # 📋 → 49.13.132.241:3009
├── 7 Shopify RE\                        # 📋 → 49.13.132.241:3006
├── Enviox Shipping\                     # 📋 → 49.13.132.241:3011
├── Landing Page enviox.es\              # ✅ Static en /var/www/enviox.es/
├── CLAUDE.md                            # ← ESTE ARCHIVO
└── ENVIOX_MASTER_PLAN.md                # Plan maestro
```

---

## Otros VPS (NO para Enviox)
- **46.225.55.22**: BitRenta, RV360, WAHA — NO TOCAR desde aquí
- **78.46.213.244**: Reservame
