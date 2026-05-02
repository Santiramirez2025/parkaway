import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getReservationsForPostService } from "@/server/repositories/cron-queries";
import { recordReservationEvent } from "@/server/repositories/reservation";
import PostServiceReviewEmail from "@/emails/post-service-review";

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

  const reservations = await getReservationsForPostService();
  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const r of reservations) {
    try {
      await sendEmail({
        to: r.customerEmail,
        subject: "Como te fue con ParkAway?",
        react: PostServiceReviewEmail({
          customerName: r.customerName,
          reservationCode: r.code,
          whatsappNumber: settings.whatsappNumber,
        }),
        replyTo: settings.contactEmail,
      });

      await recordReservationEvent(
        r.id,
        "NOTIFICATION_SENT",
        "Post-servicio enviado (email)"
      );

      sent++;
    } catch (error) {
      console.error(`[cron-post] error en reserva ${r.code}:`, error);
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
