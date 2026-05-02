import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { sendWhatsAppMessage, whatsappTemplates } from "@/lib/whatsapp";
import { getReservationsForReminder24h } from "@/server/repositories/cron-queries";
import { recordReservationEvent } from "@/server/repositories/reservation";
import Reminder24hEmail from "@/emails/reminder-24h";

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

  const reservations = await getReservationsForReminder24h();
  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const r of reservations) {
    try {
      // Email
      await sendEmail({
        to: r.customerEmail,
        subject: `Manana te esperamos en la cochera · ${r.code}`,
        react: Reminder24hEmail({
          customerName: r.customerName,
          reservationCode: r.code,
          pickupHour: r.pickupHour,
          cocheraAddress: settings.cocheraAddress,
          cocheraHours: settings.cocheraHours,
          whatsappNumber: settings.whatsappNumber,
        }),
      });

      // WhatsApp
      await sendWhatsAppMessage({
        to: r.customerPhone,
        body: whatsappTemplates.reminder24h({
          customerName: r.customerName.split(" ")[0],
          pickupHour: r.pickupHour,
          cocheraAddress: settings.cocheraAddress,
        }),
      });

      // Marcar como enviado para no duplicar
      await recordReservationEvent(
        r.id,
        "NOTIFICATION_SENT",
        "Recordatorio 24h enviado (email + WhatsApp)"
      );

      sent++;
    } catch (error) {
      console.error(`[cron-24h] error en reserva ${r.code}:`, error);
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
