"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "./booking-form";
import type { BookingFormData } from "@/lib/validations/reservation";

function BookingSectionInner() {
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState<Partial<BookingFormData>>({});
  const [initialStep, setInitialStep] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const d = searchParams.get("d"); // pickup date
    const h = searchParams.get("h"); // pickup hour
    const r = searchParams.get("r"); // return date

    const initial: Partial<BookingFormData> = {};

    if (d && h && r) {
      initial.pickupDate = d;
      initial.pickupHour = h;
      initial.returnDate = r;
    }

    setInitialData(initial);
    // Si vienen fechas pre-cargadas desde el hero, saltamos al paso 2 (vehículo)
    if (d && h && r) {
      setInitialStep(2);
    }
    setHydrated(true);
  }, [searchParams]);

  return (
    <section
      id="reservar"
      className="py-24 md:py-32 border-y border-ink-800 bg-muted scroll-mt-20"
    >
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="lime" className="mb-6">
            Reserva tu lugar
          </Badge>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Cargá tu reserva en 3 pasos
          </h2>
          <p className="mt-4 text-lg text-ink-500 max-w-xl mx-auto text-pretty">
            Te toma menos de 2 minutos. Pago online seguro con Mercado Pago.
          </p>
        </div>

        {hydrated && (
          <BookingForm
            key={initialStep}
            initialData={initialData}
            initialStep={initialStep}
          />
        )}
      </div>
    </section>
  );
}

export function BookingSection() {
  return (
    <Suspense
      fallback={
        <section
          id="reservar"
          className="py-24 md:py-32 border-y border-ink-800 bg-muted scroll-mt-20"
        >
          <div className="container">
            <div className="text-center text-ink-500">Cargando...</div>
          </div>
        </section>
      }
    >
      <BookingSectionInner />
    </Suspense>
  );
}
