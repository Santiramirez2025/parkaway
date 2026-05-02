"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recordReservationEvent } from "@/server/repositories/reservation";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import type { ReservationStatus } from "@prisma/client";

interface Result {
  ok: boolean;
  error?: string;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
}

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: "Esperando pago",
  CONFIRMED: "Confirmada",
  PICKED_UP: "Auto recibido",
  IN_PARKING: "En cochera",
  RETURNING: "Listo para retirar",
  COMPLETED: "Entregado",
  CANCELLED: "Cancelada",
};

// Transiciones permitidas (no se puede saltar de PENDING_PAYMENT a COMPLETED, por ejemplo)
const ALLOWED_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING_PAYMENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_PARKING", "CANCELLED"],
  IN_PARKING: ["RETURNING", "CANCELLED"],
  RETURNING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function changeReservationStatus(
  id: string,
  newStatus: ReservationStatus
): Promise<Result> {
  await requireAdmin();

  try {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return { ok: false, error: "Reserva no encontrada" };

    const allowed = ALLOWED_TRANSITIONS[reservation.status];
    if (!allowed.includes(newStatus)) {
      return {
        ok: false,
        error: `No se puede pasar de ${STATUS_LABEL[reservation.status]} a ${STATUS_LABEL[newStatus]}`,
      };
    }

    // Tracking de timestamps
    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === "PICKED_UP") updateData.pickedUpAt = new Date();
    if (newStatus === "COMPLETED") updateData.returnedAt = new Date();

    await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    await recordReservationEvent(
      id,
      "STATUS_CHANGE",
      `Estado cambiado: ${STATUS_LABEL[reservation.status]} -> ${STATUS_LABEL[newStatus]}`,
      { from: reservation.status, to: newStatus }
    );

    revalidatePath(`/admin/reservas/${id}`);
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");

    return { ok: true };
  } catch (error) {
    console.error("[changeReservationStatus]", error);
    return { ok: false, error: "Error cambiando el estado" };
  }
}

export async function addReservationNote(
  id: string,
  note: string
): Promise<Result> {
  await requireAdmin();

  if (!note.trim()) return { ok: false, error: "Nota vacia" };
  if (note.length > 1000) return { ok: false, error: "Demasiado larga" };

  try {
    await recordReservationEvent(id, "NOTE", note.trim());
    revalidatePath(`/admin/reservas/${id}`);
    return { ok: true };
  } catch (error) {
    console.error("[addReservationNote]", error);
    return { ok: false, error: "Error agregando nota" };
  }
}

export async function adminCancelReservation(
  id: string,
  reason?: string
): Promise<Result> {
  await requireAdmin();

  try {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return { ok: false, error: "Reserva no encontrada" };

    if (reservation.status === "CANCELLED") {
      return { ok: false, error: "Ya estaba cancelada" };
    }

    if (reservation.status === "COMPLETED") {
      return { ok: false, error: "No se puede cancelar una reserva finalizada" };
    }

    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    await recordReservationEvent(
      id,
      "STATUS_CHANGE",
      `Cancelada por admin${reason ? `: ${reason}` : ""}`,
      { reason: reason || null, by: "admin" }
    );

    revalidatePath(`/admin/reservas/${id}`);
    revalidatePath("/admin/reservas");
    revalidatePath("/admin");

    return { ok: true };
  } catch (error) {
    console.error("[adminCancelReservation]", error);
    return { ok: false, error: "Error cancelando" };
  }
}

export async function sendCustomWhatsApp(
  id: string,
  body: string
): Promise<Result> {
  await requireAdmin();

  if (!body.trim()) return { ok: false, error: "Mensaje vacio" };

  try {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return { ok: false, error: "Reserva no encontrada" };

    const result = await sendWhatsAppMessage({
      to: reservation.customerPhone,
      body: body.trim(),
    });

    if (!result.ok) return { ok: false, error: result.error };

    await recordReservationEvent(
      id,
      "NOTIFICATION_SENT",
      `WhatsApp enviado: ${body.trim().slice(0, 100)}`,
      { messageId: result.messageId }
    );

    revalidatePath(`/admin/reservas/${id}`);
    return { ok: true };
  } catch (error) {
    console.error("[sendCustomWhatsApp]", error);
    return { ok: false, error: "Error enviando WhatsApp" };
  }
}
