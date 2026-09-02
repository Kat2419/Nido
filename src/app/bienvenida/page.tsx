"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createCoupleAction, joinCoupleAction } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export default function BienvenidaPage() {
  const [mode, setMode] = useState<"elegir" | "crear" | "unirse">("elegir");
  const [createState, createAction] = useActionState(createCoupleAction, undefined);
  const [joinState, joinFormAction] = useActionState(joinCoupleAction, undefined);
  const [copied, setCopied] = useState(false);

  const code = createState && "code" in createState ? createState.code : null;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-4xl italic text-terracotta">Bienvenidos a Nido</h1>
        <p className="mt-2 text-coffee-light">
          Antes de empezar, conecta tu cuenta con la de tu pareja.
        </p>

        {mode === "elegir" && (
          <div className="mt-8 space-y-3">
            <button
              onClick={() => setMode("crear")}
              className="w-full rounded-full bg-terracotta px-6 py-3 font-semibold text-cream shadow-sm transition hover:bg-terracotta-dark"
            >
              Somos los primeros: crear nuestro Nido
            </button>
            <button
              onClick={() => setMode("unirse")}
              className="w-full rounded-full border-2 border-terracotta px-6 py-3 font-semibold text-terracotta transition hover:bg-rose-light"
            >
              Mi pareja ya creó el Nido: unirme
            </button>
          </div>
        )}

        {mode === "crear" && !code && (
          <div className="mt-8 rounded-3xl bg-white/60 p-6 shadow-sm">
            <p className="text-sm text-coffee-light">
              Vamos a generar un código único para que tu pareja se una a tu Nido.
            </p>
            <form action={createAction} className="mt-4">
              <SubmitButton className="w-full">Generar nuestro código</SubmitButton>
            </form>
            {createState && "error" in createState && (
              <p className="mt-3 text-sm text-red-600">{createState.error}</p>
            )}
            <button onClick={() => setMode("elegir")} className="mt-4 text-sm text-coffee-light underline">
              Volver
            </button>
          </div>
        )}

        {code && (
          <div className="mt-8 rounded-3xl bg-white/60 p-6 shadow-sm">
            <p className="text-sm text-coffee-light">Comparte este código con tu pareja:</p>
            <p className="my-4 rounded-2xl bg-cream-2 py-4 font-display text-4xl tracking-[0.3em] text-terracotta">
              {code}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
              }}
              className="text-sm font-semibold text-terracotta underline"
            >
              {copied ? "¡Copiado!" : "Copiar código"}
            </button>
            <Link
              href="/"
              className="mt-6 block w-full rounded-full bg-terracotta px-6 py-2.5 font-semibold text-cream shadow-sm transition hover:bg-terracotta-dark"
            >
              Ir a nuestro Nido
            </Link>
          </div>
        )}

        {mode === "unirse" && (
          <div className="mt-8 rounded-3xl bg-white/60 p-6 shadow-sm">
            <form action={joinFormAction} className="space-y-4">
              <div>
                <label htmlFor="code" className="mb-1 block text-sm font-medium text-coffee">
                  Código de invitación
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2.5 text-center uppercase tracking-[0.3em] outline-none focus:border-terracotta"
                />
              </div>
              {joinState?.error && <p className="text-sm text-red-600">{joinState.error}</p>}
              <SubmitButton className="w-full">Unirme</SubmitButton>
            </form>
            <button onClick={() => setMode("elegir")} className="mt-4 text-sm text-coffee-light underline">
              Volver
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
