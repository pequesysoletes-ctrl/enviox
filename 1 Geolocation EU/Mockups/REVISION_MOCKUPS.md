# 🔍 REVISIÓN DE MOCKUPS — GeoMarkets EU
## Notas para el Desarrollador
### Febrero 2026

> **Objetivo:** Este documento lista las incoherencias detectadas entre los mockups generados (Stitch) y las especificaciones UX/UI (`GeoEU_03_UXUI_Specs.md`). El dev debe seguir los **specs como fuente de verdad** y corregir los mockups cuando haya discrepancias.

---

## 🚨 PROBLEMA GLOBAL: Navegación Inconsistente

**Este es el error más importante.** La navegación cambia entre pantallas, cuando debería ser consistente en toda la app.

| Mockup | Navegación usada | ¿Correcta? |
|--------|-----------------|-------------|
| 01 Onboarding Welcome | Top bar (logo + Ayuda) | ✅ OK — el onboarding NO tiene sidebar |
| 02 Dashboard | **Sidebar izquierda** (Dashboard, Configuración, Markets, Selector, Analytics, Plan) | ✅ OK — referencia correcta |
| 03 Config Redirección | **Sidebar izquierda diferente** (General, Redirección, Mercados, Diseño del selector, Analíticas) | ⚠️ Items de sidebar diferentes al Dashboard |
| 04 Sync Markets | **Sin sidebar** — solo contenido centrado | ❌ Debería tener sidebar como P02 |
| 05 Personalizar Selector | **Top bar** con breadcrumb (sin sidebar) | ❌ Debería tener sidebar como P02 |
| 06 Analytics | **Top bar** (sin sidebar) | ❌ Debería tener sidebar como P02 |
| 07 Billing v1 | **Top bar** (GeoMarkets EU + ? + JD) | ❌ Debería tener sidebar como P02 |
| 07 Billing v2 | **Sin nav** — solo contenido | ❌ Debería tener sidebar como P02 |
| 08 Vista Posiciones | **Top bar** (Dashboard, Configuración, Ayuda) | ❌ Debería tener sidebar como P02 |
| 09 Banner Redirect | N/A (es storefront, no admin) | ✅ OK — no aplica |
| 10 FAQ/Help | **Top bar** (GeoMarkets EU + 🔔 + GM) | ❌ Debería tener sidebar como P02 |
| Empty State | **Top bar** (GeoMarkets EU + 🔔 + ⚙️ + JD) | ✅ OK — estado inicial, sin sidebar |

### ✅ Decisión para el dev:
**Usar la sidebar del Dashboard (P02) como estándar** para TODAS las pantallas admin post-onboarding:
```
Sidebar items:
├── 📊 Dashboard
├── ⚙️ Configuración (→ Config Redirección)
├── 🌍 Markets (→ Sync Markets)
├── 🎨 Selector (→ Personalizar Selector)
├── 📈 Analytics (→ Analytics de Tráfico)
├── 💳 Plan (→ Billing)
└── ❓ Ayuda (al final, abajo)
```

---

## 🎨 COLORES — Incoherencias Detectadas

### Botón primario CTA
| Mockup | Color CTA | Según specs |
|--------|-----------|-------------|
| 01 Onboarding | Verde #008060 (Shopify green) | ✅ Correcto |
| 03 Config | Verde #008060 "Guardar configuración" | ✅ Correcto |
| 05 Personalizar | Verde oscuro "Guardar cambios" | ✅ OK |
| 06 Analytics | **Azul/púrpura** "Exportar" | ⚠️ Debería ser verde #008060 o azul accent #2563EB |
| 07 Billing Pro | Azul "Seleccionar Pro" | ⚠️ El CTA primario debería ser verde Shopify #008060 |
| 08 Vista Posiciones | Azul oscuro "Guardar cambios" | ⚠️ Debería ser verde #008060 |
| Empty State | **Naranja** "Ir a Shopify Markets" | ❌ Totalmente fuera de paleta. Debe ser verde #008060 |

### ✅ Decisión para el dev:
- **Acciones primarias (guardar, CTA)** → `#008060` (Shopify green)
- **Acciones secundarias (exportar, ver más)** → `#2563EB` (geo accent blue)
- **Nunca usar naranja** — no está en la paleta del specs

### Icono de la app (top-left)
El icono de GeoMarkets EU cambia de forma y color en CADA mockup:

| Mockup | Icono |
|--------|-------|
| 01 Onboarding | 🔵 Globo azul con flecha |
| 02 Dashboard | Miniatura cuadrada oscura |
| 03 Config | **G** verde en círculo azul |
| 05 Personalizar | 🟢 Globo verde en círculo verde |
| 06 Analytics | Cuadrado azul/púrpura con gráfico |
| 07 Billing v1 | 🔵 Globo azul con flecha |
| 08 Vista Posiciones | 🔵 Flecha circular azul |
| 10 FAQ | 🟢 Globo verde |
| Empty State | 🟠 Globo naranja/rojo |

### ✅ Decisión para el dev:
Usar **un solo icono** consistente: **globalización azul** `#2563EB` (globo con flechas de redirección). Referencia: el del Onboarding (P01) está correcto.

---

## 📐 LAYOUT — Errores por Pantalla

### P01 — Onboarding Welcome
- ✅ Layout correcto: 2 columnas (texto izq + mapa derecha)
- ✅ Wizard 3 pasos presente
- ✅ Trust badges presentes (No almacenamos IPs, RGPD, <100ms)
- ⚠️ `welcome` y `welcome2` son **idénticos** — si son dos variantes, debería haber diferencia visual
- ⚠️ Nota dice "2025" pero los specs son de Feb 2026 — actualizar año

### P02 — Dashboard
- ✅ 4 KPIs correctos (Redirecciones, Visitantes, Mercados, Tasa aceptación)
- ✅ Chart de barras por país
- ✅ Card "Países sin mercado" con Portugal y Países Bajos
- ✅ Tabla "Últimas redirecciones" con timestamp, país, ruta, estado
- ✅ Sidebar correcta
- ⚠️ KPI "Mercados activos" muestra avatares de personas en vez de banderas de países — **debería mostrar 🇪🇸🇫🇷🇩🇪🇮🇹🇬🇧** según specs

### P03 — Configuración de Redirección
- ✅ 3 modos correctos (Automática, Banner, Solo selector)
- ✅ Preview del banner con texto en francés
- ✅ Input de texto del banner
- ⚠️ Sidebar tiene items diferentes al Dashboard (`General, Redirección, Mercados, Diseño del selector, Analíticas` vs `Dashboard, Configuración, Markets, Selector, Analytics, Plan`)
- ❌ Falta Card "Exclusiones" (bots, URLs, checkout) — specs la pide explícitamente
- ❌ Falta Card "Tipo IVA por defecto"

### P04 — Sincronización de Markets
- ✅ Tabla de mercados correcto (ES, FR, DE, GB, IT)
- ✅ Status sync "hace 2 horas" + botón "Sincronizar ahora"
- ✅ Italia con badge ⚠️ "Sin traducción"
- ✅ Info banner: "Los mercados se configuran en Shopify Admin..."
- ✅ Card lateral "Estadísticas de Markets" (5 activos, 27 no cubiertos) — buen extra
- ❌ **Sin sidebar** — debería tener la sidebar estándar
- ⚠️ Footer dice "© 2023" — debería ser 2026
- ⚠️ España URL muestra `/` pero specs dicen `/es/`

### P05 — Personalizar Selector
- ✅ 4 posiciones correctas (Flotante, Header, Footer, Oculto)
- ✅ Preview en vivo de la tienda con selector desplegado
- ✅ Toggles: Bandera, Nombre, Moneda, Código idioma
- ✅ Card "Diseño" con color pickers (Fondo, Texto, Borde) + radius + tamaño + sombra
- ⚠️ **Sin sidebar** — usa breadcrumb top en su lugar
- ⚠️ El specs dice toggle "Mostrar idioma" pero el mockup dice "Código de idioma (Ej: ES, EN, FR)" — clarificar

### P06 — Analytics de Tráfico Geográfico
- ✅ Period selector (Última semana)
- ✅ Gráfico de redirecciones por día con tendencia
- ✅ Top 10 países con barras horizontales
- ✅ Portugal y Países Bajos marcados como "SIN MERCADO" (amarillo)
- ✅ Tabla desglose: País, Visitantes, Redirects, Tasa aceptación, Conversión est.
- ✅ Botón "Exportar"
- ✅ Filtros: Todos / Europa / América + búsqueda
- ❌ **Sin sidebar** — debería tener sidebar estándar
- ⚠️ Specs pide Card "Oportunidades" como sección separada — está implícita en los badges amarillos pero no como card dedicada

### P07 — Billing / Plan (2 variantes)
- ✅ 3 planes correctos: Basic 9,99€ / Pro 19,99€ / Agency 29,99€
- ✅ Pro destacado con "★ POPULAR" y borde azul
- ✅ Features correctos por plan
- ✅ Trial: "7 días de prueba gratuita"
- ✅ Nota: "Los pagos se gestionan a través de Shopify"
- ❌ **Sin sidebar** en ambas variantes
- ⚠️ v1 tiene checks verdes ✅ para Basic pero azules 🔵 para Pro — deberían ser consistentes
- ⚠️ v1 botón Pro es azul — debería ser verde Shopify #008060 para acción primaria
- ⚠️ v2 mejora la v1 con subtítulos por plan — **usar v2 como referencia principal**

### P08 — Vista Previa de Posiciones
- ✅ 4 paneles: Flotante, Header, Footer, Mobile drawer
- ✅ Cada panel muestra preview visual en contexto de tienda
- ✅ Mobile drawer con lista de países
- ✅ Panel 1 "Flotante" marcado como "Recomendado"
- ❌ **Usa top nav en vez de sidebar** (Dashboard, Configuración, Ayuda)
- ⚠️ Este mockup es similar a P05 pero con las previews ampliadas — considerar si se integra en P05 o es pantalla separada

### P09 — Banner de Redirect (Storefront)
- ✅ Banner top bar con bandera francesa + texto en francés
- ✅ Botones "Oui, changer" y "Non, rester ici" + dismiss ×
- ✅ Variant B: versión alemana al final (buena adición)
- ✅ Preview de tienda completa con productos — muy buena ejecución
- ⚠️ Specs dice botón "Oui, changer" en verde y "Non" outlined — mockup muestra botón "Oui" en **azul/rojo** — debería ser `#008060` (verde) o `#2563EB` (azul accent)
- ⚠️ La Variant B del banner alemán tiene botón "Ja, wechseln" en **rojo** — no corresponde a la paleta

### P10 — FAQ / Help
- ✅ 5 FAQs correctos según specs
- ✅ Acordeones expandibles
- ✅ Card "Recursos" con documentación, video tutorial, soporte
- ✅ Card "Estado del servicio" (Worker operativo, App Dashboard operativo) — excelente adición
- ✅ Card "Plan Agencia" con upsell — bien pensado
- ✅ Layout twothirds (FAQs izq) + oneThird (recursos derecha)
- ❌ **Sin sidebar** — usa top bar
- ⚠️ Footer dice "© 2023" — debería ser 2026

### Empty State — No Markets
- ✅ Mensaje claro: "No tienes Shopify Markets configurados"
- ✅ CTA: "Ir a Shopify Markets"
- ✅ Link informativo: "¿Qué son los Shopify Markets?"
- ✅ Info: "Tu configuración se sincronizará automáticamente..."
- ❌ Botón CTA en **naranja** — totalmente fuera de paleta, debe ser verde `#008060`
- ❌ Icono del logo en **naranja** — debe ser azul `#2563EB`
- ⚠️ Footer dice "© 2024" — debería ser 2026

### Promo Banner 1 (Cross-sell desde MRW Pro)
- ✅ Banner informativo con icono de globo
- ✅ CTA "Instalar GeoMarkets →"
- ✅ Contexto: dentro del dashboard de otra app (MRW Pro)
- ⚠️ Botón CTA en **púrpura** — debería ser `#2563EB` (azul accent GeoMarkets)
- ⚠️ La barra lateral izquierda usa el branding de MRW Pro, no GeoMarkets — esto es correcto ya que es un cross-sell banner

### Promo Banner 2 (Cross-sell más elaborado)
- ✅ Banner más destacado con background azul/púrpura
- ✅ Tabla de envíos debajo como contexto
- ✅ CTA "INSTALAR GEOMARKETS →"
- ⚠️ Branding "Shipments" en top nav — es banner dentro de otra app (MRW/Correos), OK

---

## 📝 RESUMEN EJECUTIVO PARA EL DEV

### Prioridad ALTA (corregir antes de implementar):
1. **🔴 Sidebar consistente** — Usar la sidebar del P02 (Dashboard) en TODAS las pantallas admin excepto Onboarding y Empty State
2. **🔴 Color CTA** — Todos los botones primarios en `#008060` (verde Shopify). Nunca naranja/rojo
3. **🔴 Empty State** — Cambiar naranja por verde/azul (paleta oficial)
4. **🔴 Icono de app** — Usar UN solo icono consistente (globo azul #2563EB) en toda la app

### Prioridad MEDIA (corregir durante desarrollo):
5. **🟡 P03 Config** — Añadir cards "Exclusiones" y "Tipo IVA" que faltan
6. **🟡 P02 Dashboard** — KPI "Mercados activos" debe mostrar banderas, no avatares
7. **🟡 P09 Banner** — Botón "Oui, changer" en verde #008060 o azul #2563EB, no rojo
8. **🟡 Sidebar items** — Unificar nomenclatura entre P02 y P03 (mismo menú)

### Prioridad BAJA (detalles de pulido):
9. **🟢 Años del copyright** — Actualizar todos los "© 2023/2024" a "© 2026"
10. **🟢 P01 Onboarding** — "Nota 2025" → "Nota 2026"
11. **🟢 P04 Sync** — España URL `/` → `/es/` para consistencia con specs
12. **🟢 P01** — welcome y welcome2 son idénticos, eliminar duplicado o diferenciar
13. **🟢 P07 Billing** — Checks de color consistentes entre Basic y Pro

---

## 🎯 PALETA OFICIAL (referencia rápida)

```
USAR SIEMPRE:
#008060  → Botones primarios (Guardar, CTA principal)
#2563EB  → Accent geográfico (badges, links, icono app)
#F6F6F7  → Fondo de página
#FFFFFF  → Fondo de cards
#059669  → Indicadores de éxito/activo
#D97706  → Warnings (mercado sin traducción)
#DC2626  → Errores/crítico
#111827  → Texto principal
#6B7280  → Texto secundario

NUNCA USAR:
🚫 Naranja como CTA (no está en la paleta)
🚫 Rojo como botón de acción positiva
🚫 Púrpura (no es parte del brand)
```

---

*Documento generado: 21/02/2026*
*Fuente de verdad: GeoEU_03_UXUI_Specs.md*
