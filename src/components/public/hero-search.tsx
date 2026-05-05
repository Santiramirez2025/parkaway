"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, differenceInCalendarDays, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Search, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const COMMON_HOURS = [
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

function toISODate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function fromISODate(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatNice(d: Date): string {
  // "Mié 14 may"
  const raw = format(d, "EEE d MMM", { locale: es }).replace(/\./g, "");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

type Field = "pickup" | "hour" | "return" | null;

export function HeroSearch() {
  const router = useRouter();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [pickupHour, setPickupHour] = useState<string>("06:00");
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [open, setOpen] = useState<Field>(null);
  const [error, setError] = useState<string | null>(null);
  // Si la fecha de vuelta queda antes que la nueva pickup, la limpiamos
  useEffect(() => {
    if (pickupDate && returnDate && !isBefore(pickupDate, returnDate)) {
      setReturnDate(undefined);
    }
  }, [pickupDate, returnDate]);

  const nights =
    pickupDate && returnDate
      ? Math.max(0, differenceInCalendarDays(returnDate, pickupDate))
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pickupDate || !returnDate) {
      setError("Elegí cuándo dejás el auto y cuándo volvés");
      return;
    }
    if (!isBefore(pickupDate, returnDate)) {
      setError("La vuelta tiene que ser después de dejar el auto");
      return;
    }
    const params = new URLSearchParams({
      d: toISODate(pickupDate),
      h: pickupHour,
      r: toISODate(returnDate),
    });
    router.push(`/?${params.toString()}#reservar`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-3xl">
      <div className="bg-white rounded-3xl md:rounded-full p-2 md:pl-3 shadow-soft-lg flex flex-col md:flex-row items-stretch gap-1 md:gap-0">
        {/* === LO DEJÁS === */}
        <Popover
          open={open === "pickup"}
          onOpenChange={(o) => setOpen(o ? "pickup" : null)}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex-1 text-left px-5 py-3 md:py-2.5 rounded-2xl md:rounded-full transition-colors",
                "hover:bg-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/30",
                "md:border-r md:border-ink-800 md:rounded-r-none",
                open === "pickup" && "bg-ink-950"
              )}
              aria-label="Elegir fecha de entrega del auto"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Lo dejás
              </span>
              <span
                className={cn(
                  "block text-base md:text-sm font-medium mt-0.5",
                  pickupDate ? "text-foreground" : "text-ink-500"
                )}
              >
                {pickupDate ? formatNice(pickupDate) : "Elegí día"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-auto p-3"
            collisionPadding={16}
          >
            <div className="flex flex-wrap gap-1.5 mb-3 px-1">
              {[
                { label: "Mañana", value: addDays(today, 1) },
                { label: "Pasado", value: addDays(today, 2) },
                { label: "+7 días", value: addDays(today, 7) },
              ].map((qp) => {
                const isActive =
                  pickupDate && toISODate(pickupDate) === toISODate(qp.value);
                return (
                  <button
                    key={qp.label}
                    type="button"
                    onClick={() => {
                      setPickupDate(qp.value);
                    }}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                      isActive
                        ? "bg-lime/10 border-lime text-lime"
                        : "bg-white border-ink-800 text-ink-500 hover:border-ink-700"
                    )}
                  >
                    {qp.label}
                  </button>
                );
              })}
            </div>
            <Calendar
              mode="single"
              selected={pickupDate}
              onSelect={(d) => {
                if (d) {
                  setPickupDate(d);
                  setOpen("hour");
                }
              }}
              disabled={{ before: today }}
              defaultMonth={pickupDate || today}
              modifiers={returnDate ? { range_end: returnDate } : undefined}
            />
          </PopoverContent>
        </Popover>

        {/* === HORA === */}
        <Popover
          open={open === "hour"}
          onOpenChange={(o) => setOpen(o ? "hour" : null)}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "text-left px-5 py-3 md:py-2.5 rounded-2xl md:rounded-none transition-colors",
                "hover:bg-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/30",
                "md:border-r md:border-ink-800 md:w-32",
                open === "hour" && "bg-ink-950"
              )}
              aria-label="Elegir hora"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Hora
              </span>
              <span className="block text-base md:text-sm font-medium text-foreground mt-0.5">
                {pickupHour} hs
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-3">
            <div className="flex items-center gap-2 mb-3 px-1 text-xs text-ink-500">
              <Clock className="size-3.5" />
              <span>Hora en la que llegás a la cochera</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {COMMON_HOURS.map((h) => {
                const isActive = pickupHour === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      setPickupHour(h);
                      setOpen(returnDate ? null : "return");
                    }}
                    className={cn(
                      "px-2 py-2 text-sm font-medium rounded-xl border transition-colors",
                      isActive
                        ? "bg-lime/10 border-lime text-lime"
                        : "bg-white border-ink-800 text-ink-500 hover:border-ink-700 hover:text-foreground"
                    )}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-ink-500 mt-3 px-1 leading-relaxed">
              Coordiná al menos 90 min antes de tu vuelo para llegar tranquilo.
            </p>
          </PopoverContent>
        </Popover>

        {/* === TE LO ENTREGAMOS === */}
        <Popover
          open={open === "return"}
          onOpenChange={(o) => setOpen(o ? "return" : null)}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex-1 text-left px-5 py-3 md:py-2.5 rounded-2xl md:rounded-full md:rounded-l-none transition-colors",
                "hover:bg-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/30",
                open === "return" && "bg-ink-950"
              )}
              aria-label="Elegir fecha de vuelta"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Te lo entregamos
              </span>
              <span
                className={cn(
                  "block text-base md:text-sm font-medium mt-0.5",
                  returnDate ? "text-foreground" : "text-ink-500"
                )}
              >
                {returnDate ? formatNice(returnDate) : "Elegí día"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-3" collisionPadding={16}>
            {pickupDate && (
              <div className="px-1 mb-2 text-xs text-ink-500">
                Desde el{" "}
                <span className="text-foreground font-medium">
                  {formatNice(pickupDate)}
                </span>
                {nights > 0 && (
                  <>
                    {" · "}
                    <span className="text-foreground font-medium">
                      {nights} {nights === 1 ? "noche" : "noches"}
                    </span>
                  </>
                )}
              </div>
            )}
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={(d) => {
                if (d) {
                  setReturnDate(d);
                  setOpen(null);
                }
              }}
              disabled={{ before: pickupDate ? addDays(pickupDate, 1) : addDays(today, 1) }}
              defaultMonth={returnDate || pickupDate || today}
              modifiers={
                pickupDate && returnDate
                  ? {
                      range_start: pickupDate,
                      range_end: returnDate,
                      range_middle: { after: pickupDate, before: returnDate },
                    }
                  : pickupDate
                    ? { range_start: pickupDate }
                    : undefined
              }
            />
          </PopoverContent>
        </Popover>

        {/* === CTA === */}
        <button
          type="submit"
          className={cn(
            "md:ml-1 inline-flex items-center justify-center gap-2 h-12 md:h-14 md:w-14 md:px-0 px-6 mt-1 md:mt-0",
            "rounded-2xl md:rounded-full bg-accent hover:bg-accent/90 text-white font-semibold",
            "shadow-soft-md transition-all active:scale-95 duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          )}
          aria-label="Buscar disponibilidad"
        >
          <Search className="size-5" />
          <span className="md:hidden">Buscar disponibilidad</span>
          <ArrowRight className="size-4 md:hidden" />
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-white bg-destructive/85 backdrop-blur-sm px-4 py-2 rounded-xl inline-block">
          {error}
        </p>
      )}

      {/* Resumen de selección + microcopy */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/75">
        {pickupDate && returnDate && nights > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/95">
            <CalendarIcon className="size-3" />
            {nights} {nights === 1 ? "noche" : "noches"}
          </span>
        )}
        <span>
          Reservás en 2 minutos · Pago seguro con Mercado Pago · Cancelación
          gratis hasta 24hs antes
        </span>
      </div>
    </form>
  );
}
