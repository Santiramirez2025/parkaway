"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepDates } from "./steps/step-dates";
import { StepVehicle } from "./steps/step-vehicle";
import { StepSummary } from "./steps/step-summary";
import { createReservation } from "@/server/actions/reservation";
import {
  emptyBookingForm,
  type BookingFormData,
} from "@/lib/validations/reservation";
import { useBookingPersistence } from "@/lib/hooks/use-booking-persistence";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Fechas" },
  { id: 2, label: "Vehículo" },
  { id: 3, label: "Resumen" },
];

const TOTAL_STEPS = STEPS.length;

interface Props {
  initialData?: Partial<BookingFormData>;
  initialStep?: number;
}

export function BookingForm({ initialData, initialStep = 1 }: Props = {}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [data, setData] = useState<BookingFormData>({
    ...emptyBookingForm,
    ...initialData,
  });
  const [stepValid, setStepValid] = useState(initialStep > 1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);

  // Persistencia: detectar progreso guardado y guardar cambios
  const { hasStoredProgress, restored, clear } = useBookingPersistence(
    data,
    currentStep
  );

  // Mostrar banner de "retomar reserva" si hay progreso guardado y NO hay initialData
  useEffect(() => {
    if (hasStoredProgress && !initialData) {
      setShowResumeBanner(true);
    }
  }, [hasStoredProgress, initialData]);

  const update = (patch: Partial<BookingFormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS && stepValid) {
      setCurrentStep(currentStep + 1);
      setStepValid(false);
      // Scroll al top del card en mobile
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setStepValid(true);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      setStepValid(true); // editando datos previos
    }
  };

  const handleResume = () => {
    if (restored) {
      setData(restored.data);
      setCurrentStep(restored.step);
      setStepValid(true);
    }
    setShowResumeBanner(false);
  };

  const handleDiscardResume = () => {
    clear();
    setShowResumeBanner(false);
  };

  const handleSubmit = () => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        if (!data.vehicleType) {
          setSubmitError("Falta seleccionar tipo de vehículo");
          return;
        }

        const result = await createReservation({
          pickupDate: data.pickupDate,
          pickupHour: data.pickupHour,
          returnDate: data.returnDate,
          vehicleType: data.vehicleType as "CHICO" | "MEDIANO" | "SUV",
          vehicleModel: data.vehicleModel,
          vehiclePlate: data.vehiclePlate,
          vehicleColor: data.vehicleColor || undefined,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
        });

        if (!result.ok) {
          setSubmitError(result.error || "Error al crear la reserva");
          return;
        }

        // Limpiar localStorage tras reserva exitosa
        clear();
        router.push(`/reserva/${result.publicToken}/pagar`);
      } catch (e) {
        // Errores de red u otros no controlados
        const isNetwork = e instanceof TypeError;
        setSubmitError(
          isNetwork
            ? "Sin conexión. Verificá tu internet y reintentá."
            : "Algo salió mal. Reintentá en unos segundos."
        );
      }
    });
  };

  const currentStepLabel =
    STEPS.find((s) => s.id === currentStep)?.label || "";

  return (
    <div className="max-w-3xl mx-auto pb-24 sm:pb-0">
      {/* Banner de retomar reserva */}
      <AnimatePresence>
        {showResumeBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-lime/30 bg-lime/5 p-4 flex items-start gap-3"
          >
            <RotateCcw className="size-5 text-lime shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                Tenés una reserva en progreso
              </p>
              <p className="text-xs text-ink-500 mt-1">
                ¿Querés continuar desde donde la dejaste?
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm" onClick={handleResume}>
                  Continuar
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDiscardResume}>
                  Empezar de nuevo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stepper */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const isActive = currentStep === s.id;
            const isDone = currentStep > s.id;
            const canJump = isDone; // permitir volver a pasos completados
            return (
              <div
                key={s.id}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => canJump && goToStep(s.id)}
                    disabled={!canJump}
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      isDone &&
                        "bg-lime text-white shadow-soft-sm cursor-pointer hover:scale-105",
                      isActive && "bg-lime/10 border-2 border-lime text-lime",
                      !isActive &&
                        !isDone &&
                        "bg-muted border border-ink-800 text-ink-500 cursor-not-allowed"
                    )}
                    aria-label={`Paso ${s.id}: ${s.label}`}
                  >
                    {isDone ? <Check className="size-4" /> : s.id}
                  </button>
                  <span
                    className={cn(
                      "text-xs hidden sm:block transition-colors",
                      isActive || isDone ? "text-foreground" : "text-ink-500"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-2 sm:mx-4 transition-colors duration-500",
                      currentStep > s.id ? "bg-lime" : "bg-ink-800"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Label del paso actual: solo mobile */}
        <div className="mt-3 text-center sm:hidden">
          <p className="text-xs text-ink-500">
            Paso {currentStep} de {TOTAL_STEPS} ·{" "}
            <span className="text-foreground font-medium">
              {currentStepLabel}
            </span>
          </p>
        </div>
      </div>

      {/* Contenido del paso */}
      <div className="rounded-3xl sm:rounded-4xl border border-ink-800 bg-white p-5 sm:p-10 shadow-soft-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {currentStep === 1 && (
              <StepDates
                data={data}
                update={update}
                setValid={setStepValid}
                onAdvance={goNext}
              />
            )}
            {currentStep === 2 && (
              <StepVehicle
                data={data}
                update={update}
                setValid={setStepValid}
                onAdvance={goNext}
              />
            )}
            {currentStep === 3 && (
              <StepSummary
                data={data}
                setValid={setStepValid}
                onEditStep={goToStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit error inline (visible debajo del card) */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-2xl border border-destructive/30 bg-destructive/10 flex items-start gap-3"
          role="alert"
        >
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-destructive font-medium">
              {submitError}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="text-xs font-medium text-destructive underline mt-1 disabled:opacity-50"
            >
              Reintentar
            </button>
          </div>
        </motion.div>
      )}

      {/* === NAVEGACION === */}
      {/* Desktop: navegacion estatica debajo del card */}
      <div className="hidden sm:flex mt-6 items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={goBack}
          disabled={currentStep === 1 || isPending}
        >
          <ArrowLeft />
          Atrás
        </Button>

        {currentStep < TOTAL_STEPS ? (
          <Button onClick={goNext} disabled={!stepValid}>
            Continuar
            <ArrowRight />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!stepValid || isPending}
            size="lg"
            variant="accent"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Confirmando reserva...
              </>
            ) : (
              <>
                Pagar y confirmar
                <ArrowRight />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Mobile: navegacion sticky bottom con safe-area */}
      <div
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-950/95 backdrop-blur-xl border-t border-ink-800 shadow-[0_-4px_12px_rgba(40,30,20,0.06)]"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        <div className="container py-3 flex items-center gap-3">
          {currentStep > 1 && (
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={isPending}
              size="md"
              className="shrink-0"
              aria-label="Volver al paso anterior"
            >
              <ArrowLeft />
            </Button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={goNext}
              disabled={!stepValid}
              size="lg"
              className="flex-1 h-12"
            >
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!stepValid || isPending}
              size="lg"
              variant="accent"
              className="flex-1 h-12"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  Pagar y confirmar
                  <ArrowRight />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Loading overlay full-screen mientras crea la reserva (mejor UX percibida) */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl border border-ink-800 p-8 max-w-sm w-full shadow-soft-lg text-center">
              <div className="size-16 mx-auto mb-4 rounded-full bg-lime/10 flex items-center justify-center">
                <Loader2 className="size-7 text-lime animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Confirmando tu reserva
              </h3>
              <p className="text-sm text-ink-500">
                Te llevamos a Mercado Pago en un instante...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
