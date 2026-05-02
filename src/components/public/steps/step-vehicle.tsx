"use client";

import { useEffect, useState } from "react";
import { Car, User, Mail, Phone, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { vehicleSchema } from "@/lib/validations/reservation";
import type { BookingFormData } from "@/lib/validations/reservation";
import { cn } from "@/lib/utils";

interface Props {
  data: BookingFormData;
  update: (patch: Partial<BookingFormData>) => void;
  setValid: (valid: boolean) => void;
  onAdvance?: () => void;
}

const VEHICLE_TYPES = [
  {
    value: "CHICO" as const,
    label: "Chico",
    description: "Hasta 4 personas. Ej: Onix, Etios, Gol.",
  },
  {
    value: "MEDIANO" as const,
    label: "Mediano",
    description: "Sedanes y compactos. Ej: Corolla, Cruze.",
  },
  {
    value: "SUV" as const,
    label: "SUV / Camioneta",
    description: "4x4, pickups, vans. Ej: Hilux, Tracker.",
  },
];

export function StepVehicle({ data, update, setValid, onAdvance }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const result = vehicleSchema.safeParse({
      vehicleType: data.vehicleType,
      vehicleModel: data.vehicleModel,
      vehiclePlate: data.vehiclePlate,
      vehicleColor: data.vehicleColor || undefined,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
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
  }, [
    data.vehicleType,
    data.vehicleModel,
    data.vehiclePlate,
    data.vehicleColor,
    data.customerName,
    data.customerEmail,
    data.customerPhone,
    setValid,
  ]);

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const showError = (field: string) =>
    touched[field] && errors[field] ? errors[field] : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-1">Tu auto y tus datos</h3>
        <p className="text-sm text-ink-500">
          Necesitamos saber qué auto retiramos y cómo contactarte.
        </p>
      </div>

      <div className="space-y-3">
        <Label>
          <Car className="size-3.5 inline mr-1.5" />
          Tipo de vehículo
        </Label>
        <div className="grid sm:grid-cols-3 gap-2">
          {VEHICLE_TYPES.map((v) => {
            const selected = data.vehicleType === v.value;
            return (
              <button
                key={v.value}
                type="button"
                onClick={() => {
                  update({ vehicleType: v.value });
                  markTouched("vehicleType");
                }}
                aria-pressed={selected}
                className={cn(
                  "relative p-5 rounded-2xl border text-left transition-all duration-200 min-h-[80px]",
                  selected
                    ? "border-lime bg-lime/5 shadow-[0_0_0_1px_#1E3A5F]"
                    : "border-ink-800 bg-white hover:border-ink-700 active:scale-[0.98]"
                )}
              >
                {selected && (
                  <div className="absolute top-3 right-3 size-5 rounded-full bg-lime flex items-center justify-center">
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </div>
                )}
                <div className="font-medium text-sm pr-6">{v.label}</div>
                <div className="text-xs text-ink-500 mt-1 leading-relaxed">
                  {v.description}
                </div>
              </button>
            );
          })}
        </div>
        {showError("vehicleType") && (
          <p className="text-xs text-destructive">{showError("vehicleType")}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleModel">Marca y modelo</Label>
          <Input
            id="vehicleModel"
            type="text"
            placeholder="Toyota Etios"
            value={data.vehicleModel}
            onChange={(e) => update({ vehicleModel: e.target.value })}
            onBlur={() => markTouched("vehicleModel")}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
            aria-invalid={!!showError("vehicleModel")}
          />
          {showError("vehicleModel") && (
            <p className="text-xs text-destructive">
              {showError("vehicleModel")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehiclePlate">Patente</Label>
          <Input
            id="vehiclePlate"
            type="text"
            placeholder="AB123CD"
            value={data.vehiclePlate}
            onChange={(e) =>
              update({ vehiclePlate: e.target.value.toUpperCase() })
            }
            onBlur={() => markTouched("vehiclePlate")}
            className="uppercase tracking-wider"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            enterKeyHint="next"
            aria-invalid={!!showError("vehiclePlate")}
          />
          {showError("vehiclePlate") && (
            <p className="text-xs text-destructive">
              {showError("vehiclePlate")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicleColor">
          Color <span className="text-ink-500 font-normal">(opcional)</span>
        </Label>
        <Input
          id="vehicleColor"
          type="text"
          placeholder="Blanco"
          value={data.vehicleColor}
          onChange={(e) => update({ vehicleColor: e.target.value })}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="next"
        />
      </div>

      <div className="pt-4 border-t border-ink-800">
        <p className="text-sm font-medium mb-4 text-foreground">Tus datos</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">
              <User className="size-3.5 inline mr-1.5" />
              Nombre y apellido
            </Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Juan Pérez"
              value={data.customerName}
              onChange={(e) => update({ customerName: e.target.value })}
              onBlur={() => markTouched("customerName")}
              autoComplete="name"
              autoCapitalize="words"
              enterKeyHint="next"
              aria-invalid={!!showError("customerName")}
            />
            {showError("customerName") && (
              <p className="text-xs text-destructive">
                {showError("customerName")}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerEmail">
                <Mail className="size-3.5 inline mr-1.5" />
                Email
              </Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="juan@email.com"
                value={data.customerEmail}
                onChange={(e) => update({ customerEmail: e.target.value })}
                onBlur={() => markTouched("customerEmail")}
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                inputMode="email"
                enterKeyHint="next"
                aria-invalid={!!showError("customerEmail")}
              />
              {showError("customerEmail") && (
                <p className="text-xs text-destructive">
                  {showError("customerEmail")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">
                <Phone className="size-3.5 inline mr-1.5" />
                WhatsApp
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="+54 9 341 1234567"
                value={data.customerPhone}
                onChange={(e) => update({ customerPhone: e.target.value })}
                onBlur={() => markTouched("customerPhone")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && onAdvance) {
                    const allValid =
                      Object.keys(errors).length === 0 ||
                      (!errors.customerPhone &&
                        !errors.customerEmail &&
                        !errors.customerName &&
                        !errors.vehicleModel &&
                        !errors.vehiclePlate &&
                        !errors.vehicleType);
                    if (allValid) {
                      e.preventDefault();
                      onAdvance();
                    }
                  }
                }}
                autoComplete="tel"
                inputMode="tel"
                enterKeyHint="done"
                aria-invalid={!!showError("customerPhone")}
              />
              {showError("customerPhone") && (
                <p className="text-xs text-destructive">
                  {showError("customerPhone")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
