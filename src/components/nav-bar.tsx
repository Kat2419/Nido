"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/mercado", label: "Mercado", icon: "🛒" },
  { href: "/fechas", label: "Fechas", icon: "📅" },
  { href: "/eventos", label: "Eventos", icon: "💍" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 border-t border-rose-light bg-cream/95 backdrop-blur">
      <ul className="mx-auto flex max-w-2xl justify-around">
        {LINKS.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                  active ? "text-terracotta" : "text-coffee-light"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
