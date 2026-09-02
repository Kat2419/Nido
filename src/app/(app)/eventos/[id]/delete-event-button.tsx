"use client";

import { deleteEventAndRedirect } from "./actions";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  return (
    <form
      action={deleteEventAndRedirect.bind(null, eventId)}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar este evento y todo su contenido?")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm text-coffee-light underline hover:text-red-600">
        Eliminar
      </button>
    </form>
  );
}
