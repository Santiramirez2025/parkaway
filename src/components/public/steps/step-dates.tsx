"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { datesSchema } from "@/lib/validations/reservation";
import type { BookingFormData } from "@/lib/validations/reservation";
import { cn } from "@/lib/utils";

interface Props {
  data: BookingFormData;
  update: (patch: Partial<BookingFormData>) => void;
  setValid: (valid: boolean) => void;
  onAdvance?: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

// Helper: formatear fecha YYYY-MM-DD
function toISODate(d: Date) {
  return d.toISOString().split("T")[0];
}

// Quick-picks de fecha de retiro (frecuentes)
function getQuickPicks() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(now);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return [
    { label: "Mañana", value: toISODate(tomorrow) },
    { label: "Pasado", value: toISODate(dayAfter) },
    { label: "+7 días", value: toISODate(nextWeek) },
  ];
}

export function StepDates({ data, update, setValid, onAdvance }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const returnDateRef = useRef<HTMLInputElement>(null);

  const todayStr = toISODate(new Date());
  const quickPicks = getQuickPicks();

  // Validacion en cada cambio para habilitar/deshabilitar boton "Continuar",
  // pero los errores solo se muestran si el campo fue tocado (blur)
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

  const handlePickupDateChange = (value: string) => {
    update({ pickupDate: value });
    // Si return date es anterior al nuevo pickup, limpiar
    if (data.returnDate && new Date(data.returnDate) <= new Date(value)) {
      update({ returnDate: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-1">¿Cuándo viajás?</h3>
        <p className="text-sm text-ink-500">
          Indicanos cuándo dejás el auto en la cochera y cuándo volvés.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pickupDate">
            <Calendar className="size-3.5 inline mr-1.5" />
            Fecha de retiro
          </Label>

          {/* Quick-picks: solo mobile, reduce friccion */}
          <div className="flex gap-2 sm:hidden mb-2">
            {quickPicks.map((qp) => (
              <button
                key={qp.value}
                type="button"
                onClick={() => {
                  handlePickupDateChange(qp.value);
                  markTouched("pickupDate");
                }}
                className={cn(
                  "flex-1 px-2 py-2 text-xs font-medium rounded-xl border transition-all",
                  data.pickupDate === qp.value
                    ? "bg-lime/10 border-lime text-lime"
                    : "bg-white border-ink-800 text-ink-500 hover:border-ink-700"
                )}
              >
                {qp.label}
              </button>
            ))}
          </div>

          <Input
            id="pickupDate"
            type="date"
            min={todayStr}
            value={data.pickupDate}
            onChange={(e) => handlePickupDateChange(e.target.value)}
            onBlur={() => markTouched("pickupDate")}
            autoComplete="off"
            enterKeyHint="next"
            aria-invalid={!!showError("pickupDate")}
            aria-describedby={
              showError("pickupDate") ? "pickupDate-error" : undefined
            }
          />
          {showError("pickupDate") && (
            <p id="pickupDate-error" className="text-xs text-destructive">
              {showError("pickupDate")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupHour">
            <Clock className="size-3.5 inline mr-1.5" />
            Horario de retiro
          </Label>
          <Select
            value={data.pickupHour}
            onValueChange={(v) => {
              update({ pickupHour: v });
              markTouched("pickupHour");
            }}
          >
            <SelectTrigger id="pickupHour">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h} hs
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="returnDate">
          <Calendar className="size-3.5 inline mr-1.5" />
          Fecha de devolución
        </Label>
        <Input
          ref={returnDateRef}
          id="returnDate"
          type="date"
          min={data.pickupDate || todayStr}
          value={data.returnDate}
          onChange={(e) => update({ returnDate: e.target.value })}
          onBlur={() => markTouched("returnDate")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onAdvance && !errors.returnDate) {
              e.preventDefault();
              onAdvance();
            }
          }}
          autoComplete="off"
          enterKeyHint="next"
          aria-invalid={!!showError("returnDate")}
          aria-describedby={
            showError("returnDate") ? "returnDate-error" : undefined
          }
        />
        {showError("returnDate") && (
          <p id="returnDate-error" className="text-xs text-destructive">
            {showError("returnDate")}
          </p>
        )}
      </div>

      <div className="text-xs text-ink-500 leading-relaxed bg-muted border border-ink-800 rounded-2xl p-4">
        Te llevamos al aeropuerto a la hora indicada. Te recomendamos coordinar
        al menos 90 minutos antes de tu vuelo para llegar tranquilo.
      </div>
    </div>
  );
}
