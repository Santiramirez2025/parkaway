"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Foto de fondo del CTA final.
// Por defecto reusamos un atardecer suave que conecta con el hero.
// Cambiar a otra de Unsplash o subir propia a /public/cta-bg.jpg
const CTA_BG =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&q=80";

export function FinalCta() {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto rounded-4xl border border-ink-800 overflow-hidden shadow-soft-lg"
        >
          {/* === FONDO: foto sutil + capas calidas === */}
          <div className="absolute inset-0 -z-10">
            {/* Foto suave */}
            <Image
              src={CTA_BG}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-center opacity-25"
            />
            {/* Velo marfil para que la foto sea solo textura */}
            <div className="absolute inset-0 bg-ink-950/85" />
            {/* Glow terracota difuso desde abajo izquierda */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 20% 100%, rgba(194, 114, 74, 0.30) 0%, transparent 60%)",
              }}
            />
            {/* Glow navy desde arriba derecha (profundidad) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 90% 0%, rgba(30, 58, 95, 0.22) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* === CONTENIDO === */}
          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ink-800 shadow-soft-sm mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-ink-500">
                Empezá tu viaje acá
              </span>
            </div>

            {/* Headline mixto: sans bold + serif italic */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-balance leading-[1.05]">
              <span className="block font-semibold text-foreground">
                Dejá las llaves.
              </span>
              <span className="block font-display font-medium italic text-lime mt-1">
                Te ocupás de viajar.
              </span>
            </h2>

            <p className="mt-6 text-base md:text-lg text-ink-500 max-w-xl mx-auto text-pretty">
              Reservás en 2 minutos, dejás el auto en la cochera y te llevamos
              al aeropuerto. Cuando volvés, te buscamos.
            </p>

            {/* CTA principal: TERRACOTA */}
            <div className="mt-10">
              <Button asChild variant="accent" size="lg" className="h-14 px-10 text-base">
                <Link href="#reservar">
                  Reservar ahora
                  <ArrowRight />
                </Link>
              </Button>
            </div>

            {/* Microcopy de confianza */}
            <p className="mt-5 text-xs text-ink-500">
              Cancelación gratis hasta 24hs antes · Pago seguro con Mercado Pago
            </p>

            {/* Trust strip - 3 garantias */}
            <div className="mt-10 pt-8 border-t border-ink-800/60 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" />
                <span>Cochera privada techada</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-ink-800" />
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-accent" />
                <span>Mercado Pago seguro</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-ink-800" />
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-accent" />
                <span>Atención 24/7</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
