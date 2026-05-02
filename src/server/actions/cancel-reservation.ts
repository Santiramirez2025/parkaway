"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  recordReservationEvent,
  updateReservationPayment,
} from "@/server/repositories/reservation";
import { sendWhatsAppMessage, whatsappTemplates } from "@/lib/whatsapp";

export interface CancelResult {
  ok: boolean;
  refunded?: boolean;
  error?: string;
}

/**
 * Cancela una reserva del cliente (via token publico).
 *
 * Politica: cancelacion gratuita hasta 24hs antes del retiro.
 * Despues de eso, se cancela pero sin reembolso automatico
 * (el admin decide manual desde el panel).
 *
 * NOTA: el reembolso real en Mercado Pago lo hacemos en Etapa 2 desde el
 * panel admin. Aca solo marcamos el estado y lo registramos.
 */
export async function cancelReservation(
  token: string
): Promise<CancelResult> {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { publicToken: token },
    });

    if (!reservation) {
      return { ok: false, error: "Reserva no encontrada" };
    }

    if (reservation.status === "CANCELLED") {
      return { ok: false, error: "Esta reserva ya estaba cancelada" };
    }

    if (
      reservation.status === "COMPLETED" ||
      reservation.status === "PICKED_UP" ||
      reservation.status === "IN_PARKING" ||
      reservation.status === "RETURNING"
    ) {
      return {
        ok: false,
        error: "No se puede cancelar una reserva ya en curso. Escribinos por WhatsApp.",
      };
    }

    // Verificar politica 24hs
    const now = new Date();
    const pickup = new Date(reservation.pickupDate);
    const hoursUntilPickup =
      (pickup.getTime() - now.getTime()) / (1000 * 60 * 60);

    const eligibleForRefund = hoursUntilPickup >= 24;

    // Marcar como cancelada
    await updateReservationPayment(reservation.id, {
      status: "CANCELLED",
    });

    await recordReservationEvent(
      reservation.id,
      "STATUS_CHANGE",
      eligibleForRefund
        ? "Cancelada por el cliente (elegible para reembolso)"
        : "Cancelada por el cliente fuera de plazo (revisar reembolso manual)",
      {
        cancelledAt: now.toISOString(),
        hoursUntilPickup,
        eligibleForRefund,
      }
    );

    // Notificar al cliente por WhatsApp
    await sendWhatsAppMessage({
      to: reservation.customerPhone,
      body: whatsappTemplates.cancellation({
        code: reservation.code,
        refunded: eligibleForRefund && reservation.paymentStatus === "APPROVED",
      }),
    });

    revalidatePath(`/reserva/${token}`);

    return { ok: true, refunded: eligibleForRefund };
  } catch (error) {
    console.error("[cancelReservation] error:", error);
    return {
      ok: false,
      error: "No pudimos cancelar la reserva. Intenta de nuevo.",
    };
  }
}
