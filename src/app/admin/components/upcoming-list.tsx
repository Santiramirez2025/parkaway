import Link from "next/link";
import { ArrowUpRight, Car, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReservationStatus } from "@prisma/client";

interface UpcomingReservation {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  pickupDate: Date;
  pickupHour: string;
  pickupAddress: string | null;
  vehicleModel: string;
  vehiclePlate: string;
  status: ReservationStatus;
}

interface Props {
  reservations: UpcomingReservation[];
}

export function UpcomingList({ reservations }: Props) {
  if (reservations.length === 0) {
    return (
      <div className="rounded-3xl border border-ink-800 bg-white p-12 text-center shadow-soft-sm">
        <div className="text-sm text-ink-400">
          No hay reservas próximas a operar.
        </div>
        <div className="text-xs text-ink-600 mt-2">
          Cuando entren reservas pagadas, las vas a ver acá.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reservations.map((r) => (
        <Link
          key={r.id}
          href={`/admin/reservas/${r.id}`}
          className="block rounded-2xl border border-ink-800 bg-white p-4 hover:border-lime/30 transition-all duration-200 group shadow-soft-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm text-lime">{r.code}</span>
                <StatusBadge status={r.status} />
              </div>

              <div className="text-base font-medium mb-1">
                {r.customerName}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
                <span className="inline-flex items-center gap-1">
                  <Car className="size-3" />
                  {r.vehicleModel} · {r.vehiclePlate}
                </span>
                {r.pickupAddress && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {r.pickupAddress}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3" />
                  {r.customerPhone}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-medium">
                {formatDate(r.pickupDate)}
              </div>
              <div className="text-xs text-ink-500 mt-0.5">
                {r.pickupHour} hs
              </div>
              <ArrowUpRight className="size-4 text-ink-600 group-hover:text-lime transition-colors mt-2 ml-auto" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  switch (status) {
    case "CONFIRMED":
      return <Badge variant="success">Confirmada</Badge>;
    case "PICKED_UP":
      return <Badge variant="lime">Auto recibido</Badge>;
    case "IN_PARKING":
      return <Badge variant="lime">En cochera</Badge>;
    case "RETURNING":
      return <Badge variant="lime">Listo para retirar</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
