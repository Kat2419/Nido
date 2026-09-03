"use client";

import { useState } from "react";
import type { EventCategory, EventItem } from "@/lib/types";
import { EVENT_CATEGORY_GROUPS, getCategoryKind } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { AddItemForm } from "./add-item-form";
import { ItemRow } from "./item-row";
import { updateCategoryGroup } from "./actions";

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
}: {
  eventId: string;
  category: EventCategory;
  items: EventItem[];
}) {
  const kind = getCategoryKind(category.name);
  const supportsPhoto = kind !== "guest";
  const total = items.reduce((sum, i) => sum + (i.estimated_cost ?? 0), 0);
  const [open, setOpen] = useState(kind !== "guest");
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Colapsar" : "Expandir"}
          className="shrink-0 text-coffee-light"
        >
          {open ? "▾" : "▸"}
        </button>
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
        >
          <h3 className="truncate font-display text-lg text-coffee hover:text-terracotta">
            {category.name}
          </h3>
          <CategoryTotal kind={kind} items={items} total={total} />
        </button>
      </div>

      {open && (
        <>
          <div
            className={`divide-y divide-rose-light ${kind === "guest" ? "max-h-72 overflow-y-auto" : ""}`}
          >
            {items.map((item) => (
              <ItemRow
                key={item.id}
                eventId={eventId}
                item={item}
                kind={kind}
                supportsPhoto={supportsPhoto}
              />
            ))}
          </div>

          <AddItemForm
            eventId={eventId}
            categoryId={category.id}
            kind={kind}
            supportsPhoto={supportsPhoto}
          />
        </>
      )}

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
            </form>

            <div className="divide-y divide-rose-light">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  eventId={eventId}
                  item={item}
                  kind={kind}
                  supportsPhoto={supportsPhoto}
                  expanded
                />
              ))}
            </div>

            <AddItemForm
              eventId={eventId}
              categoryId={category.id}
              kind={kind}
              supportsPhoto={supportsPhoto}
            />
          </div>
        </div>
      )}
    </div>
  );
}
