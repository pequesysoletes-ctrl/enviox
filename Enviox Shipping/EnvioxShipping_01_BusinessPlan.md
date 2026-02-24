# Enviox Shipping — Business Plan & PRD

> **Pack Multi-Carrier para Shopify**
> Versión 1.0 — Febrero 2026

---

## 📋 RESUMEN EJECUTIVO

**Enviox Shipping** es la app todo-en-uno que integra los principales couriers españoles (MRW, Correos, DHL, y futuros) en una sola interfaz dentro de Shopify. Ofrece funcionalidades exclusivas que NO están disponibles en las apps individuales: **routing inteligente, comparador de precios en tiempo real**, y un **dashboard unificado** de todos los carriers.

### Propuesta de valor
> "¿Por qué pagar 3 apps si puedes tener las 3 integradas por menos?"

| | MRW Pro | Correos Pro | DHL Pro | **Enviox Shipping** |
|--|---------|-------------|---------|---------------------|
| Precio | 9,99€/mes | 9,99€/mes | 9,99€/mes | **19,99€/mes** |
| Carriers | 1 | 1 | 1 | **3-4** |
| Comparador precios | ❌ | ❌ | ❌ | ✅ |
| Smart routing | ❌ | ❌ | ❌ | ✅ |
| Dashboard unificado | ❌ | ❌ | ❌ | ✅ |
| Suma individual | — | — | — | 29,97€ |
| **Ahorro** | — | — | — | **33% (9,98€/mes)** |

---

## 🎯 PROBLEMA QUE RESUELVE

### Para el comercio que usa varios carriers:
1. **Fragmentación**: 3 apps separadas = 3 dashboards, 3 configs, 3 facturas
2. **Sin comparación**: No pueden comparar precios entre carriers al crear un envío
3. **Sin optimización**: Eligen carrier manualmente, sin saber cuál es más barato/rápido
4. **Coste elevado**: 3 × 9,99€ = 29,97€/mes por las 3 individuales

### Enviox Shipping resuelve todo esto con:
- **Una sola app** con todos los carriers
- **Comparador** que muestra el precio de cada carrier al crear envío
- **Smart routing** que auto-selecciona el mejor carrier según reglas
- **33% más barato** que comprar las 3 por separado

---

## 🏗️ ARQUITECTURA TÉCNICA

### Base
Enviox Shipping se construye sobre el mismo código base que las apps individuales, pero con capas adicionales:

```
app/
├── routes/
│   ├── app._index.tsx              # Dashboard UNIFICADO (todos los carriers)
│   ├── app.orders.tsx              # Pedidos → seleccionar carrier
│   ├── app.shipments.new.tsx       # Crear envío con COMPARADOR
│   ├── app.shipments.compare.tsx   # ⭐ NUEVO: Comparador de precios
│   ├── app.routing.tsx             # ⭐ NUEVO: Smart routing rules
│   ├── app.routing.rules.tsx       # ⭐ NUEVO: Config reglas de routing
│   ├── app.analytics.tsx           # Analytics MULTI-CARRIER
│   ├── app.settings.carriers.tsx   # ⭐ NUEVO: Config de TODOS los carriers
│   ├── app.settings.mrw.tsx        # Config MRW
│   ├── app.settings.correos.tsx    # Config Correos
│   ├── app.settings.dhl.tsx        # Config DHL
│   ├── app.settings.seur.tsx       # Config SEUR (futuro)
│   ├── ... (resto igual que apps individuales)
├── services/
│   ├── carrier.server.ts           # YA EXISTE: dispatcher multi-carrier
│   ├── mrw.server.ts               # API MRW
│   ├── correos.server.ts           # API Correos
│   ├── dhl.server.ts               # API DHL
│   ├── seur.server.ts              # ⭐ FUTURO: API SEUR
│   ├── comparator.server.ts        # ⭐ NUEVO: Motor de comparación
│   └── router.server.ts            # ⭐ NUEVO: Motor de smart routing
```

### Modelos DB adicionales
```prisma
// Además de los modelos existentes:

model CarrierConfig {
  id        String @id @default(cuid())
  shop      String
  carrier   String // "mrw" | "correos" | "dhl" | "seur"
  enabled   Boolean @default(false)
  priority  Int @default(0)
  // Relación con credenciales específicas de cada carrier
}

model RoutingRule {
  id          String @id @default(cuid())
  shop        String
  name        String
  condition   String // JSON: { field, operator, value }
  carrier     String // carrier seleccionado cuando se cumple
  priority    Int
  enabled     Boolean @default(true)
}

model PriceComparison {
  id          String @id @default(cuid())
  shop        String
  shipmentId  String?
  results     String // JSON: [{ carrier, service, price, deliveryDays }]
  selectedCarrier String?
  createdAt   DateTime @default(now())
}
```

---

## ⭐ FUNCIONALIDADES EXCLUSIVAS DEL PACK

### 1. Comparador de Precios en Tiempo Real

Al crear un envío, el usuario ve una tabla comparativa:

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Comparador de Precios                                   │
├────────────┬──────────────┬──────────┬──────────┬───────────┤
│ Carrier    │ Servicio     │ Precio   │ Entrega  │ Acción    │
├────────────┼──────────────┼──────────┼──────────┼───────────┤
│ 🟡 Correos │ Paq Premium  │  4,50€   │ 24-48h   │           │
│ 🔴 MRW     │ e-Commerce   │  5,20€   │ 24h      │           │
│ 📦 DHL     │ Paket        │  6,80€   │ 48-72h   │           │
│ ⭐ MEJOR   │ Correos Paq  │  4,50€   │ 24-48h   │ [Elegir]  │
└────────────┴──────────────┴──────────┴──────────┴───────────┘
```

**Implementación:**
- Consulta tarifas de todos los carriers habilitados en paralelo
- Ordena por precio o por velocidad (toggle del usuario)
- Muestra "MEJOR PRECIO" y "MÁS RÁPIDO"
- Cache de 5 min para la misma CP origen-destino

### 2. Smart Routing (Auto-selección de carrier)

Reglas configurables que auto-seleccionan el carrier óptimo:

| Regla | Condición | Carrier auto |
|-------|-----------|--------------|
| Baleares | CP empieza 07 | Correos (Paq Premium) |
| Canarias | CP empieza 35, 38 | Correos (Internacional) |
| Peso > 30kg | Peso ≥ 30000g | DHL (Paket) |
| Urgente | Tag "urgente" | MRW (Urgente 14h) |
| Default | Sin match | Más barato según comparador |

**Implementación:**
```typescript
// router.server.ts
export function evaluateRouting(
  rules: RoutingRule[],
  orderData: OrderData,
  carrierPrices: CarrierPrice[]
): { carrier: CarrierId; service: string; reason: string } {
  // 1. Evalúa reglas por prioridad
  for (const rule of rules.sort((a,b) => a.priority - b.priority)) {
    if (matchesCondition(rule.condition, orderData)) {
      return { carrier: rule.carrier, service: rule.service, reason: `Regla: ${rule.name}` };
    }
  }
  // 2. Si no hay regla → el más barato
  const cheapest = carrierPrices.sort((a,b) => a.price - b.price)[0];
  return { carrier: cheapest.carrier, service: cheapest.service, reason: "Precio más bajo" };
}
```

### 3. Dashboard Unificado Multi-Carrier

KPIs globales + desglose por carrier:

```
┌────────────────────────────────────────────────────────────────┐
│  📊 Dashboard Enviox Shipping                                  │
├────────────────┬──────────────┬──────────────┬─────────────────┤
│ Total envíos   │ MRW          │ Correos      │ DHL             │
│ 347            │ 142 (41%)    │ 156 (45%)    │ 49 (14%)        │
├────────────────┴──────────────┴──────────────┴─────────────────┤
│                                                                │
│  💰 Ahorro vs apps individuales: €9,98/mes (33%)              │
│  📈 Carrier más usado: Correos (45%)                          │
│  ⚡ Carrier más rápido: MRW (media 1.2 días)                  │
│  💵 Carrier más barato: Correos (media 4,50€/envío)           │
│                                                                │
│  [Gráfico barras: envíos por carrier por semana]               │
│  [Gráfico donut: distribución por carrier]                     │
│  [Tabla: coste medio por carrier y servicio]                   │
└────────────────────────────────────────────────────────────────┘
```

### 4. Configuración Centralizada de Carriers

Una sola pantalla para gestionar todos los carriers:

```
┌─────────────────────────────────────────────────┐
│  ⚙️ Mis Carriers                                │
├────────────┬──────────────┬──────────┬──────────┤
│ 🔴 MRW     │ ✅ Verificado │ Default  │ [Config] │
│ 🟡 Correos │ ✅ Verificado │          │ [Config] │
│ 📦 DHL     │ ❌ Sin config │          │ [Config] │
│ 🔵 SEUR    │ 🔒 Próximamente│         │ [—]     │
└────────────┴──────────────┴──────────┴──────────┘
```

---

## 💰 MODELO DE NEGOCIO

### Planes

| | Lite | Pro | Business |
|--|------|-----|----------|
| **Precio** | 9,99€/mes | **19,99€/mes** | 39,99€/mes |
| **Carriers** | 2 | 3 | 4+ (todos) |
| **Envíos/mes** | 100 | 500 | Ilimitados |
| **Comparador** | ❌ | ✅ | ✅ |
| **Smart routing** | ❌ | ✅ | ✅ |
| **Analytics multi** | Básico | Completo | Avanzado + exportar |
| **Soporte** | Email | Prioritario | Dedicado |

### Upsell desde apps individuales
- Banner dentro de MRW Pro / Correos Pro / DHL Pro:
  > "💡 ¿Usas más de un carrier? Con Enviox Shipping gestiona todos por solo 19,99€/mes"
- Al instalar una segunda app individual, sugerir el pack

### Revenue projection (Año 1)
| Concepto | Cantidad | Precio | MRR |
|----------|----------|--------|-----|
| Apps individuales | ~50 merchants | 9,99€ | ~500€ |
| Pack Enviox Shipping | ~20 merchants | 19,99€ | ~400€ |
| **Total MRR estimado** | | | **~900€** |

---

## 🗓️ ROADMAP

### Fase 1: Apps individuales (ACTUAL)
- [x] MRW Pro — live en `mrw.enviox.es`
- [ ] Correos Pro — infra lista, pendiente código
- [ ] DHL Pro — infra lista, pendiente código

### Fase 2: Enviox Shipping (Pack)
- [ ] Implementar `comparator.server.ts`
- [ ] Implementar `router.server.ts`
- [ ] UI comparador en `app.shipments.compare.tsx`
- [ ] UI smart routing en `app.routing.tsx`
- [ ] Dashboard unificado multi-carrier
- [ ] Config centralizada de carriers
- [ ] Crear app en Shopify Partners (`shipping.enviox.es`)
- [ ] Deploy en VPS (puerto 3004)

### Nota: Correos + Correos Express
**Correos Pro incluye AMBAS plataformas:**
- **Correos** (Paq Premium, Paq Estándar, Paq Ligero) — API PreRegistro XML
- **Correos Express** (antes Chronoexpress) — API REST propia, servicio urgente
  - Entrega en el día / siguiente día hábil
  - API diferente: `https://www.correosexpress.com/wpsc/apiRestGrabwordsarEnvio/json/grabwordsarEnvio`
  - Auth diferente (usuario/contraseña de Correos Express, no de Correos estándar)
  
**En la app Correos Pro**, se integran ambas APIs bajo una sola interfaz. El usuario configura credenciales de ambas y elige el servicio al crear envío (o el smart routing lo hace por él).

### Fase 3: Expansión
- [ ] SEUR como 4º carrier
- [ ] Nacex como 5º carrier
- [ ] GLS como 6º carrier
- [ ] API pública para integraciones custom

---

## 🔑 DIFERENCIACIÓN vs COMPETENCIA

| Feature | Enviox Shipping | Packlink | ShippyPro |
|---------|----------------|----------|-----------|
| Multi-carrier | ✅ 3-4 | ✅ 30+ | ✅ 50+ |
| Smart routing | ✅ | ❌ | ❌ |
| Comparador tiempo real | ✅ | ✅ (pero web) | ❌ |
| Embebido en Shopify | ✅ Nativo | ❌ Redirect | ❌ Redirect |
| Enfoque España | ✅ | Parcial | ❌ |
| Precio | 19,99€ | 29€+ | 49€+ |
| Soporte español | ✅ | ❓ | ❌ |

**Ventaja principal**: Única app que es **nativa de Shopify** (no redirect), con **comparador** y **routing inteligente**, enfocada al **mercado español** y con **soporte en español**.

---

## 📂 ESTRUCTURA DEL PROYECTO

```
Enviox Shipping/
├── EnvioxShipping_01_BusinessPlan.md     # ← ESTE DOCUMENTO
├── EnvioxShipping_02_PRD_Tecnico.md      # PRD detallado (futuro)
├── EnvioxShipping_03_UXUI_Specs.md       # Especificaciones UI (futuro)
├── EnvioxShipping_04_Roadmap.md          # Roadmap detallado (futuro)
└── enviox-shipping-app/                  # Código de la app (futuro)
    ├── app/
    │   ├── routes/
    │   ├── services/
    │   └── ...
    ├── prisma/
    ├── shopify.app.toml
    └── package.json
```

---

*Documento creado el 22/02/2026 — Enviox · hola@enviox.es*
