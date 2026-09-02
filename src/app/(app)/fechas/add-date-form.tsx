"use client";

import { useActionState } from "react";
import { addImportantDate } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export function AddDateForm() {
  const [state, formAction] = useActionState(addImportantDate, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl bg-white/60 p-4 shadow-sm">
      <input
        name="title"
        type="text"
        placeholder="Título (ej. Aniversario, cumpleaños...)"
        required
        className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
      />
      <input
        name="date"
        type="date"
        required
        className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
      />
      <label className="flex items-center gap-2 text-sm text-coffee">
        <input name="is_recurring" type="checkbox" className="h-4 w-4 accent-terracotta" />
        Se repite cada año
      </label>
      <textarea
        name="notes"
        placeholder="Notas (opcional)"
        rows={2}
        className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton className="w-full">Agregar fecha</SubmitButton>
    </form>
  );
}
