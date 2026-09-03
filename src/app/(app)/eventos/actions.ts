"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserAndCouple } from "@/lib/supabase/helpers";
import { DEFAULT_EVENT_CATEGORIES } from "@/lib/types";

export type EventState = { error: string } | undefined;

export async function createEvent(_prevState: EventState, formData: FormData): Promise<EventState> {
  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (!title) {
    return { error: "Ponle un nombre al evento." };
  }

  const { supabase, coupleId } = await getCurrentUserAndCouple();

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      couple_id: coupleId,
      title,
      event_date: eventDate || null,
      description: description || null,
    })
    .select("id")
    .single();

  if (error || !event) {
    return { error: "No pudimos crear el evento." };
  }

  await supabase.from("event_categories").insert(
    DEFAULT_EVENT_CATEGORIES.map(({ name, group }) => ({
      event_id: event.id,
      couple_id: coupleId,
      name,
      group_name: group,
    }))
  );

  revalidatePath("/eventos");
  redirect(`/eventos/${event.id}`);
}

export async function deleteEvent(id: string) {
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/eventos");
}
