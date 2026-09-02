"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserAndCouple } from "@/lib/supabase/helpers";
import type { Store } from "@/lib/types";

export type MarketItemState = { error: string } | undefined;

export async function addMarketItem(
  _prevState: MarketItemState,
  formData: FormData
): Promise<MarketItemState> {
  const store = String(formData.get("store") ?? "") as Store;
  const storeOther = String(formData.get("store_other") ?? "").trim();
  const productName = String(formData.get("product_name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!productName) {
    return { error: "Escribe el nombre del producto." };
  }
  if (!["D1", "Mercar", "Otro"].includes(store)) {
    return { error: "Selecciona una tienda." };
  }

  const { supabase, user, coupleId } = await getCurrentUserAndCouple();

  const { error } = await supabase.from("market_items").insert({
    couple_id: coupleId,
    store,
    store_other: store === "Otro" ? storeOther || null : null,
    product_name: productName,
    price: Number.isFinite(price) ? price : 0,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    created_by: user.id,
  });

  if (error) {
    return { error: "No pudimos guardar el producto." };
  }

  revalidatePath("/mercado");
  return undefined;
}

export async function deleteMarketItem(id: string) {
  const { supabase } = await getCurrentUserAndCouple();
  await supabase.from("market_items").delete().eq("id", id);
  revalidatePath("/mercado");
}
