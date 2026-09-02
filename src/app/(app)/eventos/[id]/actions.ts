"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserAndCouple } from "@/lib/supabase/helpers";
import type { EventItemStatus } from "@/lib/types";

export type CategoryState = { error: string } | undefined;

export async function addCategory(
  eventId: string,
  _prevState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Ponle un nombre a la categoría." };
  }

  const { supabase, coupleId } = await getCurrentUserAndCouple();
  const { error } = await supabase
    .from("event_categories")
    .insert({ event_id: eventId, couple_id: coupleId, name });

  if (error) {
    return { error: "No pudimos crear la categoría." };
  }

  revalidatePath(`/eventos/${eventId}`);
  return undefined;
}

export type ItemState = { error: string } | undefined;

export async function addItem(
  eventId: string,
  categoryId: string,
  _prevState: ItemState,
  formData: FormData
): Promise<ItemState> {
  const name = String(formData.get("name") ?? "").trim();
  const estimatedCost = formData.get("estimated_cost");
  const notes = String(formData.get("notes") ?? "").trim();
  const family = String(formData.get("family") ?? "").trim();
  const tableNumber = String(formData.get("table_number") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();

  if (!name) {
    return { error: "Escribe el nombre del ítem." };
  }

  const { supabase, coupleId } = await getCurrentUserAndCouple();
  const { error } = await supabase.from("event_items").insert({
    category_id: categoryId,
    couple_id: coupleId,
    name,
    estimated_cost: estimatedCost ? Number(estimatedCost) : null,
    notes: notes || null,
    family: family || null,
    table_number: tableNumber || null,
    ingredients: ingredients || null,
  });

  if (error) {
    return { error: "No pudimos agregar el ítem." };
  }

  revalidatePath(`/eventos/${eventId}`);
  return undefined;
}

export async function updateItem(
  eventId: string,
  itemId: string,
  _prevState: ItemState,
  formData: FormData
): Promise<ItemState> {
  const name = String(formData.get("name") ?? "").trim();
  const estimatedCost = formData.get("estimated_cost");
  const notes = String(formData.get("notes") ?? "").trim();
  const family = String(formData.get("family") ?? "").trim();
  const tableNumber = String(formData.get("table_number") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();

  if (!name) {
    return { error: "Escribe el nombre del ítem." };
  }

  const { supabase } = await getCurrentUserAndCouple();
  const { error } = await supabase
    .from("event_items")
    .update({
      name,
      estimated_cost: estimatedCost ? Number(estimatedCost) : null,
      notes: notes || null,
      family: family || null,
      table_number: tableNumber || null,
      ingredients: ingredients || null,
    })
    .eq("id", itemId);

  if (error) {
    return { error: "No pudimos actualizar el ítem." };
  }

  revalidatePath(`/eventos/${eventId}`);
  return undefined;
}

export async function deleteItem(eventId: string, itemId: string) {
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("event_items").delete().eq("id", itemId);
  revalidatePath(`/eventos/${eventId}`);
}

export async function updateItemStatus(eventId: string, itemId: string, status: EventItemStatus) {
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("event_items").update({ status }).eq("id", itemId);
  revalidatePath(`/eventos/${eventId}`);
}

export async function deleteEventAndRedirect(eventId: string) {
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/eventos");
  redirect("/eventos");
}
