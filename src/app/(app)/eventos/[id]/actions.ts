"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserAndCouple } from "@/lib/supabase/helpers";
import {
  DEFAULT_CATEGORY_GROUP,
  EVENT_CATEGORY_GROUPS,
  EVENT_PHOTOS_BUCKET,
  type EventCategoryGroup,
  type EventItemStatus,
} from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

function parseCategoryGroup(value: FormDataEntryValue | null): EventCategoryGroup {
  const groups: readonly string[] = EVENT_CATEGORY_GROUPS;
  return groups.includes(String(value)) ? (value as EventCategoryGroup) : DEFAULT_CATEGORY_GROUP;
}

async function uploadItemPhoto(
  supabase: SupabaseClient,
  coupleId: string,
  formData: FormData
): Promise<string | null> {
  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return null;
  }

  const ext = photo.name.includes(".") ? photo.name.split(".").pop() : undefined;
  const path = `${coupleId}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
  const { error } = await supabase.storage.from(EVENT_PHOTOS_BUCKET).upload(path, photo);
  return error ? null : path;
}

export type CategoryState = { error: string } | undefined;

export async function addCategory(
  eventId: string,
  _prevState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  const name = String(formData.get("name") ?? "").trim();
  const groupName = parseCategoryGroup(formData.get("group_name"));
  if (!name) {
    return { error: "Ponle un nombre a la categoría." };
  }

  const { supabase, coupleId } = await getCurrentUserAndCouple();
  const { error } = await supabase
    .from("event_categories")
    .insert({ event_id: eventId, couple_id: coupleId, name, group_name: groupName });

  if (error) {
    return { error: "No pudimos crear la categoría." };
  }

  revalidatePath(`/eventos/${eventId}`);
  return undefined;
}

export async function updateCategoryGroup(eventId: string, categoryId: string, formData: FormData) {
  const groupName = parseCategoryGroup(formData.get("group_name"));
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("event_categories").update({ group_name: groupName }).eq("id", categoryId);
  revalidatePath(`/eventos/${eventId}`);
}

export async function updateCategoryPerGuest(
  eventId: string,
  categoryId: string,
  formData: FormData
) {
  const perGuest = formData.get("per_guest") === "on";
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("event_categories").update({ per_guest: perGuest }).eq("id", categoryId);
  revalidatePath(`/eventos/${eventId}`);
}

export async function deleteCategory(eventId: string, categoryId: string) {
  const { supabase } = await getCurrentUserAndCouple();
  const { data: items } = await supabase
    .from("event_items")
    .select("photo_path")
    .eq("category_id", categoryId);
  const photoPaths = (items ?? [])
    .map((i) => i.photo_path as string | null)
    .filter((p): p is string => Boolean(p));

  await supabase.from("event_categories").delete().eq("id", categoryId);

  if (photoPaths.length) {
    await supabase.storage.from(EVENT_PHOTOS_BUCKET).remove(photoPaths);
  }

  revalidatePath(`/eventos/${eventId}`);
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
  const photoPath = await uploadItemPhoto(supabase, coupleId, formData);
  const { error } = await supabase.from("event_items").insert({
    category_id: categoryId,
    couple_id: coupleId,
    name,
    estimated_cost: estimatedCost ? Number(estimatedCost) : null,
    notes: notes || null,
    family: family || null,
    table_number: tableNumber || null,
    ingredients: ingredients || null,
    photo_path: photoPath,
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
  const oldPhotoPath = String(formData.get("old_photo_path") ?? "").trim();

  if (!name) {
    return { error: "Escribe el nombre del ítem." };
  }

  const { supabase, coupleId } = await getCurrentUserAndCouple();
  const newPhotoPath = await uploadItemPhoto(supabase, coupleId, formData);
  if (newPhotoPath && oldPhotoPath) {
    await supabase.storage.from(EVENT_PHOTOS_BUCKET).remove([oldPhotoPath]);
  }

  const { error } = await supabase
    .from("event_items")
    .update({
      name,
      estimated_cost: estimatedCost ? Number(estimatedCost) : null,
      notes: notes || null,
      family: family || null,
      table_number: tableNumber || null,
      ingredients: ingredients || null,
      ...(newPhotoPath ? { photo_path: newPhotoPath } : {}),
    })
    .eq("id", itemId);

  if (error) {
    return { error: "No pudimos actualizar el ítem." };
  }

  revalidatePath(`/eventos/${eventId}`);
  return undefined;
}

export async function deleteItem(eventId: string, itemId: string, photoPath: string | null) {
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("event_items").delete().eq("id", itemId);
  if (photoPath) {
    await supabase.storage.from(EVENT_PHOTOS_BUCKET).remove([photoPath]);
  }
  revalidatePath(`/eventos/${eventId}`);
}

export async function updateItemStatus(eventId: string, itemId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "") as EventItemStatus;
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
