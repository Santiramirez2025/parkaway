"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  cocheraAddress: string;
  cocheraHours: string;
}

export function Faq({ cocheraAddress, cocheraHours }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿Dónde está la cochera?",
      a: `${cocheraAddress}. Estamos a 5 minutos del Aeropuerto Islas Malvinas. En la sección Ubicación tenés un botón de "Cómo llegar" que te abre Google Maps directo.`,
    },
    {
      q: "¿Cómo es el traslado al aeropuerto?",
      a: "Cuando llegás a la cochera con el auto, te recibimos, lo guardamos bajo techo y te llevamos a la terminal. El traslado está incluido en el precio: no pagás extra.",
    },
    {
      q: "¿Cómo me buscan cuando vuelvo?",
      a: "Cuando aterrices, nos avisás por WhatsApp y te pasamos a buscar al aeropuerto. Te traemos a la cochera para que retires tu auto. También está incluido en el precio.",
    },
    {
      q: "¿Atienden 24/7?",
      a: `${cocheraHours}. Podés dejar el auto y volver a buscarlo a cualquier hora. Si tu vuelo aterriza de madrugada, no hay drama: hay alguien siempre.`,
    },
    {
      q: "¿Tengo que coordinar el horario para dejarlo?",
      a: "Sí, en la reserva elegís el día y horario en el que vas a llegar a la cochera. Eso nos ayuda a tener el traslado listo y salir sin esperas hacia el aeropuerto. Si te atrasás un poco no pasa nada, escribinos por WhatsApp.",
    },
    {
      q: "¿Mi auto está realmente seguro?",
      a: "Sí. La cochera es privada, techada y con vigilancia. No es un estacionamiento masivo: lo opera Pichu personalmente. El auto queda bajo techo todo el tiempo.",
    },
    {
      q: "¿Qué pasa si mi vuelo se atrasa o se adelanta?",
      a: "Tranqui. Como atendemos 24/7, te buscamos cuando aterrices. Avisanos por WhatsApp con el cambio y coordinamos. No hay penalidad ni costo extra por demora.",
    },
    {
      q: "¿Cómo se paga?",
      a: "Online con tarjeta de crédito o débito a través de Mercado Pago. Pagás 100% al reservar. Si cancelás con más de 24 horas de anticipación, te devolvemos todo.",
    },
    {
      q: "¿Cuánto sale?",
      a: "El precio depende de la cantidad de días y el tipo de vehículo, e incluye el traslado ida y vuelta al aeropuerto. Lo ves transparente en el simulador antes de pagar.",
    },
  ];

  return (
    <section id="preguntas" className="py-24 md:py-32 scroll-mt-20">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              <span>Preguntas</span>{" "}
              <span className="font-display italic font-medium">frecuentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl border transition-colors duration-200",
                    isOpen
                      ? "border-lime/30 bg-lime/[0.03]"
                      : "border-ink-800 bg-white"
                  )}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-medium">{faq.q}</span>
                    <Plus
                      className={cn(
                        "size-5 shrink-0 transition-transform duration-300 text-ink-400",
                        isOpen && "rotate-45 text-lime"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-ink-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
