"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// Componente disponible pero NO renderizado en home hasta tener testimonios
// reales (no inventar reviews). Cuando Pichu mande citas reales, sustituir
// este array y volver a importar el componente en src/app/page.tsx.
const testimonials: { name: string; location: string; text: string }[] = [];

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Hablan los que ya viajaron tranquilos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-ink-950 border border-ink-800"
            >
              <Quote className="size-5 text-lime mb-4" />
              <p className="text-sm text-ink-300 leading-relaxed mb-6">
                {t.text}
              </p>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-ink-500 mt-0.5">{t.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
