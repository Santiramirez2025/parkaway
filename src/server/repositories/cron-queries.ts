import { prisma } from "@/lib/prisma";

/**
 * Reservas para retirar manana (entre 24-48hs desde ahora).
 * Excluimos las que ya recibieron notificacion 24h.
 */
export async function getReservationsForReminder24h() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  return prisma.reservation.findMany({
    where: {
      status: "CONFIRMED",
      pickupDate: {
        gte: in24h,
        lte: in48h,
      },
      // No mandar dos veces: filtramos las que ya tienen evento de 24h enviado
      events: {
        none: {
          type: "NOTIFICATION_SENT",
          description: { contains: "Recordatorio 24h" },
        },
      },
    },
  });
}

/**
 * Reservas para retirar en la proxima hora.
 */
export async function getReservationsForReminder1h() {
  const now = new Date();
  const inHour = new Date(now.getTime() + 60 * 60 * 1000);
  const inHour2 = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  return prisma.reservation.findMany({
    where: {
      status: "CONFIRMED",
      pickupDate: {
        gte: inHour,
        lte: inHour2,
      },
      events: {
        none: {
          type: "NOTIFICATION_SENT",
          description: { contains: "Recordatorio 1h" },
        },
      },
    },
  });
}

/**
 * Reservas finalizadas hace mas de 24h sin email post-servicio.
 */
export async function getReservationsForPostService() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  return prisma.reservation.findMany({
    where: {
      status: "COMPLETED",
      returnedAt: {
        gte: twoDaysAgo,
        lte: yesterday,
      },
      events: {
        none: {
          type: "NOTIFICATION_SENT",
          description: { contains: "Post-servicio" },
        },
      },
    },
  });
}

/**
 * Reservas activas para manana (para el reporte diario al admin).
 */
export async function getTomorrowsReservations() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  return prisma.reservation.findMany({
    where: {
      status: { in: ["CONFIRMED", "PICKED_UP"] },
      pickupDate: {
        gte: tomorrow,
        lt: dayAfter,
      },
    },
    orderBy: { pickupHour: "asc" },
  });
}
