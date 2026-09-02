"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CreateCoupleState = { code: string } | { error: string } | undefined;

export async function createCoupleAction(): Promise<CreateCoupleState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_couple").single<{
    id: string;
    invite_code: string;
  }>();

  if (error || !data) {
    return { error: "No pudimos crear tu pareja, intenta de nuevo." };
  }

  return { code: data.invite_code };
}

export type JoinCoupleState = { error: string } | undefined;

export async function joinCoupleAction(
  _prevState: JoinCoupleState,
  formData: FormData
): Promise<JoinCoupleState> {
  const code = String(formData.get("code") ?? "").trim();

  if (!code) {
    return { error: "Ingresa el código que te compartió tu pareja." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_couple", { code });

  if (error || !data) {
    return { error: "Ese código no es válido. Revísalo con tu pareja." };
  }

  redirect("/");
}
