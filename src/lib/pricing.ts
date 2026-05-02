import type { VehicleType } from "@prisma/client";
import { prisma } from "./prisma";

export interface PricingInput {
  vehicleType: VehicleType;
  daysCount: number;
}

export interface PricingBreakdown {
  daysCount: number;
  pricePerDay: number; // centavos
  daysSubtotal: number; // pricePerDay * days
  vehicleSurcharge: number; // extra por tipo de vehiculo
  logisticsPrice: number; // legacy (modelo puerta a puerta), siempre 0 en reservas nuevas
  totalAmount: number;
}

/**
 * Calcula el precio en el servidor. NUNCA confiar en el cliente.
 *
 * Multiplicadores guardados como Int (100 = 1.00x, 120 = 1.20x) para evitar
 * errores de redondeo con floats. Se divide por 100 al final.
 */
export async function calculatePricing(
  input: PricingInput
): Promise<PricingBreakdown> {
  if (input.daysCount < 1) {
    throw new Error("La reserva debe ser de al menos 1 dia");
  }
  if (input.daysCount > 60) {
    throw new Error("Maximo 60 dias por reserva");
  }

  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  const multiplier =
    input.vehicleType === "CHICO"
      ? settings.multiplierChico
      : input.vehicleType === "MEDIANO"
        ? settings.multiplierMedio
        : settings.multiplierSuv;

  const daysSubtotal = settings.pricePerDay * input.daysCount;

  // Recargo por tipo de vehiculo: diferencia entre el precio con multiplier y el precio base
  const adjustedSubtotal = Math.round((daysSubtotal * multiplier) / 100);
  const vehicleSurcharge = adjustedSubtotal - daysSubtotal;

  const totalAmount = adjustedSubtotal;

  return {
    daysCount: input.daysCount,
    pricePerDay: settings.pricePerDay,
    daysSubtotal,
    vehicleSurcharge,
    logisticsPrice: 0,
    totalAmount,
  };
}

/**
 * Calculo de dias entre dos fechas (inclusive el dia de pickup, exclusive el de retorno).
 * Si pickup = 10/01 y return = 12/01 -> 2 dias.
 */
export function calculateDays(pickupDate: Date, returnDate: Date): number {
  const ms = returnDate.getTime() - pickupDate.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}
