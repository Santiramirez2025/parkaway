"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Car,
  User,
  Pencil,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatARS } from "@/lib/utils";
import type { BookingFormData } from "@/lib/validations/reservation";

interface Props {
  data: BookingFormData;
  setValid: (valid: boolean) => void;
  onEditStep?: (step: number) => void;
}

interface Pricing {
  daysCount: number;
  pricePerDay: number;
  daysSubtotal: number;
  vehicleSurcharge: number;
  logisticsPrice: number;
  totalAmount: number;
}

const VEHICLE_LABEL = {
  CHICO: "Chico",
  MEDIANO: "Mediano",
  SUV: "SUV / Camioneta",
};

export function StepSummary({ data, setValid, onEditStep }: Props) {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(
      `/api/pricing?pickupDate=${data.pickupDate}&returnDate=${data.returnDate}&vehicleType=${data.vehicleType}`
    )
      .then(async (r) => {
        if (!active) return;
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || "Error calculando precio");
        }
        return r.json();
      })
      .then((d) => {
        if (!active || !d) return;
        setPricing(d);
        setValid(true);
      })
      .catch((e) => {
        if (!active) return;
        // Distinguir errores de red de errores de la API
        const msg =
          e instanceof TypeError
            ? "Sin conexión. Verificá tu internet."
            : e.message;
        setError(msg);
        setValid(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [data.pickupDate, data.returnDate, data.vehicleType, setValid, retryKey]);

  const formatDate = (str: string) => {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-1">Confirmá tu reserva</h3>
        <p className="text-sm text-ink-500">
          Revisá los datos antes de pagar. Tocá el lápiz para corregir cualquier
          dato.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <SummaryCard
          icon={Calendar}
          title="Fechas"
          onEdit={onEditStep ? () => onEditStep(1) : undefined}
          rows={[
            {
              label: "Retiro",
              value: `${formatDate(data.pickupDate)} · ${data.pickupHour} hs`,
            },
            { label: "Devolución", value: formatDate(data.returnDate) },
          ]}
        />
        <SummaryCard
          icon={Car}
          title="Vehículo"
          onEdit={onEditStep ? () => onEditStep(2) : undefined}
          rows={[
            {
              label: "Tipo",
              value:
                VEHICLE_LABEL[data.vehicleType as keyof typeof VEHICLE_LABEL] ||
                "—",
            },
            { label: "Modelo", value: data.vehicleModel },
            { label: "Patente", value: data.vehiclePlate },
            ...(data.vehicleColor
              ? [{ label: "Color", value: data.vehicleColor }]
              : []),
          ]}
        />
        <SummaryCard
          icon={User}
          title="Contacto"
          onEdit={onEditStep ? () => onEditStep(2) : undefined}
          rows={[
            { label: "Nombre", value: data.customerName },
            { label: "Email", value: data.customerEmail },
            { label: "WhatsApp", value: data.customerPhone },
          ]}
        />
      </div>

      <div className="rounded-3xl border border-lime/30 bg-lime/5 p-6">
        <h4 className="text-sm font-medium text-lime mb-4">
          Detalle del precio
        </h4>

        {loading && (
          <div className="space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <div className="pt-3 mt-3 border-t border-lime/20">
              <SkeletonRow tall />
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="inline-flex items-center gap-2 text-sm font-medium text-lime hover:underline"
            >
              <RefreshCw className="size-3.5" />
              Reintentar
            </button>
          </div>
        )}

        {pricing && !loading && !error && (
          <div className="space-y-2.5 text-sm">
            <PriceRow
              label={`Estadía (${pricing.daysCount} ${
                pricing.daysCount === 1 ? "día" : "días"
              } x ${formatARS(pricing.pricePerDay)})`}
              value={formatARS(pricing.daysSubtotal)}
            />
            {pricing.vehicleSurcharge > 0 && (
              <PriceRow
                label="Recargo por tipo de vehículo"
                value={formatARS(pricing.vehicleSurcharge)}
              />
            )}
            <div className="pt-3 mt-3 border-t border-lime/20 flex items-center justify-between">
              <span className="text-base font-medium">Total</span>
              <span className="text-2xl font-semibold text-lime tabular-nums">
                {formatARS(pricing.totalAmount)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-ink-500 leading-relaxed">
        Al continuar serás redirigido a Mercado Pago para completar el pago.
        Aceptamos tarjetas de crédito y débito. La reserva se confirma una vez
        recibido el pago.
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  rows,
  onEdit,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  rows: { label: string; value: string }[];
  onEdit?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-white p-5 shadow-soft-sm relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-ink-500 text-xs uppercase tracking-wider">
          <Icon className="size-3.5" />
          {title}
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="size-7 rounded-lg flex items-center justify-center text-ink-500 hover:text-lime hover:bg-lime/10 transition-colors"
            aria-label={`Editar ${title.toLowerCase()}`}
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="text-sm">
            <span className="text-ink-500">{r.label}: </span>
            <span className="text-foreground">{r.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-300">
      <span>{label}</span>
      <span className="text-foreground tabular-nums">{value}</span>
    </div>
  );
}

function SkeletonRow({ tall }: { tall?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div
        className={`h-3 ${tall ? "w-20" : "w-32"} bg-lime/10 rounded animate-pulse`}
      />
      <div
        className={`h-3 ${tall ? "w-24" : "w-20"} bg-lime/10 rounded animate-pulse`}
      />
    </div>
  );
}
