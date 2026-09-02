import Link from "next/link";

export default function RevisaTuCorreoPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-3xl italic text-terracotta">Revisa tu correo</h1>
        <p className="mt-4 text-coffee-light">
          Te enviamos un enlace de confirmación. Ábrelo desde tu correo para activar tu cuenta y
          empezar a usar Nido.
        </p>
        <Link href="/login" className="mt-6 inline-block font-semibold text-terracotta">
          Volver a iniciar sesión
        </Link>
      </div>
    </main>
  );
}
