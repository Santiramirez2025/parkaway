"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, MapPin, Search } from "lucide-react";

// Imagen de fondo del hero.
// Para cambiarla: reemplazar la URL por otra de Unsplash o subir una propia
// a /public/hero.jpg y cambiar src a "/hero.jpg".
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=2000&q=80";

export function Hero() {
  const router = useRouter();

  const [pickupDate, setPickupDate] = useState("");
  const [pickupHour, setPickupHour] = useState("06:00");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const handleQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pickupDate || !returnDate) {
      setError("Completa las fechas para ver disponibilidad");
      return;
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
      setError("La devolucion tiene que ser despues del retiro");
      return;
    }

    const params = new URLSearchParams({
      d: pickupDate,
      h: pickupHour,
      r: returnDate,
    });
    router.push(`/?${params.toString()}#reservar`);
  };

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
            <span className="block font-semibold">Dejá tu auto en casa.</span>
            <span className="block font-display font-medium italic text-white/90 mt-1">
              Te lo cuidamos cerca del aeropuerto.
            </span>
          </h1>

          <p className="mt-6 text-base lg:text-lg text-white/80 max-w-xl text-pretty drop-shadow-sm">
            Cochera privada, atención 24/7, a metros del Aeropuerto Islas
            Malvinas.
          </p>

          {/* === SEARCH WIDGET HORIZONTAL ESTILO AIRBNB === */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            onSubmit={handleQuickBooking}
            className="mt-10 max-w-3xl"
          >
            <div className="bg-white rounded-2xl md:rounded-full p-2 md:pl-3 shadow-soft-lg flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
              {/* Te dejás */}
              <div className="flex-1 px-4 py-2 md:py-1 md:border-r md:border-ink-800">
                <label
                  htmlFor="hero-pickup-date"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500"
                >
                  Lo dejás
                </label>
                <input
                  id="hero-pickup-date"
                  type="date"
                  value={pickupDate}
                  min={today}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent text-base md:text-sm font-medium text-foreground focus:outline-none mt-0.5"
                />
              </div>

              {/* Hora */}
              <div className="px-4 py-2 md:py-1 md:border-r md:border-ink-800 md:w-32">
                <label
                  htmlFor="hero-pickup-hour"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500"
                >
                  Hora
                </label>
                <input
                  id="hero-pickup-hour"
                  type="time"
                  value={pickupHour}
                  onChange={(e) => setPickupHour(e.target.value)}
                  className="w-full bg-transparent text-base md:text-sm font-medium text-foreground focus:outline-none mt-0.5"
                />
              </div>

              {/* Te lo entregamos */}
              <div className="flex-1 px-4 py-2 md:py-1">
                <label
                  htmlFor="hero-return-date"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500"
                >
                  Te lo entregamos
                </label>
                <input
                  id="hero-return-date"
                  type="date"
                  value={returnDate}
                  min={pickupDate || today}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-base md:text-sm font-medium text-foreground focus:outline-none mt-0.5"
                />
              </div>

              {/* CTA terracota redondo */}
              <button
                type="submit"
                className="md:ml-1 inline-flex items-center justify-center gap-2 h-12 md:h-14 md:w-14 md:px-0 px-6 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold shadow-soft-md transition-all active:scale-95 duration-200"
                aria-label="Buscar disponibilidad"
              >
                <Search className="size-5" />
                <span className="md:hidden">Buscar</span>
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-white bg-destructive/80 backdrop-blur-sm px-4 py-2 rounded-xl inline-block">
                {error}
              </p>
            )}

            {/* Microcopy de confianza */}
            <p className="mt-4 text-xs text-white/70">
              Reservás en 2 minutos · Pago seguro con Mercado Pago · Cancelación
              gratis hasta 24hs antes
            </p>
          </motion.form>

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
