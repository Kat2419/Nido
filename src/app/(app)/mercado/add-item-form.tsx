"use client";

import { useRef, useState, type FormEvent } from "react";
import { addMarketItem } from "./actions";
import type { Store } from "@/lib/types";

export function AddItemForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [store, setStore] = useState<Store>("D1");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.set("store", store);

    setPending(true);
    const result = await addMarketItem(undefined, formData);
    setPending(false);

    if (result?.error) {
      setError(result.error);
      return;
    }
    setError(null);
    formRef.current.reset();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl bg-white/60 p-4 shadow-sm"
    >
      <div className="flex gap-2">
        {(["D1", "Mercar", "Otro"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStore(s)}
            className={`flex-1 rounded-xl border-2 py-2 text-center text-sm font-semibold transition ${
              store === s
                ? "border-terracotta bg-rose-light text-terracotta-dark"
                : "border-rose-light text-coffee-light"
            }`}
          >
            {s}
          </button>
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-terracotta px-6 py-2.5 font-semibold text-cream shadow-sm transition hover:bg-terracotta-dark disabled:opacity-60"
      >
        {pending ? "Un momento..." : "Agregar al mercado"}
      </button>
    </form>
  );
}
