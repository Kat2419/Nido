import { logout } from "@/app/auth/actions";
import { NavBar } from "@/components/nav-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-rose-light px-4 py-3">
        <span className="font-display text-2xl italic text-terracotta">Nido</span>
        <form action={logout}>
          <button type="submit" className="text-sm text-coffee-light underline">
            Cerrar sesión
          </button>
        </form>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</div>

      <NavBar />
    </div>
  );
}
