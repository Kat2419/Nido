import { createClient } from "@/lib/supabase/server";
import type { MarketItem } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { AddItemForm } from "./add-item-form";
import { DeleteItemButton } from "./delete-item-button";

export default async function MercadoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("market_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as MarketItem[];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const groups = new Map<string, MarketItem[]>();
  for (const item of items) {
    const key = item.store === "Otro" ? item.store_other || "Otro" : item.store;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl italic text-terracotta">Mercado</h1>
        <p className="text-coffee-light">Total registrado: {formatCOP(total)}</p>
      </div>

      <AddItemForm />

      {groups.size === 0 ? (
        <p className="text-center text-coffee-light">Todavía no han registrado compras.</p>
      ) : (
        Array.from(groups.entries()).map(([store, storeItems]) => {
          const storeTotal = storeItems.reduce((s, i) => s + i.price * i.quantity, 0);
          return (
            <section key={store}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-display text-xl text-coffee">{store}</h2>
                <span className="text-sm text-coffee-light">{formatCOP(storeTotal)}</span>
              </div>
              <div className="divide-y divide-rose-light rounded-2xl bg-white/60 px-4 shadow-sm">
                {storeItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-coffee">
                        {item.product_name}
                        {item.quantity !== 1 && (
                          <span className="text-coffee-light"> × {item.quantity}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-coffee">{formatCOP(item.price * item.quantity)}</span>
                      <DeleteItemButton id={item.id} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
