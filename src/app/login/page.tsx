"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { SubmitButton } from "@/components/submit-button";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl italic text-terracotta">Nido</h1>
          <p className="mt-2 text-coffee-light">Bienvenidos de nuevo</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-3xl bg-white/60 p-6 shadow-sm">
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
              className="w-full rounded-xl border border-rose-light bg-cream px-4 py-2.5 outline-none focus:border-terracotta"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <SubmitButton className="w-full">Entrar</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-coffee-light">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-terracotta">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
