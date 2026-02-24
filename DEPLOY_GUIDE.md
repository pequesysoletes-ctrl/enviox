# Enviox — Guía de Deploy y Arquitectura del VPS

> **VPS**: 46.225.55.22 (Hetzner) — compartido con BitRenta, RV360, WAHA
> **Dominio**: enviox.es
> **Última actualización**: 23 Feb 2026

---

## 📂 Estructura del VPS

```
/var/www/
├── mrw-pro/                # MRW Pro Shopify App ✅ LIVE
│   ├── build/
│   │   ├── client/         # Assets estáticos (JS, CSS)
│   │   └── server/
│   │       └── index.js    # Bundle Remix (NO es un HTTP server)
│   ├── node_modules/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db          # SQLite DB
│   ├── .env                # Variables de entorno (Unix line endings!)
│   ├── server.mjs          # ⭐ Entry point custom (dotenv + express)
│   └── package.json
├── geomarkets-eu/          # GeoMarkets EU ⚠️ Necesita server.mjs
├── correos-pro/            # ⬜ Pendiente
├── dhl-pro/                # ⬜ Pendiente
├── rv360/                  # RV360 (otro proyecto)
└── html/                   # Landing page enviox.es (legacy)
```

---

## 🌐 Mapa de Subdominios y Puertos

| Subdominio | Puerto | App | PM2 Name | Estado |
|------------|--------|-----|----------|--------|
| `mrw.enviox.es` | 3001 | MRW Pro | `mrw-pro` | ✅ Live (200 OK) |
| `geomarkets.enviox.es` | 3000 | GeoMarkets EU | `geomarkets-eu` | ⚠️ 502 (necesita fix) |
| `correos.enviox.es` | 3002 | Correos Pro | — | ⬜ Pendiente |
| `dhl.enviox.es` | 3003 | DHL Pro | — | ⬜ Pendiente |

---

## 🚨 ARQUITECTURA OBLIGATORIA: server.mjs + dotenv

### ¿Por qué?
Las apps Shopify Remix usan `"type": "module"` (ESM). PM2 **NO pasa** env vars a ESM modules correctamente. Ni `--env-file`, ni ecosystem.config.cjs, ni `export` desde bash scripts funcionan con PM2.

### Solución: `server.mjs`
Cada app DEBE tener un `server.mjs` en la raíz del directorio:

```javascript
import { config } from 'dotenv';
config();

import express from 'express';
import { createRequestHandler } from '@remix-run/express';

const app = express();
const port = process.env.PORT || 3001;

// Serve static assets directly (bypasses Node)
app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
app.use(express.static('build/client', { maxAge: '1h' }));

// All other requests → Remix
const build = await import('./build/server/index.js');
app.all('*', createRequestHandler({ build }));

app.listen(port, '0.0.0.0', () => {
  console.log('<APP> listening on http://0.0.0.0:' + port);
});
```

### Dependencias necesarias en server:
```bash
npm install dotenv express @remix-run/express
```

### PM2 command:
```bash
cd /var/www/<app> && pm2 start server.mjs --name <app-name>
pm2 save
```

---

## 🔧 Configuración Nginx (patrón para cada app)

Ubicación: `/etc/nginx/sites-available/<subdomain>.conf`
Symlink: `/etc/nginx/sites-enabled/<subdomain>.conf`

```nginx
server {
    listen 80;
    server_name <subdomain>.enviox.es;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name <subdomain>.enviox.es;

    ssl_certificate /etc/letsencrypt/live/<subdomain>.enviox.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<subdomain>.enviox.es/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # CRITICAL: Allow Shopify to embed the app in an iframe
    add_header Content-Security-Policy "frame-ancestors https://*.myshopify.com https://admin.shopify.com" always;

    # Serve static assets directly (bypass Node.js for performance)
    location /assets/ {
        alias /var/www/<app>/build/client/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Proxy everything else to Express/Remix
    location / {
        proxy_pass http://127.0.0.1:<PORT>;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 🔒 Certificados SSL

Todos gestionados por **Certbot** con auto-renovación:
```bash
certbot --nginx -d <subdomain>.enviox.es
```

Certificados existentes:
- `/etc/letsencrypt/live/mrw.enviox.es/`
- `/etc/letsencrypt/live/correos.enviox.es/`
- `/etc/letsencrypt/live/dhl.enviox.es/`
- `/etc/letsencrypt/live/geomarkets.enviox.es/` (si existe)

---

## 🚀 Proceso de Deploy Completo

### Paso 1: Build local (Windows)
```powershell
cd "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\MRW Pro\mrw-pro-app"
npx prisma generate
npx remix vite:build
```

### Paso 2: Subir al VPS
```powershell
scp -r build root@46.225.55.22:/var/www/mrw-pro/
scp package.json root@46.225.55.22:/var/www/mrw-pro/
scp -r prisma root@46.225.55.22:/var/www/mrw-pro/
```

### Paso 3: Setup server (solo primera vez)
```bash
ssh root@46.225.55.22
cd /var/www/mrw-pro
npm install --omit=dev
npm install dotenv express @remix-run/express
npx prisma generate
npx prisma db push

# Crear .env — ⚠️ SIEMPRE verificar que NO tenga \r
cat > .env << 'EOF'
SHOPIFY_API_KEY=API_KEY_REDACTED
SHOPIFY_API_SECRET=shpss_REDACTED
SHOPIFY_APP_URL=https://mrw.enviox.es
DATABASE_URL=file:./prisma/dev.db
PORT=3001
SCOPES=write_orders,read_orders,write_fulfillments,read_fulfillments,read_shipping,write_shipping
MRW_API_URL=https://sagec-test.mrw.es/MRWEnvio.asmx
EOF

# Crear server.mjs (ver contenido arriba)
```

### Paso 4: Arrancar con PM2
```bash
# PRIMERO: verificar que el puerto está libre!
lsof -i :3001 && echo "⚠️ PUERTO OCUPADO" || echo "✅ Puerto libre"

# Si ocupado:
pm2 kill
fuser -k 3001/tcp
sleep 2

# Arrancar
cd /var/www/mrw-pro
pm2 start server.mjs --name mrw-pro
pm2 save
```

### Paso 5: Verificar
```bash
sleep 5
pm2 list | grep mrw                         # online, 0 restarts
curl -sI http://localhost:3001/              # 200 OK o 302
curl -sI https://mrw.enviox.es/             # 200 OK via Nginx
pm2 logs mrw-pro --lines 5 --nostream       # Sin errores
```

---

## 🐛 Troubleshooting

### App reinicia infinitamente (↺ alto)
```bash
pm2 logs <app> --err --lines 10 --nostream
```
- **EADDRINUSE**: Puerto ocupado → `pm2 kill && fuser -k <port>/tcp`
- **empty appUrl**: dotenv no cargó → verificar server.mjs y .env
- **Cannot find module**: Falta `npm install` en server

### 502 Bad Gateway en Nginx
- App no está corriendo → `pm2 list`
- Puerto incorrecto → verificar `.env` PORT y nginx proxy_pass

### Hydration errors en consola del navegador
- Son warnings de React, generalmente no bloquean la app
- Causas comunes: emojis, fechas, locale differences server/client

### Windows \r\n corruption
```bash
cat -A .env        # Si ves ^M antes del $, hay \r
sed -i 's/\r$//' .env
```

---

## 📊 Shopify Partners (org: Bitrenta)

### Actualizar app config (URL, webhooks):
```powershell
# Desde el directorio de la app:
npx shopify app deploy --force
# Requiere login: te da un código de verificación para confirmar en el navegador
```

### Protected Customer Data:
Los webhooks como `orders/create` necesitan aprobación de "Protected customer data" en Partners → API access.
- En dev stores funciona sin aprobación
- Para producción/App Store SÍ se necesita

### Apps registradas:
| App | client_id | URL | Versión |
|-----|-----------|-----|---------|
| MRW Pro | `API_KEY_REDACTED` | `https://mrw.enviox.es` | mrw-pro-6 |
| GeoMarkets EU | (ver toml) | `https://geomarkets.enviox.es` | — |

---

*Última actualización: 23/02/2026 00:30 — Enviox*
