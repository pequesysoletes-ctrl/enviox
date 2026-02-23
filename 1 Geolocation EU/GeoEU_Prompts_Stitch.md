# GeoMarkets EU — Prompts para Google Stitch + Guía de Workflow

> **Versión optimizada para stitch.withgoogle.com**
> Febrero 2026

---

## PARTE 1: Cómo usar estos prompts en Stitch

### Flujo de trabajo recomendado

```
Por cada pantalla:
1. Copia el prompt en Stitch (modo Experimental para complejas)
2. Genera → Revisa → Itera con el chat
3. Exportar → Carpeta
4. Repite para las 12 pantallas
```

### Configuración en Stitch

- **Modo Standard**: Pantallas simples → 01, 07, 10
- **Modo Experimental**: Pantallas complejas → 02, 04, 05, 06
- **Plataforma**: **"Web"**
- **Tema**: Light

### Tips

- Shopify Polaris style — componentes nativos de Shopify admin
- GeoMarkets usa accent azul (#2563EB) para elementos geográficos
- Banderas SVG, mapas, globos — elementos visuales clave
- Las pantallas 08 y 09 son storefront (no admin) — diseño diferente

---

## PARTE 2: Los 12 Prompts

---

### PANTALLA 01 — Onboarding / Welcome

```
Web app onboarding welcome screen for "GeoMarkets EU", a Shopify app that detects visitor location and redirects to the correct Shopify Market (country/language/currency).

Colors: Shopify green #008060, Geo blue accent #2563EB, background #F6F6F7, cards white. Font: Inter / system-ui. Style: Shopify admin panel (Polaris design system).

Centered white card on gray background:
- "GeoMarkets EU" logo text in #2563EB bold with a small globe icon 🌍. Below: "Detecta el país de tus visitantes y adapta tu tienda automáticamente"
- 3-step stepper:
  Step 1 "Sincronizar Markets" (active, blue #2563EB)
  Step 2 "Configurar redirección" (gray)
  Step 3 "Personalizar selector" (gray)
- Stylized map of Europe showing dots for ES, FR, DE, IT, PT, GB, NL, BE with connecting lines
- Info box: "Shopify eliminó su app de Geolocation en 2025. GeoMarkets EU es la alternativa rápida y ligera."
- Primary button: "Conectar con Shopify Markets" in #008060
- Small link: "¿Qué son los Shopify Markets? →"
- Trust badges: "🔒 No almacenamos IPs • 🇪🇺 RGPD compliant • ⚡ <100ms latencia"

All text in Spanish. Shopify Polaris styling.
```

---

### PANTALLA 02 — Dashboard Principal

```
Web app main dashboard for "GeoMarkets EU", a Shopify geolocation and market redirect app. Shopify Polaris + polaris-viz styling.

Colors: Geo blue #2563EB, Shopify green #008060, background #F6F6F7. Font: Inter.

Shopify admin layout with left sidebar (Dashboard active with blue indicator, Configuración, Markets, Selector, Analytics, Plan, Ayuda).

MAIN CONTENT:

Page title: "Dashboard GeoMarkets"
Subtitle: "Última actualización: hace 5 min"

4 KPI cards (blue accent):
- "Redirecciones hoy" — "2,340" — sparkline trending up
- "Visitantes geolocalizados" — "8,912" — "+12% vs ayer"
- "Mercados activos" — "5" with flag icons 🇪🇸🇫🇷🇩🇪🇮🇹🇬🇧
- "Tasa aceptación banner" — "84%"

Bar chart: "Visitantes por país (última semana)" — 8 bars in blue gradient #2563EB, countries: ES FR DE GB IT PT NL BE. ES is tallest.

Two cards side by side:
LEFT: "Últimas redirecciones" — mini table:
- 14:32 | 🇫🇷 Francia → /fr/ | ✅ Aceptado
- 14:31 | 🇩🇪 Alemania → /de/ | ✅ Auto
- 14:28 | 🇬🇧 UK → /en-gb/ | ❌ Rechazado
- 14:25 | 🇮🇹 Italia → /it/ | ✅ Auto

RIGHT: "⚠️ Países sin mercado" — amber card:
- "148 visitantes de Portugal esta semana sin mercado configurado"
- "57 visitantes de Países Bajos"
- Button: "Crear mercado para PT →"

All text in Spanish. Shopify Polaris styling.
```

---

### PANTALLA 03 — Configuración de Redirección

```
Web app settings screen for "GeoMarkets EU". Configure how geolocation redirect works. Shopify Polaris styling.

Colors: #008060, #2563EB. Font: Inter. Background #F6F6F7.

Shopify admin layout with sidebar.

Page title: "Configuración de redirección"

Card 1 — "Modo de redirección" with blue header accent:
- Radio buttons:
  ● "Automática (redirect 302)" — SELECTED, blue dot. Description: "El visitante se redirige instantáneamente al mercado correcto. Recomendado."
  ○ "Con banner de confirmación". Description: "Muestra un banner preguntando al visitante si quiere cambiar."
  ○ "Solo selector manual". Description: "Solo el widget de selector. Sin redirect automático."

Card 2 — "Banner de confirmación" (slightly dimmed since auto is selected):
- Preview: mockup of a small top banner: "🇫🇷 Il semble que vous êtes en France. Voulez-vous voir la boutique en français?" [Oui] [Non]
- Input: "Texto del banner" — editable
- Input: "Botón aceptar" — "Cambiar"
- Input: "Botón rechazar" — "No, gracias"

Card 3 — "Exclusiones":
- Toggle ON: "☑ No redirigir bots de buscadores (Google, Bing, etc.)" — with green checkmark and note: "⚠️ CRÍTICO para SEO. No desactivar."
- Textarea: "URLs excluidas" showing "/checkout\n/cart\n/account"
- Toggle ON: "☑ Respetar elección manual del usuario (cookie 30 días)"
- Toggle ON: "☑ No redirigir en páginas de checkout"

Bottom: green button "Guardar configuración" #008060

All text in Spanish. Shopify Polaris form components.
```

---

### PANTALLA 04 — Sincronización de Markets

```
Web app markets sync screen for "GeoMarkets EU". Shows Shopify Markets synchronized with the app. Shopify Polaris styling.

Colors: #008060, #2563EB. Font: Inter. Background #F6F6F7.

Page title: "Shopify Markets sincronizados"
Status badge top-right: GREEN "✅ Sincronizado — hace 2 horas"
Button: "🔄 Sincronizar ahora" outlined

Shopify IndexTable with 5 rows:
Columns: Mercado | Países | Idioma | Moneda | URL | Estado

- 🇪🇸 España (Primary) | ES | Español | EUR € | / | GREEN "Activo" badge
- 🇫🇷 Francia | FR | Français | EUR € | /fr/ | GREEN "Activo"
- 🇩🇪 Alemania | DE, AT | Deutsch | EUR € | /de/ | GREEN "Activo"
- 🇬🇧 Reino Unido | GB | English | GBP £ | /en-gb/ | GREEN "Activo"
- 🇮🇹 Italia | IT | Italiano | EUR € | /it/ | AMBER "⚠️ Sin traducción completa"

Info banner below (blue): "Los mercados se configuran en Shopify Admin → Configuración → Markets. GeoMarkets lee tu configuración y redirige visitantes al mercado correcto."
Link: "Ir a Shopify Markets →"

Card "Estadísticas de Markets":
- "5 mercados activos cubriendo 7 países"
- "27 países EU no cubiertos"
- Button: "Ver países sin cobertura"

All text in Spanish.
```

---

### PANTALLA 05 — Personalización del Selector

```
Web app selector customization for "GeoMarkets EU". Customize the country selector widget appearance. Shopify Polaris styling.

Colors: #008060, #2563EB. Font: Inter. Background #F6F6F7.

Page title: "Personalizar selector de país"

LEFT SIDE (60%):

Card 1 — "Posición":
- Radio with preview thumbnails:
  ● "Flotante esquina inferior derecha" — SELECTED — small preview showing widget at bottom-right
  ○ "Integrado en header" — preview showing inline in nav
  ○ "Integrado en footer" — preview showing at page bottom
  ○ "Oculto" — no widget, only redirect

Card 2 — "Contenido a mostrar":
- Toggle ON: "☑ Mostrar bandera del país"
- Toggle ON: "☑ Mostrar nombre del país"
- Toggle ON: "☑ Mostrar moneda"
- Toggle OFF: "☐ Mostrar código de idioma"
- Preview text: "🇪🇸 España (EUR) ▼"

Card 3 — "Diseño":
- Color picker row: "Fondo: #FFFFFF" | "Texto: #333333" | "Borde: #E5E5E5"
- Dropdown: "Border radius" → "8px (Redondeado)"
- Dropdown: "Tamaño" → "Normal"
- Dropdown: "Sombra" → "Media"

RIGHT SIDE (40%):

Card "Vista previa en vivo":
- Simulated dark browser mockup showing a store product page
- The country selector widget floating at bottom-right: "🇪🇸 España (EUR) ▼"
- Widget expanded showing dropdown: 🇫🇷 France (EUR), 🇩🇪 Deutschland (EUR), 🇬🇧 United Kingdom (GBP), 🇮🇹 Italia (EUR)

All text in Spanish.
```

---

### PANTALLA 06 — Analytics de Tráfico

```
Web app analytics dashboard for "GeoMarkets EU". Traffic analytics by country. Shopify Polaris + polaris-viz styling.

Colors: #2563EB blue gradient, #008060. Font: Inter. Background #F6F6F7.

Page title: "Analytics de tráfico geográfico"
Period selector: "Última semana ▼"

Line chart: "Redirecciones por día" — 7 data points, blue line, trending upward. Y-axis: 0-500. Labels: Lun, Mar, Mié, Jue, Vie, Sáb, Dom.

Horizontal bar chart: "Top 10 países" — blue bars:
- 🇫🇷 Francia: 2,340 (longest bar)
- 🇩🇪 Alemania: 1,870
- 🇬🇧 UK: 1,240
- 🇮🇹 Italia: 890
- 🇵🇹 Portugal: 420 (amber highlight — "Sin mercado")
- 🇳🇱 Países Bajos: 380 (amber — "Sin mercado")
- 🇧🇪 Bélgica: 290
- 🇦🇹 Austria: 180
- 🇨🇭 Suiza: 150
- 🇸🇪 Suecia: 120

DataTable below:
Columns: País | Visitantes | Redirects | Tasa aceptación | Conversión estimada
- 🇫🇷 Francia | 2,340 | 1,890 | 81% | 3.2%
- 🇩🇪 Alemania | 1,870 | 1,650 | 88% | 4.1%
- 🇬🇧 UK | 1,240 | 980 | 79% | 2.8%

All text in Spanish.
```

---

### PANTALLA 07 — Billing / Plans

```
Web app billing page for "GeoMarkets EU". Shopify Polaris styling.

Colors: #008060, #2563EB. Font: Inter. Background #F6F6F7.

Page title: "Plan y facturación"

3 plan cards side by side:

Card 1 — "Basic":
- "9,99€/mes"
- Features: ✅ 3 mercados, ✅ Redirect automático, ✅ Selector básico, ✅ Exclusión bots SEO, ❌ Analytics, ❌ CSS custom
- Button: "Seleccionar" outlined

Card 2 — "Pro" (HIGHLIGHTED with blue #2563EB border and "⭐ Popular" badge):
- "19,99€/mes"
- Features: ✅ Mercados ilimitados, ✅ Redirect + banner, ✅ CSS personalizable, ✅ Analytics completos, ✅ Banderas custom, ❌ Multi-tienda
- Button: "Seleccionar" filled blue

Card 3 — "Agency":
- "29,99€/mes"
- Features: ✅ Todo en Pro, ✅ Multi-tienda, ✅ API access, ✅ Soporte prioritario, ✅ White-label option
- Button: "Seleccionar" outlined

Bottom: "Los pagos se gestionan a través de Shopify. 7 días de prueba gratuita."

All text in Spanish. Shopify Polaris cards.
```

---

### PANTALLA 08 — Preview Selector (Storefront)

```
Web page showing 4 different selector positions for "GeoMarkets EU". This is a preview/demo page showing how the country selector looks on a merchant's store.

NOT an admin page — this shows a simulated product page with the widget overlay.

Clean e-commerce product page background (dark mode mockup of a fashion store):

4 labeled panels showing the same store page with different selector positions:

Panel 1 — "Flotante" (label):
- Store page with floating widget at bottom-right corner
- Widget shows: "🇪🇸 España (EUR) ▼"
- Clean, rounded, subtle shadow

Panel 2 — "Header integrado" (label):
- Store page with country selector inline in the navigation bar
- Shows: "🇪🇸 ES | EUR" next to the cart icon

Panel 3 — "Footer" (label):
- Store page with country selector in the footer area
- Shows: "Elige tu país: 🇪🇸 España ▼"

Panel 4 — "Mobile drawer" (label):
- Mobile phone mockup
- Side drawer open with list: 🇪🇸 España, 🇫🇷 France, 🇩🇪 Deutschland, 🇬🇧 United Kingdom, 🇮🇹 Italia

Light gray background, each panel in a white card with rounded corners.
```

---

### PANTALLA 09 — Banner Redirect (Customer-facing)

```
Web page showing the redirect confirmation banner from "GeoMarkets EU" as seen by a VISITOR on the merchant's store.

NOT an admin page — this is the storefront experience.

Clean e-commerce store homepage with products visible (fashion store, light theme):

TOP BANNER (full width, subtle animation sliding down):
- Light blue background (#EBF5FF) with blue left border (#2563EB)
- Flag: 🇫🇷
- Text: "Il semble que vous êtes en France. Voulez-vous voir la boutique en français?"
- Two buttons: "Oui, changer" (blue #2563EB filled) and "Non, rester ici" (gray outlined)
- Small "×" dismiss button on the right

Below the banner, the normal store content is visible but slightly dimmed.

Additional smaller variant shown below:
- Same banner but in German: "🇩🇪 Es sieht so aus, als wären Sie in Deutschland. Möchten Sie den Shop auf Deutsch sehen?"

Clean, non-intrusive design. The banner adapts to the detected language.
```

---

### PANTALLA 10 — FAQ / Help

```
Web app help and FAQ page for "GeoMarkets EU". Shopify Polaris styling.

Colors: #008060, #2563EB. Font: Inter. Background #F6F6F7.

Page title: "Ayuda y preguntas frecuentes"

Card with collapsible FAQ items (5 items, first one expanded):

1. EXPANDED: "¿Afecta a mi SEO la redirección?"
   Answer: "No. GeoMarkets nunca redirige a los bots de buscadores (Googlebot, Bingbot, etc.). Los rastreadores siempre ven tu página original. Además, usamos redirects 302 (temporales) que no transfieren PageRank."

2. COLLAPSED: "¿Es compatible con RGPD?"
3. COLLAPSED: "¿Funciona con todos los temas de Shopify?"
4. COLLAPSED: "¿Qué pasa si un visitante no quiere ser redirigido?"
5. COLLAPSED: "¿Cómo configuro Shopify Markets?"

Card "Recursos":
- 📄 "Documentación completa →"
- 🎥 "Video tutorial (3 min) →"
- 💬 "Contactar soporte →" (available for Pro/Agency)

Card "Estado del servicio":
- Worker: GREEN "Operativo — 99.98% uptime"
- App: GREEN "Operativo"
- "Última comprobación: hace 2 min"

All text in Spanish.
```

---

### ESTADOS — Empty State

```
Empty state for "GeoMarkets EU" when no Shopify Markets are configured. Shopify Polaris EmptyState component.

Colors: #2563EB accent. Font: Inter. Background #F6F6F7.

Centered:
- Illustration: globe icon with map markers and arrows (Shopify Polaris empty state style, blue tinted)
- "No tienes Shopify Markets configurados"
- "Para que GeoMarkets funcione, necesitas al menos 2 mercados en tu tienda. Configúralos en Shopify Admin → Markets."
- Blue button: "Ir a Shopify Markets"
- Link: "¿Qué son los Shopify Markets? →"

Shopify Polaris EmptyState styling. All text in Spanish.
```

---

### ESTADOS — Cross-sell Banner (dentro de Enviox Carriers)

```
Small dismissible banner inside the MRW Pro or Correos Pro Shopify app, promoting GeoMarkets EU.

Colors: Geo blue #2563EB, Shopify green #008060. Font: Inter.

Small banner at top of the shipments page:
Blue left border, white/light blue background (#EBF5FF):
"🌍 ¿Envías a Europa? Adapta tu tienda automáticamente con GeoMarkets EU — selector de país, redirección e idioma"
Button: "Instalar GeoMarkets →" blue outlined
Dismiss: "×" close button

Clean, non-intrusive. Shopify Polaris Banner component.
```

---

## PARTE 3: Carpeta de organización

```
GeoEU_Mockups/
├── 01_onboarding/
├── 02_dashboard/
├── 03_config_redirect/
├── 04_markets_sync/
├── 05_selector_custom/
├── 06_analytics/
├── 07_billing/
├── 08_preview_selector/
├── 09_banner_redirect/
├── 10_faq_help/
└── estados/
    ├── empty_state.png
    └── cross_sell_banner.png
```
