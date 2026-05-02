import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getTomorrowsReservations } from "@/server/repositories/cron-queries";
import AdminDailyDigestEmail from "@/emails/admin-daily-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorize(request: Request) {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  if (!settings.contactEmail) {
    return NextResponse.json({
      ok: false,
      error: "Sin email de contacto configurado",
    });
  }

  const reservations = await getTomorrowsReservations();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const result = await sendEmail({
    to: settings.contactEmail,
    subject: `Reporte ParkAway · ${dateStr} (${reservations.length} reservas)`,
    react: AdminDailyDigestEmail({
      date: dateStr,
      reservations: reservations.map((r: {
        code: string;
        customerName: string;
        customerPhone: string;
        pickupHour: string;
        vehicleModel: string;
        vehiclePlate: string;
      }) => ({
        code: r.code,
        customerName: r.customerName,
        customerPhone: r.customerPhone,
        pickupHour: r.pickupHour,
        vehicleModel: r.vehicleModel,
        vehiclePlate: r.vehiclePlate,
      })),
    }),
  });

  return NextResponse.json({
    ok: result.ok,
    total: reservations.length,
    sent: result.ok ? 1 : 0,
  });
}
