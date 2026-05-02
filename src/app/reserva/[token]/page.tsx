import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Car,
  User,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Logo } from "@/components/shared/logo";
import { ManageReservation } from "@/components/public/manage-reservation";
import { getReservationByToken } from "@/server/repositories/reservation";
import { prisma } from "@/lib/prisma";
import { formatARS } from "@/lib/utils";
import type { ReservationStatus } from "@prisma/client";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export default async function MyReservationPage({ params }: Props) {
  const { token } = await params;
  const reservation = await getReservationByToken(token);
  if (!reservation) notFound();

  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const statusConfig = getStatusConfig(reservation.status);
  const canCancel =
    reservation.status === "PENDING_PAYMENT" ||
    reservation.status === "CONFIRMED";

  const whatsappLink = `https://wa.me/${settings.whatsappNumber.replace(/\+|\s/g, "")}?text=${encodeURIComponent(
    `Hola, soy ${reservation.customerName}. Mi reserva es ${reservation.code}.`
  )}`;

  return (
    <main className="min-h-screen flex flex-col">
      <header className="container py-6 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </header>

      <div className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header con estado */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-ink-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-500 mb-2">
                Reserva
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold font-mono text-lime">
                {reservation.code}
              </h1>
              <p className="text-sm text-ink-400 mt-2">
                Creada el{" "}
                {new Date(reservation.createdAt).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge variant={statusConfig.variant} className="text-sm py-1.5 px-3 self-start sm:self-auto">
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>

          {/* Pago pendiente warning */}
          {reservation.status === "PENDING_PAYMENT" && (
            <div className="rounded-2xl border border-warning/30 bg-warning/10 p-5">
              <div className="flex items-start gap-3">
                <Clock className="size-5 text-warning shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Falta completar el pago</h3>
                  <p className="text-sm text-ink-300 mb-4">
                    Tu reserva todavía no está confirmada. Continuá con el pago
                    para asegurar tu lugar.
                  </p>
                  <Button asChild size="sm">
                    <Link href={`/reserva/${reservation.publicToken}/pagar`}>
                      Continuar al pago
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline simplificado del estado */}
          {reservation.status !== "CANCELLED" && reservation.status !== "PENDING_PAYMENT" && (
            <ReservationTimeline status={reservation.status} />
          )}

          {/* Detalles */}
          <div className="grid sm:grid-cols-2 gap-3">
            <DetailCard
              icon={Calendar}
              title="Fechas"
              rows={[
                {
                  label: "Llegada a cochera",
                  value: `${formatDate(reservation.pickupDate)} · ${reservation.pickupHour} hs`,
                },
                { label: "Retiro", value: formatDate(reservation.returnDate) },
                { label: "Días", value: `${reservation.daysCount}` },
              ]}
            />
            {(reservation.pickupAddress || reservation.pickupNeighborhood) && (
              <DetailCard
                icon={MapPin}
                title="Domicilio"
                rows={[
                  { label: "Barrio", value: reservation.pickupNeighborhood ?? "" },
                  { label: "Dirección", value: reservation.pickupAddress ?? "" },
                ]}
              />
            )}
            <DetailCard
              icon={Car}
              title="Vehículo"
              rows={[
                { label: "Modelo", value: reservation.vehicleModel },
                { label: "Patente", value: reservation.vehiclePlate },
                ...(reservation.vehicleColor
                  ? [{ label: "Color", value: reservation.vehicleColor }]
                  : []),
              ]}
            />
            <DetailCard
              icon={User}
              title="Tus datos"
              rows={[
                { label: "Nombre", value: reservation.customerName },
                { label: "Email", value: reservation.customerEmail },
                { label: "WhatsApp", value: reservation.customerPhone },
              ]}
            />
          </div>

          {/* Total */}
          <div className="rounded-3xl border border-lime/30 bg-lime/5 p-6 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-lime mb-1">
                Total{" "}
                {reservation.status === "PENDING_PAYMENT"
                  ? "a pagar"
                  : "pagado"}
              </div>
              <div className="text-3xl font-semibold text-lime">
                {formatARS(reservation.totalAmount)}
              </div>
              {reservation.paidAt && (
                <p className="text-xs text-ink-400 mt-1">
                  Pagado el {formatDate(reservation.paidAt)}
                </p>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild variant="primary" className="flex-1" size="lg">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                Hablar por WhatsApp
              </a>
            </Button>
            <ManageReservation
              token={reservation.publicToken}
              reservationCode={reservation.code}
              pickupDate={reservation.pickupDate}
              canCancel={canCancel}
            />
          </div>

          {/* Contacto */}
          <div className="pt-6 border-t border-ink-800">
            <p className="text-xs text-ink-500 mb-3">¿Necesitás ayuda?</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-ink-300 hover:text-foreground inline-flex items-center gap-1.5"
              >
                <Mail className="size-3.5" />
                {settings.contactEmail}
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\+|\s/g, "")}`}
                className="text-ink-300 hover:text-foreground inline-flex items-center gap-1.5"
              >
                <Phone className="size-3.5" />
                {settings.whatsappNumber}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailCard({
  icon: Icon,
  title,
  rows,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-white p-5">
      <div className="flex items-center gap-2 mb-3 text-ink-400 text-xs uppercase tracking-wider">
        <Icon className="size-3.5" />
        {title}
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="text-sm">
            <span className="text-ink-500">{r.label}: </span>
            <span className="text-foreground">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationTimeline({ status }: { status: ReservationStatus }) {
  const steps = [
    { key: "CONFIRMED", label: "Confirmada" },
    { key: "PICKED_UP", label: "Auto recibido" },
    { key: "IN_PARKING", label: "En cochera" },
    { key: "RETURNING", label: "Listo para retirar" },
    { key: "COMPLETED", label: "Entregado" },
  ] as const;

  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="rounded-2xl border border-ink-800 bg-white p-5">
      <h3 className="text-xs uppercase tracking-wider text-ink-500 mb-4">
        Estado del servicio
      </h3>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none min-w-0">
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div
                  className={`size-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                    done
                      ? "bg-lime text-ink-950"
                      : "bg-ink-900 border border-ink-800 text-ink-500"
                  } ${active ? "ring-2 ring-lime/40" : ""}`}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs whitespace-nowrap ${
                    done ? "text-foreground" : "text-ink-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1 sm:mx-2 transition-colors ${
                    i < currentIdx ? "bg-lime" : "bg-ink-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStatusConfig(status: ReservationStatus): {
  label: string;
  variant: BadgeProps["variant"];
  icon: React.ReactNode;
} {
  switch (status) {
    case "PENDING_PAYMENT":
      return { label: "Pago pendiente", variant: "warning", icon: <Clock className="size-3" /> };
    case "CONFIRMED":
      return { label: "Confirmada", variant: "success", icon: <Check className="size-3" /> };
    case "PICKED_UP":
      return { label: "Auto recibido", variant: "lime", icon: <Car className="size-3" /> };
    case "IN_PARKING":
      return { label: "En cochera", variant: "lime", icon: <Car className="size-3" /> };
    case "RETURNING":
      return { label: "Listo para retirar", variant: "lime", icon: <Car className="size-3" /> };
    case "COMPLETED":
      return { label: "Entregado", variant: "success", icon: <Check className="size-3" /> };
    case "CANCELLED":
      return { label: "Cancelada", variant: "default", icon: <X className="size-3" /> };
    default:
      return { label: status, variant: "default", icon: null };
  }
}
