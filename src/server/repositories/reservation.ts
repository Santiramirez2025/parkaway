import { prisma } from "@/lib/prisma";
import type {
  PaymentStatus,
  Reservation,
  ReservationStatus,
} from "@prisma/client";

export async function getReservationByToken(
  token: string
): Promise<Reservation | null> {
  return prisma.reservation.findUnique({
    where: { publicToken: token },
  });
}

export async function getReservationByPaymentId(
  paymentId: string
): Promise<Reservation | null> {
  return prisma.reservation.findFirst({
    where: { paymentId },
  });
}

export async function getReservationByPreferenceId(
  preferenceId: string
): Promise<Reservation | null> {
  return prisma.reservation.findFirst({
    where: { preferenceId },
  });
}

export async function updateReservationPayment(
  id: string,
  data: {
    paymentId?: string;
    paymentStatus?: PaymentStatus;
    paymentMethod?: string | null;
    preferenceId?: string;
    paidAt?: Date;
    status?: ReservationStatus;
  }
): Promise<Reservation> {
  return prisma.reservation.update({
    where: { id },
    data,
  });
}

export async function recordReservationEvent(
  reservationId: string,
  type: "STATUS_CHANGE" | "NOTE" | "NOTIFICATION_SENT" | "PAYMENT_UPDATE",
  description: string,
  metadata?: Record<string, unknown>
) {
  return prisma.reservationEvent.create({
    data: {
      reservationId,
      type,
      description,
      metadata: metadata as never,
    },
  });
}
