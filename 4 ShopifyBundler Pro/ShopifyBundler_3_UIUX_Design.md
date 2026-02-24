# 🎨 SHOPIFYBUNDLER PRO
## UI/UX Design Specifications

**Versión:** 1.0  
**Fecha:** Enero 2026  
**Audiencia:** Diseñadores, Frontend Developers  
**Clasificación:** Interno - Confidencial

---

# 📋 ÍNDICE

1. [Visión de Diseño](#vision-diseno)
2. [Design System](#design-system)
3. [User Flows](#user-flows)
4. [Pantallas y Wireframes](#pantallas-wireframes)
5. [Componentes UI](#componentes-ui)
6. [Estados e Interacciones](#estados-interacciones)
7. [Responsive Design](#responsive-design)
8. [Accesibilidad](#accesibilidad)
9. [Mockups Detallados](#mockups-detallados)
10. [Prompts para IA de Diseño](#prompts-ia-diseno)

---

# 🎯 VISIÓN DE DISEÑO {#vision-diseno}

## Principios de Diseño

### 1. Claridad sobre Decoración
- Interfaces limpias sin elementos innecesarios
- Información jerarquizada visualmente
- CTAs claros y obvios

### 2. Datos Visuales
- Charts > Tablas cuando sea posible
- Iconos + texto para rápida comprensión
- Color coding para estados (verde=bueno, rojo=malo)

### 3. Velocidad Percibida
- Loading states que no parezcan bugs
- Skeleton loaders en lugar de spinners
- Feedback inmediato en acciones

### 4. Shopify Native Feel
- Usar Shopify Polaris 100%
- No inventar patterns nuevos
- Merchant se debe sentir "en casa"

### 5. Mobile-First Thinking
- Diseñar para móvil primero
- Progresivamente enhance para desktop
- Touch targets ≥44px

---

## Paleta de Colores

**Shopify Polaris Colors (usar estas):**

```css
/* Primary */
--p-color-bg-primary: #008060;        /* Shopify green */
--p-color-bg-primary-hover: #006e52;
--p-color-bg-primary-active: #005e46;

/* Critical (errors) */
--p-color-bg-critical: #d72c0d;
--p-color-text-critical: #d72c0d;

/* Warning */
--p-color-bg-warning: #916a00;
--p-color-text-warning: #916a00;

/* Success */
--p-color-bg-success: #008060;
--p-color-text-success: #008060;

/* Info */
--p-color-bg-info: #2c6ecb;
--p-color-text-info: #2c6ecb;

/* Backgrounds */
--p-color-bg: #f6f6f7;                /* Page background */
--p-color-bg-surface: #ffffff;        /* Card background */
--p-color-bg-surface-hover: #f6f6f7;

/* Text */
--p-color-text: #202223;              /* Primary text */
--p-color-text-subdued: #6d7175;      /* Secondary text */
--p-color-text-disabled: #8c9196;

/* Borders */
--p-color-border: #c9cccf;
--p-color-border-subdued: #e1e3e5;
```

---

## Tipografía

**Shopify Sans (sistema):**

```css
/* Headings */
h1 { 
  font-size: 28px; 
  font-weight: 600; 
  line-height: 36px;
}

h2 { 
  font-size: 20px; 
  font-weight: 600; 
  line-height: 28px;
}

h3 { 
  font-size: 16px; 
  font-weight: 600; 
  line-height: 24px;
}

/* Body */
body { 
  font-size: 14px; 
  font-weight: 400; 
  line-height: 20px;
}

/* Small */
.text-small { 
  font-size: 13px; 
  line-height: 18px;
}

/* Caption */
.text-caption { 
  font-size: 12px; 
  line-height: 16px;
}
```

---

## Espaciado

**Sistema 4px:**

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

---

## Iconografía

**Shopify Polaris Icons:**
- Usar SOLO iconos de Shopify Polaris
- Tamaño: 20px × 20px (default)
- Color: Heredar del texto

**Iconos comunes:**
```tsx
import {
  BundleMajor,           // Para bundles
  ProductsMajor,         // Para productos
  AnalyticsMajor,        // Para analytics
  RefreshMajor,          // Para refresh recommendations
  SettingsMajor,         // Para settings
  CircleTickMajor,       // Para success
  CircleAlertMajor,      // Para errors
  QuestionMarkMajor,     // Para help
} from '@shopify/polaris-icons';
```

---

# 🎨 DESIGN SYSTEM {#design-system}

## Botones

### Primary Button
```tsx
<Button primary>
  Create Bundle
</Button>
```
**Uso:** Acción principal de la pantalla (1 por página)

---

### Secondary Button
```tsx
<Button>
  Cancel
</Button>
```
**Uso:** Acciones secundarias

---

### Destructive Button
```tsx
<Button destructive>
  Delete Bundle
</Button>
```
**Uso:** Acciones destructivas (eliminar, archivar)

---

### Plain Button
```tsx
<Button plain>
  Learn More
</Button>
```
**Uso:** Acciones terciarias, links

---

## Cards

### Basic Card
```tsx
<Card title="Bundle Performance">
  <p>Content here</p>
</Card>
```

### Card con acciones
```tsx
<Card 
  title="Summer Essentials"
  actions={[
    { content: 'Edit' },
    { content: 'Delete', destructive: true }
  ]}
>
  <p>Bundle details</p>
</Card>
```

### Card sectioned
```tsx
<Card>
  <Card.Section title="Products">
    <p>Product list</p>
  </Card.Section>
  
  <Card.Section title="Pricing">
    <p>Pricing details</p>
  </Card.Section>
</Card>
```

---

## Badges

```tsx
{/* Status badges */}
<Badge status="success">Active</Badge>
<Badge status="warning">Paused</Badge>
<Badge status="critical">Archived</Badge>
<Badge status="info">Draft</Badge>

{/* Progress badges */}
<Badge progress="complete">Complete</Badge>
<Badge progress="partiallyComplete">In Progress</Badge>
<Badge progress="incomplete">Not Started</Badge>
```

---

## Data Visualization

### Polaris Chart (Simple)
```tsx
import { LineChart } from '@shopify/polaris-viz';

<LineChart
  data={[
    {
      name: 'Bundle Revenue',
      data: [
        { key: 'Jan 1', value: 100 },
        { key: 'Jan 2', value: 150 },
        { key: 'Jan 3', value: 200 },
      ],
    },
  ]}
/>
```

### Recharts (Advanced)
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

<LineChart width={600} height={300} data={data}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line 
    type="monotone" 
    dataKey="revenue" 
    stroke="#008060" 
    strokeWidth={2}
  />
</LineChart>
```

---

# 🔄 USER FLOWS {#user-flows}

## Flow 1: Onboarding (First Install)

```
┌─────────────────────────────────────────────────────┐
│ USER INSTALLS APP FROM SHOPIFY APP STORE           │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ STEP 1: WELCOME SCREEN                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ "Welcome to BundlerPro! 👋"                     │ │
│ │                                                  │ │
│ │ Let's create your first bundle in 3 easy steps │ │
│ │                                                  │ │
│ │ [Start Tour] [Skip to Dashboard]                │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: GET AI RECOMMENDATIONS                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ "Analyzing your store data..."                  │ │
│ │                                                  │ │
│ │ [████████░░] 80% complete                       │ │
│ │                                                  │ │
│ │ Found 1,234 orders from last 90 days           │ │
│ │ Discovering bundle opportunities...             │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: RECOMMENDED BUNDLES                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ✨ We found 5 bundle opportunities              │ │
│ │                                                  │ │
│ │ [Card] "Summer Essentials"                      │ │
│ │ Products: T-shirt + Shorts + Cap                │ │
│ │ Confidence: 87% | Est. AOV: +€15 (28%)         │ │
│ │ [Create This Bundle]                            │ │
│ │                                                  │ │
│ │ [Card] "Skincare Routine"                       │ │
│ │ Products: Cleanser + Toner + Moisturizer       │ │
│ │ [Create This Bundle]                            │ │
│ │                                                  │ │
│ │ [View All Recommendations]                      │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ STEP 4: BUNDLE CREATED SUCCESS                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ✅ Your first bundle is live!                   │ │
│ │                                                  │ │
│ │ "Summer Essentials" is now showing on:         │ │
│ │ - Product pages ✓                               │ │
│ │ - Cart page ✓                                   │ │
│ │                                                  │ │
│ │ [Go to Dashboard] [Create Another Bundle]      │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Flow 2: Create Bundle (Manual)

```
Dashboard → [Create Bundle] button
           │
           ▼
    Bundle Form Screen
    ├─ Enter title
    ├─ Enter description
    ├─ Select products (Resource Picker)
    ├─ Set discount
    └─ [Save]
           │
           ▼
    Bundle Preview Modal
    ├─ Review details
    ├─ Preview how it looks
    └─ [Confirm & Publish]
           │
           ▼
    Success Toast
    └─ Redirect to Bundle Details
```

---

## Flow 3: A/B Test Bundle

```
Bundle Details Screen → [Enable A/B Test]
                        │
                        ▼
                  A/B Test Setup Modal
                  ├─ Variant A discount: 15%
                  ├─ Variant B discount: 20%
                  ├─ Min impressions: 100
                  └─ [Start Test]
                        │
                        ▼
                  Test Running Dashboard
                  ├─ Real-time metrics
                  ├─ Variant A vs B comparison
                  └─ [Stop Test] when ready
                        │
                        ▼
                  Winner Declared
                  ├─ Statistical analysis
                  ├─ Recommendation
                  └─ [Apply Winner]
```

---

# 📱 PANTALLAS Y WIREFRAMES {#pantallas-wireframes}

## 1. Dashboard (Home)

### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│ [Logo] BundlerPro          [Help] [Settings] [👤 Shop]    │ ← TopBar
├────────────────────────────────────────────────────────────┤
│ ┌──────────┐                                               │
│ │ Dashboard│ ← Navigation (Sidebar en desktop, bottom nav  │
│ │ Bundles  │    en mobile)                                 │
│ │ Analytics│                                                │
│ │ Settings │                                                │
│ └──────────┘                                               │
│            ┌──────────────────────────────────────────┐    │
│            │ DASHBOARD CONTENT                        │    │
│            │                                          │    │
│            │ [Stats Cards Row]                        │    │
│            │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │    │
│            │ │ AOV  │ │Revenue│ │Bundles││ Conv.│   │    │
│            │ └──────┘ └──────┘ └──────┘ └──────┘   │    │
│            │                                          │    │
│            │ [AI Recommendations Card]                │    │
│            │ [Active Bundles Table]                   │    │
│            │ [Recent Activity]                        │    │
│            │                                          │    │
│            └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### Wireframe Detallado

```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard                               [+ Create Bundle]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Average AOV │  │Bundle Revenue│  │Active Bundles│         │
│  │             │  │              │  │              │         │
│  │   $73.50    │  │  $15,450     │  │      38      │         │
│  │   ↑ 35%     │  │  ↑ 12%       │  │   +3 this wk │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🤖 AI Recommendations (3)               [View All →] │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ ✨ "Summer Essentials Kit"                     │   │  │
│  │ │ Products: T-shirt + Shorts + Cap               │   │  │
│  │ │ Confidence: 87% | Est. AOV: +$15 (28%)        │   │  │
│  │ │                                                 │   │  │
│  │ │ [Create Bundle]  [Dismiss]                     │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ ✨ "Complete Skincare Routine"                 │   │  │
│  │ │ Products: Cleanser + Toner + Moisturizer       │   │  │
│  │ │ Confidence: 92% | Est. AOV: +$22 (35%)        │   │  │
│  │ │                                                 │   │  │
│  │ │ [Create Bundle]  [Dismiss]                     │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Your Bundles                          [Filter ▼] [⚙] │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Title              Status   Views  Purchases  Revenue │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Summer Essentials  ●Active   450      23      $1,840 │  │
│  │ Skincare Routine   ●Active   380      19      $1,520 │  │
│  │ Workout Bundle     ⏸Paused   120       5        $390 │  │
│  │ Winter Sale Pack   ●Active   890      45      $3,600 │  │
│  │                                                        │  │
│  │ [Load More...]                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Create/Edit Bundle

### Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Bundles      Create Bundle                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────┐  ┌──────────────┐  │
│  │ BUNDLE DETAILS                      │  │ PREVIEW      │  │
│  │                                     │  │              │  │
│  │ Title                               │  │ [Live preview│  │
│  │ [Summer Essentials____________]    │  │  of bundle   │  │
│  │                                     │  │  widget]     │  │
│  │ Description                         │  │              │  │
│  │ [Perfect combo for hot days...]    │  │              │  │
│  │ [________________________]          │  │              │  │
│  │ [________________________]          │  │              │  │
│  │                                     │  │              │  │
│  │ ─────────────────────────────────  │  └──────────────┘  │
│  │                                     │                    │
│  │ PRODUCTS IN BUNDLE                  │                    │
│  │                                     │                    │
│  │ ┌───────────────────────────────┐  │                    │
│  │ │ [img] White T-Shirt           │  │                    │
│  │ │       $29.00           [X]    │  │                    │
│  │ └───────────────────────────────┘  │                    │
│  │                                     │                    │
│  │ ┌───────────────────────────────┐  │                    │
│  │ │ [img] Blue Shorts             │  │                    │
│  │ │       $39.00           [X]    │  │                    │
│  │ └───────────────────────────────┘  │                    │
│  │                                     │                    │
│  │ ┌───────────────────────────────┐  │                    │
│  │ │ [img] Black Cap               │  │                    │
│  │ │       $19.00           [X]    │  │                    │
│  │ └───────────────────────────────┘  │                    │
│  │                                     │                    │
│  │ [+ Add Products]                    │                    │
│  │                                     │                    │
│  │ ─────────────────────────────────  │                    │
│  │                                     │                    │
│  │ PRICING                             │                    │
│  │                                     │                    │
│  │ Original Price:           $87.00   │                    │
│  │                                     │                    │
│  │ Discount Type:   [Percentage ▼]    │                    │
│  │ Discount Value:  [15_______] %     │                    │
│  │                                     │                    │
│  │ Bundle Price:             $73.95   │                    │
│  │ Customer Saves:           $13.05   │                    │
│  │                                     │                    │
│  │ ─────────────────────────────────  │                    │
│  │                                     │                    │
│  │ [Cancel]              [Save Bundle] │                    │
│  │                                     │                    │
│  └─────────────────────────────────────┘                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Bundle Details (Analytics View)

### Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back         Summer Essentials              [Edit] [⋮]    │
│                                                               │
│  Status: ●Active   Created: Jan 15, 2026                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Views     │  │ Add-to-Cart │  │  Purchases  │         │
│  │             │  │             │  │             │         │
│  │    450      │  │     67      │  │     23      │         │
│  │  ↑ 12%      │  │  14.9% rate │  │  5.1% conv. │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Revenue Over Time                  [7D][30D][90D][1Y]│  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │     $                                                  │  │
│  │  2000│                                        ●        │  │
│  │      │                                   ●             │  │
│  │  1500│                             ●                   │  │
│  │      │                       ●                         │  │
│  │  1000│                 ●                               │  │
│  │      │           ●                                     │  │
│  │   500│     ●                                           │  │
│  │      │                                                 │  │
│  │     0├──────────────────────────────────────────────  │  │
│  │      Jan15  Jan18  Jan21  Jan24  Jan27  Jan30       │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Products in Bundle                                     │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ [img] White T-Shirt                           $29.00  │  │
│  │ [img] Blue Shorts                             $39.00  │  │
│  │ [img] Black Cap                               $19.00  │  │
│  │                                               ───────  │  │
│  │ Original Price:                               $87.00  │  │
│  │ Bundle Price (15% off):                       $73.95  │  │
│  │ Customer Saves:                               $13.05  │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🧪 A/B Test                        [Enable A/B Test] │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ Not currently running                                 │  │
│  │                                                        │  │
│  │ Test different discount percentages to find the       │  │
│  │ optimal price point that maximizes conversions.       │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. AI Recommendations Screen

### Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  AI Recommendations                      [Refresh] [Settings]│
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ℹ️ Based on analysis of 1,234 orders from last 90 days     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ✨ RECOMMENDED BUNDLE #1                              │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ "Summer Essentials Kit"                               │  │
│  │                                                        │  │
│  │ Perfect combo for hot summer days. Premium t-shirt,   │  │
│  │ comfortable shorts, and classic cap - all in one      │  │
│  │ bundle. Save 15% vs buying separately!                │  │
│  │                                                        │  │
│  │ Products:                                              │  │
│  │ ┌──────┐ ┌──────┐ ┌──────┐                           │  │
│  │ │[img] │ │[img] │ │[img] │                           │  │
│  │ │T-shrt│ │Shorts│ │ Cap  │                           │  │
│  │ │$29   │ │$39   │ │$19  │                           │  │
│  │ └──────┘ └──────┘ └──────┘                           │  │
│  │                                                        │  │
│  │ Insights:                                              │  │
│  │ • Confidence: ████████░░ 87%                          │  │
│  │ • 15% of customers buy these together                 │  │
│  │ • 2.3× more likely than random                        │  │
│  │ • Estimated AOV increase: +$15 (28%)                  │  │
│  │                                                        │  │
│  │ [Create This Bundle]  [Customize]  [Not Interested]  │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ✨ RECOMMENDED BUNDLE #2                              │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ "Complete Skincare Routine"                           │  │
│  │                                                        │  │
│  │ Your skin's best friend. Professional 3-step routine  │  │
│  │ that cleanses, tones, and moisturizes. Perfect for   │  │
│  │ daily use. Save 20% in this bundle!                   │  │
│  │                                                        │  │
│  │ Products:                                              │  │
│  │ ┌──────┐ ┌──────┐ ┌──────┐                           │  │
│  │ │[img] │ │[img] │ │[img] │                           │  │
│  │ │Cleanr│ │Toner │ │Moistr│                           │  │
│  │ │$18   │ │$22   │ │$28   │                           │  │
│  │ └──────┘ └──────┘ └──────┘                           │  │
│  │                                                        │  │
│  │ Insights:                                              │  │
│  │ • Confidence: █████████░ 92%                          │  │
│  │ • 22% of customers buy these together                 │  │
│  │ • 3.1× more likely than random                        │  │
│  │ • Estimated AOV increase: +$22 (35%)                  │  │
│  │                                                        │  │
│  │ [Create This Bundle]  [Customize]  [Not Interested]  │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  [Show 3 More Recommendations...]                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Analytics Dashboard

### Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  Analytics                              [Export] [Date Range]│
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Showing: Last 30 days (Jan 1 - Jan 31, 2026)               │
│                                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ AOV Increase│ │Bundle Sales│ │Conversion │ │ Revenue  │ │
│  │             │ │            │ │           │ │          │ │
│  │   +35%      │ │    89      │ │   7.2%    │ │ $6,582   │ │
│  │   ↑ 5%      │ │   ↑ 12%    │ │   ↑ 1.1%  │ │  ↑ 18%   │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Bundle Revenue vs Store Revenue                        │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │   $12k│                                                │  │
│  │       │                                    ●Bundle     │  │
│  │   $10k│                              ●    ─Store      │  │
│  │       │                         ●─────                │  │
│  │    $8k│                    ●────                       │  │
│  │       │               ●────                            │  │
│  │    $6k│          ●────                                 │  │
│  │       │     ●────                                      │  │
│  │    $4k│●────                                           │  │
│  │       │                                                │  │
│  │       ├───────────────────────────────────────────    │  │
│  │       W1  W2  W3  W4  (weeks)                         │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Top Performing Bundles                                 │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Bundle Name         Views  Purchases  Conv.%  Revenue │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Summer Essentials    450      23      5.1%   $1,840  │  │
│  │ Skincare Routine     380      19      5.0%   $1,520  │  │
│  │ Winter Sale Pack     890      45      5.1%   $3,600  │  │
│  │ Workout Bundle       120       5      4.2%     $390  │  │
│  │ Tech Starter Kit     280      12      4.3%     $960  │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────┐  ┌───────────────────────────────┐  │
│  │ Device Breakdown   │  │ Customer Segments             │  │
│  ├────────────────────┤  ├───────────────────────────────┤  │
│  │                    │  │                               │  │
│  │    [Pie Chart]     │  │ New Customers:      45 (51%) │  │
│  │                    │  │ Returning:          44 (49%) │  │
│  │ Mobile:  65%       │  │                               │  │
│  │ Desktop: 35%       │  │ Avg. Order Size:             │  │
│  │                    │  │ Bundle buyers:     $89.50    │  │
│  │                    │  │ Non-bundle:        $52.30    │  │
│  │                    │  │                               │  │
│  └────────────────────┘  └───────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Settings Screen

### Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  Settings                                                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 📊 Plan & Billing                                      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ Current Plan: Pro ($49/month)                         │  │
│  │ Next billing: February 15, 2026                       │  │
│  │                                                        │  │
│  │ [Upgrade to Enterprise] [Change Plan] [Cancel Plan]   │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🎨 Appearance                                          │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ Default Discount Type:  [Percentage ▼]                │  │
│  │ Default Discount Value: [15_______] %                 │  │
│  │                                                        │  │
│  │ Bundle Widget Theme:    [Light ▼]                     │  │
│  │ Widget Position:        [Below Add to Cart ▼]        │  │
│  │                                                        │  │
│  │ [Save Changes]                                         │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🤖 AI Settings                                         │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ ☑ Auto-generate bundle descriptions                   │  │
│  │ ☑ Auto-create bundles from recommendations           │  │
│  │   (requires review before publishing)                 │  │
│  │                                                        │  │
│  │ Minimum Confidence for Recommendations:               │  │
│  │ [▬▬▬▬▬▬▬○▬▬] 70%                                      │  │
│  │                                                        │  │
│  │ Refresh Recommendations:                               │  │
│  │ [ ] Daily  [●] Weekly  [ ] Monthly                    │  │
│  │                                                        │  │
│  │ [Save Changes]                                         │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 📧 Notifications                                       │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ ☑ Email me weekly performance reports                 │  │
│  │ ☑ Notify when new recommendations are available       │  │
│  │ ☑ Alert when A/B test is complete                     │  │
│  │ ☐ Send daily digest of bundle performance            │  │
│  │                                                        │  │
│  │ [Save Changes]                                         │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ⚙️ Advanced                                            │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │ API Access (Enterprise only)                          │  │
│  │ API Key: **********************4f8a   [Regenerate]    │  │
│  │                                                        │  │
│  │ [View API Documentation]                              │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

# 🧩 COMPONENTES UI {#componentes-ui}

## Componente: Stat Card

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
}

<Card sectioned>
  <Stack vertical spacing="tight">
    <TextStyle variation="subdued">{title}</TextStyle>
    <DisplayText size="large">{value}</DisplayText>
    {change && (
      <Badge status={change.trend === 'up' ? 'success' : 'critical'}>
        {change.trend === 'up' ? '↑' : '↓'} {change.value}
      </Badge>
    )}
  </Stack>
</Card>
```

**Uso:**
```tsx
<StatCard
  title="Average Order Value"
  value="$73.50"
  change={{ value: '35%', trend: 'up' }}
/>
```

---

## Componente: Bundle Card (Recommendation)

```tsx
interface BundleCardProps {
  title: string;
  description: string;
  products: Product[];
  confidence: number;
  estimatedIncrease: string;
  onAccept: () => void;
  onDismiss: () => void;
}

<Card>
  <Card.Section>
    <Stack vertical spacing="loose">
      <Stack vertical spacing="tight">
        <Heading>✨ {title}</Heading>
        <TextStyle>{description}</TextStyle>
      </Stack>
      
      <Stack distribution="fillEvenly">
        {products.map(product => (
          <Stack vertical alignment="center">
            <Thumbnail source={product.image} size="large" />
            <TextStyle variation="subdued">{product.title}</TextStyle>
            <TextStyle>${product.price}</TextStyle>
          </Stack>
        ))}
      </Stack>
      
      <Stack vertical spacing="extraTight">
        <ProgressBar progress={confidence} size="small" />
        <TextStyle variation="subdued">
          Confidence: {confidence}%
        </TextStyle>
      </Stack>
      
      <Banner status="info">
        <p>Estimated AOV increase: {estimatedIncrease}</p>
      </Banner>
      
      <Stack distribution="trailing">
        <Button onClick={onDismiss} plain>Dismiss</Button>
        <Button primary onClick={onAccept}>
          Create This Bundle
        </Button>
      </Stack>
    </Stack>
  </Card.Section>
</Card>
```

---

## Componente: Empty State

```tsx
<EmptyState
  heading="No bundles yet"
  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  action={{
    content: 'Create Your First Bundle',
    url: '/bundles/create'
  }}
  secondaryAction={{
    content: 'Get AI Recommendations',
    url: '/recommendations'
  }}
>
  <p>
    Start increasing your Average Order Value by creating 
    bundles that your customers will love.
  </p>
</EmptyState>
```

---

## Componente: Loading Skeleton

```tsx
<Card sectioned>
  <SkeletonPage>
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <SkeletonBodyText lines={3} />
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
</Card>
```

---

# ⚡ ESTADOS E INTERACCIONES {#estados-interacciones}

## Estados de Bundle

### Active
```tsx
<Badge status="success">Active</Badge>
```
- Color: Verde
- Visible en storefront
- Tracking activo

### Paused
```tsx
<Badge status="warning">Paused</Badge>
```
- Color: Amarillo
- No visible en storefront
- Datos históricos preservados

### Archived
```tsx
<Badge status="critical">Archived</Badge>
```
- Color: Rojo
- Soft deleted
- Solo visible en "Archived" filter

---

## Loading States

### Button Loading
```tsx
<Button 
  primary 
  loading={isCreating}
  disabled={isCreating}
>
  {isCreating ? 'Creating...' : 'Create Bundle'}
</Button>
```

### Spinner
```tsx
<Stack alignment="center" distribution="center">
  <Spinner size="large" />
  <TextStyle>Analyzing your store data...</TextStyle>
</Stack>
```

### Skeleton
```tsx
{isLoading ? (
  <SkeletonBodyText lines={5} />
) : (
  <TextContainer>
    {content}
  </TextContainer>
)}
```

---

## Toasts (Success/Error)

### Success Toast
```tsx
const showSuccessToast = () => {
  shopify.toast.show('Bundle created successfully!', {
    duration: 3000,
  });
};
```

### Error Toast
```tsx
const showErrorToast = () => {
  shopify.toast.show('Failed to create bundle', {
    duration: 5000,
    isError: true,
  });
};
```

---

## Modals

### Confirmation Modal
```tsx
<Modal
  open={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  title="Delete bundle?"
  primaryAction={{
    content: 'Delete',
    destructive: true,
    onAction: handleDelete,
  }}
  secondaryActions={[{
    content: 'Cancel',
    onAction: () => setShowDeleteModal(false),
  }]}
>
  <Modal.Section>
    <TextContainer>
      <p>
        This will permanently delete "Summer Essentials" bundle. 
        This action cannot be undone.
      </p>
    </TextContainer>
  </Modal.Section>
</Modal>
```

---

## Hover States

### Card Hover
```css
.bundle-card {
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}

.bundle-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Button Hover
```css
.button-primary:hover {
  background-color: var(--p-color-bg-primary-hover);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

---

# 📱 RESPONSIVE DESIGN {#responsive-design}

## Breakpoints

```css
/* Mobile (default) */
@media (min-width: 0px) {
  /* Styles para mobile */
}

/* Tablet */
@media (min-width: 768px) {
  /* Styles para tablet */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Styles para desktop */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Styles para large screens */
}
```

---

## Responsive Grid

```tsx
<Layout>
  {/* Mobile: Stack vertical */}
  {/* Tablet: 2 columns */}
  {/* Desktop: 3 columns */}
  
  <Layout.Section oneThird>
    <Card>...</Card>
  </Layout.Section>
  
  <Layout.Section oneThird>
    <Card>...</Card>
  </Layout.Section>
  
  <Layout.Section oneThird>
    <Card>...</Card>
  </Layout.Section>
</Layout>
```

---

## Mobile Navigation

### Bottom Nav (Mobile)
```tsx
<Navigation location="/">
  <Navigation.Section
    items={[
      {
        label: 'Dashboard',
        icon: HomeMajor,
        url: '/',
      },
      {
        label: 'Bundles',
        icon: BundleMajor,
        url: '/bundles',
      },
      {
        label: 'Analytics',
        icon: AnalyticsMajor,
        url: '/analytics',
      },
      {
        label: 'Settings',
        icon: SettingsMajor,
        url: '/settings',
      },
    ]}
  />
</Navigation>
```

---

## Touch Targets

**Mínimo 44px × 44px:**

```css
.button-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

.icon-button-mobile {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

# ♿ ACCESIBILIDAD {#accesibilidad}

## Contraste de Color

Mínimo WCAG AA:
- Texto normal: 4.5:1
- Texto grande: 3:1
- UI components: 3:1

```css
/* ✅ Good contrast */
.text-on-white {
  color: #202223; /* Ratio: 16.2:1 */
}

/* ❌ Poor contrast */
.text-on-white-bad {
  color: #d3d3d3; /* Ratio: 1.5:1 - FAIL */
}
```

---

## Keyboard Navigation

**Tab order lógico:**

```tsx
<Form onSubmit={handleSubmit}>
  <TextField 
    label="Bundle Title"
    autoFocus
    tabIndex={1}
  />
  
  <TextField 
    label="Description"
    tabIndex={2}
  />
  
  <Button 
    primary 
    submit
    tabIndex={3}
  >
    Save Bundle
  </Button>
</Form>
```

---

## ARIA Labels

```tsx
<button 
  aria-label="Delete bundle"
  onClick={handleDelete}
>
  <Icon source={DeleteMajor} />
</button>

<div 
  role="alert" 
  aria-live="polite"
>
  {toastMessage}
</div>

<nav aria-label="Main navigation">
  <Navigation>...</Navigation>
</nav>
```

---

## Screen Reader Support

```tsx
<VisuallyHidden>
  <h1>Dashboard - BundlerPro</h1>
</VisuallyHidden>

<img 
  src={product.image} 
  alt={`${product.title} product image`}
/>

<button>
  <Icon source={RefreshMajor} />
  <VisuallyHidden>Refresh recommendations</VisuallyHidden>
</button>
```

---

# 🖼️ MOCKUPS DETALLADOS {#mockups-detallados}

## Mockup 1: Dashboard Principal

**Descripción visual:**
```
Pantalla completa del dashboard con:
- Header con logo BundlerPro (izquierda) y user menu (derecha)
- Sidebar navigation con 4 items: Dashboard, Bundles, Analytics, Settings
- Area principal con:
  * 4 stat cards en fila (AOV, Revenue, Bundles, Conversión)
  * Card "AI Recommendations" con 2 bundles sugeridos
  * Tabla "Your Bundles" con 5 filas de bundles activos
- Estilo: Shopify Polaris design system
- Colores: Blanco background, verde Shopify para accents
- Tipografía: Shopify Sans
```

**Elementos clave:**
- Stat cards con iconos grandes
- Charts inline en cada stat
- Badges de colores para estados
- Botón CTA verde prominente "Create Bundle"

---

## Mockup 2: Create Bundle Form

**Descripción visual:**
```
Layout 2 columnas:

COLUMNA IZQUIERDA (Form):
- Input "Title" con placeholder
- Textarea "Description" 
- Sección "Products" con 3 productos seleccionados
  * Cada producto: thumbnail + nombre + precio + botón X
- Botón "+ Add Products"
- Sección "Pricing":
  * Dropdown "Discount Type"
  * Input "Discount Value" con % suffix
  * Resumen pricing: Original, Bundle, Savings
- Botones footer: Cancel (izq) y Save Bundle (derecha, verde)

COLUMNA DERECHA (Preview):
- Card "Preview" con título
- Mockup de cómo se verá el bundle en storefront
- Actualiza en tiempo real conforme editas

Estilo: Clean, espaciado generoso, form validation visible
```

---

## Mockup 3: Bundle Details + Analytics

**Descripción visual:**
```
Header:
- Título bundle grande
- Badge "Active" verde
- Botones: Edit, More options (3 dots)

3 Stat cards en fila:
- Views (450, up arrow 12%)
- Add-to-Cart (67, 14.9% rate)
- Purchases (23, 5.1% conversion)

Line chart grande:
- Título: "Revenue Over Time"
- Tabs: 7D, 30D, 90D, 1Y (30D selected)
- Chart verde Shopify con puntos en cada data point
- Tooltips on hover

Card "Products in Bundle":
- 3 productos con thumbnails horizontal
- Pricing summary abajo

Card "A/B Test":
- Status: "Not running"
- Descripción breve
- Botón "Enable A/B Test"

Estilo: Data visualization prominente, colores suaves
```

---

## Mockup 4: AI Recommendations

**Descripción visual:**
```
Header:
- Título "AI Recommendations"
- Info badge: "Based on 1,234 orders"
- Botón "Refresh" (derecha)

2 Cards grandes (recommendation bundles):

CARD 1:
- Emoji sparkles ✨ + Título bundle
- Descripción generada por GPT-4 (2-3 líneas)
- 3 productos en fila horizontal con thumbnails
- "Insights" section:
  * Progress bar "Confidence: 87%"
  * Bullets: Support, Lift, AOV increase
- Botones: "Create Bundle" (verde) + "Dismiss" (texto)

CARD 2:
- Mismo layout
- Diferentes productos
- Confianza 92% (más alta)

Estilo: Cards con sombra suave, whitespace generoso,
        insights con iconos, colores para métricas
```

---

## Mockup 5: A/B Test Running

**Descripción visual:**
```
Modal overlay centro pantalla:

Header:
- Título "A/B Test Running"
- Badge "7 days running"
- Botón X cerrar

2 columnas comparando variantes:

COLUMNA A:                 COLUMNA B:
Discount: 15%              Discount: 20%
────────────────           ────────────────
Impressions: 225           Impressions: 225
Add-to-cart: 34            Add-to-cart: 45
Purchases: 10              Purchases: 13
Conversion: 4.44%          Conversion: 5.78% ← winning
Revenue: $739.50           Revenue: $884.35 ← winning

Footer:
- Badge "Confidence: 82.5%"
- Text: "Need 95% for winner"
- Botones: "Continue Test" / "Stop Test"

Estilo: Tabla comparativa, winner highlighted con verde suave,
        progress hacia significance clara
```

---

## Mockup 6: Mobile Dashboard

**Descripción visual:**
```
Mobile viewport (375px):

Top Bar:
- Hamburger menu (left)
- "BundlerPro" center
- User avatar (right)

Stats cards stacked vertical:
- Card 1: AOV $73.50 ↑35%
- Card 2: Revenue $15,450 ↑12%
- Card 3: Bundles 38 +3
- (cada card full width, compacta)

AI Recommendations:
- Título + badge "3 new"
- 1 recommendation card visible
- Swipeable carousel (dots below)

Bundle List:
- Simplified table / cards
- Show: Name, Status badge, Revenue
- Tap to expand

Bottom Navigation:
- 4 tabs: Dashboard, Bundles, Analytics, Settings
- Icons + labels
- Active tab: verde

Estilo: Touch-friendly, spacing aumentado, 
        scroll vertical fluido
```

---

# 🤖 PROMPTS PARA IA DE DISEÑO {#prompts-ia-diseno}

## Herramientas Recomendadas

1. **Figma AI (autogeneración)**
2. **Midjourney** (para renders realistas)
3. **DALL-E 3** (para UI screenshots)
4. **Stable Diffusion** (control fino)

---

## Prompt 1: Dashboard Principal (Midjourney/DALL-E)

```
Create a high-fidelity mockup of a SaaS dashboard for a Shopify app 
called "BundlerPro". 

Layout:
- Clean, modern design following Shopify Polaris design system
- White background (#F6F6F7)
- Top navigation bar with logo on left, user menu on right
- Left sidebar with 4 navigation items (Dashboard, Bundles, Analytics, Settings)
- Main content area with:
  * 4 metric cards in a row (Average Order Value, Bundle Revenue, Active Bundles, Conversion Rate)
  * Each card shows a large number, percentage change with up/down arrow, and small sparkline chart
  * Section titled "AI Recommendations" with 2 product bundle suggestion cards
  * Table showing "Your Bundles" with 5 rows of data

Style:
- Shopify green (#008060) for primary buttons and accents
- San Francisco/Inter font
- Subtle shadows on cards (0 2px 4px rgba(0,0,0,0.1))
- Professional, minimal, clean aesthetic
- Lots of whitespace
- Rounded corners (8px radius)

Render as: Desktop web application screenshot, 1440x900px, 
high quality, realistic browser chrome, professional lighting
```

---

## Prompt 2: Create Bundle Form (DALL-E 3)

```
Generate a UI mockup of a "Create Bundle" form for an ecommerce app.

Layout: Two-column layout
- Left column (60%): Form inputs
  * Text input "Bundle Title"
  * Text area "Description" (3 rows)
  * Section "Products in Bundle" showing 3 selected products:
    - Each product: small thumbnail image (80x80px), product name, price $29, remove X button
  * Blue "+ Add Products" button
  * Section "Pricing":
    - Dropdown "Discount Type" (Percentage selected)
    - Number input "Discount Value" with % suffix
    - Pricing summary showing:
      Original Price: $87.00
      Bundle Price: $73.95
      Savings: $13.05
  * Bottom buttons: "Cancel" (left) and "Save Bundle" (right, green)

- Right column (40%): Live Preview
  * Card titled "Preview"
  * Shows how bundle will appear on storefront
  * 3 product images stacked
  * Pricing with strikethrough original price

Style: Modern SaaS interface, Shopify aesthetic, clean and minimal,
proper form validation states, accessible design

Format: Web interface screenshot, 1920x1080, professional quality
```

---

## Prompt 3: Analytics Dashboard (Midjourney)

```
Design a data analytics dashboard for a product bundling SaaS application.

Layout:
- Header with title "Analytics" and date range selector "Last 30 days"
- Top row: 4 KPI cards
  * AOV Increase: +35% (green up arrow)
  * Bundle Sales: 89 (gray)
  * Conversion: 7.2% (green)
  * Revenue: $6,582 (green)
- Large line chart section (60% of page):
  * Title: "Bundle Revenue vs Store Revenue"
  * Dual line chart (green line for bundles, gray for store)
  * Time axis showing weeks (W1-W4)
  * Y-axis showing dollar amounts ($0-$12k)
  * Tooltips visible on hover
- Bottom row split 2 columns:
  * Left: "Top Performing Bundles" data table (5 rows)
  * Right: Two smaller cards
    - Pie chart "Device Breakdown" (Mobile 65%, Desktop 35%)
    - "Customer Segments" stats (New vs Returning)

Style: 
- Professional data visualization
- Shopify green (#008060) for primary data
- Gray (#6D7175) for secondary data
- Charts with subtle grid lines
- Clean typography (SF Pro)
- Card-based layout with soft shadows

Format: Desktop dashboard screenshot, 1440x900, high fidelity
```

---

## Prompt 4: AI Recommendation Cards (Stable Diffusion)

```
Create a UI card design for AI-powered product bundle recommendations.

Card specifications:
- White background with subtle shadow
- Rounded corners (12px)
- Padding: 24px all sides
- Width: 600px, auto height

Content structure:
- Header: Sparkle emoji ✨ + Title "Summer Essentials Kit"
- Subtitle: 2 lines AI-generated description
  "Perfect combo for hot summer days. Premium t-shirt, 
   comfortable shorts, and classic cap - all in one bundle. 
   Save 15% vs buying separately!"
- Products section: 3 product thumbnails horizontal
  * Each: Square image 100x100px, product name below, price
  * Products: White T-shirt $29, Blue Shorts $39, Black Cap $19
- Insights section (light gray background):
  * Progress bar "Confidence: 87%" (green)
  * Bullet points with icons:
    - "15% of customers buy these together"
    - "2.3× more likely than random"
    - "Est. AOV increase: +$15 (28%)"
- Footer: Two buttons
  * "Create Bundle" (green, primary)
  * "Dismiss" (text link)

Style: Modern SaaS, Shopify aesthetic, professional but friendly,
       data-driven insights, clear call-to-action

Render: UI component, front view, centered, professional lighting
```

---

## Prompt 5: Mobile App Interface (Midjourney)

```
Design a mobile app interface (iOS style) for a Shopify bundle management app.

Screen: Dashboard (mobile view)
Viewport: 375x812px (iPhone 13 size)

Layout:
- Status bar: 9:41, signal, wifi, battery (standard iOS)
- Top navigation bar:
  * Hamburger menu icon (left)
  * "BundlerPro" title (center)
  * User avatar (right, circular)
- Main scroll content:
  * 3 stat cards (stacked vertical, full width):
    1. "Average AOV" - $73.50 with green +35% badge
    2. "Bundle Revenue" - $15,450 with +12%
    3. "Active Bundles" - 38 with +3 this week
  * Section "AI Recommendations" with badge "3 new"
  * Horizontal scrollable carousel showing bundle cards
    - Visible: 1 card, hints of next card on right edge
    - Card shows: mini thumbnail, title, 1-line description
    - "Create" button in card
  * Section "Your Bundles"
  * Simplified list items (4 visible)
    - Each: Bundle name, status dot, revenue
- Bottom tab bar (fixed):
  * 4 tabs: Dashboard (active), Bundles, Analytics, Settings
  * Icons + labels, active tab in Shopify green

Style:
- iOS design patterns
- Shopify brand colors
- Touch-friendly (44px min touch targets)
- Modern, clean, professional
- Proper iOS shadows and blur effects

Format: Mobile phone mockup, realistic device frame, 
professional presentation
```

---

## Prompt 6: A/B Test Modal (DALL-E 3)

```
Generate a modal dialog UI for displaying A/B test results 
in a SaaS application.

Modal specifications:
- Overlay: Dark semi-transparent background (rgba(0,0,0,0.5))
- Modal card: White, 800px wide, centered
- Rounded corners (16px), shadow (0 8px 24px rgba(0,0,0,0.15))

Header:
- Title "A/B Test Running" (left)
- Badge "7 days active" (green, middle)
- Close X button (right)

Body: Two-column comparison table
- Column headers: "Variant A (15% discount)" | "Variant B (20% discount)"
- Rows showing metrics:
  * Impressions: 225 | 225
  * Add-to-cart: 34 (15.1%) | 45 (20.0%) ← highlight
  * Purchases: 10 (4.4%) | 13 (5.8%) ← highlight
  * Revenue: $739.50 | $884.35 ← highlight
- Winning column (B) has subtle green background tint
- Checkmark icons next to winning metrics

Footer:
- Left: Badge "Confidence: 82.5%" with progress bar
- Text: "Continue test to reach 95% confidence"
- Right: Two buttons
  * "Continue Test" (secondary, gray)
  * "Stop Test" (primary, red)

Style: Modal overlay, professional SaaS design, 
data comparison clear, winning variant obvious,
statistical confidence visible

Format: UI modal component screenshot, desktop web, 
centered on gray background
```

---

## Prompt 7: Bundle Widget (Storefront)

```
Create a mockup of an ecommerce product bundle widget 
for a Shopify storefront.

Context: Widget appears on product page, below "Add to Cart" button

Widget design:
- Container: White card, subtle border (1px #E1E3E5)
- Rounded corners (8px)
- Padding: 20px
- Width: 100% (responsive)

Header:
- Icon: Gift emoji 🎁
- Title: "Frequently Bought Together" (bold, 16px)

Product selection:
- 3 products in row (horizontal on desktop, stack on mobile)
- Product 1 (current product):
  * Checkbox: checked, disabled
  * Image: 80x80px
  * Name: "White T-Shirt"
  * Price: $29.00
- Product 2:
  * Checkbox: checked, enabled (user can uncheck)
  * Image: 80x80px
  * Name: "Blue Shorts"
  * Price: $39.00
- Product 3:
  * Checkbox: checked, enabled
  * Image: 80x80px
  * Name: "Black Cap"
  * Price: $19.00

Pricing summary:
- Row 1: "Total selected" | "$87.00" (gray, small)
- Row 2: "Bundle price" | "$73.95" (large, bold, black)
- Row 3: "You save" | "$13.05 (15%)" (green, medium)

CTA button:
- Full width
- Green background (#008060)
- White text: "Add Bundle to Cart"
- Rounded (8px), padding 16px vertical

Style: Ecommerce storefront aesthetic, clean, conversion-optimized,
mobile-responsive design, accessible

Format: Web component embedded in product page context,
show partial product page around widget for context
```

---

## Prompt 8: Empty State

```
Design an empty state screen for when a user has no bundles created yet.

Layout (centered on page):
- Illustration (top):
  * Simple, friendly illustration of empty shopping bags 
    or empty box with sparkles
  * Style: Line art, Shopify green accent color, minimal
  * Size: 200x200px
- Heading: "No bundles yet" (24px, bold, center)
- Body text: "Start increasing your Average Order Value by 
  creating bundles that your customers will love." 
  (16px, gray, center, max-width 400px)
- Primary CTA: "Create Your First Bundle" button
  * Large, green (#008060), white text
  * Rounded (8px), padding 16px 32px
- Secondary CTA: "Get AI Recommendations" text link
  * Below button, gray color, underline on hover

Background: Very light gray (#FAFAFA) or white

Style: Encouraging, simple, not overwhelming, 
clear next action, friendly and approachable

Format: Full screen state, centered content, 
professional SaaS application
```

---

## Prompt 9: Success State (Bundle Created)

```
Create a success confirmation screen after creating a bundle.

Layout (modal or full-page):
- Animated checkmark icon (top center)
  * Large (120x120px)
  * Green circle with white checkmark
  * Subtle animation (scale in + bounce)
- Heading: "Your bundle is live! 🎉" (32px, center)
- Subheading: "Summer Essentials is now showing on:"
  (16px, gray, center)
- Checklist (center, max-width 400px):
  * ✓ Product pages (green checkmark)
  * ✓ Cart page (green checkmark)
  * ✓ Checkout upsell (green checkmark)
- Stats preview card:
  * "Expected impact"
  * "+$15 avg order value"
  * "+28% revenue per order"
- Two buttons (stacked or side-by-side):
  * "Go to Dashboard" (secondary, gray border)
  * "Create Another Bundle" (primary, green)

Style: Celebration, positive, encouraging, clear success,
       show impact/value, guide next action

Colors: Green (#008060) for success elements, 
        white background, confetti particles (subtle)

Format: Success modal or full-screen confirmation,
centered content, delightful micro-interactions
```

---

## Prompt 10: Settings Screen

```
Design a settings page for a SaaS application with multiple sections.

Layout:
- Full-width page with left sidebar navigation
- Content area (right) showing settings forms

Sections (stacked vertical with spacing):

1. "Plan & Billing" section:
   - Card with border
   - Shows: Current plan badge "Pro ($49/month)"
   - Next billing date
   - Buttons: "Upgrade", "Change Plan", "Cancel"

2. "Appearance" section:
   - Form fields:
     * Dropdown "Default Discount Type"
     * Number input "Default Discount Value" with % suffix
     * Dropdown "Bundle Widget Theme" (Light/Dark)
     * Dropdown "Widget Position"
   - "Save Changes" button (bottom right)

3. "AI Settings" section:
   - Checkboxes:
     * "Auto-generate descriptions" (checked)
     * "Auto-create bundles" (checked with sub-text)
   - Slider "Minimum Confidence" (currently at 70%)
   - Radio buttons "Refresh frequency" (Daily/Weekly/Monthly)
   - "Save Changes" button

4. "Notifications" section:
   - 4 checkboxes for email preferences
   - "Save Changes" button

5. "Advanced" section:
   - API key display (masked with "Regenerate" button)
   - Link "View API Documentation"

Style: Form-heavy, organized sections, clear labels,
proper spacing between sections, accessible,
professional SaaS settings page

Format: Full settings page, desktop view, 1440px wide
```

---

## Notas para Diseñadores

### Iteración de Prompts

1. **Genera base con prompt**
2. **Importa a Figma**
3. **Refina manualmente** (ajusta spacing, colores exactos)
4. **Usa Figma components** (Shopify Polaris kit)
5. **Export para developers**

---

### Assets Necesarios

**Iconos:**
- Usar Shopify Polaris Icons pack
- Download: https://polaris-icons.shopify.com/

**Fuentes:**
- Shopify Sans (system font)
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI"

**Imágenes producto:**
- Usar placeholders: https://placehold.co/
- Tamaños: 80x80px (thumbnails), 400x400px (main)

---

### Herramientas Complementarias

1. **Figma Plugin: Shopify Polaris**
   - Components pre-hechos
   - Design tokens
   - Color palette

2. **Zeplin / Figma Dev Mode**
   - Export specs a developers
   - CSS code generation

3. **Lottie Files**
   - Animations (success, loading)
   - Export as JSON

---

# 📝 CHECKLIST FINAL DISEÑO

## Pre-Development

- [ ] Todos los wireframes aprobados
- [ ] Mockups high-fidelity creados
- [ ] Design system documentado
- [ ] Components library en Figma
- [ ] User flows validados
- [ ] Responsive breakpoints definidos
- [ ] Accessibility checklist completado
- [ ] Assets exportados (icons, images)
- [ ] Developer handoff completo (Figma/Zeplin)

## Durante Development

- [ ] QA visual en cada pull request
- [ ] Testing en real devices (iOS, Android)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Accessibility testing (screen readers)
- [ ] Performance testing (load times)

## Post-Launch

- [ ] User testing sessions
- [ ] Heatmaps / session recordings
- [ ] Feedback collection
- [ ] Iteración basada en data

---

**FIN DEL DOCUMENTO UI/UX**

**Última actualización:** Enero 2026  
**Mantenido por:** Equipo de diseño BundlerPro  
**Próxima revisión:** Después de MVP launch
