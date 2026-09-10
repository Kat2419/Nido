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

export async function updateEventVenue(
  eventId: string,
  _prevState: EventState,
  formData: FormData
): Promise<EventState> {
  const eventDate = String(formData.get("event_date") ?? "").trim();
  const coupleNames = String(formData.get("couple_names") ?? "").trim();
  const venueName = String(formData.get("venue_name") ?? "").trim();
  const venueAddress = String(formData.get("venue_address") ?? "").trim();
  const eventTime = String(formData.get("event_time") ?? "").trim();
  const dressCode = String(formData.get("dress_code") ?? "").trim();
  const colorReservationNote = String(formData.get("color_reservation_note") ?? "").trim();
  const giftNote = String(formData.get("gift_note") ?? "").trim();

  const { supabase } = await getCurrentUserAndCouple();
  const { error } = await supabase
    .from("events")
    .update({
      event_date: eventDate || null,
      couple_names: coupleNames || null,
      venue_name: venueName || null,
      venue_address: venueAddress || null,
      event_time: eventTime || null,
      dress_code: dressCode || null,
      color_reservation_note: colorReservationNote || null,
      gift_note: giftNote || null,
    })
    .eq("id", eventId);

  if (error) {
    return { error: "No pudimos guardar la sede." };
  }

  revalidatePath(`/eventos/${eventId}`);
  return undefined;
}

export async function updateEventMessage(
  eventId: string,
  _prevState: EventState,
  formData: FormData
): Promise<EventState> {
  const welcomeMessage = String(formData.get("welcome_message") ?? "").trim();
  const welcomeMessageHighlight = String(formData.get("welcome_message_highlight") ?? "").trim();

  const { supabase } = await getCurrentUserAndCouple();
  const { error } = await supabase
    .from("events")
    .update({
      welcome_message: welcomeMessage || null,
      welcome_message_highlight: welcomeMessageHighlight || null,
    })
    .eq("id", eventId);

  if (error) {
    return { error: "No pudimos guardar el mensaje." };
  }

  revalidatePath(`/eventos/${eventId}`);
  return undefined;
}
