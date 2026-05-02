"use client";

import { useEffect, useState } from "react";
import { MapPin, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addressSchema } from "@/lib/validations/reservation";
import type { BookingFormData } from "@/lib/validations/reservation";

interface Props {
  data: BookingFormData;
  update: (patch: Partial<BookingFormData>) => void;
  setValid: (valid: boolean) => void;
  onAdvance?: () => void;
}

const NEIGHBORHOODS = [
  "Centro",
  "Pichincha",
  "Echesortu",
  "Fisherton",
  "Funes",
  "Roldan",
  "Alberdi",
  "Lourdes",
  "Las Delicias",
  "Hipodromo",
  "Belgrano",
  "Tablada",
  "Republica de la Sexta",
  "Granadero Baigorria",
  "Otra",
];

export function StepAddress({ data, update, setValid, onAdvance }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const result = addressSchema.safeParse({
      pickupAddress: data.pickupAddress,
      pickupNeighborhood: data.pickupNeighborhood,
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
  }, [data.pickupAddress, data.pickupNeighborhood, setValid]);

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const showError = (field: string) =>
    touched[field] && errors[field] ? errors[field] : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-1">¿Dónde te buscamos?</h3>
        <p className="text-sm text-ink-500">
          La dirección donde retiramos tu auto el día del viaje.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupNeighborhood">
          <MapPin className="size-3.5 inline mr-1.5" />
          Barrio o localidad
        </Label>
        <Select
          value={data.pickupNeighborhood}
          onValueChange={(v) => {
            update({ pickupNeighborhood: v });
            markTouched("pickupNeighborhood");
          }}
        >
          <SelectTrigger id="pickupNeighborhood">
            <SelectValue placeholder="Elegí tu barrio" />
          </SelectTrigger>
          <SelectContent>
            {NEIGHBORHOODS.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showError("pickupNeighborhood") && (
          <p className="text-xs text-destructive">
            {showError("pickupNeighborhood")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupAddress">
          <Home className="size-3.5 inline mr-1.5" />
          Dirección completa
        </Label>
        <Input
          id="pickupAddress"
          type="text"
          placeholder="Mendoza 1234, depto 5B"
          value={data.pickupAddress}
          onChange={(e) => update({ pickupAddress: e.target.value })}
          onBlur={() => markTouched("pickupAddress")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onAdvance && !errors.pickupAddress) {
              e.preventDefault();
              onAdvance();
            }
          }}
          autoComplete="street-address"
          autoCapitalize="words"
          enterKeyHint="next"
          aria-invalid={!!showError("pickupAddress")}
          aria-describedby={
            showError("pickupAddress") ? "pickupAddress-error" : undefined
          }
        />
        {showError("pickupAddress") && (
          <p id="pickupAddress-error" className="text-xs text-destructive">
            {showError("pickupAddress")}
          </p>
        )}
        <p className="text-xs text-ink-500">
          Calle, altura y referencias (depto, casa, portón).
        </p>
      </div>

      <div className="text-xs text-ink-500 leading-relaxed bg-muted border border-ink-800 rounded-2xl p-4">
        Cubrimos un radio de 20 km del aeropuerto. Si tu zona no está en la
        lista, elegí &quot;Otra&quot; y te confirmamos por WhatsApp antes de cobrar.
      </div>
    </div>
  );
}
