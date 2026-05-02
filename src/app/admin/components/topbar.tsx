"use client";

import { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";

interface Props {
  userName: string;
}

export function Topbar({ userName }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 h-16 border-b border-ink-800 bg-ink-950/95 backdrop-blur-xl">
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-ink-300">
            <div className="size-8 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center">
              <User className="size-4 text-lime" />
            </div>
            {userName}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <Sidebar
            className="absolute left-0 top-0 bottom-0 w-72 bg-ink-950 border-r border-ink-800 animate-slide-up"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
}
