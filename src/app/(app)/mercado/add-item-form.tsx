"use client";

import { useActionState, useState } from "react";
import { addMarketItem } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export function AddItemForm() {
  const [state, formAction] = useActionState(addMarketItem, undefined);
  const [store, setStore] = useState("D1");

  return (
    <form action={formAction} className="space-y-3 rounded-2xl bg-white/60 p-4 shadow-sm">
      <div className="flex gap-2">
        {(["D1", "Mercar", "Otro"] as const).map((s) => (
          <label
            key={s}
            className={`flex-1 cursor-pointer rounded-xl border-2 py-2 text-center text-sm font-semibold transition ${
              store === s ? "border-terracotta bg-rose-light text-terracotta-dark" : "border-rose-light text-coffee-light"
            }`}
          >
            <input
              type="radio"
              name="store"
              value={s}
              checked={store === s}
              onChange={() => setStore(s)}
              className="sr-only"
            />
            {s}
          </label>
        ))}
      </div>

      {store === "Otro" && (
        <input
          name="store_other"
          type="text"
          placeholder="¿Qué tienda?"
          className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
        />
      )}

      <input
        name="product_name"
        type="text"
        placeholder="Producto (ej. leche, arroz...)"
        required
        className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
      />

      <div className="flex gap-2">
        <input
          name="price"
          type="number"
          min="0"
          step="1"
          placeholder="Precio COP"
          required
          className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
        />
        <input
          name="quantity"
          type="number"
          min="1"
          step="1"
          defaultValue={1}
          placeholder="Cant."
          className="w-24 rounded-xl border border-rose-light bg-cream px-4 py-2 outline-none focus:border-terracotta"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton className="w-full">Agregar al mercado</SubmitButton>
    </form>
  );
}
