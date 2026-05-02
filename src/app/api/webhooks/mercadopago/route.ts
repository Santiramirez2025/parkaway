import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentDetails, mapMpStatus } from "@/lib/mercadopago";
import {
  recordReservationEvent,
  updateReservationPayment,
} from "@/server/repositories/reservation";
import { sendEmail } from "@/lib/email";
import { formatARS } from "@/lib/utils";
import ReservationConfirmedEmail from "@/emails/reservation-confirmed";
import AdminNewReservationEmail from "@/emails/admin-new-reservation";

/**
 * Webhook de Mercado Pago.
 *
 * Idempotente: si llega el mismo paymentId dos veces, no rompe nada.
 * MP puede mandar el mismo evento varias veces — es esperado.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, data } = body;

    // MP manda varios tipos de eventos, solo nos interesa "payment"
    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: "missing payment id" }, { status: 400 });
    }

    // Traer el detalle del pago desde MP
    const paymentDetails = await getPaymentDetails(String(paymentId));

    const externalReference = paymentDetails.external_reference;
    if (!externalReference) {
      console.warn("[webhook-mp] sin external_reference, ignorando");
      return NextResponse.json({ received: true });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: externalReference },
    });
    if (!reservation) {
      console.warn(`[webhook-mp] reserva ${externalReference} no encontrada`);
      return NextResponse.json({ received: true });
    }

    const newPaymentStatus = mapMpStatus(paymentDetails.status);

    // Idempotencia: si ya esta confirmada y este pago ya fue procesado, salimos.
    if (
      reservation.paymentId === String(paymentId) &&
      reservation.paymentStatus === newPaymentStatus
    ) {
      return NextResponse.json({ received: true, idempotent: true });
    }

    // Determinar el nuevo estado de la reserva
    let newReservationStatus = reservation.status;
    let paidAt: Date | undefined;

    if (newPaymentStatus === "APPROVED" && reservation.status === "PENDING_PAYMENT") {
      newReservationStatus = "CONFIRMED";
      paidAt = new Date();
    } else if (newPaymentStatus === "REJECTED") {
      // Mantenemos PENDING_PAYMENT, el usuario puede reintentar
    }

    // Actualizar reserva
    const updated = await updateReservationPayment(reservation.id, {
      paymentId: String(paymentId),
      paymentStatus: newPaymentStatus,
      paymentMethod: paymentDetails.payment_method_id || null,
      status: newReservationStatus,
      paidAt,
    });

    // Registrar evento
    await recordReservationEvent(
      reservation.id,
      "PAYMENT_UPDATE",
      `Estado de pago: ${newPaymentStatus}`,
      {
        paymentId: String(paymentId),
        mpStatus: paymentDetails.status,
        amount: paymentDetails.transaction_amount,
      }
    );

    // Si se confirmo, mandar emails (solo la primera vez)
    if (
      newPaymentStatus === "APPROVED" &&
      reservation.status === "PENDING_PAYMENT" &&
      updated.status === "CONFIRMED"
    ) {
      await sendConfirmationEmails(updated);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook-mp] error:", error);
    // Retornamos 200 igual para que MP no reintente infinitamente
    return NextResponse.json({ received: true, error: "internal" });
  }
}

// MP a veces hace GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({ ok: true });
}

async function sendConfirmationEmails(
  reservation: Awaited<ReturnType<typeof updateReservationPayment>>
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const manageUrl = `${baseUrl}/reserva/${reservation.publicToken}`;
  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  // Email al cliente
  const customerResult = await sendEmail({
    to: reservation.customerEmail,
    subject: `Reserva confirmada · ${reservation.code}`,
    react: ReservationConfirmedEmail({
      customerName: reservation.customerName,
      reservationCode: reservation.code,
      pickupDate: formatDate(reservation.pickupDate),
      pickupHour: reservation.pickupHour,
      returnDate: formatDate(reservation.returnDate),
      vehicleModel: reservation.vehicleModel,
      vehiclePlate: reservation.vehiclePlate,
      totalFormatted: formatARS(reservation.totalAmount),
      manageUrl,
      whatsappNumber: settings.whatsappNumber,
      cocheraAddress: settings.cocheraAddress,
      cocheraHours: settings.cocheraHours,
    }),
  });

  if (customerResult.ok) {
    await recordReservationEvent(
      reservation.id,
      "NOTIFICATION_SENT",
      "Email de confirmacion enviado al cliente"
    );
  }

  // Email al admin
  if (settings.contactEmail) {
    await sendEmail({
      to: settings.contactEmail,
      subject: `Nueva reserva: ${reservation.code} · ${reservation.customerName}`,
      react: AdminNewReservationEmail({
        reservationCode: reservation.code,
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail,
        pickupDate: formatDate(reservation.pickupDate),
        pickupHour: reservation.pickupHour,
        returnDate: formatDate(reservation.returnDate),
        vehicleModel: reservation.vehicleModel,
        vehiclePlate: reservation.vehiclePlate,
        totalFormatted: formatARS(reservation.totalAmount),
      }),
      replyTo: reservation.customerEmail,
    });
  }
}
