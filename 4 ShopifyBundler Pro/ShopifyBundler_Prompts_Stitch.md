# ShopifyBundler Pro — Prompts para Google Stitch + Guía de Workflow

> **Versión optimizada para stitch.withgoogle.com**
> Febrero 2026

---

## PARTE 1: Cómo usar estos prompts en Stitch

### Flujo de trabajo recomendado

```
Por cada pantalla:
1. Copia el prompt en Stitch (modo Experimental para pantallas complejas)
2. Genera → Revisa → Itera con el chat ("cambia X", "alinea Y")
3. Cuando estés satisfecho → Exportar ZIP (imagen + HTML/CSS)
4. Repite para las 14 pantallas
5. Al final: unifica todo (ver Parte 3)
```

### Configuración en Stitch

- **Modo Standard** (Gemini Flash): Pantallas simples → 01, 01b, 10, 11
- **Modo Experimental** (Gemini Pro): Pantallas complejas → 02, 03, 04, 05, 06, 07, 08, 09
- **Plataforma**: Selecciona siempre **"Web"** (no mobile)
- **Tema**: Light

### Tips para mejores resultados en Stitch

- Los prompts están en INGLÉS porque Bundler es un producto GLOBAL (la interfaz también es en inglés)
- Si los charts no se ven bien, di: "Use Shopify Polaris chart style with green #008060 as primary color"
- Si las AI recommendation cards no se ven premium, di: "Make cards more premium with subtle gradient background and sparkle icon"

---

## PARTE 2: Los 14 Prompts adaptados para Stitch

---

### PANTALLA 01 — Welcome / Onboarding

```
Web app onboarding welcome screen for "BundlerPro", an AI-powered product bundle creation and optimization tool for Shopify stores.

Colors: Shopify green #008060, background #F6F6F7, cards white #FFFFFF, text #202223, subdued text #6D7175.
Font: System UI / Inter. Style: Shopify Polaris admin panel, clean, professional.

Centered white card on gray background containing:
- Top: "BundlerPro" logo text in #008060, bold, large, with a sparkle/magic icon ✨
- Tagline below: "AI-Powered Product Bundles That Sell"
- 3-step horizontal stepper:
  Step 1 "Analyze" (search/magnifier icon) — active, green #008060
  Step 2 "Create" (plus icon) — gray inactive
  Step 3 "Optimize" (chart/trending icon) — gray inactive
- Subtitle text: "We'll analyze your last 90 days of orders to find products your customers already buy together, then help you create bundles that increase your Average Order Value."
- Large green primary button: "Analyze My Store" — background #008060, white text
- Small text link: "Skip to Dashboard →"
- Bottom: small trust badges row: "🔒 Read-only access • 📊 1,234 stores trust us • ⚡ Takes ~30 seconds"

All text in English. Clean, welcoming, trustworthy.
```

---

### PANTALLA 01b — Analyzing Store (Loading State)

```
Web app loading/analysis screen for "BundlerPro" — shown while the AI analyzes the store's order history.

Colors: Shopify green #008060, background #F6F6F7. Font: Inter.

Centered white card containing an animated analysis flow:
- Top: "✨ Analyzing your store..." in large bold text
- Animated progress bar in #008060, showing 65% complete
- Below progress bar, 4 analysis steps listed vertically, each with status:
  ✅ "Reading order history (1,234 orders)" — completed, green checkmark
  ✅ "Identifying product pairs" — completed, green checkmark  
  🔄 "Running market basket analysis..." — in progress, spinning indicator
  ⏳ "Generating AI descriptions" — waiting, gray clock
- Fun fact card below with light green background:
  "💡 Did you know? Stores with bundles see an average 28% increase in AOV"
- No cancel button (it's fast, ~30 seconds)
- Small text: "This usually takes less than a minute"

Clean, professional, feels like real AI analysis is happening. All text in English.
```

---

### PANTALLA 02 — Dashboard (Home)

```
Web app main dashboard for "BundlerPro", an AI-powered Shopify bundle app. This is the home screen merchants see daily.

Colors: Shopify green #008060, critical red #D72C0D, warning amber #916A00, info blue #2C6ECB, background #F6F6F7. Font: Inter / system-ui.

Shopify admin-style page with left sidebar and main content area.

LEFT SIDEBAR (narrow, dark):
- "BundlerPro ✨" logo at top
- Navigation items: Dashboard (active, green indicator), Bundles, AI Recommendations, Analytics, A/B Tests, Settings
- Bottom: "Free Plan" badge with "Upgrade →" link

MAIN CONTENT:

Top: Page title "Dashboard" with green primary button top-right "Create Bundle"

STAT CARDS ROW — 4 cards horizontally:
- "Average Order Value" — "$73.50" — green badge "↑ 35% vs last month"
- "Bundle Revenue" — "$15,450" — green badge "↑ 12%"
- "Active Bundles" — "38" — subdued "+3 this week"
- "Conversion Rate" — "7.2%" — green badge "↑ 1.1%"

AI RECOMMENDATIONS CARD — White card with subtle sparkle border effect:
Title: "🤖 AI Recommendations (3 new)" with link "View All →"
- Card 1: "✨ Summer Essentials Kit" — 3 product thumbnails — "Confidence: 87% | Est. AOV: +$15 (28%)" — buttons [Create Bundle] [Dismiss]
- Card 2: "✨ Complete Skincare Routine" — 3 product thumbnails — "Confidence: 92% | Est. AOV: +$22 (35%)" — buttons [Create Bundle] [Dismiss]

ACTIVE BUNDLES TABLE — White card:
Title: "Your Bundles" with filter dropdown and gear icon
Table: Title | Status | Views | Purchases | Conv. % | Revenue
- "Summer Essentials" | green "Active" badge | 450 | 23 | 5.1% | $1,840
- "Skincare Routine" | green "Active" badge | 380 | 19 | 5.0% | $1,520
- "Workout Bundle" | amber "Paused" badge | 120 | 5 | 4.2% | $390
- "Winter Sale Pack" | green "Active" badge | 890 | 45 | 5.1% | $3,600
Link: "View all bundles →"

All text in English.
```

---

### PANTALLA 03 — Create/Edit Bundle

```
Web app bundle creation form for "BundlerPro" Shopify app. Two-column layout with form on left and live preview on right.

Colors: Shopify green #008060, background #F6F6F7. Font: Inter.

Top: back arrow + "Create Bundle"

LEFT COLUMN (60%) — Form cards:

Card 1 — "Bundle Details":
- Input: "Title" showing "Summer Essentials Kit"
- Textarea: "Description" showing multi-line text "Perfect combo for hot summer days. Premium t-shirt, comfortable shorts, and a classic cap - all in one bundle. Save 15%!"
- Small green text below textarea: "✨ AI-generated description" with "Regenerate" link

Card 2 — "Products in Bundle":
- 3 product rows each with thumbnail image, product name, price, and X remove button:
  [img] White T-Shirt — $29.00 [×]
  [img] Blue Shorts — $39.00 [×]
  [img] Black Cap — $19.00 [×]
- Button: "+ Add Products" (opens Shopify Resource Picker)

Card 3 — "Pricing":
- "Original Price: $87.00" (auto-calculated, gray)
- Dropdown: "Discount Type" showing "Percentage"
- Input: "Discount Value" showing "15" with % suffix
- Divider line
- "Bundle Price: $73.95" (bold, large, green #008060)
- "Customer Saves: $13.05 (15%)" (green text)

Card 4 — "Display Settings":
- Dropdown: "Show bundle on" — "Product Pages + Cart Page"
- Dropdown: "Widget Position" — "Below Add to Cart"
- Dropdown: "Widget Theme" — "Light (matches most themes)"

Footer: "Save as Draft" outlined | "Publish Bundle" green #008060

RIGHT COLUMN (40%) — "Live Preview" card:
- Preview header: "How it looks on your store"
- Device frame showing a product page mockup with the bundle widget:
  "🎁 Bundle & Save 15%"
  3 small product images in a row with names and individual prices
  "Bundle Price: $73.95 (Save $13.05)"
  Green "Add Bundle to Cart" button

All text in English.
```

---

### PANTALLA 04 — Bundle Details (Analytics)

```
Web app bundle detail/analytics page for "BundlerPro". Shows comprehensive performance data for one bundle.

Colors: Shopify green #008060, blue #2C6ECB, background #F6F6F7. Font: Inter.

Top: back arrow + "Summer Essentials Kit" + green "Active" badge + [Edit] [More ⋯] buttons

STAT CARDS ROW — 3 cards:
- "Views" — "450" — "↑ 12% vs last week"
- "Add to Cart" — "67" — "14.9% rate"
- "Purchases" — "23" — "5.1% conversion"

REVENUE CHART — Card with line chart:
Title: "Revenue Over Time" with period selector [7D] [30D] [90D] [1Y]
Line chart showing upward revenue trend in green #008060 from $500 to $2,000 over 2 weeks
Clean Shopify Polaris chart styling

PRODUCTS IN BUNDLE — Card:
3 products with thumbnails, names, prices
Original: $87.00 (strikethrough)
Bundle Price: $73.95 (green, bold)
Customer Saves: $13.05

A/B TEST SECTION — Card:
Title: "🧪 A/B Test" with button "Enable A/B Test"
Current state: "Not currently running"
Description: "Test different discount percentages to find the optimal price point that maximizes conversions."
If running: show variant A vs B comparison mini cards

RECENT PURCHASES — Card:
Title: "Recent Orders with this Bundle"
Small table: Order | Customer | Date | Revenue
- #1089 | Sarah M. | Feb 17 | $73.95
- #1084 | John D. | Feb 16 | $73.95
- #1081 | Emma W. | Feb 16 | $73.95
Link: "View all orders →"

All text in English.
```

---

### PANTALLA 05 — AI Recommendations

```
Web app AI recommendations screen for "BundlerPro". Shows AI-discovered bundle opportunities from order analysis.

Colors: Shopify green #008060, background #F6F6F7, info blue #2C6ECB. Font: Inter.

Page title: "AI Recommendations" with buttons [Refresh Analysis] [Settings]

Info banner at top (light blue):
"ℹ Based on analysis of 1,234 orders from the last 90 days. Last refreshed: 2 hours ago."

3 RECOMMENDATION CARDS stacked vertically, each premium-looking with subtle gradient border:

CARD 1 — "✨ Summer Essentials Kit":
- AI-generated description: "Perfect combo for hot summer days..."
- 3 product thumbnails in a row: T-Shirt ($29), Shorts ($39), Cap ($19)
- Insights section:
  • Confidence: progress bar 87% (green)
  • "15% of customers buy these together"
  • "2.3× more likely than random"
  • "Estimated AOV increase: +$15 (28%)"
- Buttons: [Create This Bundle] green primary | [Customize] outlined | [Not Interested] plain

CARD 2 — "✨ Complete Skincare Routine":
- 3 products: Cleanser ($18), Toner ($22), Moisturizer ($28)
- Confidence: 92%
- "22% of customers buy together"
- "3.1× more likely"
- "Est. AOV: +$22 (35%)"

CARD 3 — "✨ Home Office Starter Pack":
- 3 products: Desk Lamp ($45), Mousepad ($15), Cable Organizer ($12)
- Confidence: 71%
- "8% buy together"
- "Est. AOV: +$8 (12%)"

Link at bottom: "Show 2 More Recommendations..."

All text in English. Premium, data-driven feel.
```

---

### PANTALLA 06 — A/B Test Setup & Results

```
Web app A/B test screen for "BundlerPro". Shows test configuration and live results.

Colors: Shopify green #008060, variant A blue #2C6ECB, variant B purple #7C3AED, background #F6F6F7. Font: Inter.

Page title: "A/B Test — Summer Essentials Kit" with green "Running" badge

TOP — Test Configuration card:
- "Testing: Discount percentage optimization"
- Variant A (blue badge): 15% discount — $73.95
- Variant B (purple badge): 20% discount — $69.60
- "Started: Feb 10, 2026" | "Min impressions per variant: 100"
- Progress bar: "68 of 100 impressions reached (68%)"

MIDDLE — Live Results comparison, two cards side by side:

LEFT CARD — "Variant A: 15% off" with blue left border:
- Views: 234
- Add to Cart: 35 (15.0%)
- Purchases: 12 (5.1%)
- Revenue: $887.40
- AOV Impact: +$15.00

RIGHT CARD — "Variant B: 20% off" with purple left border:
- Views: 228
- Add to Cart: 48 (21.1%)
- Purchases: 18 (7.9%)
- Revenue: $1,252.80
- AOV Impact: +$11.50
- Star badge: "Leading ⭐"

BOTTOM — Analysis card:
Bar chart comparing Variant A vs B on key metrics (side-by-side bars in blue vs purple)
- Statistical significance: "78% confidence (need 95% to declare winner)"
- Text: "We need ~32 more impressions per variant to reach statistical significance. Estimated completion: Feb 22."
- If complete: "🏆 Winner: Variant B (20% off) — 55% more purchases with acceptable revenue trade-off"
- Buttons: [Stop Test] outlined red | [Apply Winner] green (disabled until significant)

All text in English.
```

---

### PANTALLA 07 — Analytics Dashboard

```
Web app comprehensive analytics dashboard for "BundlerPro". Shows store-wide bundle performance.

Colors: Shopify green #008060, blue #2C6ECB, background #F6F6F7. Font: Inter.

Page title: "Analytics" with [Export CSV] button and date range picker "Last 30 days"

STAT CARDS ROW — 4 cards:
- "AOV Increase" — "+35%" — green "↑ 5% vs prev. period"
- "Bundle Sales" — "89" — green "↑ 12%"
- "Bundle Conversion" — "7.2%" — green "↑ 1.1%"
- "Bundle Revenue" — "$6,582" — green "↑ 18%"

CHART 1 — "Bundle Revenue vs Store Revenue" card:
Dual line chart, 4 weeks on X axis:
- Green solid line = Bundle Revenue (increasing trend)
- Gray dashed line = Total Store Revenue
Shows bundles becoming a larger % of total revenue

CHART 2 — "Top Performing Bundles" table card:
Bundle Name | Views | Purchases | Conv.% | Revenue
- Summer Essentials | 450 | 23 | 5.1% | $1,840
- Skincare Routine | 380 | 19 | 5.0% | $1,520
- Winter Sale Pack | 890 | 45 | 5.1% | $3,600
- Workout Bundle | 120 | 5 | 4.2% | $390
- Tech Starter Kit | 280 | 12 | 4.3% | $960

BOTTOM ROW — Two cards side by side:

Left: "Device Breakdown" — Pie chart:
- Mobile: 65% (green)
- Desktop: 35% (gray)

Right: "Customer Segments":
- "New Customers: 45 (51%)"
- "Returning: 44 (49%)"
- "Avg. Order (bundle buyers): $89.50"
- "Avg. Order (non-bundle): $52.30"
- Green highlight: "Bundle buyers spend 71% more!"

All text in English.
```

---

### PANTALLA 08 — Bundles List

```
Web app bundles list/management screen for "BundlerPro".

Colors: Shopify green #008060, background #F6F6F7. Font: Inter.

Page title: "Bundles" with button "Create Bundle" green #008060

Filter bar: Search input + Status dropdown (All, Active, Paused, Archived) + Sort dropdown (Revenue, Created date, Conversions)

BUNDLE CARDS in grid layout (2 columns), each card containing:

Card 1 — "Summer Essentials Kit":
- Green "Active" badge
- 3 product thumbnails in small row
- "15% off — $73.95"
- Mini stats: "450 views | 23 sales | $1,840 revenue"
- Dropdown menu: Edit, Pause, Duplicate, Archive

Card 2 — "Complete Skincare Routine":
- Green "Active" badge
- 3 thumbnails
- "20% off — $54.40"
- "380 views | 19 sales | $1,520 revenue"

Card 3 — "Workout Bundle":
- Amber "Paused" badge
- 3 thumbnails
- "10% off — $76.50"
- "120 views | 5 sales | $390 revenue"

Card 4 — "Winter Sale Pack":
- Green "Active" badge
- 4 thumbnails
- "25% off — $112.50"
- "890 views | 45 sales | $3,600 revenue"

Card 5 — "Tech Starter Kit":
- Green "Active" + Blue "A/B Test" badge
- 3 thumbnails
- "Testing: 15% vs 20%"
- "280 views | 12 sales | $960 revenue"

Card 6 — "Holiday Gift Set":
- Red "Archived" badge, slightly grayed out
- 4 thumbnails
- "30% off — expired"

Pagination: "Showing 6 of 12 bundles" with page numbers

All text in English.
```

---

### PANTALLA 09 — Storefront Widget Preview

```
Web app widget customization screen for "BundlerPro". Left panel for settings, right panel for live storefront preview.

Colors: Shopify green #008060, background #F6F6F7. Font: Inter.

Page title: "Widget Appearance"

TWO-COLUMN LAYOUT:

LEFT (45%) — "Widget Settings" card:

Section "Layout":
- Radio: ● Horizontal (products in row) ○ Vertical (products stacked) ○ Carousel
- Dropdown: "Position" — "Below Add to Cart button"

Section "Colors":
- Color picker: "Button color" showing #008060
- Color picker: "Badge color" showing #008060
- Color picker: "Background" showing #FFFFFF
- Toggle: "☑ Match store theme automatically"

Section "Text":
- Input: "Widget title" showing "🎁 Bundle & Save {discount}%"
- Input: "Button text" showing "Add Bundle to Cart"
- Input: "Savings text" showing "Save {amount}!"

Section "Display":
- Toggle: "☑ Show product images"
- Toggle: "☑ Show individual prices"
- Toggle: "☑ Show savings badge"
- Toggle: "☐ Show confidence indicator"

Button: "Save Changes" green

RIGHT (55%) — "Live Preview" card:
Shows a realistic product page mockup with a bundle widget embedded:
- Product hero area (gray placeholder image of a t-shirt)
- Price: $29.00
- "Add to Cart" button
- Below: Bundle widget:
  "🎁 Bundle & Save 15%"
  3 product thumbnail images with names and prices
  Strikethrough original price $87.00
  "Bundle Price: $73.95"
  Green savings badge: "Save $13.05!"
  Green "Add Bundle to Cart" button
- Toggle at bottom: "Preview: [Desktop] [Mobile]"

All text in English.
```

---

### PANTALLA 10 — Settings

```
Web app settings screen for "BundlerPro" Shopify app.

Colors: Shopify green #008060, background #F6F6F7. Font: Inter. Shopify Polaris style.

Page title: "Settings"

4 settings cards stacked:

Card 1 — "📊 Plan & Billing":
- "Current Plan: Pro ($49/month)" with green "Active" badge
- "Next billing: February 15, 2026"
- "Bundles: 38 / Unlimited"
- "AI Recommendations: Unlimited"
- "A/B Tests: Unlimited"
- Buttons: [Upgrade to Enterprise] [Change Plan] [Cancel Plan red text]

Card 2 — "🤖 AI Settings":
- Toggle: "☑ Auto-generate bundle descriptions (GPT-4)"
- Toggle: "☑ Auto-create bundles from recommendations (requires review)"
- Slider: "Minimum Confidence for Recommendations: 70%"
- Radio: "Refresh Recommendations: ○ Daily ● Weekly ○ Monthly"
- Button: "Save Changes"

Card 3 — "🎨 Default Appearance":
- Dropdown: "Default Discount Type: Percentage"
- Input: "Default Discount Value: 15%"
- Dropdown: "Default Widget Theme: Light"
- Dropdown: "Default Widget Position: Below Add to Cart"
- Button: "Save Changes"

Card 4 — "📧 Notifications":
- Toggle: "☑ Email me weekly performance reports"
- Toggle: "☑ Notify when new recommendations are available"
- Toggle: "☑ Alert when A/B test is complete"
- Toggle: "☐ Send daily digest of bundle performance"
- Button: "Save Changes"

All text in English.
```

---

### PANTALLA 11 — Billing / Pricing Page

```
Web app billing and pricing page for "BundlerPro" Shopify app.

Colors: Shopify green #008060, background #F6F6F7. Font: Inter.

Page title: "Plans & Billing"

3 PRICING CARDS side by side, center one larger/highlighted:

Card 1 — "Free":
- "$0/month"
- Features with checkmarks:
  ✅ 3 active bundles
  ✅ Basic analytics
  ✅ Manual bundle creation
  ❌ AI recommendations
  ❌ A/B testing
  ❌ Priority support
- "Current Plan" gray badge (if active)

Card 2 — "Pro" (HIGHLIGHTED, green border, "Most Popular" badge):
- "$49/month"
- "14-day free trial"
- Features:
  ✅ Unlimited bundles
  ✅ Advanced analytics
  ✅ AI-powered recommendations
  ✅ A/B testing
  ✅ Auto-generated descriptions (GPT-4)
  ✅ Priority support
- Green button: "Start Free Trial"

Card 3 — "Enterprise":
- "$199/month"
- Features:
  ✅ Everything in Pro
  ✅ Custom AI training
  ✅ API access
  ✅ Multi-store support
  ✅ Dedicated account manager
  ✅ Custom integrations
- Outlined button: "Contact Sales"

BELOW — FAQ section:
- "Can I change plans anytime?" → "Yes..."
- "What happens after free trial?" → "You'll be charged..."
- "Do you offer annual discounts?" → "Yes, save 20%..."

BILLING HISTORY TABLE card at bottom:
Date | Description | Amount | Status
Feb 1 | Pro Plan | $49.00 | green "Paid" | Download
Jan 1 | Pro Plan | $49.00 | green "Paid" | Download

All text in English.
```

---

### ESTADOS — Empty State (No Bundles)

```
Web app empty state for "BundlerPro" when no bundles exist yet.

Colors: Shopify green #008060. Font: Inter. Background #F6F6F7.

Centered on page:
- Illustration: A simple, friendly illustration of gift boxes with sparkle effects (line art style)
- Heading: "No bundles yet"
- Description: "Start increasing your Average Order Value by creating bundles that your customers will love. Our AI can find the best opportunities for you!"
- Two buttons:
  Primary green: "Get AI Recommendations"
  Secondary outlined: "Create Bundle Manually"
- Small text: "Stores with bundles see an average 28% increase in AOV"

Clean, encouraging. All text in English.
```

---

### ESTADOS — Loading / Skeleton

```
Web app loading skeleton for "BundlerPro" dashboard.

Show the dashboard layout with ALL content replaced by animated gray skeleton blocks:
- Stat cards: 4 gray rounded rectangles with pulsing animation
- AI recommendations: card with gray block title and 2 gray product thumbnail rectangles
- Table: skeleton rows with animated gray bars
- No spinner — only Shopify Polaris-style skeleton loaders

Background #F6F6F7, skeleton blocks #E1E3E5 with lighter pulse animation.
```

---

## PARTE 3: Workflow completo — De Stitch a entregable final

### Carpeta de organización

```
BundlerPro_Mockups/
├── 01_welcome/
│   ├── mockup.png
│   └── index.html
├── 01b_analyzing/
├── 02_dashboard/
├── 03_create_bundle/
├── 04_bundle_details/
├── 05_ai_recommendations/
├── 06_ab_test/
├── 07_analytics/
├── 08_bundles_list/
├── 09_widget_preview/
├── 10_settings/
├── 11_billing/
└── estados/
    ├── empty_state.png
    └── skeleton.png
```
