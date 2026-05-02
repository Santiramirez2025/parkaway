import { NextResponse } from "next/server";
import { calculatePricing, calculateDays } from "@/lib/pricing";
import { pricingQuerySchema } from "@/lib/validations/reservation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = pricingQuerySchema.safeParse({
      pickupDate: searchParams.get("pickupDate"),
      returnDate: searchParams.get("returnDate"),
      vehicleType: searchParams.get("vehicleType"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parametros invalidos" },
        { status: 400 }
      );
    }

    const pickup = new Date(parsed.data.pickupDate);
    const ret = new Date(parsed.data.returnDate);

    if (ret <= pickup) {
      return NextResponse.json(
        { error: "La fecha de retorno debe ser posterior" },
        { status: 400 }
      );
    }

    const daysCount = calculateDays(pickup, ret);
    const breakdown = await calculatePricing({
      vehicleType: parsed.data.vehicleType,
      daysCount,
    });

    return NextResponse.json(breakdown);
  } catch (error) {
    console.error("[pricing] error:", error);
    return NextResponse.json(
      { error: "Error calculando el precio" },
      { status: 500 }
    );
  }
}
