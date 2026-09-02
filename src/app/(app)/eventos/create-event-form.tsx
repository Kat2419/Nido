"use client";

import { useActionState } from "react";
import { createEvent } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export function CreateEventForm() {
  const [state, formAction] = useActionState(createEvent, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl bg-white/60 p-4 shadow-sm">
      <input
        name="title"
        type="text"
        placeholder="Nombre del evento (ej. Nuestra boda)"
        required
        className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
      />
      <input
        name="event_date"
        type="date"
        className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
      />
      <textarea
        name="description"
        placeholder="Descripción (opcional)"
        rows={2}
        className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton className="w-full">Crear evento</SubmitButton>
    </form>
  );
}
