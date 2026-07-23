/**
 * Provider-independent rate-limit interface.
 *
 * Upstash Redis is implemented below (see UpstashRateLimiter) and selected
 * via RATE_LIMIT_PROVIDER=upstash. It was chosen because Upstash's Redis
 * REST API is plain HTTPS — no client library or persistent TCP connection
 * required, which matters specifically in serverless/edge runtimes where a
 * traditional Redis client's connection model doesn't fit well. No new
 * dependency is added to package.json; this integration is a handful of
 * `fetch` calls.
 *
 * The in-memory fallback below remains a development/demo convenience
 * only — it is NOT durable across serverless invocations or multiple
 * instances, and must NOT be relied on in production.
 */

export interface RateLimitResult {
  success: boolean;
  /** Seconds until the caller may retry, if rate-limited. */
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  /** Checks and records a request attempt for the given identifier (e.g. IP address or hashed IP). */
  check(identifier: string): Promise<RateLimitResult>;
}

/**
 * Development-only in-memory limiter. Resets on cold start/restart and is
 * per-instance only — explicitly not suitable for production.
 */
class InMemoryDevRateLimiter implements RateLimiter {
  private readonly attempts = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(options: { windowMs: number; maxAttempts: number }) {
    this.windowMs = options.windowMs;
    this.maxAttempts = options.maxAttempts;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const existing = (this.attempts.get(identifier) ?? []).filter((t) => t > windowStart);

    if (existing.length >= this.maxAttempts) {
      const oldestAttempt = existing[0];
      const retryAfterSeconds = Math.ceil(((oldestAttempt ?? now) + this.windowMs - now) / 1000);
      return { success: false, retryAfterSeconds };
    }

    existing.push(now);
    this.attempts.set(identifier, existing);
    return { success: true };
  }
}

/**
 * Production rate limiting via Upstash Redis's REST API. Uses a simple
 * fixed-window counter: INCR a per-identifier key, set its TTL only on the
 * first increment in a window, and compare against maxAttempts. Throws on
 * any request failure rather than silently allowing or blocking — the
 * caller (lib/actions.ts) already catches this and shows the user an
 * honest error state while logging the real cause server-side.
 */
class UpstashRateLimiter implements RateLimiter {
  constructor(
    private readonly restUrl: string,
    private readonly restToken: string,
    private readonly windowMs: number,
    private readonly maxAttempts: number
  ) {}

  private async command(path: string): Promise<{ result: number }> {
    const response = await fetch(`${this.restUrl}${path}`, {
      headers: { Authorization: `Bearer ${this.restToken}` },
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "<no response body>");
      throw new Error(`Upstash rate-limit request failed (status ${response.status}): ${body}`);
    }
    return response.json();
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const key = `contact-form-rate-limit:${identifier}`;
    const windowSeconds = Math.ceil(this.windowMs / 1000);

    const { result: count } = await this.command(`/incr/${encodeURIComponent(key)}`);

    if (count === 1) {
      // First request in this window — set the TTL so the counter resets
      // after windowSeconds. Only done on the first increment so later
      // increments in the same window don't keep pushing the expiry back.
      await this.command(`/expire/${encodeURIComponent(key)}/${windowSeconds}`);
    }

    if (count > this.maxAttempts) {
      const ttl = await this.command(`/ttl/${encodeURIComponent(key)}`).catch(() => ({ result: windowSeconds }));
      const retryAfterSeconds = ttl.result > 0 ? ttl.result : windowSeconds;
      return { success: false, retryAfterSeconds };
    }

    return { success: true };
  }
}

/**
 * Placeholder for production if RATE_LIMIT_PROVIDER is unset. Throws
 * clearly rather than silently falling back to the in-memory limiter, so
 * misconfiguration in production is impossible to miss.
 */
class UnconfiguredProductionRateLimiter implements RateLimiter {
  async check(): Promise<RateLimitResult> {
    throw new Error(
      "RATE_LIMIT_PROVIDER is not configured. A persistent external rate-limit " +
        "provider must be configured before the contact form can accept " +
        "submissions in production. See .env.example."
    );
  }
}

let cachedLimiter: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (cachedLimiter) return cachedLimiter;

  const provider = process.env.RATE_LIMIT_PROVIDER?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  const windowMs = 60_000;
  const maxAttempts = 5;

  if (provider === "upstash") {
    const restUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const restToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

    if (!restUrl || !restToken) {
      throw new Error(
        "RATE_LIMIT_PROVIDER=upstash requires UPSTASH_REDIS_REST_URL and " +
          "UPSTASH_REDIS_REST_TOKEN to be set. See .env.example."
      );
    }

    cachedLimiter = new UpstashRateLimiter(restUrl, restToken, windowMs, maxAttempts);
    return cachedLimiter;
  }

  if (provider) {
    throw new Error(
      `RATE_LIMIT_PROVIDER="${provider}" is not a recognized provider. Supported: "upstash". ` +
        "Add further integrations in lib/rate-limit.ts if needed."
    );
  }

  if (isProduction) {
    cachedLimiter = new UnconfiguredProductionRateLimiter();
  } else {
    cachedLimiter = new InMemoryDevRateLimiter({ windowMs, maxAttempts });
  }

  return cachedLimiter;
}
