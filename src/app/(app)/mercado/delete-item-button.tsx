"use client";

import { deleteMarketItem } from "./actions";

export function DeleteItemButton({ id }: { id: string }) {
  return (
    <form action={deleteMarketItem.bind(null, id)}>
      <button
        type="submit"
        aria-label="Eliminar"
        className="text-coffee-light transition hover:text-red-600"
      >
        ✕
      </button>
    </form>
  );
}
