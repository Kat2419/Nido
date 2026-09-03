"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { CategoryKind, EventItem, EventItemStatus } from "@/lib/types";
import { isImagePath } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { SubmitButton } from "@/components/submit-button";
import { deleteItem, updateItem, updateItemStatus } from "./actions";

const STATUS_STYLES: Record<EventItemStatus, string> = {
  pendiente: "bg-rose-light text-terracotta-dark",
  confirmado: "bg-gold/30 text-coffee",
  pagado: "bg-sage/30 text-sage",
};

function AttachmentThumb({ item }: { item: EventItem }) {
  if (!item.photo_url) return null;

  if (isImagePath(item.photo_path)) {
    return (
      <a href={item.photo_url} target="_blank" rel="noreferrer" className="shrink-0">
        <img src={item.photo_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
      </a>
    );
  }

  return (
    <a
      href={item.photo_url}
      target="_blank"
      rel="noreferrer"
      aria-label="Ver archivo adjunto"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-light text-lg"
    >
      📄
    </a>
  );
}

export function ItemRow({
  eventId,
  item,
  kind,
  supportsPhoto,
  expanded = false,
}: {
  eventId: string;
  item: EventItem;
  kind: CategoryKind;
  supportsPhoto: boolean;
  expanded?: boolean;
}) {
  const clip = expanded ? "" : "truncate";
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateItem.bind(null, eventId, item.id),
    undefined
  );
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (wasPendingRef.current && !isPending && !state?.error) {
      setEditing(false);
    }
    wasPendingRef.current = isPending;
  }, [isPending, state]);

  if (editing) {
    return (
      <form action={formAction} className="space-y-2 py-2">
        <input
          name="name"
          type="text"
          defaultValue={item.name}
          required
          autoFocus
          className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
        {kind === "guest" && (
          <div className="flex gap-2">
            <input
              name="family"
              type="text"
              defaultValue={item.family ?? ""}
              placeholder="Familia"
              className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
            />
            <input
              name="table_number"
              type="text"
              defaultValue={item.table_number ?? ""}
              placeholder="Mesa"
              className="w-24 rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
            />
          </div>
        )}
        {kind === "food" && (
          <textarea
            name="ingredients"
            defaultValue={item.ingredients ?? ""}
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
            defaultValue={item.estimated_cost ?? ""}
            placeholder="Costo estimado (COP)"
            className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
          />
        )}
        {kind === "generic" && (
          <input
            name="notes"
            type="text"
            defaultValue={item.notes ?? ""}
            placeholder="Notas (opcional)"
            className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
          />
        )}
        {supportsPhoto && (
          <>
            {item.photo_url && (
              <div className="flex items-center gap-2">
                <AttachmentThumb item={item} />
                <span className="text-xs text-coffee-light">Archivo actual (clic para verlo)</span>
              </div>
            )}
            <input type="hidden" name="old_photo_path" value={item.photo_path ?? ""} />
            <input
              name="photo"
              type="file"
              accept="image/*,application/pdf"
              className="w-full rounded-xl border border-rose-light bg-cream px-3 py-2 text-sm outline-none focus:border-terracotta"
            />
          </>
        )}
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

  if (kind === "guest") {
    return (
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="min-w-0 flex-1">
          <p className={`${clip} text-coffee`}>{item.name}</p>
          {item.family && <p className={`${clip} text-xs text-coffee-light`}>{item.family}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {item.table_number && (
            <span className="whitespace-nowrap rounded-full bg-rose-light px-3 py-1 text-xs font-semibold text-terracotta-dark">
              Mesa {item.table_number}
            </span>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar invitado"
            className="text-coffee-light hover:text-terracotta"
          >
            ✎
          </button>
          <form
            action={deleteItem.bind(null, eventId, item.id, item.photo_path)}
            onSubmit={(e) => {
              if (!confirm("¿Estás seguro de que quieres borrar este invitado?")) {
                e.preventDefault();
              }
            }}
          >
            <button type="submit" aria-label="Eliminar invitado" className="text-coffee-light hover:text-red-600">
              ✕
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (kind === "food") {
    return (
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <AttachmentThumb item={item} />
          <div className="min-w-0 flex-1">
            <p className={`${clip} text-coffee`}>{item.name}</p>
            {item.ingredients && (
              <p className={`${clip} text-xs text-coffee-light`}>{item.ingredients}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {item.estimated_cost != null && (
            <span className="text-sm text-coffee-light">{formatCOP(item.estimated_cost)}</span>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar platillo"
            className="text-coffee-light hover:text-terracotta"
          >
            ✎
          </button>
          <form
            action={deleteItem.bind(null, eventId, item.id, item.photo_path)}
            onSubmit={(e) => {
              if (!confirm("¿Estás seguro de que quieres borrar este platillo?")) {
                e.preventDefault();
              }
            }}
          >
            <button type="submit" aria-label="Eliminar platillo" className="text-coffee-light hover:text-red-600">
              ✕
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <AttachmentThumb item={item} />
        <div className="min-w-0 flex-1">
          <p className={`${clip} text-coffee`}>{item.name}</p>
          {item.notes && <p className={`${clip} text-xs text-coffee-light`}>{item.notes}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {item.estimated_cost != null && (
          <span className="text-sm text-coffee-light">{formatCOP(item.estimated_cost)}</span>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Editar ítem"
          className="text-coffee-light hover:text-terracotta"
        >
          ✎
        </button>
        <form action={updateItemStatus.bind(null, eventId, item.id)}>
          <select
            name="status"
            defaultValue={item.status}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            aria-label="Estado del ítem"
            className={`cursor-pointer whitespace-nowrap rounded-full border-none px-3 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[item.status]}`}
          >
            <option value="pendiente">pendiente</option>
            <option value="confirmado">confirmado</option>
            <option value="pagado">pagado</option>
          </select>
        </form>
        <form
          action={deleteItem.bind(null, eventId, item.id, item.photo_path)}
          onSubmit={(e) => {
            if (!confirm("¿Estás seguro de que quieres borrar este ítem?")) {
              e.preventDefault();
            }
          }}
        >
          <button type="submit" aria-label="Eliminar ítem" className="text-coffee-light hover:text-red-600">
            ✕
          </button>
        </form>
      </div>
    </div>
  );
}
