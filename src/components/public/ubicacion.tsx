"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  cocheraAddress: string;
  cocheraHours: string;
}

// Imagen de la zona del aeropuerto. Cuando Pichu mande foto del frente
// del aeropuerto Islas Malvinas o de la cochera, reemplazar esta URL
// (subir a /public/ubicacion.jpg y cambiar el src).
const ZONE_IMAGE =
  "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1200&q=85";

export function Ubicacion({ cocheraAddress, cocheraHours }: Props) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cocheraAddress
  )}`;

  return (
    <section
      id="ubicacion"
      className="py-24 md:py-32 bg-white scroll-mt-20 border-y border-ink-800"
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* === COLUMNA IZQUIERDA: copy === */}
          <div>
            <Badge variant="lime" className="mb-6">
              Dónde estamos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              <span>A 5 minutos del</span>{" "}
              <span className="font-display italic font-medium">
                aeropuerto
              </span>
            </h2>
            <p className="mt-4 text-lg text-ink-500 text-pretty max-w-md">
              Llegás, dejás el auto, y en menos de 10 minutos estás haciendo
              check-in. Cuando volvés, retirás cuando quieras: atendemos las
              24 horas.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm text-ink-500">
              <Plane className="size-4 text-accent" />
              <span>Aeropuerto Islas Malvinas · Rosario</span>
            </div>
          </div>

          {/* === COLUMNA DERECHA: imagen + cards flotantes === */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Imagen */}
            <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft-lg border border-ink-800 aspect-[4/5] sm:aspect-[5/4]">
              <Image
                src={ZONE_IMAGE}
                alt="Zona del Aeropuerto Islas Malvinas, Rosario"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Overlay sutil para legibilidad de cards */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(26,31,46,0) 40%, rgba(26,31,46,0.45) 100%)",
                }}
              />
            </div>

            {/* Card flotante: dirección */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="absolute -top-4 left-4 sm:-left-6 sm:top-8 max-w-[280px] bg-white rounded-2xl border border-ink-800 shadow-soft-md p-4"
            >
              <div className="flex items-start gap-2.5">
                <div className="size-8 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <MapPin className="size-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-0.5">
                    Dirección
                  </div>
                  <p className="text-sm text-foreground leading-snug">
                    {cocheraAddress}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card flotante: horarios */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-4 right-4 sm:-right-6 sm:bottom-20 bg-white rounded-2xl border border-ink-800 shadow-soft-md p-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-lime/10 flex items-center justify-center shrink-0">
                  <Clock className="size-4 text-lime" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-0.5">
                    Atención
                  </div>
                  <p className="text-sm text-foreground font-medium leading-snug">
                    {cocheraHours}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Botón Cómo llegar (centrado bajo la imagen, mobile-first) */}
            <div className="mt-8 flex justify-center sm:absolute sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:mt-0">
              <Button asChild variant="accent" size="lg" className="shadow-soft-md">
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir cómo llegar en Google Maps"
                >
                  <Navigation />
                  Cómo llegar
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
