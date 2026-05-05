"use client";

import { motion } from "framer-motion";
import { MousePointerClick, Warehouse, Plane } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    number: "01",
    title: "Reservás online",
    description:
      "Elegí fechas y tu vehículo en 2 minutos. Pagás con tarjeta y listo.",
  },
  {
    icon: Warehouse,
    number: "02",
    title: "Dejás el auto y te llevamos",
    description:
      "El día del viaje traés el auto a nuestra cochera (a 5 min del aeropuerto). Lo cuidamos y te acercamos a la terminal.",
  },
  {
    icon: Plane,
    number: "03",
    title: "Volvés y te buscamos",
    description:
      "Cuando aterrices te pasamos a buscar al aeropuerto y te traemos a buscar tu auto. Atendemos 24/7.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            <span>Tres pasos.</span>{" "}
            <span className="font-display italic font-medium">
              Cero estrés.
            </span>
          </h2>
          <p className="mt-4 text-lg text-ink-400 text-pretty">
            Reservás, dejás el auto en la cochera y te llevamos al aeropuerto.
            Cuando volvés, te pasamos a buscar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-6 rounded-3xl bg-white border border-ink-800 hover:border-lime/40 transition-all duration-300 shadow-soft-sm"
            >
              <div className="text-xs font-mono text-ink-500 mb-6">
                {step.number}
              </div>
              <div className="size-12 rounded-2xl bg-lime/10 border border-lime/20 flex items-center justify-center mb-4 group-hover:bg-lime/20 transition-colors duration-200">
                <step.icon className="size-5 text-lime" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-ink-400 text-pretty">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
