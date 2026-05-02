"use client";

import { useState, useTransition } from "react";
import {
  Loader2,
  Save,
  DollarSign,
  Truck,
  Car,
  Warehouse,
  Building2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/server/actions/settings";

interface Settings {
  pricePerDay: number; // centavos
  multiplierChico: number;
  multiplierMedio: number;
  multiplierSuv: number;
  cocheraAddress: string;
  cocheraHours: string;
  whatsappNumber: string;
  contactEmail: string;
  companyName: string;
  companyCuit: string;
}

interface Props {
  initial: Settings;
}

export function SettingsForm({ initial }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateSettings(formData);
      if (!result.ok) {
        setError(result.error || "Error");
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Precios */}
      <Section icon={DollarSign} title="Precios">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricePerDayPesos">Precio por día (pesos)</Label>
            <Input
              id="pricePerDayPesos"
              name="pricePerDayPesos"
              type="number"
              inputMode="numeric"
              min="0"
              step="100"
              defaultValue={Math.round(initial.pricePerDay / 100)}
              required
            />
            <p className="text-xs text-ink-500">
              Costo base por día de estadía en cochera.
            </p>
          </div>
        </div>
      </Section>

      {/* Multiplicadores */}
      <Section icon={Car} title="Recargos por tipo de vehículo">
        <p className="text-xs text-ink-500 -mt-2 mb-2">
          100 = sin recargo. 120 = +20% sobre el precio base. Máximo 300
          (+200%).
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="multiplierChico">Chico</Label>
            <Input
              id="multiplierChico"
              name="multiplierChico"
              type="number"
              inputMode="numeric"
              min="50"
              max="300"
              defaultValue={initial.multiplierChico}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiplierMedio">Mediano</Label>
            <Input
              id="multiplierMedio"
              name="multiplierMedio"
              type="number"
              inputMode="numeric"
              min="50"
              max="300"
              defaultValue={initial.multiplierMedio}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiplierSuv">SUV / Camioneta</Label>
            <Input
              id="multiplierSuv"
              name="multiplierSuv"
              type="number"
              inputMode="numeric"
              min="50"
              max="300"
              defaultValue={initial.multiplierSuv}
              required
            />
          </div>
        </div>
      </Section>

      {/* Cochera */}
      <Section icon={Warehouse} title="Datos de la cochera">
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-3 flex gap-2.5 -mt-1">
          <Info className="size-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-ink-500 leading-relaxed">
            Esta información aparece en los emails de confirmación, mensajes
            de WhatsApp y en la página de confirmación que ve el cliente.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cocheraAddress">Dirección de la cochera</Label>
          <textarea
            id="cocheraAddress"
            name="cocheraAddress"
            rows={2}
            defaultValue={initial.cocheraAddress}
            placeholder="Ej: Av. Jorge Newbery 8500, Rosario"
            required
            maxLength={200}
            className="flex w-full rounded-xl border border-ink-800 bg-background px-3 py-2 text-base sm:text-sm shadow-soft-sm placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40 focus-visible:border-lime transition-colors resize-none"
          />
          <p className="text-xs text-ink-500">
            Dirección completa con calle, altura y referencia si hace falta.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cocheraHours">Horarios de atención</Label>
          <Input
            id="cocheraHours"
            name="cocheraHours"
            type="text"
            defaultValue={initial.cocheraHours}
            placeholder="24/7"
            required
            maxLength={80}
          />
          <p className="text-xs text-ink-500">
            Ej: &ldquo;24/7&rdquo;, &ldquo;Lunes a domingo de 6 a 23 hs&rdquo;.
          </p>
        </div>
      </Section>

      {/* Contacto */}
      <Section icon={Truck} title="Contacto y notificaciones">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">
              WhatsApp para contacto del cliente
            </Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              inputMode="tel"
              defaultValue={initial.whatsappNumber}
              placeholder="+5493411234567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              Email para recibir nuevas reservas
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              inputMode="email"
              defaultValue={initial.contactEmail}
              placeholder="hola@parkaway.com.ar"
              required
            />
          </div>
        </div>
      </Section>

      {/* Empresa */}
      <Section icon={Building2} title="Datos de la empresa">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nombre comercial</Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              defaultValue={initial.companyName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCuit">CUIT (opcional)</Label>
            <Input
              id="companyCuit"
              name="companyCuit"
              type="text"
              inputMode="numeric"
              defaultValue={initial.companyCuit}
              placeholder="20-12345678-9"
              maxLength={20}
            />
          </div>
        </div>
      </Section>

      {/* Submit */}
      <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-4 bg-ink-950/95 backdrop-blur border-t border-ink-800 sm:border-t-0 sm:bg-transparent sm:backdrop-blur-none flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
        <div className="flex-1">
          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-lime/30 bg-lime/10 p-3 text-sm text-lime">
              Configuración guardada
            </div>
          )}
        </div>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-ink-800 bg-white p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 text-lime" />
        {title}
      </div>
      {children}
    </div>
  );
}
