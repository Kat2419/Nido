"use client";

import { useState } from "react";
import type { EventCategory, EventItem } from "@/lib/types";
import { EVENT_CATEGORY_GROUPS, getCategoryKind, itemEstimatedTotal } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { AddItemForm } from "./add-item-form";
import { ItemRow } from "./item-row";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { deleteCategory, updateCategoryGroup, updateCategoryPerGuest } from "./actions";

function CategoryTotal({
  kind,
  items,
  total,
}: {
  kind: "guest" | "food" | "generic";
  items: EventItem[];
  total: number;
}) {
  if (kind === "guest") {
    return items.length > 0 ? (
      <span className="text-sm text-coffee-light">{items.length} invitados</span>
    ) : null;
  }
  return total > 0 ? <span className="text-sm text-coffee-light">{formatCOP(total)}</span> : null;
}

export function CategoryCard({
  eventId,
  category,
  items,
  guestCount,
}: {
  eventId: string;
  category: EventCategory;
  items: EventItem[];
  guestCount: number;
}) {
  const kind = getCategoryKind(category.name);
  const supportsPhoto = kind !== "guest";
  const total = items.reduce((sum, i) => sum + itemEstimatedTotal(i, category, guestCount), 0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleDeleteCategory = async () => {
    setConfirmDelete(false);
    setViewerOpen(false);
    await deleteCategory(eventId, category.id);
  };

  return (
    <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setViewerOpen(true)}
        className="flex w-full min-w-0 items-center justify-between gap-2 text-left"
      >
        <h3 className="truncate font-display text-lg text-coffee hover:text-terracotta">
          {category.name}
        </h3>
        <CategoryTotal kind={kind} items={items} total={total} />
      </button>

      {viewerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewerOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-cream p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="font-display text-2xl text-coffee">{category.name}</h3>
              <div className="flex items-center gap-3">
                <CategoryTotal kind={kind} items={items} total={total} />
                <button
                  type="button"
                  onClick={() => setViewerOpen(false)}
                  aria-label="Cerrar"
                  className="text-coffee-light hover:text-terracotta"
                >
                  ✕
                </button>
              </div>
            </div>

            <form
              action={updateCategoryGroup.bind(null, eventId, category.id)}
              className="mb-4 flex items-center gap-2"
            >
              <label className="text-xs text-coffee-light">Grupo:</label>
              <select
                name="group_name"
                defaultValue={category.group_name}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                className="rounded-full border border-rose-light bg-cream px-3 py-1 text-xs outline-none focus:border-terracotta"
              >
                {EVENT_CATEGORY_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="ml-auto text-xs text-coffee-light underline hover:text-red-600"
              >
                Eliminar categoría
              </button>
            </form>

            {kind !== "guest" && (
              <form
                action={updateCategoryPerGuest.bind(null, eventId, category.id)}
                className="mb-4 flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  id={`per-guest-${category.id}`}
                  name="per_guest"
                  defaultChecked={category.per_guest}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  className="h-4 w-4 accent-terracotta"
                />
                <label htmlFor={`per-guest-${category.id}`} className="text-xs text-coffee-light">
                  Multiplicar por número de invitados ({guestCount})
                </label>
              </form>
            )}

            <div className="divide-y divide-rose-light">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  eventId={eventId}
                  item={item}
                  kind={kind}
                  supportsPhoto={supportsPhoto}
                  perGuest={category.per_guest}
                  guestCount={guestCount}
                  expanded
                />
              ))}
            </div>

            <AddItemForm
              eventId={eventId}
              categoryId={category.id}
              kind={kind}
              supportsPhoto={supportsPhoto}
              perGuest={category.per_guest}
            />
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`¿Eliminar la categoría "${category.name}"? Esto también borra los ${items.length} ítems que tiene adentro.`}
          onConfirm={handleDeleteCategory}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
