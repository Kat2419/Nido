"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { EventRow } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { SubmitButton } from "@/components/submit-button";
import { updateEventVenue } from "../actions";

export function EventVenueForm({ event }: { event: EventRow }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateEventVenue.bind(null, event.id),
    undefined
  );
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (wasPendingRef.current && !isPending && !state?.error) {
      setEditing(false);
    }
    wasPendingRef.current = isPending;
  }, [isPending, state]);

  const hasVenueInfo =
    event.event_date ||
    event.couple_names ||
    event.venue_name ||
    event.venue_address ||
    event.event_time ||
    event.dress_code;

  if (!editing) {
    return (
      <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
        {hasVenueInfo ? (
          <div className="space-y-1 text-sm text-coffee-light">
            {event.event_date && <p className="text-coffee">{formatDate(event.event_date)}</p>}
            {event.couple_names && <p className="text-coffee">{event.couple_names}</p>}
            {event.venue_name && <p className="text-coffee">{event.venue_name}</p>}
            {event.venue_address && <p>{event.venue_address}</p>}
            {event.event_time && <p>{event.event_time}</p>}
            {event.dress_code && <p>Vestimenta: {event.dress_code}</p>}
            {event.color_reservation_note && <p>Reserva de color: {event.color_reservation_note}</p>}
            {event.gift_note && <p>Regalos: {event.gift_note}</p>}
          </div>
        ) : (
          <p className="text-sm text-coffee-light">
            Todavía no agregas la fecha ni la sede — se usan en la invitación digital de cada
            invitado.
          </p>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 text-xs text-terracotta underline"
        >
          {hasVenueInfo ? "Editar fecha y sede" : "Agregar fecha y sede"}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-2 rounded-2xl bg-white/60 p-4 shadow-sm">
      <input
        name="event_date"
        type="date"
        defaultValue={event.event_date ?? ""}
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <input
        name="couple_names"
        type="text"
        defaultValue={event.couple_names ?? ""}
        placeholder="Nombres de la pareja (ej. David y Viviana)"
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <input
        name="venue_name"
        type="text"
        defaultValue={event.venue_name ?? ""}
        placeholder="Nombre del lugar"
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <input
        name="venue_address"
        type="text"
        defaultValue={event.venue_address ?? ""}
        placeholder="Dirección"
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <input
        name="event_time"
        type="text"
        defaultValue={event.event_time ?? ""}
        placeholder="Hora (ej. 2:30 PM)"
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <input
        name="dress_code"
        type="text"
        defaultValue={event.dress_code ?? ""}
        placeholder="Código de vestimenta (ej. Formal, Libre)"
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <textarea
        name="color_reservation_note"
        defaultValue={event.color_reservation_note ?? ""}
        placeholder="Reserva de color (opcional, ej. 'El color blanco está reservado para la novia')"
        rows={2}
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      <textarea
        name="gift_note"
        defaultValue={event.gift_note ?? ""}
        placeholder="Nota de regalos / lluvia de sobres (opcional)"
        rows={2}
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
