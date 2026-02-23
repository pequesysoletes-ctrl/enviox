# 🚀 ENVIOX — Master Plan Unificado

> **Marca:** Enviox (enviox.es)  
> **Visión:** La suite de referencia para ecommerce en España  
> **Fecha:** 23/02/2026 (v2 — Actualizado)  
> **Estado:** Desarrollo activo

---

## 1. 📦 Ecosistema Enviox — Visión General

### 1.1 Apps de Logística (Shopify) — Carriers individuales

Cada app conecta un carrier específico con Shopify. Son independientes y se venden por separado.

| # | App | Carrier | Precio | Estado servidor | Estado código |
|---|-----|---------|--------|-----------------|---------------|
| 1 | **MRW Pro** | MRW | ~9,90€/mes | ✅ PM2 online (puerto 3000) | 🟢 Producción |
| 2 | **Correos Pro** | Correos Standard | ~9,90€/mes | ✅ PM2 online (puerto 3000) | 🟢 Producción |
| 3 | **Correos Express Pro** | Correos Express | ~9,90€/mes | ✅ PM2 online (puerto 3003) | 🟡 Recién creada |
| 4 | **DHL Pro** | DHL Express | ~9,90€/mes | 🔜 Pendiente | 🟡 Docs listos |

### 1.2 Pack Premium — Enviox Shipping

**Enviox Shipping** es la app bundle que incluye los 4 carriers + funcionalidades premium.

| Característica | Individual | Enviox Shipping |
|----------------|-----------|-----------------|
| 1 carrier | ✅ | ✅ (los 4) |
| Multi-carrier | ❌ | ✅ MRW + Correos + CE + DHL |
| Routing inteligente | ❌ | ✅ (manual y automático) |
| Comparador de tarifas | ❌ | ✅ |
| Dashboard unificado | ❌ | ✅ |
| Reglas por peso/destino | ❌ | ✅ |
| Precio | ~9,90€/mes | ~24,90€/mes |

**Propuesta de valor:** Comprar las 4 apps = 4 × 9,90€ = 39,60€/mes. Enviox Shipping = 24,90€/mes → **ahorro del 37%** + features exclusivos de routing.

### 1.3 Otras Apps Shopify (NO logística)

| # | App | Tipo | Mercado | Estado |
|---|-----|------|---------|--------|
| 5 | **Shopify RE** | Fiscal (Recargo Equivalencia) | España | 🟡 Docs listos |
| 6 | **ShopifyBundler Pro** | IA/Ventas | Global | 🟡 Docs listos |

### 1.4 Otros Productos (otras plataformas)

| # | Producto | Plataforma | Tipo | Estado |
|---|----------|-----------|------|--------|
| 7 | **WooCommerce RE** | WooCommerce | Fiscal | 🟡 Docs listos |
| 8 | **Correos PrestaShop** | PrestaShop | Logística | 🟡 Docs listos |

### 1.5 Apps Totalmente Independientes (fuera de Enviox)

| App | Descripción | Relación con Enviox |
|-----|-------------|---------------------|
| **GeoMarkets EU** | Geolocalización / Mercados europeos | ❌ **NINGUNA** — App independiente |
| **PBCPro** | Otro proyecto independiente | ❌ Fuera del ecosistema |
| **LegionCheck** | Otro proyecto independiente | ❌ Fuera del ecosistema |

---

## 2. 🏗️ Arquitectura Compartida — Qué NO repetir

### Carrier Apps: Base compartida

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENVIOX CARRIER CORE                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SHOPIFY CORE (compartido entre TODAS las apps Shopify)  │    │
│  │                                                          │    │
│  │  • Shopify OAuth + Session Token verification            │    │
│  │  • Shopify Billing API (suscripciones 3 planes)          │    │
│  │  • Shopify Webhooks base (install/uninstall/GDPR)        │    │
│  │  • App Bridge integration                                │    │
│  │  • Polaris UI components base                            │    │
│  │  • EnvioBrand components (header, footer, divider)       │    │
│  │  • EnvioIcons (iconos SVG compartidos)                   │    │
│  │  • Encryption (AES-256 para credenciales)                │    │
│  │  • Rate limiting middleware                              │    │
│  │  • Error handling + logging                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  CARRIER CORE (compartido entre MRW, Correos, CE, DHL)   │    │
│  │                                                          │    │
│  │  • Modelo Shipment (Prisma)                              │    │
│  │  • Modelo ReturnShipment (Prisma)                        │    │
│  │  • Dashboard template (KPIs, incidencias, distribución)  │    │
│  │  • Crear envío manual (formulario base)                  │    │
│  │  • Listado de envíos + filtros                           │    │
│  │  • Tracking público (plantilla cliente final)            │    │
│  │  • Settings page (credenciales + config)                 │    │
│  │  • Label PDF generation                                  │    │
│  │  • Fulfillment sync (Shopify)                            │    │
│  │  • Tracking polling job                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Cada app solo necesita implementar:                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ MRW      │  │ Correos  │  │ Correos  │  │ DHL      │        │
│  │ Client   │  │ Client   │  │ Express  │  │ Client   │        │
│  │ (SOAP)   │  │ (REST)   │  │ Client   │  │ (REST)   │        │
│  │          │  │          │  │ (REST)   │  │          │        │
│  │ Services │  │ Services │  │ Services │  │ Services │        │
│  │ Branding │  │ Branding │  │ Branding │  │ Branding │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Carrier APIs — Diferencias técnicas

| Aspecto | MRW | Correos Standard | Correos Express | DHL |
|---------|-----|------------------|-----------------|-----|
| **Protocolo** | SOAP/XML | REST/JSON | REST/JSON | REST/JSON |
| **Auth** | User/Pass en body | Basic Auth | Basic Auth | API Key |
| **Base URL** | sagec.mrw.es | preregistroenvios.correos.es | www.correosexpress.com/wpsc | api-eu.dhl.com |
| **Servicios principales** | 0300, 0800 | S0132, S0133 | 63, 92, 90 | EXPRESS |
| **Etiquetas** | PDF embed | PDF/ZPL | PDF | PDF/ZPL |
| **Tracking** | SOAP | REST | REST | REST |

### Enviox Shipping (Pack) — Arquitectura adicional

```
┌─────────────────────────────────────────────────────────┐
│              ENVIOX SHIPPING (PACK)                       │
│                                                          │
│  Hereda TODO el Carrier Core, PLUS:                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  ROUTING ENGINE                                 │      │
│  │                                                 │      │
│  │  • Reglas manuales (zona, peso, precio)         │      │
│  │  • Routing automático (ML/heurísticas)          │      │
│  │  • Comparador de tarifas real-time              │      │
│  │  • Fallback rules (si carrier X falla → Y)      │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  UNIFIED DASHBOARD                              │      │
│  │                                                 │      │
│  │  • KPIs agregados de todos los carriers         │      │
│  │  • Vista unificada de envíos                    │      │
│  │  • Incidencias cross-carrier                    │      │
│  │  • Analytics de rendimiento por carrier          │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  RATE COMPARISON                                │      │
│  │                                                 │      │
│  │  • Consulta simultánea a 4 carriers             │      │
│  │  • Muestra mejor precio/tiempo por envío        │      │
│  │  • Sugerencia automática al merchant            │      │
│  └────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. 📅 Roadmap Unificado — Orden de Ejecución

> Basado en el ranking de "Velocidad a Primeros Ingresos"

### Fase A — MRW Pro + Correos Pro + Correos Express Pro ← EN ESTO ESTAMOS

**Estado actual (23 Feb 2026):**
- ✅ MRW Pro — En producción, PM2 online
- ✅ Correos Pro — Refactorizado (limpio de refs MRW), deployed
- ✅ Correos Express Pro — App creada, build OK, PM2 online (puerto 3003)
- 🔜 DNS `correos-express.enviox.es` → Pendiente registro A + SSL cert

**Pendiente fase A:**
- [ ] Registrar Shopify Partner app para Correos Express Pro
- [ ] DNS + SSL para correos-express.enviox.es
- [ ] Testear flujo completo CE con credenciales reales
- [ ] Publicar las 3 apps en Shopify App Store

### Fase B — DHL Pro (Semanas 14-18)
> Misma arquitectura que MRW/Correos, diferente carrier

**Lo que reutiliza de Fase A:**
- ✅ Todo el Carrier Core (80-90%)
- ✅ Shipment/Return/Pickup models (90%)
- ✅ Dashboard, envío manual, listado, tracking (80%)

**Lo nuevo:**
- `dhl.server.ts` — DHL Express API client
- Branding DHL (amarillo + rojo)
- Servicios DHL específicos (Express Worldwide, etc.)

**Estimación:** ~3-4 semanas

### Fase C — Enviox Shipping (Pack) (Semanas 18-24)
> Tras tener los 4 carriers, se construye el pack

**Prerequisitos:** MRW + Correos + CE + DHL funcionando

**Lo nuevo (100%):**
- Motor de routing inteligente
- Dashboard unificado multi-carrier
- Comparador de tarifas
- Reglas de asignación automática
- UI de configuración de reglas

**Estimación:** ~6-8 semanas

### Fase D — Shopify RE (Solapable con cualquier fase)
> Recargo de Equivalencia — producto fiscal, independiente de carriers

**Estimación:** ~4 semanas

### Fase E — ShopifyBundler Pro
> IA Bundle recommendations — mercado GLOBAL

**Estimación:** ~6-8 semanas  
**Nota:** Mercado GLOBAL (4.4M tiendas Shopify), no solo España

### Fase F — WooCommerce RE + Correos PrestaShop
> Ports a otras plataformas

**Estimación:** ~4-6 semanas cada uno

---

## 4. 📊 Proyección Económica Global

### MRR por producto (18 meses post-launch)

| # | Producto | Mercado | Conv. 1% | Ticket | MRR | Primer ingreso |
|---|----------|---------|----------|--------|-----|----------------|
| 1 | MRW Pro | ~4.500 Shopify ES | 45 | 9,90€ | 445€ | ✅ Ya |
| 2 | Correos Pro | ~11.000 Shopify ES | 110 | 9,90€ | 1.089€ | ✅ Ya |
| 3 | Correos Express Pro | ~5.000 Shopify ES | 50 | 9,90€ | 495€ | Semana 10 |
| 4 | DHL Pro | ~5.000 Shopify ES | 50 | 9,90€ | 495€ | Semana 18 |
| 5 | **Enviox Shipping** | Merchants multi-carrier | 80 | 24,90€ | 1.992€ | Semana 24 |
| 6 | Shopify RE | ~52.000 Shopify ES | 520 | 19€ | 9.880€ | Semana 14 |
| 7 | ShopifyBundler | ~4.4M Shopify GLOBAL | 4.400 | $19 | $83.600 | Semana 16 |
| 8 | WooCommerce RE | ~100.000 Woo ES | 1.000 | 19€ | 19.000€ | Semana 24 |
| 9 | Correos PrestaShop | ~30.000 PS ES | 300 | 29€ | 8.700€ | Semana 28 |

### Estrategia de pricing — Carriers + Pack

```
┌─────────────────────────────────────────────────────────────┐
│  INDIVIDUAL (un solo carrier)                                │
│  MRW Pro / Correos Pro / CE Pro / DHL Pro                    │
│  → 9,90€/mes cada una                                       │
│  → Para merchants que solo usan 1 transportista              │
├─────────────────────────────────────────────────────────────┤
│  PACK — ENVIOX SHIPPING                                      │
│  Los 4 carriers + routing + dashboard unificado              │
│  → 24,90€/mes                                               │
│  → Ahorro 37% vs comprar las 4 por separado                 │
│  → Features exclusivos (routing, comparador, unificado)      │
│  → Para merchants que trabajan con múltiples carriers        │
└─────────────────────────────────────────────────────────────┘
```

### Costes operativos

| Concepto | Mes 1-6 | Mes 6-12 | Mes 12-18 |
|----------|---------|----------|-----------|
| VPS (existente 46.225.55.22) | 0€ | 0€ | — |
| VPS dedicado | — | ~8€ | ~15€ |
| Dominio enviox.es | ~8€/año | — | — |
| OpenAI API (Bundler) | — | ~50€ | ~200€ |
| Shopify comisión (20%) | variable | variable | variable |
| **Total costes** | **~10€** | **~60€** | **~220€** |

**→ Margen neto: ~95%+ en todos los productos**

---

## 5. 🌐 Infraestructura Enviox

### Dominio y subdominios

```
enviox.es                             ← Landing page principal
├── /mrw-pro                          ← Info MRW Pro
├── /correos-pro                      ← Info Correos Pro
├── /correos-express-pro              ← Info Correos Express Pro
├── /dhl-pro                          ← Info DHL Pro
├── /enviox-shipping                  ← Info Pack Enviox Shipping
├── /shopify-re                       ← Info Shopify RE
├── /bundler                          ← Info ShopifyBundler Pro
├── /blog                             ← Blog SEO
└── /contacto                         ← Soporte

mrw.enviox.es                         ← Backend MRW Pro (puerto 3000)
correos.enviox.es                     ← Backend Correos Pro (puerto 3000*)
correos-express.enviox.es             ← Backend Correos Express Pro (puerto 3003)
dhl.enviox.es                         ← Backend DHL Pro (pendiente)
shipping.enviox.es                    ← Backend Enviox Shipping (pendiente)
docs.enviox.es                        ← Help Center
```

*Nota: correos.enviox.es y mrw.enviox.es comparten puerto 3000 pero son procesos PM2 separados con sus propios subdominios y Nginx configs.

### Servidor actual (VPS 46.225.55.22)

| PM2 ID | App | Puerto | Estado |
|--------|-----|--------|--------|
| 0 | mrw-pro | 3000 | ✅ online |
| 3 | correos-pro | 3000 | ✅ online |
| 4 | correos-express-pro | 3003 | ✅ online |
| — | dhl-pro | 3004 | 🔜 pendiente |
| — | enviox-shipping | 3005 | 🔜 pendiente |

---

## 6. 📂 Estructura de Archivos Actual

```
📂 1 MRW Shopify/                              ← Workspace Enviox
│
├── 📄 ENVIOX_MASTER_PLAN.md                   ← ESTE DOCUMENTO (plan unificado)
├── 📄 MASTER_PLAN.md                          ← Detalle MRW + Correos (original)
├── 📄 ESTUDIO_MERCADO_COMPETENCIA.md          ← Estudio mercado carriers
│
├── 📂 MRW Pro/                                🟢 EN PRODUCCIÓN
│   └── mrw-pro-app/                           ← Shopify Remix app
│
├── 📂 Correos Pro/                            🟢 EN PRODUCCIÓN
│   └── correos-pro-app/                       ← Shopify Remix app (refactorizado)
│
├── 📂 Correos Express/                        🟡 RECIÉN CREADA
│   └── correos-express-app/                   ← Shopify Remix app
│       └── app/services/correos-express.server.ts  ← API CE nueva
│
├── 📂 4 Shopify DHL/                          🟡 DOCS LISTOS
│   └── (5 docs business/PRD/UXUI/roadmap/handbook)
│
├── 📂 Landing Page enviox.es/                 ← Landing page productos
│
├── 📂 ShopifyBundler/                         🟡 DOCS LISTOS
├── 📂 5 WOO Recargo equivalencia/             🟡 DOCS LISTOS
├── 📂 6 Correos PrestaShop/                   🟡 DOCS LISTOS
└── 📂 7 Shopify RE/                           🟡 DOCS LISTOS
```

---

## 7. ✅ Estado actual y próximos pasos

### Completado recientemente (23 Feb 2026)
- ✅ Correos Pro limpio de referencias MRW → deployed
- ✅ Correos Express Pro creada (copia de Correos Pro + API CE adaptada)
- ✅ Correos Express Pro build OK + PM2 online puerto 3003

### Próximos pasos inmediatos
1. **DNS** — Añadir registro A `correos-express.enviox.es → 46.225.55.22`
2. **SSL** — `certbot --nginx -d correos-express.enviox.es`
3. **Shopify Partner** — Crear app Correos Express Pro en Partners dashboard
4. **Test** — Probar flujo completo con credenciales Correos Express reales
5. **DHL Pro** — Siguiente carrier a implementar

### Decisiones pendientes
1. ¿Precio exacto de cada app individual? (propuesto: 9,90€/mes)
2. ¿Precio pack Enviox Shipping? (propuesto: 24,90€/mes)
3. ¿Cuándo empezar con Enviox Shipping (pack)? → Tras tener ≥3 carriers operativos
4. ¿Landing pages individuales por carrier en enviox.es?

---

## 8. 📋 Resumen ejecutivo

```
INDIVIDUAL APPS (9,90€/mes cada una):
  ├── MRW Pro          → Para merchants que envían solo con MRW
  ├── Correos Pro      → Para merchants que envían solo con Correos
  ├── CE Pro           → Para merchants que envían solo con Correos Express
  └── DHL Pro          → Para merchants que envían solo con DHL

PACK PREMIUM (24,90€/mes):
  └── Enviox Shipping  → Los 4 carriers + routing inteligente + dashboard unificado

INDEPENDIENTES:
  ├── Shopify RE       → Fiscal (Recargo Equivalencia)
  ├── ShopifyBundler   → IA Bundles (mercado global)
  ├── WooCommerce RE   → Fiscal para WooCommerce
  └── Correos PS       → Correos para PrestaShop

100% INDEPENDIENTE (NO ENVIOX):
  └── GeoMarkets EU    → Sin relación con el ecosistema de envíos
```
