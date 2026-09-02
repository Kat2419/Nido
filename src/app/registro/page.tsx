"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { SubmitButton } from "@/components/submit-button";

export default function RegistroPage() {
  const [state, formAction] = useActionState(signup, undefined);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl italic text-terracotta">Nido</h1>
          <p className="mt-2 text-coffee-light">Crea tu cuenta</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-3xl bg-white/60 p-6 shadow-sm">
          <div>
            <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-coffee">
              Tu nombre
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2.5 outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-coffee">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2.5 outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-coffee">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2.5 outline-none focus:border-terracotta"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <SubmitButton className="w-full">Crear cuenta</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-coffee-light">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-terracotta">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
