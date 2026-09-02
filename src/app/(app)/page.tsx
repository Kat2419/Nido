import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ImportantDate, EventRow, MarketItem } from "@/lib/types";
import { formatCOP, formatDate, nextOccurrence, daysUntil } from "@/lib/format";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: dates }, { data: events }, { data: items }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
    supabase.from("important_dates").select("*").order("date", { ascending: true }),
    supabase
      .from("events")
      .select("*")
      .not("event_date", "is", null)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(1),
    supabase.from("market_items").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const upcomingDates = ((dates ?? []) as ImportantDate[])
    .map((d) => ({ ...d, next: nextOccurrence(d.date, d.is_recurring) }))
    .sort((a, b) => a.next.getTime() - b.next.getTime())
    .slice(0, 3);

  const nextEvent = (events?.[0] as EventRow | undefined) ?? null;
  const recentItems = (items ?? []) as MarketItem[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl italic text-terracotta">
          Hola, {profile?.full_name ?? "amor"} 👋
        </h1>
        <p className="text-coffee-light">Esto es lo que tenemos por delante.</p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl text-coffee">Próximas fechas</h2>
        {upcomingDates.length === 0 ? (
          <EmptyCard href="/fechas" text="Agrega su primera fecha importante" />
        ) : (
          <div className="space-y-2">
            {upcomingDates.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 shadow-sm">
                <div>
                  <p className="font-medium text-coffee">{d.title}</p>
                  <p className="text-sm text-coffee-light">{formatDate(d.date)}</p>
                </div>
                <span className="rounded-full bg-rose-light px-3 py-1 text-xs font-semibold text-terracotta-dark">
                  {daysUntil(d.next) === 0 ? "¡Hoy!" : `en ${daysUntil(d.next)} días`}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-coffee">Próximo evento</h2>
        {nextEvent ? (
          <Link
            href={`/eventos/${nextEvent.id}`}
            className="block rounded-2xl bg-white/60 px-4 py-4 shadow-sm transition hover:bg-white/80"
          >
            <p className="font-medium text-coffee">{nextEvent.title}</p>
            {nextEvent.event_date && (
              <p className="text-sm text-coffee-light">{formatDate(nextEvent.event_date)}</p>
            )}
          </Link>
        ) : (
          <EmptyCard href="/eventos" text="Planea tu primer evento juntos" />
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-coffee">Últimas compras</h2>
        {recentItems.length === 0 ? (
          <EmptyCard href="/mercado" text="Registra tu primera compra de mercado" />
        ) : (
          <div className="divide-y divide-rose-light rounded-2xl bg-white/60 px-4 shadow-sm">
            {recentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-coffee">{item.product_name}</p>
                  <p className="text-xs text-coffee-light">
                    {item.store === "Otro" ? item.store_other : item.store}
                  </p>
                </div>
                <span className="font-medium text-coffee">{formatCOP(item.price)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyCard({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border-2 border-dashed border-rose-light px-4 py-6 text-center text-coffee-light transition hover:border-terracotta hover:text-terracotta"
    >
      {text}
    </Link>
  );
}
