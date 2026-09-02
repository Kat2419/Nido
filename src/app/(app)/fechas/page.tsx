import { createClient } from "@/lib/supabase/server";
import type { ImportantDate } from "@/lib/types";
import { formatDate, nextOccurrence, daysUntil } from "@/lib/format";
import { AddDateForm } from "./add-date-form";
import { deleteImportantDate } from "./actions";

export default async function FechasPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("important_dates").select("*");

  const dates = ((data ?? []) as ImportantDate[])
    .map((d) => ({ ...d, next: nextOccurrence(d.date, d.is_recurring) }))
    .sort((a, b) => a.next.getTime() - b.next.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl italic text-terracotta">Fechas importantes</h1>
        <p className="text-coffee-light">Lo que no se les puede olvidar.</p>
      </div>

      <AddDateForm />

      {dates.length === 0 ? (
        <p className="text-center text-coffee-light">Aún no han agregado fechas.</p>
      ) : (
        <div className="space-y-2">
          {dates.map((d) => {
            const days = daysUntil(d.next);
            return (
              <div key={d.id} className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-coffee">
                      {d.title}
                      {d.is_recurring && <span className="ml-2 text-xs text-coffee-light">🔁 anual</span>}
                    </p>
                    <p className="text-sm text-coffee-light">{formatDate(d.date)}</p>
                    {d.notes && <p className="mt-1 text-sm text-coffee-light">{d.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap rounded-full bg-rose-light px-3 py-1 text-xs font-semibold text-terracotta-dark">
                      {days === 0 ? "¡Hoy!" : days > 0 ? `en ${days} días` : "pasó"}
                    </span>
                    <form action={deleteImportantDate.bind(null, d.id)}>
                      <button type="submit" aria-label="Eliminar" className="text-coffee-light hover:text-red-600">
                        ✕
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
