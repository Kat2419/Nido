"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { RsvpStatus } from "@/lib/types";

export async function submitRsvp(code: string, status: Exclude<RsvpStatus, "pendiente">) {
  if (status !== "asiste" && status !== "no_asiste") return;

  const supabase = createAdminClient();
  await supabase
    .from("event_items")
    .update({ rsvp_status: status, rsvp_responded_at: new Date().toISOString() })
    .eq("rsvp_code", code);
}
