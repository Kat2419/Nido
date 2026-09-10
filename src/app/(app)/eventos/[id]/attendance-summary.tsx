"use client";

import { useState } from "react";
import type { EventItem, RsvpStatus } from "@/lib/types";
import { formatNameList } from "@/lib/format";

const STATUS_ORDER: RsvpStatus[] = ["asiste", "no_asiste", "pendiente"];

const STATUS_META: Record<RsvpStatus, { label: string; style: string }> = {
  asiste: { label: "Confirmados", style: "bg-sage/30 text-sage" },
  no_asiste: { label: "No asisten", style: "bg-coffee-light/20 text-coffee-light" },
  pendiente: { label: "Pendientes", style: "bg-rose-light text-terracotta-dark" },
};

export function AttendanceSummary({ items }: { items: EventItem[] }) {
  const [open, setOpen] = useState(false);

  const groups: Record<RsvpStatus, EventItem[]> = {
    asiste: items.filter((i) => i.rsvp_status === "asiste"),
    no_asiste: items.filter((i) => i.rsvp_status === "no_asiste"),
    pendiente: items.filter((i) => i.rsvp_status === "pendiente"),
  };

  return (
    <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
      >
        <h3 className="font-display text-lg text-coffee">Asistencias</h3>
        <div className="flex gap-2">
          {STATUS_ORDER.map((status) => (
            <span
              key={status}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${STATUS_META[status].style}`}
            >
              {groups[status].length} {STATUS_META[status].label.toLowerCase()}
            </span>
          ))}
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-cream p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="font-display text-2xl text-coffee">Asistencias</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-coffee-light hover:text-terracotta"
              >
                ✕
              </button>
            </div>

            {STATUS_ORDER.map((status) => (
              <div key={status} className="mb-6 last:mb-0">
                <h4 className="mb-2 text-sm font-semibold text-coffee">
                  {STATUS_META[status].label} ({groups[status].length})
                </h4>
                {groups[status].length === 0 ? (
                  <p className="text-sm text-coffee-light">Nadie por ahora.</p>
                ) : (
                  <ul className="divide-y divide-rose-light">
                    {groups[status].map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                        <span className="text-coffee">
                          {formatNameList([item.name, ...(item.additional_guest_names ?? [])])}
                        </span>
                        {item.party_size > 1 && (
                          <span className="shrink-0 text-xs text-coffee-light">
                            {item.party_size} personas
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
