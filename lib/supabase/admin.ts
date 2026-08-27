import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. Server-only — never import from a client component.
 * Used by server actions for admin mutations and enquiry inserts.
 */
let client: SupabaseClient | null | undefined;

export function getAdminClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !url.startsWith("http")) {
    client = null;
    return client;
  }
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
