"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cancelReservation } from "@/server/actions/cancel-reservation";

interface Props {
  token: string;
  reservationCode: string;
  pickupDate: Date;
  canCancel: boolean;
}

export function ManageReservation({
  token,
  reservationCode,
  pickupDate,
  canCancel,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hoursUntilPickup =
    (new Date(pickupDate).getTime() - Date.now()) / (1000 * 60 * 60);
  const eligibleRefund = hoursUntilPickup >= 24;

  const handleCancel = () => {
    setError(null);
    startTransition(async () => {
      const result = await cancelReservation(token);
      if (!result.ok) {
        setError(result.error || "Error cancelando");
        return;
      }
      setShowConfirm(false);
      router.refresh();
    });
  };

  if (!canCancel) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="text-ink-400 hover:text-destructive"
      >
        <X className="size-4" />
        Cancelar reserva
      </Button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => !isPending && setShowConfirm(false)}
        >
          <div
            className="max-w-md w-full rounded-3xl border border-ink-800 bg-ink-900 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="size-12 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-4">
              <AlertTriangle className="size-5 text-destructive" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Cancelar la reserva {reservationCode}?
            </h3>

            {eligibleRefund ? (
              <p className="text-sm text-ink-400 mb-6">
                Como faltan mas de 24 horas para el retiro, tenes derecho a un
                reembolso completo. Procesamos el reembolso a tu medio de pago
                en los proximos dias habiles.
              </p>
            ) : (
              <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 mb-6">
                <p className="text-sm text-warning">
                  Estas cancelando con menos de 24 horas de anticipacion. La
                  reserva se cancela pero el reembolso no es automatico.
                  Contactanos por WhatsApp para coordinar.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1"
              >
                No, mantener
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Si, cancelar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
