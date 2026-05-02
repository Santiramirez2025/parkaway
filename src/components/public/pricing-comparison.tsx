"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { label: "Cochera techada y privada", parkaway: true, airport: false },
  { label: "Atención humana 24/7", parkaway: true, airport: false },
  { label: "A 5 min del aeropuerto", parkaway: true, airport: true },
  { label: "Entrega y retiro flexible", parkaway: true, airport: false },
  { label: "Vigilancia permanente", parkaway: true, airport: false },
  { label: "Reserva online con pago", parkaway: true, airport: true },
];

export function PricingComparison() {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            <span>¿Por qué no dejarlo</span>{" "}
            <span className="font-display italic font-medium">
              en el aeropuerto?
            </span>
          </h2>
          <p className="mt-4 text-lg text-ink-400 text-pretty">
            Compará lo que recibís en cada lado.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-px bg-ink-800 rounded-3xl overflow-hidden border border-ink-800 shadow-soft-sm">
            <div className="bg-ink-950 p-6">
              <div className="h-8" />
            </div>
            <div className="bg-ink-900 p-6 text-center border-x border-ink-800">
              <div className="text-xs uppercase tracking-wider text-ink-500 mb-1">
                Estacionamiento
              </div>
              <div className="font-semibold text-ink-300">Aeropuerto</div>
            </div>
            <div className="bg-lime/5 p-6 text-center">
              <div className="text-xs uppercase tracking-wider text-lime mb-1">
                Recomendado
              </div>
              <div className="font-semibold text-lime">ParkAway</div>
            </div>

            {features.map((f, i) => (
              <div key={i} className="contents">
                <div className="bg-ink-950 p-5 text-sm text-ink-300 flex items-center">
                  {f.label}
                </div>
                <div className="bg-ink-900 p-5 flex items-center justify-center border-x border-ink-800">
                  {f.airport ? (
                    <Check className="size-5 text-ink-500" />
                  ) : (
                    <X className="size-5 text-ink-700" />
                  )}
                </div>
                <div className="bg-lime/5 p-5 flex items-center justify-center">
                  {f.parkaway ? (
                    <Check className="size-5 text-lime" />
                  ) : (
                    <X className="size-5 text-ink-700" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
