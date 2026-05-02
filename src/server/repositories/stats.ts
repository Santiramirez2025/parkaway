import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  todayReservations: number;
  weekReservations: number;
  monthReservations: number;
  monthRevenue: number; // centavos

  pendingPayment: number;
  confirmed: number;
  inProgress: number;
  completed: number;

  conversionRate: number; // 0-100
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todayCount,
    weekCount,
    monthCount,
    monthAgg,
    statusCounts,
  ] = await Promise.all([
    prisma.reservation.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.reservation.count({
      where: { createdAt: { gte: weekStart } },
    }),
    prisma.reservation.count({
      where: { createdAt: { gte: monthStart } },
    }),
    prisma.reservation.aggregate({
      where: {
        paidAt: { gte: monthStart },
        paymentStatus: "APPROVED",
      },
      _sum: { totalAmount: true },
    }),
    prisma.reservation.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const counts = Object.fromEntries(
    statusCounts.map((s: { status: string; _count: { _all: number } }) => [
      s.status,
      s._count._all,
    ])
  );

  // Conversion: confirmadas vs total creadas en el mes
  const totalMonth = monthCount;
  const confirmedMonth = await prisma.reservation.count({
    where: {
      createdAt: { gte: monthStart },
      status: { not: "PENDING_PAYMENT" },
      AND: { status: { not: "CANCELLED" } },
    },
  });

  const conversionRate =
    totalMonth > 0 ? Math.round((confirmedMonth / totalMonth) * 100) : 0;

  return {
    todayReservations: todayCount,
    weekReservations: weekCount,
    monthReservations: monthCount,
    monthRevenue: monthAgg._sum.totalAmount || 0,

    pendingPayment: counts.PENDING_PAYMENT || 0,
    confirmed: counts.CONFIRMED || 0,
    inProgress:
      (counts.PICKED_UP || 0) +
      (counts.IN_PARKING || 0) +
      (counts.RETURNING || 0),
    completed: counts.COMPLETED || 0,

    conversionRate,
  };
}

export async function getUpcomingReservations(limit: number = 8) {
  return prisma.reservation.findMany({
    where: {
      status: { in: ["CONFIRMED", "PICKED_UP", "IN_PARKING", "RETURNING"] },
      pickupDate: { gte: new Date() },
    },
    orderBy: { pickupDate: "asc" },
    take: limit,
    select: {
      id: true,
      code: true,
      customerName: true,
      customerPhone: true,
      pickupDate: true,
      pickupHour: true,
      pickupAddress: true,
      vehicleModel: true,
      vehiclePlate: true,
      status: true,
      publicToken: true,
    },
  });
}
