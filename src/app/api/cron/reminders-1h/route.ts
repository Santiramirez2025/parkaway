import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage, whatsappTemplates } from "@/lib/whatsapp";
import { getReservationsForReminder1h } from "@/server/repositories/cron-queries";
import { recordReservationEvent } from "@/server/repositories/reservation";

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

  const reservations = await getReservationsForReminder1h();
  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const r of reservations) {
    try {
      await sendWhatsAppMessage({
        to: r.customerPhone,
        body: whatsappTemplates.reminder1h({
          customerName: r.customerName.split(" ")[0],
          pickupHour: r.pickupHour,
          cocheraAddress: settings.cocheraAddress,
        }),
      });

      await recordReservationEvent(
        r.id,
        "NOTIFICATION_SENT",
        "Recordatorio 1h enviado (WhatsApp)"
      );

      sent++;
    } catch (error) {
      console.error(`[cron-1h] error en reserva ${r.code}:`, error);
      errors.push(r.code);
    }
  }

  return NextResponse.json({
    ok: true,
    total: reservations.length,
    sent,
    errors,
  });
}
