"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserAndCouple } from "@/lib/supabase/helpers";

export type DateState = { error: string } | undefined;

export async function addImportantDate(
  _prevState: DateState,
  formData: FormData
): Promise<DateState> {
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const isRecurring = formData.get("is_recurring") === "on";
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title || !date) {
    return { error: "Escribe un título y una fecha." };
  }

  const { supabase, coupleId } = await getCurrentUserAndCouple();

  const { error } = await supabase.from("important_dates").insert({
    couple_id: coupleId,
    title,
    date,
    is_recurring: isRecurring,
    notes: notes || null,
  });

  if (error) {
    return { error: "No pudimos guardar la fecha." };
  }

  revalidatePath("/fechas");
  return undefined;
}

export async function deleteImportantDate(id: string) {
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("important_dates").delete().eq("id", id);
  revalidatePath("/fechas");
}
