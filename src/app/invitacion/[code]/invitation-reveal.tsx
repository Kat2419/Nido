"use client";

import { useState } from "react";

export function InvitationReveal({
  eventTitle,
  guestName,
  partySize,
  children,
}: {
  eventTitle: string;
  guestName: string;
  partySize: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url(/petals/madera.jpg)" }}
        />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <p className="text-xs uppercase tracking-[0.35em] text-ivory/90">Invitación reservada</p>

        <div className="relative w-full max-w-[520px]">
          <img
            src="/petals/sobre.jpg"
            alt="Sobre de la invitación"
            className="w-full rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir invitación"
            className="absolute left-[46%] top-[62%] aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
          />
        </div>

        <div>
          <h1 className="font-display text-2xl italic text-ivory">{eventTitle}</h1>
          <p className="mt-1 text-ivory/80">{guestName}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-ivory/60">
            {partySize} {partySize === 1 ? "persona" : "personas"}
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-gold">Toca el sello para abrir</p>
      </div>
    );
  }

  return <div className="animate-[invite-fade-in_0.6s_ease-out]">{children}</div>;
}
