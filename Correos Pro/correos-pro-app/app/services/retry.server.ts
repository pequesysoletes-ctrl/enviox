/**
 * MRW API Retry Logic — Resilient API calls with exponential backoff
 * Wraps any async function with retry capabilities
 */

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryableStatuses: number[];
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,      // 1s, 2s, 4s
  maxDelayMs: 10000,       // max 10s
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

/**
 * Execute an async function with retry logic
 * Uses exponential backoff with jitter
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
    try {
      const result = await fn();
      if (attempt > 0) {
        console.log(`[Retry] Succeeded on attempt ${attempt + 1}`);
      }
      return result;
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      const statusCode = error?.statusCode || error?.status || 0;
      const isRetryable = cfg.retryableStatuses.includes(statusCode) ||
        error?.message?.includes("ECONNRESET") ||
        error?.message?.includes("ETIMEDOUT") ||
        error?.message?.includes("ENOTFOUND") ||
        error?.code === "ECONNREFUSED";

      if (attempt >= cfg.maxRetries || !isRetryable) {
        console.error(`[Retry] Failed after ${attempt + 1} attempts:`, error?.message);
        throw error;
      }

      // Calculate delay with exponential backoff + jitter
      const exponentialDelay = cfg.baseDelayMs * Math.pow(2, attempt);
      const jitter = Math.random() * 500;
      const delay = Math.min(exponentialDelay + jitter, cfg.maxDelayMs);

      console.warn(`[Retry] Attempt ${attempt + 1} failed (${error?.message}). Retrying in ${Math.round(delay)}ms...`);
      await sleep(delay);
    }
  }

  throw lastError || new Error("All retry attempts failed");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Circuit breaker — prevents hammering a failing service
 */
interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

const circuits: Map<string, CircuitState> = new Map();

const CIRCUIT_THRESHOLD = 5;        // failures before opening
const CIRCUIT_RESET_MS = 60_000;    // 1 min cooldown

export function withCircuitBreaker<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const state = circuits.get(name) || { failures: 0, lastFailure: 0, isOpen: false };

  // Check if circuit should be half-open
  if (state.isOpen && Date.now() - state.lastFailure > CIRCUIT_RESET_MS) {
    state.isOpen = false;
    state.failures = 0;
    console.log(`[Circuit:${name}] Reset — trying again`);
  }

  if (state.isOpen) {
    return Promise.reject(new Error(
      `[Circuit:${name}] Circuit is OPEN — MRW API temporarily unavailable. Retry in ${Math.round((CIRCUIT_RESET_MS - (Date.now() - state.lastFailure)) / 1000)}s`
    ));
  }

  return fn()
    .then((result) => {
      state.failures = 0;
      state.isOpen = false;
      circuits.set(name, state);
      return result;
    })
    .catch((error) => {
      state.failures++;
      state.lastFailure = Date.now();
      if (state.failures >= CIRCUIT_THRESHOLD) {
        state.isOpen = true;
        console.error(`[Circuit:${name}] OPENED after ${state.failures} failures`);
      }
      circuits.set(name, state);
      throw error;
    });
}

/**
 * Combined: retry + circuit breaker for MRW API calls
 */
export async function resilientMrwCall<T>(
  fn: () => Promise<T>,
  retryConfig?: Partial<RetryConfig>,
): Promise<T> {
  return withCircuitBreaker("mrw-api", () => withRetry(fn, retryConfig));
}
