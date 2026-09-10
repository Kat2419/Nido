"use client";

import { useState, useTransition } from "react";
import type { RsvpStatus } from "@/lib/types";
import { submitRsvp } from "./actions";

const CONFIRMED_MESSAGES: Record<"asiste" | "no_asiste", string> = {
  asiste: "¡Gracias por confirmar! Nos vemos ahí.",
  no_asiste: "Gracias por avisarnos, te vamos a extrañar.",
};

export function RsvpButtons({ code, initialStatus }: { code: string; initialStatus: RsvpStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const respond = (next: "asiste" | "no_asiste") => {
    startTransition(async () => {
      await submitRsvp(code, next);
      setStatus(next);
    });
  };

  if (status !== "pendiente") {
    return (
      <div className="rounded-full border border-gold/40 bg-white/10 px-6 py-4 text-center backdrop-blur-sm sm:px-8 sm:py-5">
        <p className="text-ivory sm:text-lg">{CONFIRMED_MESSAGES[status]}</p>
        <button
          type="button"
          onClick={() => setStatus("pendiente")}
          className="mt-2 text-xs text-ivory/60 underline"
        >
          Cambiar mi respuesta
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        type="button"
        disabled={isPending}
        onClick={() => respond("asiste")}
        className="rounded-full bg-gold px-8 py-3 text-center text-xs font-semibold tracking-[0.15em] text-olive-dark uppercase shadow-sm transition hover:bg-gold-deep hover:text-ivory disabled:opacity-60 sm:px-10 sm:py-4 sm:text-sm"
      >
        Asistiré
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => respond("no_asiste")}
        className="rounded-full border border-gold/50 px-8 py-3 text-center text-xs font-semibold tracking-[0.15em] text-ivory uppercase transition hover:bg-white/10 disabled:opacity-60 sm:px-10 sm:py-4 sm:text-sm"
      >
        No podré ir
      </button>
    </div>
  );
}
