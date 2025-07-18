import { createClient as createBrowserClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * We expose a browser-safe Supabase client as a singleton.
 * This prevents creating multiple clients that would each try to
 * manage their own realtime socket connections.
 */
declare global {
  // eslint-disable-next-line no-var
  var __supabase_client__: SupabaseClient | undefined
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getBrowserClient(): SupabaseClient {
  if (!globalThis.__supabase_client__) {
    globalThis.__supabase_client__ = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return globalThis.__supabase_client__
}

/**
 * Default export – ready-to-use singleton client.
 *   import { supabase } from "@/lib/supabase/client"
 */
export const supabase = getBrowserClient()

/**
 * Named export that matches what some files already import:
 *   import { createClient } from "@/lib/supabase/client"
 *
 * Use this if you need to create a *scoped* client (e.g. for RLS).
 */
export { createBrowserClient as createClient }
