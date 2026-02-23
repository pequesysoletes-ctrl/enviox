# 🔧 SHOPIFYBUNDLER PRO
## PRD Técnico (Product Requirements Document)

**Versión:** 1.0  
**Fecha:** Enero 2026  
**Audiencia:** Equipo de desarrollo  
**Clasificación:** Interno - Confidencial

---

# 📋 ÍNDICE

1. [Visión General del Sistema](#vision-general)
2. [Arquitectura Técnica](#arquitectura)
3. [Stack Tecnológico](#stack)
4. [Base de Datos](#base-datos)
5. [API Endpoints](#api-endpoints)
6. [Integraciones Shopify](#integraciones-shopify)
7. [Algoritmos IA/ML](#algoritmos-ia)
8. [Frontend](#frontend)
9. [Backend](#backend)
10. [Seguridad](#seguridad)
11. [Performance](#performance)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Monitoreo](#monitoreo)

---

# 🎯 VISIÓN GENERAL DEL SISTEMA {#vision-general}

## Descripción del Producto

ShopifyBundler Pro es una aplicación Shopify embedded que permite a merchants crear y gestionar product bundles usando recomendaciones de IA basadas en análisis de patrones de compra.

## Arquitectura de Alto Nivel

```
┌──────────────────────────────────────────────────────────┐
│                    SHOPIFY ECOSYSTEM                      │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐      │
│  │  Storefront│  │ Admin Panel │  │  API (REST)  │      │
│  └──────┬─────┘  └──────┬──────┘  └──────┬───────┘      │
│         │                │                │              │
└─────────┼────────────────┼────────────────┼──────────────┘
          │                │                │
          ▼                ▼                ▼
┌──────────────────────────────────────────────────────────┐
│                  BUNDLERPRO APP                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │            FRONTEND (Embedded App)               │    │
│  │  - React + TypeScript                            │    │
│  │  - Shopify Polaris                              │    │
│  │  - Shopify App Bridge                           │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐    │
│  │              BACKEND API (Laravel)              │    │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐   │    │
│  │  │   Auth   │  │  Bundles │  │ Recommendations│   │    │
│  │  │ Service  │  │ Service  │  │    (IA)     │   │    │
│  │  └──────────┘  └──────────┘  └─────────────┘   │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐    │
│  │            DATA LAYER                           │    │
│  │  ┌──────────┐  ┌────────┐  ┌──────────────┐    │    │
│  │  │PostgreSQL│  │ Redis  │  │  Python ML   │    │    │
│  │  │   (DB)   │  │(Cache) │  │  Microservice│    │    │
│  │  └──────────┘  └────────┘  └──────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
          │                │
          ▼                ▼
┌──────────────┐  ┌────────────────┐
│  OpenAI API  │  │  SendGrid API  │
│  (GPT-4)     │  │  (Email)       │
└──────────────┘  └────────────────┘
```

## Componentes Principales

### 1. Frontend Embedded App
- **Tecnología:** React + TypeScript
- **Framework UI:** Shopify Polaris
- **Renderiza en:** Shopify Admin iframe
- **Comunicación:** Shopify App Bridge

### 2. Backend API
- **Framework:** Laravel 10
- **Lenguaje:** PHP 8.2
- **Patrón:** RESTful API
- **Autenticación:** OAuth 2.0 (Shopify)

### 3. ML Microservice
- **Lenguaje:** Python 3.11
- **Framework:** FastAPI
- **Algoritmos:** Scikit-learn
- **Comunicación:** HTTP REST

### 4. Base de Datos
- **Principal:** PostgreSQL 15
- **Cache:** Redis 7
- **Search:** PostgreSQL Full-Text

### 5. Servicios Externos
- **IA:** OpenAI GPT-4 API
- **Email:** SendGrid
- **Storage:** AWS S3
- **CDN:** CloudFront

---

# 🏗️ ARQUITECTURA TÉCNICA {#arquitectura}

## Patrón Arquitectónico

**MVC + Service Layer + Repository Pattern**

```
Controllers → Services → Repositories → Models → Database
     ↓           ↓
  Validation  Business Logic
```

## Flujo de Datos

### Ejemplo: Crear Bundle con IA

```
1. USER ACTION
   ├─ User clicks "Get AI Recommendations" en dashboard
   └─ Frontend (React) hace POST /api/recommendations

2. BACKEND PROCESAMIENTO
   ├─ Laravel Route → BundleController@getRecommendations
   ├─ Middleware: VerifyShopifyToken (auth)
   ├─ Controller valida request
   ├─ Llama a BundleService->generateRecommendations()
   │   ├─ Obtiene orders históricos (OrderRepository)
   │   ├─ Llama Python ML microservice (HTTP)
   │   ├─ ML service ejecuta market basket analysis
   │   ├─ Retorna top 10 bundles sugeridos
   │   ├─ Para cada bundle: llama OpenAI API (descripción GPT-4)
   │   └─ Cache results en Redis (TTL 1 hora)
   └─ Response JSON a frontend

3. FRONTEND DISPLAY
   ├─ Recibe JSON con recommendations
   ├─ Renderiza cards con bundles sugeridos
   └─ User puede crear bundle con 1 click
```

## Separación de Responsabilidades

### Controllers (Slim)
```php
class BundleController extends Controller
{
    public function __construct(
        private BundleService $bundleService
    ) {}
    
    public function getRecommendations(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|integer',
            'limit' => 'integer|max:20',
        ]);
        
        $recommendations = $this->bundleService
            ->generateRecommendations(
                $validated['shop_id'],
                $validated['limit'] ?? 10
            );
        
        return response()->json($recommendations);
    }
}
```

### Services (Business Logic)
```php
class BundleService
{
    public function __construct(
        private OrderRepository $orderRepo,
        private MLApiClient $mlClient,
        private OpenAIClient $openAI,
        private CacheManager $cache
    ) {}
    
    public function generateRecommendations(
        int $shopId, 
        int $limit
    ): array {
        // Check cache
        $cacheKey = "recommendations:{$shopId}";
        if ($cached = $this->cache->get($cacheKey)) {
            return $cached;
        }
        
        // Get historical data
        $orders = $this->orderRepo->getRecentOrders(
            $shopId,
            limit: 1000,
            days: 90
        );
        
        // Call ML service
        $patterns = $this->mlClient->analyzePatterns($orders);
        
        // Generate descriptions with GPT-4
        $recommendations = [];
        foreach ($patterns['bundles'] as $bundle) {
            $description = $this->openAI->generateDescription(
                $bundle['products']
            );
            
            $recommendations[] = [
                'products' => $bundle['products'],
                'confidence' => $bundle['confidence'],
                'lift' => $bundle['lift'],
                'description' => $description,
                'estimated_aov_increase' => $bundle['aov_impact']
            ];
        }
        
        // Cache for 1 hour
        $this->cache->put($cacheKey, $recommendations, 3600);
        
        return $recommendations;
    }
}
```

### Repositories (Data Access)
```php
class OrderRepository
{
    public function __construct(
        private Order $model
    ) {}
    
    public function getRecentOrders(
        int $shopId,
        int $limit = 1000,
        int $days = 90
    ): Collection {
        return $this->model
            ->where('shop_id', $shopId)
            ->where('created_at', '>=', now()->subDays($days))
            ->with('lineItems.product')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
```

---

# 💻 STACK TECNOLÓGICO {#stack}

## Backend Stack

### Laravel 10 (PHP 8.2)

**Por qué Laravel:**
- ✅ Shopify SDK oficial (PHP)
- ✅ Ecosystem maduro (packages)
- ✅ ORM potente (Eloquent)
- ✅ Queue system nativo (Laravel Horizon)
- ✅ Comunidad grande (soporte)

**Packages principales:**
```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^10.0",
    "osiset/laravel-shopify": "^19.0",
    "guzzlehttp/guzzle": "^7.5",
    "predis/predis": "^2.0",
    "openai-php/client": "^0.7",
    "league/flysystem-aws-s3-v3": "^3.0"
  }
}
```

---

### PostgreSQL 15

**Por qué PostgreSQL:**
- ✅ JSONB support (flexible data)
- ✅ Full-text search nativo
- ✅ Transacciones ACID
- ✅ Performance excelente
- ✅ Escalabilidad horizontal (futuro)

**Configuración:**
```ini
# postgresql.conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
```

---

### Redis 7

**Uso:**
1. **Session storage**
2. **Cache layer** (recommendations, analytics)
3. **Queue backend** (Laravel jobs)
4. **Rate limiting**

**Configuración:**
```redis
# redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

---

## Frontend Stack

### React 18 + TypeScript

**Por qué React:**
- ✅ Shopify App Bridge soporte oficial
- ✅ Shopify Polaris (React components)
- ✅ Performance (Virtual DOM)
- ✅ Community huge

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@shopify/polaris": "^11.0.0",
    "@shopify/app-bridge-react": "^4.0.0",
    "@tanstack/react-query": "^4.29.0",
    "axios": "^1.4.0",
    "recharts": "^2.5.0"
  }
}
```

---

### Shopify Polaris

**Componentes principales a usar:**

```tsx
// Dashboard layout
import {
  Page,
  Card,
  Layout,
  Button,
  DataTable,
  Badge,
  Stack,
  TextStyle
} from '@shopify/polaris';

// Forms
import {
  Form,
  FormLayout,
  TextField,
  Select,
  Checkbox
} from '@shopify/polaris';

// Navigation
import {
  Navigation,
  TopBar,
  Frame
} from '@shopify/polaris';
```

---

## ML Stack

### Python 3.11 + FastAPI

**Por qué Python:**
- ✅ Scikit-learn (ML libraries)
- ✅ Pandas (data manipulation)
- ✅ FastAPI (async, rápido)
- ✅ Type hints (safety)

**Dependencies:**
```python
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.2
mlxtend==0.23.0  # Market basket analysis
redis==5.0.1
httpx==0.25.2
```

**ML Microservice Architecture:**
```
┌────────────────────────────────┐
│   FastAPI Application          │
│  ┌──────────────────────────┐  │
│  │  /analyze endpoint       │  │
│  │  - Receive orders JSON   │  │
│  │  - Run market basket     │  │
│  │  - Return recommendations│  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  Market Basket Analysis  │  │
│  │  - Apriori algorithm     │  │
│  │  - Association rules     │  │
│  │  - Confidence & lift     │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

---

## Servicios Externos

### OpenAI GPT-4 API

**Uso:** Generar descripciones bundle

**Endpoint:** `https://api.openai.com/v1/chat/completions`

**Configuración:**
```php
// config/services.php
'openai' => [
    'api_key' => env('OPENAI_API_KEY'),
    'model' => 'gpt-4',
    'max_tokens' => 150,
    'temperature' => 0.7,
],
```

**Rate limits:**
- 10,000 requests/day (tier 1)
- 90,000 tokens/min

**Costo estimado:**
- Input: $0.03 / 1K tokens
- Output: $0.06 / 1K tokens
- Promedio por descripción: ~$0.015

---

### SendGrid API

**Uso:** Transactional emails

**Emails tipos:**
1. Welcome email (install)
2. Bundle performance reports (weekly)
3. Upgrade prompts (marketing)
4. Support responses

**Configuración:**
```php
// config/mail.php
'sendgrid' => [
    'api_key' => env('SENDGRID_API_KEY'),
    'from' => [
        'address' => 'noreply@bundlerpro.app',
        'name' => 'BundlerPro',
    ],
],
```

---

## Infrastructure

### AWS Services

**EC2:**
- Instance type: t3.medium (2 vCPU, 4GB RAM)
- OS: Ubuntu 22.04 LTS
- Auto-scaling: Yes (min 1, max 3)

**RDS PostgreSQL:**
- Instance: db.t3.small
- Multi-AZ: No (Año 1), Yes (Año 2)
- Backups: Daily (7 días retention)

**ElastiCache Redis:**
- Node type: cache.t3.micro
- Nodes: 1 (Año 1), 2 (Año 2)

**S3:**
- Bucket: bundlerpro-assets
- Uso: Product images, exports

**CloudFront:**
- CDN para assets estáticos
- SSL certificate (ACM)

**Costo mensual estimado:**
```
EC2 (t3.medium):       $30
RDS (db.t3.small):     $25
ElastiCache:           $12
S3:                    $5
CloudFront:            $10
Data transfer:         $15
─────────────────────────
TOTAL:                 ~$100/mes
```

---

# 🗄️ BASE DE DATOS {#base-datos}

## Schema Overview

```
Users (Shopify shops)
  └─ has many → Bundles
                  └─ has many → BundleItems
                                  └─ references → Products
                                  
  └─ has many → Orders (synced from Shopify)
                  └─ has many → OrderItems
                  
  └─ has many → Analytics (aggregated)
  
  └─ has one → Subscription
```

## Tablas Principales

### 1. users (Shopify Shops)

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    
    -- Shopify data
    shopify_shop_id BIGINT NOT NULL UNIQUE,
    shop_domain VARCHAR(255) NOT NULL UNIQUE,
    shop_name VARCHAR(255) NOT NULL,
    shop_email VARCHAR(255),
    shop_currency VARCHAR(3) DEFAULT 'USD',
    shop_timezone VARCHAR(50),
    
    -- Auth
    access_token TEXT NOT NULL,
    access_scopes TEXT,
    
    -- Subscription
    plan VARCHAR(20) DEFAULT 'free', -- free, starter, pro, enterprise
    plan_started_at TIMESTAMP,
    trial_ends_at TIMESTAMP,
    
    -- Billing (Shopify Billing API)
    shopify_charge_id BIGINT,
    billing_status VARCHAR(20), -- active, cancelled, frozen
    billing_on TIMESTAMP,
    
    -- Settings
    settings JSONB DEFAULT '{}',
    -- {
    --   "default_discount_percent": 15,
    --   "default_discount_type": "percentage",
    --   "auto_create_enabled": true,
    --   "email_notifications": true
    -- }
    
    -- Metadata
    installed_at TIMESTAMP DEFAULT NOW(),
    uninstalled_at TIMESTAMP,
    last_active_at TIMESTAMP,
    
    -- Stats (cached)
    total_bundles INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_shop_domain (shop_domain),
    INDEX idx_plan (plan),
    INDEX idx_billing_status (billing_status)
);
```

---

### 2. bundles

```sql
CREATE TABLE bundles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Bundle info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Discount
    discount_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount
    discount_value DECIMAL(10,2) NOT NULL, -- 15.00 (15% o $15)
    
    -- Pricing (calculated)
    original_price DECIMAL(10,2) NOT NULL,
    bundle_price DECIMAL(10,2) NOT NULL,
    savings DECIMAL(10,2) NOT NULL,
    
    -- Display
    display_on_product_pages BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    -- A/B Testing
    ab_test_enabled BOOLEAN DEFAULT false,
    ab_test_variant VARCHAR(1), -- A or B
    ab_test_started_at TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, paused, archived
    
    -- Source
    source VARCHAR(20) DEFAULT 'manual', -- manual, ai_recommendation
    ai_confidence DECIMAL(5,2), -- 0.87 = 87% confidence
    
    -- Stats (cached, updated nightly)
    total_views INTEGER DEFAULT 0,
    total_add_to_carts INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Dates
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_user_status (user_id, status),
    INDEX idx_featured (featured, status),
    INDEX idx_ab_test (ab_test_enabled, ab_test_variant)
);
```

---

### 3. bundle_items

```sql
CREATE TABLE bundle_items (
    id BIGSERIAL PRIMARY KEY,
    bundle_id BIGINT NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    
    -- Product reference (Shopify)
    shopify_product_id BIGINT NOT NULL,
    shopify_variant_id BIGINT NOT NULL,
    
    -- Product data (snapshot - puede cambiar en Shopify)
    product_title VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    sku VARCHAR(100),
    image_url TEXT,
    
    -- Bundle settings
    quantity INTEGER DEFAULT 1,
    optional BOOLEAN DEFAULT false, -- can be unchecked by customer
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_bundle (bundle_id),
    INDEX idx_product (shopify_product_id),
    UNIQUE INDEX idx_bundle_product (bundle_id, shopify_variant_id)
);
```

---

### 4. orders (Synced from Shopify)

```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Shopify data
    shopify_order_id BIGINT NOT NULL UNIQUE,
    order_number VARCHAR(50),
    
    -- Customer
    customer_id BIGINT,
    customer_email VARCHAR(255),
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    financial_status VARCHAR(50), -- paid, pending, refunded
    fulfillment_status VARCHAR(50), -- fulfilled, partial, unfulfilled
    
    -- Dates
    order_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_user_date (user_id, order_date DESC),
    INDEX idx_shopify_order (shopify_order_id),
    INDEX idx_customer (customer_id)
);
```

---

### 5. order_items

```sql
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Product
    shopify_product_id BIGINT NOT NULL,
    shopify_variant_id BIGINT NOT NULL,
    product_title VARCHAR(255),
    variant_title VARCHAR(255),
    
    -- Pricing
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    
    -- SKU
    sku VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_order (order_id),
    INDEX idx_product (shopify_product_id)
);
```

---

### 6. bundle_analytics

```sql
CREATE TABLE bundle_analytics (
    id BIGSERIAL PRIMARY KEY,
    bundle_id BIGINT NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    
    -- Métricas diarias
    date DATE NOT NULL,
    
    -- Engagement
    views INTEGER DEFAULT 0,
    add_to_carts INTEGER DEFAULT 0,
    checkouts INTEGER DEFAULT 0,
    purchases INTEGER DEFAULT 0,
    
    -- Revenue
    revenue DECIMAL(10,2) DEFAULT 0,
    
    -- Rates (calculated)
    add_to_cart_rate DECIMAL(5,2), -- (add_to_carts / views) * 100
    conversion_rate DECIMAL(5,2), -- (purchases / views) * 100
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_bundle_date (bundle_id, date DESC),
    UNIQUE INDEX idx_bundle_date_unique (bundle_id, date)
);
```

---

### 7. recommendations

```sql
CREATE TABLE recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Recommendation data
    products JSONB NOT NULL,
    -- [
    --   {
    --     "product_id": 123,
    --     "variant_id": 456,
    --     "title": "Product A"
    --   },
    --   ...
    -- ]
    
    -- ML metrics
    confidence DECIMAL(5,2) NOT NULL, -- 0.87
    support DECIMAL(5,2) NOT NULL, -- 0.15 (15% orders contain this combo)
    lift DECIMAL(5,2) NOT NULL, -- 2.3 (230% more likely than random)
    
    -- Estimated impact
    estimated_aov_increase DECIMAL(10,2),
    estimated_aov_increase_percent DECIMAL(5,2),
    
    -- AI description (GPT-4)
    ai_title VARCHAR(255),
    ai_description TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, expired
    
    -- Actions
    bundle_id BIGINT REFERENCES bundles(id), -- if accepted and created
    accepted_at TIMESTAMP,
    rejected_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days',
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_user_status (user_id, status),
    INDEX idx_expires (expires_at)
);
```

---

### 8. ab_tests

```sql
CREATE TABLE ab_tests (
    id BIGSERIAL PRIMARY KEY,
    bundle_id BIGINT NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    
    -- Test configuration
    variant_a_discount DECIMAL(10,2) NOT NULL, -- 15% discount
    variant_b_discount DECIMAL(10,2) NOT NULL, -- 20% discount
    
    -- Status
    status VARCHAR(20) DEFAULT 'running', -- running, completed, stopped
    
    -- Results (updated real-time via aggregation)
    variant_a_views INTEGER DEFAULT 0,
    variant_a_add_to_carts INTEGER DEFAULT 0,
    variant_a_purchases INTEGER DEFAULT 0,
    variant_a_revenue DECIMAL(12,2) DEFAULT 0,
    
    variant_b_views INTEGER DEFAULT 0,
    variant_b_add_to_carts INTEGER DEFAULT 0,
    variant_b_purchases INTEGER DEFAULT 0,
    variant_b_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Winner
    winning_variant VARCHAR(1), -- A or B
    confidence_level DECIMAL(5,2), -- Statistical significance (95%+)
    decided_at TIMESTAMP,
    
    -- Dates
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_bundle_status (bundle_id, status)
);
```

---

### 9. events (Event tracking)

```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    bundle_id BIGINT REFERENCES bundles(id) ON DELETE SET NULL,
    
    -- Event data
    event_type VARCHAR(50) NOT NULL,
    -- bundle_viewed, bundle_add_to_cart, bundle_purchased,
    -- bundle_created, bundle_deleted, etc.
    
    -- Context
    customer_id BIGINT,
    order_id BIGINT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    -- {
    --   "source": "product_page",
    --   "variant": "A",
    --   "device": "mobile"
    -- }
    
    -- Request data
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_user_event (user_id, event_type),
    INDEX idx_bundle_event (bundle_id, event_type),
    INDEX idx_created (created_at DESC)
);

-- Partition by month (performance)
CREATE TABLE events_2026_01 PARTITION OF events
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
-- (crear partitions automáticamente cada mes)
```

---

### 10. jobs (Laravel Queue)

```sql
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT DEFAULT 0,
    reserved_at INTEGER,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    
    INDEX idx_queue_reserved (queue, reserved_at)
);

CREATE TABLE failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP DEFAULT NOW()
);
```

---

## Indexes Adicionales (Performance)

```sql
-- Búsqueda full-text de bundles
CREATE INDEX idx_bundles_search ON bundles 
    USING GIN(to_tsvector('english', title || ' ' || description));

-- Composite index para dashboard queries comunes
CREATE INDEX idx_bundles_user_status_created ON bundles 
    (user_id, status, created_at DESC);

-- Analytics range queries
CREATE INDEX idx_analytics_bundle_daterange ON bundle_analytics 
    (bundle_id, date DESC);

-- Event analytics
CREATE INDEX idx_events_bundle_type_date ON events 
    (bundle_id, event_type, created_at DESC);
```

---

## Views (Performance)

### bundle_stats_view (Para dashboards rápidos)

```sql
CREATE MATERIALIZED VIEW bundle_stats_mv AS
SELECT 
    b.id AS bundle_id,
    b.user_id,
    b.title,
    COUNT(DISTINCT e_view.id) AS total_views,
    COUNT(DISTINCT e_cart.id) AS total_add_to_carts,
    COUNT(DISTINCT e_purchase.id) AS total_purchases,
    COALESCE(SUM(e_purchase.metadata->>'revenue')::DECIMAL, 0) AS total_revenue,
    CASE 
        WHEN COUNT(DISTINCT e_view.id) > 0 
        THEN (COUNT(DISTINCT e_cart.id)::DECIMAL / COUNT(DISTINCT e_view.id) * 100)
        ELSE 0 
    END AS add_to_cart_rate,
    CASE 
        WHEN COUNT(DISTINCT e_view.id) > 0 
        THEN (COUNT(DISTINCT e_purchase.id)::DECIMAL / COUNT(DISTINCT e_view.id) * 100)
        ELSE 0 
    END AS conversion_rate
FROM bundles b
LEFT JOIN events e_view ON b.id = e_view.bundle_id 
    AND e_view.event_type = 'bundle_viewed'
LEFT JOIN events e_cart ON b.id = e_cart.bundle_id 
    AND e_cart.event_type = 'bundle_add_to_cart'
LEFT JOIN events e_purchase ON b.id = e_purchase.bundle_id 
    AND e_purchase.event_type = 'bundle_purchased'
WHERE b.status != 'archived'
GROUP BY b.id, b.user_id, b.title;

-- Refresh nightly
CREATE INDEX idx_bundle_stats_mv_bundle ON bundle_stats_mv(bundle_id);
```

**Refresh automático:**
```sql
-- Cron job diario (3am)
REFRESH MATERIALIZED VIEW CONCURRENTLY bundle_stats_mv;
```

---

## Migrations Strategy

### Initial Migration

```bash
php artisan migrate:install
php artisan migrate --seed
```

### Migration Files Structure

```
database/migrations/
├── 2026_01_01_000001_create_users_table.php
├── 2026_01_01_000002_create_bundles_table.php
├── 2026_01_01_000003_create_bundle_items_table.php
├── 2026_01_01_000004_create_orders_table.php
├── 2026_01_01_000005_create_order_items_table.php
├── 2026_01_01_000006_create_bundle_analytics_table.php
├── 2026_01_01_000007_create_recommendations_table.php
├── 2026_01_01_000008_create_ab_tests_table.php
├── 2026_01_01_000009_create_events_table.php
├── 2026_01_01_000010_create_jobs_table.php
└── 2026_01_01_000011_create_indexes.php
```

---

# 🔌 API ENDPOINTS {#api-endpoints}

## Base URL

```
Development: http://localhost:8000/api/v1
Production:  https://api.bundlerpro.app/api/v1
```

## Authentication

**Todos los endpoints requieren:**
```
Authorization: Bearer {shopify_access_token}
X-Shop-Domain: {shop_domain}
```

---

## Endpoints

### Authentication

#### POST /auth/install
**Descripción:** OAuth callback después de install  
**Body:**
```json
{
  "code": "oauth_code_from_shopify",
  "shop": "example.myshopify.com",
  "hmac": "signature",
  "timestamp": "1234567890"
}
```
**Response:**
```json
{
  "success": true,
  "redirect_url": "https://admin.shopify.com/apps/bundlerpro"
}
```

---

### Bundles

#### GET /bundles
**Descripción:** Listar todos los bundles del merchant  
**Query params:**
- `status` (optional): active, paused, archived
- `page` (optional): default 1
- `per_page` (optional): default 20, max 100
- `sort` (optional): created_at, views, revenue (default: -created_at)

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "title": "Summer Essentials",
      "description": "Perfect summer combo",
      "status": "active",
      "discount_type": "percentage",
      "discount_value": 15.00,
      "original_price": 87.00,
      "bundle_price": 73.95,
      "savings": 13.05,
      "products": [
        {
          "product_id": 456,
          "variant_id": 789,
          "title": "White T-Shirt",
          "price": 29.00,
          "image_url": "https://..."
        }
      ],
      "stats": {
        "views": 450,
        "add_to_carts": 67,
        "purchases": 23,
        "revenue": 1840.00,
        "conversion_rate": 5.11
      },
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 45
  }
}
```

---

#### POST /bundles
**Descripción:** Crear nuevo bundle  
**Body:**
```json
{
  "title": "Summer Essentials",
  "description": "Perfect combo for summer",
  "discount_type": "percentage",
  "discount_value": 15,
  "products": [
    {
      "variant_id": 789,
      "quantity": 1,
      "optional": false
    },
    {
      "variant_id": 790,
      "quantity": 1,
      "optional": false
    }
  ],
  "display_on_product_pages": true,
  "starts_at": null,
  "ends_at": null
}
```
**Response:**
```json
{
  "data": {
    "id": 124,
    "title": "Summer Essentials",
    ...
  }
}
```

---

#### GET /bundles/:id
**Descripción:** Obtener bundle específico con stats detalladas

**Response:**
```json
{
  "data": {
    "id": 123,
    "title": "Summer Essentials",
    ...
    "stats": {
      "views": 450,
      "add_to_carts": 67,
      "purchases": 23,
      "revenue": 1840.00,
      "conversion_rate": 5.11,
      "daily_stats": [
        {
          "date": "2026-01-20",
          "views": 45,
          "purchases": 3,
          "revenue": 221.85
        }
      ]
    },
    "ab_test": {
      "enabled": true,
      "status": "running",
      "variant_a": {
        "discount": 15,
        "views": 225,
        "purchases": 10,
        "conversion_rate": 4.44
      },
      "variant_b": {
        "discount": 20,
        "views": 225,
        "purchases": 13,
        "conversion_rate": 5.78
      },
      "winning_variant": null
    }
  }
}
```

---

#### PUT /bundles/:id
**Descripción:** Actualizar bundle  
**Body:** (same as POST, todos los campos opcionales)

---

#### DELETE /bundles/:id
**Descripción:** Eliminar bundle (soft delete)  
**Response:**
```json
{
  "success": true,
  "message": "Bundle archived successfully"
}
```

---

### Recommendations (IA)

#### GET /recommendations
**Descripción:** Obtener recomendaciones IA de bundles  
**Query params:**
- `limit` (optional): default 10, max 20
- `min_confidence` (optional): default 0.7 (70%)

**Response:**
```json
{
  "data": [
    {
      "id": "rec_abc123",
      "products": [
        {
          "product_id": 456,
          "variant_id": 789,
          "title": "White T-Shirt",
          "price": 29.00,
          "image_url": "https://..."
        },
        {
          "product_id": 457,
          "variant_id": 791,
          "title": "Blue Shorts",
          "price": 39.00,
          "image_url": "https://..."
        }
      ],
      "ai_title": "Summer Essentials",
      "ai_description": "Perfect combo for hot days...",
      "confidence": 0.87,
      "support": 0.15,
      "lift": 2.3,
      "estimated_aov_increase": 15.20,
      "estimated_aov_increase_percent": 28.5,
      "expires_at": "2026-01-27T10:30:00Z"
    }
  ]
}
```

---

#### POST /recommendations/:id/accept
**Descripción:** Aceptar recomendación y crear bundle automáticamente  
**Body:**
```json
{
  "discount_percent": 15,  // optional, default from AI
  "customize_title": false  // optional
}
```
**Response:**
```json
{
  "data": {
    "bundle_id": 125,
    "recommendation_id": "rec_abc123",
    ...
  }
}
```

---

#### POST /recommendations/:id/reject
**Descripción:** Rechazar recomendación (feedback para ML)  
**Body:**
```json
{
  "reason": "products_not_related"  // optional
}
```

---

#### POST /recommendations/refresh
**Descripción:** Forzar regeneración de recommendations (limpia cache)  
**Response:**
```json
{
  "success": true,
  "message": "Recommendations will be regenerated",
  "estimated_time": "2 minutes"
}
```

---

### Analytics

#### GET /analytics/dashboard
**Descripción:** Stats general del merchant  
**Query params:**
- `date_from` (required): YYYY-MM-DD
- `date_to` (required): YYYY-MM-DD

**Response:**
```json
{
  "data": {
    "summary": {
      "total_bundles": 45,
      "active_bundles": 38,
      "total_bundle_revenue": 15450.00,
      "avg_bundle_aov": 73.50,
      "store_avg_aov": 52.30,
      "aov_increase_percent": 40.5
    },
    "top_bundles": [
      {
        "bundle_id": 123,
        "title": "Summer Essentials",
        "revenue": 1840.00,
        "purchases": 23
      }
    ],
    "timeline": [
      {
        "date": "2026-01-20",
        "bundle_revenue": 850.00,
        "store_revenue": 4200.00,
        "bundles_sold": 12
      }
    ]
  }
}
```

---

#### GET /analytics/bundles/:id
**Descripción:** Analytics detalladas de bundle específico  
**Query params:** date_from, date_to

**Response:**
```json
{
  "data": {
    "bundle_id": 123,
    "period": {
      "from": "2026-01-01",
      "to": "2026-01-31"
    },
    "metrics": {
      "views": 1250,
      "add_to_carts": 187,
      "checkouts": 120,
      "purchases": 89,
      "revenue": 6581.55,
      "add_to_cart_rate": 14.96,
      "checkout_rate": 64.17,
      "conversion_rate": 7.12
    },
    "daily_breakdown": [...],
    "device_breakdown": {
      "mobile": 65,
      "desktop": 35
    },
    "customer_segments": {
      "new_customers": 45,
      "returning_customers": 44
    }
  }
}
```

---

### A/B Testing

#### POST /ab-tests
**Descripción:** Crear nuevo A/B test para bundle  
**Body:**
```json
{
  "bundle_id": 123,
  "variant_a_discount": 15,
  "variant_b_discount": 20,
  "min_impressions": 100  // optional, default 100
}
```

---

#### GET /ab-tests/:id
**Descripción:** Obtener resultados A/B test

**Response:**
```json
{
  "data": {
    "id": 45,
    "bundle_id": 123,
    "status": "running",
    "started_at": "2026-01-20T10:00:00Z",
    "variant_a": {
      "discount": 15,
      "impressions": 225,
      "add_to_carts": 34,
      "purchases": 10,
      "revenue": 739.50,
      "conversion_rate": 4.44
    },
    "variant_b": {
      "discount": 20,
      "impressions": 225,
      "add_to_carts": 45,
      "purchases": 13,
      "revenue": 884.35,
      "conversion_rate": 5.78
    },
    "winning_variant": null,
    "confidence_level": 82.5,
    "recommendation": "Continue test (need 95% confidence)"
  }
}
```

---

#### POST /ab-tests/:id/complete
**Descripción:** Finalizar test y aplicar ganador  
**Response:**
```json
{
  "success": true,
  "winning_variant": "B",
  "bundle_updated": true
}
```

---

### Settings

#### GET /settings
**Descripción:** Obtener configuración del merchant

**Response:**
```json
{
  "data": {
    "default_discount_percent": 15,
    "default_discount_type": "percentage",
    "auto_create_enabled": true,
    "email_notifications": true,
    "product_page_widget_enabled": true
  }
}
```

---

#### PUT /settings
**Descripción:** Actualizar configuración  
**Body:** (mismo formato que GET response)

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "title": ["The title field is required."],
      "discount_value": ["The discount value must be between 1 and 100."]
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Descripción |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Shopify API down |

---

## Rate Limiting

```
Free plan:     100 requests/minute
Starter plan:  200 requests/minute
Pro plan:      500 requests/minute
Enterprise:    1000 requests/minute
```

**Headers:**
```
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 195
X-RateLimit-Reset: 1610000000
```

---

# 🔗 INTEGRACIONES SHOPIFY {#integraciones-shopify}

## OAuth Flow

### 1. Install URL

Cuando merchant clickea "Add app":
```
https://admin.shopify.com/oauth/authorize?
  client_id={API_KEY}
  &scope={SCOPES}
  &redirect_uri={REDIRECT_URI}
  &state={NONCE}
```

**Scopes necesarios:**
```
read_products
write_products  // Para crear bundles como productos
read_orders
read_customers  // Para analytics segmentados
write_script_tags  // Para embed widget
read_analytics  // Para calcular AOV
```

### 2. Callback

```php
Route::get('/auth/callback', function (Request $request) {
    $shopDomain = $request->shop;
    $code = $request->code;
    $hmac = $request->hmac;
    
    // 1. Verify HMAC
    if (!ShopifyService::verifyHmac($request->all(), $hmac)) {
        abort(403, 'Invalid HMAC');
    }
    
    // 2. Exchange code for access token
    $accessToken = ShopifyService::getAccessToken($shopDomain, $code);
    
    // 3. Store in database
    $user = User::updateOrCreate(
        ['shop_domain' => $shopDomain],
        ['access_token' => $accessToken, 'installed_at' => now()]
    );
    
    // 4. Install webhooks
    WebhookService::installWebhooks($user);
    
    // 5. Install script tag (storefront widget)
    ScriptTagService::install($user);
    
    // 6. Redirect to app
    return redirect()->to(
        "https://{$shopDomain}/admin/apps/{$appHandle}"
    );
});
```

---

## Webhooks

### Registrar Webhooks

```php
class WebhookService
{
    public function installWebhooks(User $user): void
    {
        $webhooks = [
            'orders/create' => route('webhooks.orders.create'),
            'orders/updated' => route('webhooks.orders.updated'),
            'products/create' => route('webhooks.products.create'),
            'products/update' => route('webhooks.products.update'),
            'products/delete' => route('webhooks.products.delete'),
            'app/uninstalled' => route('webhooks.app.uninstalled'),
        ];
        
        foreach ($webhooks as $topic => $address) {
            Shopify::api()
                ->rest('POST', 'admin/api/2024-01/webhooks.json', [
                    'webhook' => [
                        'topic' => $topic,
                        'address' => $address,
                        'format' => 'json'
                    ]
                ]);
        }
    }
}
```

---

### Procesar Webhooks

#### orders/create

```php
Route::post('/webhooks/orders/create', function (Request $request) {
    // 1. Verify webhook signature
    if (!ShopifyService::verifyWebhook($request)) {
        abort(403);
    }
    
    // 2. Parse order data
    $orderData = $request->all();
    
    // 3. Dispatch job (async processing)
    ProcessNewOrder::dispatch($orderData);
    
    return response('OK', 200);
});
```

```php
class ProcessNewOrder implements ShouldQueue
{
    public function handle(array $orderData): void
    {
        $user = User::where('shop_domain', $orderData['shop_domain'])->first();
        
        // Store order
        $order = Order::create([
            'user_id' => $user->id,
            'shopify_order_id' => $orderData['id'],
            'order_number' => $orderData['name'],
            'customer_id' => $orderData['customer']['id'] ?? null,
            'customer_email' => $orderData['customer']['email'] ?? null,
            'subtotal' => $orderData['subtotal_price'],
            'tax' => $orderData['total_tax'],
            'total' => $orderData['total_price'],
            'currency' => $orderData['currency'],
            'order_date' => $orderData['created_at']
        ]);
        
        // Store line items
        foreach ($orderData['line_items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'shopify_product_id' => $item['product_id'],
                'shopify_variant_id' => $item['variant_id'],
                'product_title' => $item['title'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'total' => $item['price'] * $item['quantity']
            ]);
        }
        
        // Check if order contains bundles (detect by SKU pattern)
        $this->detectBundlePurchase($order, $orderData['line_items']);
        
        // Trigger recommendation refresh (if patterns changed)
        if ($user->total_orders % 100 === 0) {
            RefreshRecommendations::dispatch($user);
        }
    }
}
```

---

#### app/uninstalled

```php
Route::post('/webhooks/app/uninstalled', function (Request $request) {
    if (!ShopifyService::verifyWebhook($request)) {
        abort(403);
    }
    
    $shopDomain = $request->header('X-Shopify-Shop-Domain');
    
    User::where('shop_domain', $shopDomain)->update([
        'uninstalled_at' => now(),
        'access_token' => null // Revoke token
    ]);
    
    return response('OK', 200);
});
```

---

## Script Tags (Storefront Widget)

### Instalar Script Tag

```php
class ScriptTagService
{
    public function install(User $user): void
    {
        Shopify::api($user->shop_domain, $user->access_token)
            ->rest('POST', 'admin/api/2024-01/script_tags.json', [
                'script_tag' => [
                    'event' => 'onload',
                    'src' => 'https://cdn.bundlerpro.app/widget.js',
                    'display_scope' => 'all',
                    'cache' => false
                ]
            ]);
    }
}
```

---

### Widget JavaScript

**CDN:** `https://cdn.bundlerpro.app/widget.js`

```javascript
(function() {
  'use strict';
  
  // Config from shop
  const shopDomain = window.Shopify.shop;
  const apiUrl = 'https://api.bundlerpro.app/api/v1';
  
  // Find product ID from page
  const productId = getProductIdFromPage();
  if (!productId) return;
  
  // Fetch bundles for this product
  fetch(`${apiUrl}/storefront/bundles?product_id=${productId}`, {
    headers: {
      'X-Shop-Domain': shopDomain
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.bundles && data.bundles.length > 0) {
      renderBundleWidget(data.bundles[0]);
      trackImpression(data.bundles[0].id);
    }
  });
  
  function renderBundleWidget(bundle) {
    const widget = document.createElement('div');
    widget.className = 'bundlerpro-widget';
    widget.innerHTML = `
      <div class="bundlerpro-header">
        <h3>🎁 Frequently Bought Together</h3>
      </div>
      <div class="bundlerpro-items">
        ${bundle.products.map(p => `
          <div class="bundlerpro-item">
            <img src="${p.image_url}" alt="${p.title}" />
            <p>${p.title}</p>
            <p class="price">${formatPrice(p.price)}</p>
            <input type="checkbox" checked data-variant-id="${p.variant_id}" />
          </div>
        `).join('')}
      </div>
      <div class="bundlerpro-pricing">
        <div class="original-price">
          Original: <del>${formatPrice(bundle.original_price)}</del>
        </div>
        <div class="bundle-price">
          Bundle: <strong>${formatPrice(bundle.bundle_price)}</strong>
          <span class="savings">Save ${formatPrice(bundle.savings)}</span>
        </div>
      </div>
      <button class="bundlerpro-add-to-cart">
        Add Bundle to Cart
      </button>
    `;
    
    // Insert after product form
    const productForm = document.querySelector('form[action="/cart/add"]');
    if (productForm) {
      productForm.parentNode.insertBefore(widget, productForm.nextSibling);
    }
    
    // Event: Add to cart
    widget.querySelector('.bundlerpro-add-to-cart').addEventListener('click', () => {
      const selectedVariants = Array.from(widget.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.dataset.variantId);
      
      addBundleToCart(selectedVariants, bundle.id);
    });
  }
  
  function addBundleToCart(variantIds, bundleId) {
    const items = variantIds.map(id => ({ id, quantity: 1 }));
    
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    .then(res => res.json())
    .then(() => {
      trackConversion(bundleId);
      window.location.href = '/cart';
    });
  }
  
  function trackImpression(bundleId) {
    navigator.sendBeacon(
      `${apiUrl}/storefront/track`,
      JSON.stringify({
        event: 'bundle_viewed',
        bundle_id: bundleId,
        shop_domain: shopDomain
      })
    );
  }
  
  function trackConversion(bundleId) {
    navigator.sendBeacon(
      `${apiUrl}/storefront/track`,
      JSON.stringify({
        event: 'bundle_add_to_cart',
        bundle_id: bundleId,
        shop_domain: shopDomain
      })
    );
  }
  
  // Helper functions
  function getProductIdFromPage() {
    return window.ShopifyAnalytics?.meta?.product?.id || 
           document.querySelector('[data-product-id]')?.dataset?.productId;
  }
  
  function formatPrice(cents) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: window.Shopify.currency.active
    }).format(cents / 100);
  }
})();
```

---

## Shopify Admin Embedded App

### App Bridge Setup

**Frontend (React):**

```tsx
import { Provider } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';

const config = {
  apiKey: process.env.SHOPIFY_API_KEY,
  host: new URLSearchParams(window.location.search).get('host'),
  forceRedirect: true
};

function App() {
  return (
    <Provider config={config}>
      <AppProvider i18n={translations}>
        <Dashboard />
      </AppProvider>
    </Provider>
  );
}
```

---

### Navigation

```tsx
import { TitleBar } from '@shopify/app-bridge-react';

function Dashboard() {
  return (
    <>
      <TitleBar title="BundlerPro Dashboard">
        <button onClick={() => navigate('/bundles/create')}>
          Create Bundle
        </button>
      </TitleBar>
      
      <Page>
        {/* Content */}
      </Page>
    </>
  );
}
```

---

### Toast Notifications

```tsx
import { Toast } from '@shopify/app-bridge-react';

function BundleCreated() {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <>
      {showToast && (
        <Toast
          content="Bundle created successfully!"
          onDismiss={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </>
  );
}
```

---

# 🤖 ALGORITMOS IA/ML {#algoritmos-ia}

## Market Basket Analysis

### Algoritmo: Apriori + Association Rules

**Python Microservice:**

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder

app = FastAPI()

class Order(BaseModel):
    order_id: int
    products: List[int]

class AnalysisRequest(BaseModel):
    orders: List[Order]
    min_support: float = 0.05
    min_confidence: float = 0.6
    min_lift: float = 1.2

class BundleRecommendation(BaseModel):
    products: List[int]
    confidence: float
    support: float
    lift: float
    expected_probability: float

@app.post("/analyze", response_model=List[BundleRecommendation])
async def analyze_orders(request: AnalysisRequest):
    try:
        # 1. Transform to transaction format
        transactions = [order.products for order in request.orders]
        
        # 2. Encode transactions
        te = TransactionEncoder()
        te_ary = te.fit(transactions).transform(transactions)
        df = pd.DataFrame(te_ary, columns=te.columns_)
        
        # 3. Find frequent itemsets using Apriori
        frequent_itemsets = apriori(
            df,
            min_support=request.min_support,
            use_colnames=True
        )
        
        if len(frequent_itemsets) == 0:
            return []
        
        # 4. Generate association rules
        rules = association_rules(
            frequent_itemsets,
            metric="confidence",
            min_threshold=request.min_confidence
        )
        
        # 5. Filter by lift
        rules = rules[rules['lift'] >= request.min_lift]
        
        # 6. Sort by lift * confidence (quality score)
        rules['score'] = rules['lift'] * rules['confidence']
        rules = rules.sort_values('score', ascending=False)
        
        # 7. Convert to bundle recommendations
        recommendations = []
        for idx, rule in rules.head(20).iterrows():
            # Combine antecedents and consequents
            products = list(rule['antecedents'].union(rule['consequents']))
            
            # Skip single-product bundles
            if len(products) < 2:
                continue
            
            recommendations.append(BundleRecommendation(
                products=products,
                confidence=float(rule['confidence']),
                support=float(rule['support']),
                lift=float(rule['lift']),
                expected_probability=float(rule['support'])
            ))
        
        return recommendations[:10]  # Top 10
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### Explicación del Algoritmo

**1. Apriori Algorithm:**

Encuentra conjuntos de productos que aparecen juntos frecuentemente.

```
Support(A) = # orders containing A / total orders

Ejemplo:
1000 orders totales
150 orders contienen "T-shirt" Y "Shorts"
Support({T-shirt, Shorts}) = 150/1000 = 0.15 (15%)

Min support threshold: 0.05 (5%)
→ Solo considera combos que aparecen en ≥5% orders
```

**2. Association Rules:**

Genera reglas del tipo: "Si compra A, entonces compra B"

```
Confidence(A → B) = Support(A ∪ B) / Support(A)

Ejemplo:
Support({T-shirt, Shorts}) = 0.15
Support({T-shirt}) = 0.25

Confidence(T-shirt → Shorts) = 0.15 / 0.25 = 0.60 (60%)

Interpretación: "Si alguien compra T-shirt, hay 60% probabilidad 
               que también compre Shorts"
```

**3. Lift:**

Mide cuánto más probable es la compra conjunta vs compra aleatoria.

```
Lift(A → B) = Support(A ∪ B) / (Support(A) × Support(B))

Ejemplo:
Support({T-shirt, Shorts}) = 0.15
Support({T-shirt}) = 0.25
Support({Shorts}) = 0.30

Lift = 0.15 / (0.25 × 0.30) = 0.15 / 0.075 = 2.0

Interpretación: "Comprar T-shirt hace 2x más probable 
               que compres Shorts vs compra random"

Lift > 1.0 = Positive correlation
Lift = 1.0 = No correlation
Lift < 1.0 = Negative correlation
```

---

### Llamar desde Laravel

```php
class MLApiClient
{
    private HttpClient $client;
    
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config('services.ml.url'),
            'timeout' => 30,
        ]);
    }
    
    public function analyzePatterns(Collection $orders): array
    {
        // Transform orders to API format
        $ordersData = $orders->map(fn($order) => [
            'order_id' => $order->id,
            'products' => $order->lineItems->pluck('shopify_product_id')->toArray()
        ])->toArray();
        
        // Call ML service
        $response = $this->client->post('/analyze', [
            'json' => [
                'orders' => $ordersData,
                'min_support' => 0.05,
                'min_confidence' => 0.6,
                'min_lift' => 1.2
            ]
        ]);
        
        return json_decode($response->getBody(), true);
    }
}
```

---

## GPT-4 Descriptions

### Generar Descripción Bundle

```php
class OpenAIClient
{
    private $apiKey;
    
    public function generateDescription(array $products): string
    {
        $productNames = collect($products)->pluck('title')->join(', ');
        
        $prompt = <<<PROMPT
You are a professional ecommerce copywriter. 
Create an attractive bundle name and 50-word description.

Products in bundle:
{$productNames}

Requirements:
- Name: Short, catchy, max 5 words
- Description: Benefit-focused, creates urgency
- Tone: Friendly, persuasive
- Format: JSON with keys "title" and "description"

Example:
{
  "title": "Summer Essentials Kit",
  "description": "Everything you need for perfect summer days. Premium t-shirt, comfortable shorts, and classic cap - all in one bundle. Save 15% vs buying separately. Limited time offer!"
}
PROMPT;
        
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4',
            'messages' => [
                ['role' => 'system', 'content' => 'You are an expert copywriter.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.7,
            'max_tokens' => 150,
        ]);
        
        $content = $response->json('choices.0.message.content');
        
        // Parse JSON response
        $result = json_decode($content, true);
        
        return $result;
    }
}
```

---

## Caching Strategy

### Redis Keys

```
recommendations:{shop_id}                    TTL: 1 hora
recommendations:{shop_id}:products:{ids}     TTL: 24 horas
bundle:{bundle_id}:stats                     TTL: 5 minutos
analytics:{shop_id}:dashboard                TTL: 15 minutos
```

### Invalidación

```php
// When new order created
Cache::forget("recommendations:{$shopId}");

// When bundle edited
Cache::forget("bundle:{$bundleId}:stats");

// When settings changed
Cache::flush(); // Nuclear option (use sparingly)
```

---

# 🎨 FRONTEND {#frontend}

## Estructura de Componentes

```
src/
├── components/
│   ├── Layout/
│   │   ├── AppFrame.tsx         # Shopify Frame wrapper
│   │   ├── Navigation.tsx       # Sidebar nav
│   │   └── TopBar.tsx           # Header
│   ├── Dashboard/
│   │   ├── StatsCards.tsx       # KPIs
│   │   ├── BundleList.tsx       # Table view
│   │   └── RecentActivity.tsx   # Timeline
│   ├── Bundles/
│   │   ├── BundleForm.tsx       # Create/edit
│   │   ├── ProductPicker.tsx    # Shopify product selector
│   │   ├── BundlePreview.tsx    # Visual preview
│   │   └── BundleStats.tsx      # Charts
│   ├── Recommendations/
│   │   ├── AIRecommendations.tsx
│   │   └── RecommendationCard.tsx
│   └── Shared/
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useBundles.ts
│   ├── useAnalytics.ts
│   └── useRecommendations.ts
├── services/
│   ├── api.ts                   # Axios client
│   ├── shopify.ts               # App Bridge helpers
│   └── analytics.ts             # Mixpanel tracking
├── types/
│   ├── bundle.ts
│   ├── recommendation.ts
│   └── analytics.ts
└── utils/
    ├── formatters.ts            # Currency, dates
    └── validators.ts
```

---

## Componentes Clave

### Dashboard

```tsx
// components/Dashboard/Dashboard.tsx
import { Page, Layout, Card, DataTable } from '@shopify/polaris';
import { useBundles } from '@/hooks/useBundles';
import { useAnalytics } from '@/hooks/useAnalytics';
import StatsCards from './StatsCards';
import BundleList from './BundleList';

export default function Dashboard() {
  const { data: bundles, isLoading } = useBundles();
  const { data: stats } = useAnalytics({
    dateFrom: '2026-01-01',
    dateTo: '2026-01-31'
  });
  
  return (
    <Page
      title="Dashboard"
      primaryAction={{
        content: 'Create Bundle',
        url: '/bundles/create'
      }}
    >
      <Layout>
        <Layout.Section>
          <StatsCards stats={stats} />
        </Layout.Section>
        
        <Layout.Section>
          <Card title="Your Bundles">
            {isLoading ? (
              <SkeletonTable />
            ) : (
              <BundleList bundles={bundles} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
```

---

### Bundle Form

```tsx
// components/Bundles/BundleForm.tsx
import { useState } from 'react';
import {
  Form,
  FormLayout,
  TextField,
  Select,
  Button,
  Stack
} from '@shopify/polaris';
import ProductPicker from './ProductPicker';

interface BundleFormProps {
  initialData?: Bundle;
  onSubmit: (data: BundleInput) => Promise<void>;
}

export default function BundleForm({ initialData, onSubmit }: BundleFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('15');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  const handleSubmit = async () => {
    const data: BundleInput = {
      title,
      description,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      products: selectedProducts.map(p => ({
        variant_id: p.variantId,
        quantity: 1,
        optional: false
      }))
    };
    
    await onSubmit(data);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          label="Bundle Title"
          value={title}
          onChange={setTitle}
          placeholder="e.g., Summer Essentials"
          autoComplete="off"
        />
        
        <TextField
          label="Description"
          value={description}
          onChange={setDescription}
          multiline={3}
          placeholder="Describe what makes this bundle special..."
        />
        
        <Stack distribution="fillEvenly">
          <Select
            label="Discount Type"
            options={[
              { label: 'Percentage', value: 'percentage' },
              { label: 'Fixed Amount', value: 'fixed' }
            ]}
            value={discountType}
            onChange={(val) => setDiscountType(val as any)}
          />
          
          <TextField
            label="Discount Value"
            value={discountValue}
            onChange={setDiscountValue}
            type="number"
            suffix={discountType === 'percentage' ? '%' : '$'}
          />
        </Stack>
        
        <ProductPicker
          selectedProducts={selectedProducts}
          onChange={setSelectedProducts}
        />
        
        <Button primary submit>
          Save Bundle
        </Button>
      </FormLayout>
    </Form>
  );
}
```

---

### Product Picker (Shopify Resource Picker)

```tsx
// components/Bundles/ProductPicker.tsx
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Button, Stack, Thumbnail, TextStyle } from '@shopify/polaris';

interface ProductPickerProps {
  selectedProducts: Product[];
  onChange: (products: Product[]) => void;
}

export default function ProductPicker({ selectedProducts, onChange }: ProductPickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  
  return (
    <>
      <Stack vertical>
        <TextStyle variation="strong">Products in Bundle</TextStyle>
        
        {selectedProducts.map(product => (
          <Stack key={product.id} alignment="center">
            <Thumbnail
              source={product.image ?? ''}
              alt={product.title}
            />
            <Stack.Item fill>
              <TextStyle>{product.title}</TextStyle>
            </Stack.Item>
            <Button
              plain
              destructive
              onClick={() => {
                onChange(selectedProducts.filter(p => p.id !== product.id));
              }}
            >
              Remove
            </Button>
          </Stack>
        ))}
        
        <Button onClick={() => setPickerOpen(true)}>
          Add Products
        </Button>
      </Stack>
      
      <ResourcePicker
        resourceType="Product"
        open={pickerOpen}
        onSelection={(resources) => {
          const products = resources.selection.map(r => ({
            id: r.id,
            title: r.title,
            image: r.images[0]?.originalSrc,
            variantId: r.variants[0].id,
            price: parseFloat(r.variants[0].price)
          }));
          
          onChange([...selectedProducts, ...products]);
          setPickerOpen(false);
        }}
        onCancel={() => setPickerOpen(false)}
      />
    </>
  );
}
```

---

## State Management

### React Query

```tsx
// hooks/useBundles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useBundles(filters?: BundleFilters) {
  return useQuery({
    queryKey: ['bundles', filters],
    queryFn: () => api.bundles.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BundleInput) => api.bundles.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}
```

---

## Routing

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import BundleCreate from '@/pages/BundleCreate';
import BundleEdit from '@/pages/BundleEdit';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bundles/create" element={<BundleCreate />} />
        <Route path="/bundles/:id/edit" element={<BundleEdit />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

# ⚙️ BACKEND {#backend}

## Laravel Structure

```
app/
├── Console/
│   └── Commands/
│       ├── RefreshRecommendations.php
│       ├── SyncOrders.php
│       └── AggregateAnalytics.php
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── BundleController.php
│   │   ├── RecommendationController.php
│   │   ├── AnalyticsController.php
│   │   └── WebhookController.php
│   ├── Middleware/
│   │   ├── VerifyShopifyToken.php
│   │   ├── VerifyShopifyWebhook.php
│   │   └── CheckSubscription.php
│   └── Requests/
│       ├── CreateBundleRequest.php
│       └── UpdateBundleRequest.php
├── Models/
│   ├── User.php
│   ├── Bundle.php
│   ├── BundleItem.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── Recommendation.php
│   └── Analytics.php
├── Services/
│   ├── ShopifyService.php
│   ├── BundleService.php
│   ├── RecommendationService.php
│   ├── AnalyticsService.php
│   ├── MLApiClient.php
│   └── OpenAIClient.php
├── Jobs/
│   ├── ProcessNewOrder.php
│   ├── GenerateRecommendations.php
│   ├── AggregateAnalytics.php
│   └── SendWeeklyReport.php
└── Repositories/
    ├── BundleRepository.php
    ├── OrderRepository.php
    └── AnalyticsRepository.php
```

---

## Service Layer Example

```php
<?php

namespace App\Services;

use App\Models\Bundle;
use App\Models\User;
use App\Repositories\BundleRepository;
use App\Repositories\OrderRepository;
use Illuminate\Support\Collection;

class BundleService
{
    public function __construct(
        private BundleRepository $bundleRepo,
        private OrderRepository $orderRepo,
        private MLApiClient $mlClient,
        private OpenAIClient $openAI,
        private CacheManager $cache
    ) {}
    
    public function createBundle(User $user, array $data): Bundle
    {
        // 1. Fetch product details from Shopify
        $products = $this->enrichProductData($user, $data['products']);
        
        // 2. Calculate pricing
        $originalPrice = collect($products)->sum('price');
        $discount = $this->calculateDiscount(
            $originalPrice,
            $data['discount_type'],
            $data['discount_value']
        );
        $bundlePrice = $originalPrice - $discount;
        
        // 3. Create bundle
        $bundle = $this->bundleRepo->create([
            'user_id' => $user->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'discount_type' => $data['discount_type'],
            'discount_value' => $data['discount_value'],
            'original_price' => $originalPrice,
            'bundle_price' => $bundlePrice,
            'savings' => $discount,
            'status' => 'active'
        ]);
        
        // 4. Add bundle items
        foreach ($products as $product) {
            $bundle->items()->create([
                'shopify_product_id' => $product['product_id'],
                'shopify_variant_id' => $product['variant_id'],
                'product_title' => $product['title'],
                'price' => $product['price'],
                'quantity' => $product['quantity'] ?? 1
            ]);
        }
        
        // 5. Cache invalidation
        $this->cache->forget("bundles:{$user->id}");
        
        // 6. Track event
        event(new BundleCreated($bundle));
        
        return $bundle->load('items');
    }
    
    public function generateRecommendations(User $user, int $limit = 10): Collection
    {
        // Check cache
        $cacheKey = "recommendations:{$user->id}";
        if ($cached = $this->cache->get($cacheKey)) {
            return collect($cached)->take($limit);
        }
        
        // Get historical orders
        $orders = $this->orderRepo->getRecentOrders(
            $user->id,
            limit: 1000,
            days: 90
        );
        
        if ($orders->count() < 10) {
            // Not enough data
            return collect([]);
        }
        
        // Call ML service
        $patterns = $this->mlClient->analyzePatterns($orders);
        
        if (empty($patterns)) {
            return collect([]);
        }
        
        // Generate AI descriptions
        $recommendations = collect($patterns)->map(function ($pattern) use ($user) {
            // Fetch product details
            $products = $this->enrichProductData($user, $pattern['products']);
            
            // Generate description
            $aiContent = $this->openAI->generateDescription($products);
            
            return [
                'products' => $products,
                'ai_title' => $aiContent['title'],
                'ai_description' => $aiContent['description'],
                'confidence' => $pattern['confidence'],
                'support' => $pattern['support'],
                'lift' => $pattern['lift'],
                'estimated_aov_increase' => $this->estimateAOVIncrease(
                    $products,
                    $user->average_order_value
                )
            ];
        });
        
        // Store in database
        foreach ($recommendations as $rec) {
            Recommendation::create([
                'user_id' => $user->id,
                'products' => json_encode($rec['products']),
                'confidence' => $rec['confidence'],
                'support' => $rec['support'],
                'lift' => $rec['lift'],
                'estimated_aov_increase' => $rec['estimated_aov_increase'],
                'ai_title' => $rec['ai_title'],
                'ai_description' => $rec['ai_description'],
                'expires_at' => now()->addDays(7)
            ]);
        }
        
        // Cache for 1 hour
        $this->cache->put($cacheKey, $recommendations, 3600);
        
        return $recommendations->take($limit);
    }
    
    private function enrichProductData(User $user, array $products): array
    {
        $shopify = new ShopifyService($user);
        
        return collect($products)->map(function ($p) use ($shopify) {
            $product = $shopify->getProduct($p['product_id']);
            $variant = collect($product['variants'])
                ->firstWhere('id', $p['variant_id']);
            
            return [
                'product_id' => $product['id'],
                'variant_id' => $variant['id'],
                'title' => $product['title'],
                'variant_title' => $variant['title'],
                'price' => $variant['price'],
                'image_url' => $product['image']['src'] ?? null,
                'sku' => $variant['sku']
            ];
        })->toArray();
    }
}
```

---

## Queue Jobs

```php
<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\RecommendationService;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class GenerateRecommendations implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(
        private User $user
    ) {}
    
    public function handle(RecommendationService $service): void
    {
        $recommendations = $service->generate($this->user);
        
        // Send notification if has recommendations
        if ($recommendations->count() > 0) {
            $this->user->notify(
                new NewRecommendationsAvailable($recommendations)
            );
        }
    }
}
```

---

# 🔒 SEGURIDAD {#seguridad}

## Authentication

### Shopify OAuth Token Storage

```php
// Encrypt access tokens
use Illuminate\Support\Facades\Crypt;

$user->update([
    'access_token' => Crypt::encryptString($accessToken)
]);

// Decrypt when needed
$token = Crypt::decryptString($user->access_token);
```

---

### Verify Shopify Webhooks

```php
class VerifyShopifyWebhook
{
    public function handle(Request $request, Closure $next)
    {
        $hmac = $request->header('X-Shopify-Hmac-Sha256');
        $data = $request->getContent();
        $secret = config('shopify.webhook_secret');
        
        $calculated = base64_encode(
            hash_hmac('sha256', $data, $secret, true)
        );
        
        if (!hash_equals($hmac, $calculated)) {
            abort(403, 'Invalid webhook signature');
        }
        
        return $next($request);
    }
}
```

---

## Rate Limiting

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:200,1'])->group(function () {
    Route::get('/bundles', [BundleController::class, 'index']);
    // ...
});

// Custom rate limiter by plan
RateLimiter::for('api', function (Request $request) {
    $user = $request->user();
    
    $limits = [
        'free' => 100,
        'starter' => 200,
        'pro' => 500,
        'enterprise' => 1000
    ];
    
    return Limit::perMinute($limits[$user->plan] ?? 100)
        ->by($user->id);
});
```

---

## Input Validation

```php
class CreateBundleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:1|max:100',
            'products' => 'required|array|min:2|max:10',
            'products.*.variant_id' => 'required|integer',
            'products.*.quantity' => 'integer|min:1|max:100'
        ];
    }
}
```

---

## SQL Injection Prevention

```php
// ✅ Good (parameterized)
$bundles = DB::table('bundles')
    ->where('user_id', $userId)
    ->where('status', 'active')
    ->get();

// ❌ Bad (vulnerable)
$bundles = DB::select(
    "SELECT * FROM bundles WHERE user_id = {$userId}"
);
```

---

## XSS Prevention

```php
// Frontend: Shopify Polaris components escape by default
<TextStyle>{bundle.title}</TextStyle>  // Safe

// Backend: Laravel Blade escapes
{{ $bundle->title }}  // Safe
{!! $bundle->title !!}  // Unsafe - avoid
```

---

# ⚡ PERFORMANCE {#performance}

## Database Optimization

### Indexes

```sql
-- Already covered in schema section
-- Additional composite indexes:

CREATE INDEX idx_bundles_user_status_views 
ON bundles (user_id, status, total_views DESC);

CREATE INDEX idx_events_bundle_type_created 
ON events (bundle_id, event_type, created_at DESC);
```

---

### Query Optimization

```php
// ❌ N+1 Problem
$bundles = Bundle::all();
foreach ($bundles as $bundle) {
    echo $bundle->user->name;  // Queries user each iteration
}

// ✅ Eager Loading
$bundles = Bundle::with('user', 'items')->get();
foreach ($bundles as $bundle) {
    echo $bundle->user->name;  // Already loaded
}
```

---

### Database Connection Pooling

```php
// config/database.php
'pgsql' => [
    'driver' => 'pgsql',
    'host' => env('DB_HOST'),
    'port' => env('DB_PORT'),
    'database' => env('DB_DATABASE'),
    'username' => env('DB_USERNAME'),
    'password' => env('DB_PASSWORD'),
    'charset' => 'utf8',
    'prefix' => '',
    'schema' => 'public',
    'sslmode' => 'prefer',
    'options' => [
        PDO::ATTR_PERSISTENT => true,  // Connection pooling
    ],
],
```

---

## Caching Strategy

### Cache Layers

```
1. Browser Cache (assets)
   └─> CloudFront CDN (static files)

2. Application Cache (Redis)
   └─> Recommendations, analytics, bundle stats

3. Database Query Cache (PostgreSQL)
   └─> Materialized views

4. OpCode Cache (OPcache)
   └─> Compiled PHP
```

### Implementation

```php
// Cache recommendations
Cache::remember("recommendations:{$userId}", 3600, function () use ($userId) {
    return RecommendationService::generate($userId);
});

// Cache analytics
Cache::remember("analytics:{$userId}:dashboard", 900, function () use ($userId) {
    return AnalyticsService::getDashboardStats($userId);
});
```

---

## API Response Time

### Target Response Times

| Endpoint | Target | Max |
|----------|--------|-----|
| GET /bundles | <100ms | 200ms |
| POST /bundles | <200ms | 500ms |
| GET /recommendations | <2s | 5s |
| GET /analytics | <500ms | 1s |

### Monitoring

```php
// Middleware: LogResponseTime
class LogResponseTime
{
    public function handle(Request $request, Closure $next)
    {
        $start = microtime(true);
        
        $response = $next($request);
        
        $duration = (microtime(true) - $start) * 1000; // ms
        
        Log::info('API Response Time', [
            'endpoint' => $request->path(),
            'method' => $request->method(),
            'duration_ms' => $duration,
            'status' => $response->status()
        ]);
        
        if ($duration > 1000) {
            // Alert if >1s
            Sentry::captureMessage("Slow API: {$request->path()} - {$duration}ms");
        }
        
        return $response;
    }
}
```

---

## Frontend Performance

### Code Splitting

```tsx
// App.tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const BundleCreate = lazy(() => import('@/pages/BundleCreate'));
const Analytics = lazy(() => import('@/pages/Analytics'));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bundles/create" element={<BundleCreate />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

---

### Image Optimization

```tsx
// Lazy load images
<img 
  src={product.image} 
  loading="lazy"
  width={100}
  height={100}
/>
```

---

# 🧪 TESTING {#testing}

## Testing Strategy

```
Unit Tests:         70% coverage
Integration Tests:  20% coverage
E2E Tests:          10% coverage
```

## Backend Testing (PHPUnit)

### Unit Test Example

```php
<?php

namespace Tests\Unit\Services;

use App\Services\BundleService;
use App\Models\User;
use Tests\TestCase;

class BundleServiceTest extends TestCase
{
    public function test_calculate_bundle_price()
    {
        $service = new BundleService();
        
        $products = [
            ['price' => 29.00],
            ['price' => 39.00],
            ['price' => 19.00]
        ];
        
        $originalPrice = collect($products)->sum('price'); // 87.00
        $discount = $service->calculateDiscount($originalPrice, 'percentage', 15);
        
        $this->assertEquals(13.05, $discount);
        $this->assertEquals(73.95, $originalPrice - $discount);
    }
}
```

---

### Integration Test Example

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Bundle;
use Tests\TestCase;

class BundleApiTest extends TestCase
{
    public function test_user_can_create_bundle()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->postJson('/api/v1/bundles', [
                'title' => 'Test Bundle',
                'description' => 'Test description',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'products' => [
                    ['variant_id' => 123, 'quantity' => 1],
                    ['variant_id' => 456, 'quantity' => 1]
                ]
            ]);
        
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'bundle_price',
                    'products'
                ]
            ]);
        
        $this->assertDatabaseHas('bundles', [
            'user_id' => $user->id,
            'title' => 'Test Bundle'
        ]);
    }
    
    public function test_user_cannot_create_bundle_with_invalid_data()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->postJson('/api/v1/bundles', [
                'title' => '', // Invalid: empty
                'discount_value' => 150 // Invalid: >100
            ]);
        
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'discount_value']);
    }
}
```

---

## Frontend Testing (Jest + React Testing Library)

```tsx
// __tests__/BundleForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BundleForm from '@/components/Bundles/BundleForm';

describe('BundleForm', () => {
  it('renders form fields', () => {
    render(<BundleForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText('Bundle Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Discount Type')).toBeInTheDocument();
  });
  
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<BundleForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Bundle Title'), {
      target: { value: 'Test Bundle' }
    });
    
    fireEvent.change(screen.getByLabelText('Discount Value'), {
      target: { value: '15' }
    });
    
    fireEvent.click(screen.getByText('Save Bundle'));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Test Bundle',
        discount_value: 15,
        // ...
      });
    });
  });
  
  it('shows validation errors', async () => {
    render(<BundleForm onSubmit={jest.fn()} />);
    
    fireEvent.click(screen.getByText('Save Bundle'));
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });
});
```

---

## E2E Testing (Cypress)

```javascript
// cypress/e2e/create-bundle.cy.js
describe('Create Bundle Flow', () => {
  beforeEach(() => {
    cy.login(); // Custom command
    cy.visit('/bundles/create');
  });
  
  it('creates bundle successfully', () => {
    cy.get('[data-testid="bundle-title"]').type('Summer Essentials');
    cy.get('[data-testid="bundle-description"]').type('Perfect summer combo');
    cy.get('[data-testid="discount-value"]').clear().type('15');
    
    // Select products
    cy.get('[data-testid="add-products-button"]').click();
    cy.get('[data-testid="product-picker-modal"]').should('be.visible');
    cy.get('[data-testid="product-123"]').click();
    cy.get('[data-testid="product-456"]').click();
    cy.get('[data-testid="product-picker-done"]').click();
    
    // Submit
    cy.get('[data-testid="save-bundle-button"]').click();
    
    // Verify success
    cy.url().should('include', '/bundles');
    cy.get('[data-testid="toast"]').should('contain', 'Bundle created');
    cy.get('[data-testid="bundle-list"]').should('contain', 'Summer Essentials');
  });
});
```

---

# 🚀 DEPLOYMENT {#deployment}

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mbstring, pdo_pgsql
      
      - name: Install Dependencies
        run: composer install --no-dev --optimize-autoloader
      
      - name: Run Tests
        run: php artisan test
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: testing
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to AWS
        run: |
          # Install AWS CLI
          pip install awscli
          
          # Build Docker image
          docker build -t bundlerpro-app .
          
          # Push to ECR
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker tag bundlerpro-app:latest $ECR_REGISTRY/bundlerpro-app:latest
          docker push $ECR_REGISTRY/bundlerpro-app:latest
          
          # Update ECS service
          aws ecs update-service --cluster bundlerpro --service bundlerpro-app --force-new-deployment
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}
```

---

## Dockerfile

```dockerfile
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage

# Expose port
EXPOSE 9000

CMD ["php-fpm"]
```

---

## Environment Configuration

```bash
# .env.production
APP_NAME="BundlerPro"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://app.bundlerpro.app

DB_CONNECTION=pgsql
DB_HOST=bundlerpro-prod.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_DATABASE=bundlerpro
DB_USERNAME=bundlerpro_user
DB_PASSWORD=${DB_PASSWORD}

REDIS_HOST=bundlerpro-redis.xxxxx.cache.amazonaws.com
REDIS_PORT=6379

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

SHOPIFY_API_KEY=${SHOPIFY_API_KEY}
SHOPIFY_API_SECRET=${SHOPIFY_API_SECRET}
SHOPIFY_WEBHOOK_SECRET=${SHOPIFY_WEBHOOK_SECRET}

OPENAI_API_KEY=${OPENAI_API_KEY}

SENDGRID_API_KEY=${SENDGRID_API_KEY}

SENTRY_DSN=${SENTRY_DSN}

AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=bundlerpro-assets
```

---

## Zero-Downtime Deployment

```bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# 1. Put app in maintenance mode
php artisan down --message="Updating BundlerPro..." --retry=60

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
composer install --no-dev --optimize-autoloader

# 4. Run migrations (if any)
php artisan migrate --force

# 5. Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 6. Rebuild optimized caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Restart queue workers
php artisan queue:restart

# 8. Take app out of maintenance mode
php artisan up

echo "Deployment complete!"
```

---

# 📊 MONITOREO {#monitoreo}

## Application Monitoring (Sentry)

```php
// config/sentry.php
'dsn' => env('SENTRY_DSN'),
'environment' => env('APP_ENV', 'production'),
'release' => env('APP_VERSION', '1.0.0'),

// Performance monitoring
'traces_sample_rate' => 0.2, // 20% of requests

// Custom context
'before_send' => function (Event $event): ?Event {
    if (auth()->check()) {
        $event->setUser([
            'id' => auth()->id(),
            'shop_domain' => auth()->user()->shop_domain,
            'plan' => auth()->user()->plan
        ]);
    }
    return $event;
},
```

---

## Performance Monitoring

```php
// Track slow queries
DB::listen(function ($query) {
    if ($query->time > 1000) { // >1 second
        Sentry::captureMessage("Slow Query: {$query->sql}", [
            'extra' => [
                'bindings' => $query->bindings,
                'time' => $query->time
            ]
        ]);
    }
});
```

---

## Health Checks

```php
// routes/api.php
Route::get('/health', function () {
    $checks = [
        'database' => DB::connection()->getPdo() ? 'ok' : 'fail',
        'redis' => Redis::ping() ? 'ok' : 'fail',
        'queue' => Queue::size() < 1000 ? 'ok' : 'degraded'
    ];
    
    $status = in_array('fail', $checks) ? 503 : 200;
    
    return response()->json([
        'status' => $status === 200 ? 'healthy' : 'unhealthy',
        'checks' => $checks,
        'timestamp' => now()->toIso8601String()
    ], $status);
});
```

---

## Logging

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'sentry'],
    ],
    
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 14,
    ],
    
    'sentry' => [
        'driver' => 'sentry',
        'level' => 'error',
    ],
];
```

---

**FIN DEL PRD TÉCNICO**

---

Este documento debe actualizarse a medida que se implementan nuevas features o se detectan mejoras en la arquitectura.

**Última actualización:** Enero 2026  
**Mantenido por:** Equipo técnico BundlerPro
