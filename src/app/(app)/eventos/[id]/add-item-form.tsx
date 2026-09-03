"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addItem } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import type { CategoryKind } from "@/lib/types";

export function AddItemForm({
  eventId,
  categoryId,
  kind,
  supportsPhoto,
  perGuest = false,
}: {
  eventId: string;
  categoryId: string;
  kind: CategoryKind;
  supportsPhoto: boolean;
  perGuest?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    addItem.bind(null, eventId, categoryId),
    undefined
  );
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (wasPendingRef.current && !isPending && !state?.error) {
      setOpen(false);
    }
    wasPendingRef.current = isPending;
  }, [isPending, state]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2 text-left text-sm font-medium text-terracotta"
      >
        + Agregar {kind === "guest" ? "invitado" : kind === "food" ? "platillo" : "ítem"}
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-2 py-2">
      <input
        name="name"
        type="text"
        placeholder={
          kind === "guest"
            ? "Nombre del invitado"
            : kind === "food"
              ? "Platillo (ej. Bandeja paisa)"
              : "Nombre (ej. Mesas redondas x10)"
        }
        required
        autoFocus
        className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
      />
      {kind === "guest" && (
        <div className="flex gap-2">
          <input
            name="family"
            type="text"
            placeholder="Familia"
            className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
          />
          <input
            name="table_number"
            type="text"
            placeholder="Mesa"
            className="w-24 rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
          />
        </div>
      )}
      {kind === "food" && (
        <textarea
          name="ingredients"
          placeholder="Ingredientes"
          rows={2}
          className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      )}
      {(kind === "food" || kind === "generic") && (
        <input
          name="estimated_cost"
          type="number"
          min="0"
          step="1"
          placeholder={perGuest ? "Precio por invitado (COP)" : "Costo estimado (COP)"}
          className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      )}
      {kind === "generic" && (
        <input
          name="notes"
          type="text"
          placeholder="Notas (opcional)"
          className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      )}
      {supportsPhoto && (
        <input
          name="photo"
          type="file"
          accept="image/*,application/pdf"
          className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      )}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-2">
        <SubmitButton className="flex-1">Guardar</SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-rose-light px-4 text-sm text-coffee-light"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
