import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Anon-key client for server components. Read-only in practice — RLS
 * restricts anon access to visible rows. Returns null when env vars are
 * absent so the app builds and renders honest empty states before the
 * Supabase project is wired up.
 */
let client: SupabaseClient | null | undefined;

export function getServerClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !url.startsWith("http")) {
    client = null;
    return client;
  }
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
