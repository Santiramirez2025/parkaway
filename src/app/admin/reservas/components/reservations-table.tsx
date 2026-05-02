import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatARS } from "@/lib/utils";
import type { ReservationStatus } from "@prisma/client";

interface Item {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  pickupDate: Date;
  pickupHour: string;
  vehicleModel: string;
  vehiclePlate: string;
  status: ReservationStatus;
  totalAmount: number;
  createdAt: Date;
}

interface Props {
  items: Item[];
}

export function ReservationsTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-ink-800 bg-white p-12 text-center shadow-soft-sm">
        <div className="text-sm text-ink-400">
          No hay reservas que coincidan con los filtros.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink-800 bg-white overflow-hidden shadow-soft-sm">
      {/* Mobile: cards */}
      <div className="lg:hidden divide-y divide-ink-800">
        {items.map((r) => (
          <Link
            key={r.id}
            href={`/admin/reservas/${r.id}`}
            className="block p-4 hover:bg-white transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-mono text-sm text-lime">{r.code}</span>
              <StatusBadge status={r.status} />
            </div>
            <div className="font-medium text-sm mb-1">{r.customerName}</div>
            <div className="text-xs text-ink-400 space-y-0.5">
              <div>
                {formatDate(r.pickupDate)} · {r.pickupHour} hs
              </div>
              <div>
                {r.vehicleModel} · {r.vehiclePlate}
              </div>
              <div className="text-lime font-medium pt-1">
                {formatARS(r.totalAmount)}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: tabla */}
      <table className="hidden lg:table w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-800">
            <th className="px-5 py-3 font-medium">Código</th>
            <th className="px-5 py-3 font-medium">Cliente</th>
            <th className="px-5 py-3 font-medium">Llegada</th>
            <th className="px-5 py-3 font-medium">Vehículo</th>
            <th className="px-5 py-3 font-medium">Estado</th>
            <th className="px-5 py-3 font-medium text-right">Total</th>
            <th className="px-5 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800">
          {items.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-white transition-colors group"
            >
              <td className="px-5 py-4">
                <Link
                  href={`/admin/reservas/${r.id}`}
                  className="font-mono text-lime hover:underline"
                >
                  {r.code}
                </Link>
              </td>
              <td className="px-5 py-4">
                <div className="font-medium">{r.customerName}</div>
                <div className="text-xs text-ink-500 mt-0.5">
                  {r.customerPhone}
                </div>
              </td>
              <td className="px-5 py-4">
                <div>{formatDate(r.pickupDate)}</div>
                <div className="text-xs text-ink-500 mt-0.5">
                  {r.pickupHour} hs
                </div>
              </td>
              <td className="px-5 py-4">
                <div>{r.vehicleModel}</div>
                <div className="text-xs text-ink-500 font-mono mt-0.5">
                  {r.vehiclePlate}
                </div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-5 py-4 text-right font-medium">
                {formatARS(r.totalAmount)}
              </td>
              <td className="px-5 py-4">
                <Link
                  href={`/admin/reservas/${r.id}`}
                  className="text-ink-500 group-hover:text-lime transition-colors"
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
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
