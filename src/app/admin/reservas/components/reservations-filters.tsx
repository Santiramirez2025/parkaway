"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING_PAYMENT", label: "Esperando pago" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "PICKED_UP", label: "Auto recibido" },
  { value: "IN_PARKING", label: "En cochera" },
  { value: "RETURNING", label: "Listo para retirar" },
  { value: "COMPLETED", label: "Entregadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

export function ReservationsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const status = searchParams.get("status") || "ALL";

  const updateParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    params.delete("page"); // resetear paginacion al filtrar
    startTransition(() => {
      router.push(`/admin/reservas?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search });
  };

  const clearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/admin/reservas");
    });
  };

  const hasFilters =
    searchParams.get("search") || (status && status !== "ALL");

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
      <form onSubmit={handleSearch} className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ink-500 pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar por codigo, nombre, email o patente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11"
        />
      </form>

      <div className="w-full sm:w-56">
        <Select
          value={status}
          onValueChange={(v) => updateParams({ status: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          disabled={isPending}
          size="md"
        >
          <X className="size-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
