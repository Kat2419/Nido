"use client";

import { useActionState, useState } from "react";
import { addCategory } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export function AddCategoryForm({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(addCategory.bind(null, eventId), undefined);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-rose-light py-3 text-sm font-medium text-coffee-light transition hover:border-terracotta hover:text-terracotta"
      >
        + Agregar otra categoría
      </button>
    );
  }

  return (
    <form action={formAction} className="flex gap-2 rounded-2xl bg-white/60 p-3 shadow-sm">
      <input
        name="name"
        type="text"
        placeholder="Nombre de la categoría"
        required
        autoFocus
        className="flex-1 rounded-xl border border-rose-light bg-cream px-3 py-2 outline-none focus:border-terracotta"
      />
      <SubmitButton>Agregar</SubmitButton>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
