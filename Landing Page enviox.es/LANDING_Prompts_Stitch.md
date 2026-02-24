# 🌐 Landing Page enviox.es — Prompts para Google Stitch

> **8 secciones** que juntas forman la landing page completa
> Febrero 2026

---

## Cómo usar estos prompts

### Estrategia: Sección por sección

La landing page es una **single-page scrollable**. En Stitch, genera cada sección como una pantalla independiente. Luego las ensamblamos en un solo HTML.

```
Genera en este orden:
1. Hero (modo Experimental)
2. Productos Grid (modo Experimental) ← la más compleja
3. Cómo Funciona (modo Standard)
4. Comparativa Plataformas (modo Experimental)
5. Testimonios (modo Standard)
6. Pricing (modo Experimental)
7. FAQ (modo Standard)
8. Footer + CTA Final (modo Standard)
```

### Configuración Stitch
- **Plataforma**: Web
- **Tema**: Dark (la landing usa fondo oscuro)
- **Ancho**: Desktop (1440px idealmente)

### Tips
- Si el fondo no sale oscuro, di: "Use a dark background gradient from #0F172A to #1E293B"
- Si los cards de producto no tienen color, di: "Each product card should have a distinct colored gradient on the left border"
- Todos los textos en español

---

## SECCIÓN 1 — Hero

**Modo: Experimental (Pro)**

```
Landing page hero section for "Enviox", a suite of ecommerce tools for the Spanish market. Premium SaaS landing page design.

DARK THEME. Background: deep gradient from #0F172A (navy) to #1E293B (slate). 
Font: Inter. Style: modern, premium, tech-forward.

TOP NAV BAR (fixed, transparent):
- Left: "ENVIOX" logo text in white, bold, with a subtle gradient on the X letter (green #10B981 to blue #3B82F6)
- Right nav links in white/gray: "Productos" "Plataformas" "Precios" "FAQ"
- Right CTA button: "Empezar gratis" with gradient background green-to-blue (#10B981 → #3B82F6), rounded, white text

HERO CONTENT (centered):
- Small label badge above title: "🚀 La suite de ecommerce para España" — subtle border, semi-transparent background
- Main heading (very large, white, bold):
  "Tus envíos y tu fiscalidad"
  second line with gradient text (green to blue): "en piloto automático"
- Subheading (gray #94A3B8, medium size):
  "MRW, Correos, DHL y gestión fiscal integrada en Shopify, WooCommerce y PrestaShop. Una marca, todas las soluciones."
- Two buttons side by side:
  Primary: "Ver productos" — gradient green-blue background, white text, large
  Secondary: "Cómo funciona" — transparent with white border, white text
- Below buttons: small trust text in gray: "✓ 7 productos · ✓ 3 plataformas · ✓ Hecho en España 🇪🇸"

VISUAL ELEMENT (behind/around the text):
- Subtle glowing orbs or gradient blurs: one green (#10B981 at 20% opacity) on the left, one blue (#3B82F6 at 20% opacity) on the right — creates a premium ambient light effect
- Optional: very subtle grid pattern overlay at low opacity

No images, no mockups — just typography and ambient lighting. Ultra premium feel.
All text in Spanish.
```

---

## SECCIÓN 2 — Grid de Productos

**Modo: Experimental (Pro)** ← La sección más importante

```
Landing page products section for "Enviox" suite. Shows 7 product cards in a grid layout. DARK THEME.

Background: #1E293B (dark slate). Font: Inter.

Section title (centered):
Small label: "PRODUCTOS" in green #10B981, uppercase, tracking wide
Heading: "7 herramientas, una misión" in white, large
Subtitle: "Cada producto resuelve un dolor específico del ecommerce en España" in gray #94A3B8

PRODUCT CARDS — 2 rows. First row 4 cards, second row 3 cards centered. Each card is a dark card (#0F172A) with subtle border (#334155), rounded corners, and hover effect.

Each card has:
- Left colored accent bar (4px, full height, color unique per product)
- Icon emoji + product name (white, bold)
- Platform badge (small, rounded)
- One-line description (gray)
- Key feature tag

THE 7 CARDS:

Card 1 — GREEN accent bar (#10B981):
🚚 "MRW Pro"
Badge: "Shopify" (green)
"Envíos nacionales MRW automatizados"
Tag: "Motor de reglas · Etiquetas · Recogidas"

Card 2 — BLUE accent bar (#3B82F6):
📮 "Correos Pro"
Badge: "Shopify" (green)
"Correos Standard + Express en una app"
Tag: "Dual carrier · Dashboard · Badge ENV"

Card 3 — YELLOW accent bar (#EAB308):
✈️ "DHL Pro"
Badge: "Shopify" (green)
"DHL Express + eCommerce Ibérica"
Tag: "Aduanas automáticas · Internacional"

Card 4 — PURPLE accent bar (#8B5CF6):
✨ "ShopifyBundler Pro"
Badge: "Shopify" (green)
"Bundles inteligentes con IA"
Tag: "Recomendaciones AI · A/B Testing"

Card 5 — ORANGE accent bar (#F97316):
📦 "Correos PrestaShop"
Badge: "PrestaShop" (blue #2C6ECB)
"Correos Standard + Express para PrestaShop"
Tag: "Badge ENV auditable · Motor reglas"

Card 6 — RED accent bar (#EF4444):
🧾 "WooCommerce RE"
Badge: "WooCommerce" (purple #7F54B3)
"Recargo de Equivalencia automático"
Tag: "Cálculo fiscal · Export CSV · Facturas"

Card 7 — PINK accent bar (#EC4899):
🧾 "Shopify RE"
Badge: "Shopify" (green)
"Recargo de Equivalencia para Shopify"
Tag: "Checkout Extension · Dashboard fiscal"

Below the grid: centered text "Más productos en desarrollo →" in gray with arrow

All text in Spanish. Dark premium card design.
```

---

## SECCIÓN 3 — Cómo Funciona

**Modo: Standard (Flash)**

```
Landing page "How it works" section for "Enviox". 3-step horizontal process. DARK THEME.

Background: gradient from #1E293B to #0F172A. Font: Inter.

Section title (centered):
Small label: "CÓMO FUNCIONA" in green #10B981
Heading: "De cero a envíos en 5 minutos" in white

3 STEPS horizontally with connecting dotted line between them:

Step 1 — Green circle with "1" inside:
Icon: 🔌 (plugin/connect)
Title: "Instala y conecta" (white)
Description: "Instala la app o plugin en tu tienda. Conecta tus credenciales de MRW, Correos o DHL en 2 clics." (gray)

Step 2 — Blue circle with "2":
Icon: ⚙️ (settings)
Title: "Configura tus reglas" (white)
Description: "Define cuándo usar cada transportista. Peso, destino, importe... el motor de reglas decide automáticamente." (gray)

Step 3 — Purple circle with "3":
Icon: 🚀 (rocket)
Title: "Envía en automático" (white)
Description: "Cada pedido genera su etiqueta, recogida y tracking automáticamente. Tú solo vendes." (gray)

Below: centered CTA button "Empezar gratis →" gradient green-blue

All text in Spanish. Clean, minimal.
```

---

## SECCIÓN 4 — Comparativa Plataformas

**Modo: Experimental (Pro)**

```
Landing page platform comparison section for "Enviox". Shows which products are available on each ecommerce platform. DARK THEME.

Background: #0F172A. Font: Inter.

Section title (centered):
Small label: "PLATAFORMAS" in green #10B981
Heading: "Compatible con tu tienda" in white
Subtitle: "No importa qué plataforma uses, tenemos la solución" in gray

COMPARISON TABLE — Dark styled table with subtle grid:

Header row: "" | Shopify (green icon) | WooCommerce (purple icon) | PrestaShop (blue icon)

Row 1 "Logística MRW": ✅ MRW Pro | 🔜 Próximamente | 🔜 Próximamente
Row 2 "Logística Correos": ✅ Correos Pro | 🔜 Próximamente | ✅ Correos PS
Row 3 "Logística DHL": ✅ DHL Pro | 🔜 Próximamente | 🔜 Próximamente
Row 4 "Recargo Equivalencia": ✅ Shopify RE | ✅ WooCommerce RE | 🔜 Próximamente
Row 5 "Bundles IA": ✅ BundlerPro | 🔜 Próximamente | 🔜 Próximamente

Checkmarks ✅ in green #10B981. "Próximamente" in amber/yellow #EAB308.

Below table: 3 platform stat cards side by side:
- Shopify: "52.000 tiendas en España" with green Shopify icon
- WooCommerce: "180.000 tiendas en España" with purple WC icon
- PrestaShop: "35.000 tiendas en España" with blue PS icon

All text in Spanish.
```

---

## SECCIÓN 5 — Testimonios / Social Proof

**Modo: Standard (Flash)**

```
Landing page testimonials section for "Enviox". Shows customer quotes and trust metrics. DARK THEME.

Background: #1E293B. Font: Inter.

Section title (centered):
Small label: "TESTIMONIOS" in green #10B981
Heading: "Lo que dicen los comerciantes" in white

3 TESTIMONIAL CARDS horizontally, each dark card (#0F172A) with subtle border:

Card 1:
⭐⭐⭐⭐⭐
Quote: "Antes tardaba 20 minutos por envío con MRW. Ahora son 2 clics. Literalmente me ha cambiado la vida."
— "Carlos R." — "Tienda de ropa, Madrid" — green "MRW Pro" badge

Card 2:
⭐⭐⭐⭐⭐
Quote: "El motor de reglas es brutal. Tengo Correos Standard para nacional y Express para urgentes, todo automático."
— "Laura M." — "Cosmética online, Barcelona" — blue "Correos Pro" badge

Card 3:
⭐⭐⭐⭐⭐
Quote: "Por fin una app de Recargo de Equivalencia que funciona. Mi gestor está encantado con el CSV que exporta."
— "Pedro G." — "Distribución alimentaria, Valencia" — red "WooCommerce RE" badge

Below testimonials: TRUST METRICS row:
4 metrics with large numbers:
"500+" "Tiendas activas" | "50.000+" "Envíos procesados" | "4.9★" "Rating medio" | "< 2min" "Tiempo de setup"

All text in Spanish. Dark premium cards with subtle glow effect.
```

---

## SECCIÓN 6 — Pricing

**Modo: Experimental (Pro)**

```
Landing page pricing section for "Enviox". Shows pricing for the main product categories. DARK THEME.

Background: gradient from #0F172A to #1E293B. Font: Inter.

Section title (centered):
Small label: "PRECIOS" in green #10B981
Heading: "Planes simples, sin sorpresas" in white
Subtitle: "Todos los productos incluyen prueba gratuita de 14 días" in gray

3 PRICING COLUMNS — each a dark card:

COLUMN 1 — "Starter" (outlined card, subtle border):
"Desde 19€/mes" (white, large)
"Para tiendas que empiezan"
Features with green checkmarks:
✅ 1 app de logística
✅ 100 envíos/mes
✅ Motor de reglas básico
✅ Soporte email
❌ Dashboard avanzado
❌ API access
Button: "Empezar gratis" — outlined border white

COLUMN 2 — "Profesional" (HIGHLIGHTED — gradient border green-blue, slightly larger):
"POPULAR" badge at top (green)
"Desde 49€/mes" (white, large)
"Para tiendas en crecimiento"
Features:
✅ Todas las apps de logística
✅ Envíos ilimitados
✅ Motor de reglas avanzado
✅ Dashboard analytics
✅ Soporte prioritario
❌ API access
Button: "Empezar gratis" — gradient green-blue background, white text, glowing

COLUMN 3 — "Business" (outlined card):
"Desde 99€/mes" (white, large)
"Para tiendas de alto volumen"
Features:
✅ Todo lo anterior
✅ Multi-carrier (MRW + Correos + DHL)
✅ API access completo
✅ Datos aduanas automáticos
✅ Soporte dedicado
✅ Multi-tienda
Button: "Contactar" — outlined

Below: small text centered in gray:
"Los precios son por app y por tienda. El Recargo de Equivalencia tiene pricing separado desde 9,90€/mes. IVA no incluido."

All text in Spanish.
```

---

## SECCIÓN 7 — FAQ

**Modo: Standard (Flash)**

```
Landing page FAQ accordion section for "Enviox". DARK THEME.

Background: #0F172A. Font: Inter.

Section title (centered):
Small label: "FAQ" in green #10B981
Heading: "Preguntas frecuentes" in white

6 FAQ items in accordion style (expandable, one open by default). Dark cards with subtle borders.

Q1 (OPEN — showing answer):
"¿Necesito contrato propio con MRW / Correos / DHL?"
Answer: "Sí. Enviox conecta con TU contrato existente con el transportista. No somos intermediarios — usamos la API de tu cuenta para generar etiquetas y gestionar envíos a tus precios negociados."

Q2 (closed):
"¿Funciona con Shopify, WooCommerce y PrestaShop?"
Answer preview: "Sí, tenemos apps y plugins para las 3 plataformas..."

Q3 (closed):
"¿Qué es el Recargo de Equivalencia?"

Q4 (closed):
"¿Puedo usar varios transportistas a la vez?"

Q5 (closed):
"¿Cuánto tarda la instalación?"

Q6 (closed):
"¿Ofrecéis soporte en español?"

Each FAQ item has a + / - toggle icon on the right. When open, the answer text is in gray #94A3B8.

All text in Spanish.
```

---

## SECCIÓN 8 — CTA Final + Footer

**Modo: Standard (Flash)**

```
Landing page final CTA section and footer for "Enviox". DARK THEME.

Background: #0F172A with a subtle gradient glow in the center (green #10B981 at 5% opacity).

CTA SECTION (centered, generous padding):
Heading: "Automatiza tu ecommerce hoy" in white, large
Subtitle: "14 días gratis. Sin tarjeta. Cancela cuando quieras." in gray
Large CTA button: "Empezar gratis →" gradient green-blue (#10B981 → #3B82F6), rounded, white text, subtle glow/shadow
Below button: "o escríbenos a hola@enviox.es" small gray text

DIVIDER: subtle thin line in #334155

FOOTER (4 columns):

Column 1 — "ENVIOX" logo:
"La suite de ecommerce para España"
"hola@enviox.es"
Social icons: Twitter, LinkedIn, GitHub (subtle gray icons)

Column 2 — "Productos":
MRW Pro
Correos Pro
DHL Pro
BundlerPro
WooCommerce RE
Shopify RE
Correos PrestaShop

Column 3 — "Plataformas":
Shopify
WooCommerce
PrestaShop

Column 4 — "Legal":
Política de privacidad
Términos de servicio
Cookies
Contacto

BOTTOM BAR:
"© 2026 Enviox. Todos los derechos reservados. Hecho con 💚 en España."

Very subtle, clean footer. All text in Spanish. Dark theme throughout.
```

---

## Workflow de ensamblaje

Una vez tengas las 8 secciones generadas en Stitch:

```
Landing_Page_enviox.es/
├── LANDING_PLAN.md              ← Plan original
├── LANDING_Prompts_Stitch.md    ← ESTE DOCUMENTO
├── stitch_exports/
│   ├── 01_hero/
│   ├── 02_productos/
│   ├── 03_como_funciona/
│   ├── 04_plataformas/
│   ├── 05_testimonios/
│   ├── 06_pricing/
│   ├── 07_faq/
│   └── 08_footer/
└── final/
    ├── index.html              ← Ensamblado final
    ├── styles.css
    └── assets/
```

Cuando tengas los exports de Stitch, yo los ensamblo en una web funcional completa. 🚀
