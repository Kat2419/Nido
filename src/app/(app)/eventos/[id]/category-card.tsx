"use client";

import { useState } from "react";
import type { EventCategory, EventItem } from "@/lib/types";
import { getCategoryKind } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { AddItemForm } from "./add-item-form";
import { ItemRow } from "./item-row";

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
  const total = items.reduce((sum, i) => sum + (i.estimated_cost ?? 0), 0);
  const [open, setOpen] = useState(kind !== "guest");

  return (
    <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mb-2 flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-coffee-light">{open ? "▾" : "▸"}</span>
          <h3 className="font-display text-lg text-coffee">{category.name}</h3>
        </span>
        {kind === "guest"
          ? items.length > 0 && (
              <span className="text-sm text-coffee-light">{items.length} invitados</span>
            )
          : kind === "generic" &&
            total > 0 && <span className="text-sm text-coffee-light">{formatCOP(total)}</span>}
      </button>

      {open && (
        <>
          <div className="divide-y divide-rose-light">
            {items.map((item) => (
              <ItemRow key={item.id} eventId={eventId} item={item} kind={kind} />
            ))}
          </div>

          <AddItemForm eventId={eventId} categoryId={category.id} kind={kind} />
        </>
      )}
    </div>
  );
}
