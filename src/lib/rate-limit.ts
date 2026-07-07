import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const CONTACT_LIMIT = 5;
const CONTACT_WINDOW = "15 m";

function getRedisUrl() {
  return (
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim()
  );
}

function getRedisToken() {
  return (
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim()
  );
}

function createContactRateLimiter() {
  const url = getRedisUrl();
  const token = getRedisToken();

  if (!url || !token) {
    return null;
  }

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(CONTACT_LIMIT, CONTACT_WINDOW),
    prefix: "rl:contact",
    analytics: true,
  });
}

let contactRateLimiter = createContactRateLimiter();

export function isContactRateLimitConfigured() {
  return contactRateLimiter !== null;
}

export function getContactRateLimitConfig() {
  return { limit: CONTACT_LIMIT, window: CONTACT_WINDOW };
}

export async function limitContactRequest(identifier: string) {
  if (!contactRateLimiter) {
    contactRateLimiter = createContactRateLimiter();
  }

  if (!contactRateLimiter) {
    return null;
  }

  return contactRateLimiter.limit(identifier);
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
