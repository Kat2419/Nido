import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con service role: bypassa RLS. Úsalo solo en Server Components o
// Server Actions para leer/escribir datos de invitados que no tienen sesión
// de Supabase (páginas públicas de /invitacion). Nunca lo importes desde un
// componente cliente.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
