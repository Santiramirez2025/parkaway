"use server";

import { prisma } from "@/lib/prisma";
import { calculatePricing, calculateDays } from "@/lib/pricing";
import {
  generateReservationCode,
  generatePublicToken,
} from "@/lib/utils";
import {
  createReservationSchema,
  type CreateReservationInput,
} from "@/lib/validations/reservation";

export interface CreateReservationResult {
  ok: boolean;
  reservationId?: string;
  reservationCode?: string;
  publicToken?: string;
  totalAmount?: number;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createReservation(
  input: CreateReservationInput
): Promise<CreateReservationResult> {
  // Validacion server-side (nunca confiar en el cliente)
  const parsed = createReservationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const pickupDate = new Date(data.pickupDate);
  const returnDate = new Date(data.returnDate);

  // Validar fechas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (pickupDate < today) {
    return { ok: false, error: "La fecha de retiro no puede ser en el pasado" };
  }
  if (returnDate <= pickupDate) {
    return {
      ok: false,
      error: "La fecha de retorno tiene que ser posterior al retiro",
    };
  }

  // Verificar que la fecha no este bloqueada
  const blocked = await prisma.blockedDate.findUnique({
    where: { date: pickupDate },
  });
  if (blocked) {
    return {
      ok: false,
      error: "Esa fecha no esta disponible. Proba con otra.",
    };
  }

  try {
    // Calcular precio en el servidor
    const daysCount = calculateDays(pickupDate, returnDate);
    const pricing = await calculatePricing({
      vehicleType: data.vehicleType,
      daysCount,
    });

    // Crear reserva
    const reservation = await prisma.reservation.create({
      data: {
        code: generateReservationCode(),
        publicToken: generatePublicToken(),

        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.toLowerCase().trim(),
        customerPhone: data.customerPhone.replace(/\s/g, ""),

        pickupDate,
        pickupHour: data.pickupHour,
        returnDate,

        // Domicilio: legacy del modelo puerta a puerta. En el flow nuevo viene vacio.
        pickupAddress: data.pickupAddress?.trim() || null,
        pickupNeighborhood: data.pickupNeighborhood?.trim() || null,

        vehicleType: data.vehicleType,
        vehicleModel: data.vehicleModel.trim(),
        vehiclePlate: data.vehiclePlate.toUpperCase().replace(/\s|-/g, ""),
        vehicleColor: data.vehicleColor?.trim() || null,

        daysCount: pricing.daysCount,
        pricePerDay: pricing.pricePerDay,
        logisticsPrice: pricing.logisticsPrice,
        vehicleSurcharge: pricing.vehicleSurcharge,
        totalAmount: pricing.totalAmount,

        status: "PENDING_PAYMENT",

        events: {
          create: {
            type: "STATUS_CHANGE",
            description: "Reserva creada, esperando pago",
          },
        },
      },
    });

    return {
      ok: true,
      reservationId: reservation.id,
      reservationCode: reservation.code,
      publicToken: reservation.publicToken,
      totalAmount: reservation.totalAmount,
    };
  } catch (error) {
    console.error("[createReservation] error:", error);
    return {
      ok: false,
      error: "No pudimos crear la reserva. Intenta de nuevo.",
    };
  }
}
