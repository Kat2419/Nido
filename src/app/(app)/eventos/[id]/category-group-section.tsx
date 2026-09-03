"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AddCategoryForm } from "./add-category-form";

export function CategoryGroupSection({
  eventId,
  group,
  children,
}: {
  eventId: string;
  group: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 text-left"
      >
        <span className="text-coffee-light">{open ? "▾" : "▸"}</span>
        <h2 className="font-display text-xl text-coffee">{group}</h2>
      </button>

      {open && (
        <>
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {children}
          </div>
          <AddCategoryForm eventId={eventId} defaultGroup={group} />
        </>
      )}
    </div>
  );
}
