"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, MapPin } from "lucide-react";
import { HeroSearch } from "./hero-search";

// Imagen de fondo del hero.
// Para cambiarla: reemplazar la URL por otra de Unsplash o subir una propia
// a /public/hero.jpg y cambiar src a "/hero.jpg".
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=2000&q=80";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] sm:min-h-[92vh] flex items-end pb-16 md:pb-24 pt-28 sm:pt-32 overflow-hidden">
      {/* === FONDO: foto full-bleed con overlay === */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay degradado: oscuro abajo, mas claro arriba */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,31,46,0.35) 0%, rgba(26,31,46,0.55) 60%, rgba(26,31,46,0.85) 100%)",
          }}
        />
        {/* Tinte calido sutil del costado */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 50%, rgba(194, 114, 74, 0.6) 100%)",
          }}
        />
      </div>

      {/* === CONTENIDO === */}
      <div className="container relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-white/90">
              Aeropuerto Islas Malvinas · Rosario
            </span>
          </div>

          {/* Headline mixto sobre foto */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl tracking-tight text-balance leading-[1.05] text-white drop-shadow-sm">
            <span className="block font-semibold">Dejá el auto. Te llevamos al aeropuerto.</span>
            <span className="block font-display font-medium italic text-white/90 mt-1">
              Cuando volvés, te buscamos.
            </span>
          </h1>

          <p className="mt-6 text-base lg:text-lg text-white/80 max-w-xl text-pretty drop-shadow-sm">
            Cochera privada con traslado ida y vuelta al Aeropuerto Islas
            Malvinas. Atención 24/7.
          </p>

          {/* === SEARCH WIDGET === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <HeroSearch />
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" />
              <span>Cochera privada techada</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-accent" />
              <span>Atención 24/7</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-accent" />
              <span>A 5 min del aeropuerto</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
