"use client";

import { useState, useTransition } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { changeReservationStatus } from "@/server/actions/admin-reservation";
import type { ReservationStatus } from "@prisma/client";

const NEXT_STATUS: Partial<Record<ReservationStatus, { status: ReservationStatus; label: string }>> = {
  CONFIRMED: { status: "PICKED_UP", label: "Marcar auto recibido" },
  PICKED_UP: { status: "IN_PARKING", label: "Marcar en cochera" },
  IN_PARKING: { status: "RETURNING", label: "Marcar listo para retirar" },
  RETURNING: { status: "COMPLETED", label: "Marcar entregada" },
};

interface Props {
  reservationId: string;
  currentStatus: ReservationStatus;
}

export function StatusChanger({ reservationId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const next = NEXT_STATUS[currentStatus];
  if (!next) return null;

  const handleAdvance = () => {
    setError(null);
    startTransition(async () => {
      const result = await changeReservationStatus(reservationId, next.status);
      if (!result.ok) setError(result.error || "Error");
    });
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleAdvance}
        disabled={isPending}
        size="lg"
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Actualizando...
          </>
        ) : (
          <>
            {next.label}
            <ArrowRight />
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
