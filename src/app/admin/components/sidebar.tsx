"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Settings,
  ListChecks,
  CalendarX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservas", label: "Reservas", icon: ListChecks },
  { href: "/admin/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/admin/bloqueos", label: "Fechas bloqueadas", icon: CalendarX },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

interface Props {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col gap-2 p-4", className)}>
      <div className="px-3 py-4 mb-2">
        <Link href="/admin" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-colors",
                active
                  ? "bg-lime/10 text-lime border border-lime/20"
                  : "text-ink-400 hover:text-foreground hover:bg-ink-900"
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-3 text-xs text-ink-500 border-t border-ink-800">
        ParkAway · v0.1
      </div>
    </aside>
  );
}
