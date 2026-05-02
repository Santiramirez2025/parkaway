import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Car,
  User,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { StatusChanger } from "../components/status-changer";
import { NotesForm } from "../components/notes-form";
import { EventsTimeline } from "../components/events-timeline";
import { getReservationById } from "@/server/repositories/reservation-admin";
import { formatARS } from "@/lib/utils";
import type { ReservationStatus, VehicleType } from "@prisma/client";

const VEHICLE_LABEL: Record<VehicleType, string> = {
  CHICO: "Chico",
  MEDIANO: "Mediano",
  SUV: "SUV / Camioneta",
};

function vehicleTypeLabel(type: VehicleType) {
  return VEHICLE_LABEL[type];
}

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ReservationDetailPage({ params }: Props) {
  const { id } = await params;
  const reservation = await getReservationById(id);
  if (!reservation) notFound();

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const whatsappLink = `https://wa.me/${reservation.customerPhone.replace(/\+|\s/g, "")}?text=${encodeURIComponent(
    `Hola ${reservation.customerName}, te escribo de ParkAway por tu reserva ${reservation.code}.`
  )}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3 -ml-3">
            <Link href="/admin/reservas">
              <ArrowLeft className="size-4" />
              Volver al listado
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-semibold font-mono text-lime">
              {reservation.code}
            </h1>
            <StatusBadge status={reservation.status} />
          </div>
          <p className="text-xs text-ink-500">
            Creada el {formatDate(reservation.createdAt)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary" size="md">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {/* Grid: info + acciones */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {/* Cliente */}
          <Card icon={User} title="Cliente">
            <Row label="Nombre" value={reservation.customerName} />
            <Row label="Email" value={reservation.customerEmail} />
            <Row label="Teléfono" value={reservation.customerPhone} />
          </Card>

          {/* Reserva */}
          <Card icon={Calendar} title="Servicio">
            <Row
              label="Llegada a cochera"
              value={`${formatDate(reservation.pickupDate)} a las ${reservation.pickupHour} hs`}
            />
            <Row label="Retiro" value={formatDate(reservation.returnDate)} />
            <Row label="Días" value={`${reservation.daysCount}`} />
          </Card>

          {/* Domicilio (legacy: solo se renderiza si la reserva vieja tenia datos) */}
          {(reservation.pickupAddress || reservation.pickupNeighborhood) && (
            <Card icon={MapPin} title="Domicilio (reserva legacy)">
              {reservation.pickupNeighborhood && (
                <Row label="Barrio" value={reservation.pickupNeighborhood} />
              )}
              {reservation.pickupAddress && (
                <Row label="Dirección" value={reservation.pickupAddress} />
              )}
            </Card>
          )}

          {/* Vehiculo */}
          <Card icon={Car} title="Vehículo">
            <Row label="Tipo" value={vehicleTypeLabel(reservation.vehicleType)} />
            <Row label="Modelo" value={reservation.vehicleModel} />
            <Row label="Patente" value={reservation.vehiclePlate} />
            {reservation.vehicleColor && (
              <Row label="Color" value={reservation.vehicleColor} />
            )}
          </Card>

          {/* Pago */}
          <Card icon={CreditCard} title="Pago">
            <Row label="Total" value={formatARS(reservation.totalAmount)} />
            <Row
              label="Estado"
              value={reservation.paymentStatus || "Sin pagar"}
            />
            {reservation.paidAt && (
              <Row label="Pagado el" value={formatDate(reservation.paidAt)} />
            )}
            {reservation.paymentMethod && (
              <Row label="Método" value={reservation.paymentMethod} />
            )}
          </Card>
        </div>

        {/* Sidebar de acciones + timeline */}
        <div className="space-y-4">
          {/* Cambiar estado */}
          <div className="rounded-2xl border border-ink-800 bg-white p-5 shadow-soft-sm">
            <h3 className="text-xs uppercase tracking-wider text-ink-500 mb-3">
              Avanzar estado
            </h3>
            <StatusChanger
              reservationId={reservation.id}
              currentStatus={reservation.status}
            />
            {reservation.status === "COMPLETED" && (
              <p className="text-xs text-ink-500 text-center mt-2">
                Reserva entregada
              </p>
            )}
            {reservation.status === "CANCELLED" && (
              <p className="text-xs text-ink-500 text-center mt-2">
                Reserva cancelada
              </p>
            )}
            {reservation.status === "PENDING_PAYMENT" && (
              <p className="text-xs text-warning text-center mt-2">
                Esperando confirmación de pago
              </p>
            )}
          </div>

          {/* Notas internas */}
          <div className="rounded-2xl border border-ink-800 bg-white p-5 shadow-soft-sm">
            <h3 className="text-xs uppercase tracking-wider text-ink-500 mb-3">
              Agregar nota
            </h3>
            <NotesForm reservationId={reservation.id} />
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-ink-800 bg-white p-5 shadow-soft-sm">
            <h3 className="text-xs uppercase tracking-wider text-ink-500 mb-4">
              Historial
            </h3>
            <EventsTimeline events={reservation.events} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-white p-5 shadow-soft-sm">
      <div className="flex items-center gap-2 mb-4 text-ink-400 text-xs uppercase tracking-wider">
        <Icon className="size-3.5" />
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className="text-foreground text-right break-words">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const config: Record<
    ReservationStatus,
    { label: string; variant: BadgeProps["variant"] }
  > = {
    PENDING_PAYMENT: { label: "Esperando pago", variant: "warning" },
    CONFIRMED: { label: "Confirmada", variant: "success" },
    PICKED_UP: { label: "Auto recibido", variant: "lime" },
    IN_PARKING: { label: "En cochera", variant: "lime" },
    RETURNING: { label: "Listo para retirar", variant: "lime" },
    COMPLETED: { label: "Entregado", variant: "success" },
    CANCELLED: { label: "Cancelada", variant: "default" },
  };
  const c = config[status];
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
