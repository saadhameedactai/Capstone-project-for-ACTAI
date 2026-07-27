import { createClient } from "@supabase/supabase-js";

// Public client (safe for browser use) - respects Row Level Security
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client (server-only!) - bypasses RLS, used in API routes for
// operations like seat allocation that must run with full trust.
// NEVER import this in a client component.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
