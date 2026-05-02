"use client";

import { useState, useTransition } from "react";
import { Loader2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { blockDate } from "@/server/actions/blocked-dates";

export function BlockForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await blockDate(formData);
      if (!result.ok) {
        setError(result.error || "Error");
        return;
      }
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-ink-800 bg-white p-6 space-y-4"
    >
      <h3 className="text-sm font-medium">Bloquear una fecha</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            name="date"
            type="date"
            min={today}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Motivo (opcional)</Label>
          <Input
            id="reason"
            name="reason"
            type="text"
            placeholder="Ej: Cochera ocupada"
            maxLength={200}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-lime/30 bg-lime/10 p-3 text-sm text-lime">
          Fecha bloqueada correctamente
        </div>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Bloqueando...
          </>
        ) : (
          <>
            <CalendarPlus />
            Bloquear fecha
          </>
        )}
      </Button>
    </form>
  );
}
