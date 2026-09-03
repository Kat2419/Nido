import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventCategory, EventItem, EventRow } from "@/lib/types";
import { EVENT_CATEGORY_GROUPS, EVENT_PHOTOS_BUCKET } from "@/lib/types";
import { formatCOP, formatDate } from "@/lib/format";
import { AddCategoryForm } from "./add-category-form";
import { CategoryCard } from "./category-card";
import { CategoryGroupSection } from "./category-group-section";
import { DeleteEventButton } from "./delete-event-button";

export default async function EventoDetailPage(props: PageProps<"/eventos/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (!event) {
    notFound();
  }
  const typedEvent = event as EventRow;

  const { data: categories } = await supabase
    .from("event_categories")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  const categoryList = (categories ?? []) as EventCategory[];
  const categoryIds = categoryList.map((c) => c.id);

  const { data: items } = categoryIds.length
    ? await supabase.from("event_items").select("*").in("category_id", categoryIds)
    : { data: [] };

  const rawItemList = (items ?? []) as EventItem[];
  const photoPaths = rawItemList
    .map((i) => i.photo_path)
    .filter((p): p is string => Boolean(p));

  const { data: signedUrls } = photoPaths.length
    ? await supabase.storage.from(EVENT_PHOTOS_BUCKET).createSignedUrls(photoPaths, 3600)
    : { data: [] };
  const urlByPath = new Map((signedUrls ?? []).map((s) => [s.path, s.signedUrl]));

  const itemList = rawItemList.map((i) => ({
    ...i,
    photo_url: i.photo_path ? (urlByPath.get(i.photo_path) ?? null) : null,
  }));
  const totalEstimated = itemList.reduce((sum, i) => sum + (i.estimated_cost ?? 0), 0);
  const totalPagado = itemList
    .filter((i) => i.status === "pagado")
    .reduce((sum, i) => sum + (i.actual_cost ?? i.estimated_cost ?? 0), 0);
  const saldoRestante = totalEstimated - totalPagado;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-terracotta">{typedEvent.title}</h1>
          {typedEvent.event_date && (
            <p className="text-coffee-light">{formatDate(typedEvent.event_date)}</p>
          )}
          {typedEvent.description && <p className="mt-1 text-coffee-light">{typedEvent.description}</p>}
        </div>
        <DeleteEventButton eventId={typedEvent.id} />
      </div>

      <div className="flex gap-4 rounded-2xl bg-white/60 p-4 shadow-sm">
        <div className="flex-1">
          <p className="text-xs text-coffee-light">Presupuesto estimado</p>
          <p className="font-display text-xl text-coffee">{formatCOP(totalEstimated)}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-coffee-light">Ya pagado</p>
          <p className="font-display text-xl text-sage">{formatCOP(totalPagado)}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-coffee-light">Saldo restante</p>
          <p className="font-display text-xl text-terracotta">{formatCOP(saldoRestante)}</p>
        </div>
      </div>

      {EVENT_CATEGORY_GROUPS.map((group) => {
        const groupCategories = categoryList.filter((c) => c.group_name === group);

        return (
          <CategoryGroupSection key={group} group={group}>
            {groupCategories.map((category) => (
              <CategoryCard
                key={category.id}
                eventId={typedEvent.id}
                category={category}
                items={itemList.filter((i) => i.category_id === category.id)}
              />
            ))}
          </CategoryGroupSection>
        );
      })}

      <AddCategoryForm eventId={typedEvent.id} />
    </div>
  );
}
