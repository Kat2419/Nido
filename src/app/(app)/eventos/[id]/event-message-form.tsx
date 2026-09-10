"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { EventRow } from "@/lib/types";
import { SubmitButton } from "@/components/submit-button";
import { updateEventMessage } from "../actions";

export function EventMessageForm({ event }: { event: EventRow }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateEventMessage.bind(null, event.id),
    undefined
  );
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (wasPendingRef.current && !isPending && !state?.error) {
      setEditing(false);
    }
    wasPendingRef.current = isPending;
  }, [isPending, state]);

  const hasMessage = event.welcome_message || event.welcome_message_highlight;

  if (!editing) {
    return (
      <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
        {hasMessage ? (
          <div className="space-y-1 text-sm text-coffee-light">
            {event.welcome_message && <p className="whitespace-pre-line">{event.welcome_message}</p>}
            {event.welcome_message_highlight && (
              <p className="italic text-coffee">{event.welcome_message_highlight}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-coffee-light">
            Todavía no agregas un mensaje — aparece como su propia sección en la invitación digital.
          </p>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 text-xs text-terracotta underline"
        >
          {hasMessage ? "Editar mensaje" : "Agregar mensaje"}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-2 rounded-2xl bg-white/60 p-4 shadow-sm">
      <textarea
        name="welcome_message"
        defaultValue={event.welcome_message ?? ""}
        placeholder="Mensaje para tus invitados (ej. 'El amor no consiste en...')"
        rows={4}
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <input
        name="welcome_message_highlight"
        type="text"
        defaultValue={event.welcome_message_highlight ?? ""}
        placeholder="Frase final destacada (ej. 'Acompáñanos a celebrar nuestro matrimonio.')"
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-2">
        <SubmitButton className="flex-1">Guardar</SubmitButton>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-full border border-rose-light px-4 text-sm text-coffee-light"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
