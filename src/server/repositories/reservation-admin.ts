import { prisma } from "@/lib/prisma";
import type { ReservationStatus } from "@prisma/client";

export interface ListFilters {
  status?: ReservationStatus | "ALL";
  search?: string; // busca en code, customerName, customerEmail, vehiclePlate
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  pageSize?: number;
}

export async function listReservations(filters: ListFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  const where: Record<string, unknown> = {};

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.fromDate || filters.toDate) {
    where.pickupDate = {
      ...(filters.fromDate && { gte: filters.fromDate }),
      ...(filters.toDate && { lte: filters.toDate }),
    };
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { code: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { vehiclePlate: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        code: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        pickupDate: true,
        pickupHour: true,
        returnDate: true,
        vehicleModel: true,
        vehiclePlate: true,
        status: true,
        totalAmount: true,
        paymentStatus: true,
        createdAt: true,
      },
    }),
    prisma.reservation.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getReservationById(id: string) {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
