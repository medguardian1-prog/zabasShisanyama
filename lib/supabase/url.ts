/**
 * Normalises NEXT_PUBLIC_SUPABASE_URL.
 *
 * The API URL must be the bare project origin (https://<ref>.supabase.co).
 * Two mistakes are common and both produce confusing runtime errors rather
 * than an obvious misconfiguration:
 *
 *   - a trailing slash, which builds "…co//rest/v1/…" and is rejected by the
 *     API gateway with "Invalid path specified in request URL"
 *   - pasting the dashboard URL (https://supabase.com/dashboard/project/<ref>)
 *     instead of the project API URL
 *
 * Returns null when the value is unusable, so callers fall back to empty
 * data instead of throwing.
 */
export function normaliseSupabaseUrl(raw: string | undefined): string | null {
  if (!raw) return null;

  const value = raw.trim().replace(/\/+$/, "");
  if (!value || value === "TODO" || !value.startsWith("http")) return null;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  // The dashboard URL carries the project ref in its path — recover the
  // real API origin from it rather than failing silently.
  const dashboardMatch = parsed.pathname.match(/\/project\/([a-z0-9]{16,})/i);
  if (dashboardMatch) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Anything else with a path is not a valid API origin.
  return parsed.origin;
}
