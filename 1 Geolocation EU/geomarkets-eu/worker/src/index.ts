// ═══════════════════════════════════════════════════════════════
// Cloudflare Worker — GeoMarkets Detection Endpoint
// Edge-computed geo detection with <50ms response time
// Uses cf.country header (Cloudflare built-in) + KV for shop config
// ═══════════════════════════════════════════════════════════════

import { isBotUA } from './bot-filter';
import { resolveMarket } from './market-resolver';

interface Env {
  SHOP_CONFIG_KV: KVNamespace;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(),
      });
    }

    // Health check
    if (url.pathname === '/health') {
      return jsonResponse({ status: 'ok', version: '1.0.0' });
    }

    // Main detection endpoint
    if (url.pathname === '/detect') {
      return handleDetect(request, env);
    }

    // Event logging endpoint (batch analytics)
    if (url.pathname === '/event' && request.method === 'POST') {
      return handleEvent(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleDetect(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return jsonResponse({ error: 'Missing shop parameter' }, 400);
  }

  // 1. Check for bots — never redirect search engine crawlers
  const ua = request.headers.get('User-Agent') || '';
  if (isBotUA(ua)) {
    return jsonResponse({ redirect: null, reason: 'bot' });
  }

  // 2. Detect country using Cloudflare's built-in geolocation
  // This is available on all Cloudflare plans (free included!)
  const cf = (request as any).cf;
  const country = cf?.country || url.searchParams.get('country') || null;

  if (!country) {
    return jsonResponse({ redirect: null, reason: 'unknown_country' });
  }

  // 3. Load shop config from KV
  const shopConfig = await env.SHOP_CONFIG_KV.get(shop, 'json') as any;
  if (!shopConfig) {
    return jsonResponse({
      country,
      redirect: null,
      reason: 'shop_not_configured',
    });
  }

  // 4. Check if current path is excluded
  const referer = request.headers.get('Referer') || '';
  const currentPath = referer ? new URL(referer).pathname : '/';
  if (isExcludedPath(currentPath, shopConfig.excludedUrls || [])) {
    return jsonResponse({
      country,
      redirect: null,
      reason: 'excluded_url',
    });
  }

  // 5. Resolve target market
  const market = resolveMarket(country, shopConfig.markets);

  // 6. Return detection result
  return jsonResponse({
    country,
    redirect: market?.url || null,
    lang: market?.locale || null,
    market: market?.name || null,
    currency: market?.currency || null,
    mode: shopConfig.redirectMode || 'auto',
    banner: shopConfig.redirectMode === 'banner' && shopConfig.banner
      ? {
          text: shopConfig.banner.textTemplates?.[market?.locale?.split('-')[0] || 'en'] || null,
          buttons: shopConfig.banner.buttonLabels?.[market?.locale?.split('-')[0] || 'en'] || null,
          showFlag: shopConfig.banner.showFlag ?? true,
          showDismiss: shopConfig.banner.showDismiss ?? true,
          position: shopConfig.banner.position || 'top',
        }
      : null,
  });
}

async function handleEvent(request: Request, env: Env): Promise<Response> {
  // Accept batch analytics events from the storefront script
  // These get processed by the app via webhook or cron
  try {
    const body = await request.json() as any;
    // For now, just acknowledge — the app will poll or we'll use Logpush
    return jsonResponse({ received: true });
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }
}

function isExcludedPath(path: string, excludedUrls: string[]): boolean {
  for (const pattern of excludedUrls) {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (path.startsWith(prefix)) return true;
    } else if (path === pattern) {
      return true;
    }
  }

  // Always exclude checkout and cart
  if (path.startsWith('/checkout') || path.startsWith('/cart')) {
    return true;
  }

  return false;
}

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
      'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 min CDN cache
    },
  });
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}
