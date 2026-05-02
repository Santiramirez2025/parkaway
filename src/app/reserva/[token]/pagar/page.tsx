import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import {
  getReservationByToken,
  updateReservationPayment,
} from "@/server/repositories/reservation";
import { createMercadoPagoPreference } from "@/lib/mercadopago";
import { formatARS } from "@/lib/utils";

interface Props {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function PayPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { error } = await searchParams;

  const reservation = await getReservationByToken(token);
  if (!reservation) notFound();

  // Si ya esta paga, mandar a confirmacion
  if (reservation.status !== "PENDING_PAYMENT") {
    redirect(`/reserva/${token}/confirmacion`);
  }

  // Crear preferencia
  let initPoint: string;
  try {
    const pref = await createMercadoPagoPreference({
      reservationId: reservation.id,
      reservationCode: reservation.code,
      totalAmount: reservation.totalAmount,
      customerEmail: reservation.customerEmail,
      customerName: reservation.customerName,
      publicToken: reservation.publicToken,
    });

    await updateReservationPayment(reservation.id, {
      preferenceId: pref.id,
    });

    initPoint = pref.initPoint;
  } catch (e) {
    console.error("[pay-page] error creando preferencia:", e);
    return (
      <PayLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">No pudimos iniciar el pago</h1>
          <p className="text-ink-400">
            Hubo un problema con la pasarela. Intenta de nuevo en unos minutos
            o escribinos por WhatsApp.
          </p>
          <Button asChild variant="secondary">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </PayLayout>
    );
  }

  return (
    <PayLayout>
      <div className="text-center space-y-6 max-w-md mx-auto">
        {error && (
          <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-sm text-destructive">
            El pago anterior no se completo. Intenta nuevamente.
          </div>
        )}

        <div>
          <h1 className="text-3xl font-semibold">Confirma tu reserva</h1>
          <p className="text-ink-400 mt-2">
            Reserva <span className="font-mono text-lime">{reservation.code}</span>
          </p>
        </div>

        <div className="rounded-3xl border border-ink-800 bg-white p-6 text-left space-y-3">
          <Row label="Cliente" value={reservation.customerName} />
          <Row
            label="Retiro"
            value={`${formatDate(reservation.pickupDate)} · ${reservation.pickupHour} hs`}
          />
          <Row label="Devolucion" value={formatDate(reservation.returnDate)} />
          <Row label="Vehiculo" value={`${reservation.vehicleModel} · ${reservation.vehiclePlate}`} />
          <div className="pt-3 mt-3 border-t border-ink-800 flex items-center justify-between">
            <span className="text-sm">Total a pagar</span>
            <span className="text-2xl font-semibold text-lime">
              {formatARS(reservation.totalAmount)}
            </span>
          </div>
        </div>

        <Button asChild size="lg" className="w-full">
          <a href={initPoint}>
            Pagar con Mercado Pago
          </a>
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-ink-500">
          <ShieldCheck className="size-3.5 text-lime" />
          Pago seguro a traves de Mercado Pago
        </div>

        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </PayLayout>
  );
}

function PayLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <div className="flex-1 container py-12">{children}</div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="text-ink-500">{label}: </span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
