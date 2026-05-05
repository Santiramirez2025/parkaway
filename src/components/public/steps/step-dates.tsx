"use client";

import { useEffect, useMemo, useState } from "react";
import {
  format,
  addDays,
  differenceInCalendarDays,
  isBefore,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Plane } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { datesSchema } from "@/lib/validations/reservation";
import type { BookingFormData } from "@/lib/validations/reservation";
import { cn } from "@/lib/utils";

interface Props {
  data: BookingFormData;
  update: (patch: Partial<BookingFormData>) => void;
  setValid: (valid: boolean) => void;
  onAdvance?: () => void;
}

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

function fromISODate(s: string | undefined): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatNice(d: Date): string {
  const raw = format(d, "EEE d MMM", { locale: es }).replace(/\./g, "");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function StepDates({ data, update, setValid, onAdvance }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<"pickup" | "return" | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);
  const pickup = fromISODate(data.pickupDate);
  const ret = fromISODate(data.returnDate);

  const nights =
    pickup && ret ? Math.max(0, differenceInCalendarDays(ret, pickup)) : 0;

  useEffect(() => {
    const result = datesSchema.safeParse({
      pickupDate: data.pickupDate,
      pickupHour: data.pickupHour,
      returnDate: data.returnDate,
    });
    if (result.success) {
      setErrors({});
      setValid(true);
    } else {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((iss) => {
        if (iss.path[0]) errs[iss.path[0] as string] = iss.message;
      });
      setErrors(errs);
      setValid(false);
    }
  }, [data.pickupDate, data.pickupHour, data.returnDate, setValid]);

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const showError = (field: string) =>
    touched[field] && errors[field] ? errors[field] : null;

  const handlePickPickup = (d: Date | undefined) => {
    if (!d) return;
    const iso = toISODate(d);
    const patch: Partial<BookingFormData> = { pickupDate: iso };
    if (data.returnDate && fromISODate(data.returnDate)! <= d) {
      patch.returnDate = "";
    }
    update(patch);
    markTouched("pickupDate");
    setOpen("return");
  };

  const handlePickReturn = (d: Date | undefined) => {
    if (!d) return;
    update({ returnDate: toISODate(d) });
    markTouched("returnDate");
    setOpen(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-1">¿Cuándo viajás?</h3>
        <p className="text-sm text-ink-500">
          Indicanos cuándo dejás el auto en la cochera y cuándo volvés.
        </p>
      </div>

      {/* === FECHAS === */}
      <div className="grid sm:grid-cols-2 gap-3">
        {/* Pickup */}
        <div className="space-y-2">
          <Label>
            <CalendarIcon className="size-3.5 inline mr-1.5" />
            Dejás el auto
          </Label>
          <Popover
            open={open === "pickup"}
            onOpenChange={(o) => setOpen(o ? "pickup" : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full h-12 rounded-2xl border bg-white px-4 text-left transition-colors",
                  "flex items-center justify-between gap-2",
                  "hover:border-ink-700 focus:outline-none focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/20",
                  showError("pickupDate")
                    ? "border-destructive"
                    : "border-ink-800",
                  open === "pickup" && "border-lime ring-2 ring-lime/20"
                )}
                aria-invalid={!!showError("pickupDate")}
              >
                <span
                  className={cn(
                    "text-base sm:text-sm font-medium truncate",
                    pickup ? "text-foreground" : "text-ink-500"
                  )}
                >
                  {pickup ? formatNice(pickup) : "Elegí día"}
                </span>
                <CalendarIcon className="size-4 text-ink-500 shrink-0" />
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
                    pickup && toISODate(pickup) === toISODate(qp.value);
                  return (
                    <button
                      key={qp.label}
                      type="button"
                      onClick={() => handlePickPickup(qp.value)}
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
                selected={pickup}
                onSelect={handlePickPickup}
                disabled={{ before: today }}
                defaultMonth={pickup || today}
                modifiers={
                  pickup && ret
                    ? {
                        range_end: ret,
                        range_middle: { after: pickup, before: ret },
                      }
                    : undefined
                }
              />
            </PopoverContent>
          </Popover>
          {showError("pickupDate") && (
            <p className="text-xs text-destructive">
              {showError("pickupDate")}
            </p>
          )}
        </div>

        {/* Return */}
        <div className="space-y-2">
          <Label>
            <Plane className="size-3.5 inline mr-1.5" />
            Volvés
          </Label>
          <Popover
            open={open === "return"}
            onOpenChange={(o) => setOpen(o ? "return" : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full h-12 rounded-2xl border bg-white px-4 text-left transition-colors",
                  "flex items-center justify-between gap-2",
                  "hover:border-ink-700 focus:outline-none focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/20",
                  showError("returnDate")
                    ? "border-destructive"
                    : "border-ink-800",
                  open === "return" && "border-lime ring-2 ring-lime/20"
                )}
                aria-invalid={!!showError("returnDate")}
              >
                <span
                  className={cn(
                    "text-base sm:text-sm font-medium truncate",
                    ret ? "text-foreground" : "text-ink-500"
                  )}
                >
                  {ret ? formatNice(ret) : "Elegí día"}
                </span>
                <CalendarIcon className="size-4 text-ink-500 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto p-3"
              collisionPadding={16}
            >
              {pickup && (
                <div className="px-1 mb-2 text-xs text-ink-500">
                  Desde el{" "}
                  <span className="text-foreground font-medium">
                    {formatNice(pickup)}
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
                selected={ret}
                onSelect={handlePickReturn}
                disabled={{ before: pickup ? addDays(pickup, 1) : addDays(today, 1) }}
                defaultMonth={ret || pickup || today}
                modifiers={
                  pickup
                    ? {
                        range_start: pickup,
                        ...(ret
                          ? { range_middle: { after: pickup, before: ret } }
                          : {}),
                      }
                    : undefined
                }
              />
            </PopoverContent>
          </Popover>
          {showError("returnDate") && (
            <p className="text-xs text-destructive">
              {showError("returnDate")}
            </p>
          )}
        </div>
      </div>

      {/* === HORARIO (chips inline) === */}
      <div className="space-y-3">
        <Label>
          <Clock className="size-3.5 inline mr-1.5" />
          Horario en que llegás a la cochera
        </Label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
          {COMMON_HOURS.map((h) => {
            const isActive = data.pickupHour === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => {
                  update({ pickupHour: h });
                  markTouched("pickupHour");
                  if (
                    onAdvance &&
                    data.pickupDate &&
                    data.returnDate &&
                    !errors.pickupDate &&
                    !errors.returnDate
                  ) {
                    // permitir un instante para que la validacion se actualice
                    setTimeout(() => onAdvance(), 80);
                  }
                }}
                className={cn(
                  "px-2 py-2.5 text-sm font-medium rounded-xl border transition-colors",
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
      </div>

      {/* === RESUMEN === */}
      {pickup && ret && nights > 0 && (
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime/10 border border-lime/30 text-lime font-medium text-xs">
            <CalendarIcon className="size-3" />
            {nights} {nights === 1 ? "noche" : "noches"}
          </span>
          <span className="text-ink-500">
            del{" "}
            <span className="text-foreground font-medium">
              {formatNice(pickup)}
            </span>{" "}
            al{" "}
            <span className="text-foreground font-medium">
              {formatNice(ret)}
            </span>
          </span>
        </div>
      )}

      <div className="text-xs text-ink-500 leading-relaxed bg-muted border border-ink-800 rounded-2xl p-4">
        Te llevamos al aeropuerto a la hora indicada. Te recomendamos coordinar
        al menos 90 minutos antes de tu vuelo para llegar tranquilo.
      </div>
    </div>
  );
}
