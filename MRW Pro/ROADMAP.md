# MRW Pro — Roadmap Completo
## Análisis Competitivo + Plan de Implementación

Fecha: 20 Feb 2026
Contacto: hola@enviox.es

---

## 🔍 Análisis Competitivo

### Competidores analizados:
| App | Precio | Transportistas | Idiomas |
|-----|--------|---------------|---------|
| **Packlink PRO** | Gratis / $29/mo | Multi-carrier | Multi |
| **Outvio** | $125 / $250/mo | Multi-carrier | Multi |
| **Sendcloud** | Gratis - $195/mo | +160 carriers | 6 idiomas |
| **MRW Pro (nosotros)** | Gratis - €29/mo | MRW (especialista) | 6 idiomas |

### Ventaja competitiva MRW Pro:
- **Precio radical**: Gratis - €29/mo vs $125-250/mo de Outvio
- **Especialización**: La MEJOR integración con MRW, no una más de 160
- **España-first**: Idiomas co-oficiales (Català, Galego, Euskara) que NADIE tiene
- **Simplicidad**: Configurar en 2 minutos vs plataformas complejas

---

## ✅ FASE 1 — Core (COMPLETADA)

| # | Feature | Estado |
|---|---------|--------|
| 1 | Dashboard con KPIs reales | ✅ |
| 2 | Crear envío manual | ✅ |
| 3 | Listado de envíos + filtros | ✅ |
| 4 | Detalle de envío + timeline | ✅ |
| 5 | Generación de etiquetas MRW | ✅ |
| 6 | Configuración (credenciales, servicio, peso) | ✅ |
| 7 | Webhook auto-create (pedido → envío) | ✅ |
| 8 | Fulfillment sync con Shopify | ✅ |
| 9 | Devoluciones | ✅ |
| 10 | Recogidas | ✅ |
| 11 | Facturación y planes | ✅ |
| 12 | Onboarding guiado | ✅ |

## ✅ FASE 2 — Diferenciación (COMPLETADA)

| # | Feature | Estado |
|---|---------|--------|
| 13 | **Pedidos Shopify → Enviar** (IndexTable con bulk actions) | ✅ |
| 14 | Iconos SVG propios (sin emojis) | ✅ |
| 15 | Banner uso mensual + alertas | ✅ |
| 16 | Analytics avanzados (gráficos, destinos, servicios) | ✅ |
| 17 | Importación CSV masiva | ✅ |
| 18 | Tracking público (`/tracking?n=XXX`) | ✅ |
| 19 | Multi-idioma 6 idiomas (ES, EN, FR, CA, GL, EU) | ✅ |
| 20 | Retry + Circuit Breaker para API | ✅ |
| 21 | Templates email branded | ✅ |
| 22 | Selector de idioma | ✅ |
| 23 | Política de Privacidad (GDPR) | ✅ Live |
| 24 | Términos de Servicio | ✅ Live |
| 25 | Landing web enviox.es | ✅ Live |
| 26 | Branding MRW (colores oficiales) | ✅ |

## 🔴 FASE 2.5 — Pre-Launch (BLOQUEADA)

| # | Feature | Estado | Bloqueado por |
|---|---------|--------|---------------|
| 27 | Conectar API MRW real | ⏳ | Credenciales franquicia |
| 28 | Test end-to-end con envío real | ⏳ | #27 |
| 29 | Integrar Shopify Billing API | ⏳ | #27 |
| 30 | Screenshots profesionales para App Store | ⏳ | #28 |
| 31 | Submit a Shopify para revisión | ⏳ | #29, #30 |

---

## ✅ FASE 3A — Features de Alto Impacto (COMPLETADA 20 Feb 2026)

| # | Feature | Ruta | Estado |
|---|---------|------|--------|
| 32 | **Reglas de envío automáticas** | `app.settings.rules.tsx` | ✅ |
| 33 | **Tracking brandizado** (logo, colores, preview live) | `app.settings.tracking.tsx` | ✅ |
| 34 | **Notificaciones SMS** (Twilio) | `app.settings.notifications.tsx` | ✅ |
| 35 | Pack & Go (Scan & Ship) | — | ⏳ Futuro |
| 36 | **Impresión masiva etiquetas + albaranes** | `app.shipments.labels.tsx` | ✅ |

---

## ✅ FASE 3B — Features de Medio Impacto (COMPLETADA 20 Feb 2026)

| # | Feature | Ruta | Estado |
|---|---------|------|--------|
| 37 | **Portal devoluciones self-service** | `returns.portal.tsx` | ✅ |
| 38 | Seguro de envío | — | ⏳ API MRW |
| 39 | Documentos aduaneros (CN23/CN22) | — | ⏳ Futuro |
| 40 | Puntos de recogida en checkout | — | ⏳ Futuro |
| 41 | **Albaranes (Packing slips)** | `app.shipments.labels.tsx` | ✅ (incluido en bulk) |
| 42 | Listas de preparación (Pick lists) | — | ⏳ Futuro |

---

## 🔵 FASE 3C — Enterprise (Futuro)

### 43. Multiusuario con roles
**Fuente**: Outvio ($250)
**Qué es**: Varios usuarios con permisos (admin, almacén, soporte).
**Prioridad**: BAJA — Solo enterprise

### 44. Multi-almacén
**Fuente**: Outvio ($250)
**Qué es**: Configurar múltiples direcciones de origen.
**Prioridad**: BAJA — Solo enterprise

### 45. API pública
**Fuente**: Outvio ($250)
**Qué es**: API REST para que los clientes integren programáticamente.
**Prioridad**: BAJA — Futuro

### 46. Cálculo de tasas en checkout
**Fuente**: Sendcloud
**Qué es**: Mostrar precio real de envío MRW en el checkout, basado en peso/destino/servicio.
**Requiere**: Shopify Carrier Service API
**Prioridad**: MEDIA — Muy útil pero compleja
**Complejidad**: Alta

### 47. Gestión de reembolsos automáticos
**Fuente**: Sendcloud ($195)
**Qué es**: Reembolso automático cuando se confirma la devolución.
**Prioridad**: BAJA — Requiere Shopify Payments API

### 48. ✅ Notificaciones WhatsApp — EXCLUSIVA IMPLEMENTADA
**Estado**: ✅ COMPLETADO — `notifications.server.ts` + `app.settings.notifications.tsx`
**Qué es**: Enviar tracking via WhatsApp al cliente usando WAHA.
**Ventaja**: SOMOS LA ÚNICA APP DE SHOPIFY CON WHATSAPP TRACKING.
**98% tasa de apertura** vs 20% del email. GRATIS sin coste por mensaje.

---

## 📊 Resumen de prioridades

### Implementar PRIMERO (máximo impacto, mínima complejidad):
1. **#36 Impresión masiva** — Básico, fácil
2. **#34 SMS tracking** — Alta demanda, fácil con Twilio
3. **#32 Reglas de envío** — Gran diferenciador
4. **#33 Tracking brandizado** — Los comerciantes lo aman

### Implementar SEGUNDO:
5. **#37 Portal devoluciones** — Reduce workload del comerciante
6. **#42 Pick lists** — Valor para almacén
7. **#41 Packing slips** — Complemento útil

### Implementar TERCERO (diferenciadores exclusivos):
8. **#48 WhatsApp tracking** — EXCLUSIVA → nadie lo tiene
9. **#46 Tasas en checkout** — Compleja pero muy potente
10. **#40 Puntos de recogida** — Requiere mapa + API

---

## 💰 Estructura de precios propuesta (revisada)

| Plan | Precio | Envíos/mes | Features clave |
|------|--------|-----------|----------------|
| **Starter** | Gratis | 30 | Crear envíos, tracking, etiquetas |
| **Pro** | €9.99/mo | 200 | + Auto-create, analytics, CSV import |
| **Business** | €29.99/mo | Ilimitados | + Reglas, SMS, tracking branded, bulk print |
| **Enterprise** | €59.99/mo | Ilimitados | + API, multi-user, multi-almacén, WhatsApp |

**Nota**: Outvio cobra $125-250. Sendcloud $33-195. Nosotros somos MUCHO más baratos.

---

## 📅 Timeline estimado

| Fase | Duración | Prerrequisito |
|------|----------|--------------|
| 2.5 Pre-Launch | 1 semana | Credenciales MRW |
| 3A Alto impacto | 2-3 semanas | Post-launch |
| 3B Medio impacto | 3-4 semanas | Post 3A |
| 3C Enterprise | 6-8 semanas | Post 3B |

---

*Documento generado el 20/02/2026 — Enviox · hola@enviox.es*
