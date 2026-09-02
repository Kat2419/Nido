import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { CreateEventForm } from "./create-event-form";

export default async function EventosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true, nullsFirst: false });

  const events = (data ?? []) as EventRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl italic text-terracotta">Eventos</h1>
        <p className="text-coffee-light">Todo lo que están planeando juntos.</p>
      </div>

      <CreateEventForm />

      {events.length === 0 ? (
        <p className="text-center text-coffee-light">Aún no han creado ningún evento.</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/eventos/${event.id}`}
              className="block rounded-2xl bg-white/60 px-4 py-4 shadow-sm transition hover:bg-white/80"
            >
              <p className="font-medium text-coffee">{event.title}</p>
              {event.event_date && (
                <p className="text-sm text-coffee-light">{formatDate(event.event_date)}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
