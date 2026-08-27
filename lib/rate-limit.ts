/**
 * In-memory login rate limit: 5 attempts per 15 minutes per IP.
 * Resets on cold start — move to Upstash if abuse appears (see DECISIONS.md).
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(ip, recent);
  return recent.length >= MAX_ATTEMPTS;
}

export function recordAttempt(ip: string): void {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
