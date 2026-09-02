import { createClient } from "./server";

export async function getCurrentUserAndCouple() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("couple_id")
    .eq("id", user.id)
    .single();

  if (!profile?.couple_id) {
    throw new Error("Tu cuenta todavía no está unida a una pareja");
  }

  return { supabase, user, coupleId: profile.couple_id as string };
}
