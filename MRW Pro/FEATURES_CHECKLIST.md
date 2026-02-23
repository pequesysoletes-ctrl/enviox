# Enviox — Documentación de Funcionalidades & Checklist
## Blueprint Universal para Apps de Transporte en Shopify
### Válido para: MRW Pro · Correos Pro · [Futuras carriers]

Fecha: 20 Feb 2026 · Contacto: hola@enviox.es

---

## 📋 ÍNDICE

1. [Arquitectura general](#arquitectura)
2. [Funcionalidades Core](#core)
3. [Funcionalidades Avanzadas](#avanzadas)
4. [Servicios Backend](#servicios)
5. [Infraestructura](#infraestructura)
6. [Checklist de lanzamiento](#checklist)
7. [Adaptación a nueva carrier](#nueva-carrier)

---

## 🏗️ ARQUITECTURA GENERAL {#arquitectura}

### Stack tecnológico
| Capa | Tecnología |
|------|-----------|
| Framework | Remix (Shopify App Remix Template) |
| UI | Shopify Polaris |
| Base de datos | SQLite (Prisma ORM) → migrar a PostgreSQL en prod |
| Hosting | VPS Hetzner (46.225.55.22) — compartido con otros proyectos |
| Proxy | Nginx reverse proxy |
| Auth | Shopify OAuth + App Bridge |
| API carrier | SOAP/REST (varía por carrier) |

### Estructura de archivos
```
app/
├── routes/
│   ├── app._index.tsx          # Dashboard
│   ├── app.orders.tsx           # Pedidos Shopify → crear envío
│   ├── app.shipments._index.tsx # Lista de envíos
│   ├── app.shipments.$id.tsx    # Detalle envío + timeline
│   ├── app.shipments.new.tsx    # Crear envío manual
│   ├── app.shipments.import.tsx # Importación CSV masiva
│   ├── app.shipments.labels.tsx # Impresión masiva etiquetas
│   ├── app.shipments.scan.tsx   # Scan & Ship (barcode)
│   ├── app.shipments.picklist.tsx # Listas de preparación
│   ├── app.returns._index.tsx   # Devoluciones
│   ├── app.returns.new.tsx      # Nueva devolución
│   ├── app.pickups.tsx          # Recogidas
│   ├── app.billing.tsx          # Facturación y planes
│   ├── app.analytics.tsx        # Analytics/estadísticas
│   ├── app.onboarding.tsx       # Wizard primera configuración
│   ├── app.settings._index.tsx  # Configuración general
│   ├── app.settings.mrw.tsx     # Config credenciales carrier ← CARRIER-SPECIFIC
│   ├── app.settings.rules.tsx   # Reglas de envío automáticas
│   ├── app.settings.tracking.tsx # Tracking brandizado
│   ├── app.settings.notifications.tsx # Config SMS + WhatsApp
│   ├── app.settings.pickup-points.tsx # Puntos de recogida MRW
│   ├── app.settings.rates.tsx   # Tarifas de envío en checkout
│   ├── app.shipments.customs.tsx # Documentos aduaneros CN22/CN23
│   ├── app.tsx                  # Layout + NavMenu
│   ├── tracking.tsx             # Página tracking pública
│   ├── returns.portal.tsx       # Portal devoluciones self-service
│   └── webhooks.orders.create.tsx # Auto-crear envío en nuevo pedido
├── services/
│   ├── mrw.server.ts            # API MRW (SOAP) ← CARRIER-SPECIFIC
│   ├── correos.server.ts        # API Correos (REST) ← CARRIER-SPECIFIC
│   ├── dhl.server.ts            # API DHL (REST) ← CARRIER-SPECIFIC
│   ├── carrier.server.ts        # Dispatcher unificado (selecciona carrier)
│   ├── email.server.ts          # Plantillas email transaccional
│   ├── notifications.server.ts  # SMS (Twilio) + WhatsApp (WAHA)
│   └── retry.server.ts          # Retry + Circuit Breaker
├── components/
│   ├── EnvioBrand.tsx           # Header/Footer branded
│   ├── EnvioIcons.tsx           # Iconos SVG
│   └── LanguageSelector.tsx     # Selector de idioma
├── i18n/
│   └── translations.ts         # 6 idiomas (ES,EN,FR,CA,GL,EU)
└── db.server.ts                 # Prisma client singleton
```

### Modelos de base de datos (Prisma)
```
Session           — Auth Shopify
MrwCredentials    — Credenciales carrier ← CARRIER-SPECIFIC
ShippingConfig    — Config envío (servicio, peso, dimensiones)
Shipment          — Envíos creados
ShipmentEvent     — Timeline de tracking (relación 1:N con Shipment)
Pickup            — Solicitudes de recogida
ReturnShipment    — Devoluciones
ShippingRule      — Reglas automáticas de envío
TrackingConfig    — Config tracking brandizado (logo, colores)
NotificationConfig — Config SMS + WhatsApp
```

---

## ✅ FUNCIONALIDADES CORE {#core}

### 1. Dashboard (`app._index.tsx`)
- [ ] KPIs en tiempo real (total envíos, entregados, incidencias, pendientes)
- [ ] Gráfico de envíos por mes
- [ ] Últimos envíos con estado
- [ ] Alertas activas
- [ ] Link directo a crear envío
- **Datos**: Queries Prisma a `Shipment`, `ShipmentEvent`

### 2. Pedidos Shopify (`app.orders.tsx`)
- [ ] Fetch pedidos unfulfilled via Shopify GraphQL API
- [ ] IndexTable con selección múltiple
- [ ] Botón "Crear envío" individual por pedido
- [ ] Bulk action "Crear envíos" para selección múltiple
- [ ] Detección de pedidos ya enviados
- [ ] Filtros (fecha, estado pago)
- **API**: `admin.graphql("query { orders(...) { ... } }")`

### 3. Crear envío manual (`app.shipments.new.tsx`)
- [ ] Formulario completo: destinatario, dirección, teléfono
- [ ] Selector de servicio carrier
- [ ] Campos: peso, bultos, referencia, observaciones
- [ ] Validación de campos obligatorios
- [ ] Creación en DB + llamada API carrier
- [ ] Redirige a detalle del envío creado
- **API Carrier**: `createShipment(auth, shipmentData)`

### 4. Lista de envíos (`app.shipments._index.tsx`)
- [ ] IndexTable con datos: tracking, pedido, fecha, destinatario, estado
- [ ] Filtros por estado (Pendiente, En tránsito, Entregado, Incidencia)
- [ ] Búsqueda por tracking o nombre
- [ ] Paginación
- [ ] Badge de estado con colores
- [ ] Link a detalle de cada envío

### 5. Detalle de envío (`app.shipments.$id.tsx`)
- [ ] Info destinatario completa
- [ ] Detalles envío (servicio, peso, bultos, referencia)
- [ ] Tracking number prominente
- [ ] Timeline de eventos (de DB o API carrier real)
- [ ] Descarga etiqueta PDF
- [ ] Botones: crear devolución, cancelar envío
- **API Carrier**: `getTracking(auth, trackingNumber)`, `getLabel(auth, trackingNumber)`

### 6. Auto-crear envío por webhook (`webhooks.orders.create.tsx`)
- [ ] Recibe webhook `orders/create` de Shopify
- [ ] Extrae datos de envío del pedido
- [ ] Crea Shipment en DB automáticamente
- [ ] Llama API carrier si credenciales verificadas
- [ ] Registra ShipmentEvent
- **Config**: `autoCreateShipment` en ShippingConfig

### 7. Devoluciones (`app.returns._index.tsx`, `app.returns.new.tsx`)
- [ ] Lista de devoluciones con estado
- [ ] Crear nueva devolución (puede ser desde envío existente o manual)
- [ ] Motivo de devolución
- [ ] Genera envío inverso en carrier
- **API Carrier**: `createReturn(auth, returnData)`

### 8. Recogidas (`app.pickups.tsx`)
- [ ] Solicitar recogida en fecha/hora
- [ ] Número de bultos
- [ ] Notas para el repartidor
- [ ] Lista de recogidas solicitadas
- **API Carrier**: `requestPickup(auth, pickupData)`

### 9. Configuración MRW/Carrier (`app.settings.mrw.tsx`)
- [ ] Formulario credenciales carrier
- [ ] Botón "Verificar conexión" → test API call
- [ ] Estado verificación (badge verde/rojo)
- [ ] Configuración envío: servicio default, peso, dimensiones
- [ ] Toggle: auto-crear envíos en nuevo pedido
- [ ] Toggle: enviar email tracking, enviar SMS
- **API Carrier**: `verifyCredentials(auth)`

### 10. Facturación (`app.billing.tsx`)
- [ ] Mostrar planes disponibles (Starter, Pro, Business, Enterprise)
- [ ] Plan actual + consumo del mes
- [ ] Límite de envíos por plan
- [ ] Barra de progreso de uso
- [ ] Botón upgrade/downgrade
- **API**: Shopify Billing API `authenticate.billing()`

### 11. Tracking público (`tracking.tsx`)
- [ ] Página pública (sin auth Shopify)
- [ ] Input para número de tracking
- [ ] Timeline visual de eventos
- [ ] Barra de progreso visual
- [ ] Info del destinatario (parcial por GDPR)
- [ ] Responsive / mobile-first
- [ ] Usa config TrackingConfig para branding

---

## 🚀 FUNCIONALIDADES AVANZADAS {#avanzadas}

### 12. Reglas de envío (`app.settings.rules.tsx`)
- [ ] CRUD de reglas condicionales
- [ ] Condiciones: peso, total pedido, CP, provincia, tags producto
- [ ] Operadores: ≥, ≤, >, <, =, contiene, empieza por
- [ ] Acción: servicio carrier + seguro
- [ ] Prioridad (primera que matchea gana)
- [ ] Toggle activar/desactivar individual
- [ ] Ejemplos predefinidos para nuevos usuarios
- **Función**: `evaluateRules(rules, orderData)` exportada para usar en creación

### 13. Tracking brandizado (`app.settings.tracking.tsx`)
- [ ] Config: logo URL, nombre tienda
- [ ] 3 colores: primario, secundario, acento
- [ ] Presets de colores (4: MRW Classic, Minimalista, Violeta, Eco)
- [ ] Toggle "Powered by Enviox"
- [ ] Footer personalizable
- [ ] CSS custom (avanzado)
- [ ] **Preview en vivo** que se actualiza al cambiar config

### 14. Notificaciones SMS + WhatsApp (`app.settings.notifications.tsx`)
- [ ] Config Twilio (SID, Token, From number)
- [ ] Config WAHA (URL, API key, sesión)
- [ ] Toggle por evento (creado, recogido, tránsito, reparto, entregado, incidencia)
- [ ] Preview visual de SMS y WhatsApp
- [ ] Botón test de prueba
- [ ] Coste estimado SMS
- [ ] Banner "EXCLUSIVA WhatsApp"

### 15. Impresión masiva (`app.shipments.labels.tsx`)
- [ ] IndexTable con selección múltiple
- [ ] Bulk action: imprimir etiquetas
- [ ] Bulk action: generar albaranes
- [ ] Manifiesto resumen
- [ ] Contadores por estado
- [ ] Filtro por estado

### 16. Importación CSV (`app.shipments.import.tsx`)
- [ ] Drag & drop upload
- [ ] Detección inteligente de columnas (ES + EN)
- [ ] Soporte separadores: coma, punto y coma, tab
- [ ] Validación por fila
- [ ] Inserción batch en DB
- [ ] Resumen con éxitos/errores/warnings
- [ ] Límites: 500 filas, 5MB

### 17. Analytics (`app.analytics.tsx`)
- [ ] 4 KPI cards (total, entregados, incidencias, peso medio)
- [ ] Gráfico barras 6 meses (CSS puro)
- [ ] Desglose por servicio carrier
- [ ] Distribución estados (donut visual)
- [ ] Top provincias destino

### 18. Scan & Ship (`app.shipments.scan.tsx`)
- [ ] Input auto-focus para scanner barcode
- [ ] Busca pedido Shopify por nombre
- [ ] Crea envío automáticamente
- [ ] Detección de duplicados
- [ ] Historial de escaneos en sesión
- [ ] Contadores en tiempo real
- [ ] Modo continuo (Enter → procesar → siguiente)

### 19. Pick Lists (`app.shipments.picklist.tsx`)
- [ ] Agrupa productos de envíos pendientes
- [ ] Cantidad total por producto (cross-order)
- [ ] Lista de pedidos afectados por producto
- [ ] Desglose por pedido
- [ ] Botón imprimir pick list
- **API**: Shopify GraphQL para line items

### 20. Portal devoluciones self-service (`returns.portal.tsx`)
- [ ] Página pública (sin auth Shopify)
- [ ] Buscar por número pedido + email
- [ ] Mostrar datos del envío encontrado
- [ ] Selector motivo devolución (7 opciones)
- [ ] Comentarios opcionales
- [ ] Política de devolución visible
- [ ] Crea ReturnShipment en DB
- [ ] Confirmación con referencia
- [ ] Responsive / mobile-first

### 21. Onboarding wizard (`app.onboarding.tsx`)
- [ ] 4 pasos con barra progreso
- [ ] Paso 1: Bienvenida + overview
- [ ] Paso 2: Credenciales carrier
- [ ] Paso 3: Config envío (selector servicio visual)
- [ ] Paso 4: Completado + accesos rápidos
- [ ] Se puede saltar cualquier paso
- [ ] Guarda progreso en DB

### 22. Multi-idioma (`i18n/translations.ts`)
- [ ] Tipo `Locale` con todos los idiomas
- [ ] LOCALE_NAMES con emoji flags
- [ ] Función `getTranslations(locale)`
- [ ] Idiomas: ES 🇪🇸, EN 🇬🇧, FR 🇫🇷, CA, GL, EU
- [ ] Selector de idioma en UI

### 23. Documentos aduaneros CN22/CN23 (`app.shipments.customs.tsx`)
- [ ] Auto-detecta envíos a zonas aduaneras (CP 35, 38, 51, 52)
- [ ] Lista envíos pendientes que necesitan declaración
- [ ] Formulario multi-artículo (descripción, cantidad, peso, valor)
- [ ] Códigos arancelarios HS precargados (13 categorías comunes)
- [ ] Auto-selección CN22 (≤300€) vs CN23 (>300€)
- [ ] Selector tipo envío (venta, regalo, muestra, devolución)
- [ ] País de origen por artículo
- [ ] Resumen con totales (peso, valor, artículos)
- [ ] Info zonas aduaneras en sidebar

### 24. Puntos de recogida MRW (`app.settings.pickup-points.tsx`)
- [ ] Toggle activar/desactivar en checkout
- [ ] Explicación visual del flujo (4 pasos)
- [ ] Buscador de puntos MRW por CP/ciudad
- [ ] Resultados: nombre, dirección, horario, teléfono, servicios
- [ ] Distancia en km
- [ ] Link a Google Maps para cada punto
- [ ] Stats red MRW (+1.200 puntos, 50 provincias)
- [ ] Preparado para Shopify Carrier Service API

### 25. Tarifas de envío en checkout (`app.settings.rates.tsx`)
- [ ] Tabla de tarifas por zona (Península, Baleares, Canarias, Ceuta/Melilla, PT, AD)
- [ ] Tarifas por peso y servicio
- [ ] Config envío gratis a partir de X€
- [ ] Margen adicional configurable
- [ ] Calculadora de tarifas interactiva (simulador)
- [ ] Preview resultado checkout (precio final, envío gratis)
- [ ] Preparado para Shopify Carrier Service API

---

## ⚙️ SERVICIOS BACKEND {#servicios}

### A. API Carrier (`mrw.server.ts`) ← CAMBIAR POR CARRIER
- [ ] `verifyCredentials(auth)` — Test conexión
- [ ] `createShipment(auth, data)` — Crear envío
- [ ] `getTracking(auth, tracking)` — Consultar tracking
- [ ] `getLabel(auth, tracking)` — Descargar etiqueta PDF
- [ ] `cancelShipment(auth, tracking)` — Cancelar envío
- [ ] `createReturn(auth, data)` — Crear devolución
- [ ] `requestPickup(auth, data)` — Solicitar recogida

**Para Correos Pro**: Cambiar de SOAP MRW a REST Correos.
**Interfaz idéntica**, solo cambia la implementación interna.

### B. Email Service (`email.server.ts`)
- [ ] Template: tracking confirmación
- [ ] Template: status update
- [ ] Branded con logo Enviox
- [ ] Table-based (compatibilidad email clients)
- [ ] Placeholder para sending (Shopify API / Resend / SendGrid)

### C. Notifications Service (`notifications.server.ts`)
- [ ] SMS templates por estado (7 estados)
- [ ] WhatsApp templates por estado (7 estados, con bold/links)
- [ ] `sendSMS(config, data)` via Twilio REST
- [ ] `sendWhatsApp(config, data)` via WAHA
- [ ] `sendTrackingNotification(config, data)` dispatcher unificado
- [ ] `normalizePhone(phone)` — normalización ES
- [ ] `buildTrackingUrl(tracking, domain)`

### D. Retry Service (`retry.server.ts`)
- [ ] `withRetry(fn, options)` — exponential backoff + jitter
- [ ] Circuit breaker pattern (auto-disable cuando API caída)
- [ ] Cooldown 60s después de fallos consecutivos
- [ ] Manejo errores: ECONNRESET, ETIMEDOUT, 429, 500-504

---

## 🏗️ INFRAESTRUCTURA {#infraestructura}

### Landing Page (enviox.es)
- [x] Landing completa con hero, features, pricing, FAQ
- [x] Privacy Policy GDPR
- [x] Terms of Service
- [ ] Sitemap XML
- [ ] Blog SEO
- [x] Nginx config con SSL

### Servidor producción (46.225.55.22)
| App | Puerto | Subdominio | PM2 | Estado |
|-----|--------|------------|-----|--------|
| GeoMarkets EU | 3000 | geomarkets.enviox.es | geomarkets-eu | ✅ |
| MRW Pro | 3001 | mrw.enviox.es | mrw-pro | ✅ |
| Correos Pro | 3002 | correos.enviox.es | correos-pro | ⬜ |
| DHL Pro | 3003 | dhl.enviox.es | dhl-pro | ⬜ |

- [x] Nginx reverse proxy → subdomain → port
- [x] SSL con Certbot (certificados independientes por subdominio)
- [x] PM2 process manager con ecosystem.config.cjs
- [x] Content-Security-Policy para embebido en Shopify Admin

### Estrategia de producto
- **Individual**: MRW Pro (9,99€) · Correos Pro (9,99€) · DHL Pro (9,99€)
- **Pack Enviox Shipping** (futuro): 19,99€/mes — las 3 integradas + routing + comparador
- **Shopify RE**: Recargo de Equivalencia (proyecto independiente, NO es el pack)

---

## ✔️ CHECKLIST DE LANZAMIENTO {#checklist}

### Pre-requisitos
- [ ] Credenciales API carrier reales
- [ ] Shopify Partner account aprobada
- [ ] Dominio enviox.es configurado

### Testing
- [ ] Test: crear envío manual → tracking real
- [ ] Test: auto-creación por webhook → tracking real
- [ ] Test: download etiqueta PDF real
- [ ] Test: tracking público con datos reales
- [ ] Test: devolución completa
- [ ] Test: recogida solicitud
- [ ] Test: bulk import CSV (10 envíos)
- [ ] Test: impresión masiva (5 etiquetas)
- [ ] Test: reglas de envío (peso, CP)
- [ ] Test: SMS enviado correctamente
- [ ] Test: WhatsApp enviado correctamente
- [ ] Test: billing → cobro real
- [ ] Test: onboarding flow completo
- [ ] Test: scan & ship (5 pedidos)
- [ ] Test: pick list con datos reales
- [ ] Test: portal devoluciones público
- [ ] Test: 6 idiomas funcionan correctamente

### Shopify App Store Submission
- [ ] App name: "Enviox - MRW Pro" / "Enviox - Correos Pro"
- [ ] Short description (80 chars)
- [ ] Long description (HTML, 3000 chars)
- [ ] 2-5 screenshots (1600x900px)
- [ ] App icon (1200x1200px)
- [ ] Pricing info en el listing
- [ ] Privacy policy URL: https://enviox.es/privacy.html
- [ ] Terms URL: https://enviox.es/terms.html
- [ ] Support email: hola@enviox.es
- [ ] Categories: "Shipping & delivery"
- [ ] Required Shopify scopes documentados

### Post-launch
- [ ] Monitoring (uptime, errors)
- [ ] Alertas por email de errores
- [ ] Backup DB automático (cron diario)
- [ ] Plan de escalabilidad (SQLite → PostgreSQL)

---

## 🔄 ADAPTACIÓN A NUEVA CARRIER {#nueva-carrier}

### Para crear "Correos Pro" desde MRW Pro:

**Solo cambia 2 archivos (carrier-specific):**

| Archivo | MRW Pro | Correos Pro |
|---------|---------|-------------|
| `services/mrw.server.ts` | API SOAP MRW | API REST Correos |
| `app.settings.mrw.tsx` | Config MRW (franquicia, abonado) | Config Correos (user, contract) |

**Todo lo demás es IDÉNTICO:**
- Dashboard ✅
- Pedidos Shopify ✅
- Crear envío ✅
- Lista envíos ✅
- Detalle envío ✅
- Webhook auto-create ✅
- Devoluciones ✅
- Recogidas ✅
- Facturación ✅
- Analytics ✅
- Reglas de envío ✅
- Tracking brandizado ✅
- SMS + WhatsApp ✅
- Impresión masiva ✅
- Import CSV ✅
- Scan & Ship ✅
- Pick Lists ✅
- Portal devoluciones ✅
- Onboarding ✅
- Multi-idioma ✅
- Retry + Circuit Breaker ✅
- Email templates ✅

### Pasos concretos para Correos Pro:
1. **Copiar** toda la carpeta `mrw-pro-app` → `correos-pro-app`
2. **Reemplazar** `services/mrw.server.ts` → `services/correos.server.ts`
3. **Adaptar** `app.settings.mrw.tsx` → `app.settings.correos.tsx`
4. **Actualizar** nombres y strings (MRW → Correos)
5. **Cambiar** servicios carrier (MRW codes → Correos PAQ codes)
6. **Rebranding**: colores MRW rojo → Correos amarillo
7. **Deploy** en nuevo subdominio o misma infra
8. **Submit** como app separada en Shopify

### Servicios Correos equivalentes:
| MRW | Correos |
|-----|---------|
| e-Commerce (0800) | Paq Premium |
| Urgente 19h (0200) | Paq Today |
| Urgente 14h (0110) | Paq 14 |
| Económico (0300) | Paq Estándar |
| e-Commerce Canje (0810) | Paq Retorno |

### API Correos endpoints:
```
POST /preregistros — Crear envío
GET  /preregistros/{code}/etiqueta — Descargar etiqueta
GET  /seguimiento/{tracking} — Consultar tracking
POST /recogidas — Solicitar recogida
```

---

## 📊 RESUMEN FINAL

### Funcionalidades implementadas: 25
### Rutas de la app: 32
### Servicios backend: 4
### Componentes UI: 3
### Modelos DB: 9
### Idiomas: 6
### Archivos carrier-specific: 2

**Tiempo estimado para clonar a Correos Pro: 1-2 días** (solo los 2 archivos carrier-specific + branding)

---

*Documento generado el 20/02/2026 — Enviox · hola@enviox.es*
