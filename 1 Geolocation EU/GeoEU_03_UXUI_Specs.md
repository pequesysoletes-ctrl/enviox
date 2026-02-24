# GEOMARKETS EU
## UI/UX Design Specifications
### Documento 3 de 5 — Febrero 2026

---

## 1. Design System

### Plataforma: Shopify Polaris

GeoMarkets EU usa **Shopify Polaris** como sistema de diseño para la parte de admin. El selector de país que ve el visitante final usa CSS customizable con banderas SVG.

### Colores clave

```css
/* Shopify Polaris base */
--p-color-bg-primary: #008060;        /* Shopify green — primary actions */
--p-color-bg-critical: #d72c0d;       /* Errors */
--p-color-bg-warning: #916a00;        /* Warnings */
--p-color-bg-success: #008060;        /* Success */
--p-color-bg-info: #2c6ecb;          /* Info */
--p-color-bg: #f6f6f7;              /* Page background */
--p-color-bg-surface: #ffffff;       /* Card background */

/* GeoMarkets custom accent */
--geo-accent: #2563EB;              /* Blue for geo-specific elements (mapas, globo) */
--geo-accent-light: #3B82F6;        /* Light blue for hover states */
--geo-badge: #1D4ED8;               /* Market/country badge */
--geo-redirect: #059669;            /* Redirect success indicator */
```

### Filosofía de diseño
- **Admin (Polaris)**: limpio, funcional, con accent azul para elementos geográficos
- **Storefront (selector)**: sutil, integrado en el tema del merchant, flags coloridas
- **No sobrecargar**: el selector debe ser minimal — un widget, no una página

---

## 2. Las 10 Pantallas de la App

### Pantalla 01 — Onboarding / Welcome

**Contenido:**
- Logo "GeoMarkets EU" con icono de globo en azul #2563EB
- Subtítulo: "Detecta el país de tus visitantes y adáptales la tienda automáticamente"
- 3 pasos del wizard:
  - Paso 1: "Sincronizar Markets" (conectar con Shopify Markets)
  - Paso 2: "Configurar redirección" (auto/banner/manual)
  - Paso 3: "Personalizar selector" (colores, posición)
- Mapa de Europa estilizado con puntos en los países
- CTA: "Conectar con Shopify Markets" en #008060
- Trust: "🔒 No almacenamos IPs • 🇪🇺 RGPD compliant • ⚡ <100ms latencia"

**Componentes Polaris:** Page, Card, ProgressBar, Button, TextContainer, Banner (info)

---

### Pantalla 02 — Dashboard Principal

**Contenido:**
- 4 KPI cards:
  - "Redirecciones hoy" — "2,340" con gráfico sparkline
  - "Visitantes geolocalizados" — "8,912" — "+12%"
  - "Mercados activos" — "5" con banderas 🇪🇸🇫🇷🇩🇪🇮🇹🇬🇧
  - "Tasa de aceptación" — "84%" — "del banner"
- Mapa de calor: países de origen de visitantes (chart con barras por país)
- Gráfico: redirecciones por día (última semana)
- Card: "Países sin mercado" — lista de países que visitan pero no tienen mercado → "Crear mercado para PT, NL, BE"
- Card: "Últimas redirecciones" — mini tabla con timestamp, país, de→a

**Componentes Polaris:** Page, Card, Layout (twoThirds + oneThird), DataTable
**Charts:** @shopify/polaris-viz (BarChart, LineChart)

---

### Pantalla 03 — Configuración de Redirección

**Contenido:**
- Card 1 — "Modo de redirección":
  - Radio: ● Automática (redirect 302 inmediato) — recomendado
  - Radio: ○ Con banner de confirmación
  - Radio: ○ Solo selector manual (sin redirect)
  
- Card 2 — "Banner de confirmación" (solo si modo banner):
  - Preview visual del banner
  - Input: texto personalizable
  - Input: botón "Sí" texto
  - Input: botón "No" texto
  - Color picker: fondo del banner

- Card 3 — "Exclusiones":
  - Toggle: "☑ No redirigir bots de buscadores (Google, Bing)" — siempre ON
  - Input: "URLs a excluir de redirección" (multi-line)
  - Toggle: "☑ Respetar elección manual del usuario (30 días)"
  - Toggle: "☑ No redirigir desde páginas de checkout"
  
- Card 4 — "Tipo IVA por defecto para productos sin configurar":
  - Dropdown: país de origen por defecto

**Componentes Polaris:** Page, Card, RadioButton, Toggle, TextField, ColorPicker

---

### Pantalla 04 — Sincronización de Markets

**Contenido:**
- Estado de sincronización: "✅ Última sync: hace 2 horas"
- Botón: "Sincronizar ahora"
- Tabla de mercados detectados:

| Mercado | Países | Idioma | Moneda | URL | Estado |
|---------|--------|--------|--------|-----|--------|
| 🇪🇸 España | ES | es | EUR | /es/ | ✅ Activo |
| 🇫🇷 Francia | FR | fr | EUR | /fr/ | ✅ Activo |
| 🇩🇪 Alemania | DE, AT | de | EUR | /de/ | ✅ Activo |
| 🇬🇧 UK | GB | en | GBP | /en-gb/ | ✅ Activo |
| 🇮🇹 Italia | IT | it | EUR | /it/ | ⚠️ Sin traducción |

- Info banner: "Los mercados se configuran en Shopify Admin → Settings → Markets. Esta app lee tu configuración."
- Link: "Configurar Markets en Shopify →"

**Componentes Polaris:** Page, Card, IndexTable, Badge, Banner, Button

---

### Pantalla 05 — Personalización del Selector

**Contenido:**
- Preview en vivo del selector (iframe/mockup de la tienda)
- Card "Posición":
  - Radio: ● Flotante esquina inferior derecha
  - Radio: ○ Integrado en header
  - Radio: ○ Integrado en footer
  - Radio: ○ Oculto (solo redirect automático)
  
- Card "Contenido":
  - Toggle: "☑ Mostrar banderas"
  - Toggle: "☑ Mostrar nombre del país"
  - Toggle: "☑ Mostrar moneda"
  - Toggle: "☑ Mostrar idioma"
  - Ejemplo: "🇪🇸 España (EUR) ▼"

- Card "Diseño":
  - Color picker: fondo, texto, borde, hover
  - Dropdown: border radius (0px, 4px, 8px, 12px, pill)
  - Dropdown: tamaño (compacto, normal, grande)

**Componentes Polaris:** Page, Card, RadioButton, Toggle, ColorPicker, RangeSlider

---

### Pantalla 06 — Analytics de Tráfico

**Contenido:**
- Period selector: "Última semana / Último mes / Último trimestre"
- Bar chart: top 10 países por visitantes
- Line chart: redirecciones por día (tendencia)
- Tabla: desglose por país

| País | Visitantes | Redirects | Tasa aceptación | Conversión |
|------|-----------|-----------|----------------|-----------|
| 🇫🇷 Francia | 2,340 | 1,890 | 81% | 3.2% |
| 🇩🇪 Alemania | 1,870 | 1,650 | 88% | 4.1% |
| 🇬🇧 UK | 1,240 | 980 | 79% | 2.8% |

- Card: "Oportunidades" — países con >100 visitas sin mercado configurado

**Componentes Polaris:** Page, Card, DataTable, DatePicker
**Charts:** @shopify/polaris-viz

---

### Pantalla 07 — Billing / Plan

**Contenido:**
- 3 plan cards:
  - Basic 9,99€/mes — 3 mercados, redirect, selector básico
  - Pro 19,99€/mes — Ilimitado, CSS custom, analytics (DESTACADO, borde azul, "Popular")
  - Agency 29,99€/mes — Multi-tienda, soporte prioritario, API
- Plan actual destacado
- Nota: "Los pagos se gestionan a través de Shopify"
- Trial: "7 días de prueba gratuita en cualquier plan"

**Componentes Polaris:** Page, Card, CalloutCard, Badge, Button

---

### Pantalla 08 — Preview del Selector (Storefront)

**Contenido:**
- Mockup visual de cómo se ve el selector en la tienda del merchant
- 4 variantes mostradas:
  1. Flotante (esquina inferior derecha) — con bandera + nombre
  2. Header integrado — inline con la navegación
  3. Footer — al final de la página
  4. Drawer mobile — lista de países en panel lateral
- Cada variante muestra el selector abierto con lista de países

**Nota:** Esta pantalla es informativa — muestra al merchant cómo queda en su tienda

---

### Pantalla 09 — Banner de Redirect (Customer-facing)

**Contenido:**
- Mockup de la tienda del merchant con el banner sutil en la parte superior:
- Banner: "🇫🇷 Il semble que vous êtes en France. Voulez-vous voir la boutique en français?"
- Botones: "Oui, changer" (verde) | "Non, rester ici" (outlined)
- El banner se adapta al idioma del mercado detectado
- Dismiss: "×"

**Nota:** NO es una pantalla admin — es lo que el visitante final ve en la tienda

---

### Pantalla 10 — FAQ / Help

**Contenido:**
- Preguntas frecuentes expandibles:
  - "¿Qué pasa si un visitante no quiere ser redirigido?"
  - "¿Afecta a mi SEO?"
  - "¿Es compatible con RGPD?"
  - "¿Funciona con todos los temas?"
  - "¿Cómo configuro Shopify Markets?"
- Link a documentación completa
- Chat de soporte (si plan Pro/Agency)
- Video tutorial embedded

**Componentes Polaris:** Page, Card, Collapsible, TextContainer, VideoThumbnail

---

## 3. Storefront Components

### Selector flotante (CSS)

```css
.geo-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: var(--geo-bg, #ffffff);
  border: 1px solid var(--geo-border, #e5e5e5);
  border-radius: var(--geo-radius, 8px);
  padding: 8px 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  transition: all 0.2s ease;
}

.geo-selector:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.geo-selector__flag {
  width: 20px;
  height: 15px;
  margin-right: 8px;
  border-radius: 2px;
}

.geo-selector__dropdown {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  max-height: 300px;
  overflow-y: auto;
  min-width: 200px;
}
```

---

## 4. Paleta de Colores Completa (para Mockups)

### Admin App (Shopify Polaris + Custom)

```
BACKGROUNDS
┌────────────────────────────────────────────────────┐
│ #F6F6F7   Page background (gris claro Polaris)     │
│ #FFFFFF   Card background                          │
│ #F1F5F9   Secondary card / nested area             │
│ #0C1220   Footer / dark sections (Enviox dark)     │
└────────────────────────────────────────────────────┘

PRIMARY ACTIONS / CTA
┌────────────────────────────────────────────────────┐
│ #008060   Primary button (Shopify green)            │
│ #006E52   Primary button hover                     │
│ #E6FFF5   Primary button disabled / light bg        │
└────────────────────────────────────────────────────┘

GEO-SPECIFIC ACCENT (azules)
┌────────────────────────────────────────────────────┐
│ #2563EB   Accent principal (badges, iconos mapa)   │
│ #3B82F6   Accent hover / light                     │
│ #1D4ED8   Accent dark (badge de mercado activo)    │
│ #DBEAFE   Accent surface (fondo info banner)       │
│ #EFF6FF   Accent lightest (fondo highlight)        │
└────────────────────────────────────────────────────┘

SEMANTIC COLORS
┌────────────────────────────────────────────────────┐
│ #059669   Success / redirect exitoso / activo       │
│ #D1FAE5   Success surface (fondo badge ✅)           │
│ #D97706   Warning / mercado sin traducción          │
│ #FEF3C7   Warning surface (fondo badge ⚠️)          │
│ #DC2626   Error / critical / fallo redirect         │
│ #FEE2E2   Error surface                             │
│ #6B7280   Text secondary / meta info                │
│ #111827   Text primary / headings                   │
│ #9CA3AF   Text tertiary / placeholders              │
└────────────────────────────────────────────────────┘

STOREFRONT SELECTOR (defaults — el merchant customiza)
┌────────────────────────────────────────────────────┐
│ #FFFFFF   Selector background                      │
│ #E5E5E5   Selector border                          │
│ #111827   Selector text                            │
│ #F9FAFB   Selector item hover                      │
│ #2563EB   Selected item highlight                  │
│ #DBEAFE   Selected item background                 │
└────────────────────────────────────────────────────┘
```

### Banderas - Colores de referencia por mercado

| País | Bandera | Color dominante | Uso en gráficos |
|------|---------|----------------|----------------|
| 🇪🇸 España | 🟥🟨 | #AA151B / #F1BF00 | Barra/línea en charts |
| 🇫🇷 Francia | 🟦⬜🟥 | #002395 / #ED2939 | Barra/línea en charts |
| 🇩🇪 Alemania | ⬛🟥🟨 | #000000 / #DD0000 | Barra/línea en charts |
| 🇬🇧 UK | 🟦🟥⬜ | #012169 / #C8102E | Barra/línea en charts |
| 🇮🇹 Italia | 🟩⬜🟥 | #009246 / #CE2B37 | Barra/línea en charts |
| 🇵🇹 Portugal | 🟩🟥 | #006600 / #FF0000 | Barra/línea en charts |
| 🇳🇱 Países Bajos | 🟥⬜🟦 | #AE1C28 / #21468B | Barra/línea en charts |

---

## 5. Wireframe Layout Descriptions (para Mockups)

### Layout General Admin

```
┌──────────────────────────────────────────────────────────┐
│ [Shopify Admin Frame — sidebar izquierdo (Polaris)]     │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ← GeoMarkets EU               [Sync] [Settings ⚙️]  │ │  ← Page header
│ ├──────────────────────────────────────────────────────┤ │
│ │                                                      │ │
│ │  ┌──────── 2/3 ────────┐ ┌──── 1/3 ─────┐          │ │  ← Layout twothirds
│ │  │                      │ │               │          │ │
│ │  │  [Main content]      │ │  [Side panel] │          │ │
│ │  │                      │ │               │          │ │
│ │  └──────────────────────┘ └───────────────┘          │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### P01 — Onboarding Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              🌍 GeoMarkets EU                        │
│     Detecta el país de tus visitantes y              │
│     adáptales la tienda automáticamente               │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │  ① Sincronizar ──── ② Configurar ──── ③ Listo  │ │  ← ProgressBar
│  │  ━━━━━━━━━━━━━━━━━  ─ ─ ─ ─ ─ ─ ─    ─ ─ ─ ─ │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │    🔗 Conectar con Shopify Markets              │ │
│  │    Importaremos tus mercados configurados       │ │
│  │                                                 │ │
│  │    [  Conectar Markets  ]  ← btn #008060        │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  🔒 No almacenamos IPs • 🇪🇺 RGPD • ⚡ <100ms      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### P02 — Dashboard Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ 2,340   │ │ 8,912   │ │  5      │ │  84%    │  │  ← 4 KPI cards
│  │ Hoy     │ │ Geolocal│ │ Markets │ │ Accept  │  │
│  │ ▃▅▆▇▅▆▇│ │ +12% ↑  │ │ 🇪🇸🇫🇷🇩🇪🇮🇹🇬🇧│ │ banner  │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                                                      │
│  ┌──────────────────────┐ ┌──────────────────────┐  │
│  │ 📊 Top 10 países     │ │ ⚠️ Sin mercado       │  │
│  │                      │ │                      │  │
│  │ 🇫🇷 ████████████ 2.3k│ │ 🇵🇹 Portugal — 340   │  │
│  │ 🇩🇪 █████████ 1.8k   │ │ 🇳🇱 Países Bajos— 89 │  │
│  │ 🇬🇧 ███████ 1.2k     │ │ 🇧🇪 Bélgica — 45     │  │
│  │ 🇮🇹 █████ 890        │ │                      │  │
│  │ 🇵🇹 ███ 340          │ │ [Crear mercado →]    │  │
│  └──────────────────────┘ └──────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ 📈 Redirecciones — Última semana                 ││
│  │                                                  ││
│  │    ·  ·                                          ││
│  │   · ·  · ·     ·                                ││
│  │  ·       · · ·  · ·                              ││
│  │ L   M   X   J   V   S   D                       ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

### P03 — Config Redirección Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Card: Modo de redirección                           │
│  ┌──────────────────────────────────────────────────┐│
│  │  ● Automática (redirect 302)  ← recomendado     ││
│  │  ○ Con banner de confirmación                     ││
│  │  ○ Solo selector manual                           ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  Card: Banner de confirmación (colapsable)           │
│  ┌──────────────────────────────────────────────────┐│
│  │  Preview:                                         ││
│  │  ┌────────────────────────────────────────────┐  ││
│  │  │ 🇫🇷 Vous êtes en France. Boutique FR?     │  ││
│  │  │      [Oui ✓]  [Non ✕]                     │  ││
│  │  └────────────────────────────────────────────┘  ││
│  │                                                   ││
│  │  Texto: [___________________________________]    ││
│  │  Botón Sí: [____________]  Botón No: [________] ││
│  │  Color fondo: [■ #FFFFFF ▼]                      ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  Card: Exclusiones                                   │
│  ┌──────────────────────────────────────────────────┐│
│  │  ☑ No redirigir bots (Google, Bing) — forzado   ││
│  │  ☑ Respetar elección manual (30 días)            ││
│  │  ☑ Excluir checkout                              ││
│  │  URLs excluidas: [/sale, /black-friday          ]││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

### P04 — Markets Sync Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ✅ Última sincronización: hace 2 horas  [Sync now]  │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ Mercado       │ Países │ Idioma │ Moneda │ Estado││
│  │───────────────│────────│────────│────────│───────││
│  │ 🇪🇸 España     │ ES     │ es     │ EUR    │ ✅    ││
│  │ 🇫🇷 Francia    │ FR     │ fr     │ EUR    │ ✅    ││
│  │ 🇩🇪 Alemania   │ DE, AT │ de     │ EUR    │ ✅    ││
│  │ 🇬🇧 UK         │ GB     │ en     │ GBP    │ ✅    ││
│  │ 🇮🇹 Italia     │ IT     │ it     │ EUR    │ ⚠️    ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ℹ️ Los mercados se configuran en Shopify Admin →    │
│     Settings → Markets. Esta app lee tu config.      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### P05 — Personalización Selector Wireframe

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌──────────── Preview en vivo ─────────────────┐   │
│  │                                               │   │
│  │  [Mockup tienda]          ┌──────────────┐   │   │
│  │                           │ 🇪🇸 España ▼  │   │   │
│  │                           │──────────────│   │   │
│  │                           │ 🇫🇷 France    │   │   │
│  │                           │ 🇩🇪 Deutschland│   │   │
│  │                           │ 🇬🇧 UK        │   │   │
│  │                           └──────────────┘   │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌─── Posición ───┐  ┌──── Contenido ────┐          │
│  │ ● Flotante      │  │ ☑ Banderas        │          │
│  │ ○ Header        │  │ ☑ Nombre país     │          │
│  │ ○ Footer        │  │ ☐ Moneda          │          │
│  │ ○ Oculto        │  │ ☐ Idioma          │          │
│  └─────────────────┘  └───────────────────┘          │
│                                                      │
│  ┌──── Diseño ─────────────────────────────────┐    │
│  │ Fondo: [■ #FFF ▼]   Texto: [■ #111 ▼]      │    │
│  │ Borde: [■ #E5E ▼]   Radius: [8px ▼]        │    │
│  │ Tamaño: [Normal ▼]                          │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 6. Banner de Redirección — Flujo Completo y Textos Multi-idioma

### Flujo de decisión

```
Visitante llega a la tienda
         │
         ▼
¿Tiene cookie `geo_override`?
  SÍ → No redirigir. Fin.
  NO ↓
         │
Worker detecta IP → país (ej: FR)
         │
         ▼
¿El país tiene mercado configurado?
  NO → No redirigir. Fin.
  SÍ ↓
         │
¿Está ya en el mercado correcto?
  SÍ → No redirigir. Fin.
  NO ↓
         │
¿Modo = Automático?
  SÍ → redirect 302 inmediato. Cookie `geo_auto=FR`. Fin.
  NO ↓
         │
¿Modo = Banner?
  SÍ → Mostrar banner de confirmación ↓
  NO → Solo mostrar selector. Fin.
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Banner aparece en top de la página (slide-down)    │
│                                                     │
│  🇫🇷 Il semble que vous êtes en France.             │
│     Voulez-vous voir la boutique en français?       │
│                                                     │
│  [  Oui, changer  ]   [  Non, rester ici  ]   [×]  │
│     (btn verde)           (btn outlined)    (close) │
└─────────────────────────────────────────────────────┘
         │
    ┌────┴─────┐
    │          │
  "Oui"     "Non" / "×"
    │          │
    ▼          ▼
  Redirect   Cookie `geo_override=1` (30 días)
  al market   Banner desaparece
  FR           No vuelve a mostrar
```

### Textos del banner por idioma

Cada mercado muestra el banner en **su idioma** (el del mercado al que se propone ir):

| Mercado | Texto del banner | Botón SÍ | Botón NO |
|---------|-----------------|----------|----------|
| 🇫🇷 Francia | Il semble que vous êtes en France. Voulez-vous voir la boutique en français? | Oui, changer | Non, rester ici |
| 🇩🇪 Alemania | Es scheint, dass Sie aus Deutschland kommen. Möchten Sie den deutschen Shop besuchen? | Ja, wechseln | Nein, hier bleiben |
| 🇬🇧 UK | It looks like you're in the UK. Would you like to visit our UK store? | Yes, switch | No, stay here |
| 🇮🇹 Italia | Sembra che tu sia in Italia. Vuoi visitare il negozio in italiano? | Sì, cambia | No, resta qui |
| 🇵🇹 Portugal | Parece que está em Portugal. Deseja visitar a loja em português? | Sim, mudar | Não, ficar aqui |
| 🇳🇱 Países Bajos | Het lijkt erop dat u in Nederland bent. Wilt u de Nederlandse winkel bezoeken? | Ja, wisselen | Nee, hier blijven |
| 🇧🇪 Bélgica (FR) | Il semble que vous êtes en Belgique. Voulez-vous voir la boutique en français? | Oui, changer | Non, rester ici |

### Anatomía del banner (CSS specs)

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  padding: 12px 24px                                          │
│  background: var(--banner-bg, #FFFFFF)                       │
│  border-bottom: 1px solid var(--banner-border, #E5E7EB)     │
│  box-shadow: 0 2px 8px rgba(0,0,0,0.06)                    │
│  position: sticky; top: 0; z-index: 9998                    │
│                                                               │
│  ┌──────┐                                                    │
│  │ 🇫🇷   │  Text (14px, color: #111827, weight: 500)        │
│  │ flag  │  "Il semble que vous êtes en France..."           │
│  │ 24×18 │                                                    │
│  └──────┘                                                    │
│                                                               │
│  [  Oui, changer  ]        [  Non, rester ici  ]     [×]    │
│   bg: #059669               bg: transparent           16px   │
│   color: white              color: #6B7280            close  │
│   padding: 8px 20px         border: 1px solid #D1D5DB       │
│   border-radius: 6px       border-radius: 6px               │
│   font-weight: 600         font-weight: 500                  │
│   hover: #047857           hover: bg #F9FAFB                │
│                                                               │
│  Animación: slideDown 0.3s ease (translateY -100% → 0)      │
│  Dismiss: slideUp 0.3s ease → remove()                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Banner en mobile

```
┌─────────────────────────────────┐
│                                 │
│  🇫🇷 Boutique française?       │  ← Texto más corto en mobile
│                                 │
│  [Oui ✓] [Non] [×]             │  ← Botones compactos, inline
│                                 │
│  padding: 10px 16px            │
│  font-size: 13px               │
│                                 │
└─────────────────────────────────┘
```

**Breakpoint mobile**: `@media (max-width: 768px)` — texto shorter, botones en una sola línea.

---

*Documento 3 de 5 — UI/UX Design Specifications*
*GeoMarkets EU — Febrero 2026 (Ampliado con color scheme, wireframes y banner flow)*
