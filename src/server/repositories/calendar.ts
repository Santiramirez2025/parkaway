import { prisma } from "@/lib/prisma";

export interface CalendarReservation {
  id: string;
  code: string;
  customerName: string;
  vehiclePlate: string;
  pickupDate: Date;
  returnDate: Date;
  status: string;
}

export interface DayOccupancy {
  date: Date;
  reservations: CalendarReservation[];
  count: number;
}

/**
 * Devuelve la ocupacion dia por dia del mes solicitado.
 * Una reserva ocupa todos los dias entre pickupDate y returnDate.
 */
export async function getMonthOccupancy(year: number, month: number) {
  // month: 1-12
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59); // ultimo dia del mes

  // Reservas que se solapan con el mes (status activo)
  const reservations = await prisma.reservation.findMany({
    where: {
      status: { in: ["CONFIRMED", "PICKED_UP", "IN_PARKING", "RETURNING"] },
      AND: [
        { pickupDate: { lte: monthEnd } },
        { returnDate: { gte: monthStart } },
      ],
    },
    select: {
      id: true,
      code: true,
      customerName: true,
      vehiclePlate: true,
      pickupDate: true,
      returnDate: true,
      status: true,
    },
    orderBy: { pickupDate: "asc" },
  });

  // Fechas bloqueadas del mes
  const blocked = await prisma.blockedDate.findMany({
    where: {
      date: { gte: monthStart, lte: monthEnd },
    },
    select: { date: true, reason: true },
  });

  // Construir array de dias
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DayOccupancy[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayReservations = reservations.filter((r: { pickupDate: Date; returnDate: Date }) => {
      const start = new Date(r.pickupDate);
      const end = new Date(r.returnDate);
      // Comparar solo fechas, no horas
      const dayStart = new Date(year, month - 1, day);
      const dayEnd = new Date(year, month - 1, day, 23, 59, 59);
      return start <= dayEnd && end >= dayStart;
    });

    days.push({
      date,
      reservations: dayReservations,
      count: dayReservations.length,
    });
  }

  return {
    days,
    blocked: blocked.map((b: { date: Date; reason: string | null }) => ({
      date: b.date,
      reason: b.reason,
    })),
    totalReservations: reservations.length,
  };
}

export async function getBlockedDates() {
  return prisma.blockedDate.findMany({
    orderBy: { date: "asc" },
  });
}
