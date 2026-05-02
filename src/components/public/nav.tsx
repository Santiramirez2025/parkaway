"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#preguntas", label: "Preguntas" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ink-950/85 backdrop-blur-xl border-b border-ink-800 shadow-soft-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-20">
        <Link href="/" aria-label="Inicio ParkAway">
          <Logo light={!scrolled} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                scrolled
                  ? "text-ink-500 hover:text-foreground"
                  : "text-white/85 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {scrolled ? (
            <Button asChild variant="primary" size="sm">
              <Link href="#reservar">Reservar</Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-white text-foreground hover:bg-white/90 border-0"
            >
              <Link href="#reservar">Reservar</Link>
            </Button>
          )}
        </div>

        <button
          className={cn(
            "md:hidden",
            scrolled ? "text-foreground" : "text-white"
          )}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-ink-950/95 backdrop-blur-xl border-b border-ink-800 animate-fade-in shadow-soft-md">
          <nav className="container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-foreground hover:text-lime py-2"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="primary" size="md" className="mt-2">
              <Link href="#reservar" onClick={() => setOpen(false)}>
                Reservar
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
