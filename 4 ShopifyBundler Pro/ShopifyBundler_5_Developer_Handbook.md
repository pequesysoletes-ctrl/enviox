# 👨‍💻 SHOPIFYBUNDLER PRO
## Developer Handbook

**Versión:** 1.0  
**Fecha:** Enero 2026  
**Audiencia:** Developers  
**Clasificación:** Interno - Técnico

---

# 📋 ÍNDICE

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Database Guidelines](#database-guidelines)
7. [API Development](#api-development)
8. [Frontend Development](#frontend-development)
9. [Testing Guidelines](#testing-guidelines)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Common Tasks](#common-tasks)

---

# 🚀 GETTING STARTED {#getting-started}

## Prerequisites

**Required:**
- PHP 8.2+
- Composer 2.5+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Git

**Recommended:**
- Docker Desktop
- VSCode with extensions:
  - PHP Intelephense
  - Laravel Extension Pack
  - ESLint
  - Prettier
  - GitLens

---

## Quick Setup (5 minutes)

### 1. Clone Repository

```bash
git clone git@github.com:yourorg/shopifybundler-pro.git
cd shopifybundler-pro
```

### 2. Install Dependencies

```bash
# Backend
composer install

# Frontend
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database
nano .env
```

**Update these variables:**
```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=bundlerpro
DB_USERNAME=your_user
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret

OPENAI_API_KEY=your_openai_key
```

### 4. Database Setup

```bash
# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 5. Start Development Servers

```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite (frontend)
npm run dev

# Terminal 3: Queue worker
php artisan queue:work

# Terminal 4: ML service
cd ml-service
uvicorn main:app --reload --port 8001
```

### 6. Access Application

- **Backend API:** http://localhost:8000
- **Frontend:** http://localhost:5173
- **ML Service:** http://localhost:8001

---

## Verify Setup

```bash
# Run all tests
php artisan test

# Check code style
./vendor/bin/phpcs

# Frontend build
npm run build
```

If all pass → ✅ You're ready!

---

# 💻 DEVELOPMENT ENVIRONMENT {#development-environment}

## Docker Setup (Recommended)

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - .:/var/www
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
      
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: bundlerpro
      POSTGRES_USER: bundlerpro
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      
  ml-service:
    build:
      context: ./ml-service
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - REDIS_HOST=redis

volumes:
  postgres_data:
  redis_data:
```

### Start with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Run commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan test

# Stop services
docker-compose down
```

---

## VSCode Configuration

### .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.associations": {
    "*.blade.php": "blade"
  },
  "emmet.includeLanguages": {
    "blade": "html"
  }
}
```

### .vscode/extensions.json

```json
{
  "recommendations": [
    "bmewburn.vscode-intelephense-client",
    "amiralizadeh9480.laravel-extra-intellisense",
    "onecentlin.laravel-blade",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "ms-azuretools.vscode-docker"
  ]
}
```

---

## Environment Variables

### Development (.env.local)

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bundlerpro_dev
DB_USERNAME=postgres
DB_PASSWORD=secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis

SHOPIFY_API_KEY=your_dev_api_key
SHOPIFY_API_SECRET=your_dev_secret
SHOPIFY_SCOPES=read_products,write_products,read_orders

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

SENTRY_DSN=
# Leave empty in development
```

### Testing (.env.testing)

```env
APP_ENV=testing
APP_DEBUG=true

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_DATABASE=bundlerpro_test
DB_USERNAME=postgres
DB_PASSWORD=secret

CACHE_DRIVER=array
QUEUE_CONNECTION=sync
SESSION_DRIVER=array

# Mock external services
OPENAI_API_KEY=mock_key
SHOPIFY_API_KEY=mock_key
```

---

# 📁 PROJECT STRUCTURE {#project-structure}

## Backend (Laravel)

```
app/
├── Console/
│   └── Commands/
│       ├── RefreshRecommendations.php
│       └── AggregateAnalytics.php
├── Http/
│   ├── Controllers/
│   │   ├── BundleController.php
│   │   ├── RecommendationController.php
│   │   ├── AnalyticsController.php
│   │   └── WebhookController.php
│   ├── Middleware/
│   │   ├── VerifyShopifyToken.php
│   │   └── VerifyShopifyWebhook.php
│   └── Requests/
│       ├── CreateBundleRequest.php
│       └── UpdateBundleRequest.php
├── Models/
│   ├── User.php
│   ├── Bundle.php
│   ├── BundleItem.php
│   ├── Order.php
│   └── Recommendation.php
├── Services/
│   ├── BundleService.php
│   ├── ShopifyService.php
│   ├── RecommendationService.php
│   ├── AnalyticsService.php
│   ├── MLApiClient.php
│   └── OpenAIClient.php
├── Repositories/
│   ├── BundleRepository.php
│   ├── OrderRepository.php
│   └── AnalyticsRepository.php
└── Jobs/
    ├── ProcessNewOrder.php
    ├── GenerateRecommendations.php
    └── AggregateAnalytics.php
```

---

## Frontend (React)

```
resources/js/
├── components/
│   ├── Layout/
│   │   ├── AppFrame.tsx
│   │   ├── Navigation.tsx
│   │   └── TopBar.tsx
│   ├── Dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── BundleList.tsx
│   │   └── RecentActivity.tsx
│   ├── Bundles/
│   │   ├── BundleForm.tsx
│   │   ├── ProductPicker.tsx
│   │   └── BundlePreview.tsx
│   └── Shared/
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx
├── hooks/
│   ├── useBundles.ts
│   ├── useRecommendations.ts
│   └── useAnalytics.ts
├── services/
│   └── api.ts
├── types/
│   ├── bundle.ts
│   └── recommendation.ts
├── utils/
│   └── formatters.ts
└── App.tsx
```

---

## ML Service (Python)

```
ml-service/
├── main.py                  # FastAPI app
├── services/
│   ├── market_basket.py     # Apriori algorithm
│   └── cache_service.py     # Redis cache
├── models/
│   └── schemas.py           # Pydantic models
├── requirements.txt
└── Dockerfile
```

---

## File Naming Conventions

**PHP:**
- Controllers: `PascalCase` + `Controller` suffix
  - ✅ `BundleController.php`
  - ❌ `bundle_controller.php`
  
- Services: `PascalCase` + `Service` suffix
  - ✅ `ShopifyService.php`
  
- Models: `PascalCase` (singular)
  - ✅ `Bundle.php`, `User.php`
  - ❌ `Bundles.php`

**TypeScript/React:**
- Components: `PascalCase.tsx`
  - ✅ `BundleForm.tsx`
  - ❌ `bundleForm.tsx`
  
- Hooks: `camelCase.ts` with `use` prefix
  - ✅ `useBundles.ts`
  
- Utilities: `camelCase.ts`
  - ✅ `formatters.ts`

---

# 📝 CODING STANDARDS {#coding-standards}

## PHP (PSR-12)

### Class Structure

```php
<?php

namespace App\Services;

use App\Models\Bundle;
use App\Repositories\BundleRepository;
use Illuminate\Support\Collection;

class BundleService
{
    /**
     * Constructor.
     */
    public function __construct(
        private BundleRepository $repository,
        private ShopifyService $shopify
    ) {}
    
    /**
     * Create a new bundle.
     *
     * @param  array  $data
     * @return Bundle
     */
    public function create(array $data): Bundle
    {
        // Implementation
    }
    
    /**
     * Get bundles for user.
     *
     * @param  int  $userId
     * @return Collection
     */
    public function getByUser(int $userId): Collection
    {
        return $this->repository->findByUser($userId);
    }
}
```

### Naming Conventions

**Methods:**
- Use descriptive verb names
- ✅ `createBundle()`, `calculatePricing()`, `fetchProducts()`
- ❌ `process()`, `handle()`, `do()`

**Variables:**
- Use `camelCase`
- Be descriptive
- ✅ `$bundlePrice`, `$discountValue`
- ❌ `$bp`, `$dv`, `$data1`

**Constants:**
- Use `SCREAMING_SNAKE_CASE`
- ✅ `MAX_BUNDLES_PER_USER`
- ❌ `maxBundlesPerUser`

---

### Type Hints (Always)

```php
// ✅ Good
public function calculateDiscount(
    float $price, 
    string $type, 
    float $value
): float {
    return $type === 'percentage' 
        ? $price * ($value / 100)
        : $value;
}

// ❌ Bad
public function calculateDiscount($price, $type, $value) {
    return $type === 'percentage' 
        ? $price * ($value / 100)
        : $value;
}
```

---

### Early Returns

```php
// ✅ Good
public function createBundle(array $data): ?Bundle
{
    if (empty($data['products'])) {
        return null;
    }
    
    if ($this->hasReachedLimit($data['user_id'])) {
        throw new LimitExceededException();
    }
    
    return $this->repository->create($data);
}

// ❌ Bad
public function createBundle(array $data): ?Bundle
{
    if (!empty($data['products'])) {
        if (!$this->hasReachedLimit($data['user_id'])) {
            return $this->repository->create($data);
        } else {
            throw new LimitExceededException();
        }
    }
    return null;
}
```

---

## TypeScript/React

### Component Structure

```tsx
import { useState } from 'react';
import { Card, Button, TextStyle } from '@shopify/polaris';

interface BundleCardProps {
  title: string;
  price: number;
  onEdit: () => void;
}

export default function BundleCard({ 
  title, 
  price, 
  onEdit 
}: BundleCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await onEdit();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <Card.Section>
        <TextStyle variation="strong">{title}</TextStyle>
        <TextStyle>${price}</TextStyle>
        <Button 
          onClick={handleEdit}
          loading={isLoading}
        >
          Edit
        </Button>
      </Card.Section>
    </Card>
  );
}
```

---

### Naming Conventions

**Components:**
- PascalCase
- Descriptive names
- ✅ `BundleForm`, `ProductPicker`, `AnalyticsChart`
- ❌ `Form1`, `Picker`, `Chart`

**Functions:**
- camelCase
- Event handlers: `handle` prefix
- ✅ `handleSubmit`, `handleChange`, `fetchBundles`
- ❌ `submit`, `change`, `get`

**Boolean variables:**
- `is`, `has`, `should` prefix
- ✅ `isLoading`, `hasError`, `shouldShow`
- ❌ `loading`, `error`, `show`

---

### Hooks Best Practices

```tsx
// ✅ Good - Custom hook
export function useBundles() {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: () => api.bundles.list(),
  });
}

// Usage
const { data: bundles, isLoading } = useBundles();

// ✅ Good - Memoization
const sortedBundles = useMemo(() => {
  return bundles?.sort((a, b) => b.revenue - a.revenue);
}, [bundles]);

// ✅ Good - Cleanup
useEffect(() => {
  const interval = setInterval(fetchStats, 5000);
  return () => clearInterval(interval);
}, [fetchStats]);
```

---

## Code Formatting

### PHP (Laravel Pint)

```bash
# Format all files
./vendor/bin/pint

# Check without fixing
./vendor/bin/pint --test

# Format specific file
./vendor/bin/pint app/Services/BundleService.php
```

### JavaScript/TypeScript (Prettier)

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Format specific file
npx prettier --write src/components/BundleForm.tsx
```

---

# 🌿 GIT WORKFLOW {#git-workflow}

## Branch Strategy

```
main              ← Production (protected)
  └─ develop      ← Integration (protected)
       ├─ feature/bundle-crud
       ├─ feature/ai-recommendations
       ├─ bugfix/pricing-calculation
       └─ hotfix/critical-error
```

---

## Branch Naming

**Feature branches:**
```
feature/short-description
feature/bundle-edit-page
feature/gpt4-integration
```

**Bug fixes:**
```
bugfix/issue-description
bugfix/broken-product-picker
bugfix/cache-not-clearing
```

**Hotfixes (production):**
```
hotfix/critical-description
hotfix/auth-token-expired
```

---

## Commit Messages

### Format

```
type(scope): short description

Longer description if needed.

- Detail 1
- Detail 2

Refs: #123
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Add/update tests
- `chore`: Build/tooling changes

### Examples

```bash
# ✅ Good commits
feat(bundles): add product picker to bundle form
fix(api): handle null values in pricing calculation
refactor(services): extract pricing logic to helper
test(bundles): add tests for create bundle endpoint
docs(readme): update setup instructions

# ❌ Bad commits
update stuff
fixed bug
changes
wip
```

---

## Workflow Steps

### 1. Create Feature Branch

```bash
# Update develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/bundle-analytics

# Push to remote
git push -u origin feature/bundle-analytics
```

---

### 2. Make Changes

```bash
# Make changes
# ...

# Stage changes
git add .

# Commit with message
git commit -m "feat(analytics): add revenue chart to dashboard"

# Push to remote
git push
```

---

### 3. Keep Branch Updated

```bash
# Fetch latest from develop
git fetch origin develop

# Rebase on develop (keep history clean)
git rebase origin/develop

# Force push (rebase changed history)
git push --force-with-lease
```

---

### 4. Create Pull Request

**PR Template:**

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No console errors/warnings

## Related Issues
Closes #123
```

---

### 5. Code Review

**Reviewer checklist:**
- [ ] Code follows standards
- [ ] Tests included and passing
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Documentation updated
- [ ] No unnecessary dependencies

**Review comments format:**
```
[SUGGESTION] Consider extracting this to a helper function
[QUESTION] Why did you choose this approach?
[NITPICK] Typo: "recieve" → "receive"
[BLOCKER] This will cause a memory leak
```

---

### 6. Merge

**Squash and merge:**
```bash
# After PR approval
git checkout develop
git pull origin develop
git merge --squash feature/bundle-analytics
git commit -m "feat(analytics): add bundle analytics dashboard"
git push origin develop

# Delete feature branch
git branch -d feature/bundle-analytics
git push origin --delete feature/bundle-analytics
```

---

## Git Hooks (Husky)

### Pre-commit

```bash
#!/bin/sh
# .husky/pre-commit

# Run PHP linting
./vendor/bin/pint --test || exit 1

# Run PHP tests
php artisan test || exit 1

# Run JS linting
npm run lint || exit 1

# Run JS type check
npm run type-check || exit 1

echo "✅ Pre-commit checks passed"
```

---

### Pre-push

```bash
#!/bin/sh
# .husky/pre-push

# Run full test suite
php artisan test || exit 1
npm run test || exit 1

echo "✅ Pre-push checks passed"
```

---

# 🗄️ DATABASE GUIDELINES {#database-guidelines}

## Migration Best Practices

### Creating Migrations

```bash
# Create migration
php artisan make:migration create_bundles_table

# Migration with table name
php artisan make:migration add_status_to_bundles_table --table=bundles

# Run migrations
php artisan migrate

# Rollback last batch
php artisan migrate:rollback

# Reset and re-run
php artisan migrate:fresh --seed
```

---

### Migration Structure

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bundles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->string('discount_type'); // percentage, fixed_amount
            $table->decimal('discount_value', 10, 2);
            
            $table->decimal('original_price', 10, 2);
            $table->decimal('bundle_price', 10, 2);
            $table->decimal('savings', 10, 2);
            
            $table->string('status')->default('active');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bundles');
    }
};
```

---

### Migration Rules

**DO:**
- ✅ Add indexes for foreign keys
- ✅ Add indexes for commonly queried columns
- ✅ Use appropriate column types
- ✅ Add `timestamps()` to all tables
- ✅ Always implement `down()` method

**DON'T:**
- ❌ Modify existing migrations (create new ones)
- ❌ Use `auto_increment` directly (use `id()`)
- ❌ Forget foreign key constraints
- ❌ Create indexes on JSONB columns

---

## Query Optimization

### Eager Loading (Avoid N+1)

```php
// ❌ Bad - N+1 query problem
$bundles = Bundle::all();
foreach ($bundles as $bundle) {
    echo $bundle->user->name; // Queries user each time
}

// ✅ Good - Eager loading
$bundles = Bundle::with('user')->get();
foreach ($bundles as $bundle) {
    echo $bundle->user->name; // Already loaded
}

// ✅ Better - Multiple relationships
$bundles = Bundle::with(['user', 'items.product'])
    ->where('status', 'active')
    ->get();
```

---

### Select Only Needed Columns

```php
// ❌ Bad - Selects all columns
$bundles = Bundle::all();

// ✅ Good - Select specific columns
$bundles = Bundle::select('id', 'title', 'bundle_price')
    ->where('user_id', $userId)
    ->get();
```

---

### Chunking Large Results

```php
// ✅ Good - For large datasets
Bundle::where('status', 'active')
    ->chunk(100, function ($bundles) {
        foreach ($bundles as $bundle) {
            // Process each bundle
        }
    });
```

---

### Raw Queries (When Needed)

```php
// Complex aggregation
$stats = DB::table('bundles')
    ->select(DB::raw('
        COUNT(*) as total_bundles,
        SUM(total_revenue) as revenue,
        AVG(bundle_price) as avg_price
    '))
    ->where('user_id', $userId)
    ->where('status', 'active')
    ->first();
```

---

# 🔌 API DEVELOPMENT {#api-development}

## Controller Pattern

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBundleRequest;
use App\Http\Requests\UpdateBundleRequest;
use App\Services\BundleService;
use Illuminate\Http\JsonResponse;

class BundleController extends Controller
{
    public function __construct(
        private BundleService $bundleService
    ) {}
    
    /**
     * List all bundles.
     */
    public function index(): JsonResponse
    {
        $bundles = $this->bundleService->getByUser(
            auth()->id()
        );
        
        return response()->json([
            'data' => $bundles
        ]);
    }
    
    /**
     * Create new bundle.
     */
    public function store(CreateBundleRequest $request): JsonResponse
    {
        $bundle = $this->bundleService->create(
            $request->validated()
        );
        
        return response()->json([
            'data' => $bundle
        ], 201);
    }
    
    /**
     * Show bundle details.
     */
    public function show(int $id): JsonResponse
    {
        $bundle = $this->bundleService->find($id);
        
        if (!$bundle) {
            return response()->json([
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Bundle not found'
                ]
            ], 404);
        }
        
        return response()->json([
            'data' => $bundle
        ]);
    }
    
    /**
     * Update bundle.
     */
    public function update(
        UpdateBundleRequest $request, 
        int $id
    ): JsonResponse {
        $bundle = $this->bundleService->update(
            $id,
            $request->validated()
        );
        
        return response()->json([
            'data' => $bundle
        ]);
    }
    
    /**
     * Delete bundle.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->bundleService->delete($id);
        
        return response()->json([
            'message' => 'Bundle deleted successfully'
        ]);
    }
}
```

---

## Request Validation

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBundleRequest extends FormRequest
{
    /**
     * Determine if user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:1|max:100',
            'products' => 'required|array|min:2|max:10',
            'products.*.variant_id' => 'required|integer',
            'products.*.quantity' => 'integer|min:1|max:100',
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'products.min' => 'Bundle must contain at least 2 products',
            'products.max' => 'Bundle cannot contain more than 10 products',
        ];
    }
}
```

---

## Error Handling

```php
// app/Exceptions/Handler.php

public function render($request, Throwable $exception)
{
    // API requests
    if ($request->expectsJson()) {
        // Validation errors
        if ($exception instanceof ValidationException) {
            return response()->json([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'The given data was invalid.',
                    'details' => $exception->errors()
                ]
            ], 422);
        }
        
        // Not found
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Resource not found'
                ]
            ], 404);
        }
        
        // Server error
        return response()->json([
            'error' => [
                'code' => 'SERVER_ERROR',
                'message' => 'An unexpected error occurred'
            ]
        ], 500);
    }
    
    return parent::render($request, $exception);
}
```

---

# ⚛️ FRONTEND DEVELOPMENT {#frontend-development}

## API Client

```typescript
// services/api.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopify_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  bundles: {
    list: () => client.get('/bundles'),
    get: (id: number) => client.get(`/bundles/${id}`),
    create: (data: BundleInput) => client.post('/bundles', data),
    update: (id: number, data: BundleInput) => 
      client.put(`/bundles/${id}`, data),
    delete: (id: number) => client.delete(`/bundles/${id}`),
  },
  
  recommendations: {
    list: () => client.get('/recommendations'),
    accept: (id: string) => client.post(`/recommendations/${id}/accept`),
  },
};
```

---

## React Query Hooks

```typescript
// hooks/useBundles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useBundles() {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      const { data } = await api.bundles.list();
      return data.data;
    },
  });
}

export function useBundle(id: number) {
  return useQuery({
    queryKey: ['bundles', id],
    queryFn: async () => {
      const { data } = await api.bundles.get(id);
      return data.data;
    },
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.bundles.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useUpdateBundle(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BundleInput) => api.bundles.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles', id] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}
```

---

# 🧪 TESTING GUIDELINES {#testing-guidelines}

## Unit Tests (PHPUnit)

```php
<?php

namespace Tests\Unit\Services;

use App\Services\BundleService;
use Tests\TestCase;

class BundleServiceTest extends TestCase
{
    private BundleService $service;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(BundleService::class);
    }
    
    /** @test */
    public function it_calculates_percentage_discount_correctly()
    {
        $originalPrice = 100.00;
        $discountValue = 15.0;
        
        $result = $this->service->calculateDiscount(
            $originalPrice,
            'percentage',
            $discountValue
        );
        
        $this->assertEquals(15.00, $result);
    }
    
    /** @test */
    public function it_calculates_fixed_discount_correctly()
    {
        $originalPrice = 100.00;
        $discountValue = 20.0;
        
        $result = $this->service->calculateDiscount(
            $originalPrice,
            'fixed_amount',
            $discountValue
        );
        
        $this->assertEquals(20.00, $result);
    }
}
```

---

## Feature Tests (PHPUnit)

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Bundle;
use Tests\TestCase;

class BundleApiTest extends TestCase
{
    /** @test */
    public function user_can_create_bundle()
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
                    ['variant_id' => 456, 'quantity' => 1],
                ],
            ]);
        
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'bundle_price',
                ],
            ]);
        
        $this->assertDatabaseHas('bundles', [
            'user_id' => $user->id,
            'title' => 'Test Bundle',
        ]);
    }
}
```

---

## Frontend Tests (Jest + RTL)

```typescript
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
  
  it('validates required fields', async () => {
    render(<BundleForm onSubmit={jest.fn()} />);
    
    fireEvent.click(screen.getByText('Save Bundle'));
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });
  
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<BundleForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Bundle Title'), {
      target: { value: 'Test Bundle' },
    });
    
    fireEvent.click(screen.getByText('Save Bundle'));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Bundle',
        })
      );
    });
  });
});
```

---

# 🚀 DEPLOYMENT {#deployment}

## Production Deployment

### 1. Pre-deployment Checklist

```bash
# Run all tests
php artisan test
npm run test

# Check code quality
./vendor/bin/phpcs
npm run lint

# Build frontend
npm run build

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (dry-run)
php artisan migrate --pretend
```

---

### 2. Deploy Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# 1. Maintenance mode
php artisan down --message="Updating..." --retry=60

# 2. Git pull
git pull origin main

# 3. Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# 4. Build assets
npm run build

# 5. Run migrations
php artisan migrate --force

# 6. Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 7. Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Restart queue workers
php artisan queue:restart

# 9. End maintenance mode
php artisan up

echo "✅ Deployment complete!"
```

---

### 3. Rollback Script

```bash
#!/bin/bash
# rollback.sh

set -e

echo "⏮️ Rolling back..."

# 1. Maintenance mode
php artisan down

# 2. Git revert
git reset --hard HEAD~1

# 3. Rollback migrations
php artisan migrate:rollback --step=1

# 4. Reinstall dependencies
composer install --no-dev --optimize-autoloader

# 5. Clear caches
php artisan cache:clear
php artisan config:cache

# 6. End maintenance mode
php artisan up

echo "✅ Rollback complete!"
```

---

# 🔧 TROUBLESHOOTING {#troubleshooting}

## Common Issues

### Issue: "Class not found" error

**Cause:** Composer autoload not updated

**Solution:**
```bash
composer dump-autoload
```

---

### Issue: Queue jobs not processing

**Cause:** Queue worker not running

**Solution:**
```bash
# Check if worker is running
ps aux | grep queue:work

# Start worker
php artisan queue:work

# Or use supervisor (production)
sudo supervisorctl restart laravel-worker:*
```

---

### Issue: Frontend not updating

**Cause:** Vite not rebuilding

**Solution:**
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

---

### Issue: Database connection failed

**Cause:** Wrong credentials or PostgreSQL not running

**Solution:**
```bash
# Check PostgreSQL status
sudo service postgresql status

# Test connection
psql -U bundlerpro -d bundlerpro_dev

# Check .env credentials
cat .env | grep DB_
```

---

### Issue: API returns 500 error

**Cause:** Check logs

**Solution:**
```bash
# View Laravel logs
tail -f storage/logs/laravel.log

# View nginx/Apache logs
tail -f /var/log/nginx/error.log

# Check Sentry (production)
```

---

# 📚 COMMON TASKS {#common-tasks}

## Add New API Endpoint

**1. Create route:**
```php
// routes/api.php
Route::get('/bundles/{id}/analytics', [BundleController::class, 'analytics']);
```

**2. Create controller method:**
```php
public function analytics(int $id): JsonResponse
{
    $data = $this->analyticsService->getBundleStats($id);
    return response()->json(['data' => $data]);
}
```

**3. Add test:**
```php
/** @test */
public function can_get_bundle_analytics()
{
    $bundle = Bundle::factory()->create();
    
    $response = $this->getJson("/api/v1/bundles/{$bundle->id}/analytics");
    
    $response->assertOk();
}
```

---

## Add New Database Table

**1. Create migration:**
```bash
php artisan make:migration create_table_name_table
```

**2. Define schema:**
```php
Schema::create('table_name', function (Blueprint $table) {
    $table->id();
    // columns...
    $table->timestamps();
});
```

**3. Create model:**
```bash
php artisan make:model TableName
```

**4. Run migration:**
```bash
php artisan migrate
```

---

## Add New React Component

**1. Create component file:**
```bash
# Create directory if needed
mkdir -p resources/js/components/NewFeature

# Create component
touch resources/js/components/NewFeature/MyComponent.tsx
```

**2. Component boilerplate:**
```tsx
import { Card } from '@shopify/polaris';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return (
    <Card>
      <Card.Section>
        <p>{title}</p>
      </Card.Section>
    </Card>
  );
}
```

**3. Add tests:**
```typescript
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/NewFeature/MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## Debug Performance Issue

**1. Enable query logging:**
```php
// AppServiceProvider boot()
DB::listen(function ($query) {
    Log::info('SQL Query:', [
        'sql' => $query->sql,
        'bindings' => $query->bindings,
        'time' => $query->time,
    ]);
});
```

**2. Use Laravel Telescope (dev):**
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Access at /telescope
```

**3. Profile with Xdebug:**
```bash
# Enable profiling in php.ini
xdebug.mode=profile
xdebug.output_dir=/tmp

# Analyze with tools like webgrind
```

---

# 🎓 LEARNING RESOURCES

## Documentation

- **Laravel:** https://laravel.com/docs
- **React:** https://react.dev
- **Shopify App:** https://shopify.dev/apps
- **Shopify Polaris:** https://polaris.shopify.com

## Internal Resources

- **Confluence:** [Internal wiki link]
- **Slack Channels:**
  - #dev-bundlerpro
  - #dev-help
  - #deployments

## Code Review Guidelines

- Read: [internal code review doc]
- PR template in `.github/pull_request_template.md`

---

**FIN DEL DEVELOPER HANDBOOK**

**¿Preguntas?** Contacta: tech-lead@bundlerpro.app

**Última actualización:** Enero 2026  
**Mantenido por:** Tech Lead
